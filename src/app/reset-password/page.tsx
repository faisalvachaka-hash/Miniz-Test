"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exchange the code in the URL for a session
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setError("Invalid or expired reset link. Please request a new one.");
      } else {
        setReady(true);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/app");
    }
  }

  if (!ready && !error) {
    return (
      <AuthLayout title="One moment… ⏳" subtitle="Verifying your reset link">
        <div className="text-center font-semibold" style={{ color: "#5d5878" }}>
          Checking your link…
        </div>
      </AuthLayout>
    );
  }

  if (error && !ready) {
    return (
      <AuthLayout title="Link expired 😔" subtitle="This reset link is no longer valid">
        <div className="text-center">
          <p className="font-semibold mb-6" style={{ color: "#5d5878", fontSize: 15 }}>
            {error}
          </p>
          <a href="/forgot-password" style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0)",
            color: "white",
            borderRadius: 14,
            padding: "12px 28px",
            fontWeight: 800,
            fontSize: 14,
            textDecoration: "none",
          }}>
            Request a new link →
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password 🔒" subtitle="Choose something memorable">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#2b2740" }}>
            New password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#2b2740" }}>
            Confirm new password
          </label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your new password"
            style={inputStyle}
          />
        </div>

        {error && (
          <div className="safety-banner">⚠️ {error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Saving…" : "Set new password →"}
        </button>
      </form>
    </AuthLayout>
  );
}

const inputStyle: React.CSSProperties = {
  border: "2px solid #efeaf7",
  borderRadius: 14,
  padding: "12px 14px",
  fontFamily: "inherit",
  fontSize: 15,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  color: "#2b2740",
};
