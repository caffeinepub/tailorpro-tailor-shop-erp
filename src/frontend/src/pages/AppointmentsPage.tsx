import { useCallback, useEffect, useMemo, useState } from "react";
import { backend } from "../actor";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { apptStatusKey, apptTypeKey, fmtDateTime } from "../lib/helpers";
import type { Appointment, AppointmentType, Customer } from "../tailor-types";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    dateTime: "",
    type: "Fitting",
    notes: "",
  });

  const load = useCallback(() => {
    Promise.all([backend.getAppointments(), backend.getCustomers()]).then(
      ([a, c]) => {
        setAppointments(a);
        setCustomers(c);
      },
    );
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const typeOptions = ["Measurement", "Fitting", "Delivery", "Consultation"];
  const statusOptions = ["All", "Scheduled", "Completed", "Cancelled"];

  const filtered = useMemo(
    () =>
      filter === "All"
        ? appointments
        : appointments.filter((a) => apptStatusKey(a.status) === filter),
    [appointments, filter],
  );

  const addAppt = async () => {
    const cust = customers.find((c) => String(c.id) === form.customerId);
    if (!cust || !form.dateTime) return;
    const dt = BigInt(new Date(form.dateTime).getTime()) * 1_000_000n;
    const at = { [form.type]: null } as AppointmentType;
    await backend.addAppointment(cust.id, cust.name, dt, at, form.notes);
    setShowAdd(false);
    load();
  };

  const markComplete = async (id: bigint) => {
    await backend.updateAppointmentStatus(id, { Completed: null });
    load();
  };
  const markCancel = async (id: bigint) => {
    await backend.updateAppointmentStatus(id, { Cancelled: null });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Appointments</h1>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
        >
          + New Appointment
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        {statusOptions.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              filter === s
                ? "bg-[#1F7E78] text-white border-[#1F7E78]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs">Date/Time</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Notes</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-gray-400 py-8"
                  >
                    No appointments
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((a) => (
                <TableRow key={String(a.id)}>
                  <TableCell className="text-xs">
                    {fmtDateTime(a.dateTime)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {a.customerName}
                  </TableCell>
                  <TableCell className="text-xs">
                    {apptTypeKey(a.appointmentType)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={apptStatusKey(a.status)} />
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 max-w-[150px] truncate">
                    {a.notes}
                  </TableCell>
                  <TableCell>
                    {apptStatusKey(a.status) === "Scheduled" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => markComplete(a.id)}
                          className="text-xs text-green-600 hover:underline"
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          onClick={() => markCancel(a.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">
                Customer *
              </p>
              <Select
                value={form.customerId}
                onValueChange={(v) => setForm({ ...form, customerId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">
                Date & Time
              </p>
              <Input
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">Type</p>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">
                Notes
              </p>
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1F7E78] hover:bg-[#166661] text-white"
              onClick={addAppt}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
