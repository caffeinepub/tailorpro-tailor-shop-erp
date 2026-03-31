import { useCallback, useEffect, useRef, useState } from "react";
import { backend } from "../actor";
import { Badge } from "../components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
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
              Ali Tailor ✂️
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
            Ali Tailor ERP · Staff Identity Card
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

function SetPasswordDialog({
  staff,
  onClose,
}: { staff: Staff; onClose: () => void }) {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const trimmedPhone = staff.phone.trim();
  const [hasExisting, setHasExisting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    backend.hasStaffPassword(trimmedPhone).then(setHasExisting);
  }, [trimmedPhone]);

  const handleSave = async () => {
    setError("");
    if (!newPw) {
      setError("Password cannot be empty.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await backend.setStaffPassword(trimmedPhone, newPw);
      setSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch {
      setError("Failed to save password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {hasExisting ? "Change Password" : "Set Password"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1 mb-2">
          <p className="text-sm text-gray-500">
            Staff:{" "}
            <span className="font-semibold text-gray-800">{staff.name}</span>
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-0.5">
              New Password
            </p>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              data-ocid="set_password.input"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-0.5">
              Confirm Password
            </p>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              data-ocid="set_password.input"
            />
          </div>
          {error && (
            <p
              className="text-xs text-red-600 bg-red-50 rounded px-2 py-1"
              data-ocid="set_password.error_state"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-xs text-green-600 bg-green-50 rounded px-2 py-1"
              data-ocid="set_password.success_state"
            >
              ✅ Password saved!
            </p>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="set_password.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1F7E78] hover:bg-[#166661] text-white"
            onClick={handleSave}
            disabled={saving}
            data-ocid="set_password.save_button"
          >
            {saving ? "Saving..." : "Save Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [viewCard, setViewCard] = useState<Staff | null>(null);
  const [setPwStaff, setSetPwStaff] = useState<Staff | null>(null);
  const [search, setSearch] = useState("");
  const [_pwRefresh, setPwRefresh] = useState(0);
  const [staffHasPassword, setStaffHasPassword] = useState<
    Record<string, boolean>
  >({});
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "Tailor" as RoleKey,
    phone: "",
    email: "",
    department: "",
    joinDate: new Date().toISOString().slice(0, 10),
    address: "",
  });

  const load = useCallback(async () => {
    const list = await backend.getStaff();
    setStaffList(list);
    const entries = await Promise.all(
      list.map(async (s) => {
        const hasPw = await backend.hasStaffPassword(s.phone.trim());
        return [s.phone.trim(), hasPw] as [string, boolean];
      }),
    );
    setStaffHasPassword(Object.fromEntries(entries));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditStaff(null);
    setFormError("");
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
    setFormError("");
    const joinDate = new Date(Number(s.joinDate / 1_000_000n))
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
    setFormError("");
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }
    setSaving(true);
    try {
      const roleObj = { [form.role]: null } as unknown as StaffRole;
      const joinDateVal = form.joinDate
        ? new Date(form.joinDate).getTime()
        : Date.now();
      const joinDateMs = BigInt(Math.floor(joinDateVal)) * 1_000_000n;
      if (editStaff) {
        await backend.updateStaff(
          editStaff.id,
          form.name.trim(),
          roleObj,
          form.phone.trim(),
          form.email.trim(),
          form.department.trim(),
          joinDateMs,
          form.address.trim(),
        );
      } else {
        await backend.addStaff(
          form.name.trim(),
          roleObj,
          form.phone.trim(),
          form.email.trim(),
          form.department.trim(),
          joinDateMs,
          form.address.trim(),
        );
      }
      setShowAdd(false);
      load();
    } catch {
      setFormError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: bigint) => {
    if (confirm("Delete this staff member?")) {
      await backend.deleteStaff(id);
      load();
    }
  };

  const handleSetPwClose = () => {
    setSetPwStaff(null);
    setPwRefresh((n) => n + 1);
    load();
  };

  const handleResetPassword = async (phone: string) => {
    if (
      confirm(
        "Reset this staff member's password? They won't be able to log in until a new password is set.",
      )
    ) {
      await backend.deleteStaffCredentials(phone.trim());
      setPwRefresh((n) => n + 1);
      load();
    }
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 1500);
    });
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
        <h1 className="text-2xl font-bold text-[#111827]">Staff Management</h1>
        <Button
          onClick={openAdd}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
          data-ocid="staff.primary_button"
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
            data-ocid="staff.search_input"
          />

          <Tabs defaultValue="id-cards" data-ocid="staff.tab">
            <TabsList className="mb-4">
              <TabsTrigger value="id-cards" data-ocid="staff.id_cards.tab">
                🪪 ID Cards
              </TabsTrigger>
              <TabsTrigger
                value="credentials"
                data-ocid="staff.credentials.tab"
              >
                🔐 Credentials
              </TabsTrigger>
            </TabsList>

            {/* ID Cards Tab */}
            <TabsContent value="id-cards">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.length === 0 && (
                  <p
                    className="text-sm text-gray-400 col-span-4 py-8 text-center"
                    data-ocid="staff.empty_state"
                  >
                    No staff found
                  </p>
                )}
                {filtered.map((s, idx) => {
                  const roleLabel = getRoleLabel(s.role);
                  const color = ROLE_COLORS[roleLabel];
                  const hasPw = staffHasPassword[s.phone.trim()] ?? false;
                  return (
                    <div
                      key={String(s.id)}
                      data-ocid={`staff.item.${idx + 1}`}
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
                        {/* Row 1: View ID (full width) */}
                        <button
                          type="button"
                          onClick={() => setViewCard(s)}
                          className="w-full mt-3 text-xs py-1.5 rounded-lg font-semibold text-white"
                          style={{ background: color }}
                          data-ocid={`staff.view_button.${idx + 1}`}
                        >
                          View ID
                        </button>
                        {/* Row 2: Edit + Delete side by side */}
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                            data-ocid={`staff.edit_button.${idx + 1}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => del(s.id)}
                            className="flex-1 text-xs py-1.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 border-0"
                            data-ocid={`staff.delete_button.${idx + 1}`}
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSetPwStaff(s)}
                          className="w-full mt-2 text-xs py-1.5 rounded-lg border font-medium transition-colors"
                          style={{
                            borderColor: hasPw ? "#d1d5db" : "#1F7E78",
                            color: hasPw ? "#6b7280" : "#1F7E78",
                            background: hasPw ? "#f9fafb" : "#f0fdfb",
                          }}
                          data-ocid={`staff.set_password_button.${idx + 1}`}
                        >
                          {hasPw ? "🔑 Change Password" : "🔑 Set Password"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Credentials Tab */}
            <TabsContent value="credentials">
              {filtered.length === 0 ? (
                <p
                  className="text-sm text-gray-400 py-8 text-center"
                  data-ocid="staff.credentials.empty_state"
                >
                  No staff found
                </p>
              ) : (
                <div
                  className="rounded-xl border border-gray-100 overflow-x-auto"
                  data-ocid="staff.credentials.table"
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Staff Member
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Role
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Mobile Number
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Password
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((s, idx) => {
                        const roleLabel = getRoleLabel(s.role);
                        const color = ROLE_COLORS[roleLabel];
                        // pwRefresh is read to re-render when passwords change
                        const hasPw = staffHasPassword[s.phone.trim()] ?? false;
                        return (
                          <TableRow
                            key={String(s.id)}
                            data-ocid={`staff.credentials.row.${idx + 1}`}
                            className="hover:bg-gray-50"
                          >
                            {/* Name + Avatar */}
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div
                                  style={{ background: color }}
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                >
                                  {getInitials(s.name)}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-800">
                                    {s.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {s.staffId}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Role */}
                            <TableCell>
                              <span
                                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                                style={{ background: color }}
                              >
                                {roleLabel}
                              </span>
                            </TableCell>

                            {/* Mobile number */}
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-semibold text-gray-800 tracking-wide">
                                  📞 {s.phone}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyPhone(s.phone)}
                                  className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                  title="Copy number"
                                  data-ocid={`staff.credentials.copy_button.${idx + 1}`}
                                >
                                  {copiedPhone === s.phone ? "✅" : "📋"}
                                </button>
                              </div>
                            </TableCell>

                            {/* Password status */}
                            <TableCell>
                              {hasPw ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                  ✓ Set
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-500"
                                >
                                  Not Set
                                </Badge>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-7 border-[#1F7E78] text-[#1F7E78] hover:bg-[#f0fdfb]"
                                  onClick={() => setSetPwStaff(s)}
                                  data-ocid={`staff.credentials.set_password_button.${idx + 1}`}
                                >
                                  🔑 {hasPw ? "Change" : "Set Password"}
                                </Button>
                                {hasPw && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7 border-red-200 text-red-500 hover:bg-red-50"
                                    onClick={() => handleResetPassword(s.phone)}
                                    data-ocid={`staff.credentials.reset_button.${idx + 1}`}
                                  >
                                    🗑️ Reset
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className="text-xs h-7 bg-red-500 hover:bg-red-600 text-white border-0"
                                  onClick={() => del(s.id)}
                                  data-ocid={`staff.credentials.delete_button.${idx + 1}`}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {viewCard && (
        <StaffIDCard staff={viewCard} onClose={() => setViewCard(null)} />
      )}

      {setPwStaff && (
        <SetPasswordDialog staff={setPwStaff} onClose={handleSetPwClose} />
      )}

      <Dialog
        open={showAdd}
        onOpenChange={(open) => {
          if (!saving) setShowAdd(open);
        }}
      >
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
                  data-ocid="staff.name.input"
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
                  Phone *
                </p>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-ocid="staff.phone.input"
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
          {formError && (
            <p
              className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mt-2"
              data-ocid="staff.form.error_state"
            >
              {formError}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdd(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1F7E78] hover:bg-[#166661] text-white"
              onClick={save}
              disabled={saving}
              data-ocid="staff.form.submit_button"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
