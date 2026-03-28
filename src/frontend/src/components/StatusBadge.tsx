export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800",
    InProduction: "bg-blue-100 text-blue-800",
    Ready: "bg-green-100 text-green-800",
    Delivered: "bg-gray-100 text-gray-700",
    Cancelled: "bg-red-100 text-red-700",
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Unpaid: "bg-red-100 text-red-700",
    PartiallyPaid: "bg-amber-100 text-amber-800",
    Paid: "bg-green-100 text-green-800",
  };
  const labels: Record<string, string> = {
    InProduction: "In Production",
    PartiallyPaid: "Partial",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
