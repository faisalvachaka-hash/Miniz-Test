"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapActivityFromDB, AGES, type Activity, type AgeKey, type Child } from "@/lib/data";
import { ActivityModal } from "@/components/ActivityModal";
import type { User } from "@supabase/supabase-js";

type LibraryEntry = { activity: Activity; source: "custom" | "saved" };

const ACTIVE_CHILD_KEY = "miniz_active_child_id";

// Day-of-year number for deterministic daily seeding
function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

// Stable string hash for picking the daily activity
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}


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
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<AgeKey>(2);

  // Today's adventure
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [curated, setCurated] = useState<Activity[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [reshuffleSalt, setReshuffleSalt] = useState(0);

  function startEditing(child: Child) {
    setEditName(child.name);
    setEditAge(child.age);
    setEditingId(child.id);
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      const uid = data.user.id;
      const todayStartIso = new Date().toISOString().slice(0, 10) + "T00:00:00Z";

      const [
        { data: customs },
        { data: saves },
        { data: kids },
        { data: curatedRows },
        { data: completions },
      ] = await Promise.all([
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
        supabase
          .from("activities")
          .select("*")
          .is("user_id", null)
          .order("age", { ascending: true }),
        supabase
          .from("completed_activities")
          .select("activity_id")
          .eq("user_id", uid)
          .gte("completed_at", todayStartIso),
      ]);

      const entries: LibraryEntry[] = [];
      if (customs) {
        for (const row of customs) {
          entries.push({ activity: mapActivityFromDB(row), source: "custom" });
        }
      }
      if (saves) {
        for (const row of saves as unknown as Array<{ activities: Record<string, unknown> | Record<string, unknown>[] | null }>) {
          if (!row.activities) continue;
          // Supabase types FK relations as arrays even when 1:1, so unwrap if needed
          const a = Array.isArray(row.activities) ? row.activities[0] : row.activities;
          if (a) entries.push({ activity: mapActivityFromDB(a), source: "saved" });
        }
      }
      setLibrary(entries);
      if (curatedRows) setCurated(curatedRows.map(mapActivityFromDB));
      if (completions) setCompletedToday(new Set(completions.map((c) => c.activity_id as string)));

      if (kids) {
        const list = kids as Child[];
        setChildren(list);
        // Resolve which child is "active": localStorage → first child → null
        const stored = typeof window !== "undefined"
          ? window.localStorage.getItem(ACTIVE_CHILD_KEY)
          : null;
        const active = list.find((c) => c.id === stored) ?? list[0] ?? null;
        setActiveChildId(active?.id ?? null);
      }
      setLoading(false);
    });
  }, [router]);

  // Persist the active child to localStorage so /app and /dashboard stay in sync
  useEffect(() => {
    if (activeChildId && typeof window !== "undefined") {
      window.localStorage.setItem(ACTIVE_CHILD_KEY, activeChildId);
    }
  }, [activeChildId]);

  const activeChild = children.find((c) => c.id === activeChildId) ?? null;

  // Pick today's adventure for the active child — deterministic per (date, child)
  // unless the user has hit "show me another" (reshuffleSalt)
  const todaysActivity = useMemo(() => {
    if (!activeChild || curated.length === 0) return null;
    const pool = curated.filter((a) => a.age === activeChild.age);
    if (pool.length === 0) return null;
    const seed = hashStr(`${activeChild.id}:${dayOfYear()}:${reshuffleSalt}`);
    return pool[seed % pool.length];
  }, [curated, activeChild, reshuffleSalt]);

  const didItToday = todaysActivity ? completedToday.has(String(todaysActivity.id)) : false;

  async function handleWeDidIt() {
    if (!user || !activeChild || !todaysActivity) return;
    // Optimistic
    setCompletedToday((prev) => new Set(prev).add(String(todaysActivity.id)));
    const { error } = await supabase.from("completed_activities").insert({
      user_id: user.id,
      child_id: activeChild.id,
      activity_id: todaysActivity.id,
    });
    if (error) {
      console.error("Failed to record completion:", error.message);
      // Rollback
      setCompletedToday((prev) => {
        const next = new Set(prev);
        next.delete(String(todaysActivity.id));
        return next;
      });
    }
  }

  function handleAnotherIdea() {
    setReshuffleSalt((s) => s + 1);
  }

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

  async function handleUpdateChild(child: Child, updates: { name?: string; age?: AgeKey }) {
    const trimmed = updates.name?.trim();
    const patch: { name?: string; age?: AgeKey } = {};
    if (trimmed && trimmed !== child.name) patch.name = trimmed;
    if (updates.age !== undefined && updates.age !== child.age) patch.age = updates.age;
    if (Object.keys(patch).length === 0) {
      setEditingId(null);
      return;
    }
    const { error } = await supabase.from("children").update(patch).eq("id", child.id);
    if (!error) {
      setChildren((prev) => prev.map((c) => (c.id === child.id ? { ...c, ...patch } : c)));
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

        {/* Today's adventure */}
        {activeChild && todaysActivity && (
          <div
            style={{
              ...cardStyle("var(--r3)", "0.5deg"),
              background: "var(--clay)",
              border: "2px solid var(--clay-dark)",
              padding: 0,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            {/* Top stripe with title + child switcher */}
            <div style={{ padding: "20px 28px 16px", color: "var(--cream)" }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  lineHeight: 1,
                }}>
                  ✨ Today&apos;s adventure
                </div>
                {children.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {children.map((c) => {
                      const isActive = c.id === activeChildId;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setActiveChildId(c.id)}
                          style={{
                            background: isActive ? "var(--cream)" : "transparent",
                            color: isActive ? "var(--clay)" : "var(--cream)",
                            border: "2px solid var(--cream)",
                            borderRadius: "var(--r-pill)",
                            padding: "6px 14px",
                            fontFamily: "inherit",
                            fontWeight: 800,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          {AGES.find((a) => a.age === c.age)?.emoji} {c.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <p style={{
                marginTop: 4,
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(245, 232, 211, 0.85)",
              }}>
                A play idea for {activeChild.name}, fresh for today.
              </p>
            </div>

            {/* Activity body */}
            <div
              onClick={() => setSelectedActivity(todaysActivity)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedActivity(todaysActivity);
                }
              }}
              style={{
                background: "var(--paper)",
                margin: "0 18px 18px",
                borderRadius: "var(--r2)",
                padding: "22px 22px 20px",
                border: "2px solid var(--paper-edge)",
                cursor: "pointer",
                position: "relative",
                borderTop: `8px solid ${todaysActivity.color}`,
              }}
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                    background: todaysActivity.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    flexShrink: 0,
                    boxShadow: "0 3px 0 rgba(74, 52, 36, 0.15)",
                  }}
                >
                  {todaysActivity.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1.05,
                  }}>
                    {todaysActivity.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="chip">{AGES.find((x) => x.age === todaysActivity.age)?.label}</span>
                    <span className="chip duration">⏱ {todaysActivity.duration}</span>
                    <span className="chip area">{todaysActivity.area}</span>
                  </div>
                  <p style={{
                    marginTop: 10,
                    color: "var(--ink-soft)",
                    fontSize: 13,
                    fontWeight: 700,
                    fontStyle: "italic",
                  }}>
                    Tap the card to see how to play it ↗
                  </p>
                </div>
              </div>
            </div>

            {/* Action row */}
            <div style={{
              padding: "0 28px 22px",
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}>
              {didItToday ? (
                <>
                  <div style={{
                    background: "var(--cream)",
                    color: "var(--clay)",
                    padding: "14px 18px",
                    borderRadius: "var(--r1)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    flex: 1,
                    minWidth: 200,
                    textAlign: "center",
                    border: "2px solid var(--paper-edge)",
                    boxShadow: "0 4px 0 rgba(74, 52, 36, 0.2)",
                    animation: "celebrate 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                    position: "relative",
                  }}>
                    🎉 Nicely done, {activeChild.name}!
                    {/* Confetti burst — tiny stars flying out */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          fontSize: 16,
                          pointerEvents: "none",
                          animation: `confetti-burst 0.9s ease-out ${0.1 + i * 0.04}s both`,
                          ["--cx" as string]: `${Math.cos((i / 6) * Math.PI * 2) * 80}px`,
                          ["--cy" as string]: `${Math.sin((i / 6) * Math.PI * 2) * 60 - 30}px`,
                        }}
                      >
                        {["⭐", "✨", "🌟", "💫", "⭐", "✨"][i]}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnotherIdea(); }}
                    style={{
                      background: "var(--cream)",
                      color: "var(--clay)",
                      border: "none",
                      borderRadius: "var(--r1)",
                      padding: "12px 22px",
                      fontFamily: "inherit",
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      boxShadow: "0 4px 0 rgba(74, 52, 36, 0.2)",
                    }}
                  >
                    🎲 Try another
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleWeDidIt(); }}
                    style={{
                      background: "var(--cream)",
                      color: "var(--clay)",
                      border: "none",
                      borderRadius: "var(--r1)",
                      padding: "14px 26px",
                      fontFamily: "inherit",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 5px 0 rgba(74, 52, 36, 0.25)",
                      flex: 1,
                      minWidth: 220,
                    }}
                  >
                    ✓ We did this!
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnotherIdea(); }}
                    style={{
                      background: "transparent",
                      color: "var(--cream)",
                      border: "2px solid var(--cream)",
                      borderRadius: "var(--r1)",
                      padding: "12px 20px",
                      fontFamily: "inherit",
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Not feeling it
                  </button>
                </>
              )}
            </div>
          </div>
        )}

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
            We&apos;ll line up activities for the child you&apos;re playing with.
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
              <p style={{ fontWeight: 700 }}>No little ones added yet.</p>
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                            style={{ ...inputStyle, fontSize: 14, padding: "6px 10px", width: 140 }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateChild(c, { name: editName, age: editAge });
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <select
                            value={editAge}
                            onChange={(e) => setEditAge(Number(e.target.value) as AgeKey)}
                            style={{ ...inputStyle, fontSize: 13, padding: "6px 10px", width: 140 }}
                          >
                            {AGES.map((a) => (
                              <option key={a.age} value={a.age}>
                                {a.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            color: "var(--ink)",
                            fontSize: 24,
                            lineHeight: 1.1,
                          }}>
                            {c.name}
                          </div>
                          <div style={{ color: "var(--ink-soft)", fontSize: 13, fontWeight: 700 }}>
                            {ageInfo?.label} · {ageInfo?.sub}
                          </div>
                        </>
                      )}
                    </div>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdateChild(c, { name: editName, age: editAge })}
                          className="btn-primary"
                          style={{ fontSize: 12, padding: "7px 14px" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn-secondary"
                          style={{ fontSize: 12, padding: "7px 12px" }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(c)}
                          className="btn-secondary"
                          style={{ fontSize: 12, padding: "7px 12px" }}
                        >
                          Edit
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
            The ones you&apos;ve built yourself, plus any you&apos;ve starred.
          </p>

          {library.length === 0 ? (
            <div className="text-center py-10" style={{ color: "var(--ink-faint)" }}>
              <div className="text-5xl mb-3">🌱</div>
              <p style={{ fontWeight: 700 }}>Your library is looking sparse.</p>
              <p style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>
                Pop over to the{" "}
                <a href="/app" style={{ color: "var(--clay)", fontWeight: 800 }}>activity library</a>
                {" "}and star the ones you love. Or build a new activity from scratch.
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
          onSaveChange={(saved) => {
            if (!selectedActivity) return;
            const id = String(selectedActivity.id);
            if (saved) {
              // Saved a curated activity that wasn't in the library yet — add it
              if (!library.some((e) => String(e.activity.id) === id)) {
                setLibrary((prev) => [
                  { activity: selectedActivity, source: "saved" },
                  ...prev,
                ]);
              }
            } else {
              // Unsaved — remove from library (unless it's a custom activity, which uses the × button)
              setLibrary((prev) => prev.filter((e) => String(e.activity.id) !== id));
            }
          }}
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
