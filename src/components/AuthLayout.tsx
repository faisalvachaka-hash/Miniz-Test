"use client";

import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #fff1f6 0%, #f0f9ff 40%, #fef8e1 100%)" }}>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="logo-dot" style={{ width: 36, height: 36 }} />
          <span style={{
            fontSize: 22,
            fontWeight: 900,
            background: "linear-gradient(90deg, #ff6fa3, #a37cf0, #4dc3ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}>
            Mini Z and Me
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-black mb-1" style={{ color: "#2b2740" }}>{title}</h1>
          <p className="text-sm font-semibold mb-6" style={{ color: "#5d5878" }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
