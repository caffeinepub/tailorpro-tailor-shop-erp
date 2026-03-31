import { r as reactExports, j as jsxRuntimeExports, I as Input, B as Button } from "./index-TdD9R_9D.js";
const OWNER_CREDS_KEY = "tailorpro_owner_creds";
function getOwnerCreds() {
  const raw = localStorage.getItem(OWNER_CREDS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
    }
  }
  return { mobile: "9999999999", password: "owner@123", name: "Shop Owner" };
}
function OwnerSettingsPage() {
  const creds = getOwnerCreds();
  const [name, setName] = reactExports.useState(creds.name);
  const [mobile, setMobile] = reactExports.useState(creds.mobile);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleSave = (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!name.trim() || !mobile.trim()) {
      setError("Name and mobile are required.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const updated = {
      name: name.trim(),
      mobile: mobile.trim(),
      password: newPassword || creds.password
    };
    localStorage.setItem(OWNER_CREDS_KEY, JSON.stringify(updated));
    localStorage.setItem(
      "tailorpro_owner_session",
      JSON.stringify({ name: updated.name })
    );
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
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
            onChange: (e) => setMobile(e.target.value),
            placeholder: "e.g. 9999999999"
          }
        )
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
          children: "Save Changes"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Current login:" }),
      " Mobile",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: creds.mobile }),
      " — password is hidden for security."
    ] })
  ] });
}
export {
  OwnerSettingsPage as default
};
