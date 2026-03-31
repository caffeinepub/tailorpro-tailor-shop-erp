/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

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
export interface Customer {
  id: bigint;
  name: string;
  phone: string;
  email: string;
  address: string;
  measurements: [] | [Measurements];
  createdAt: bigint;
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
export type AppointmentStatus =
  | { Scheduled: null }
  | { Completed: null }
  | { Cancelled: null };
export type AppointmentType =
  | { Measurement: null }
  | { Fitting: null }
  | { Delivery: null }
  | { Consultation: null };
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
export type PaymentStatus =
  | { Unpaid: null }
  | { PartiallyPaid: null }
  | { Paid: null };
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
export type StaffRole =
  | { Tailor: null }
  | { Cutter: null }
  | { Helper: null }
  | { Manager: null }
  | { Receptionist: null }
  | { Other: null };
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
export interface _SERVICE {
  seedData: ActorMethod<[], undefined>;
  getCustomers: ActorMethod<[], Customer[]>;
  getCustomer: ActorMethod<[bigint], [] | [Customer]>;
  addCustomer: ActorMethod<[string, string, string, string, [] | [Measurements]], Customer>;
  updateCustomer: ActorMethod<[bigint, string, string, string, string, [] | [Measurements]], boolean>;
  deleteCustomer: ActorMethod<[bigint], boolean>;
  getOrders: ActorMethod<[], Order[]>;
  getOrdersByCustomer: ActorMethod<[bigint], Order[]>;
  addOrder: ActorMethod<[bigint, string, GarmentType, string, string, bigint, number, number, bigint, string], Order>;
  updateOrderStatus: ActorMethod<[bigint, OrderStatus], boolean>;
  deleteOrder: ActorMethod<[bigint], boolean>;
  getAppointments: ActorMethod<[], Appointment[]>;
  addAppointment: ActorMethod<[bigint, string, bigint, AppointmentType, string], Appointment>;
  updateAppointmentStatus: ActorMethod<[bigint, AppointmentStatus], boolean>;
  deleteAppointment: ActorMethod<[bigint], boolean>;
  getInventory: ActorMethod<[], FabricInventory[]>;
  addInventoryItem: ActorMethod<[string, string, number, number, string, number], FabricInventory>;
  updateInventoryItem: ActorMethod<[bigint, string, string, number, number, string, number], boolean>;
  deleteInventoryItem: ActorMethod<[bigint], boolean>;
  getInvoices: ActorMethod<[], Invoice[]>;
  createInvoice: ActorMethod<[bigint, bigint, string, number, number, number, number, string], Invoice>;
  updateInvoicePayment: ActorMethod<[bigint, PaymentStatus], boolean>;
  getStaff: ActorMethod<[], Staff[]>;
  addStaff: ActorMethod<[string, StaffRole, string, string, string, bigint, string], Staff>;
  updateStaff: ActorMethod<[bigint, string, StaffRole, string, string, string, bigint, string], boolean>;
  deleteStaff: ActorMethod<[bigint], boolean>;
  setStaffPassword: ActorMethod<[string, string], boolean>;
  verifyStaffPassword: ActorMethod<[string, string], boolean>;
  hasStaffPassword: ActorMethod<[string], boolean>;
  deleteStaffCredentials: ActorMethod<[string], undefined>;
  getOwnerPassword: ActorMethod<[], string>;
  setOwnerPassword: ActorMethod<[string], boolean>;
  getDashboardStats: ActorMethod<[], DashboardStats>;
  addCustomerPhoto: ActorMethod<[bigint, string], boolean>;
  getCustomerPhotos: ActorMethod<[bigint], string[]>;
  deleteCustomerPhoto: ActorMethod<[bigint, string], boolean>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
