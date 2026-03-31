import { r as reactExports, b as backend, j as jsxRuntimeExports, B as Button, I as Input } from "./index-BEkZT5E1.js";
import { u as ue } from "./index-DkAel4Ee.js";
import { S as StatusBadge } from "./StatusBadge-Bj6cGtns.js";
import { C as Card, a as CardContent } from "./card-BGMUmVPT.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-XRBr-IJ6.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as Check } from "./select-CPA7Bfss.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CPgBzvW5.js";
import { T as Textarea } from "./textarea-BmkDZW2U.js";
import { f as fmt, p as paymentStatusKey, g as garmentKey } from "./helpers-DPF4kehq.js";
import { c as createLucideIcon } from "./createLucideIcon-CtlFsITG.js";
import "./index-C6mhcshJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
const UPI_ID = "9354556174@kotak811";
const UPI_NAME = "ANEMA BIBI";
const QR_PATH = "/assets/1f58bf32-eb61-48c8-837c-8938cbf6c4ae-019d4428-a138-709d-a174-992c548b900e.jpeg";
function WhatsAppIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      width: "14",
      height: "14",
      fill: "currentColor",
      role: "img",
      "aria-label": "WhatsApp",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 2C8.268 2 2 8.268 2 16c0 2.478.658 4.8 1.805 6.805L2 30l7.418-1.775A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.844-1.604l-.418-.248-4.404 1.054 1.078-4.284-.274-.44A11.463 11.463 0 0 1 4.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.598c-.344-.172-2.037-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.913-2.382-.2-.344-.021-.53.15-.701.156-.155.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.776-1.872-1.063-2.563-.28-.672-.564-.581-.776-.592l-.66-.011a1.266 1.266 0 0 0-.918.43c-.316.344-1.205 1.177-1.205 2.868s1.234 3.325 1.406 3.554c.172.23 2.43 3.71 5.888 5.204.823.355 1.466.567 1.967.726.826.263 1.578.226 2.173.137.663-.099 2.037-.832 2.324-1.635.287-.803.287-1.492.2-1.635-.086-.143-.316-.23-.66-.402z" })
    }
  );
}
function sortCustomers(list, sort) {
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
function BillingPage() {
  const [invoices, setInvoices] = reactExports.useState([]);
  const [orders, setOrders] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = reactExports.useState("");
  const [customerSort, setCustomerSort] = reactExports.useState("name-asc");
  const [invoiceSort, setInvoiceSort] = reactExports.useState("newest");
  const [stripeConfigured, setStripeConfigured] = reactExports.useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [upiDialog, setUpiDialog] = reactExports.useState({ open: false, inv: null });
  const [upiCopied, setUpiCopied] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    orderId: "",
    subtotal: "",
    discount: "0",
    tax: "0",
    paymentMethod: "Cash"
  });
  const [waDialog, setWaDialog] = reactExports.useState({ open: false, message: "", phone: "" });
  const load = reactExports.useCallback(() => {
    Promise.all([
      backend.getInvoices(),
      backend.getOrders(),
      backend.getCustomers(),
      backend.isStripeConfigured()
    ]).then(([inv, ord, cust, stripeCfg]) => {
      setInvoices(inv);
      setOrders(ord);
      setCustomers(cust);
      setStripeConfigured(stripeCfg);
      setLoading(false);
    });
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get("payment_success");
    const invId = params.get("inv_id");
    if (paymentSuccess === "1" && invId) {
      history.replaceState({}, "", window.location.pathname);
      backend.updateInvoicePayment(BigInt(invId), { Paid: null }).then(() => {
        ue.success("✅ Payment successful! Invoice marked as Paid.");
        load();
      }).catch(() => {
        ue.error(
          "Payment received but could not mark invoice as paid. Please mark manually."
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
  const sortedCustomers = reactExports.useMemo(
    () => sortCustomers(customers, customerSort),
    [customers, customerSort]
  );
  const sortedInvoices = reactExports.useMemo(() => {
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
  const filteredOrders = selectedCustomerId && selectedCustomerId !== "all" ? orders.filter((o) => String(o.customerId) === selectedCustomerId) : orders;
  const openAdd = () => {
    setSelectedCustomerId("");
    setCustomerSort("name-asc");
    setForm({
      orderId: "",
      subtotal: "",
      discount: "0",
      tax: "0",
      paymentMethod: "Cash"
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
      form.paymentMethod
    );
    setShowAdd(false);
    load();
  };
  const markPaid = async (id) => {
    await backend.updateInvoicePayment(id, { Paid: null });
    load();
  };
  const openUpiDialog = (inv) => {
    setUpiDialog({ open: true, inv });
    setUpiCopied(false);
  };
  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2e3);
    });
  };
  const payOnline = async (inv) => {
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
            quantity: BigInt(1)
          }
        ],
        successUrl,
        url
      );
      window.open(checkoutUrl, "_blank");
    } catch {
      ue.error("Failed to create payment session. Please try again.");
    } finally {
      setPayingInvoiceId(null);
    }
  };
  const sendWhatsApp = (inv) => {
    var _a;
    const customer = customers.find(
      (c) => String(c.id) === String(inv.customerId)
    );
    const phone = ((_a = customer == null ? void 0 : customer.phone) == null ? void 0 : _a.replace(/\D/g, "")) ?? "";
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
      `Status: ${status}`
    ].join("\n");
    setWaDialog({ open: true, message, phone });
  };
  const doSendWhatsApp = () => {
    const encoded = encodeURIComponent(waDialog.message);
    const url = waDialog.phone.length >= 10 ? `https://wa.me/91${waDialog.phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    setWaDialog({ open: false, message: "", phone: "" });
  };
  const printInvoice = (inv) => {
    const invNum = `INV-${String(inv.id).padStart(3, "0")}`;
    const orderNum = `#${String(inv.orderId).padStart(3, "0")}`;
    const status = paymentStatusKey(inv.paymentStatus);
    const dateStr = new Date(
      Number(inv.createdAt) / 1e6
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
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
  <\/script>
</body>
</html>
    `);
    win.document.close();
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7E78]" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Billing & Invoices" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: invoiceSort,
            onValueChange: (v) => setInvoiceSort(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-40 text-xs h-8",
                  "data-ocid": "billing.sort.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest First" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "oldest", children: "Oldest First" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name-asc", children: "Name A→Z" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name-desc", children: "Name Z→A" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: openAdd,
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            "data-ocid": "billing.create_invoice.primary_button",
            children: "+ Create Invoice"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs w-10", children: "S.No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Invoice #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Order #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Subtotal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Discount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Tax" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        invoices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 11,
            className: "text-center text-sm text-gray-400 py-8",
            "data-ocid": "billing.invoice.empty_state",
            children: "No invoices yet"
          }
        ) }),
        sortedInvoices.map((inv, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-gray-500", children: idx + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs font-mono", children: [
            "INV-",
            String(inv.id).padStart(3, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium", children: inv.customerName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs font-mono", children: [
            "#",
            String(inv.orderId).padStart(3, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmt(inv.subtotal) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs text-green-600", children: [
            "-",
            fmt(inv.discount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: fmt(inv.tax) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-bold", children: fmt(inv.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: inv.paymentMethod }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: paymentStatusKey(inv.paymentStatus) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            paymentStatusKey(inv.paymentStatus) !== "Paid" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => markPaid(inv.id),
                className: "text-xs text-[#1F7E78] hover:underline",
                children: "Mark Paid"
              }
            ),
            paymentStatusKey(inv.paymentStatus) !== "Paid" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => openUpiDialog(inv),
                className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-colors",
                title: "Pay via UPI / QR",
                "data-ocid": "billing.upi.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📲" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pay UPI" })
                ]
              }
            ),
            stripeConfigured && paymentStatusKey(inv.paymentStatus) !== "Paid" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => payOnline(inv),
                disabled: payingInvoiceId === inv.id,
                className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                title: "Pay Online via Stripe",
                "data-ocid": "billing.pay_online.button",
                children: [
                  payingInvoiceId === inv.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💳" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: payingInvoiceId === inv.id ? "Opening..." : "Pay Online" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => sendWhatsApp(inv),
                className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors",
                title: "Send WhatsApp Invoice",
                "data-ocid": "billing.whatsapp.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "WhatsApp" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => printInvoice(inv),
                className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors",
                title: "Print Invoice",
                "data-ocid": "billing.print.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🖨️" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Print" })
                ]
              }
            )
          ] }) })
        ] }, String(inv.id)))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create Invoice" }) }),
      orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 text-center text-sm text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl mb-3", children: "📋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-700", children: "No orders found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 text-gray-400", children: "Please add an order first before creating an invoice." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: customerSort,
                onValueChange: (v) => setCustomerSort(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-6 text-[10px] w-auto px-2 border-gray-200 bg-gray-50 gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Sort:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name-asc", children: "Name A→Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name-desc", children: "Name Z→A" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest First" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "oldest", children: "Oldest First" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedCustomerId,
              onValueChange: (v) => {
                setSelectedCustomerId(v);
                setForm((f) => ({ ...f, orderId: "", subtotal: "" }));
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by customer (optional)" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-52 overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All customers" }),
                  sortedCustomers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(c.id), children: [
                    c.name,
                    " — ",
                    c.phone
                  ] }, String(c.id)))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Order *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.orderId,
              onValueChange: (v) => {
                const o = orders.find((x) => String(x.id) === v);
                setForm({
                  ...form,
                  orderId: v,
                  subtotal: o ? String(o.price) : ""
                });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select order" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-3 text-xs text-gray-400 text-center", children: "No orders for this customer" }) : filteredOrders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(o.id), children: [
                  "#",
                  String(o.id).padStart(3, "0"),
                  " — ",
                  o.customerName,
                  " (",
                  garmentKey(o.garmentType),
                  ")"
                ] }, String(o.id))) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Subtotal ₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: form.subtotal,
                onChange: (e) => setForm({ ...form, subtotal: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Discount ₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: form.discount,
                onChange: (e) => setForm({ ...form, discount: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Tax ₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: form.tax,
                onChange: (e) => setForm({ ...form, tax: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Total ₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { readOnly: true, value: total(), className: "bg-gray-50" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Payment Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.paymentMethod,
              onValueChange: (v) => setForm({ ...form, paymentMethod: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Cash", "UPI", "Card", "Bank Transfer", "Cheque"].map(
                  (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: p }, p)
                ) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: createInv,
            disabled: !form.orderId,
            children: "Create"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: upiDialog.open,
        onOpenChange: (open) => setUpiDialog((prev) => ({ ...prev, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm w-full",
            "data-ocid": "billing.upi.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7C3AED] text-white text-sm", children: "📲" }),
                "Pay via UPI"
              ] }) }),
              upiDialog.inv && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-purple-50 border border-purple-100 px-4 py-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-500 font-medium mb-0.5", children: upiDialog.inv.customerName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-[#7C3AED]", children: [
                    "₹",
                    upiDialog.inv.total.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
                    "INV-",
                    String(upiDialog.inv.id).padStart(3, "0")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: QR_PATH,
                    alt: "UPI QR Code",
                    className: "rounded-lg border border-gray-200 shadow-sm",
                    style: { maxWidth: 220, width: "100%" }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-gray-500", children: "Scan QR code or use UPI ID to pay" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 uppercase tracking-wide leading-none mb-0.5", children: "UPI ID" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-semibold text-gray-800 truncate", children: UPI_ID })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: copyUpiId,
                      className: "flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-colors",
                      title: "Copy UPI ID",
                      "data-ocid": "billing.upi.copy_button",
                      children: [
                        upiCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: upiCopied ? "Copied!" : "Copy" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 px-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-600", children: "Name:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-800", children: UPI_NAME })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2 flex-col sm:flex-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setUpiDialog({ open: false, inv: null }),
                    "data-ocid": "billing.upi.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "bg-green-600 hover:bg-green-700 text-white",
                    onClick: async () => {
                      if (upiDialog.inv) {
                        await markPaid(upiDialog.inv.id);
                        setUpiDialog({ open: false, inv: null });
                      }
                    },
                    "data-ocid": "billing.upi.confirm_button",
                    children: "✅ Mark as Paid"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: waDialog.open,
        onOpenChange: (open) => setWaDialog((prev) => ({ ...prev, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}) }),
            "Send WhatsApp Message"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Edit the message below before sending. Changes are not saved." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 8,
                className: "w-full font-mono text-sm resize-y",
                value: waDialog.message,
                onChange: (e) => setWaDialog((prev) => ({ ...prev, message: e.target.value })),
                "data-ocid": "billing.whatsapp.textarea"
              }
            ),
            waDialog.phone.length >= 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
              "Sending to: +91 ",
              waDialog.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setWaDialog({ open: false, message: "", phone: "" }),
                "data-ocid": "billing.whatsapp.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: doSendWhatsApp,
                className: "flex items-center gap-2 text-white",
                style: { backgroundColor: "#25D366" },
                "data-ocid": "billing.whatsapp.send_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, {}),
                  "Send on WhatsApp"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  BillingPage as default
};
