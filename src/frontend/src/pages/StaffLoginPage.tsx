import { useState } from "react";
import { backend } from "../actor";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { Staff } from "../tailor-types";

export type LoginRole = "owner" | "staff";

export interface LoginResult {
  role: LoginRole;
  staff?: Staff;
  ownerName?: string;
}

interface StaffLoginPageProps {
  onLogin: (result: LoginResult) => void;
}

const DEFAULT_OWNER_MOBILE = "9999999999";
const DEFAULT_OWNER_PASSWORD = "owner@123";

export default function StaffLoginPage({ onLogin }: StaffLoginPageProps) {
  const [tab, setTab] = useState<"owner" | "staff">("owner");

  // Owner form
  const [ownerMobile, setOwnerMobile] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Staff form
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerError("");
    if (!ownerMobile.trim() || !ownerPassword.trim()) {
      setOwnerError("Enter both mobile and password.");
      return;
    }
    if (ownerMobile.trim() !== DEFAULT_OWNER_MOBILE) {
      setOwnerError("Incorrect owner credentials.");
      return;
    }
    setOwnerLoading(true);
    try {
      // Try cloud backend first, fall back to local storage, then default
      let correctPassword = DEFAULT_OWNER_PASSWORD;
      try {
        correctPassword = await backend.getOwnerPassword();
      } catch {
        // Cloud unreachable -- try localStorage cache
        const cached = localStorage.getItem("tailorpro_owner_pw");
        if (cached) correctPassword = cached;
      }
      if (ownerPassword === correctPassword) {
        onLogin({ role: "owner", ownerName: "Shop Owner" });
      } else {
        setOwnerError("Incorrect owner credentials.");
      }
    } catch {
      setOwnerError("Something went wrong. Please try again.");
    } finally {
      setOwnerLoading(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!mobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }
    setLoading(true);
    try {
      const staffList = await backend.getStaff();
      const matched = staffList.find((s) => s.phone.trim() === mobile.trim());
      if (!matched) {
        setError("No staff found with this mobile number.");
        setLoading(false);
        return;
      }
      const ok = await backend.verifyStaffPassword(
        matched.phone.trim(),
        password,
      );
      if (ok) {
        onLogin({ role: "staff", staff: matched });
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#F4F6F8",
        fontFamily: "Inter, Segoe UI, sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-center px-6 py-4"
        style={{ background: "#0F2233" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/ali-tailor-icon-transparent.dim_512x512.png"
            alt="Ali Tailor"
            className="w-10 h-10 rounded-xl shadow-lg"
          />
          <span className="text-white font-bold text-xl tracking-tight">
            Ali Tailor
          </span>
        </div>
      </header>

      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card header */}
          <div
            className="px-8 py-6 text-center"
            style={{ background: "#0F2233" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                background: "rgba(31,126,120,0.25)",
                border: "2px solid rgba(31,126,120,0.6)",
              }}
            >
              <span className="text-3xl">{tab === "owner" ? "👑" : "🔒"}</span>
            </div>
            <h1 className="text-white font-bold text-xl">
              {tab === "owner" ? "Owner Login" : "Staff Login"}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(234,240,246,0.7)" }}
            >
              {tab === "owner"
                ? "Full access to all features"
                : "Enter your credentials to continue"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => {
                setTab("owner");
                setOwnerError("");
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === "owner"
                  ? "text-[#1F7E78] border-b-2 border-[#1F7E78] bg-[#f0fafa]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              👑 Owner
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("staff");
                setError("");
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === "staff"
                  ? "text-[#1F7E78] border-b-2 border-[#1F7E78] bg-[#f0fafa]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              👤 Staff
            </button>
          </div>

          {/* Owner Form */}
          {tab === "owner" && (
            <form onSubmit={handleOwnerSubmit} className="px-8 py-6 space-y-4">
              <div>
                <label
                  htmlFor="owner-mobile"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Owner Mobile Number
                </label>
                <Input
                  id="owner-mobile"
                  type="tel"
                  placeholder="Enter owner mobile"
                  value={ownerMobile}
                  onChange={(e) => setOwnerMobile(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="owner-password"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Password
                </label>
                <Input
                  id="owner-password"
                  type="password"
                  placeholder="Enter owner password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {ownerError && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {ownerError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full font-semibold text-white"
                style={{ background: "#b45309" }}
                disabled={ownerLoading}
              >
                {ownerLoading ? "Signing in..." : "Sign In as Owner"}
              </Button>
            </form>
          )}

          {/* Staff Form */}
          {tab === "staff" && (
            <form onSubmit={handleStaffSubmit} className="px-8 py-6 space-y-4">
              <div>
                <label
                  htmlFor="login-mobile"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Mobile Number
                </label>
                <Input
                  id="login-mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  First-time login? Leave password blank or enter any password.
                </p>
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full font-semibold text-white"
                style={{ background: "#1F7E78" }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          <div className="px-8 pb-5 text-center text-xs text-gray-400">
            Ali Tailor ERP · {tab === "owner" ? "Owner Portal" : "Staff Portal"}
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
