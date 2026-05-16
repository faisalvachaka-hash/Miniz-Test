import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ position: "relative" }}
    >
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div
        style={{
          background: "var(--paper)",
          border: "2px solid var(--paper-edge)",
          borderRadius: "var(--r2)",
          padding: "44px 36px",
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          boxShadow: "var(--shadow-paper-lift)",
          transform: "rotate(-0.6deg)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 84, lineHeight: 1, marginBottom: 8 }}>🐾</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 56,
            fontWeight: 700,
            color: "var(--clay)",
            margin: "0 0 4px",
            lineHeight: 1,
          }}
        >
          Lost in the woods
        </h1>
        <p
          style={{
            color: "var(--ink-soft)",
            fontWeight: 700,
            fontSize: 15,
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}
        >
          We can&apos;t find the page you were looking for. Maybe it wandered off
          looking for snacks?
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Back home →
          </Link>
          <Link
            href="/app"
            className="btn-secondary"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Go to activities
          </Link>
        </div>
      </div>
    </div>
  );
}
