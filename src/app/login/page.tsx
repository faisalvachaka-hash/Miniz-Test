"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check whether this user already has a child profile
    const { data: kids } = await supabase
      .from("children")
      .select("id")
      .limit(1);

    if (kids && kids.length > 0) {
      router.push("/app");
    } else {
      router.push("/onboarding");
    }
  }

  return (
    <AuthLayout title="Welcome back!" subtitle="Log in to your Mini Z and Me account">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
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
          {loading ? "Logging in…" : "Log in →"}
        </button>

        <p className="text-center text-sm font-bold mt-2" style={{ color: "var(--ink-soft)" }}>
          <Link href="/forgot-password" style={{ color: "var(--clay)", fontWeight: 800 }}>
            Forgot password?
          </Link>
        </p>

        <p className="text-center text-sm font-bold" style={{ color: "var(--ink-soft)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "var(--clay)", fontWeight: 800 }}>
            Sign up free
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
