import { r as reactExports, b as backend, j as jsxRuntimeExports } from "./index-DYsB4f9N.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BEV3lXmT.js";
function MeasurementsPage() {
  const [customers, setCustomers] = reactExports.useState([]);
  reactExports.useEffect(() => {
    backend.getCustomers().then(setCustomers);
  }, []);
  const mFields = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeveLength", label: "Sleeve" },
    { key: "shirtLength", label: "Shirt L." },
    { key: "trouserLength", label: "Trouser L." },
    { key: "neck", label: "Neck" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827] mb-6", children: "Measurements" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 xl:grid-cols-3 gap-4", children: customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-0 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: c.phone })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: c.measurements[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: mFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: f.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#111827]", children: c.measurements[0][f.key] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-300", children: "cm" })
      ] }, f.key)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 italic", children: "No measurements recorded" }) })
    ] }, String(c.id))) })
  ] });
}
export {
  MeasurementsPage as default
};
