import { useEffect, useState } from "react";
import { backend } from "../actor";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function OwnerSettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep name/mobile editable in UI (display only, owner mobile stays 9999999999)
  const [name, setName] = useState("Shop Owner");
  const [mobile] = useState("9999999999");

  useEffect(() => {
    // Load owner name from session if available
    try {
      const session = localStorage.getItem("tailorpro_owner_session");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.name) setName(parsed.name);
      }
    } catch {}
  }, []);

  const handleSave = async (e: React.FormEvent) => {
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
      // Save name to session
      localStorage.setItem(
        "tailorpro_owner_session",
        JSON.stringify({ name: name.trim() }),
      );
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
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
              readOnly
              className="bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Owner mobile is fixed and cannot be changed.
            </p>
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
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <strong>Current login:</strong> Mobile{" "}
        <code className="font-mono">{mobile}</code> — password is hidden for
        security. Passwords are now saved to the cloud.
      </div>
    </div>
  );
}
