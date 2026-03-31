import { r as reactExports, b as backend, j as jsxRuntimeExports, B as Button, I as Input } from "./index-M5PwgKS4.js";
import { S as StatusBadge } from "./StatusBadge-Cfdjprzr.js";
import { C as Card, a as CardContent } from "./card-D7SZlqe_.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CKXUgKlm.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-tAJi8ZSV.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-MHekgm6M.js";
import { T as Textarea } from "./textarea-CCrb5obM.js";
import { o as orderStatusKey, g as garmentKey, d as fmtDate, f as fmt } from "./helpers-DPF4kehq.js";
import "./index-y8B0-M1o.js";
function WhatsAppIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      width: "14",
      height: "14",
      fill: "currentColor",
      role: "img",
      "aria-label": "WhatsApp",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 2C8.268 2 2 8.268 2 16c0 2.478.658 4.8 1.805 6.805L2 30l7.418-1.775A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.844-1.604l-.418-.248-4.404 1.054 1.078-4.284-.274-.44A11.463 11.463 0 0 1 4.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.598c-.344-.172-2.037-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.913-2.382-.2-.344-.021-.53.15-.701.156-.155.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.776-1.872-1.063-2.563-.28-.672-.564-.581-.776-.592l-.66-.011a1.266 1.266 0 0 0-.918.43c-.316.344-1.205 1.177-1.205 2.868s1.234 3.325 1.406 3.554c.172.23 2.43 3.71 5.888 5.204.823.355 1.466.567 1.967.726.826.263 1.578.226 2.173.137.663-.099 2.037-.832 2.324-1.635.287-.803.287-1.492.2-1.635-.086-.143-.316-.23-.66-.402z" })
    }
  );
}
function OrdersPage() {
  const [orders, setOrders] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("All");
  const [sortBy, setSortBy] = reactExports.useState("newest");
  const [newOrderCustomerSort, setNewOrderCustomerSort] = reactExports.useState("nameAZ");
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
  const [waDialog, setWaDialog] = reactExports.useState({
    open: false,
    message: "",
    phone: "",
    title: ""
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
  const filtered = reactExports.useMemo(() => {
    let list = filter === "All" ? [...orders] : orders.filter((o) => orderStatusKey(o.status) === filter);
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "oldest":
        list.sort((a, b) => Number(a.id) - Number(b.id));
        break;
      case "nameAZ":
        list.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case "nameZA":
        list.sort((a, b) => b.customerName.localeCompare(a.customerName));
        break;
    }
    return list;
  }, [orders, filter, sortBy]);
  const sortedDialogCustomers = reactExports.useMemo(() => {
    const list = [...customers];
    switch (newOrderCustomerSort) {
      case "nameAZ":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        list.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "oldest":
        list.sort((a, b) => Number(a.id) - Number(b.id));
        break;
    }
    return list;
  }, [customers, newOrderCustomerSort]);
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
  const openWhatsAppDialog = (o, type) => {
    var _a;
    const customer = customers.find(
      (c) => String(c.id) === String(o.customerId)
    );
    const phone = ((_a = customer == null ? void 0 : customer.phone) == null ? void 0 : _a.replace(/\D/g, "")) ?? "";
    const dueStr = fmtDate(o.dueDate);
    let message;
    let title;
    if (type === "ready") {
      title = "Order Ready Notification";
      message = [
        "✅ *Ali Tailor - Order Ready!*",
        "",
        `Dear ${o.customerName},`,
        "Your order is ready for pickup! 🎉",
        "",
        `Order: #${String(o.id).padStart(3, "0")}`,
        `Garment: ${garmentKey(o.garmentType)}`,
        `Fabric: ${o.fabricName}${o.fabricColor ? ` — ${o.fabricColor}` : ""}`,
        `Due Date: ${dueStr}`,
        `Amount: ₹${o.price}`,
        o.advancePaid > 0 ? `Advance Paid: ₹${o.advancePaid}` : "",
        o.advancePaid > 0 ? `Balance Due: ₹${o.price - o.advancePaid}` : "",
        "",
        "Please visit our shop to collect your garment.",
        "Thank you for choosing Ali Tailor! 🧵"
      ].filter((line) => line !== "").join("\n");
    } else {
      title = "Thank You Message";
      message = [
        "🙏 *Ali Tailor - Thank You!*",
        "",
        `Dear ${o.customerName},`,
        "Thank you for choosing Ali Tailor! 🎉",
        "",
        `Order: #${String(o.id).padStart(3, "0")}`,
        `Garment: ${garmentKey(o.garmentType)}`,
        `Fabric: ${o.fabricName}${o.fabricColor ? ` — ${o.fabricColor}` : ""}`,
        `Total: ₹${o.price}`,
        o.advancePaid > 0 ? `Paid: ₹${o.advancePaid}` : "",
        o.advancePaid > 0 && o.price - o.advancePaid > 0 ? `Balance: ₹${o.price - o.advancePaid}` : "",
        "",
        "We hope you love your new outfit! 😊",
        "Please visit us again or share with your friends.",
        "",
        "Ali Tailor 🧵"
      ].filter((line) => line !== "").join("\n");
    }
    setWaDialog({ open: true, message, phone, title });
  };
  const doSendWhatsApp = () => {
    const encoded = encodeURIComponent(waDialog.message);
    const url = waDialog.phone.length >= 10 ? `https://wa.me/91${waDialog.phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    setWaDialog({ open: false, message: "", phone: "", title: "" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setShowAdd(true),
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          "data-ocid": "orders.open_modal_button",
          children: "+ New Order"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap flex-1", children: statusOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setFilter(s),
          className: `px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filter === s ? "bg-[#1F7E78] text-white border-[#1F7E78]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`,
          children: s === "InProduction" ? "In Production" : s
        },
        s
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: sortBy,
          onValueChange: (v) => setSortBy(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-[150px] text-xs h-8",
                "data-ocid": "orders.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest First" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "oldest", children: "Oldest First" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nameAZ", children: "Name A→Z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nameZA", children: "Name Z→A" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: "480px", overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "S.No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Order #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Garment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Fabric" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 9,
          className: "text-center text-sm text-gray-400 py-8",
          "data-ocid": "orders.empty_state",
          children: "No orders"
        }
      ) }) : filtered.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-gray-500", children: idx + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs font-mono", children: [
          "#",
          String(o.id).padStart(3, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium", children: o.customerName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: garmentKey(o.garmentType) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs max-w-[120px] truncate", children: [
          o.fabricName,
          " — ",
          o.fabricColor
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmtDate(o.dueDate) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: orderStatusKey(o.status) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-semibold", children: fmt(o.price) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
          nextStatus[orderStatusKey(o.status)] && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => updateStatus(o),
              className: "text-xs text-[#1F7E78] hover:underline",
              children: "Advance"
            }
          ),
          orderStatusKey(o.status) === "Ready" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => openWhatsAppDialog(o, "ready"),
              className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors",
              title: "Notify customer on WhatsApp",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ready" })
              ]
            }
          ),
          orderStatusKey(o.status) === "Delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => openWhatsAppDialog(o, "thankyou"),
              className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors",
              title: "Send Thank You message on WhatsApp",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Thanks" })
              ]
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
      ] }, String(o.id))) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "orders.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Order" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600", children: "Customer *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: newOrderCustomerSort,
                onValueChange: (v) => setNewOrderCustomerSort(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-6 text-[10px] w-[110px] px-2 border-gray-200 text-gray-500",
                      "data-ocid": "orders.customer.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nameAZ", children: "Name A→Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nameZA", children: "Name Z→A" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest First" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "oldest", children: "Oldest First" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.customerId,
              onValueChange: (v) => setForm({ ...form, customerId: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "orders.customer.input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select customer" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-52 overflow-y-auto", children: sortedDialogCustomers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(c.id), children: c.name }, String(c.id))) })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowAdd(false),
            "data-ocid": "orders.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: addOrder,
            "data-ocid": "orders.submit_button",
            children: "Create Order"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: waDialog.open,
        onOpenChange: (open) => setWaDialog((prev) => ({ ...prev, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}) }),
            waDialog.title
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Edit the message below before sending. Changes are not saved." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 10,
                className: "w-full font-mono text-sm resize-y",
                value: waDialog.message,
                onChange: (e) => setWaDialog((prev) => ({ ...prev, message: e.target.value }))
              }
            ),
            waDialog.phone.length >= 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
              "Sending to: +91 ",
              waDialog.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setWaDialog({ open: false, message: "", phone: "", title: "" }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: doSendWhatsApp,
                className: "flex items-center gap-2 text-white",
                style: { backgroundColor: "#25D366" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}),
                  "Send on WhatsApp"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  OrdersPage as default
};
