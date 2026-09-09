"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BCP47,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_NAMES,
  LOCALE_SHORT,
  localePath,
  splitLocalePath,
  type Locale,
} from "@/lib/i18n/config";

/**
 * The language switcher.
 *
 * Two requirements shape this component:
 *
 * 1. **It must preserve the page.** Switching language on
 *    `/en-us/runewords/spirit` has to land on `/pt-br/runewords/spirit`, not on
 *    the home page. That works because content slugs are identical across
 *    locales by design — so the switch is a pure prefix swap, computed from the
 *    current pathname.
 *
 * 2. **The choice must persist.** Writing the cookie here (rather than in a
 *    Server Action) means the proxy sees it on the *next* unprefixed request,
 *    so a visitor who picks Portuguese and later types the bare domain gets
 *    Portuguese.
 *
 * It renders real `<a>` elements rather than buttons, so the alternate-language
 * URLs are crawlable and the links work with JavaScript disabled — the cookie
 * is a convenience, not the mechanism.
 *
 * 3. **It must preserve the query.** The build filters put their state in the
 *    URL as language-independent slugs precisely so that a filtered link means
 *    the same thing in either language — and then this component dropped it,
 *    so switching language on a filtered catalogue silently reset it to all 29
 *    builds.
 *
 *    The query is read in the click handler from `window.location`, never
 *    through `useSearchParams`. This component is in the site header, so
 *    reading search params during render would make every page on the site
 *    client-render up to its nearest Suspense boundary and cost the static
 *    HTML its header. The `href` therefore stays the bare path — which is what
 *    a crawler should follow and what a reader without JavaScript gets — and
 *    the query is added only when there is one to add.
 *
 * 4. **It must preserve the fragment too.** The URL was reassembled from
 *    `usePathname()`, which returns the path and nothing else, plus
 *    `location.search`. The fragment was never read, so switching language on
 *    `…/blizzard-sorceress#gear-budget` dropped the reader at the top of the
 *    other language's page with a different tier open. The fragment cannot go
 *    in the `href` either: this header is prerendered into every document the
 *    site builds, and there is no `window` during a prerender — so putting it
 *    there is a crash or a hydration mismatch. It is read in the handler beside
 *    the query instead and, unlike the query, it forces a full navigation, for
 *    the three reasons written where that branch is.
 */
/**
 * Writes the locale cookie.
 *
 * Lives at module scope rather than inside the component because
 * `react-hooks/immutability` (correctly) flags writes to browser globals from
 * within a component body — the rule cannot tell that this only ever runs from
 * an event handler.
 *
 * `Secure` is omitted deliberately: it would stop the cookie being set over
 * http://localhost during development, and a language preference is not
 * sensitive.
 */
function persistLocale(locale: Locale) {
  globalThis.document.cookie = [
    `${LOCALE_COOKIE}=${locale}`,
    "Path=/",
    `Max-Age=${LOCALE_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
}

export function LocaleSwitcher({
  current,
  label,
  switchToTemplate,
}: {
  current: Locale;
  label: string;
  switchToTemplate: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { rest } = splitLocalePath(pathname ?? "/");

  return (
    <div
      className="flex items-center rounded-md border border-border bg-surface p-0.5"
      role="group"
      aria-label={label}
    >
      {LOCALES.map((locale) => {
        const isCurrent = locale === current;
        const href = localePath(locale, rest);
        return (
          <Link
            key={locale}
            href={href}
            hrefLang={BCP47[locale]}
            lang={BCP47[locale]}
            aria-current={isCurrent ? "true" : undefined}
            title={switchToTemplate.replace("{language}", LOCALE_NAMES[locale])}
            onClick={(event) => {
              persistLocale(locale);
              /*
               * Only a plain left click is ours to take over. Ctrl, Cmd and
               * Shift clicks are the reader asking for a new tab or window, and
               * calling `preventDefault` on one would silently turn that into a
               * same-tab navigation — the link would stop behaving like a link
               * on exactly the filtered pages this exists to serve.
               */
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.defaultPrevented
              ) {
                return;
              }
              /*
               * Two reads, two lines, deliberately.
               *
               * `const { search, hash } = globalThis.location` looks tidier and
               * deletes the substring `location.search` from this file, which
               * is the exact thing `scripts/build-filters.test.ts:593` matches
               * to prove the query is not read through `useSearchParams`. The
               * destructured form ships a green source gate over a component
               * that no longer satisfies the rule it is guarding.
               */
              const search = globalThis.location.search;
              const hash = globalThis.location.hash;
              if (!search && !hash) return; // Nothing to carry; let the link do its job.
              event.preventDefault();
              /*
               * A fragment forces a full navigation; a bare query does not.
               *
               * Three reasons, none of them taste:
               *
               * 1. Next 16 does not document what `router.push` with a fragment
               *    does about scrolling. There is no `useHash` either, and the
               *    anchor contract is not something to build on undocumented
               *    behaviour.
               * 2. `history.pushState` does not fire `hashchange`, so nothing
               *    that listens for the fragment is told the fragment changed.
               * 3. `components/game/tier-selector.tsx:38-45` documents that on a
               *    soft navigation the inline tier boot script does not run —
               *    Next inserts it through a DOM update, and inserted scripts do
               *    not execute. So `#gear-budget` could survive in the URL while
               *    the tier state it names did not follow it.
               *
               * A full navigation hands the jump back to the platform and lets
               * the boot script run. The query-only path is left exactly as it
               * was: it has none of these problems, and a reload would cost the
               * reader a document they already have.
               *
               * `@next/next/no-location-assign-relative-destination` says to use
               * `router.push` for an internal destination, which is the right
               * default and is what the line below it does. The full navigation
               * is the deliberate exception, for the three reasons above, and is
               * disabled by name rather than left as a standing warning.
               */
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- see above
              if (hash) globalThis.location.assign(`${href}${search}${hash}`);
              else router.push(`${href}${search}`);
            }}
            className={
              isCurrent
                ? "rounded px-2 py-1 text-xs font-semibold text-ink bg-surface-overlay"
                : "rounded px-2 py-1 text-xs font-medium text-ink-subtle transition-colors hover:text-ink-muted"
            }
          >
            <span aria-hidden>{LOCALE_SHORT[locale]}</span>
            <span className="sr-only">{LOCALE_NAMES[locale]}</span>
          </Link>
        );
      })}
    </div>
  );
}
