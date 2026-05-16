import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome · Mini Z and Me",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
