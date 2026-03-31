import { useEffect, useState } from "react";
import { backend } from "../actor";
import { StatusBadge } from "../components/StatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  apptStatusKey,
  apptTypeKey,
  fmt,
  fmtDate,
  fmtDateTime,
  garmentKey,
  orderStatusKey,
} from "../lib/helpers";
import type { Appointment, DashboardStats, Order } from "../tailor-types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    Promise.all([
      backend.getDashboardStats(),
      backend.getOrders(),
      backend.getAppointments(),
    ]).then(([s, o, a]) => {
      setStats(s);
      setOrders(o.slice(-5).reverse());
      setAppointments(
        a.filter((x) => apptStatusKey(x.status) === "Scheduled").slice(0, 5),
      );
    });
  }, []);

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

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
    "Dec",
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {today.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 md:gap-6">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card
              className="border-0 shadow-sm"
              style={{ background: "#DFF3E6" }}
            >
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-[#111827] mt-1">
                  {stats ? Number(stats.totalCustomers) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Registered</p>
              </CardContent>
            </Card>
            <Card
              className="border-0 shadow-sm"
              style={{ background: "#FFF2CC" }}
            >
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-[#111827] mt-1">
                  {stats ? Number(stats.pendingOrders) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting start</p>
              </CardContent>
            </Card>
            <Card
              className="border-0 shadow-sm"
              style={{ background: "#E7E0FF" }}
            >
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  In Production
                </p>
                <p className="text-3xl font-bold text-[#111827] mt-1">
                  {stats ? Number(stats.inProductionOrders) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Being stitched</p>
              </CardContent>
            </Card>
            <Card
              className="border-0 shadow-sm"
              style={{ background: "#DCEEFF" }}
            >
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-[#111827] mt-1">
                  {stats ? fmt(stats.monthlyRevenue) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-[#111827]">
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs">Date/Time</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-sm text-gray-400 py-6"
                      >
                        No upcoming appointments
                      </TableCell>
                    </TableRow>
                  )}
                  {appointments.map((a) => (
                    <TableRow key={String(a.id)}>
                      <TableCell className="text-xs">
                        {fmtDateTime(a.dateTime)}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {a.customerName}
                      </TableCell>
                      <TableCell className="text-xs">
                        {apptTypeKey(a.appointmentType)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={apptStatusKey(a.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-[#111827]">
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs">Order #</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs">Garment</TableHead>
                    <TableHead className="text-xs">Due Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-sm text-gray-400 py-6"
                      >
                        No orders yet
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map((o) => (
                    <TableRow key={String(o.id)}>
                      <TableCell className="text-xs font-mono">
                        #{String(o.id).padStart(3, "0")}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {o.customerName}
                      </TableCell>
                      <TableCell className="text-xs">
                        {garmentKey(o.garmentType)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {fmtDate(o.dueDate)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={orderStatusKey(o.status)} />
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        {fmt(o.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Calendar */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => {
                    if (calMonth === 0) {
                      setCalMonth(11);
                      setCalYear((y) => y - 1);
                    } else setCalMonth((m) => m - 1);
                  }}
                  className="text-gray-400 hover:text-gray-700 text-lg"
                >
                  ‹
                </button>
                <span className="text-sm font-semibold text-[#111827]">
                  {monthNames[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (calMonth === 11) {
                      setCalMonth(0);
                      setCalYear((y) => y + 1);
                    } else setCalMonth((m) => m + 1);
                  }}
                  className="text-gray-400 hover:text-gray-700 text-lg"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div
                    key={d}
                    className="text-[10px] font-semibold text-gray-400 py-1"
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDay }, (_v, i) => `empty-${i}`).map(
                  (k) => (
                    <div key={k} />
                  ),
                )}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isToday =
                    day === today.getDate() &&
                    calMonth === today.getMonth() &&
                    calYear === today.getFullYear();
                  return (
                    <div
                      key={day}
                      className={`text-xs py-1 rounded-full flex items-center justify-center w-6 h-6 mx-auto ${
                        isToday
                          ? "bg-[#1F7E78] text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-[#111827]">
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {stats &&
                [
                  {
                    label: "Pending",
                    count: Number(stats.pendingOrders),
                    color: "#F59E0B",
                  },
                  {
                    label: "In Production",
                    count: Number(stats.inProductionOrders),
                    color: "#3B82F6",
                  },
                  {
                    label: "Ready for Pickup",
                    count: Number(stats.readyOrders),
                    color: "#10B981",
                  },
                  {
                    label: "Delivered",
                    count: Number(stats.deliveredOrders),
                    color: "#6B7280",
                  },
                ].map(({ label, count, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: color }}
                      />
                      <span className="text-xs text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-[#111827]">
                      {count}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
