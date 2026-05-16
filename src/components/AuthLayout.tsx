"use client";

import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ position: "relative" }}>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="w-full max-w-md" style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-3 mb-8"
          style={{ textDecoration: "none" }}
        >
          <span className="logo-mark" style={{ width: 56, height: 56 }}>
            <img src="/logo.png" alt="Mini Z and Me" />
          </span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 700,
            color: "var(--clay)",
            letterSpacing: 0.5,
            lineHeight: 1,
          }}>
            Mini Z and Me
          </span>
        </Link>

        {/* Card */}
        <div
          style={{
            background: "var(--paper)",
            borderRadius: "var(--r2)",
            padding: 32,
            border: "2px solid var(--paper-edge)",
            boxShadow: "var(--shadow-paper-lift)",
            transform: "rotate(-0.3deg)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--ink-soft)",
              margin: "8px 0 22px",
            }}
          >
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
