"use client";

import { AGES, type Activity } from "@/lib/data";

export function ActivityModal({
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
