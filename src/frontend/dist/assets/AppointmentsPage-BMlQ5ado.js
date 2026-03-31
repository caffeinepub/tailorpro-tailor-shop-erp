import { r as reactExports, b as backend, j as jsxRuntimeExports, B as Button, I as Input } from "./index-BEkZT5E1.js";
import { S as StatusBadge } from "./StatusBadge-Bj6cGtns.js";
import { C as Card, a as CardContent } from "./card-BGMUmVPT.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-XRBr-IJ6.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CPA7Bfss.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CPgBzvW5.js";
import { a as apptStatusKey, b as fmtDateTime, c as apptTypeKey } from "./helpers-DPF4kehq.js";
import "./createLucideIcon-CtlFsITG.js";
import "./index-C6mhcshJ.js";
function AppointmentsPage() {
  const [appointments, setAppointments] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("All");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    customerId: "",
    dateTime: "",
    type: "Fitting",
    notes: ""
  });
  const load = reactExports.useCallback(() => {
    Promise.all([backend.getAppointments(), backend.getCustomers()]).then(
      ([a, c]) => {
        setAppointments(a);
        setCustomers(c);
      }
    );
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const typeOptions = ["Measurement", "Fitting", "Delivery", "Consultation"];
  const statusOptions = ["All", "Scheduled", "Completed", "Cancelled"];
  const filtered = reactExports.useMemo(
    () => filter === "All" ? appointments : appointments.filter((a) => apptStatusKey(a.status) === filter),
    [appointments, filter]
  );
  const addAppt = async () => {
    const cust = customers.find((c) => String(c.id) === form.customerId);
    if (!cust || !form.dateTime) return;
    const dt = BigInt(new Date(form.dateTime).getTime()) * 1000000n;
    const at = { [form.type]: null };
    await backend.addAppointment(cust.id, cust.name, dt, at, form.notes);
    setShowAdd(false);
    load();
  };
  const markComplete = async (id) => {
    await backend.updateAppointmentStatus(id, { Completed: null });
    load();
  };
  const markCancel = async (id) => {
    await backend.updateAppointmentStatus(id, { Cancelled: null });
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Appointments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setShowAdd(true),
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          children: "+ New Appointment"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4", children: statusOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setFilter(s),
        className: `px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filter === s ? "bg-[#1F7E78] text-white border-[#1F7E78]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`,
        children: s
      },
      s
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Date/Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 6,
            className: "text-center text-sm text-gray-400 py-8",
            children: "No appointments"
          }
        ) }),
        filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmtDateTime(a.dateTime) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium", children: a.customerName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: apptTypeKey(a.appointmentType) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: apptStatusKey(a.status) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-gray-500 max-w-[150px] truncate", children: a.notes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: apptStatusKey(a.status) === "Scheduled" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => markComplete(a.id),
                className: "text-xs text-green-600 hover:underline",
                children: "Done"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => markCancel(a.id),
                className: "text-xs text-red-500 hover:underline",
                children: "Cancel"
              }
            )
          ] }) })
        ] }, String(a.id)))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Appointment" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Customer *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.customerId,
              onValueChange: (v) => setForm({ ...form, customerId: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select customer" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(c.id), children: c.name }, String(c.id))) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Date & Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "datetime-local",
              value: form.dateTime,
              onChange: (e) => setForm({ ...form, dateTime: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.type,
              onValueChange: (v) => setForm({ ...form, type: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: typeOptions.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.notes,
              onChange: (e) => setForm({ ...form, notes: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: addAppt,
            children: "Schedule"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AppointmentsPage as default
};
