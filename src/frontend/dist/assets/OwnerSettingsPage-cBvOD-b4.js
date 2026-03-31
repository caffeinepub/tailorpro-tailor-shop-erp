import { r as reactExports, j as jsxRuntimeExports, I as Input, B as Button, b as backend } from "./index-BPIadsRq.js";
function OwnerSettingsPage() {
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("Shop Owner");
  const [mobile] = reactExports.useState("9999999999");
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
          children: loading ? "Saving..." : "Save Changes"
        }
      )
    ] }) }),
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
