import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

/*
 * Inter for body copy — this site is dense reference material and Inter is
 * built for exactly that. Cinzel only for display headings and the wordmark,
 * where it gives a Diablo feel without hurting readability. JetBrains Mono for
 * numbers, where column alignment matters.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "D2 Codex — Diablo II: Resurrected progression guide",
    template: "%s · D2 Codex",
  },
  description:
    "A progression-first Diablo II: Resurrected companion. Leveling walkthroughs, gear progression from level 1 to best-in-slot, farming routes, runewords and verified game mechanics.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${mono.variable} h-full`}
    >
      <body className="bg-abyss-glow flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
