"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fff1f6 0%, #f0f9ff 40%, #fef8e1 100%)" }}>
        <div className="text-2xl font-black" style={{ color: "#a37cf0" }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-10"
      style={{ background: "linear-gradient(135deg, #fff1f6 0%, #f0f9ff 40%, #fef8e1 100%)" }}>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span style={{
            fontSize: 20,
            fontWeight: 900,
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0, #4dc3ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}>
            Mini Z and Me
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "white",
              border: "2px solid #efeaf7",
              borderRadius: 12,
              padding: "8px 18px",
              fontFamily: "inherit",
              fontWeight: 800,
              fontSize: 14,
              color: "#5d5878",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>

        {/* Welcome card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <div className="text-5xl mb-4">🌟</div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "#2b2740" }}>
            Welcome back!
          </h1>
          <p className="font-semibold text-lg mb-6" style={{ color: "#a37cf0" }}>
            {user?.email}
          </p>
          <p className="font-semibold" style={{ color: "#5d5878" }}>
            You&apos;re logged in to Mini Z and Me. Your personalised activity library will appear here soon.
          </p>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="font-black text-lg mb-4" style={{ color: "#2b2740" }}>Quick links</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/" className="chip" style={{ fontSize: 14, padding: "8px 16px", cursor: "pointer" }}>
              🏠 Home
            </a>
            <a href="/" className="chip area" style={{ fontSize: 14, padding: "8px 16px", cursor: "pointer" }}>
              🎨 Activity library
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
