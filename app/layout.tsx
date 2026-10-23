import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from npm (no request to Google at runtime or build time).
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unsend.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Unsend: take back any email for 24 hours",
  description:
    "Unsend catches mistakes before your email leaves, and lets you pull it back after it's delivered, even if it's already been opened.",
  openGraph: {
    title: "Unsend: take back any email for 24 hours",
    description: "Email, without the regret. Join the early access waitlist.",
    url: siteUrl,
    siteName: "Unsend",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unsend: take back any email for 24 hours",
    description: "Email, without the regret. Join the early access waitlist.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2E4CF6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
