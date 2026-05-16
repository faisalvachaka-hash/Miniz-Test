"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your inbox 📬" subtitle="We've sent a password reset link to your email">
        <div className="text-center">
          <p className="font-semibold mb-6" style={{ color: "#5d5878", fontSize: 15, lineHeight: 1.6 }}>
            Click the link in the email to set a new password. It may take a minute to arrive — check your spam folder too.
          </p>
          <Link href="/login" style={{
            display: "inline-block",
            background: "white",
            border: "2px solid #efeaf7",
            borderRadius: 14,
            padding: "12px 28px",
            fontWeight: 800,
            fontSize: 14,
            color: "#5d5878",
            textDecoration: "none",
          }}>
            Back to Log In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password 🔑" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#2b2740" }}>
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
          {loading ? "Sending…" : "Send reset link →"}
        </button>

        <p className="text-center text-sm font-semibold" style={{ color: "#5d5878" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#a37cf0", fontWeight: 800 }}>
            Log in
          </Link>
        </p>
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
