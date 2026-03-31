export interface Measurements {
  chest: number;
  waist: number;
  hip: number;
  shoulder: number;
  sleeveLength: number;
  shirtLength: number;
  trouserLength: number;
  neck: number;
}

export type OrderStatus =
  | { Pending: null }
  | { InProduction: null }
  | { Ready: null }
  | { Delivered: null }
  | { Cancelled: null };

export type GarmentType =
  | { Shirt: null }
  | { Trouser: null }
  | { Suit: null }
  | { Kurti: null }
  | { Blouse: null }
  | { Other: null };

export type AppointmentStatus =
  | { Scheduled: null }
  | { Completed: null }
  | { Cancelled: null };

export type AppointmentType =
  | { Measurement: null }
  | { Fitting: null }
  | { Delivery: null }
  | { Consultation: null };

export type PaymentStatus =
  | { Unpaid: null }
  | { PartiallyPaid: null }
  | { Paid: null };

export type StaffRole =
  | { Tailor: null }
  | { Cutter: null }
  | { Helper: null }
  | { Manager: null }
  | { Receptionist: null }
  | { Other: null };

export interface Customer {
  id: bigint;
  name: string;
  phone: string;
  email: string;
  address: string;
  measurements: [] | [Measurements];
  createdAt: bigint;
}

export interface Order {
  id: bigint;
  customerId: bigint;
  customerName: string;
  garmentType: GarmentType;
  fabricName: string;
  fabricColor: string;
  quantity: bigint;
  price: number;
  advancePaid: number;
  dueDate: bigint;
  deliveryDate: [] | [bigint];
  status: OrderStatus;
  notes: string;
  createdAt: bigint;
}

export interface Appointment {
  id: bigint;
  customerId: bigint;
  customerName: string;
  dateTime: bigint;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  notes: string;
}

export interface FabricInventory {
  id: bigint;
  fabricName: string;
  color: string;
  quantityMeters: number;
  pricePerMeter: number;
  supplier: string;
  reorderLevel: number;
}

export interface Invoice {
  id: bigint;
  orderId: bigint;
  customerId: bigint;
  customerName: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: bigint;
}

export interface Staff {
  id: bigint;
  staffId: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  department: string;
  joinDate: bigint;
  address: string;
  createdAt: bigint;
}

export interface DashboardStats {
  totalCustomers: bigint;
  totalOrders: bigint;
  pendingOrders: bigint;
  inProductionOrders: bigint;
  readyOrders: bigint;
  deliveredOrders: bigint;
  monthlyRevenue: number;
  todayAppointments: bigint;
}

export interface TailorBackend {
  seedData(): Promise<void>;
  getDashboardStats(): Promise<DashboardStats>;
  getCustomers(): Promise<Customer[]>;
  addCustomer(
    name: string,
    phone: string,
    email: string,
    address: string,
    measurements: [] | [Measurements],
  ): Promise<Customer>;
  updateCustomer(
    id: bigint,
    name: string,
    phone: string,
    email: string,
    address: string,
    measurements: [] | [Measurements],
  ): Promise<boolean>;
  deleteCustomer(id: bigint): Promise<boolean>;
  getOrders(): Promise<Order[]>;
  getOrdersByCustomer(customerId: bigint): Promise<Order[]>;
  addOrder(
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
  ): Promise<Order>;
  updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean>;
  deleteOrder(id: bigint): Promise<boolean>;
  getAppointments(): Promise<Appointment[]>;
  addAppointment(
    customerId: bigint,
    customerName: string,
    dateTime: bigint,
    appointmentType: AppointmentType,
    notes: string,
  ): Promise<Appointment>;
  updateAppointmentStatus(
    id: bigint,
    status: AppointmentStatus,
  ): Promise<boolean>;
  deleteAppointment(id: bigint): Promise<boolean>;
  getInventory(): Promise<FabricInventory[]>;
  addInventoryItem(
    fabricName: string,
    color: string,
    quantityMeters: number,
    pricePerMeter: number,
    supplier: string,
    reorderLevel: number,
  ): Promise<FabricInventory>;
  updateInventoryItem(
    id: bigint,
    fabricName: string,
    color: string,
    quantityMeters: number,
    pricePerMeter: number,
    supplier: string,
    reorderLevel: number,
  ): Promise<boolean>;
  deleteInventoryItem(id: bigint): Promise<boolean>;
  getInvoices(): Promise<Invoice[]>;
  createInvoice(
    orderId: bigint,
    customerId: bigint,
    customerName: string,
    subtotal: number,
    discount: number,
    tax: number,
    total: number,
    paymentMethod: string,
  ): Promise<Invoice>;
  updateInvoicePayment(
    id: bigint,
    paymentStatus: PaymentStatus,
  ): Promise<boolean>;
  getStaff(): Promise<Staff[]>;
  addStaff(
    name: string,
    role: StaffRole,
    phone: string,
    email: string,
    department: string,
    joinDate: bigint,
    address: string,
  ): Promise<Staff>;
  updateStaff(
    id: bigint,
    name: string,
    role: StaffRole,
    phone: string,
    email: string,
    department: string,
    joinDate: bigint,
    address: string,
  ): Promise<boolean>;
  deleteStaff(id: bigint): Promise<boolean>;
  // Cloud credential management
  setStaffPassword(phone: string, password: string): Promise<boolean>;
  verifyStaffPassword(phone: string, password: string): Promise<boolean>;
  hasStaffPassword(phone: string): Promise<boolean>;
  deleteStaffCredentials(phone: string): Promise<void>;
  getOwnerPassword(): Promise<string>;
  setOwnerPassword(newPassword: string): Promise<boolean>;
}
