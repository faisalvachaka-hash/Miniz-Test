import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My library · Mini Z and Me",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
