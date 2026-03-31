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
import { Textarea } from "../components/ui/textarea";
import { fmt, fmtDate, garmentKey, orderStatusKey } from "../lib/helpers";
import type {
  Customer,
  GarmentType,
  Order,
  OrderStatus,
} from "../tailor-types";

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="14"
      height="14"
      fill="currentColor"
      role="img"
      aria-label="WhatsApp"
    >
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.658 4.8 1.805 6.805L2 30l7.418-1.775A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.844-1.604l-.418-.248-4.404 1.054 1.078-4.284-.274-.44A11.463 11.463 0 0 1 4.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.598c-.344-.172-2.037-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.913-2.382-.2-.344-.021-.53.15-.701.156-.155.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.776-1.872-1.063-2.563-.28-.672-.564-.581-.776-.592l-.66-.011a1.266 1.266 0 0 0-.918.43c-.316.344-1.205 1.177-1.205 2.868s1.234 3.325 1.406 3.554c.172.23 2.43 3.71 5.888 5.204.823.355 1.466.567 1.967.726.826.263 1.578.226 2.173.137.663-.099 2.037-.832 2.324-1.635.287-.803.287-1.492.2-1.635-.086-.143-.316-.23-.66-.402z" />
    </svg>
  );
}

type SortOption = "newest" | "oldest" | "nameAZ" | "nameZA";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
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
  const [waDialog, setWaDialog] = useState<{
    open: boolean;
    message: string;
    phone: string;
    title: string;
  }>({
    open: false,
    message: "",
    phone: "",
    title: "",
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

  const filtered = useMemo(() => {
    let list =
      filter === "All"
        ? [...orders]
        : orders.filter((o) => orderStatusKey(o.status) === filter);

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

  const openWhatsAppDialog = (o: Order, type: "ready" | "thankyou") => {
    const customer = customers.find(
      (c) => String(c.id) === String(o.customerId),
    );
    const phone = customer?.phone?.replace(/\D/g, "") ?? "";
    const dueStr = fmtDate(o.dueDate);

    let message: string;
    let title: string;

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
        "Thank you for choosing Ali Tailor! 🧵",
      ]
        .filter((line) => line !== "")
        .join("\n");
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
        o.advancePaid > 0 && o.price - o.advancePaid > 0
          ? `Balance: ₹${o.price - o.advancePaid}`
          : "",
        "",
        "We hope you love your new outfit! 😊",
        "Please visit us again or share with your friends.",
        "",
        "Ali Tailor 🧵",
      ]
        .filter((line) => line !== "")
        .join("\n");
    }

    setWaDialog({ open: true, message, phone, title });
  };

  const doSendWhatsApp = () => {
    const encoded = encodeURIComponent(waDialog.message);
    const url =
      waDialog.phone.length >= 10
        ? `https://wa.me/91${waDialog.phone}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    setWaDialog({ open: false, message: "", phone: "", title: "" });
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

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex gap-2 flex-wrap flex-1">
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
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger className="w-[150px] text-xs h-8">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="nameAZ">Name A→Z</SelectItem>
            <SelectItem value="nameZA">Name Z→A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="px-0 py-0">
          <div style={{ maxHeight: "480px", overflowY: "auto" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs">S.No.</TableHead>
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
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-sm text-gray-400 py-8"
                    >
                      No orders
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((o, idx) => (
                    <TableRow key={String(o.id)}>
                      <TableCell className="text-xs text-gray-500">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        #{String(o.id).padStart(3, "0")}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {o.customerName}
                      </TableCell>
                      <TableCell className="text-xs">
                        {garmentKey(o.garmentType)}
                      </TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate">
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
                        <div className="flex flex-wrap gap-2 items-center">
                          {nextStatus[orderStatusKey(o.status)] && (
                            <button
                              type="button"
                              onClick={() => updateStatus(o)}
                              className="text-xs text-[#1F7E78] hover:underline"
                            >
                              Advance
                            </button>
                          )}
                          {orderStatusKey(o.status) === "Ready" && (
                            <button
                              type="button"
                              onClick={() => openWhatsAppDialog(o, "ready")}
                              className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                              title="Notify customer on WhatsApp"
                            >
                              <WhatsAppIcon />
                              <span>Ready</span>
                            </button>
                          )}
                          {orderStatusKey(o.status) === "Delivered" && (
                            <button
                              type="button"
                              onClick={() => openWhatsAppDialog(o, "thankyou")}
                              className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                              title="Send Thank You message on WhatsApp"
                            >
                              <WhatsAppIcon />
                              <span>Thanks</span>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Order Dialog */}
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

      {/* WhatsApp Dialog (Ready / Thank You) */}
      <Dialog
        open={waDialog.open}
        onOpenChange={(open) => setWaDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon />
              </span>
              {waDialog.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Edit the message below before sending. Changes are not saved.
            </p>
            <Textarea
              rows={10}
              className="w-full font-mono text-sm resize-y"
              value={waDialog.message}
              onChange={(e) =>
                setWaDialog((prev) => ({ ...prev, message: e.target.value }))
              }
            />
            {waDialog.phone.length >= 10 && (
              <p className="text-xs text-gray-400">
                Sending to: +91 {waDialog.phone}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setWaDialog({ open: false, message: "", phone: "", title: "" })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={doSendWhatsApp}
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon />
              Send on WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
