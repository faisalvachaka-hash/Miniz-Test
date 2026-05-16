"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapActivityFromDB, AGES, type Activity, type AgeKey, type Child } from "@/lib/data";
import { ActivityModal } from "@/components/ActivityModal";
import type { User } from "@supabase/supabase-js";

type LibraryEntry = { activity: Activity; source: "custom" | "saved" };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
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
      const uid = data.user.id;

      const [{ data: customs }, { data: saves }, { data: kids }] = await Promise.all([
        supabase
          .from("activities")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("saved_activities")
          .select("activity_id, created_at, activities(*)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("children")
          .select("id, name, age")
          .order("created_at", { ascending: true }),
      ]);

      const entries: LibraryEntry[] = [];
      if (customs) {
        for (const row of customs) {
          entries.push({ activity: mapActivityFromDB(row), source: "custom" });
        }
      }
      if (saves) {
        for (const row of saves as Array<{ activities: Record<string, unknown> | null }>) {
          if (row.activities) {
            entries.push({ activity: mapActivityFromDB(row.activities), source: "saved" });
          }
        }
      }
      setLibrary(entries);
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

  async function handleRemoveCustom(activity: Activity) {
    if (!confirm(`Delete "${activity.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("activities").delete().eq("id", activity.id);
    if (!error) {
      setLibrary((prev) => prev.filter((e) => String(e.activity.id) !== String(activity.id)));
    }
  }

  async function handleUnsave(activity: Activity) {
    if (!user) return;
    const { error } = await supabase
      .from("saved_activities")
      .delete()
      .eq("user_id", user.id)
      .eq("activity_id", activity.id);
    if (!error) {
      setLibrary((prev) => prev.filter((e) => String(e.activity.id) !== String(activity.id)));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          fontWeight: 700,
          color: "var(--clay)",
        }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-10" style={{ position: "relative" }}>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="max-w-3xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/app" className="logo" style={{ textDecoration: "none" }}>
            <span className="logo-mark" style={{ width: 48, height: 48 }}>
              <img src="/logo.png" alt="Mini Z and Me" />
            </span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--clay)",
              letterSpacing: 0.3,
              lineHeight: 1,
            }}>
              Mini Z and Me
            </span>
          </a>
          <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: 13, padding: "10px 18px" }}>
            Log out
          </button>
        </div>

        {/* Welcome card */}
        <div style={cardStyle("var(--r1)", "-0.4deg")} className="mb-6">
          <div className="text-5xl mb-3">🌟</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            fontWeight: 700,
            color: "var(--ink)",
            margin: 0,
            lineHeight: 1,
          }}>
            {buildGreeting(children)}
          </h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", marginTop: 10 }}>
            Signed in as <span style={{ color: "var(--clay)" }}>{user?.email}</span>
          </p>
        </div>

        {/* Children card */}
        <div style={cardStyle("var(--r2)", "0.3deg")} className="mb-6">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
            <h2 style={sectionHeading}>My children</h2>
            <button
              onClick={() => setShowAdd((s) => !s)}
              className={showAdd ? "btn-secondary" : "btn-primary"}
              style={{ fontSize: 13, padding: "10px 18px" }}
            >
              {showAdd ? "Cancel" : "+ Add child"}
            </button>
          </div>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, fontWeight: 600, marginBottom: 22 }}>
            We&apos;ll pre-filter activities for the active child.
          </p>

          {showAdd && (
            <form
              onSubmit={handleAddChild}
              style={{
                padding: 20,
                background: "var(--cream)",
                border: "2px solid var(--paper-edge)",
                borderRadius: "var(--r1)",
                marginBottom: 22,
              }}
            >
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 160px" }}>
                <div>
                  <label className="block text-xs font-black mb-1" style={{ color: "var(--ink)" }}>
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
                  <label className="block text-xs font-black mb-1" style={{ color: "var(--ink)" }}>
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
              <button type="submit" className="btn-primary mt-3" style={{ width: "100%" }}>
                Save child
              </button>
            </form>
          )}

          {children.length === 0 ? (
            <div className="text-center py-8" style={{ color: "var(--ink-faint)" }}>
              <div className="text-4xl mb-2">👶</div>
              <p style={{ fontWeight: 700 }}>No children added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {children.map((c) => {
                const ageInfo = AGES.find((a) => a.age === c.age);
                const isEditing = editingId === c.id;
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3"
                    style={{
                      padding: 16,
                      background: "var(--cream)",
                      border: "2px solid var(--paper-edge)",
                      borderRadius: "var(--r1)",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                        background: ageInfo?.color ?? "var(--clay)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        flexShrink: 0,
                        boxShadow: "0 3px 0 rgba(74, 52, 36, 0.15)",
                      }}
                    >
                      {ageInfo?.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "var(--ink)",
                        fontSize: 24,
                        lineHeight: 1.1,
                      }}>
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
                        <div style={{ color: "var(--ink-soft)", fontSize: 13, fontWeight: 700 }}>
                          {ageInfo?.label} · {ageInfo?.sub}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => setEditingId(c.id)}
                          className="btn-secondary"
                          style={{ fontSize: 12, padding: "7px 12px" }}
                        >
                          Edit age
                        </button>
                        <button
                          onClick={() => handleDeleteChild(c)}
                          style={{
                            background: "var(--paper)",
                            border: "2px solid #e9bdb0",
                            borderRadius: "var(--r1)",
                            padding: "7px 12px",
                            fontFamily: "inherit",
                            fontWeight: 800,
                            fontSize: 12,
                            color: "#a14a3a",
                            cursor: "pointer",
                            boxShadow: "0 3px 0 #e9bdb0",
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

        {/* My library */}
        <div style={cardStyle("var(--r3)", "-0.2deg")} className="mb-6">
          <h2 style={sectionHeading}>My library</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, fontWeight: 600, marginBottom: 22 }}>
            Activities you&apos;ve built with the builder, plus curated activities you&apos;ve starred.
          </p>

          {library.length === 0 ? (
            <div className="text-center py-10" style={{ color: "var(--ink-faint)" }}>
              <div className="text-5xl mb-3">🌱</div>
              <p style={{ fontWeight: 700 }}>Your library is empty.</p>
              <p style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>
                Head to the{" "}
                <a href="/app" style={{ color: "var(--clay)", fontWeight: 800 }}>activity library</a>
                {" "}and star activities you love, or use the builder to create your own.
              </p>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
            >
              {library.map(({ activity: a, source }) => (
                <div
                  key={String(a.id)}
                  className="activity-card"
                  style={{ ["--accent" as string]: a.color, position: "relative" }}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (source === "custom") handleRemoveCustom(a);
                      else handleUnsave(a);
                    }}
                    aria-label={source === "custom" ? "Delete activity" : "Remove from library"}
                    title={source === "custom" ? "Delete activity" : "Remove from library"}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 34,
                      height: 34,
                      borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                      border: "2px solid #e9bdb0",
                      background: "var(--cream)",
                      cursor: "pointer",
                      fontSize: 16,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 0 #e9bdb0",
                      color: "#a14a3a",
                      fontWeight: 800,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f4d6cd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--cream)")}
                  >
                    ×
                  </button>
                  <div className="activity-icon">{a.emoji}</div>
                  <div className="activity-title">{a.title}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="chip">{AGES.find((x) => x.age === a.age)?.label}</span>
                    <span className="chip duration">⏱ {a.duration}</span>
                    <span className="chip area">{a.area}</span>
                    {source === "custom" ? (
                      <span className="chip custom">✨ custom</span>
                    ) : (
                      <span className="chip" style={{ background: "var(--mustard)", color: "var(--cream)", borderColor: "var(--mustard-dark)" }}>
                        ★ saved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div style={cardStyle("var(--r4)", "0.5deg")}>
          <h2 style={{ ...sectionHeading, fontSize: 28 }}>Quick links</h2>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="/app" className="chip" style={{ fontSize: 14, padding: "9px 16px", cursor: "pointer", textDecoration: "none" }}>
              🎨 Activity library
            </a>
            <a href="/" className="chip area" style={{ fontSize: 14, padding: "9px 16px", cursor: "pointer", textDecoration: "none" }}>
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

function cardStyle(radius: string, rotate: string): React.CSSProperties {
  return {
    background: "var(--paper)",
    border: "2px solid var(--paper-edge)",
    borderRadius: radius,
    padding: 32,
    boxShadow: "var(--shadow-paper)",
    transform: `rotate(${rotate})`,
  };
}

function buildGreeting(children: Child[]): string {
  if (children.length === 0) return "Welcome back!";
  const names = children.map((c) => c.name);
  if (names.length === 1) return `Playing with ${names[0]} today?`;
  if (names.length === 2) return `Playing with ${names[0]} & ${names[1]} today?`;
  const last = names[names.length - 1];
  const rest = names.slice(0, -1).join(", ");
  return `Playing with ${rest} & ${last} today?`;
}

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 32,
  fontWeight: 700,
  color: "var(--ink)",
  margin: 0,
  lineHeight: 1.1,
};

const inputStyle: React.CSSProperties = {
  border: "2px solid var(--paper-edge)",
  borderRadius: "var(--r1)",
  padding: "10px 12px",
  fontFamily: "inherit",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--ink)",
  background: "var(--paper)",
  fontWeight: 600,
};
