import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConextLab — Slide Builder",
  description: "Build training slides with Fishbone, Pareto, and SWOT frameworks. AI-powered, no login required.",
  icons: {
    icon: "https://conextlab.net/assets/conextlab-logo-rounded-BcrUS9UU.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
