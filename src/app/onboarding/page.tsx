"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthLayout from "@/components/AuthLayout";
import { AGES, type AgeKey } from "@/lib/data";

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeKey>(2);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Must be logged in; if user already has children, skip to /app
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      const { data: kids } = await supabase
        .from("children")
        .select("id")
        .limit(1);
      if (kids && kids.length > 0) {
        router.push("/app");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your child's name.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase
      .from("children")
      .insert({ user_id: user.id, name: trimmed, age });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push("/app");
  }

  if (checking) {
    return (
      <AuthLayout title="One moment… ⏳" subtitle="Setting things up">
        <div className="text-center" style={{ color: "var(--ink-soft)", fontWeight: 700 }}>
          Loading…
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Tell us about your little one 👶"
      subtitle="So we can pick activities that suit them best"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-black mb-1.5" style={{ color: "var(--ink)" }}>
            Child&apos;s name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Zara"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-black mb-1.5" style={{ color: "var(--ink)" }}>
            Age
          </label>
          <select
            value={age}
            onChange={(e) => setAge(Number(e.target.value) as AgeKey)}
            style={inputStyle}
          >
            {AGES.map((a) => (
              <option key={a.age} value={a.age}>
                {a.emoji} {a.label} · {a.sub}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="safety-banner">⚠️ {error}</div>}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full"
          style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Saving…" : "Continue to activities →"}
        </button>

        <p className="text-center text-xs font-bold" style={{ color: "var(--ink-faint)" }}>
          You can add more little ones any time from your dashboard.
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
