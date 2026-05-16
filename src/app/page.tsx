export default function LandingPage() {
  const features = [
    {
      emoji: "🎯",
      title: "Hundreds of curated activities",
      desc: "Every activity is designed around early-years development, with materials and step-by-step play.",
      accent: "var(--sage)",
    },
    {
      emoji: "🔬",
      title: "Filter by subject",
      desc: "Sensory, science, water, sand, arts & crafts, outdoor — find the right kind of play.",
      accent: "var(--mustard)",
    },
    {
      emoji: "✨",
      title: "Build your own",
      desc: "Type a play idea and we'll generate a full activity plan tailored to your child's age.",
      accent: "var(--clay)",
    },
    {
      emoji: "💾",
      title: "Save what you love",
      desc: "Star activities to your library, build your own, and find them again on any device.",
      accent: "var(--dusty-rose)",
    },
  ];

  const previews = [
    { emoji: "💧", title: "Water Sensory Play", age: "2 years", area: "Sensory Play", duration: "20–30 min", color: "var(--dusty-blue)" },
    { emoji: "🍂", title: "Nature Treasure Hunt", age: "3 years", area: "Outdoor", duration: "30–45 min", color: "var(--sage)" },
    { emoji: "🌉", title: "Build a Bridge", age: "5 years", area: "Science", duration: "30–60 min", color: "var(--mustard)" },
  ];

  const steps = [
    { num: "1", label: "Pick your child's age", desc: "From newborn to 5 years — every stage covered." },
    { num: "2", label: "Browse or build an activity", desc: "Curated ideas, or create your own in seconds." },
    { num: "3", label: "Play, learn and grow", desc: "Every activity ties back to a milestone." },
  ];

  const developmentBadges = [
    { emoji: "🧠", label: "Cognitive growth", accent: "var(--clay)" },
    { emoji: "🤝", label: "Social skills", accent: "var(--sage)" },
    { emoji: "✋", label: "Fine motor", accent: "var(--mustard)" },
    { emoji: "🗣️", label: "Language", accent: "var(--dusty-rose)" },
    { emoji: "🎨", label: "Creativity & imagination", accent: "var(--dusty-blue)" },
    { emoji: "🌍", label: "Understanding the world", accent: "var(--olive)" },
  ];

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        textAlign: "center",
      }}>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />

        {/* Nav */}
        <nav style={{
          position: "absolute",
          top: 24,
          right: 28,
          display: "flex",
          gap: 12,
          zIndex: 2,
        }}>
          <a href="/login" className="btn-secondary" style={{ textDecoration: "none", display: "inline-block" }}>
            Log in
          </a>
          <a href="/signup" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
            Sign up
          </a>
        </nav>

        {/* Logo */}
        <div className="logo" style={{ marginBottom: 40, position: "relative", zIndex: 1 }}>
          <span className="logo-mark">
            <img src="/logo.png" alt="Mini Z and Me" />
          </span>
          <h1>Mini Z and Me</h1>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 8vw, 88px)",
          fontWeight: 700,
          lineHeight: 0.95,
          color: "var(--ink)",
          maxWidth: 820,
          margin: "0 auto 24px",
          letterSpacing: 0.5,
          position: "relative",
          zIndex: 1,
        }}>
          Turn playtime into{" "}
          <span style={{
            color: "var(--clay)",
            position: "relative",
            display: "inline-block",
            transform: "rotate(-1.5deg)",
          }}>
            learning time
          </span>
        </h2>

        <p style={{
          fontSize: 19,
          fontWeight: 600,
          color: "var(--ink-soft)",
          maxWidth: 560,
          margin: "0 auto 44px",
          lineHeight: 1.6,
          position: "relative",
          zIndex: 1,
        }}>
          Expert-designed activities for little ones aged 0 to 5, grounded in early
          childhood development — and completely free.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <a href="/signup" className="btn-primary" style={{
            textDecoration: "none",
            display: "inline-block",
            fontSize: 16,
            padding: "16px 36px",
          }}>
            Get started free →
          </a>
          <a href="/login" className="btn-secondary" style={{
            textDecoration: "none",
            display: "inline-block",
            fontSize: 16,
            padding: "14px 36px",
          }}>
            I already have an account
          </a>
        </div>

        <p style={{
          marginTop: 24,
          fontSize: 14,
          fontWeight: 700,
          color: "var(--ink-faint)",
          position: "relative",
          zIndex: 1,
        }}>
          No credit card required · Free forever for families
        </p>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{
        padding: "80px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <p style={{
          fontSize: 13,
          fontWeight: 900,
          color: "var(--sage-dark)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          How it works
        </p>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(34px, 5vw, 48px)",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 56,
          letterSpacing: 0.3,
        }}>
          Play-based learning in three steps
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 36,
          maxWidth: 920,
          margin: "0 auto",
        }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              textAlign: "center",
              transform: `rotate(${i === 1 ? "0.6deg" : i === 0 ? "-0.4deg" : "-0.7deg"})`,
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "58% 42% 50% 50% / 50% 50% 42% 58%",
                background: i === 0 ? "var(--clay)" : i === 1 ? "var(--sage)" : "var(--mustard)",
                color: "var(--cream)",
                fontFamily: "var(--font-display)",
                fontSize: 44,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                boxShadow: "0 5px 0 rgba(74, 52, 36, 0.18)",
                lineHeight: 1,
              }}>
                {s.num}
              </div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 6,
                lineHeight: 1.1,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink-soft)",
                lineHeight: 1.6,
                maxWidth: 240,
                margin: "0 auto",
              }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{
        padding: "80px 24px",
        textAlign: "center",
        background: "var(--paper)",
        position: "relative",
      }}>
        <p style={{
          fontSize: 13,
          fontWeight: 900,
          color: "var(--clay-dark)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          What's inside
        </p>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(34px, 5vw, 48px)",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 48,
          letterSpacing: 0.3,
        }}>
          Everything parents need
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 28,
          maxWidth: 940,
          margin: "0 auto",
        }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              background: "var(--cream)",
              borderRadius: i % 2 === 0 ? "var(--r1)" : "var(--r3)",
              padding: "32px 28px",
              textAlign: "left",
              border: "2px solid var(--paper-edge)",
              boxShadow: "var(--shadow-paper)",
              transform: `rotate(${i % 2 === 0 ? "-0.5deg" : "0.4deg"})`,
              position: "relative",
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                background: f.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                marginBottom: 16,
                boxShadow: "0 3px 0 rgba(74, 52, 36, 0.15)",
              }}>
                {f.emoji}
              </div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 6,
                lineHeight: 1.1,
              }}>
                {f.title}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink-soft)",
                lineHeight: 1.6,
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Activity preview ─────────────────────────────────── */}
      <section style={{
        padding: "80px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <p style={{
          fontSize: 13,
          fontWeight: 900,
          color: "var(--mustard-dark)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          A taste of what's inside
        </p>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(34px, 5vw, 48px)",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 12,
          letterSpacing: 0.3,
        }}>
          Activities your child will love
        </h3>
        <p style={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--ink-soft)",
          marginBottom: 48,
        }}>
          Sign up to unlock the full library and build your own.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 920,
          margin: "0 auto 44px",
        }}>
          {previews.map((p, i) => (
            <a key={p.title} href="/signup" style={{ textDecoration: "none" }}>
              <div
                className="activity-card"
                style={{
                  ["--accent" as string]: p.color,
                  cursor: "pointer",
                  transform: `rotate(${i === 0 ? "-0.6deg" : i === 1 ? "0.4deg" : "-0.3deg"})`,
                }}
              >
                <div className="activity-icon">{p.emoji}</div>
                <div className="activity-title">{p.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  <span className="chip">{p.age}</span>
                  <span className="chip duration">⏱ {p.duration}</span>
                  <span className="chip area">{p.area}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <a href="/signup" className="btn-secondary" style={{
          textDecoration: "none",
          display: "inline-block",
          fontSize: 14,
        }}>
          See the full library →
        </a>
      </section>

      {/* ── Development section ──────────────────────────────── */}
      <section style={{
        padding: "80px 24px",
        textAlign: "center",
        background: "#e8eddd",
        position: "relative",
      }}>
        <p style={{
          fontSize: 13,
          fontWeight: 900,
          color: "var(--olive)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Built on research
        </p>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(34px, 5vw, 48px)",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 20,
          letterSpacing: 0.3,
        }}>
          Every activity links to a<br />developmental milestone
        </h3>
        <p style={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--ink-soft)",
          maxWidth: 580,
          margin: "0 auto 48px",
          lineHeight: 1.65,
        }}>
          Mini Z and Me isn&apos;t just fun — every activity tells you how it connects to
          your child&apos;s earlier development, so you always understand the <em>why</em>{" "}
          behind the play.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 22,
          maxWidth: 800,
          margin: "0 auto",
        }}>
          {developmentBadges.map((b, i) => (
            <div key={b.label} style={{
              background: "var(--cream)",
              borderRadius: i % 2 === 0 ? "var(--r2)" : "var(--r1)",
              padding: "28px 20px",
              border: "2px solid var(--paper-edge)",
              boxShadow: "var(--shadow-paper)",
              transform: `rotate(${["1deg", "-0.7deg", "0.5deg", "-1deg", "0.8deg", "-0.5deg"][i]})`,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50% 45% 50% 50% / 50% 50% 45% 50%",
                background: b.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                margin: "0 auto 12px",
                boxShadow: "0 3px 0 rgba(74, 52, 36, 0.15)",
              }}>
                {b.emoji}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--ink)",
              }}>
                {b.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        background: "var(--clay)",
        position: "relative",
      }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(38px, 6vw, 56px)",
          fontWeight: 700,
          color: "var(--cream)",
          marginBottom: 16,
          letterSpacing: 0.3,
          lineHeight: 1.05,
        }}>
          Ready to make playtime count?
        </h3>
        <p style={{
          fontSize: 18,
          fontWeight: 600,
          color: "rgba(245, 232, 211, 0.9)",
          marginBottom: 40,
        }}>
          Join Mini Z and Me — free for families, always.
        </p>
        <a href="/signup" style={{
          background: "var(--cream)",
          color: "var(--clay)",
          borderRadius: "var(--r1)",
          padding: "18px 44px",
          fontWeight: 900,
          fontSize: 17,
          textDecoration: "none",
          display: "inline-block",
          boxShadow: "0 5px 0 rgba(74, 52, 36, 0.25)",
          fontFamily: "inherit",
          letterSpacing: 0.3,
        }}>
          Create your free account →
        </a>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        textAlign: "center",
        padding: "32px 24px",
        fontSize: 13,
        fontWeight: 700,
        color: "var(--ink-soft)",
        background: "var(--paper)",
        borderTop: "2px solid var(--paper-edge)",
      }}>
        Made with love for curious little minds · Mini Z and Me © 2026
      </footer>
    </div>
  );
}
