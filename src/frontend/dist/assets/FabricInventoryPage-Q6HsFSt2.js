import { r as reactExports, b as backend, j as jsxRuntimeExports } from "./index-BKtvsG8Z.js";
import { B as Button, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, d as DialogFooter } from "./input-CFmIcUl7.js";
import { C as Card, a as CardContent } from "./card-BMuEzBa3.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DbJbCY2k.js";
import { f as fmt } from "./helpers-DPF4kehq.js";
function FabricInventoryPage() {
  const [items, setItems] = reactExports.useState([]);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editItem, setEditItem] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    fabricName: "",
    color: "",
    quantityMeters: "",
    pricePerMeter: "",
    supplier: "",
    reorderLevel: ""
  });
  const load = reactExports.useCallback(() => backend.getInventory().then(setItems), []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const openAdd = () => {
    setEditItem(null);
    setForm({
      fabricName: "",
      color: "",
      quantityMeters: "",
      pricePerMeter: "",
      supplier: "",
      reorderLevel: ""
    });
    setShowAdd(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      fabricName: item.fabricName,
      color: item.color,
      quantityMeters: String(item.quantityMeters),
      pricePerMeter: String(item.pricePerMeter),
      supplier: item.supplier,
      reorderLevel: String(item.reorderLevel)
    });
    setShowAdd(true);
  };
  const save = async () => {
    const f = Number.parseFloat;
    const s = form;
    if (editItem) {
      await backend.updateInventoryItem(
        editItem.id,
        s.fabricName,
        s.color,
        f(s.quantityMeters) || 0,
        f(s.pricePerMeter) || 0,
        s.supplier,
        f(s.reorderLevel) || 0
      );
    } else {
      await backend.addInventoryItem(
        s.fabricName,
        s.color,
        f(s.quantityMeters) || 0,
        f(s.pricePerMeter) || 0,
        s.supplier,
        f(s.reorderLevel) || 0
      );
    }
    setShowAdd(false);
    load();
  };
  const del = async (id) => {
    if (confirm("Delete fabric?")) {
      await backend.deleteInventoryItem(id);
      load();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Fabric Inventory" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: openAdd,
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          children: "+ Add Fabric"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Fabric" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Color" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Qty (m)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Price/m" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Supplier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Stock Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 7,
            className: "text-center text-sm text-gray-400 py-8",
            children: "No fabrics in inventory"
          }
        ) }),
        items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium", children: item.fabricName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: item.color }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-sm", children: [
            item.quantityMeters,
            "m"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-sm", children: [
            fmt(item.pricePerMeter),
            "/m"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: item.supplier }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: item.quantityMeters <= item.reorderLevel ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700", children: "Low Stock" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700", children: "In Stock" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => openEdit(item),
                className: "text-xs text-blue-600 hover:underline",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => del(item.id),
                className: "text-xs text-red-500 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, String(item.id)))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editItem ? "Edit Fabric" : "Add Fabric" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        { key: "fabricName", label: "Fabric Name", type: "text" },
        { key: "color", label: "Color", type: "text" },
        {
          key: "quantityMeters",
          label: "Quantity (m)",
          type: "number"
        },
        { key: "pricePerMeter", label: "Price/m ₹", type: "number" },
        { key: "supplier", label: "Supplier", type: "text" },
        {
          key: "reorderLevel",
          label: "Reorder Level (m)",
          type: "number"
        }
      ].map(({ key, label, type }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type,
            value: form[key],
            onChange: (e) => setForm({ ...form, [key]: e.target.value })
          }
        )
      ] }, key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: save,
            children: "Save"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  FabricInventoryPage as default
};
