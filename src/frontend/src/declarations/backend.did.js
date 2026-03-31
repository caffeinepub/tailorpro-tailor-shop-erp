/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

const Measurements = IDL.Record({
  chest: IDL.Float64,
  waist: IDL.Float64,
  hip: IDL.Float64,
  shoulder: IDL.Float64,
  sleeveLength: IDL.Float64,
  shirtLength: IDL.Float64,
  trouserLength: IDL.Float64,
  neck: IDL.Float64,
});

const Customer = IDL.Record({
  id: IDL.Nat,
  name: IDL.Text,
  phone: IDL.Text,
  email: IDL.Text,
  address: IDL.Text,
  measurements: IDL.Opt(Measurements),
  createdAt: IDL.Int,
});

const OrderStatus = IDL.Variant({
  Pending: IDL.Null,
  InProduction: IDL.Null,
  Ready: IDL.Null,
  Delivered: IDL.Null,
  Cancelled: IDL.Null,
});

const GarmentType = IDL.Variant({
  Shirt: IDL.Null,
  Trouser: IDL.Null,
  Suit: IDL.Null,
  Kurti: IDL.Null,
  Blouse: IDL.Null,
  Other: IDL.Null,
});

const Order = IDL.Record({
  id: IDL.Nat,
  customerId: IDL.Nat,
  customerName: IDL.Text,
  garmentType: GarmentType,
  fabricName: IDL.Text,
  fabricColor: IDL.Text,
  quantity: IDL.Nat,
  price: IDL.Float64,
  advancePaid: IDL.Float64,
  dueDate: IDL.Int,
  deliveryDate: IDL.Opt(IDL.Int),
  status: OrderStatus,
  notes: IDL.Text,
  createdAt: IDL.Int,
});

const AppointmentStatus = IDL.Variant({
  Scheduled: IDL.Null,
  Completed: IDL.Null,
  Cancelled: IDL.Null,
});

const AppointmentType = IDL.Variant({
  Measurement: IDL.Null,
  Fitting: IDL.Null,
  Delivery: IDL.Null,
  Consultation: IDL.Null,
});

const Appointment = IDL.Record({
  id: IDL.Nat,
  customerId: IDL.Nat,
  customerName: IDL.Text,
  dateTime: IDL.Int,
  appointmentType: AppointmentType,
  status: AppointmentStatus,
  notes: IDL.Text,
});

const FabricInventory = IDL.Record({
  id: IDL.Nat,
  fabricName: IDL.Text,
  color: IDL.Text,
  quantityMeters: IDL.Float64,
  pricePerMeter: IDL.Float64,
  supplier: IDL.Text,
  reorderLevel: IDL.Float64,
});

const PaymentStatus = IDL.Variant({
  Unpaid: IDL.Null,
  PartiallyPaid: IDL.Null,
  Paid: IDL.Null,
});

const Invoice = IDL.Record({
  id: IDL.Nat,
  orderId: IDL.Nat,
  customerId: IDL.Nat,
  customerName: IDL.Text,
  subtotal: IDL.Float64,
  discount: IDL.Float64,
  tax: IDL.Float64,
  total: IDL.Float64,
  paymentStatus: PaymentStatus,
  paymentMethod: IDL.Text,
  createdAt: IDL.Int,
});

const StaffRole = IDL.Variant({
  Tailor: IDL.Null,
  Cutter: IDL.Null,
  Helper: IDL.Null,
  Manager: IDL.Null,
  Receptionist: IDL.Null,
  Other: IDL.Null,
});

const Staff = IDL.Record({
  id: IDL.Nat,
  staffId: IDL.Text,
  name: IDL.Text,
  role: StaffRole,
  phone: IDL.Text,
  email: IDL.Text,
  department: IDL.Text,
  joinDate: IDL.Int,
  address: IDL.Text,
  createdAt: IDL.Int,
});

const DashboardStats = IDL.Record({
  totalCustomers: IDL.Nat,
  totalOrders: IDL.Nat,
  pendingOrders: IDL.Nat,
  inProductionOrders: IDL.Nat,
  readyOrders: IDL.Nat,
  deliveredOrders: IDL.Nat,
  monthlyRevenue: IDL.Float64,
  todayAppointments: IDL.Nat,
});

const serviceDefinition = IDL.Service({
  seedData: IDL.Func([], [], []),
  getCustomers: IDL.Func([], [IDL.Vec(Customer)], ['query']),
  getCustomer: IDL.Func([IDL.Nat], [IDL.Opt(Customer)], ['query']),
  addCustomer: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(Measurements)], [Customer], []),
  updateCustomer: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(Measurements)], [IDL.Bool], []),
  deleteCustomer: IDL.Func([IDL.Nat], [IDL.Bool], []),
  getOrders: IDL.Func([], [IDL.Vec(Order)], ['query']),
  getOrdersByCustomer: IDL.Func([IDL.Nat], [IDL.Vec(Order)], ['query']),
  addOrder: IDL.Func([IDL.Nat, IDL.Text, GarmentType, IDL.Text, IDL.Text, IDL.Nat, IDL.Float64, IDL.Float64, IDL.Int, IDL.Text], [Order], []),
  updateOrderStatus: IDL.Func([IDL.Nat, OrderStatus], [IDL.Bool], []),
  deleteOrder: IDL.Func([IDL.Nat], [IDL.Bool], []),
  getAppointments: IDL.Func([], [IDL.Vec(Appointment)], ['query']),
  addAppointment: IDL.Func([IDL.Nat, IDL.Text, IDL.Int, AppointmentType, IDL.Text], [Appointment], []),
  updateAppointmentStatus: IDL.Func([IDL.Nat, AppointmentStatus], [IDL.Bool], []),
  deleteAppointment: IDL.Func([IDL.Nat], [IDL.Bool], []),
  getInventory: IDL.Func([], [IDL.Vec(FabricInventory)], ['query']),
  addInventoryItem: IDL.Func([IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Text, IDL.Float64], [FabricInventory], []),
  updateInventoryItem: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Text, IDL.Float64], [IDL.Bool], []),
  deleteInventoryItem: IDL.Func([IDL.Nat], [IDL.Bool], []),
  getInvoices: IDL.Func([], [IDL.Vec(Invoice)], ['query']),
  createInvoice: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text], [Invoice], []),
  updateInvoicePayment: IDL.Func([IDL.Nat, PaymentStatus], [IDL.Bool], []),
  getStaff: IDL.Func([], [IDL.Vec(Staff)], ['query']),
  addStaff: IDL.Func([IDL.Text, StaffRole, IDL.Text, IDL.Text, IDL.Text, IDL.Int, IDL.Text], [Staff], []),
  updateStaff: IDL.Func([IDL.Nat, IDL.Text, StaffRole, IDL.Text, IDL.Text, IDL.Text, IDL.Int, IDL.Text], [IDL.Bool], []),
  deleteStaff: IDL.Func([IDL.Nat], [IDL.Bool], []),
  setStaffPassword: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  verifyStaffPassword: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
  hasStaffPassword: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
  deleteStaffCredentials: IDL.Func([IDL.Text], [], []),
  getOwnerPassword: IDL.Func([], [IDL.Text], ['query']),
  setOwnerPassword: IDL.Func([IDL.Text], [IDL.Bool], []),
  getDashboardStats: IDL.Func([], [DashboardStats], ['query']),
  addCustomerPhoto: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
  getCustomerPhotos: IDL.Func([IDL.Nat], [IDL.Vec(IDL.Text)], ['query']),
  deleteCustomerPhoto: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
});

export const idlService = serviceDefinition;
export const idlInitArgs = [];
export const idlFactory = ({ IDL }) => {
  const Measurements = IDL.Record({
    chest: IDL.Float64,
    waist: IDL.Float64,
    hip: IDL.Float64,
    shoulder: IDL.Float64,
    sleeveLength: IDL.Float64,
    shirtLength: IDL.Float64,
    trouserLength: IDL.Float64,
    neck: IDL.Float64,
  });
  const Customer = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    phone: IDL.Text,
    email: IDL.Text,
    address: IDL.Text,
    measurements: IDL.Opt(Measurements),
    createdAt: IDL.Int,
  });
  const OrderStatus = IDL.Variant({
    Pending: IDL.Null,
    InProduction: IDL.Null,
    Ready: IDL.Null,
    Delivered: IDL.Null,
    Cancelled: IDL.Null,
  });
  const GarmentType = IDL.Variant({
    Shirt: IDL.Null,
    Trouser: IDL.Null,
    Suit: IDL.Null,
    Kurti: IDL.Null,
    Blouse: IDL.Null,
    Other: IDL.Null,
  });
  const Order = IDL.Record({
    id: IDL.Nat,
    customerId: IDL.Nat,
    customerName: IDL.Text,
    garmentType: GarmentType,
    fabricName: IDL.Text,
    fabricColor: IDL.Text,
    quantity: IDL.Nat,
    price: IDL.Float64,
    advancePaid: IDL.Float64,
    dueDate: IDL.Int,
    deliveryDate: IDL.Opt(IDL.Int),
    status: OrderStatus,
    notes: IDL.Text,
    createdAt: IDL.Int,
  });
  const AppointmentStatus = IDL.Variant({
    Scheduled: IDL.Null,
    Completed: IDL.Null,
    Cancelled: IDL.Null,
  });
  const AppointmentType = IDL.Variant({
    Measurement: IDL.Null,
    Fitting: IDL.Null,
    Delivery: IDL.Null,
    Consultation: IDL.Null,
  });
  const Appointment = IDL.Record({
    id: IDL.Nat,
    customerId: IDL.Nat,
    customerName: IDL.Text,
    dateTime: IDL.Int,
    appointmentType: AppointmentType,
    status: AppointmentStatus,
    notes: IDL.Text,
  });
  const FabricInventory = IDL.Record({
    id: IDL.Nat,
    fabricName: IDL.Text,
    color: IDL.Text,
    quantityMeters: IDL.Float64,
    pricePerMeter: IDL.Float64,
    supplier: IDL.Text,
    reorderLevel: IDL.Float64,
  });
  const PaymentStatus = IDL.Variant({
    Unpaid: IDL.Null,
    PartiallyPaid: IDL.Null,
    Paid: IDL.Null,
  });
  const Invoice = IDL.Record({
    id: IDL.Nat,
    orderId: IDL.Nat,
    customerId: IDL.Nat,
    customerName: IDL.Text,
    subtotal: IDL.Float64,
    discount: IDL.Float64,
    tax: IDL.Float64,
    total: IDL.Float64,
    paymentStatus: PaymentStatus,
    paymentMethod: IDL.Text,
    createdAt: IDL.Int,
  });
  const StaffRole = IDL.Variant({
    Tailor: IDL.Null,
    Cutter: IDL.Null,
    Helper: IDL.Null,
    Manager: IDL.Null,
    Receptionist: IDL.Null,
    Other: IDL.Null,
  });
  const Staff = IDL.Record({
    id: IDL.Nat,
    staffId: IDL.Text,
    name: IDL.Text,
    role: StaffRole,
    phone: IDL.Text,
    email: IDL.Text,
    department: IDL.Text,
    joinDate: IDL.Int,
    address: IDL.Text,
    createdAt: IDL.Int,
  });
  const DashboardStats = IDL.Record({
    totalCustomers: IDL.Nat,
    totalOrders: IDL.Nat,
    pendingOrders: IDL.Nat,
    inProductionOrders: IDL.Nat,
    readyOrders: IDL.Nat,
    deliveredOrders: IDL.Nat,
    monthlyRevenue: IDL.Float64,
    todayAppointments: IDL.Nat,
  });
  return IDL.Service({
    seedData: IDL.Func([], [], []),
    getCustomers: IDL.Func([], [IDL.Vec(Customer)], ['query']),
    getCustomer: IDL.Func([IDL.Nat], [IDL.Opt(Customer)], ['query']),
    addCustomer: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(Measurements)], [Customer], []),
    updateCustomer: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(Measurements)], [IDL.Bool], []),
    deleteCustomer: IDL.Func([IDL.Nat], [IDL.Bool], []),
    getOrders: IDL.Func([], [IDL.Vec(Order)], ['query']),
    getOrdersByCustomer: IDL.Func([IDL.Nat], [IDL.Vec(Order)], ['query']),
    addOrder: IDL.Func([IDL.Nat, IDL.Text, GarmentType, IDL.Text, IDL.Text, IDL.Nat, IDL.Float64, IDL.Float64, IDL.Int, IDL.Text], [Order], []),
    updateOrderStatus: IDL.Func([IDL.Nat, OrderStatus], [IDL.Bool], []),
    deleteOrder: IDL.Func([IDL.Nat], [IDL.Bool], []),
    getAppointments: IDL.Func([], [IDL.Vec(Appointment)], ['query']),
    addAppointment: IDL.Func([IDL.Nat, IDL.Text, IDL.Int, AppointmentType, IDL.Text], [Appointment], []),
    updateAppointmentStatus: IDL.Func([IDL.Nat, AppointmentStatus], [IDL.Bool], []),
    deleteAppointment: IDL.Func([IDL.Nat], [IDL.Bool], []),
    getInventory: IDL.Func([], [IDL.Vec(FabricInventory)], ['query']),
    addInventoryItem: IDL.Func([IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Text, IDL.Float64], [FabricInventory], []),
    updateInventoryItem: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Text, IDL.Float64], [IDL.Bool], []),
    deleteInventoryItem: IDL.Func([IDL.Nat], [IDL.Bool], []),
    getInvoices: IDL.Func([], [IDL.Vec(Invoice)], ['query']),
    createInvoice: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text], [Invoice], []),
    updateInvoicePayment: IDL.Func([IDL.Nat, PaymentStatus], [IDL.Bool], []),
    getStaff: IDL.Func([], [IDL.Vec(Staff)], ['query']),
    addStaff: IDL.Func([IDL.Text, StaffRole, IDL.Text, IDL.Text, IDL.Text, IDL.Int, IDL.Text], [Staff], []),
    updateStaff: IDL.Func([IDL.Nat, IDL.Text, StaffRole, IDL.Text, IDL.Text, IDL.Text, IDL.Int, IDL.Text], [IDL.Bool], []),
    deleteStaff: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setStaffPassword: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    verifyStaffPassword: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    hasStaffPassword: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    deleteStaffCredentials: IDL.Func([IDL.Text], [], []),
    getOwnerPassword: IDL.Func([], [IDL.Text], ['query']),
    setOwnerPassword: IDL.Func([IDL.Text], [IDL.Bool], []),
    getDashboardStats: IDL.Func([], [DashboardStats], ['query']),
    addCustomerPhoto: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    getCustomerPhotos: IDL.Func([IDL.Nat], [IDL.Vec(IDL.Text)], ['query']),
    deleteCustomerPhoto: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
