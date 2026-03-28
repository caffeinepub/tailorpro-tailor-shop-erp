import { r as reactExports, b as backend, j as jsxRuntimeExports } from "./index-BKtvsG8Z.js";
import { S as StatusBadge } from "./StatusBadge-BLrMRFeS.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BMuEzBa3.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DbJbCY2k.js";
import { a as apptStatusKey, f as fmt, b as fmtDateTime, c as apptTypeKey, g as garmentKey, d as fmtDate, o as orderStatusKey } from "./helpers-DPF4kehq.js";
function DashboardPage() {
  const [stats, setStats] = reactExports.useState(null);
  const [orders, setOrders] = reactExports.useState([]);
  const [appointments, setAppointments] = reactExports.useState([]);
  reactExports.useEffect(() => {
    Promise.all([
      backend.getDashboardStats(),
      backend.getOrders(),
      backend.getAppointments()
    ]).then(([s, o, a]) => {
      setStats(s);
      setOrders(o.slice(-5).reverse());
      setAppointments(
        a.filter((x) => apptStatusKey(x.status) === "Scheduled").slice(0, 5)
      );
    });
  }, []);
  const today = /* @__PURE__ */ new Date();
  const [calMonth, setCalMonth] = reactExports.useState(today.getMonth());
  const [calYear, setCalYear] = reactExports.useState(today.getFullYear());
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: today.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_300px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-0 shadow-sm",
              style: { background: "#DFF3E6" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "Total Customers" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-[#111827] mt-1", children: stats ? Number(stats.totalCustomers) : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Registered" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-0 shadow-sm",
              style: { background: "#FFF2CC" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "Pending Orders" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-[#111827] mt-1", children: stats ? Number(stats.pendingOrders) : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Awaiting start" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-0 shadow-sm",
              style: { background: "#E7E0FF" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "In Production" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-[#111827] mt-1", children: stats ? Number(stats.inProductionOrders) : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Being stitched" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-0 shadow-sm",
              style: { background: "#DCEEFF" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "Monthly Revenue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[#111827] mt-1", children: stats ? fmt(stats.monthlyRevenue) : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Last 30 days" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-0 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-[#111827]", children: "Upcoming Appointments" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Date/Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
              appointments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableCell,
                {
                  colSpan: 4,
                  className: "text-center text-sm text-gray-400 py-6",
                  children: "No upcoming appointments"
                }
              ) }),
              appointments.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmtDateTime(a.dateTime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-medium", children: a.customerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: apptTypeKey(a.appointmentType) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: apptStatusKey(a.status) }) })
              ] }, String(a.id)))
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-0 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-[#111827]", children: "Recent Orders" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Order #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Garment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Total" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
              orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableCell,
                {
                  colSpan: 6,
                  className: "text-center text-sm text-gray-400 py-6",
                  children: "No orders yet"
                }
              ) }),
              orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs font-mono", children: [
                  "#",
                  String(o.id).padStart(3, "0")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-medium", children: o.customerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: garmentKey(o.garmentType) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmtDate(o.dueDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: orderStatusKey(o.status) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-semibold", children: fmt(o.price) })
              ] }, String(o.id)))
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear((y) => y - 1);
                  } else setCalMonth((m) => m - 1);
                },
                className: "text-gray-400 hover:text-gray-700 text-lg",
                children: "‹"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-[#111827]", children: [
              monthNames[calMonth],
              " ",
              calYear
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear((y) => y + 1);
                  } else setCalMonth((m) => m + 1);
                },
                className: "text-gray-400 hover:text-gray-700 text-lg",
                children: "›"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-0.5 text-center", children: [
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[10px] font-semibold text-gray-400 py-1",
                children: d
              },
              d
            )),
            Array.from({ length: firstDay }, (_v, i) => `empty-${i}`).map(
              (k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, k)
            ),
            Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-xs py-1 rounded-full flex items-center justify-center w-6 h-6 mx-auto ${isToday ? "bg-[#1F7E78] text-white font-bold" : "text-gray-700 hover:bg-gray-100"}`,
                  children: day
                },
                day
              );
            })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-0 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-[#111827]", children: "Order Status" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: stats && [
            {
              label: "Pending",
              count: Number(stats.pendingOrders),
              color: "#F59E0B"
            },
            {
              label: "In Production",
              count: Number(stats.inProductionOrders),
              color: "#3B82F6"
            },
            {
              label: "Ready for Pickup",
              count: Number(stats.readyOrders),
              color: "#10B981"
            },
            {
              label: "Delivered",
              count: Number(stats.deliveredOrders),
              color: "#6B7280"
            }
          ].map(({ label, count, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between py-2 border-b border-gray-100 last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2 h-2 rounded-full",
                      style: { background: color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-700", children: label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#111827]", children: count })
              ]
            },
            label
          )) })
        ] })
      ] })
    ] })
  ] });
}
export {
  DashboardPage as default
};
