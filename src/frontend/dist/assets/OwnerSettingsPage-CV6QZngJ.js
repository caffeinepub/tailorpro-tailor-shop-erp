import { r as reactExports, b as backend, j as jsxRuntimeExports, I as Input, B as Button } from "./index-ftnU92EN.js";
import { u as ue } from "./index-CNNXd5N8.js";
import { c as createLucideIcon } from "./createLucideIcon-DS_jEeyu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
function OwnerSettingsPage() {
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("Shop Owner");
  const [mobile] = reactExports.useState("9999999999");
  const [stripeSecretKey, setStripeSecretKey] = reactExports.useState("");
  const [stripeCountries, setStripeCountries] = reactExports.useState("IN,US");
  const [showSecretKey, setShowSecretKey] = reactExports.useState(false);
  const [stripeSaving, setStripeSaving] = reactExports.useState(false);
  const [stripeLoading, setStripeLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    try {
      const session = localStorage.getItem("tailorpro_owner_session");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.name) setName(parsed.name);
      }
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    backend.getStripeConfiguration().then((cfg) => {
      if (cfg) {
        setStripeSecretKey(cfg.secretKey);
        setStripeCountries(cfg.allowedCountries.join(","));
      }
    }).catch(() => {
    }).finally(() => setStripeLoading(false));
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      if (newPassword) {
        const ok = await backend.setOwnerPassword(newPassword);
        if (!ok) {
          setError("Failed to save password. Please try again.");
          setLoading(false);
          return;
        }
      }
      localStorage.setItem(
        "tailorpro_owner_session",
        JSON.stringify({ name: name.trim() })
      );
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3e3);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveStripe = async () => {
    if (!stripeSecretKey.trim()) {
      ue.error("Please enter a Stripe Secret Key.");
      return;
    }
    setStripeSaving(true);
    try {
      const allowedCountries = stripeCountries.split(",").map((s) => s.trim()).filter(Boolean);
      await backend.setStripeConfiguration({
        secretKey: stripeSecretKey.trim(),
        allowedCountries
      });
      ue.success("Stripe settings saved successfully!");
    } catch {
      ue.error("Failed to save Stripe settings. Please try again.");
    } finally {
      setStripeSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Owner Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Manage your owner account credentials." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "owner-name",
            className: "block text-sm font-semibold text-gray-700 mb-1",
            children: "Shop / Owner Name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "owner-name",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g. Ahmed Tailors"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "owner-mobile",
            className: "block text-sm font-semibold text-gray-700 mb-1",
            children: "Owner Mobile (Login ID)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "owner-mobile",
            type: "tel",
            value: mobile,
            readOnly: true,
            className: "bg-gray-50 text-gray-500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Owner mobile is fixed and cannot be changed." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-gray-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "new-password",
            className: "block text-sm font-semibold text-gray-700 mb-1",
            children: "New Password"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "new-password",
            type: "password",
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
            placeholder: "Leave blank to keep current password"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "confirm-password",
            className: "block text-sm font-semibold text-gray-700 mb-1",
            children: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "confirm-password",
            type: "password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            placeholder: "Re-enter new password"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2", children: error }),
      saved && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2", children: "Settings saved successfully!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "w-full font-semibold text-white",
          style: { background: "#b45309" },
          disabled: loading,
          "data-ocid": "settings.save_button",
          children: loading ? "Saving..." : "Save Changes"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-indigo-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Payment Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-5", children: "Configure Stripe to accept online payments from customers." }),
      stripeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-sm text-gray-400 py-4 text-center",
          "data-ocid": "settings.stripe.loading_state",
          children: "Loading Stripe configuration..."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "stripe-secret",
              className: "block text-sm font-semibold text-gray-700 mb-1",
              children: "Stripe Secret Key"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "stripe-secret",
                type: showSecretKey ? "text" : "password",
                value: stripeSecretKey,
                onChange: (e) => setStripeSecretKey(e.target.value),
                placeholder: "sk_live_... or sk_test_...",
                className: "pr-10",
                "data-ocid": "settings.stripe.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowSecretKey((v) => !v),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                "aria-label": showSecretKey ? "Hide key" : "Show key",
                "data-ocid": "settings.stripe.toggle",
                children: showSecretKey ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [
            "Find your key at",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://dashboard.stripe.com/apikeys",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-indigo-500 hover:underline",
                children: "dashboard.stripe.com/apikeys"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "stripe-countries",
              className: "block text-sm font-semibold text-gray-700 mb-1",
              children: "Allowed Countries"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "stripe-countries",
              value: stripeCountries,
              onChange: (e) => setStripeCountries(e.target.value),
              placeholder: "IN,US,GB",
              "data-ocid": "settings.stripe_countries.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Comma-separated country codes (e.g. IN,US,GB). Default: IN,US" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: handleSaveStripe,
            disabled: stripeSaving,
            className: "w-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700",
            "data-ocid": "settings.stripe.save_button",
            children: stripeSaving ? "Saving..." : "Save Payment Settings"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Current login:" }),
      " Mobile",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: mobile }),
      " — password is hidden for security. Passwords are now saved to the cloud."
    ] })
  ] });
}
export {
  OwnerSettingsPage as default
};
