import { Suspense, lazy, useEffect, useState } from "react";
import { backend } from "./actor";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const MeasurementsPage = lazy(() => import("./pages/MeasurementsPage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const FabricInventoryPage = lazy(() => import("./pages/FabricInventoryPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));

type NavItem =
  | "Dashboard"
  | "Customers"
  | "Orders"
  | "Measurements"
  | "Appointments"
  | "Inventory"
  | "Billing"
  | "Staff";

const navItems: { label: NavItem; icon: string }[] = [
  { label: "Dashboard", icon: "📊" },
  { label: "Customers", icon: "👥" },
  { label: "Orders", icon: "📋" },
  { label: "Measurements", icon: "📏" },
  { label: "Appointments", icon: "📅" },
  { label: "Inventory", icon: "🧵" },
  { label: "Billing", icon: "💰" },
  { label: "Staff", icon: "🪪" },
];

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7E78]" />
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>("Dashboard");

  useEffect(() => {
    if (!localStorage.getItem("tailorpro_seeded")) {
      backend
        .seedData()
        .then(() => localStorage.setItem("tailorpro_seeded", "1"));
    }
  }, []);

  return (
    <div
      className="h-screen flex flex-col"
      style={{ fontFamily: "Inter, Segoe UI, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ background: "#0F2233" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">✂️</span>
          <span className="text-white font-bold text-xl tracking-tight">
            TailorPro
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1F7E78] flex items-center justify-center text-white text-sm font-bold">
            T
          </div>
          <span className="text-[#EAF0F6] text-sm">Shop Owner</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[220px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          <nav className="py-4">
            {navItems.map(({ label, icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                  activeNav === label
                    ? "bg-[#EEF2F5] text-[#1F7E78] border-r-2 border-[#1F7E78]"
                    : "text-[#374151] hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6F8] p-6">
          <Suspense fallback={<PageLoader />}>
            {activeNav === "Dashboard" && <DashboardPage />}
            {activeNav === "Customers" && <CustomersPage />}
            {activeNav === "Orders" && <OrdersPage />}
            {activeNav === "Measurements" && <MeasurementsPage />}
            {activeNav === "Appointments" && <AppointmentsPage />}
            {activeNav === "Inventory" && <FabricInventoryPage />}
            {activeNav === "Billing" && <BillingPage />}
            {activeNav === "Staff" && <StaffPage />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
