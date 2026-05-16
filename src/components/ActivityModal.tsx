"use client";

import { useEffect, useState } from "react";
import { AGES, type Activity, type ActivityNote, type Child } from "@/lib/data";
import { supabase } from "@/lib/supabase";

const ACTIVE_CHILD_KEY = "miniz_active_child_id";

export function ActivityModal({
  activity,
  onClose,
  onSaveChange,
}: {
  activity: Activity;
  onClose: () => void;
  /** Called whenever the user toggles "save to library" inside the modal */
  onSaveChange?: (isSaved: boolean) => void;
}) {
  const ageLabel = AGES.find((a) => a.age === activity.age)?.label ?? "";
  const [done, setDone] = useState<Set<number>>(new Set());

  // Save-to-library state (curated activities only — custom ones are always in library)
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [savingFlip, setSavingFlip] = useState(false);
  const showSaveButton = !activity.isCustom;

  // Notes state
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [notes, setNotes] = useState<ActivityNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleStep(i: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  // Load whether this activity is already in the user's library
  useEffect(() => {
    if (!showSaveButton) return;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsSaved(false);
        return;
      }
      const { data } = await supabase
        .from("saved_activities")
        .select("activity_id")
        .eq("user_id", userData.user.id)
        .eq("activity_id", activity.id)
        .maybeSingle();
      setIsSaved(!!data);
    })();
  }, [activity.id, showSaveButton]);

  async function handleToggleSave() {
    if (!showSaveButton || savingFlip || isSaved === null) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setSavingFlip(true);

    const wasSaved = isSaved;
    // Optimistic
    setIsSaved(!wasSaved);
    onSaveChange?.(!wasSaved);

    const { error } = wasSaved
      ? await supabase
          .from("saved_activities")
          .delete()
          .eq("user_id", userData.user.id)
          .eq("activity_id", activity.id)
      : await supabase
          .from("saved_activities")
          .insert({ user_id: userData.user.id, activity_id: activity.id });

    if (error) {
      // Rollback on failure
      setIsSaved(wasSaved);
      onSaveChange?.(wasSaved);
      console.error("Failed to toggle save:", error.message);
    }
    setSavingFlip(false);
  }

  // Load active child + notes for (this activity, this child)
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setNotesLoading(false);
        return;
      }
      const storedId = typeof window !== "undefined"
        ? window.localStorage.getItem(ACTIVE_CHILD_KEY)
        : null;

      // Resolve the active child
      const { data: kids } = await supabase
        .from("children")
        .select("id, name, age")
        .order("created_at", { ascending: true });
      const list = (kids ?? []) as Child[];
      const child = list.find((c) => c.id === storedId) ?? list[0] ?? null;
      setActiveChild(child);

      if (!child) {
        setNotesLoading(false);
        return;
      }

      // Fetch notes for this (child, activity)
      const { data: rows } = await supabase
        .from("activity_notes")
        .select("*")
        .eq("child_id", child.id)
        .eq("activity_id", activity.id)
        .order("created_at", { ascending: false });
      if (rows) setNotes(rows as ActivityNote[]);
      setNotesLoading(false);
    })();
  }, [activity.id]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !activeChild) return;
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("activity_notes")
      .insert({
        user_id: userData.user.id,
        child_id: activeChild.id,
        activity_id: activity.id,
        body,
      })
      .select()
      .single();

    if (data && !error) {
      setNotes((prev) => [data as ActivityNote, ...prev]);
      setDraft("");
    } else if (error) {
      console.error("Failed to save note:", error.message);
    }
    setSaving(false);
  }

  async function handleDeleteNote(noteId: string) {
    // Optimistic
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    const { error } = await supabase.from("activity_notes").delete().eq("id", noteId);
    if (error) {
      console.error("Failed to delete note:", error.message);
    }
  }

  function formatNoteDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

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
            background: activity.color,
            color: "var(--cream)",
            borderBottom: "3px solid var(--paper-edge)",
          }}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          {showSaveButton && (
            <button
              onClick={handleToggleSave}
              disabled={isSaved === null || savingFlip}
              aria-label={isSaved ? "Remove from library" : "Save to library"}
              title={isSaved ? "Remove from library" : "Save to library"}
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                background: isSaved ? "var(--mustard)" : "var(--paper)",
                border: "2px solid var(--paper-edge)",
                width: 40,
                height: 40,
                borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                fontSize: 20,
                cursor: isSaved === null ? "wait" : "pointer",
                fontWeight: 900,
                color: isSaved ? "var(--cream)" : "var(--ink-faint)",
                boxShadow: "0 3px 0 var(--paper-edge)",
                transition: "transform 0.12s, background 0.15s, color 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px) rotate(-4deg)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) rotate(0deg)")}
            >
              {isSaved ? "★" : "☆"}
            </button>
          )}
          <div className="modal-emoji">{activity.emoji}</div>
          <h2 style={{ color: "var(--cream)" }}>{activity.title}</h2>
          <div className="modal-sub" style={{ color: "rgba(245, 232, 211, 0.85)" }}>
            {ageLabel} · {activity.area}
            {isSaved && (
              <span style={{
                marginLeft: 10,
                background: "var(--mustard)",
                color: "var(--cream)",
                padding: "3px 10px",
                borderRadius: "var(--r-pill)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.3,
                border: "2px solid var(--mustard-dark)",
                display: "inline-block",
                verticalAlign: "middle",
              }}>
                ★ in your library
              </span>
            )}
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
            <h3>👣 How to play</h3>
            <p style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              fontWeight: 600,
              fontStyle: "italic",
              margin: "-4px 0 12px",
            }}>
              Tap each step to tick it off as you go ✓
            </p>
            <ol className="steps-list">
              {activity.steps.map((s, i) => {
                const isDone = done.has(i);
                return (
                  <li
                    key={i}
                    onClick={() => toggleStep(i)}
                    style={{
                      cursor: "pointer",
                      opacity: isDone ? 0.5 : 1,
                      textDecoration: isDone ? "line-through" : "none",
                      transition: "opacity 0.15s",
                    }}
                  >
                    {s}
                  </li>
                );
              })}
            </ol>
            {activity.steps.length > 0 && done.size > 0 && (
              <div style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: 700,
                color: "var(--sage-dark)",
                textAlign: "center",
              }}>
                {done.size === activity.steps.length
                  ? "🎉 All done! Great play."
                  : `${done.size} of ${activity.steps.length} done — keep going!`}
              </div>
            )}
          </div>

          {/* How it went — private notes per child */}
          {activeChild && (
            <div className="modal-section">
              <h3>📓 How it went · {activeChild.name}</h3>
              <p style={{
                fontSize: 13,
                color: "var(--ink-soft)",
                fontWeight: 600,
                fontStyle: "italic",
                margin: "-4px 0 12px",
              }}>
                A private memory book. Only you can see these notes.
              </p>

              <form onSubmit={handleAddNote} style={{ marginBottom: 14 }}>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`e.g. ${activeChild.name} loved squishing the foam — wanted to do it twice`}
                  rows={2}
                  style={{
                    width: "100%",
                    border: "2px solid var(--paper-edge)",
                    borderRadius: "var(--r1)",
                    padding: "10px 14px",
                    fontFamily: "inherit",
                    fontSize: 14,
                    outline: "none",
                    background: "var(--cream)",
                    color: "var(--ink)",
                    fontWeight: 600,
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving || !draft.trim()}
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    padding: "10px 18px",
                    opacity: saving || !draft.trim() ? 0.6 : 1,
                    cursor: saving || !draft.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Add memory"}
                </button>
              </form>

              {notesLoading ? (
                <div style={{ color: "var(--ink-soft)", fontSize: 13, fontWeight: 600, textAlign: "center", padding: "12px 0" }}>
                  Loading notes…
                </div>
              ) : notes.length === 0 ? (
                <div
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
                    padding: "16px",
                    border: "2px dashed var(--paper-edge)",
                    borderRadius: "var(--r1)",
                  }}
                >
                  No memories yet for this activity.
                  <br />Jot a quick note above to start the journal.
                </div>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {notes.map((n) => (
                    <li
                      key={n.id}
                      style={{
                        background: "var(--cream)",
                        border: "2px solid var(--paper-edge)",
                        borderLeft: `5px solid ${activity.color}`,
                        borderRadius: "var(--r1)",
                        padding: "12px 14px",
                        position: "relative",
                      }}
                    >
                      <div style={{
                        whiteSpace: "pre-wrap",
                        color: "var(--ink)",
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: 1.5,
                        paddingRight: 70,
                      }}>
                        {n.body}
                      </div>
                      <div style={{
                        marginTop: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        color: "var(--ink-faint)",
                        letterSpacing: 0.3,
                        textTransform: "uppercase",
                      }}>
                        {formatNoteDate(n.created_at)}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        aria-label="Delete note"
                        title="Delete note"
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 28,
                          height: 28,
                          borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                          border: "2px solid #e9bdb0",
                          background: "var(--paper)",
                          color: "#a14a3a",
                          fontWeight: 800,
                          fontSize: 14,
                          cursor: "pointer",
                          lineHeight: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 0 #e9bdb0",
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
