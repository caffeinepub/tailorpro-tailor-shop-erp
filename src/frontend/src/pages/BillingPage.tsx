import { useCallback, useEffect, useState } from "react";
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
import { fmt, garmentKey, paymentStatusKey } from "../lib/helpers";
import type { Invoice, Order } from "../tailor-types";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    orderId: "",
    subtotal: "",
    discount: "0",
    tax: "0",
    paymentMethod: "Cash",
  });

  const load = useCallback(() => {
    Promise.all([backend.getInvoices(), backend.getOrders()]).then(
      ([inv, ord]) => {
        setInvoices(inv);
        setOrders(ord);
      },
    );
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const total = () => {
    const s = Number.parseFloat(form.subtotal) || 0;
    const d = Number.parseFloat(form.discount) || 0;
    const t = Number.parseFloat(form.tax) || 0;
    return s - d + t;
  };

  const createInv = async () => {
    const order = orders.find((o) => String(o.id) === form.orderId);
    if (!order) return;
    const s = Number.parseFloat(form.subtotal) || 0;
    const d = Number.parseFloat(form.discount) || 0;
    const t = Number.parseFloat(form.tax) || 0;
    await backend.createInvoice(
      order.id,
      order.customerId,
      order.customerName,
      s,
      d,
      t,
      total(),
      form.paymentMethod,
    );
    setShowAdd(false);
    load();
  };

  const markPaid = async (id: bigint) => {
    await backend.updateInvoicePayment(id, { Paid: null });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">
          Billing & Invoices
        </h1>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
        >
          + Create Invoice
        </Button>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs">Invoice #</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Order #</TableHead>
                <TableHead className="text-xs">Subtotal</TableHead>
                <TableHead className="text-xs">Discount</TableHead>
                <TableHead className="text-xs">Tax</TableHead>
                <TableHead className="text-xs">Total</TableHead>
                <TableHead className="text-xs">Payment</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-sm text-gray-400 py-8"
                  >
                    No invoices yet
                  </TableCell>
                </TableRow>
              )}
              {invoices.map((inv) => (
                <TableRow key={String(inv.id)}>
                  <TableCell className="text-xs font-mono">
                    INV-{String(inv.id).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {inv.customerName}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    #{String(inv.orderId).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="text-xs">{fmt(inv.subtotal)}</TableCell>
                  <TableCell className="text-xs text-green-600">
                    -{fmt(inv.discount)}
                  </TableCell>
                  <TableCell className="text-xs">{fmt(inv.tax)}</TableCell>
                  <TableCell className="text-sm font-bold">
                    {fmt(inv.total)}
                  </TableCell>
                  <TableCell className="text-xs">{inv.paymentMethod}</TableCell>
                  <TableCell>
                    <StatusBadge status={paymentStatusKey(inv.paymentStatus)} />
                  </TableCell>
                  <TableCell>
                    {paymentStatusKey(inv.paymentStatus) !== "Paid" && (
                      <button
                        type="button"
                        onClick={() => markPaid(inv.id)}
                        className="text-xs text-[#1F7E78] hover:underline"
                      >
                        Mark Paid
                      </button>
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
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">
                Order *
              </p>
              <Select
                value={form.orderId}
                onValueChange={(v) => {
                  const o = orders.find((x) => String(x.id) === v);
                  setForm({
                    ...form,
                    orderId: v,
                    subtotal: o ? String(o.price) : "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((o) => (
                    <SelectItem key={String(o.id)} value={String(o.id)}>
                      #{String(o.id).padStart(3, "0")} — {o.customerName} (
                      {garmentKey(o.garmentType)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Subtotal ₹
                </p>
                <Input
                  type="number"
                  value={form.subtotal}
                  onChange={(e) =>
                    setForm({ ...form, subtotal: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Discount ₹
                </p>
                <Input
                  type="number"
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Tax ₹
                </p>
                <Input
                  type="number"
                  value={form.tax}
                  onChange={(e) => setForm({ ...form, tax: e.target.value })}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Total ₹
                </p>
                <Input readOnly value={total()} className="bg-gray-50" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">
                Payment Method
              </p>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) => setForm({ ...form, paymentMethod: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Cash", "UPI", "Card", "Bank Transfer", "Cheque"].map(
                    (p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1F7E78] hover:bg-[#166661] text-white"
              onClick={createInv}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
