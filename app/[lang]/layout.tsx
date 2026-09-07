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

/**
 * A slug nobody wrote is a missing page, not a page to build on demand.
 *
 * This one line is what puts content on `/en-us/items/bogus-item`, and the
 * reason is a distinction that is easy to miss: Next has two entirely separate
 * ways of answering a 404, and only one of them can render this site's 404
 * page.
 *
 * A URL that matches no route is a *routing miss*, and Next answers it with
 * the prerendered `_not-found.html` — the real page, styled, in both
 * languages, present in the markup. A URL that matches a route and then calls
 * `notFound()` is a *throw during render*, and that escapes to
 * `getErrorRSCPayload`, which hard-codes `<html id="__next_error__">` with an
 * empty body and leaves the content to the client. Correct status line, blank
 * page without JavaScript.
 *
 * Every bad slug used to take the second path, because `dynamicParams`
 * defaults to `true`: an unknown `[slug]` was treated as a page worth
 * rendering, the render reached `if (!item) notFound()`, and the reader got
 * the empty shell. Nine route families, both locales, measured at 58 bytes of
 * body with the scripts stripped. Setting it to `false` moves them onto the
 * first path — an unenumerated param is now a routing miss, decided before any
 * component runs.
 *
 * The config is inherited by every segment below, so this one export covers
 * items, runes, runewords, mechanics, farming, classes, class skills, builds
 * and leveling at once, rather than nine copies that can drift apart. Section
 * 6 of `scripts/not-found.test.ts` asserts each family separately so the
 * inheritance is measured rather than assumed.
 *
 * The contract this creates: a dynamic segment is reachable only if its
 * `generateStaticParams` enumerates it. That is already true of every route
 * here — all 1004 pages are built from authored content — but a future route
 * that wants request-time params has to set `dynamicParams = true` on its own
 * segment and say why.
 */
export const dynamicParams = false;

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
