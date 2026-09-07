import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel, Inter } from "next/font/google";

import { Container } from "@/components/ui";
import { BCP47, dictionaryFor, LOCALES, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import "./globals.css";

/**
 * The page a reader gets when a URL does not exist.
 *
 * It has to live *here*, at the app root, rather than inside `[lang]`. A
 * `not-found` boundary is only consulted for a route that matched, and
 * `/en-us/no-such-page` matches nothing — so a `[lang]/not-found.tsx` is never
 * reached for the case this page exists to handle. Measured, not assumed:
 * adding one changed nothing, and adding a `[lang]/[...rest]` catch-all to
 * force a match made it worse — Next then served an `__next_error__` shell
 * whose body was empty, putting the whole page behind JavaScript.
 *
 * The cost of living here is that the root layout is `app/[lang]/layout.tsx`,
 * a top-level dynamic segment, so this page has no layout to render in: Next
 * wraps it in a synthesised bare `<html><body>`. Hence the wordmark, the fonts
 * and the `globals.css` import below, none of which it can inherit. It also
 * means `<html lang>` cannot be set from here at all.
 *
 * ## Why it greets the reader in both languages
 *
 * Not a stylistic choice — the alternative breaks the site. This page cannot
 * know the reader's language: an unmatched URL has no route, so there is no
 * `lang` param and no root param, and the request headers carry the host but
 * not the pathname. The only remaining signal is the cookie and
 * `Accept-Language` that `proxy.ts` uses, and reading either one here costs the
 * entire site: `cookies()`/`headers()` in the root `not-found` is a dynamic API
 * inside a boundary that belongs to *every* route's tree, and it turned all
 * 1009 prerendered pages into on-demand renders. Measured on a build: every
 * route went from `●` to `ƒ`.
 *
 * So the page stays static and answers in both languages instead, each block
 * carrying its own `lang` so a screen reader pronounces each correctly and
 * offering its own two ways out. English leads and takes the `<h1>` because it
 * is the editorial source and the default locale; Portuguese follows under an
 * `<h2>`, so the document keeps one top-level heading rather than two.
 */

/*
 * Only the two faces this page uses. The layout's third (mono) is for figures,
 * and there are none here — a 404 should be cheap to serve.
 *
 * Applied as `className` rather than as the `variable` the layout uses, and
 * that difference is load-bearing. `globals.css` declares
 * `--font-display: var(--font-cinzel), Georgia, serif` on `:root`, and a
 * `var()` inside a custom property is resolved where the property is
 * *declared*, not where it is used. The layout gets away with the indirection
 * because it puts `--font-cinzel` on `<html>`, which is `:root`. This page
 * cannot reach `<html>`, so the same classes on a wrapper `<div>` leave
 * `--font-cinzel` undefined at `:root`, `--font-display` resolves to nothing,
 * and every heading silently falls back to the browser's default sans — which
 * is exactly what it did until this was measured in a browser. Setting the
 * family directly sidesteps the indirection instead of duplicating the token.
 */
const inter = Inter({ subsets: ["latin", "latin-ext"], display: "swap" });
const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

const titles = LOCALES.map((l) => dictionaryFor(l).notFound.title).join(" · ");
const descriptions = LOCALES.map((l) => dictionaryFor(l).notFound.description).join(" · ");

export const metadata: Metadata = {
  title: titles,
  description: descriptions,

  /*
   * No `alternates`. Every real page declares a canonical and both hreflang
   * alternates through `pageMetadata`; all of them would be false here, since
   * they assert this URL is a page and that it has a twin in the other
   * language. A 404 claiming to be canonical is how a dead URL gets indexed.
   *
   * Open Graph and Twitter are set, not because a 404 wants a social preview
   * but because a dead link does get pasted into chats. Built from the same two
   * strings so the blocks cannot disagree — the rule `lib/metadata.ts` enforces
   * everywhere else — and with no `url`, which would name a page that does not
   * exist.
   */
  openGraph: {
    type: "website",
    siteName: dictionaryFor("en-us").meta.siteName,
    title: titles,
    description: descriptions,
  },
  twitter: { card: "summary_large_image", title: titles, description: descriptions },
  // `robots` is deliberately absent: Next injects `noindex` for anything served
  // with a 404, and declaring it here only emitted a second, redundant tag.
};

function Miss({ locale, lead }: { locale: Locale; lead: boolean }) {
  const t = dictionaryFor(locale);
  const r = routes(locale);
  const Heading = lead ? "h1" : "h2";

  return (
    <section lang={BCP47[locale]} className={lead ? undefined : "mt-12 border-t border-border pt-10"}>
      {lead && (
        <p className="mb-3 text-xs font-medium tracking-wide text-ink-subtle uppercase">404</p>
      )}
      <Heading
        className={`${cinzel.className} text-3xl leading-tight text-balance text-ink sm:text-4xl`}
      >
        {t.notFound.title}
      </Heading>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-pretty text-ink-muted">
        {t.notFound.description}
      </p>

      {/*
        * Builds leads and carries the primary treatment: it is the site's spine
        * and the likeliest destination of whatever link broke. Home is the
        * fallback behind it. Both are ordinary links, so keyboard, screen
        * reader and no-JavaScript readers get the same two routes out, and
        * `flex-wrap` stacks them rather than overflowing at 320px. Both take
        * the ember `:focus-visible` ring from `globals.css` unchanged, checked
        * by tabbing to each one in a browser.
        */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={r.builds()}
          className="rounded-md bg-ember px-5 py-2.5 text-sm font-semibold text-abyss transition-colors hover:bg-ember-bright"
        >
          {t.notFound.browseBuilds}
        </Link>
        <Link
          href={r.home()}
          className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-subtle hover:bg-surface-raised"
        >
          {t.notFound.returnHome}
        </Link>
      </div>
    </section>
  );
}

export default function NotFound() {
  return (
    <div className={`${inter.className} bg-abyss-glow flex min-h-screen flex-col`}>
      <header className="border-b border-border">
        <Container size="shell">
          <div className="flex h-14 items-center">
            <Link href={routes("en-us").home()} className="group flex shrink-0 items-baseline gap-2">
              <span
                className={`${cinzel.className} text-lg tracking-wide text-ink transition-colors group-hover:text-ember-bright`}
              >
                {dictionaryFor("en-us").meta.siteName}
              </span>
              <span className="hidden text-[10px] font-medium tracking-widest text-ink-subtle uppercase sm:inline">
                Resurrected
              </span>
            </Link>
          </div>
        </Container>
      </header>

      <main id="content" className="flex-1">
        <Container className="py-16 sm:py-24">
          {LOCALES.map((locale, i) => (
            <Miss key={locale} locale={locale} lead={i === 0} />
          ))}
        </Container>
      </main>
    </div>
  );
}
