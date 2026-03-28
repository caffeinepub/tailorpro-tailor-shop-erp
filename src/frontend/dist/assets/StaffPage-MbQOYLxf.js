import { r as reactExports, b as backend, j as jsxRuntimeExports } from "./index-BKtvsG8Z.js";
import { B as Button, I as Input, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./input-CFmIcUl7.js";
import { C as Card, a as CardContent } from "./card-BMuEzBa3.js";
const ROLES = [
  { label: "Tailor", value: "Tailor" },
  { label: "Cutter", value: "Cutter" },
  { label: "Helper", value: "Helper" },
  { label: "Manager", value: "Manager" },
  { label: "Receptionist", value: "Receptionist" },
  { label: "Other", value: "Other" }
];
const ROLE_COLORS = {
  Tailor: "#1F7E78",
  Cutter: "#2563EB",
  Helper: "#7C3AED",
  Manager: "#0F2233",
  Receptionist: "#D97706",
  Other: "#6B7280"
};
function getRoleLabel(role) {
  return Object.keys(role)[0] ?? "Other";
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function StaffIDCard({
  staff,
  onClose
}) {
  const cardRef = reactExports.useRef(null);
  const roleLabel = getRoleLabel(staff.role);
  const color = ROLE_COLORS[roleLabel];
  const joinDate = new Date(
    Number(staff.joinDate) / 1e6
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const handlePrint = () => {
    const el = cardRef.current;
    if (!el) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Staff ID - ${staff.name}</title>
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f3f4f6; font-family: Inter, sans-serif; }
      </style></head><body>
      ${el.outerHTML}
      </body></html>
    `);
    win.document.close();
    win.onload = () => {
      win.print();
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: cardRef,
        style: {
          fontFamily: "Inter, sans-serif",
          background: "white",
          borderRadius: 16,
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: color,
                padding: "28px 20px 20px",
                textAlign: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "white",
                      margin: "0 auto 12px",
                      border: "3px solid rgba(255,255,255,0.5)"
                    },
                    children: getInitials(staff.name)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    style: {
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12,
                      margin: "0 0 4px"
                    },
                    children: "TailorPro ✂️"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    style: {
                      color: "white",
                      fontSize: 20,
                      fontWeight: 700,
                      margin: "0 0 6px"
                    },
                    children: staff.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      borderRadius: 20,
                      padding: "2px 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    },
                    children: roleLabel
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 16 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    fontSize: 10,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    margin: 0
                  },
                  children: "Staff ID"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    fontSize: 22,
                    fontWeight: 800,
                    color,
                    letterSpacing: 2,
                    margin: 0
                  },
                  children: staff.staffId
                }
              )
            ] }),
            [
              { label: "Department", val: staff.department },
              { label: "Phone", val: staff.phone },
              { label: "Email", val: staff.email },
              { label: "Joined", val: joinDate }
            ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 12
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#9ca3af", width: 70, flexShrink: 0 }, children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#111827", fontWeight: 500 }, children: val })
                ]
              },
              label
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "#f9fafb",
                borderTop: "1px solid #e5e7eb",
                padding: "10px 20px",
                textAlign: "center",
                fontSize: 10,
                color: "#9ca3af"
              },
              children: "TailorPro ERP · Staff Identity Card"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 p-4 border-t", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: onClose, children: "Close" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "flex-1 bg-[#1F7E78] hover:bg-[#166661] text-white",
          onClick: handlePrint,
          children: "🖨️ Print ID"
        }
      )
    ] })
  ] }) });
}
function StaffPage() {
  const [staffList, setStaffList] = reactExports.useState([]);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editStaff, setEditStaff] = reactExports.useState(null);
  const [viewCard, setViewCard] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    name: "",
    role: "Tailor",
    phone: "",
    email: "",
    department: "",
    joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    address: ""
  });
  const load = reactExports.useCallback(() => backend.getStaff().then(setStaffList), []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const openAdd = () => {
    setEditStaff(null);
    setForm({
      name: "",
      role: "Tailor",
      phone: "",
      email: "",
      department: "",
      joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      address: ""
    });
    setShowAdd(true);
  };
  const openEdit = (s) => {
    setEditStaff(s);
    const joinDate = new Date(Number(s.joinDate) / 1e6).toISOString().slice(0, 10);
    setForm({
      name: s.name,
      role: getRoleLabel(s.role),
      phone: s.phone,
      email: s.email,
      department: s.department,
      joinDate,
      address: s.address
    });
    setShowAdd(true);
  };
  const save = async () => {
    const roleObj = { [form.role]: null };
    const joinDateMs = BigInt(new Date(form.joinDate).getTime()) * 1000000n;
    if (editStaff) {
      await backend.updateStaff(
        editStaff.id,
        form.name,
        roleObj,
        form.phone,
        form.email,
        form.department,
        joinDateMs,
        form.address
      );
    } else {
      await backend.addStaff(
        form.name,
        roleObj,
        form.phone,
        form.email,
        form.department,
        joinDateMs,
        form.address
      );
    }
    setShowAdd(false);
    load();
  };
  const del = async (id) => {
    if (confirm("Delete this staff member?")) {
      await backend.deleteStaff(id);
      load();
    }
  };
  const filtered = staffList.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.staffId.includes(search) || s.phone.includes(search)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Staff ID Cards" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: openAdd,
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          children: "+ Add Staff"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search by name, ID, or phone...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-xs mb-4"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 col-span-4 py-8 text-center", children: "No staff found" }),
        filtered.map((s) => {
          const roleLabel = getRoleLabel(s.role);
          const color = ROLE_COLORS[roleLabel];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      background: color,
                      padding: "18px 16px 14px",
                      textAlign: "center"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "white",
                            margin: "0 auto 8px",
                            border: "2px solid rgba(255,255,255,0.5)"
                          },
                          children: getInitials(s.name)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-sm", children: s.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            display: "inline-block",
                            background: "rgba(255,255,255,0.2)",
                            color: "white",
                            borderRadius: 20,
                            padding: "1px 10px",
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase"
                          },
                          children: roleLabel
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-center font-bold text-lg",
                      style: { color },
                      children: s.staffId
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-gray-500 mb-3", children: s.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
                    "📞 ",
                    s.phone
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setViewCard(s),
                        className: "flex-1 text-xs py-1.5 rounded-lg font-semibold text-white",
                        style: { background: color },
                        children: "View ID"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => openEdit(s),
                        className: "text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => del(s.id),
                        className: "text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50",
                        children: "Del"
                      }
                    )
                  ] })
                ] })
              ]
            },
            String(s.id)
          );
        })
      ] })
    ] }) }),
    viewCard && /* @__PURE__ */ jsxRuntimeExports.jsx(StaffIDCard, { staff: viewCard, onClose: () => setViewCard(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editStaff ? "Edit Staff" : "Add New Staff" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "w-full border border-gray-200 rounded-md px-3 py-2 text-sm",
                value: form.role,
                onChange: (e) => setForm({ ...form, role: e.target.value }),
                children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r.value, children: r.label }, r.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.phone,
                onChange: (e) => setForm({ ...form, phone: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.email,
                onChange: (e) => setForm({ ...form, email: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.department,
                onChange: (e) => setForm({ ...form, department: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Join Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.joinDate,
                onChange: (e) => setForm({ ...form, joinDate: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.address,
              onChange: (e) => setForm({ ...form, address: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: save,
            children: "Save"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  StaffPage as default
};
