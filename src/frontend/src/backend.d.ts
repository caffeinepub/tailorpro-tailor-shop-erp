import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Invoice {
    id: bigint;
    tax: number;
    customerName: string;
    total: number;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    createdAt: bigint;
    orderId: bigint;
    discount: number;
    customerId: bigint;
    subtotal: number;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    fabricName: string;
    createdAt: bigint;
    dueDate: bigint;
    deliveryDate?: bigint;
    garmentType: GarmentType;
    notes: string;
    advancePaid: number;
    quantity: bigint;
    customerId: bigint;
    price: number;
    fabricColor: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Measurements {
    hip: number;
    chest: number;
    neck: number;
    trouserLength: number;
    sleeveLength: number;
    shoulder: number;
    shirtLength: number;
    waist: number;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface DashboardStats {
    todayAppointments: bigint;
    totalOrders: bigint;
    pendingOrders: bigint;
    readyOrders: bigint;
    inProductionOrders: bigint;
    totalCustomers: bigint;
    monthlyRevenue: number;
    deliveredOrders: bigint;
}
export interface Customer {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    measurements?: Measurements;
    address: string;
    phone: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Staff {
    id: bigint;
    staffId: string;
    joinDate: bigint;
    name: string;
    createdAt: bigint;
    role: StaffRole;
    email: string;
    address: string;
    phone: string;
    department: string;
}
export interface FabricInventory {
    id: bigint;
    fabricName: string;
    supplier: string;
    color: string;
    quantityMeters: number;
    pricePerMeter: number;
    reorderLevel: number;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Appointment {
    id: bigint;
    customerName: string;
    status: AppointmentStatus;
    appointmentType: AppointmentType;
    notes: string;
    customerId: bigint;
    dateTime: bigint;
}
export enum AppointmentStatus {
    Scheduled = "Scheduled",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum AppointmentType {
    Measurement = "Measurement",
    Fitting = "Fitting",
    Delivery = "Delivery",
    Consultation = "Consultation"
}
export enum GarmentType {
    Shirt = "Shirt",
    Suit = "Suit",
    Trouser = "Trouser",
    Kurti = "Kurti",
    Other = "Other",
    Blouse = "Blouse"
}
export enum OrderStatus {
    InProduction = "InProduction",
    Delivered = "Delivered",
    Ready = "Ready",
    Cancelled = "Cancelled",
    Pending = "Pending"
}
export enum PaymentStatus {
    PartiallyPaid = "PartiallyPaid",
    Paid = "Paid",
    Unpaid = "Unpaid"
}
export enum StaffRole {
    Helper = "Helper",
    Cutter = "Cutter",
    Receptionist = "Receptionist",
    Tailor = "Tailor",
    Other = "Other",
    Manager = "Manager"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAppointment(customerId: bigint, customerName: string, dateTime: bigint, appointmentType: AppointmentType, notes: string): Promise<Appointment>;
    addCustomer(name: string, phone: string, email: string, address: string, measurements: Measurements | null): Promise<Customer>;
    addCustomerPhoto(customerId: bigint, hash: string): Promise<boolean>;
    addInventoryItem(fabricName: string, color: string, quantityMeters: number, pricePerMeter: number, supplier: string, reorderLevel: number): Promise<FabricInventory>;
    addOrder(customerId: bigint, customerName: string, garmentType: GarmentType, fabricName: string, fabricColor: string, quantity: bigint, price: number, advancePaid: number, dueDate: bigint, notes: string): Promise<Order>;
    addStaff(name: string, role: StaffRole, phone: string, email: string, department: string, joinDate: bigint, address: string): Promise<Staff>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createInvoice(orderId: bigint, customerId: bigint, customerName: string, subtotal: number, discount: number, tax: number, total: number, paymentMethod: string): Promise<Invoice>;
    deleteAppointment(id: bigint): Promise<boolean>;
    deleteCustomer(id: bigint): Promise<boolean>;
    deleteCustomerPhoto(customerId: bigint, hash: string): Promise<boolean>;
    deleteInventoryItem(id: bigint): Promise<boolean>;
    deleteOrder(id: bigint): Promise<boolean>;
    deleteStaff(id: bigint): Promise<boolean>;
    deleteStaffCredentials(phone: string): Promise<void>;
    filterCustomersByName(name: string): Promise<Array<Customer>>;
    getAppointments(): Promise<Array<Appointment>>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(id: bigint): Promise<Customer | null>;
    getCustomerPhotos(customerId: bigint): Promise<Array<string>>;
    getCustomers(): Promise<Array<Customer>>;
    getDashboardStats(): Promise<DashboardStats>;
    getInventory(): Promise<Array<FabricInventory>>;
    getInvoices(): Promise<Array<Invoice>>;
    getOrders(): Promise<Array<Order>>;
    getOrdersByCustomer(customerId: bigint): Promise<Array<Order>>;
    getOwnerPassword(): Promise<string>;
    getStaff(): Promise<Array<Staff>>;
    getStripeConfiguration(): Promise<StripeConfiguration | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    hasStaffPassword(phone: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    seedData(): Promise<void>;
    setOwnerPassword(newPassword: string): Promise<boolean>;
    setStaffPassword(phone: string, password: string): Promise<boolean>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAppointmentStatus(id: bigint, status: AppointmentStatus): Promise<boolean>;
    updateCustomer(id: bigint, name: string, phone: string, email: string, address: string, measurements: Measurements | null): Promise<boolean>;
    updateInventoryItem(id: bigint, fabricName: string, color: string, quantityMeters: number, pricePerMeter: number, supplier: string, reorderLevel: number): Promise<boolean>;
    updateInvoicePayment(id: bigint, paymentStatus: PaymentStatus): Promise<boolean>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean>;
    updateStaff(id: bigint, name: string, role: StaffRole, phone: string, email: string, department: string, joinDate: bigint, address: string): Promise<boolean>;
    verifyStaffPassword(phone: string, password: string): Promise<boolean>;
}
