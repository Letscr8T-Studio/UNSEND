import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsend founders",
  robots: { index: false, follow: false, nocache: true },
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-paper text-ink">{children}</div>;
}
