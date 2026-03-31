import { j as jsxRuntimeExports } from "./index-M5PwgKS4.js";
function StatusBadge({ status }) {
  const colors = {
    Pending: "bg-amber-100 text-amber-800",
    InProduction: "bg-blue-100 text-blue-800",
    Ready: "bg-green-100 text-green-800",
    Delivered: "bg-gray-100 text-gray-700",
    Cancelled: "bg-red-100 text-red-700",
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Unpaid: "bg-red-100 text-red-700",
    PartiallyPaid: "bg-amber-100 text-amber-800",
    Paid: "bg-green-100 text-green-800"
  };
  const labels = {
    InProduction: "In Production",
    PartiallyPaid: "Partial"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-700"}`,
      children: labels[status] || status
    }
  );
}
export {
  StatusBadge as S
};
