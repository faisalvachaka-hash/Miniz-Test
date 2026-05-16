"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AGES,
  SUGGESTIONS,
  generateActivity,
  mapActivityFromDB,
  type Activity,
  type AgeKey,
  type Child,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { ActivityModal } from "@/components/ActivityModal";

const SUBJECT_EMOJIS: Record<string, string> = {
  "Science":       "🔬",
  "Maths":         "🔢",
  "Writing":       "✏️",
  "Sensory Play":  "🌊",
  "Arts & Crafts": "🎨",
  "Outdoor":       "🌿",
  "Water Play":    "💧",
  "Sand Play":     "🏖️",
};

const ACTIVE_CHILD_KEY = "miniz_active_child_id";

export default function MinizApp() {
  const router = useRouter();
  const [curatedActivities, setCuratedActivities] = useState<Activity[]>([]);
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [currentAge, setCurrentAge] = useState<AgeKey | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [builderText, setBuilderText] = useState("");
  const [builderAge, setBuilderAge] = useState<AgeKey>(2);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auth guard + children fetch — redirect to login if not logged in, to onboarding if no children
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      const { data: kids } = await supabase
        .from("children")
        .select("id, name, age")
        .order("created_at", { ascending: true });
      if (!kids || kids.length === 0) {
        router.push("/onboarding");
        return;
      }
      const list = kids as Child[];
      setChildren(list);

      const stored = typeof window !== "undefined"
        ? window.localStorage.getItem(ACTIVE_CHILD_KEY)
        : null;
      const initial = list.find((c) => c.id === stored) ?? list[0];
      setActiveChildId(initial.id);
      setCurrentAge(initial.age);
      setBuilderAge(initial.age);
    });
  }, [router]);

  // Persist the active child to localStorage when it changes
  useEffect(() => {
    if (activeChildId && typeof window !== "undefined") {
      window.localStorage.setItem(ACTIVE_CHILD_KEY, activeChildId);
    }
  }, [activeChildId]);

  // Fetch curated activities from Supabase on mount
  useEffect(() => {
    supabase
      .from("activities")
      .select("*")
      .is("user_id", null)
      .order("age", { ascending: true })
      .then(({ data, error }) => {
        if (data && data.length > 0) {
          setCuratedActivities(data.map(mapActivityFromDB));
        }
        if (error) console.error("Failed to load activities:", error.message);
        setLoadingActivities(false);
      });
  }, []);

  // Fetch user's saved custom activities if logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setCustomActivities(data.map(mapActivityFromDB));
        });
    });
  }, []);

  const allActivities = useMemo(
    () => [...customActivities, ...curatedActivities],
    [customActivities, curatedActivities]
  );

  const filteredActivities = useMemo(
    () =>
      allActivities
        .filter((a) => currentAge === null || a.age === currentAge)
        .filter((a) => currentSubject === null || a.subject === currentSubject),
    [allActivities, currentAge, currentSubject]
  );

  const ageCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const a of allActivities) counts[a.age] = (counts[a.age] ?? 0) + 1;
    return counts;
  }, [allActivities]);

  const subjects = useMemo(() => {
    const seen = new Set<string>();
    for (const a of allActivities) if (a.subject) seen.add(a.subject);
    return Array.from(seen).sort().map((label) => ({
      label,
      emoji: SUBJECT_EMOJIS[label] ?? "📚",
    }));
  }, [allActivities]);

  const selectedActivity = useMemo(
    () =>
      selectedId === null
        ? null
        : allActivities.find((a) => String(a.id) === String(selectedId)) ?? null,
    [allActivities, selectedId]
  );

  // Close modal on Escape
  useEffect(() => {
    if (selectedId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  function handleAgeClick(age: AgeKey) {
    setCurrentAge((prev) => (prev === age ? null : age));
  }

  function handleChildSwitch(childId: string) {
    const child = children.find((c) => c.id === childId);
    if (!child) return;
    setActiveChildId(child.id);
    setCurrentAge(child.age);
    setBuilderAge(child.age);
  }

  const activeChild = children.find((c) => c.id === activeChildId) ?? null;

  function handleSubjectClick(subject: string) {
    setCurrentSubject((prev) => (prev === subject ? null : subject));
  }

  async function handleBuild() {
    const text = builderText.trim();
    if (!text) {
      textareaRef.current?.focus();
      return;
    }

    setSaving(true);
    const activity = generateActivity(text, builderAge);

    // If logged in, persist to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          age: activity.age,
          title: activity.title,
          emoji: activity.emoji,
          color: activity.color,
          area: activity.area,
          subject: activity.area.split(" · ")[0] || "General",
          duration: activity.duration,
          materials: activity.materials,
          steps: activity.steps,
          prior_stage: activity.prior.stage,
          prior_desc: activity.prior.desc,
          safety: activity.safety || null,
          is_custom: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (data && !error) {
        const saved = mapActivityFromDB(data as Record<string, unknown>);
        setCustomActivities((prev) => [saved, ...prev]);
        setCurrentAge(builderAge);
        setBuilderText("");
        setSaving(false);
        setTimeout(() => setSelectedId(saved.id), 200);
        return;
      }
      if (error) console.error("Save failed:", error.message);
    }

    // Fallback: local state only (not logged in, or save failed)
    setCustomActivities((prev) => [activity, ...prev]);
    setCurrentAge(builderAge);
    setBuilderText("");
    setSaving(false);
    setTimeout(() => setSelectedId(activity.id), 200);
  }

  function handleSuggestion(s: string) {
    setBuilderText(s);
    const match = s.match(/(\d) year/);
    if (match) setBuilderAge(Number(match[1]) as AgeKey);
  }

  const currentAgeLabel =
    currentAge === null
      ? "all ages"
      : AGES.find((a) => a.age === currentAge)?.label ?? "";

  const currentSubjectLabel = currentSubject ?? "all subjects";

  return (
    <>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <header className="text-center pt-9 pb-4 px-5">
        {/* App nav */}
        <div className="flex justify-end gap-2 max-w-[1180px] mx-auto mb-4">
          <a href="/dashboard" style={{
            background: "white",
            border: "2px solid #efeaf7",
            borderRadius: 12,
            padding: "8px 18px",
            fontWeight: 800,
            fontSize: 13,
            color: "#5d5878",
            textDecoration: "none",
          }}>
            My Library
          </a>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            style={{
              background: "white",
              border: "2px solid #efeaf7",
              borderRadius: 12,
              padding: "8px 18px",
              fontWeight: 800,
              fontSize: 13,
              color: "#5d5878",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Log Out
          </button>
        </div>

        <div className="logo">
          <div className="logo-dot" />
          <h1>Mini Z and Me</h1>
        </div>
        <div className="mt-3.5 text-[var(--soft-ink)] text-[15px] font-semibold">
          {activeChild
            ? `Playing with ${activeChild.name} · age ${activeChild.age}`
            : "Playful learning for tiny humans · ages 0 to 5"}
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-5 pb-20">
        {children.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mt-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9b93b8" }}>
              Showing for:
            </span>
            {children.map((c) => {
              const active = c.id === activeChildId;
              return (
                <button
                  key={c.id}
                  onClick={() => handleChildSwitch(c.id)}
                  className="chip"
                  style={{
                    fontSize: 13,
                    padding: "7px 16px",
                    cursor: "pointer",
                    border: active ? "2px solid #a37cf0" : "2px solid transparent",
                    background: active ? "#f0ebff" : "white",
                    color: active ? "#6b42c8" : "#5d5878",
                    fontFamily: "inherit",
                    fontWeight: 800,
                  }}
                >
                  {AGES.find((a) => a.age === c.age)?.emoji} {c.name} · {c.age}
                </button>
              );
            })}
            <a
              href="/dashboard"
              className="chip"
              style={{
                fontSize: 13,
                padding: "7px 14px",
                background: "white",
                color: "#a37cf0",
                fontWeight: 800,
                textDecoration: "none",
                border: "2px dashed #efeaf7",
              }}
            >
              + Add child
            </a>
          </div>
        )}

        <div className="section-title">
          Pick an age <span className="pill">tap to explore</span>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {AGES.map((a) => {
            const count = ageCounts[a.age] ?? 0;
            const active = currentAge === a.age;
            return (
              <div
                key={a.age}
                className={`age-tile ${active ? "active" : ""}`}
                style={{ ["--tile-color" as string]: a.color }}
                onClick={() => handleAgeClick(a.age)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAgeClick(a.age);
                  }
                }}
              >
                <div className="age-emoji">{a.emoji}</div>
                <div className="age-label">{a.label}</div>
                <div className="age-sub">{a.sub}</div>
                <div className="age-count">
                  {count} {count === 1 ? "activity" : "activities"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-title">
          Filter by subject <span className="pill">tap to narrow</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {subjects.map((s) => {
            const active = currentSubject === s.label;
            return (
              <button
                key={s.label}
                onClick={() => handleSubjectClick(s.label)}
                className="chip"
                style={{
                  fontSize: 13,
                  padding: "7px 16px",
                  cursor: "pointer",
                  border: active ? "2px solid #a37cf0" : "2px solid transparent",
                  background: active ? "#f0ebff" : undefined,
                  color: active ? "#6b42c8" : undefined,
                  fontFamily: "inherit",
                }}
              >
                {s.emoji} {s.label}
              </button>
            );
          })}
        </div>

        <div className="section-title">
          Activities <span className="pill">{currentAgeLabel}</span>
          {currentSubject && <span className="pill">{currentSubjectLabel}</span>}
        </div>

        {loadingActivities ? (
          <div
            className="grid gap-[18px] mt-[18px]"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="activity-card" style={{ ["--accent" as string]: "#e5e7eb" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6", marginBottom: 12 }} />
                <div style={{ height: 20, width: "70%", background: "#f3f4f6", borderRadius: 8, marginBottom: 8 }} />
                <div style={{ height: 14, width: "50%", background: "#f3f4f6", borderRadius: 8 }} />
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-[var(--soft-ink)] font-semibold">
            <span className="block text-6xl mb-2.5">🌱</span>
            No activities yet — try the builder below!
          </div>
        ) : (
          <div
            className="grid gap-[18px] mt-[18px]"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {filteredActivities.map((a) => (
              <div
                key={a.id}
                className="activity-card"
                style={{ ["--accent" as string]: a.color }}
                onClick={() => setSelectedId(a.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(a.id);
                  }
                }}
              >
                <div className="activity-icon">{a.emoji}</div>
                <div className="activity-title">{a.title}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="chip">{AGES.find((x) => x.age === a.age)?.label}</span>
                  <span className="chip duration">⏱ {a.duration}</span>
                  <span className="chip area">{a.area}</span>
                  {a.easeOfPrep && (
                    <span className="chip" style={{ background: "#edf7ed", color: "#1a6e2e" }}>
                      ⚡ Prep {a.easeOfPrep}/10
                    </span>
                  )}
                  {a.isCustom && <span className="chip custom">✨ custom</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-title">
          Build your own activity <span className="pill">type a play idea</span>
        </div>

        <div className="builder">
          <div className="flex gap-3 flex-wrap">
            <textarea
              ref={textareaRef}
              value={builderText}
              onChange={(e) => setBuilderText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleBuild();
              }}
              placeholder="e.g. I want to create a water sensory play activity for my two year old"
            />
            <div className="flex flex-col gap-2.5 min-w-[160px]">
              <select
                value={builderAge}
                onChange={(e) => setBuilderAge(Number(e.target.value) as AgeKey)}
              >
                <option value={0}>0 — Baby</option>
                <option value={1}>1 — Toddler</option>
                <option value={2}>2 — Tiny explorer</option>
                <option value={3}>3 — Curious kid</option>
                <option value={4}>4 — Pre-schooler</option>
                <option value={5}>5 — Little learner</option>
              </select>
              <button className="btn-primary" onClick={handleBuild} disabled={saving}>
                {saving ? "Saving…" : "✨ Create activity"}
              </button>
            </div>
          </div>
          <div className="mt-3.5 flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <span key={s} className="suggestion" onClick={() => handleSuggestion(s)}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 px-5 text-[var(--soft-ink)] text-[13px] font-semibold">
        Made with love for curious little minds · Mini Z and Me © 2026
      </footer>

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}

