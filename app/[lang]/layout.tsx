import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE_URL } from "@/lib/site-url";
import { alternatesFor, BCP47, dictionaryFor, fmt, isLocale, LOCALES, OG_LOCALE } from "@/lib/i18n";
import { GAME_VERSION } from "@/lib/game-version";
import "../globals.css";

/*
 * Inter for body copy — this site is dense reference material and Inter is
 * built for exactly that. Cinzel only for display headings and the wordmark,
 * where it gives a Diablo feel without hurting readability. JetBrains Mono for
 * numbers, where column alignment matters.
 *
 * All three cover Latin Extended, which pt-BR needs for ã, ç, õ and friends.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/**
 * Both locales are prerendered. Everything below this layout is static, so the
 * whole site exists as HTML in two languages at build time.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: LayoutProps<"/[lang]">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);

  return {
    title: {
      default: t.meta.defaultTitle,
      template: t.meta.titleTemplate,
    },
    description: t.meta.defaultDescription,
    metadataBase: new URL(SITE_URL),
    // Same helper every page uses, so the root cannot drift from its children.
    alternates: alternatesFor(lang),
    openGraph: {
      type: "website",
      siteName: t.meta.siteName,
      url: `${SITE_URL}/${lang}`,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      title: t.meta.defaultTitle,
      description: fmt(t.meta.ogDescription, { patch: GAME_VERSION.patch }),
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.defaultTitle,
      description: fmt(t.meta.ogDescription, { patch: GAME_VERSION.patch }),
    },
  };
}

export default async function RootLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={BCP47[lang]}
      className={`${inter.variable} ${cinzel.variable} ${mono.variable} h-full`}
    >
      <body className="bg-abyss-glow flex min-h-full flex-col">
        <SiteHeader />
        <main id="content" className="flex-1">
          {props.children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
