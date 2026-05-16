"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapActivityFromDB, AGES, type Activity } from "@/lib/data";
import { ActivityModal } from "@/components/ActivityModal";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      supabase
        .from("activities")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .then(({ data: rows }) => {
          if (rows) setActivities(rows.map(mapActivityFromDB));
          setLoading(false);
        });
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

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" style={{
            fontSize: 20,
            fontWeight: 900,
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0, #4dc3ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textDecoration: "none",
          }}>
            Mini Z and Me
          </a>
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
          <h1 className="text-3xl font-black mb-1" style={{ color: "#2b2740" }}>
            Welcome back!
          </h1>
          <p className="font-semibold text-lg" style={{ color: "#a37cf0" }}>
            {user?.email}
          </p>
        </div>

        {/* Saved activities */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <h2 className="font-black text-xl mb-1" style={{ color: "#2b2740" }}>
            Your saved activities
          </h2>
          <p className="font-semibold mb-6" style={{ color: "#5d5878", fontSize: 14 }}>
            Activities you&apos;ve created with the builder
          </p>

          {activities.length === 0 ? (
            <div className="text-center py-10" style={{ color: "#9b93b8" }}>
              <div className="text-5xl mb-3">🌱</div>
              <p className="font-semibold">No saved activities yet.</p>
              <p className="font-semibold text-sm mt-1">
                Head to the{" "}
                <a href="/" style={{ color: "#a37cf0" }}>activity library</a>
                {" "}and use the builder to create your first one!
              </p>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
            >
              {activities.map((a) => (
                <div
                  key={String(a.id)}
                  className="activity-card"
                  style={{ ["--accent" as string]: a.color }}
                  onClick={() => setSelectedActivity(a)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedActivity(a);
                    }
                  }}
                >
                  <div className="activity-icon">{a.emoji}</div>
                  <div className="activity-title">{a.title}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="chip">{AGES.find((x) => x.age === a.age)?.label}</span>
                    <span className="chip duration">⏱ {a.duration}</span>
                    <span className="chip area">{a.area}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}
