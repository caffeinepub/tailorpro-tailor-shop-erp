import { Check, Copy, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { fmt, garmentKey, paymentStatusKey } from "../lib/helpers";
import type { Customer, Invoice, Order } from "../tailor-types";

type CustomerSort = "name-asc" | "name-desc" | "newest" | "oldest";
type InvoiceSort = "newest" | "oldest" | "name-asc" | "name-desc";

const UPI_ID = "9354556174@kotak811";
const UPI_NAME = "ANEMA BIBI";
const QR_PATH =
  "/assets/1f58bf32-eb61-48c8-837c-8938cbf6c4ae-019d4428-a138-709d-a174-992c548b900e.jpeg";

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

function sortCustomers(list: Customer[], sort: CustomerSort): Customer[] {
  const copy = [...list];
  if (sort === "name-asc")
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc")
    return copy.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "newest")
    return copy.sort((a, b) => Number(b.id) - Number(a.id));
  if (sort === "oldest")
    return copy.sort((a, b) => Number(a.id) - Number(b.id));
  return copy;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerSort, setCustomerSort] = useState<CustomerSort>("name-asc");
  const [invoiceSort, setInvoiceSort] = useState<InvoiceSort>("newest");
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [upiDialog, setUpiDialog] = useState<{
    open: boolean;
    inv: Invoice | null;
  }>({ open: false, inv: null });
  const [upiCopied, setUpiCopied] = useState(false);
  const [form, setForm] = useState({
    orderId: "",
    subtotal: "",
    discount: "0",
    tax: "0",
    paymentMethod: "Cash",
  });
  const [waDialog, setWaDialog] = useState<{
    open: boolean;
    message: string;
    phone: string;
  }>({ open: false, message: "", phone: "" });

  const load = useCallback(() => {
    Promise.all([
      backend.getInvoices(),
      backend.getOrders(),
      backend.getCustomers(),
      backend.isStripeConfigured(),
    ]).then(([inv, ord, cust, stripeCfg]) => {
      setInvoices(inv);
      setOrders(ord);
      setCustomers(cust);
      setStripeConfigured(stripeCfg);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-mark paid when returning from Stripe payment success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get("payment_success");
    const invId = params.get("inv_id");
    if (paymentSuccess === "1" && invId) {
      history.replaceState({}, "", window.location.pathname);
      backend
        .updateInvoicePayment(BigInt(invId), { Paid: null } as any)
        .then(() => {
          toast.success("✅ Payment successful! Invoice marked as Paid.");
          load();
        })
        .catch(() => {
          toast.error(
            "Payment received but could not mark invoice as paid. Please mark manually.",
          );
          load();
        });
    }
  }, [load]);

  const total = () => {
    const s = Number.parseFloat(form.subtotal) || 0;
    const d = Number.parseFloat(form.discount) || 0;
    const t = Number.parseFloat(form.tax) || 0;
    return s - d + t;
  };

  const sortedCustomers = useMemo(
    () => sortCustomers(customers, customerSort),
    [customers, customerSort],
  );
  const sortedInvoices = useMemo(() => {
    const copy = [...invoices];
    if (invoiceSort === "newest")
      return copy.sort((a, b) => Number(b.id) - Number(a.id));
    if (invoiceSort === "oldest")
      return copy.sort((a, b) => Number(a.id) - Number(b.id));
    if (invoiceSort === "name-asc")
      return copy.sort((a, b) => a.customerName.localeCompare(b.customerName));
    if (invoiceSort === "name-desc")
      return copy.sort((a, b) => b.customerName.localeCompare(a.customerName));
    return copy;
  }, [invoices, invoiceSort]);

  const filteredOrders =
    selectedCustomerId && selectedCustomerId !== "all"
      ? orders.filter((o) => String(o.customerId) === selectedCustomerId)
      : orders;

  const openAdd = () => {
    setSelectedCustomerId("");
    setCustomerSort("name-asc");
    setForm({
      orderId: "",
      subtotal: "",
      discount: "0",
      tax: "0",
      paymentMethod: "Cash",
    });
    setShowAdd(true);
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
    await backend.updateInvoicePayment(id, { Paid: null } as any);
    load();
  };

  const openUpiDialog = (inv: Invoice) => {
    setUpiDialog({ open: true, inv });
    setUpiCopied(false);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    });
  };

  const payOnline = async (inv: Invoice) => {
    setPayingInvoiceId(inv.id);
    try {
      const url = window.location.href;
      const successUrl = `${url}${url.includes("?") ? "&" : "?"}payment_success=1&inv_id=${String(inv.id)}`;
      const checkoutUrl = await backend.createCheckoutSession(
        [
          {
            currency: "usd",
            productName: `Invoice #${String(inv.id).padStart(3, "0")}`,
            productDescription: `Ali Tailor - ${inv.customerName}`,
            priceInCents: BigInt(Math.round(inv.total * 100)),
            quantity: BigInt(1),
          },
        ],
        successUrl,
        url,
      );
      window.open(checkoutUrl, "_blank");
    } catch {
      toast.error("Failed to create payment session. Please try again.");
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const sendWhatsApp = (inv: Invoice) => {
    const customer = customers.find(
      (c) => String(c.id) === String(inv.customerId),
    );
    const phone = customer?.phone?.replace(/\D/g, "") ?? "";
    const status = paymentStatusKey(inv.paymentStatus);
    const message = [
      "🧵 *Ali Tailor Invoice*",
      `Invoice: INV-${String(inv.id).padStart(3, "0")}`,
      `Customer: ${inv.customerName}`,
      `Order: #${String(inv.orderId).padStart(3, "0")}`,
      `Subtotal: ₹${inv.subtotal}`,
      `Discount: -₹${inv.discount}`,
      `Tax: ₹${inv.tax}`,
      `*Total: ₹${inv.total}*`,
      `Payment: ${inv.paymentMethod}`,
      `Status: ${status}`,
    ].join("\n");
    setWaDialog({ open: true, message, phone });
  };

  const doSendWhatsApp = () => {
    const encoded = encodeURIComponent(waDialog.message);
    const url =
      waDialog.phone.length >= 10
        ? `https://wa.me/91${waDialog.phone}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    setWaDialog({ open: false, message: "", phone: "" });
  };

  const printInvoice = (inv: Invoice) => {
    const invNum = `INV-${String(inv.id).padStart(3, "0")}`;
    const orderNum = `#${String(inv.orderId).padStart(3, "0")}`;
    const status = paymentStatusKey(inv.paymentStatus);
    const dateStr = new Date(
      Number(inv.createdAt) / 1_000_000,
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const win = window.open("", "_blank", "width=600,height=750");
    if (!win) return;

    win.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${invNum} - Ali Tailor</title>
  <style>
    @page { margin: 20mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 13px;
      color: #111;
      background: #fff;
      max-width: 560px;
      margin: 0 auto;
      padding: 24px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #111;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .header .shop-name {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .header .subtitle {
      font-size: 12px;
      color: #555;
      margin-top: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      gap: 8px;
    }
    .meta-block { line-height: 1.6; }
    .meta-block .label {
      font-size: 10px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
    }
    .meta-block .value {
      font-size: 13px;
      font-weight: 600;
    }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    table th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      color: #666;
      border-bottom: 1px solid #ccc;
      padding: 5px 6px;
    }
    table td {
      padding: 7px 6px;
      font-size: 13px;
      border-bottom: 1px solid #eee;
    }
    table td.amount { text-align: right; }
    .total-row td {
      font-size: 15px;
      font-weight: 800;
      border-top: 2px solid #111;
      border-bottom: none;
      padding-top: 10px;
    }
    .payment-row {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;
    }
    .payment-item .label {
      font-size: 10px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
    }
    .payment-item .value {
      font-size: 13px;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      border-top: 2px solid #111;
      padding-top: 14px;
      font-size: 13px;
      font-style: italic;
      color: #333;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="shop-name">✂️ Ali Tailor</div>
    <div class="subtitle">Premium Tailoring Services</div>
  </div>

  <div class="meta">
    <div class="meta-block">
      <div class="label">Invoice</div>
      <div class="value">${invNum}</div>
    </div>
    <div class="meta-block">
      <div class="label">Order</div>
      <div class="value">${orderNum}</div>
    </div>
    <div class="meta-block" style="text-align:right">
      <div class="label">Date</div>
      <div class="value">${dateStr}</div>
    </div>
  </div>

  <div class="meta-block" style="margin-bottom:18px">
    <div class="label">Customer</div>
    <div class="value" style="font-size:15px">${inv.customerName}</div>
  </div>

  <div class="section-title">Billing Summary</div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Subtotal</td>
        <td class="amount">₹${inv.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Discount</td>
        <td class="amount" style="color:#555">-₹${inv.discount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Tax</td>
        <td class="amount">₹${inv.tax.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td>Total</td>
        <td class="amount">₹${inv.total.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div class="payment-row">
    <div class="payment-item">
      <div class="label">Payment Method</div>
      <div class="value">${inv.paymentMethod}</div>
    </div>
    <div class="payment-item">
      <div class="label">Payment Status</div>
      <div class="value">${status}</div>
    </div>
  </div>

  <div class="footer">Thank you for choosing Ali Tailor!</div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>
    `);
    win.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7E78]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-[#111827]">
          Billing & Invoices
        </h1>
        <div className="flex items-center gap-2">
          <Select
            value={invoiceSort}
            onValueChange={(v) => setInvoiceSort(v as InvoiceSort)}
          >
            <SelectTrigger
              className="w-40 text-xs h-8"
              data-ocid="billing.sort.select"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A→Z</SelectItem>
              <SelectItem value="name-desc">Name Z→A</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={openAdd}
            className="bg-[#1F7E78] hover:bg-[#166661] text-white"
            data-ocid="billing.create_invoice.primary_button"
          >
            + Create Invoice
          </Button>
        </div>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs w-10">S.No.</TableHead>
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
                    colSpan={11}
                    className="text-center text-sm text-gray-400 py-8"
                    data-ocid="billing.invoice.empty_state"
                  >
                    No invoices yet
                  </TableCell>
                </TableRow>
              )}
              {sortedInvoices.map((inv, idx) => (
                <TableRow key={String(inv.id)}>
                  <TableCell className="text-xs text-gray-500">
                    {idx + 1}
                  </TableCell>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      {paymentStatusKey(inv.paymentStatus) !== "Paid" && (
                        <button
                          type="button"
                          onClick={() => markPaid(inv.id)}
                          className="text-xs text-[#1F7E78] hover:underline"
                        >
                          Mark Paid
                        </button>
                      )}
                      {paymentStatusKey(inv.paymentStatus) !== "Paid" && (
                        <button
                          type="button"
                          onClick={() => openUpiDialog(inv)}
                          className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-colors"
                          title="Pay via UPI / QR"
                          data-ocid="billing.upi.button"
                        >
                          <span>📲</span>
                          <span>Pay UPI</span>
                        </button>
                      )}
                      {stripeConfigured &&
                        paymentStatusKey(inv.paymentStatus) !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => payOnline(inv)}
                            disabled={payingInvoiceId === inv.id}
                            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Pay Online via Stripe"
                            data-ocid="billing.pay_online.button"
                          >
                            {payingInvoiceId === inv.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <span>💳</span>
                            )}
                            <span>
                              {payingInvoiceId === inv.id
                                ? "Opening..."
                                : "Pay Online"}
                            </span>
                          </button>
                        )}
                      <button
                        type="button"
                        onClick={() => sendWhatsApp(inv)}
                        className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                        title="Send WhatsApp Invoice"
                        data-ocid="billing.whatsapp.button"
                      >
                        <WhatsAppIcon />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => printInvoice(inv)}
                        className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Print Invoice"
                        data-ocid="billing.print.button"
                      >
                        <span>🖨️</span>
                        <span>Print</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>

          {orders.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              <p className="text-3xl mb-3">📋</p>
              <p className="font-medium text-gray-700">No orders found</p>
              <p className="text-xs mt-1 text-gray-400">
                Please add an order first before creating an invoice.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Step 1: Select Customer with Sort */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-600">
                    Customer
                  </p>
                  <Select
                    value={customerSort}
                    onValueChange={(v) => setCustomerSort(v as CustomerSort)}
                  >
                    <SelectTrigger className="h-6 text-[10px] w-auto px-2 border-gray-200 bg-gray-50 gap-1">
                      <span className="text-gray-400">Sort:</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Name A→Z</SelectItem>
                      <SelectItem value="name-desc">Name Z→A</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={selectedCustomerId}
                  onValueChange={(v) => {
                    setSelectedCustomerId(v);
                    setForm((f) => ({ ...f, orderId: "", subtotal: "" }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by customer (optional)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-52 overflow-y-auto">
                    <SelectItem value="all">All customers</SelectItem>
                    {sortedCustomers.map((c) => (
                      <SelectItem key={String(c.id)} value={String(c.id)}>
                        {c.name} — {c.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Select Order */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOrders.length === 0 ? (
                      <div className="px-2 py-3 text-xs text-gray-400 text-center">
                        No orders for this customer
                      </div>
                    ) : (
                      filteredOrders.map((o) => (
                        <SelectItem key={String(o.id)} value={String(o.id)}>
                          #{String(o.id).padStart(3, "0")} — {o.customerName} (
                          {garmentKey(o.garmentType)})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
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
                  <p className="text-xs font-semibold text-gray-600 mb-1">
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
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Tax ₹
                  </p>
                  <Input
                    type="number"
                    value={form.tax}
                    onChange={(e) => setForm({ ...form, tax: e.target.value })}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Total ₹
                  </p>
                  <Input readOnly value={total()} className="bg-gray-50" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Payment Method
                </p>
                <Select
                  value={form.paymentMethod}
                  onValueChange={(v) => setForm({ ...form, paymentMethod: v })}
                >
                  <SelectTrigger className="w-full">
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
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            {orders.length > 0 && (
              <Button
                className="bg-[#1F7E78] hover:bg-[#166661] text-white"
                onClick={createInv}
                disabled={!form.orderId}
              >
                Create
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPI Payment Dialog */}
      <Dialog
        open={upiDialog.open}
        onOpenChange={(open) => setUpiDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent
          className="max-w-sm w-full"
          data-ocid="billing.upi.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7C3AED] text-white text-sm">
                📲
              </span>
              Pay via UPI
            </DialogTitle>
          </DialogHeader>

          {upiDialog.inv && (
            <div className="space-y-4">
              {/* Customer & Amount */}
              <div className="rounded-lg bg-purple-50 border border-purple-100 px-4 py-3 text-center">
                <p className="text-xs text-purple-500 font-medium mb-0.5">
                  {upiDialog.inv.customerName}
                </p>
                <p className="text-2xl font-bold text-[#7C3AED]">
                  ₹{upiDialog.inv.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  INV-{String(upiDialog.inv.id).padStart(3, "0")}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <img
                  src={QR_PATH}
                  alt="UPI QR Code"
                  className="rounded-lg border border-gray-200 shadow-sm"
                  style={{ maxWidth: 220, width: "100%" }}
                />
              </div>

              {/* Instruction */}
              <p className="text-center text-xs text-gray-500">
                Scan QR code or use UPI ID to pay
              </p>

              {/* UPI ID copy row */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-none mb-0.5">
                    UPI ID
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-800 truncate">
                    {UPI_ID}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-colors"
                  title="Copy UPI ID"
                  data-ocid="billing.upi.copy_button"
                >
                  {upiCopied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{upiCopied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="font-semibold text-gray-800">{UPI_NAME}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setUpiDialog({ open: false, inv: null })}
              data-ocid="billing.upi.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={async () => {
                if (upiDialog.inv) {
                  await markPaid(upiDialog.inv.id);
                  setUpiDialog({ open: false, inv: null });
                }
              }}
              data-ocid="billing.upi.confirm_button"
            >
              ✅ Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Message Dialog */}
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
              Send WhatsApp Message
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Edit the message below before sending. Changes are not saved.
            </p>
            <Textarea
              rows={8}
              className="w-full font-mono text-sm resize-y"
              value={waDialog.message}
              onChange={(e) =>
                setWaDialog((prev) => ({ ...prev, message: e.target.value }))
              }
              data-ocid="billing.whatsapp.textarea"
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
                setWaDialog({ open: false, message: "", phone: "" })
              }
              data-ocid="billing.whatsapp.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={doSendWhatsApp}
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: "#25D366" }}
              data-ocid="billing.whatsapp.send_button"
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
