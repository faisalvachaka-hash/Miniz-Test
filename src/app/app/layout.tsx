import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity library · Mini Z and Me",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
