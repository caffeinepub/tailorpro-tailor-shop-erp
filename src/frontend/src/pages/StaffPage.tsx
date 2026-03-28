import { useCallback, useEffect, useRef, useState } from "react";
import { backend } from "../actor";
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
import type { Staff, StaffRole } from "../tailor-types";

type RoleKey =
  | "Tailor"
  | "Cutter"
  | "Helper"
  | "Manager"
  | "Receptionist"
  | "Other";

const ROLES: { label: string; value: RoleKey }[] = [
  { label: "Tailor", value: "Tailor" },
  { label: "Cutter", value: "Cutter" },
  { label: "Helper", value: "Helper" },
  { label: "Manager", value: "Manager" },
  { label: "Receptionist", value: "Receptionist" },
  { label: "Other", value: "Other" },
];

const ROLE_COLORS: Record<RoleKey, string> = {
  Tailor: "#1F7E78",
  Cutter: "#2563EB",
  Helper: "#7C3AED",
  Manager: "#0F2233",
  Receptionist: "#D97706",
  Other: "#6B7280",
};

function getRoleLabel(role: StaffRole): RoleKey {
  return (Object.keys(role)[0] ?? "Other") as RoleKey;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StaffIDCard({
  staff,
  onClose,
}: { staff: Staff; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const roleLabel = getRoleLabel(staff.role);
  const color = ROLE_COLORS[roleLabel];
  const joinDate = new Date(
    Number(staff.joinDate) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <div
          ref={cardRef}
          style={{
            fontFamily: "Inter, sans-serif",
            background: "white",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: color,
              padding: "28px 20px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
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
                border: "3px solid rgba(255,255,255,0.5)",
              }}
            >
              {getInitials(staff.name)}
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
                margin: "0 0 4px",
              }}
            >
              TailorPro ✂️
            </p>
            <p
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              {staff.name}
            </p>
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: 20,
                padding: "2px 14px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {roleLabel}
            </span>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p
                style={{
                  fontSize: 10,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                Staff ID
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: color,
                  letterSpacing: 2,
                  margin: 0,
                }}
              >
                {staff.staffId}
              </p>
            </div>
            {(
              [
                { label: "Department", val: staff.department },
                { label: "Phone", val: staff.phone },
                { label: "Email", val: staff.email },
                { label: "Joined", val: joinDate },
              ] as { label: string; val: string }[]
            ).map(({ label, val }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#9ca3af", width: 70, flexShrink: 0 }}>
                  {label}
                </span>
                <span style={{ color: "#111827", fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#f9fafb",
              borderTop: "1px solid #e5e7eb",
              padding: "10px 20px",
              textAlign: "center",
              fontSize: 10,
              color: "#9ca3af",
            }}
          >
            TailorPro ERP · Staff Identity Card
          </div>
        </div>
        <div className="flex gap-2 p-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            className="flex-1 bg-[#1F7E78] hover:bg-[#166661] text-white"
            onClick={handlePrint}
          >
            🖨️ Print ID
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [viewCard, setViewCard] = useState<Staff | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "Tailor" as RoleKey,
    phone: "",
    email: "",
    department: "",
    joinDate: new Date().toISOString().slice(0, 10),
    address: "",
  });

  const load = useCallback(() => backend.getStaff().then(setStaffList), []);
  useEffect(() => {
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
      joinDate: new Date().toISOString().slice(0, 10),
      address: "",
    });
    setShowAdd(true);
  };

  const openEdit = (s: Staff) => {
    setEditStaff(s);
    const joinDate = new Date(Number(s.joinDate) / 1_000_000)
      .toISOString()
      .slice(0, 10);
    setForm({
      name: s.name,
      role: getRoleLabel(s.role),
      phone: s.phone,
      email: s.email,
      department: s.department,
      joinDate,
      address: s.address,
    });
    setShowAdd(true);
  };

  const save = async () => {
    const roleObj = { [form.role]: null } as unknown as StaffRole;
    const joinDateMs = BigInt(new Date(form.joinDate).getTime()) * 1_000_000n;
    if (editStaff) {
      await backend.updateStaff(
        editStaff.id,
        form.name,
        roleObj,
        form.phone,
        form.email,
        form.department,
        joinDateMs,
        form.address,
      );
    } else {
      await backend.addStaff(
        form.name,
        roleObj,
        form.phone,
        form.email,
        form.department,
        joinDateMs,
        form.address,
      );
    }
    setShowAdd(false);
    load();
  };

  const del = async (id: bigint) => {
    if (confirm("Delete this staff member?")) {
      await backend.deleteStaff(id);
      load();
    }
  };

  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.staffId.includes(search) ||
      s.phone.includes(search),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Staff ID Cards</h1>
        <Button
          onClick={openAdd}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
        >
          + Add Staff
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-4">
          <Input
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 col-span-4 py-8 text-center">
                No staff found
              </p>
            )}
            {filtered.map((s) => {
              const roleLabel = getRoleLabel(s.role);
              const color = ROLE_COLORS[roleLabel];
              return (
                <div
                  key={String(s.id)}
                  className="rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow"
                >
                  <div
                    style={{
                      background: color,
                      padding: "18px 16px 14px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
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
                        border: "2px solid rgba(255,255,255,0.5)",
                      }}
                    >
                      {getInitials(s.name)}
                    </div>
                    <p className="text-white font-bold text-sm">{s.name}</p>
                    <span
                      style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        borderRadius: 20,
                        padding: "1px 10px",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {roleLabel}
                    </span>
                  </div>
                  <div className="p-3">
                    <p
                      className="text-center font-bold text-lg"
                      style={{ color }}
                    >
                      {s.staffId}
                    </p>
                    <p className="text-center text-xs text-gray-500 mb-3">
                      {s.department}
                    </p>
                    <p className="text-xs text-gray-500">📞 {s.phone}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setViewCard(s)}
                        className="flex-1 text-xs py-1.5 rounded-lg font-semibold text-white"
                        style={{ background: color }}
                      >
                        View ID
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => del(s.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {viewCard && (
        <StaffIDCard staff={viewCard} onClose={() => setViewCard(null)} />
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editStaff ? "Edit Staff" : "Add New Staff"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Name *
                </p>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Role
                </p>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as RoleKey })
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Phone
                </p>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Email
                </p>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Department
                </p>
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  Join Date
                </p>
                <Input
                  type="date"
                  value={form.joinDate}
                  onChange={(e) =>
                    setForm({ ...form, joinDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">
                Address
              </p>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1F7E78] hover:bg-[#166661] text-white"
              onClick={save}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
