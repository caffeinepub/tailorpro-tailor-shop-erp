import { Suspense, lazy, useEffect, useState } from "react";
import { backend } from "./actor";
import { sessionGet, sessionRemove, sessionSet } from "./lib/sessionStore";
import StaffLoginPage, { type LoginResult } from "./pages/StaffLoginPage";
import type { Staff } from "./tailor-types";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const MeasurementsPage = lazy(() => import("./pages/MeasurementsPage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const FabricInventoryPage = lazy(() => import("./pages/FabricInventoryPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const OwnerSettingsPage = lazy(() => import("./pages/OwnerSettingsPage"));

type NavItem =
  | "Dashboard"
  | "Customers"
  | "Orders"
  | "Measurements"
  | "Appointments"
  | "Inventory"
  | "Billing"
  | "Staff"
  | "Settings";

const staffNavItems: { label: NavItem; icon: string }[] = [
  { label: "Dashboard", icon: "📊" },
  { label: "Customers", icon: "👥" },
  { label: "Orders", icon: "📋" },
  { label: "Measurements", icon: "📏" },
  { label: "Appointments", icon: "📅" },
  { label: "Inventory", icon: "🧵" },
  { label: "Billing", icon: "💰" },
];

const ownerNavItems: { label: NavItem; icon: string }[] = [
  { label: "Dashboard", icon: "📊" },
  { label: "Customers", icon: "👥" },
  { label: "Orders", icon: "📋" },
  { label: "Measurements", icon: "📏" },
  { label: "Appointments", icon: "📅" },
  { label: "Inventory", icon: "🧵" },
  { label: "Billing", icon: "💰" },
  { label: "Staff", icon: "🪪" },
  { label: "Settings", icon: "⚙️" },
];

// Bottom tab bar items (max 5, last one is "More")
const bottomTabItems: { label: NavItem; icon: string }[] = [
  { label: "Dashboard", icon: "📊" },
  { label: "Customers", icon: "👥" },
  { label: "Orders", icon: "📋" },
  { label: "Billing", icon: "💰" },
];

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7E78]" />
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>("Dashboard");
  const [loggedInStaff, setLoggedInStaff] = useState<Staff | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerName, setOwnerName] = useState("Shop Owner");
  const [isInitializing, setIsInitializing] = useState(true);
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Read sessions from persistent IndexedDB store (falls back to localStorage)
      const ownerSession = await sessionGet("tailorpro_owner_session");
      if (ownerSession) {
        try {
          const parsed = JSON.parse(ownerSession);
          setIsOwner(true);
          setOwnerName(parsed.name || "Shop Owner");
        } catch {
          await sessionRemove("tailorpro_owner_session");
        }
      } else {
        const session = await sessionGet("tailorpro_staff_session");
        if (session) {
          try {
            const parsed = JSON.parse(session);
            setLoggedInStaff(parsed as Staff);
          } catch {
            await sessionRemove("tailorpro_staff_session");
          }
        }
      }
      setIsInitializing(false);
      const seeded = await sessionGet("tailorpro_seeded");
      if (!seeded) {
        backend
          .seedData()
          .then(async () => {
            await sessionSet("tailorpro_seeded", "1");
          })
          .catch(() => {});
      }
    };
    init();
  }, []);

  const handleLogin = async (result: LoginResult) => {
    if (result.role === "owner") {
      const name = result.ownerName || "Shop Owner";
      await sessionSet("tailorpro_owner_session", JSON.stringify({ name }));
      setIsOwner(true);
      setOwnerName(name);
    } else if (result.staff) {
      await sessionSet(
        "tailorpro_staff_session",
        JSON.stringify({
          id: String(result.staff.id),
          name: result.staff.name,
          phone: result.staff.phone,
        }),
      );
      setLoggedInStaff(result.staff);
    }
  };

  const handleLogout = async () => {
    await sessionRemove("tailorpro_owner_session");
    await sessionRemove("tailorpro_staff_session");
    setLoggedInStaff(null);
    setIsOwner(false);
    setActiveNav("Dashboard");
  };

  const navigateTo = (item: NavItem) => {
    setActiveNav(item);
    setShowMoreDrawer(false);
  };

  if (isInitializing) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#0F2233" }}
      >
        <img
          src="/assets/generated/ali-tailor-icon-transparent.dim_512x512.png"
          alt="Ali Tailor"
          className="w-20 h-20 rounded-2xl shadow-lg"
        />
        <span className="text-white font-bold text-2xl tracking-tight">
          Ali Tailor
        </span>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1F7E78] mt-2" />
      </div>
    );
  }

  const isLoggedIn = isOwner || loggedInStaff !== null;

  if (!isLoggedIn) {
    return <StaffLoginPage onLogin={handleLogin} />;
  }

  const displayName = isOwner ? ownerName : (loggedInStaff?.name ?? "");
  const navItems = isOwner ? ownerNavItems : staffNavItems;

  // "More" drawer items = everything not in bottomTabItems
  const moreItems = navItems.filter(
    (item) => !bottomTabItems.some((t) => t.label === item.label),
  );

  const isMoreActive = moreItems.some((item) => item.label === activeNav);

  return (
    <div
      className="h-screen flex flex-col"
      style={{ fontFamily: "Inter, Segoe UI, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 shrink-0"
        style={{ background: "#0F2233" }}
      >
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/ali-tailor-icon-transparent.dim_512x512.png"
            alt="Ali Tailor"
            className="w-7 h-7 md:w-8 md:h-8 rounded-lg"
          />
          <span className="text-white font-bold text-base md:text-xl tracking-tight">
            Ali Tailor
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {isOwner && (
            <span
              className="hidden md:inline text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#b45309", color: "#fff" }}
            >
              👑 Owner
            </span>
          )}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: isOwner ? "#b45309" : "#1F7E78" }}
          >
            {isOwner && <span className="text-xs">👑</span>}
            {!isOwner && getInitials(displayName)}
          </div>
          <span className="hidden md:block text-[#EAF0F6] text-sm">
            {displayName}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="header.button"
            className="text-xs px-2.5 md:px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:flex w-[220px] bg-white border-r border-gray-200 flex-col shrink-0 overflow-y-auto">
          <nav className="py-4">
            {navItems.map(({ label, icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => navigateTo(label)}
                data-ocid={`nav.${label.toLowerCase()}.link`}
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
          <div className="mt-auto px-4 pb-4">
            <div
              className="rounded-lg px-3 py-2 text-center text-xs font-semibold"
              style={{
                background: isOwner ? "#fef3c7" : "#e6f7f6",
                color: isOwner ? "#92400e" : "#1F7E78",
              }}
            >
              {isOwner ? "👑 Owner Access" : "👤 Staff Access"}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6F8] px-3 py-4 md:p-6 pb-24 md:pb-6">
          <Suspense fallback={<PageLoader />}>
            {activeNav === "Dashboard" && <DashboardPage />}
            {activeNav === "Customers" && <CustomersPage />}
            {activeNav === "Orders" && <OrdersPage />}
            {activeNav === "Measurements" && <MeasurementsPage />}
            {activeNav === "Appointments" && <AppointmentsPage />}
            {activeNav === "Inventory" && <FabricInventoryPage />}
            {activeNav === "Billing" && <BillingPage />}
            {activeNav === "Staff" && isOwner && <StaffPage />}
            {activeNav === "Settings" && isOwner && <OwnerSettingsPage />}
          </Suspense>
        </main>
      </div>

      {/* Bottom Tab Bar — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-stretch z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {bottomTabItems.map(({ label, icon }) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => navigateTo(label)}
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors"
              style={{ color: isActive ? "#1F7E78" : "#9CA3AF" }}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? "#1F7E78" : "#9CA3AF" }}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 w-10 h-0.5 rounded-t-full"
                  style={{ background: "#1F7E78" }}
                />
              )}
            </button>
          );
        })}

        {/* More tab */}
        <button
          type="button"
          onClick={() => setShowMoreDrawer((v) => !v)}
          data-ocid="nav.more.button"
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors relative"
          style={{
            color: isMoreActive || showMoreDrawer ? "#1F7E78" : "#9CA3AF",
          }}
        >
          <span className="text-xl leading-none">☰</span>
          <span
            className="text-[10px] font-semibold leading-none"
            style={{
              color: isMoreActive || showMoreDrawer ? "#1F7E78" : "#9CA3AF",
            }}
          >
            More
          </span>
          {(isMoreActive || showMoreDrawer) && (
            <span
              className="absolute bottom-0 w-10 h-0.5 rounded-t-full"
              style={{ background: "#1F7E78" }}
            />
          )}
        </button>
      </nav>

      {/* More Drawer — slide up overlay */}
      {showMoreDrawer && (
        <>
          {/* Backdrop */}
          <div
            role="presentation"
            onKeyDown={() => setShowMoreDrawer(false)}
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowMoreDrawer(false)}
          />
          {/* Drawer panel */}
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 pb-safe"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 72px)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-semibold text-gray-700 text-sm">More</span>
              <button
                type="button"
                onClick={() => setShowMoreDrawer(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="py-2">
              {moreItems.map(({ label, icon }) => {
                const isActive = activeNav === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => navigateTo(label)}
                    data-ocid={`nav.more.${label.toLowerCase()}.link`}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#f0fdfb] text-[#1F7E78]"
                        : "text-[#374151] hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                    {isActive && (
                      <span
                        className="ml-auto w-2 h-2 rounded-full"
                        style={{ background: "#1F7E78" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
