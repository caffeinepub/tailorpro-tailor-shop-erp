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
import { fmt, fmtDate, garmentKey, orderStatusKey } from "../lib/helpers";
import type {
  Customer,
  GarmentType,
  Order,
  OrderStatus,
} from "../tailor-types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    garmentType: "Shirt",
    fabricName: "",
    fabricColor: "",
    quantity: "1",
    price: "",
    advancePaid: "0",
    dueDate: "",
    notes: "",
  });

  const load = useCallback(() => {
    Promise.all([backend.getOrders(), backend.getCustomers()]).then(
      ([o, c]) => {
        setOrders(o);
        setCustomers(c);
      },
    );
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const garmentOptions = [
    "Shirt",
    "Trouser",
    "Suit",
    "Kurti",
    "Blouse",
    "Other",
  ];
  const statusOptions = [
    "All",
    "Pending",
    "InProduction",
    "Ready",
    "Delivered",
    "Cancelled",
  ];

  const nextStatus: Record<string, OrderStatus> = {
    Pending: { InProduction: null },
    InProduction: { Ready: null },
    Ready: { Delivered: null },
  };

  const filtered = useMemo(
    () =>
      filter === "All"
        ? orders
        : orders.filter((o) => orderStatusKey(o.status) === filter),
    [orders, filter],
  );

  const addOrder = async () => {
    const cust = customers.find((c) => String(c.id) === form.customerId);
    if (!cust) return;
    const gt = { [form.garmentType]: null } as GarmentType;
    await backend.addOrder(
      cust.id,
      cust.name,
      gt,
      form.fabricName,
      form.fabricColor,
      BigInt(Number.parseInt(form.quantity) || 1),
      Number.parseFloat(form.price) || 0,
      Number.parseFloat(form.advancePaid) || 0,
      BigInt(new Date(form.dueDate).getTime()) * 1_000_000n,
      form.notes,
    );
    setShowAdd(false);
    load();
  };

  const updateStatus = async (o: Order) => {
    const ns = nextStatus[orderStatusKey(o.status)];
    if (ns) {
      await backend.updateOrderStatus(o.id, ns);
      load();
    }
  };

  const del = async (id: bigint) => {
    if (confirm("Delete order?")) {
      await backend.deleteOrder(id);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Orders</h1>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
        >
          + New Order
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
            {s === "InProduction" ? "In Production" : s}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs">Order #</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Garment</TableHead>
                <TableHead className="text-xs">Fabric</TableHead>
                <TableHead className="text-xs">Due Date</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Total</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-sm text-gray-400 py-8"
                  >
                    No orders
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((o) => (
                <TableRow key={String(o.id)}>
                  <TableCell className="text-xs font-mono">
                    #{String(o.id).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {o.customerName}
                  </TableCell>
                  <TableCell className="text-xs">
                    {garmentKey(o.garmentType)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {o.fabricName} — {o.fabricColor}
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
                  <TableCell>
                    <div className="flex gap-2">
                      {nextStatus[orderStatusKey(o.status)] && (
                        <button
                          type="button"
                          onClick={() => updateStatus(o)}
                          className="text-xs text-[#1F7E78] hover:underline"
                        >
                          Advance
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => del(o.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Garment Type
                </p>
                <Select
                  value={form.garmentType}
                  onValueChange={(v) => setForm({ ...form, garmentType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {garmentOptions.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Quantity
                </p>
                <Input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Fabric Name
                </p>
                <Input
                  value={form.fabricName}
                  onChange={(e) =>
                    setForm({ ...form, fabricName: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Fabric Color
                </p>
                <Input
                  value={form.fabricColor}
                  onChange={(e) =>
                    setForm({ ...form, fabricColor: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Total Price ₹
                </p>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Advance Paid ₹
                </p>
                <Input
                  type="number"
                  value={form.advancePaid}
                  onChange={(e) =>
                    setForm({ ...form, advancePaid: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Due Date
                </p>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Notes
                </p>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1F7E78] hover:bg-[#166661] text-white"
              onClick={addOrder}
            >
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
