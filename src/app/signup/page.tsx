"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AuthLayout from "@/components/AuthLayout";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
        setError("An account with this email already exists. Try logging in instead.");
      } else {
        setError(error.message);
      }
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError("An account with this email already exists. Try logging in instead.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <AuthLayout title="Check your email 📬" subtitle="Almost there — one more step">
        <div className="text-center py-4">
          <div className="text-5xl mb-4">🎉</div>
          <p className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            We sent a confirmation link to:
          </p>
          <p className="font-black text-lg mb-6" style={{ color: "var(--clay)" }}>{email}</p>
          <p className="text-sm mb-6" style={{ color: "var(--ink-soft)", fontWeight: 600, lineHeight: 1.6 }}>
            Click the link in that email to activate your account, then come back to log in.
          </p>
          <Link href="/login" className="btn-primary inline-block text-center" style={{ textDecoration: "none" }}>
            Go to log in →
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join Mini Z and Me — it's free">
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-black mb-1.5" style={{ color: "var(--ink)" }}>
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-black mb-1.5" style={{ color: "var(--ink)" }}>
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full"
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
          {loading ? "Creating account…" : "Sign up →"}
        </button>

        <p className="text-center text-sm font-bold" style={{ color: "var(--ink-soft)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--clay)", fontWeight: 800 }}>
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

const inputStyle: React.CSSProperties = {
  border: "2px solid var(--paper-edge)",
  borderRadius: "var(--r1)",
  padding: "12px 14px",
  fontFamily: "inherit",
  fontSize: 15,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--ink)",
  background: "var(--cream)",
  fontWeight: 600,
};
