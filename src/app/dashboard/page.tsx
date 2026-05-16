"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapActivityFromDB, AGES, type Activity, type AgeKey, type Child } from "@/lib/data";
import { ActivityModal } from "@/components/ActivityModal";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [children, setChildren] = useState<Child[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState<AgeKey>(2);
  const [addError, setAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      const [{ data: rows }, { data: kids }] = await Promise.all([
        supabase
          .from("activities")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("children")
          .select("id, name, age")
          .order("created_at", { ascending: true }),
      ]);

      if (rows) setActivities(rows.map(mapActivityFromDB));
      if (kids) setChildren(kids as Child[]);
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      setAddError("Please enter a name.");
      return;
    }
    setAddError(null);
    const { data, error } = await supabase
      .from("children")
      .insert({ user_id: user.id, name: trimmed, age: newAge })
      .select()
      .single();
    if (error) {
      setAddError(error.message);
      return;
    }
    if (data) setChildren((prev) => [...prev, data as Child]);
    setNewName("");
    setNewAge(2);
    setShowAdd(false);
  }

  async function handleUpdateAge(child: Child, age: AgeKey) {
    const { error } = await supabase.from("children").update({ age }).eq("id", child.id);
    if (!error) {
      setChildren((prev) => prev.map((c) => (c.id === child.id ? { ...c, age } : c)));
    }
    setEditingId(null);
  }

  async function handleDeleteChild(child: Child) {
    if (!confirm(`Remove ${child.name}'s profile? You can add them again any time.`)) return;
    const { error } = await supabase.from("children").delete().eq("id", child.id);
    if (!error) {
      setChildren((prev) => prev.filter((c) => c.id !== child.id));
    }
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
          <a href="/app" style={{
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

        {/* Children card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-xl" style={{ color: "#2b2740" }}>
              My children
            </h2>
            <button
              onClick={() => setShowAdd((s) => !s)}
              style={{
                background: showAdd ? "#efeaf7" : "linear-gradient(90deg, #ff6fa3, #a37cf0)",
                color: showAdd ? "#5d5878" : "white",
                border: "none",
                borderRadius: 12,
                padding: "8px 16px",
                fontFamily: "inherit",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {showAdd ? "Cancel" : "+ Add child"}
            </button>
          </div>
          <p className="font-semibold mb-6" style={{ color: "#5d5878", fontSize: 14 }}>
            We&apos;ll pre-filter activities for the active child.
          </p>

          {showAdd && (
            <form
              onSubmit={handleAddChild}
              className="mb-6 p-4 rounded-2xl"
              style={{ background: "#faf8ff", border: "2px solid #efeaf7" }}
            >
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 160px" }}>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#2b2740" }}>
                    Child&apos;s name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Zara"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#2b2740" }}>
                    Age
                  </label>
                  <select
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value) as AgeKey)}
                    style={inputStyle}
                  >
                    {AGES.map((a) => (
                      <option key={a.age} value={a.age}>
                        {a.emoji} {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {addError && <div className="safety-banner mt-3">⚠️ {addError}</div>}
              <button
                type="submit"
                className="btn-primary mt-3"
                style={{ width: "100%" }}
              >
                Save child
              </button>
            </form>
          )}

          {children.length === 0 ? (
            <div className="text-center py-8" style={{ color: "#9b93b8" }}>
              <div className="text-4xl mb-2">👶</div>
              <p className="font-semibold">No children added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {children.map((c) => {
                const ageInfo = AGES.find((a) => a.age === c.age);
                const isEditing = editingId === c.id;
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background: "#faf8ff", border: "2px solid #efeaf7" }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: ageInfo?.color ?? "#a37cf0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        flexShrink: 0,
                      }}
                    >
                      {ageInfo?.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-black" style={{ color: "#2b2740", fontSize: 16 }}>
                        {c.name}
                      </div>
                      {isEditing ? (
                        <select
                          value={c.age}
                          onChange={(e) => handleUpdateAge(c, Number(e.target.value) as AgeKey)}
                          autoFocus
                          style={{ ...inputStyle, padding: "4px 8px", fontSize: 13, marginTop: 4 }}
                        >
                          {AGES.map((a) => (
                            <option key={a.age} value={a.age}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="font-semibold text-sm" style={{ color: "#5d5878" }}>
                          {ageInfo?.label} · {ageInfo?.sub}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => setEditingId(c.id)}
                          style={{
                            background: "white",
                            border: "2px solid #efeaf7",
                            borderRadius: 10,
                            padding: "6px 12px",
                            fontFamily: "inherit",
                            fontWeight: 800,
                            fontSize: 12,
                            color: "#5d5878",
                            cursor: "pointer",
                          }}
                        >
                          Edit age
                        </button>
                        <button
                          onClick={() => handleDeleteChild(c)}
                          style={{
                            background: "white",
                            border: "2px solid #ffd6e3",
                            borderRadius: 10,
                            padding: "6px 12px",
                            fontFamily: "inherit",
                            fontWeight: 800,
                            fontSize: 12,
                            color: "#d23069",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
                <a href="/app" style={{ color: "#a37cf0" }}>activity library</a>
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
            <a href="/app" className="chip" style={{ fontSize: 14, padding: "8px 16px", cursor: "pointer" }}>
              🎨 Activity library
            </a>
            <a href="/" className="chip area" style={{ fontSize: 14, padding: "8px 16px", cursor: "pointer" }}>
              🏠 Landing page
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

const inputStyle: React.CSSProperties = {
  border: "2px solid #efeaf7",
  borderRadius: 12,
  padding: "10px 12px",
  fontFamily: "inherit",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  color: "#2b2740",
  background: "white",
};
