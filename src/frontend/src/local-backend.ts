import { idbGet, idbSet, migrateFromLocalStorage } from "./lib/idb";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  Customer,
  DashboardStats,
  FabricInventory,
  GarmentType,
  Invoice,
  Measurements,
  Order,
  OrderStatus,
  PaymentStatus,
  Staff,
  StaffRole,
  TailorBackend,
} from "./tailor-types";

const KEYS = {
  customers: "tailorpro_customers",
  orders: "tailorpro_orders",
  appointments: "tailorpro_appointments",
  inventory: "tailorpro_inventory",
  invoices: "tailorpro_invoices",
  staff: "tailorpro_staff",
  nextCustomerId: "tailorpro_nextCustomerId",
  nextOrderId: "tailorpro_nextOrderId",
  nextAppointmentId: "tailorpro_nextAppointmentId",
  nextInventoryId: "tailorpro_nextInventoryId",
  nextInvoiceId: "tailorpro_nextInvoiceId",
  nextStaffId: "tailorpro_nextStaffId",
  seeded: "tailorpro_seeded",
};

const BIGINT_FIELDS = new Set([
  "id",
  "customerId",
  "orderId",
  "createdAt",
  "dateTime",
  "dueDate",
  "deliveryDate",
  "quantity",
  "joinDate",
]);

function serialize(data: unknown): string {
  return JSON.stringify(data, (_key, value) =>
    typeof value === "bigint" ? `${value.toString()}n` : value,
  );
}

function deserialize<T>(json: string): T {
  return JSON.parse(json, (key, value) => {
    if (
      typeof value === "string" &&
      value.endsWith("n") &&
      /^\d+n$/.test(value) &&
      BIGINT_FIELDS.has(key)
    ) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  }) as T;
}

async function load<T>(key: string): Promise<T[]> {
  const raw = await idbGet("kv", key);
  if (!raw) return [];
  return deserialize<T[]>(raw as string);
}

async function save(key: string, data: unknown): Promise<void> {
  await idbSet("kv", key, serialize(data));
}

async function nextId(key: string): Promise<bigint> {
  const raw = await idbGet("kv", key);
  const current = typeof raw === "string" ? BigInt(raw) : 1n;
  await idbSet("kv", key, String(current + 1n));
  return current;
}

const now = (): bigint => BigInt(Date.now()) * 1_000_000n;

const dateOffset = (days: number): bigint =>
  BigInt(Date.now() + days * 86400000) * 1_000_000n;

function makeStaffId(num: bigint): string {
  const n = Number(num);
  if (n < 10) return `TP-00${n}`;
  if (n < 100) return `TP-0${n}`;
  return `TP-${n}`;
}

class LocalBackend implements TailorBackend {
  async seedData(): Promise<void> {
    // 1. Migrate any existing localStorage data to IDB
    await migrateFromLocalStorage(Object.values(KEYS));

    // 2. Check if already seeded
    if (await idbGet("kv", KEYS.seeded)) return;

    // 3. Initialize ID counters
    await idbSet("kv", KEYS.nextCustomerId, "1");
    await idbSet("kv", KEYS.nextOrderId, "1");
    await idbSet("kv", KEYS.nextAppointmentId, "1");
    await idbSet("kv", KEYS.nextInventoryId, "1");
    await idbSet("kv", KEYS.nextInvoiceId, "1");
    await idbSet("kv", KEYS.nextStaffId, "1");

    // 4. Seed customers
    type CustomerSeed = {
      name: string;
      phone: string;
      email: string;
      address: string;
      measurements: [] | [Measurements];
    };
    const customerData: CustomerSeed[] = [
      {
        name: "Rahul Sharma",
        phone: "9876543210",
        email: "rahul@example.com",
        address: "12, MG Road, Mumbai",
        measurements: [
          {
            chest: 40,
            waist: 34,
            hip: 38,
            shoulder: 17,
            sleeveLength: 25,
            shirtLength: 30,
            trouserLength: 42,
            neck: 15,
          },
        ],
      },
      {
        name: "Priya Patel",
        phone: "9845123456",
        email: "priya@example.com",
        address: "45, Park Street, Delhi",
        measurements: [
          {
            chest: 34,
            waist: 28,
            hip: 36,
            shoulder: 14,
            sleeveLength: 22,
            shirtLength: 26,
            trouserLength: 38,
            neck: 13,
          },
        ],
      },
      {
        name: "Amit Verma",
        phone: "9812345678",
        email: "amit@example.com",
        address: "7, Civil Lines, Jaipur",
        measurements: [
          {
            chest: 42,
            waist: 36,
            hip: 40,
            shoulder: 18,
            sleeveLength: 26,
            shirtLength: 31,
            trouserLength: 44,
            neck: 16,
          },
        ],
      },
      {
        name: "Sunita Rao",
        phone: "9900112233",
        email: "sunita@example.com",
        address: "23, Brigade Road, Bangalore",
        measurements: [],
      },
      {
        name: "Vikram Singh",
        phone: "9711223344",
        email: "vikram@example.com",
        address: "56, Sector 21, Chandigarh",
        measurements: [
          {
            chest: 44,
            waist: 38,
            hip: 42,
            shoulder: 19,
            sleeveLength: 27,
            shirtLength: 32,
            trouserLength: 46,
            neck: 17,
          },
        ],
      },
    ];

    const customers: Customer[] = [];
    for (const d of customerData) {
      customers.push({
        id: await nextId(KEYS.nextCustomerId),
        ...d,
        createdAt: now(),
      });
    }
    await save(KEYS.customers, customers);

    const c = customers;
    const garments: GarmentType[] = [
      { Shirt: null },
      { Trouser: null },
      { Suit: null },
      { Kurti: null },
      { Blouse: null },
    ];
    const statuses: OrderStatus[] = [
      { Pending: null },
      { InProduction: null },
      { Ready: null },
      { Delivered: null },
      { InProduction: null },
    ];

    // Pre-generate order IDs sequentially
    const oIds: bigint[] = [];
    for (let i = 0; i < 10; i++) oIds.push(await nextId(KEYS.nextOrderId));

    const orders: Order[] = [
      {
        id: oIds[0],
        customerId: c[0].id,
        customerName: c[0].name,
        garmentType: garments[2],
        fabricName: "Italian Wool",
        fabricColor: "Navy Blue",
        quantity: 1n,
        price: 8500,
        advancePaid: 3000,
        dueDate: dateOffset(14),
        deliveryDate: [],
        status: statuses[1],
        notes: "Double-breasted, peak lapels",
        createdAt: now(),
      },
      {
        id: oIds[1],
        customerId: c[1].id,
        customerName: c[1].name,
        garmentType: garments[3],
        fabricName: "Cotton Silk",
        fabricColor: "Rose Pink",
        quantity: 2n,
        price: 2400,
        advancePaid: 1000,
        dueDate: dateOffset(7),
        deliveryDate: [],
        status: statuses[0],
        notes: "Embroidery on collar",
        createdAt: now(),
      },
      {
        id: oIds[2],
        customerId: c[2].id,
        customerName: c[2].name,
        garmentType: garments[0],
        fabricName: "Linen",
        fabricColor: "White",
        quantity: 3n,
        price: 3600,
        advancePaid: 1500,
        dueDate: dateOffset(10),
        deliveryDate: [],
        status: statuses[2],
        notes: "French cuffs",
        createdAt: now(),
      },
      {
        id: oIds[3],
        customerId: c[0].id,
        customerName: c[0].name,
        garmentType: garments[1],
        fabricName: "Worsted Wool",
        fabricColor: "Charcoal",
        quantity: 2n,
        price: 4000,
        advancePaid: 2000,
        dueDate: dateOffset(-2),
        deliveryDate: [dateOffset(-1)],
        status: statuses[3],
        notes: "",
        createdAt: now(),
      },
      {
        id: oIds[4],
        customerId: c[3].id,
        customerName: c[3].name,
        garmentType: garments[4],
        fabricName: "Chiffon",
        fabricColor: "Cream",
        quantity: 1n,
        price: 1800,
        advancePaid: 800,
        dueDate: dateOffset(5),
        deliveryDate: [],
        status: statuses[0],
        notes: "Boat neck style",
        createdAt: now(),
      },
      {
        id: oIds[5],
        customerId: c[4].id,
        customerName: c[4].name,
        garmentType: garments[2],
        fabricName: "Cashmere Blend",
        fabricColor: "Slate Grey",
        quantity: 1n,
        price: 12000,
        advancePaid: 5000,
        dueDate: dateOffset(21),
        deliveryDate: [],
        status: statuses[1],
        notes: "Three-piece, single button",
        createdAt: now(),
      },
      {
        id: oIds[6],
        customerId: c[1].id,
        customerName: c[1].name,
        garmentType: garments[4],
        fabricName: "Banarasi Silk",
        fabricColor: "Maroon",
        quantity: 1n,
        price: 3500,
        advancePaid: 1500,
        dueDate: dateOffset(12),
        deliveryDate: [],
        status: statuses[4],
        notes: "Zari border work",
        createdAt: now(),
      },
      {
        id: oIds[7],
        customerId: c[2].id,
        customerName: c[2].name,
        garmentType: garments[1],
        fabricName: "Cotton",
        fabricColor: "Khaki",
        quantity: 4n,
        price: 4800,
        advancePaid: 2400,
        dueDate: dateOffset(3),
        deliveryDate: [],
        status: statuses[2],
        notes: "Cargo pockets",
        createdAt: now(),
      },
      {
        id: oIds[8],
        customerId: c[3].id,
        customerName: c[3].name,
        garmentType: garments[3],
        fabricName: "Georgette",
        fabricColor: "Teal",
        quantity: 2n,
        price: 2800,
        advancePaid: 1200,
        dueDate: dateOffset(8),
        deliveryDate: [],
        status: statuses[0],
        notes: "",
        createdAt: now(),
      },
      {
        id: oIds[9],
        customerId: c[4].id,
        customerName: c[4].name,
        garmentType: garments[0],
        fabricName: "Oxford Cotton",
        fabricColor: "Sky Blue",
        quantity: 2n,
        price: 2400,
        advancePaid: 1000,
        dueDate: dateOffset(6),
        deliveryDate: [],
        status: statuses[1],
        notes: "Mandarin collar",
        createdAt: now(),
      },
    ];
    await save(KEYS.orders, orders);

    // Pre-generate appointment IDs
    const aIds: bigint[] = [];
    for (let i = 0; i < 5; i++) aIds.push(await nextId(KEYS.nextAppointmentId));

    const appointments: Appointment[] = [
      {
        id: aIds[0],
        customerId: c[0].id,
        customerName: c[0].name,
        dateTime: dateOffset(1),
        appointmentType: { Fitting: null },
        status: { Scheduled: null },
        notes: "Suit fitting session",
      },
      {
        id: aIds[1],
        customerId: c[1].id,
        customerName: c[1].name,
        dateTime: dateOffset(0),
        appointmentType: { Measurement: null },
        status: { Scheduled: null },
        notes: "New order measurements",
      },
      {
        id: aIds[2],
        customerId: c[2].id,
        customerName: c[2].name,
        dateTime: dateOffset(-1),
        appointmentType: { Delivery: null },
        status: { Completed: null },
        notes: "Order delivery",
      },
      {
        id: aIds[3],
        customerId: c[3].id,
        customerName: c[3].name,
        dateTime: dateOffset(2),
        appointmentType: { Consultation: null },
        status: { Scheduled: null },
        notes: "Wedding outfit consultation",
      },
      {
        id: aIds[4],
        customerId: c[4].id,
        customerName: c[4].name,
        dateTime: dateOffset(3),
        appointmentType: { Fitting: null },
        status: { Scheduled: null },
        notes: "Final fitting for suit",
      },
    ];
    await save(KEYS.appointments, appointments);

    type InventorySeed = {
      fabricName: string;
      color: string;
      quantityMeters: number;
      pricePerMeter: number;
      supplier: string;
      reorderLevel: number;
    };
    const inventoryData: InventorySeed[] = [
      {
        fabricName: "Italian Wool",
        color: "Navy Blue",
        quantityMeters: 45,
        pricePerMeter: 850,
        supplier: "Milano Fabrics",
        reorderLevel: 10,
      },
      {
        fabricName: "Banarasi Silk",
        color: "Maroon",
        quantityMeters: 30,
        pricePerMeter: 1200,
        supplier: "Varanasi Silk House",
        reorderLevel: 8,
      },
      {
        fabricName: "Cotton Linen",
        color: "Off White",
        quantityMeters: 120,
        pricePerMeter: 180,
        supplier: "Gujarat Textiles",
        reorderLevel: 25,
      },
      {
        fabricName: "Georgette",
        color: "Teal",
        quantityMeters: 18,
        pricePerMeter: 350,
        supplier: "Surat Fabric Co.",
        reorderLevel: 15,
      },
      {
        fabricName: "Cashmere Blend",
        color: "Charcoal Grey",
        quantityMeters: 8,
        pricePerMeter: 2200,
        supplier: "Kashmir Weavers",
        reorderLevel: 5,
      },
    ];
    const inventory: FabricInventory[] = [];
    for (const d of inventoryData) {
      inventory.push({ id: await nextId(KEYS.nextInventoryId), ...d });
    }
    await save(KEYS.inventory, inventory);

    // Pre-generate invoice IDs
    const invId1 = await nextId(KEYS.nextInvoiceId);
    const invId2 = await nextId(KEYS.nextInvoiceId);

    const invoices: Invoice[] = [
      {
        id: invId1,
        orderId: orders[0].id,
        customerId: c[0].id,
        customerName: c[0].name,
        subtotal: 8500,
        discount: 500,
        tax: 480,
        total: 8480,
        paymentStatus: { PartiallyPaid: null },
        paymentMethod: "UPI",
        createdAt: now(),
      },
      {
        id: invId2,
        orderId: orders[3].id,
        customerId: c[0].id,
        customerName: c[0].name,
        subtotal: 4000,
        discount: 0,
        tax: 200,
        total: 4200,
        paymentStatus: { Paid: null },
        paymentMethod: "Cash",
        createdAt: now(),
      },
    ];
    await save(KEYS.invoices, invoices);

    // Seed staff
    type StaffSeed = {
      staffId: string;
      name: string;
      role: StaffRole;
      phone: string;
      email: string;
      department: string;
      joinDate: bigint;
      address: string;
    };
    const staffData: StaffSeed[] = [
      {
        staffId: "TP-001",
        name: "Mohammed Irfan",
        role: { Tailor: null },
        phone: "9876500001",
        email: "irfan@tailorpro.com",
        department: "Tailoring",
        joinDate: dateOffset(-365),
        address: "10 Main Street, Pune",
      },
      {
        staffId: "TP-002",
        name: "Ramesh Kumar",
        role: { Cutter: null },
        phone: "9876500002",
        email: "ramesh@tailorpro.com",
        department: "Cutting",
        joinDate: dateOffset(-200),
        address: "22 Park Ave, Pune",
      },
      {
        staffId: "TP-003",
        name: "Anita Desai",
        role: { Receptionist: null },
        phone: "9876500003",
        email: "anita@tailorpro.com",
        department: "Front Office",
        joinDate: dateOffset(-100),
        address: "5 Garden Road, Pune",
      },
      {
        staffId: "TP-004",
        name: "Suresh Nair",
        role: { Manager: null },
        phone: "9876500004",
        email: "suresh@tailorpro.com",
        department: "Management",
        joinDate: dateOffset(-500),
        address: "8 Lake View, Pune",
      },
    ];
    const staffSeed: Staff[] = [];
    for (const d of staffData) {
      const id = await nextId(KEYS.nextStaffId);
      staffSeed.push({
        id,
        ...d,
        createdAt: now(),
      });
    }
    await save(KEYS.staff, staffSeed);

    // 5. Mark as seeded
    await idbSet("kv", KEYS.seeded, "1");
  }

  async getCustomers(): Promise<Customer[]> {
    return load<Customer>(KEYS.customers);
  }

  async addCustomer(
    name: string,
    phone: string,
    email: string,
    address: string,
    measurements: [] | [Measurements],
  ): Promise<Customer> {
    const customers = await load<Customer>(KEYS.customers);
    const customer: Customer = {
      id: await nextId(KEYS.nextCustomerId),
      name,
      phone,
      email,
      address,
      measurements,
      createdAt: now(),
    };
    customers.push(customer);
    await save(KEYS.customers, customers);
    return customer;
  }

  async updateCustomer(
    id: bigint,
    name: string,
    phone: string,
    email: string,
    address: string,
    measurements: [] | [Measurements],
  ): Promise<boolean> {
    const customers = await load<Customer>(KEYS.customers);
    const idx = customers.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) return false;
    customers[idx] = {
      ...customers[idx],
      name,
      phone,
      email,
      address,
      measurements,
    };
    await save(KEYS.customers, customers);
    return true;
  }

  async deleteCustomer(id: bigint): Promise<boolean> {
    const customers = await load<Customer>(KEYS.customers);
    const filtered = customers.filter((c) => c.id !== id);
    if (filtered.length === customers.length) return false;
    await save(KEYS.customers, filtered);
    return true;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [customers, orders, appointments] = await Promise.all([
      load<Customer>(KEYS.customers),
      load<Order>(KEYS.orders),
      load<Appointment>(KEYS.appointments),
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todayStartNs = BigInt(todayStart.getTime()) * 1_000_000n;
    const todayEndNs = BigInt(todayEnd.getTime()) * 1_000_000n;

    const todayAppts = appointments.filter(
      (a) => a.dateTime >= todayStartNs && a.dateTime <= todayEndNs,
    );

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartNs = BigInt(monthStart.getTime()) * 1_000_000n;

    const monthlyRevenue = orders
      .filter((o) => o.createdAt >= monthStartNs && "Delivered" in o.status)
      .reduce((sum, o) => sum + o.price, 0);

    return {
      totalCustomers: BigInt(customers.length),
      totalOrders: BigInt(orders.length),
      pendingOrders: BigInt(orders.filter((o) => "Pending" in o.status).length),
      inProductionOrders: BigInt(
        orders.filter((o) => "InProduction" in o.status).length,
      ),
      readyOrders: BigInt(orders.filter((o) => "Ready" in o.status).length),
      deliveredOrders: BigInt(
        orders.filter((o) => "Delivered" in o.status).length,
      ),
      monthlyRevenue,
      todayAppointments: BigInt(todayAppts.length),
    };
  }

  async getOrders(): Promise<Order[]> {
    return load<Order>(KEYS.orders);
  }

  async getOrdersByCustomer(customerId: bigint): Promise<Order[]> {
    const orders = await load<Order>(KEYS.orders);
    return orders.filter((o) => String(o.customerId) === String(customerId));
  }

  async addOrder(
    customerId: bigint,
    customerName: string,
    garmentType: GarmentType,
    fabricName: string,
    fabricColor: string,
    quantity: bigint,
    price: number,
    advancePaid: number,
    dueDate: bigint,
    notes: string,
  ): Promise<Order> {
    const orders = await load<Order>(KEYS.orders);
    const order: Order = {
      id: await nextId(KEYS.nextOrderId),
      customerId,
      customerName,
      garmentType,
      fabricName,
      fabricColor,
      quantity,
      price,
      advancePaid,
      dueDate,
      deliveryDate: [],
      status: { Pending: null },
      notes,
      createdAt: now(),
    };
    orders.push(order);
    await save(KEYS.orders, orders);
    return order;
  }

  async updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean> {
    const orders = await load<Order>(KEYS.orders);
    const idx = orders.findIndex((o) => String(o.id) === String(id));
    if (idx === -1) return false;
    orders[idx] = { ...orders[idx], status };
    if ("Delivered" in status) {
      orders[idx].deliveryDate = [now()];
    }
    await save(KEYS.orders, orders);
    return true;
  }

  async deleteOrder(id: bigint): Promise<boolean> {
    const orders = await load<Order>(KEYS.orders);
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length === orders.length) return false;
    await save(KEYS.orders, filtered);
    return true;
  }

  async getAppointments(): Promise<Appointment[]> {
    return load<Appointment>(KEYS.appointments);
  }

  async addAppointment(
    customerId: bigint,
    customerName: string,
    dateTime: bigint,
    appointmentType: AppointmentType,
    notes: string,
  ): Promise<Appointment> {
    const appointments = await load<Appointment>(KEYS.appointments);
    const appointment: Appointment = {
      id: await nextId(KEYS.nextAppointmentId),
      customerId,
      customerName,
      dateTime,
      appointmentType,
      status: { Scheduled: null },
      notes,
    };
    appointments.push(appointment);
    await save(KEYS.appointments, appointments);
    return appointment;
  }

  async updateAppointmentStatus(
    id: bigint,
    status: AppointmentStatus,
  ): Promise<boolean> {
    const appointments = await load<Appointment>(KEYS.appointments);
    const idx = appointments.findIndex((a) => String(a.id) === String(id));
    if (idx === -1) return false;
    appointments[idx] = { ...appointments[idx], status };
    await save(KEYS.appointments, appointments);
    return true;
  }

  async deleteAppointment(id: bigint): Promise<boolean> {
    const appointments = await load<Appointment>(KEYS.appointments);
    const filtered = appointments.filter((a) => a.id !== id);
    if (filtered.length === appointments.length) return false;
    await save(KEYS.appointments, filtered);
    return true;
  }

  async getInventory(): Promise<FabricInventory[]> {
    return load<FabricInventory>(KEYS.inventory);
  }

  async addInventoryItem(
    fabricName: string,
    color: string,
    quantityMeters: number,
    pricePerMeter: number,
    supplier: string,
    reorderLevel: number,
  ): Promise<FabricInventory> {
    const inventory = await load<FabricInventory>(KEYS.inventory);
    const item: FabricInventory = {
      id: await nextId(KEYS.nextInventoryId),
      fabricName,
      color,
      quantityMeters,
      pricePerMeter,
      supplier,
      reorderLevel,
    };
    inventory.push(item);
    await save(KEYS.inventory, inventory);
    return item;
  }

  async updateInventoryItem(
    id: bigint,
    fabricName: string,
    color: string,
    quantityMeters: number,
    pricePerMeter: number,
    supplier: string,
    reorderLevel: number,
  ): Promise<boolean> {
    const inventory = await load<FabricInventory>(KEYS.inventory);
    const idx = inventory.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return false;
    inventory[idx] = {
      ...inventory[idx],
      fabricName,
      color,
      quantityMeters,
      pricePerMeter,
      supplier,
      reorderLevel,
    };
    await save(KEYS.inventory, inventory);
    return true;
  }

  async deleteInventoryItem(id: bigint): Promise<boolean> {
    const inventory = await load<FabricInventory>(KEYS.inventory);
    const filtered = inventory.filter((i) => i.id !== id);
    if (filtered.length === inventory.length) return false;
    await save(KEYS.inventory, filtered);
    return true;
  }

  async getInvoices(): Promise<Invoice[]> {
    return load<Invoice>(KEYS.invoices);
  }

  async createInvoice(
    orderId: bigint,
    customerId: bigint,
    customerName: string,
    subtotal: number,
    discount: number,
    tax: number,
    total: number,
    paymentMethod: string,
  ): Promise<Invoice> {
    const invoices = await load<Invoice>(KEYS.invoices);
    const invoice: Invoice = {
      id: await nextId(KEYS.nextInvoiceId),
      orderId,
      customerId,
      customerName,
      subtotal,
      discount,
      tax,
      total,
      paymentStatus: { Unpaid: null },
      paymentMethod,
      createdAt: now(),
    };
    invoices.push(invoice);
    await save(KEYS.invoices, invoices);
    return invoice;
  }

  async updateInvoicePayment(
    id: bigint,
    paymentStatus: PaymentStatus,
  ): Promise<boolean> {
    const invoices = await load<Invoice>(KEYS.invoices);
    const idx = invoices.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return false;
    invoices[idx] = { ...invoices[idx], paymentStatus };
    await save(KEYS.invoices, invoices);
    return true;
  }

  async getStaff(): Promise<Staff[]> {
    return load<Staff>(KEYS.staff);
  }

  async addStaff(
    name: string,
    role: StaffRole,
    phone: string,
    email: string,
    department: string,
    joinDate: bigint,
    address: string,
  ): Promise<Staff> {
    const staffList = await load<Staff>(KEYS.staff);
    const id = await nextId(KEYS.nextStaffId);
    const staffId = makeStaffId(id);
    const member: Staff = {
      id,
      staffId,
      name,
      role,
      phone,
      email,
      department,
      joinDate,
      address,
      createdAt: now(),
    };
    staffList.push(member);
    await save(KEYS.staff, staffList);
    return member;
  }

  async updateStaff(
    id: bigint,
    name: string,
    role: StaffRole,
    phone: string,
    email: string,
    department: string,
    joinDate: bigint,
    address: string,
  ): Promise<boolean> {
    const staffList = await load<Staff>(KEYS.staff);
    const idx = staffList.findIndex((s) => String(s.id) === String(id));
    if (idx === -1) return false;
    staffList[idx] = {
      ...staffList[idx],
      name,
      role,
      phone,
      email,
      department,
      joinDate,
      address,
    };
    await save(KEYS.staff, staffList);
    return true;
  }

  async deleteStaff(id: bigint): Promise<boolean> {
    const staffList = await load<Staff>(KEYS.staff);
    const filtered = staffList.filter((s) => s.id !== id);
    if (filtered.length === staffList.length) return false;
    await save(KEYS.staff, filtered);
    return true;
  }

  // Cloud credential stubs (use localStorage as fallback for local dev)
  async setStaffPassword(phone: string, password: string): Promise<boolean> {
    localStorage.setItem(`tailorpro_pw_${phone}`, password);
    return true;
  }
  async verifyStaffPassword(phone: string, password: string): Promise<boolean> {
    const stored = localStorage.getItem(`tailorpro_pw_${phone}`);
    if (stored === null) return true; // first-time login
    return stored === password;
  }
  async hasStaffPassword(phone: string): Promise<boolean> {
    return localStorage.getItem(`tailorpro_pw_${phone}`) !== null;
  }
  async deleteStaffCredentials(phone: string): Promise<void> {
    localStorage.removeItem(`tailorpro_pw_${phone}`);
  }
  async getOwnerPassword(): Promise<string> {
    return localStorage.getItem("tailorpro_owner_pw") ?? "owner@123";
  }
  async setOwnerPassword(newPassword: string): Promise<boolean> {
    localStorage.setItem("tailorpro_owner_pw", newPassword);
    return true;
  }

  // Garment photo management (local IDB fallback)
  async addCustomerPhoto(customerId: bigint, hash: string): Promise<boolean> {
    const key = `garment_photos_${customerId}`;
    const stored = await idbGet("photos", key);
    const existing: string[] = Array.isArray(stored)
      ? (stored as string[])
      : [];
    if (!existing.includes(hash)) {
      existing.push(hash);
      await idbSet("photos", key, existing);
    }
    return true;
  }
  async getCustomerPhotos(customerId: bigint): Promise<string[]> {
    const key = `garment_photos_${customerId}`;
    const stored = await idbGet("photos", key);
    return Array.isArray(stored) ? (stored as string[]) : [];
  }
  async deleteCustomerPhoto(
    customerId: bigint,
    hash: string,
  ): Promise<boolean> {
    const key = `garment_photos_${customerId}`;
    const stored = await idbGet("photos", key);
    const existing: string[] = Array.isArray(stored)
      ? (stored as string[])
      : [];
    const updated = existing.filter((h) => h !== hash);
    await idbSet("photos", key, updated);
    return true;
  }
}

export const localBackend = new LocalBackend();
