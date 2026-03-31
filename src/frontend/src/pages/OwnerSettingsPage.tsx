import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const OWNER_CREDS_KEY = "tailorpro_owner_creds";

function getOwnerCreds() {
  const raw = localStorage.getItem(OWNER_CREDS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as {
        mobile: string;
        password: string;
        name: string;
      };
    } catch {}
  }
  return { mobile: "9999999999", password: "owner@123", name: "Shop Owner" };
}

export default function OwnerSettingsPage() {
  const creds = getOwnerCreds();
  const [name, setName] = useState(creds.name);
  const [mobile, setMobile] = useState(creds.mobile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = (e: React.FormEvent) => {
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
      password: newPassword || creds.password,
    };
    localStorage.setItem(OWNER_CREDS_KEY, JSON.stringify(updated));
    localStorage.setItem(
      "tailorpro_owner_session",
      JSON.stringify({ name: updated.name }),
    );
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Owner Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your owner account credentials.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label
              htmlFor="owner-name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Shop / Owner Name
            </label>
            <Input
              id="owner-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmed Tailors"
            />
          </div>
          <div>
            <label
              htmlFor="owner-mobile"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Owner Mobile (Login ID)
            </label>
            <Input
              id="owner-mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 9999999999"
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {saved && (
            <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              Settings saved successfully!
            </div>
          )}

          <Button
            type="submit"
            className="w-full font-semibold text-white"
            style={{ background: "#b45309" }}
          >
            Save Changes
          </Button>
        </form>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <strong>Current login:</strong> Mobile{" "}
        <code className="font-mono">{creds.mobile}</code> — password is hidden
        for security.
      </div>
    </div>
  );
}
