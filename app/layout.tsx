import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoatFlow — No-Code Smart Boating Automation",
  description: "A research prototype for plain-language connected-boat automation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
