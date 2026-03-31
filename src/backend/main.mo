import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";

actor {

  // ===== TYPES =====

  public type Measurements = {
    chest: Float;
    waist: Float;
    hip: Float;
    shoulder: Float;
    sleeveLength: Float;
    shirtLength: Float;
    trouserLength: Float;
    neck: Float;
  };

  public type Customer = {
    id: Nat;
    name: Text;
    phone: Text;
    email: Text;
    address: Text;
    measurements: ?Measurements;
    createdAt: Int;
  };

  public type OrderStatus = { #Pending; #InProduction; #Ready; #Delivered; #Cancelled };
  public type GarmentType = { #Shirt; #Trouser; #Suit; #Kurti; #Blouse; #Other };

  public type Order = {
    id: Nat;
    customerId: Nat;
    customerName: Text;
    garmentType: GarmentType;
    fabricName: Text;
    fabricColor: Text;
    quantity: Nat;
    price: Float;
    advancePaid: Float;
    dueDate: Int;
    deliveryDate: ?Int;
    status: OrderStatus;
    notes: Text;
    createdAt: Int;
  };

  public type AppointmentStatus = { #Scheduled; #Completed; #Cancelled };
  public type AppointmentType = { #Measurement; #Fitting; #Delivery; #Consultation };

  public type Appointment = {
    id: Nat;
    customerId: Nat;
    customerName: Text;
    dateTime: Int;
    appointmentType: AppointmentType;
    status: AppointmentStatus;
    notes: Text;
  };

  public type FabricInventory = {
    id: Nat;
    fabricName: Text;
    color: Text;
    quantityMeters: Float;
    pricePerMeter: Float;
    supplier: Text;
    reorderLevel: Float;
  };

  public type PaymentStatus = { #Unpaid; #PartiallyPaid; #Paid };

  public type Invoice = {
    id: Nat;
    orderId: Nat;
    customerId: Nat;
    customerName: Text;
    subtotal: Float;
    discount: Float;
    tax: Float;
    total: Float;
    paymentStatus: PaymentStatus;
    paymentMethod: Text;
    createdAt: Int;
  };

  public type StaffRole = { #Tailor; #Cutter; #Helper; #Manager; #Receptionist; #Other };

  public type Staff = {
    id: Nat;
    staffId: Text;
    name: Text;
    role: StaffRole;
    phone: Text;
    email: Text;
    department: Text;
    joinDate: Int;
    address: Text;
    createdAt: Int;
  };

  public type Credential = {
    phone: Text;
    password: Text;
  };

  public type DashboardStats = {
    totalCustomers: Nat;
    totalOrders: Nat;
    pendingOrders: Nat;
    inProductionOrders: Nat;
    readyOrders: Nat;
    deliveredOrders: Nat;
    monthlyRevenue: Float;
    todayAppointments: Nat;
  };

  // ===== STATE =====

  var nextCustomerId: Nat = 1;
  var nextOrderId: Nat = 1;
  var nextAppointmentId: Nat = 1;
  var nextInventoryId: Nat = 1;
  var nextInvoiceId: Nat = 1;
  var nextStaffId: Nat = 1;
  var seeded: Bool = false;

  var customers: [Customer] = [];
  var orders: [Order] = [];
  var appointments: [Appointment] = [];
  var inventory: [FabricInventory] = [];
  var invoices: [Invoice] = [];
  var staffList: [Staff] = [];
  var staffCredentials: [Credential] = [];
  var ownerPassword: Text = "owner@123";

  // ===== SEED DATA =====

  public func seedData(): async () {
    if (seeded) return;
    seeded := true;

    let now = Time.now();
    let day : Int = 86_400_000_000_000;

    let m1: Measurements = { chest=102.0; waist=86.0; hip=98.0; shoulder=46.0; sleeveLength=60.0; shirtLength=76.0; trouserLength=104.0; neck=40.0 };
    let m2: Measurements = { chest=96.0; waist=80.0; hip=94.0; shoulder=44.0; sleeveLength=58.0; shirtLength=74.0; trouserLength=100.0; neck=38.0 };
    let m3: Measurements = { chest=88.0; waist=72.0; hip=90.0; shoulder=42.0; sleeveLength=56.0; shirtLength=72.0; trouserLength=98.0; neck=36.0 };

    customers := [
      { id=1; name="Rahul Sharma"; phone="9876543210"; email="rahul@email.com"; address="12 MG Road, Pune"; measurements=?m1; createdAt=now },
      { id=2; name="Priya Patel"; phone="9845123456"; email="priya@email.com"; address="45 Nehru Street, Mumbai"; measurements=?m2; createdAt=now },
      { id=3; name="Amit Verma"; phone="9812345678"; email="amit@email.com"; address="78 Gandhi Nagar, Delhi"; measurements=?m3; createdAt=now },
      { id=4; name="Sunita Rao"; phone="9900112233"; email="sunita@email.com"; address="23 Park Street, Bangalore"; measurements=null; createdAt=now },
      { id=5; name="Vikram Singh"; phone="9711223344"; email="vikram@email.com"; address="56 Civil Lines, Jaipur"; measurements=?m1; createdAt=now },
    ];
    nextCustomerId := 6;

    orders := [
      { id=1; customerId=1; customerName="Rahul Sharma"; garmentType=#Shirt; fabricName="Cotton Premium"; fabricColor="White"; quantity=2; price=1800.0; advancePaid=900.0; dueDate=now + 5*day; deliveryDate=null; status=#InProduction; notes="Formal shirt"; createdAt=now - 2*day },
      { id=2; customerId=2; customerName="Priya Patel"; garmentType=#Kurti; fabricName="Silk"; fabricColor="Blue"; quantity=1; price=2500.0; advancePaid=2500.0; dueDate=now + 3*day; deliveryDate=null; status=#Ready; notes="Wedding kurti"; createdAt=now - 4*day },
      { id=3; customerId=3; customerName="Amit Verma"; garmentType=#Suit; fabricName="Wool Blend"; fabricColor="Navy"; quantity=1; price=8500.0; advancePaid=4000.0; dueDate=now + 10*day; deliveryDate=null; status=#Pending; notes="Office suit"; createdAt=now - 1*day },
      { id=4; customerId=4; customerName="Sunita Rao"; garmentType=#Blouse; fabricName="Georgette"; fabricColor="Red"; quantity=3; price=1200.0; advancePaid=600.0; dueDate=now - 1*day; deliveryDate=?(now - 1*day); status=#Delivered; notes="Party blouse"; createdAt=now - 7*day },
      { id=5; customerId=5; customerName="Vikram Singh"; garmentType=#Trouser; fabricName="Polyester"; fabricColor="Black"; quantity=2; price=2400.0; advancePaid=1200.0; dueDate=now + 7*day; deliveryDate=null; status=#InProduction; notes="Formal trousers"; createdAt=now - 3*day },
    ];
    nextOrderId := 6;

    appointments := [
      { id=1; customerId=1; customerName="Rahul Sharma"; dateTime=now + 1*day; appointmentType=#Fitting; status=#Scheduled; notes="First fitting for shirts" },
      { id=2; customerId=2; customerName="Priya Patel"; dateTime=now; appointmentType=#Delivery; status=#Scheduled; notes="Kurti delivery" },
      { id=3; customerId=3; customerName="Amit Verma"; dateTime=now + 2*day; appointmentType=#Measurement; status=#Scheduled; notes="New measurements needed" },
    ];
    nextAppointmentId := 4;

    inventory := [
      { id=1; fabricName="Cotton Premium"; color="White"; quantityMeters=45.5; pricePerMeter=120.0; supplier="Sharma Textiles"; reorderLevel=10.0 },
      { id=2; fabricName="Silk"; color="Assorted"; quantityMeters=18.0; pricePerMeter=450.0; supplier="Bombay Silk House"; reorderLevel=5.0 },
      { id=3; fabricName="Wool Blend"; color="Navy"; quantityMeters=12.5; pricePerMeter=380.0; supplier="Woolen World"; reorderLevel=5.0 },
    ];
    nextInventoryId := 4;

    invoices := [
      { id=1; orderId=4; customerId=4; customerName="Sunita Rao"; subtotal=1200.0; discount=0.0; tax=60.0; total=1260.0; paymentStatus=#Paid; paymentMethod="Cash"; createdAt=now - 1*day },
    ];
    nextInvoiceId := 2;

    staffList := [
      { id=1; staffId="TP-001"; name="Mohammed Irfan"; role=#Tailor; phone="9876500001"; email="irfan@tailorpro.com"; department="Tailoring"; joinDate=now - 365*day; address="10 Main Street, Pune"; createdAt=now },
      { id=2; staffId="TP-002"; name="Ramesh Kumar"; role=#Cutter; phone="9876500002"; email="ramesh@tailorpro.com"; department="Cutting"; joinDate=now - 200*day; address="22 Park Ave, Pune"; createdAt=now },
      { id=3; staffId="TP-003"; name="Anita Desai"; role=#Receptionist; phone="9876500003"; email="anita@tailorpro.com"; department="Front Office"; joinDate=now - 100*day; address="5 Garden Road, Pune"; createdAt=now },
      { id=4; staffId="TP-004"; name="Suresh Nair"; role=#Manager; phone="9876500004"; email="suresh@tailorpro.com"; department="Management"; joinDate=now - 500*day; address="8 Lake View, Pune"; createdAt=now },
    ];
    nextStaffId := 5;
  };

  // ===== CUSTOMERS =====

  public query func getCustomers(): async [Customer] { customers };

  public query func getCustomer(id: Nat): async ?Customer {
    for (c in customers.vals()) {
      if (c.id == id) return ?c;
    };
    null
  };

  public func addCustomer(name: Text, phone: Text, email: Text, address: Text, measurements: ?Measurements): async Customer {
    let c: Customer = { id=nextCustomerId; name; phone; email; address; measurements; createdAt=Time.now() };
    customers := Array.append(customers, [c]);
    nextCustomerId += 1;
    c
  };

  public func updateCustomer(id: Nat, name: Text, phone: Text, email: Text, address: Text, measurements: ?Measurements): async Bool {
    var found = false;
    customers := Array.map<Customer, Customer>(customers, func(c) {
      if (c.id == id) { found := true; { id; name; phone; email; address; measurements; createdAt=c.createdAt } }
      else c
    });
    found
  };

  public func deleteCustomer(id: Nat): async Bool {
    let before = customers.size();
    customers := Array.filter<Customer>(customers, func(c) { c.id != id });
    customers.size() < before
  };

  // ===== ORDERS =====

  public query func getOrders(): async [Order] { orders };

  public query func getOrdersByCustomer(customerId: Nat): async [Order] {
    Array.filter<Order>(orders, func(o) { o.customerId == customerId })
  };

  public func addOrder(customerId: Nat, customerName: Text, garmentType: GarmentType, fabricName: Text, fabricColor: Text, quantity: Nat, price: Float, advancePaid: Float, dueDate: Int, notes: Text): async Order {
    let o: Order = { id=nextOrderId; customerId; customerName; garmentType; fabricName; fabricColor; quantity; price; advancePaid; dueDate; deliveryDate=null; status=#Pending; notes; createdAt=Time.now() };
    orders := Array.append(orders, [o]);
    nextOrderId += 1;
    o
  };

  public func updateOrderStatus(id: Nat, status: OrderStatus): async Bool {
    var found = false;
    orders := Array.map<Order, Order>(orders, func(o) {
      if (o.id == id) {
        found := true;
        let deliveryDate = if (status == #Delivered) ?Time.now() else o.deliveryDate;
        { id=o.id; customerId=o.customerId; customerName=o.customerName; garmentType=o.garmentType; fabricName=o.fabricName; fabricColor=o.fabricColor; quantity=o.quantity; price=o.price; advancePaid=o.advancePaid; dueDate=o.dueDate; deliveryDate; status; notes=o.notes; createdAt=o.createdAt }
      } else o
    });
    found
  };

  public func deleteOrder(id: Nat): async Bool {
    let before = orders.size();
    orders := Array.filter<Order>(orders, func(o) { o.id != id });
    orders.size() < before
  };

  // ===== APPOINTMENTS =====

  public query func getAppointments(): async [Appointment] { appointments };

  public func addAppointment(customerId: Nat, customerName: Text, dateTime: Int, appointmentType: AppointmentType, notes: Text): async Appointment {
    let a: Appointment = { id=nextAppointmentId; customerId; customerName; dateTime; appointmentType; status=#Scheduled; notes };
    appointments := Array.append(appointments, [a]);
    nextAppointmentId += 1;
    a
  };

  public func updateAppointmentStatus(id: Nat, status: AppointmentStatus): async Bool {
    var found = false;
    appointments := Array.map<Appointment, Appointment>(appointments, func(a) {
      if (a.id == id) {
        found := true;
        { id=a.id; customerId=a.customerId; customerName=a.customerName; dateTime=a.dateTime; appointmentType=a.appointmentType; status; notes=a.notes }
      } else a
    });
    found
  };

  public func deleteAppointment(id: Nat): async Bool {
    let before = appointments.size();
    appointments := Array.filter<Appointment>(appointments, func(a) { a.id != id });
    appointments.size() < before
  };

  // ===== INVENTORY =====

  public query func getInventory(): async [FabricInventory] { inventory };

  public func addInventoryItem(fabricName: Text, color: Text, quantityMeters: Float, pricePerMeter: Float, supplier: Text, reorderLevel: Float): async FabricInventory {
    let item: FabricInventory = { id=nextInventoryId; fabricName; color; quantityMeters; pricePerMeter; supplier; reorderLevel };
    inventory := Array.append(inventory, [item]);
    nextInventoryId += 1;
    item
  };

  public func updateInventoryItem(id: Nat, fabricName: Text, color: Text, quantityMeters: Float, pricePerMeter: Float, supplier: Text, reorderLevel: Float): async Bool {
    var found = false;
    inventory := Array.map<FabricInventory, FabricInventory>(inventory, func(item) {
      if (item.id == id) {
        found := true;
        { id; fabricName; color; quantityMeters; pricePerMeter; supplier; reorderLevel }
      } else item
    });
    found
  };

  public func deleteInventoryItem(id: Nat): async Bool {
    let before = inventory.size();
    inventory := Array.filter<FabricInventory>(inventory, func(item) { item.id != id });
    inventory.size() < before
  };

  // ===== INVOICES =====

  public query func getInvoices(): async [Invoice] { invoices };

  public func createInvoice(orderId: Nat, customerId: Nat, customerName: Text, subtotal: Float, discount: Float, tax: Float, total: Float, paymentMethod: Text): async Invoice {
    let inv: Invoice = { id=nextInvoiceId; orderId; customerId; customerName; subtotal; discount; tax; total; paymentStatus=#Unpaid; paymentMethod; createdAt=Time.now() };
    invoices := Array.append(invoices, [inv]);
    nextInvoiceId += 1;
    inv
  };

  public func updateInvoicePayment(id: Nat, paymentStatus: PaymentStatus): async Bool {
    var found = false;
    invoices := Array.map<Invoice, Invoice>(invoices, func(inv) {
      if (inv.id == id) {
        found := true;
        { id=inv.id; orderId=inv.orderId; customerId=inv.customerId; customerName=inv.customerName; subtotal=inv.subtotal; discount=inv.discount; tax=inv.tax; total=inv.total; paymentStatus; paymentMethod=inv.paymentMethod; createdAt=inv.createdAt }
      } else inv
    });
    found
  };

  // ===== STAFF =====

  public query func getStaff(): async [Staff] { staffList };

  public func addStaff(name: Text, role: StaffRole, phone: Text, email: Text, department: Text, joinDate: Int, address: Text): async Staff {
    let sid = "TP-" # (if (nextStaffId < 10) "00" # Int.toText(nextStaffId)
                       else if (nextStaffId < 100) "0" # Int.toText(nextStaffId)
                       else Int.toText(nextStaffId));
    let s: Staff = { id=nextStaffId; staffId=sid; name; role; phone; email; department; joinDate; address; createdAt=Time.now() };
    staffList := Array.append(staffList, [s]);
    nextStaffId += 1;
    s
  };

  public func updateStaff(id: Nat, name: Text, role: StaffRole, phone: Text, email: Text, department: Text, joinDate: Int, address: Text): async Bool {
    var found = false;
    staffList := Array.map<Staff, Staff>(staffList, func(s) {
      if (s.id == id) {
        found := true;
        { id=s.id; staffId=s.staffId; name; role; phone; email; department; joinDate; address; createdAt=s.createdAt }
      } else s
    });
    found
  };

  public func deleteStaff(id: Nat): async Bool {
    let before = staffList.size();
    staffList := Array.filter<Staff>(staffList, func(s) { s.id != id });
    staffList.size() < before
  };

  // ===== STAFF CREDENTIALS (Cloud Auth) =====

  /// Set or update password for a staff member by phone number
  public func setStaffPassword(phone: Text, password: Text): async Bool {
    let trimPhone = phone;
    var found = false;
    staffCredentials := Array.map<Credential, Credential>(staffCredentials, func(c) {
      if (c.phone == trimPhone) { found := true; { phone=trimPhone; password } }
      else c
    });
    if (not found) {
      staffCredentials := Array.append(staffCredentials, [{ phone=trimPhone; password }]);
    };
    true
  };

  /// Verify staff password. Returns true if password matches or no password set yet (first login).
  public query func verifyStaffPassword(phone: Text, password: Text): async Bool {
    for (c in staffCredentials.vals()) {
      if (c.phone == phone) {
        return c.password == password;
      };
    };
    // No password set yet - allow blank or any password (first time login)
    true
  };

  /// Check if a staff member has set a password
  public query func hasStaffPassword(phone: Text): async Bool {
    for (c in staffCredentials.vals()) {
      if (c.phone == phone) return true;
    };
    false
  };

  /// Remove staff credentials when staff is deleted
  public func deleteStaffCredentials(phone: Text): async () {
    staffCredentials := Array.filter<Credential>(staffCredentials, func(c) { c.phone != phone });
  };

  // ===== OWNER PASSWORD (Cloud Auth) =====

  /// Get owner password (for login verification)
  public query func getOwnerPassword(): async Text { ownerPassword };

  /// Change owner password
  public func setOwnerPassword(newPassword: Text): async Bool {
    ownerPassword := newPassword;
    true
  };

  // ===== DASHBOARD =====

  public query func getDashboardStats(): async DashboardStats {
    let now = Time.now();
    let dayStart = now - (now % 86_400_000_000_000);
    let monthStart = now - 30 * 86_400_000_000_000;

    var pending = 0;
    var inProduction = 0;
    var ready = 0;
    var delivered = 0;
    var monthlyRev: Float = 0.0;

    for (o in orders.vals()) {
      switch (o.status) {
        case (#Pending) pending += 1;
        case (#InProduction) inProduction += 1;
        case (#Ready) ready += 1;
        case (#Delivered) { delivered += 1; };
        case (#Cancelled) {};
      };
      if (o.createdAt >= monthStart) monthlyRev += o.price;
    };

    var todayAppts = 0;
    for (a in appointments.vals()) {
      if (a.dateTime >= dayStart and a.dateTime < dayStart + 86_400_000_000_000) todayAppts += 1;
    };

    {
      totalCustomers = customers.size();
      totalOrders = orders.size();
      pendingOrders = pending;
      inProductionOrders = inProduction;
      readyOrders = ready;
      deliveredOrders = delivered;
      monthlyRevenue = monthlyRev;
      todayAppointments = todayAppts;
    }
  };

};
