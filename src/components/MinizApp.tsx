"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AGES,
  SUGGESTIONS,
  generateActivity,
  mapActivityFromDB,
  type Activity,
  type AgeKey,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function MinizApp() {
  const [curatedActivities, setCuratedActivities] = useState<Activity[]>([]);
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [currentAge, setCurrentAge] = useState<AgeKey | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [builderText, setBuilderText] = useState("");
  const [builderAge, setBuilderAge] = useState<AgeKey>(2);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      currentAge === null
        ? allActivities
        : allActivities.filter((a) => a.age === currentAge),
    [allActivities, currentAge]
  );

  const ageCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const a of allActivities) counts[a.age] = (counts[a.age] ?? 0) + 1;
    return counts;
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

  return (
    <>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <header className="text-center pt-9 pb-4 px-5">
        {/* Auth nav */}
        <div className="flex justify-end gap-2 max-w-[1180px] mx-auto mb-4">
          <a href="/login" style={{
            background: "white",
            border: "2px solid #efeaf7",
            borderRadius: 12,
            padding: "8px 18px",
            fontWeight: 800,
            fontSize: 13,
            color: "#5d5878",
            textDecoration: "none",
          }}>
            Log In
          </a>
          <a href="/signup" className="btn-primary" style={{
            borderRadius: 12,
            padding: "8px 18px",
            fontSize: 13,
            textDecoration: "none",
          }}>
            Sign Up
          </a>
        </div>

        <div className="logo">
          <div className="logo-dot" />
          <h1>Mini Z and Me</h1>
        </div>
        <div className="mt-3.5 text-[var(--soft-ink)] text-[15px] font-semibold">
          Playful learning for tiny humans · ages 0 to 5
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-5 pb-20">
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
          Activities <span className="pill">{currentAgeLabel}</span>
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

function ActivityModal({
  activity,
  onClose,
}: {
  activity: Activity;
  onClose: () => void;
}) {
  const ageLabel = AGES.find((a) => a.age === activity.age)?.label ?? "";
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div
          className="modal-header"
          style={{
            background: `linear-gradient(135deg, ${activity.color}55 0%, rgba(255,255,255,0) 100%)`,
          }}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <div className="modal-emoji">{activity.emoji}</div>
          <h2>{activity.title}</h2>
          <div className="modal-sub">
            {ageLabel} · {activity.area}
          </div>
        </div>
        <div className="modal-body">
          <div className="grid gap-2.5 mt-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
            <div className="stat">
              <div className="stat-label">Play time</div>
              <div className="stat-value">⏱ {activity.duration}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Age</div>
              <div className="stat-value">{ageLabel}</div>
            </div>
            {activity.easeOfPrep && (
              <div className="stat">
                <div className="stat-label">Ease of prep</div>
                <div className="stat-value">⚡ {activity.easeOfPrep}/10</div>
              </div>
            )}
            <div className="stat">
              <div className="stat-label">Focus</div>
              <div className="stat-value" style={{ fontSize: 13 }}>
                {activity.area}
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>🧺 What you&apos;ll need</h3>
            <ul className="materials-list">
              {activity.materials.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3>▶️ How to play</h3>
            <ol className="steps-list">
              {activity.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="modal-section">
            <h3>🌱 Links back to</h3>
            <div className="prior-stage">
              <div className="prior-stage-label">Earlier development stage</div>
              <div className="prior-stage-title">{activity.prior.stage}</div>
              <div className="prior-stage-desc">{activity.prior.desc}</div>
            </div>
          </div>

          {activity.safety && (
            <div className="safety-banner">⚠️ {activity.safety}</div>
          )}
        </div>
      </div>
    </div>
  );
}
