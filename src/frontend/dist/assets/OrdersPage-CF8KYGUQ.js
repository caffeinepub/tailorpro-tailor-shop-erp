import { r as reactExports, b as backend, j as jsxRuntimeExports } from "./index-BKtvsG8Z.js";
import { S as StatusBadge } from "./StatusBadge-BLrMRFeS.js";
import { B as Button, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, d as DialogFooter } from "./input-CFmIcUl7.js";
import { C as Card, a as CardContent } from "./card-BMuEzBa3.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtldO34S.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DbJbCY2k.js";
import { o as orderStatusKey, g as garmentKey, d as fmtDate, f as fmt } from "./helpers-DPF4kehq.js";
function OrdersPage() {
  const [orders, setOrders] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("All");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    customerId: "",
    garmentType: "Shirt",
    fabricName: "",
    fabricColor: "",
    quantity: "1",
    price: "",
    advancePaid: "0",
    dueDate: "",
    notes: ""
  });
  const load = reactExports.useCallback(() => {
    Promise.all([backend.getOrders(), backend.getCustomers()]).then(
      ([o, c]) => {
        setOrders(o);
        setCustomers(c);
      }
    );
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const garmentOptions = [
    "Shirt",
    "Trouser",
    "Suit",
    "Kurti",
    "Blouse",
    "Other"
  ];
  const statusOptions = [
    "All",
    "Pending",
    "InProduction",
    "Ready",
    "Delivered",
    "Cancelled"
  ];
  const nextStatus = {
    Pending: { InProduction: null },
    InProduction: { Ready: null },
    Ready: { Delivered: null }
  };
  const filtered = reactExports.useMemo(
    () => filter === "All" ? orders : orders.filter((o) => orderStatusKey(o.status) === filter),
    [orders, filter]
  );
  const addOrder = async () => {
    const cust = customers.find((c) => String(c.id) === form.customerId);
    if (!cust) return;
    const gt = { [form.garmentType]: null };
    await backend.addOrder(
      cust.id,
      cust.name,
      gt,
      form.fabricName,
      form.fabricColor,
      BigInt(Number.parseInt(form.quantity) || 1),
      Number.parseFloat(form.price) || 0,
      Number.parseFloat(form.advancePaid) || 0,
      BigInt(new Date(form.dueDate).getTime()) * 1000000n,
      form.notes
    );
    setShowAdd(false);
    load();
  };
  const updateStatus = async (o) => {
    const ns = nextStatus[orderStatusKey(o.status)];
    if (ns) {
      await backend.updateOrderStatus(o.id, ns);
      load();
    }
  };
  const del = async (id) => {
    if (confirm("Delete order?")) {
      await backend.deleteOrder(id);
      load();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setShowAdd(true),
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          children: "+ New Order"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4", children: statusOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setFilter(s),
        className: `px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filter === s ? "bg-[#1F7E78] text-white border-[#1F7E78]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`,
        children: s === "InProduction" ? "In Production" : s
      },
      s
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Order #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Garment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Fabric" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 8,
            className: "text-center text-sm text-gray-400 py-8",
            children: "No orders"
          }
        ) }),
        filtered.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs font-mono", children: [
            "#",
            String(o.id).padStart(3, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium", children: o.customerName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: garmentKey(o.garmentType) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs", children: [
            o.fabricName,
            " — ",
            o.fabricColor
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmtDate(o.dueDate) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: orderStatusKey(o.status) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-semibold", children: fmt(o.price) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            nextStatus[orderStatusKey(o.status)] && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => updateStatus(o),
                className: "text-xs text-[#1F7E78] hover:underline",
                children: "Advance"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => del(o.id),
                className: "text-xs text-red-500 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, String(o.id)))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Order" }) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Garment Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.garmentType,
                onValueChange: (v) => setForm({ ...form, garmentType: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: garmentOptions.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g, children: g }, g)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "1",
                value: form.quantity,
                onChange: (e) => setForm({ ...form, quantity: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Fabric Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.fabricName,
                onChange: (e) => setForm({ ...form, fabricName: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Fabric Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.fabricColor,
                onChange: (e) => setForm({ ...form, fabricColor: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Total Price ₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: form.price,
                onChange: (e) => setForm({ ...form, price: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Advance Paid ₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: form.advancePaid,
                onChange: (e) => setForm({ ...form, advancePaid: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.dueDate,
                onChange: (e) => setForm({ ...form, dueDate: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.notes,
                onChange: (e) => setForm({ ...form, notes: e.target.value })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: addOrder,
            children: "Create Order"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  OrdersPage as default
};
