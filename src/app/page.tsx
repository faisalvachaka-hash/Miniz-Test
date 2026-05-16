export default function LandingPage() {
  const features = [
    {
      emoji: "🎯",
      title: "13 expert-curated activities",
      desc: "Every activity is designed by early years specialists and rooted in child development research.",
    },
    {
      emoji: "🔬",
      title: "Filter by subject",
      desc: "Browse Science, Maths, Sensory Play, Outdoor activities and more — all in one place.",
    },
    {
      emoji: "✨",
      title: "Build your own activity",
      desc: "Type a play idea and get a full activity plan — materials, steps, and learning links — instantly.",
    },
    {
      emoji: "💾",
      title: "Save to your library",
      desc: "Your custom activities are saved to your account so you can find them again on any device.",
    },
  ];

  const previews = [
    { emoji: "💧", title: "Water Sensory Play", age: "2 years", area: "Sensory Play", duration: "20–30 min", color: "#4dc3ff" },
    { emoji: "🍂", title: "Nature Treasure Hunt", age: "3 years", area: "Outdoor", duration: "30–45 min", color: "#5ed9b1" },
    { emoji: "🌉", title: "Build a Bridge Challenge", age: "5 years", area: "Science", duration: "30–60 min", color: "#a37cf0" },
  ];

  const steps = [
    { num: "1", label: "Pick your child's age", desc: "From newborn to 5 years — we've got every stage covered." },
    { num: "2", label: "Browse or build an activity", desc: "Choose from curated ideas or create your own in seconds." },
    { num: "3", label: "Play, learn and grow", desc: "Every activity links back to a key developmental milestone." },
  ];

  return (
    <div style={{ fontFamily: "Nunito, sans-serif", overflowX: "hidden" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff1f6 0%, #f0f9ff 50%, #fef8e1 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px 80px",
        position: "relative",
        textAlign: "center",
      }}>
        <div className="blob b1" style={{ opacity: 0.6 }} />
        <div className="blob b2" style={{ opacity: 0.5 }} />
        <div className="blob b3" style={{ opacity: 0.4 }} />

        {/* Nav */}
        <nav style={{
          position: "absolute",
          top: 24,
          right: 28,
          display: "flex",
          gap: 10,
        }}>
          <a href="/login" style={{
            background: "white",
            border: "2px solid #efeaf7",
            borderRadius: 12,
            padding: "8px 20px",
            fontWeight: 800,
            fontSize: 13,
            color: "#5d5878",
            textDecoration: "none",
          }}>
            Log In
          </a>
          <a href="/signup" style={{
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0)",
            border: "none",
            borderRadius: 12,
            padding: "8px 20px",
            fontWeight: 800,
            fontSize: 13,
            color: "white",
            textDecoration: "none",
          }}>
            Sign Up
          </a>
        </nav>

        {/* Logo */}
        <div className="logo" style={{ marginBottom: 32 }}>
          <div className="logo-dot" />
          <h1>Mini Z and Me</h1>
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 900,
          lineHeight: 1.1,
          color: "#2b2740",
          maxWidth: 720,
          margin: "0 auto 20px",
        }}>
          Turn playtime into<br />
          <span style={{
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0, #4dc3ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}>
            learning time
          </span>
        </h2>

        <p style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#5d5878",
          maxWidth: 560,
          margin: "0 auto 40px",
          lineHeight: 1.6,
        }}>
          Expert-designed activities for babies &amp; toddlers aged 0–5,
          rooted in early childhood development — and completely free.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/signup" style={{
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0)",
            color: "white",
            borderRadius: 16,
            padding: "16px 36px",
            fontWeight: 900,
            fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 8px 32px #a37cf040",
          }}>
            Get started free →
          </a>
          <a href="/login" style={{
            background: "white",
            border: "2.5px solid #efeaf7",
            color: "#5d5878",
            borderRadius: 16,
            padding: "16px 36px",
            fontWeight: 800,
            fontSize: 16,
            textDecoration: "none",
          }}>
            Log in
          </a>
        </div>

        <p style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: "#b8aed4" }}>
          No credit card required · Free forever for families
        </p>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{
        background: "white",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#a37cf0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          How it works
        </p>
        <h3 style={{ fontSize: 34, fontWeight: 900, color: "#2b2740", marginBottom: 56 }}>
          Play-based learning in three steps
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
          maxWidth: 860,
          margin: "0 auto",
        }}>
          {steps.map((s) => (
            <div key={s.num} style={{ textAlign: "center" }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff6fa3, #a37cf0)",
                color: "white",
                fontSize: 22,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                {s.num}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#2b2740", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#5d5878", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #fff1f6 0%, #f0f9ff 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#ff6fa3", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          Features
        </p>
        <h3 style={{ fontSize: 34, fontWeight: 900, color: "#2b2740", marginBottom: 48 }}>
          Everything parents need
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 900,
          margin: "0 auto",
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "white",
              borderRadius: 24,
              padding: "32px 28px",
              textAlign: "left",
              boxShadow: "0 4px 24px #a37cf015",
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.emoji}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#2b2740", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#5d5878", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Activity preview ─────────────────────────────────── */}
      <section style={{
        background: "white",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#4dc3ff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          A taste of what&apos;s inside
        </p>
        <h3 style={{ fontSize: 34, fontWeight: 900, color: "#2b2740", marginBottom: 12 }}>
          Activities your child will love
        </h3>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#5d5878", marginBottom: 48 }}>
          Sign up to unlock the full library and build your own.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          maxWidth: 860,
          margin: "0 auto 40px",
        }}>
          {previews.map((p) => (
            <a key={p.title} href="/signup" style={{ textDecoration: "none" }}>
              <div
                className="activity-card"
                style={{ ["--accent" as string]: p.color, cursor: "pointer" }}
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

        <a href="/signup" style={{
          display: "inline-block",
          background: "white",
          border: "2.5px solid #efeaf7",
          color: "#a37cf0",
          borderRadius: 14,
          padding: "12px 28px",
          fontWeight: 800,
          fontSize: 14,
          textDecoration: "none",
        }}>
          See all 13 activities →
        </a>
      </section>

      {/* ── Development section ──────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #fef8e1 0%, #f0f9ff 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#ffd43b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          Built on research
        </p>
        <h3 style={{ fontSize: 34, fontWeight: 900, color: "#2b2740", marginBottom: 20 }}>
          Every activity links back to<br />a developmental milestone
        </h3>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#5d5878", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Mini Z and Me isn&apos;t just fun — every activity tells you how it connects to your child&apos;s
          earlier development, so you always understand the <em>why</em> behind the play.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          maxWidth: 760,
          margin: "0 auto",
        }}>
          {[
            { emoji: "🧠", label: "Cognitive growth" },
            { emoji: "🤝", label: "Social skills" },
            { emoji: "✋", label: "Fine motor skills" },
            { emoji: "🗣️", label: "Language & literacy" },
          ].map((b) => (
            <div key={b.label} style={{
              background: "white",
              borderRadius: 20,
              padding: "28px 20px",
              boxShadow: "0 4px 20px #a37cf010",
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{b.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#2b2740" }}>{b.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #a37cf0, #4dc3ff)",
        padding: "100px 24px",
        textAlign: "center",
      }}>
        <h3 style={{ fontSize: 38, fontWeight: 900, color: "white", marginBottom: 16 }}>
          Ready to make playtime count?
        </h3>
        <p style={{ fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 40 }}>
          Join Mini Z and Me — it&apos;s free for families, always.
        </p>
        <a href="/signup" style={{
          background: "white",
          color: "#a37cf0",
          borderRadius: 16,
          padding: "18px 44px",
          fontWeight: 900,
          fontSize: 17,
          textDecoration: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "inline-block",
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
        color: "#b8aed4",
        background: "white",
      }}>
        Made with love for curious little minds · Mini Z and Me © 2026
      </footer>
    </div>
  );
}
