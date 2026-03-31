module {
  type Measurements = {
    chest : Float;
    waist : Float;
    hip : Float;
    shoulder : Float;
    sleeveLength : Float;
    shirtLength : Float;
    trouserLength : Float;
    neck : Float;
  };

  type Customer = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    measurements : ?Measurements;
    createdAt : Int;
  };

  type OrderStatus = { #Pending; #InProduction; #Ready; #Delivered; #Cancelled };
  type GarmentType = { #Shirt; #Trouser; #Suit; #Kurti; #Blouse; #Other };

  type Order = {
    id : Nat;
    customerId : Nat;
    customerName : Text;
    garmentType : GarmentType;
    fabricName : Text;
    fabricColor : Text;
    quantity : Nat;
    price : Float;
    advancePaid : Float;
    dueDate : Int;
    deliveryDate : ?Int;
    status : OrderStatus;
    notes : Text;
    createdAt : Int;
  };

  type AppointmentStatus = { #Scheduled; #Completed; #Cancelled };
  type AppointmentType = { #Measurement; #Fitting; #Delivery; #Consultation };

  type Appointment = {
    id : Nat;
    customerId : Nat;
    customerName : Text;
    dateTime : Int;
    appointmentType : AppointmentType;
    status : AppointmentStatus;
    notes : Text;
  };

  type FabricInventory = {
    id : Nat;
    fabricName : Text;
    color : Text;
    quantityMeters : Float;
    pricePerMeter : Float;
    supplier : Text;
    reorderLevel : Float;
  };

  type PaymentStatus = { #Unpaid; #PartiallyPaid; #Paid };

  type Invoice = {
    id : Nat;
    orderId : Nat;
    customerId : Nat;
    customerName : Text;
    subtotal : Float;
    discount : Float;
    tax : Float;
    total : Float;
    paymentStatus : PaymentStatus;
    paymentMethod : Text;
    createdAt : Int;
  };

  type StaffRole = { #Tailor; #Cutter; #Helper; #Manager; #Receptionist; #Other };

  type Staff = {
    id : Nat;
    staffId : Text;
    name : Text;
    role : StaffRole;
    phone : Text;
    email : Text;
    department : Text;
    joinDate : Int;
    address : Text;
    createdAt : Int;
  };

  type Credential = {
    phone : Text;
    password : Text;
  };

  type StripeConfig = {
    allowedCountries : [Text];
    secretKey : Text;
  };

  // OldActor: state before stripeConfiguration was added
  type OldActor = {
    nextCustomerId : Nat;
    nextOrderId : Nat;
    nextAppointmentId : Nat;
    nextInventoryId : Nat;
    nextInvoiceId : Nat;
    nextStaffId : Nat;
    seeded : Bool;
    customers : [Customer];
    orders : [Order];
    appointments : [Appointment];
    inventory : [FabricInventory];
    invoices : [Invoice];
    staffList : [Staff];
    staffCredentials : [Credential];
    ownerPassword : Text;
    customerPhotosList : [(Nat, [Text])];
  };

  // NewActor: state with stripeConfiguration added
  type NewActor = {
    nextCustomerId : Nat;
    nextOrderId : Nat;
    nextAppointmentId : Nat;
    nextInventoryId : Nat;
    nextInvoiceId : Nat;
    nextStaffId : Nat;
    seeded : Bool;
    customers : [Customer];
    orders : [Order];
    appointments : [Appointment];
    inventory : [FabricInventory];
    invoices : [Invoice];
    staffList : [Staff];
    staffCredentials : [Credential];
    ownerPassword : Text;
    customerPhotosList : [(Nat, [Text])];
    stripeConfiguration : ?StripeConfig;
  };

  public func run(old : OldActor) : NewActor {
    {
      nextCustomerId = old.nextCustomerId;
      nextOrderId = old.nextOrderId;
      nextAppointmentId = old.nextAppointmentId;
      nextInventoryId = old.nextInventoryId;
      nextInvoiceId = old.nextInvoiceId;
      nextStaffId = old.nextStaffId;
      seeded = old.seeded;
      customers = old.customers;
      orders = old.orders;
      appointments = old.appointments;
      inventory = old.inventory;
      invoices = old.invoices;
      staffList = old.staffList;
      staffCredentials = old.staffCredentials;
      ownerPassword = old.ownerPassword;
      customerPhotosList = old.customerPhotosList;
      stripeConfiguration = null;
    };
  };
};
