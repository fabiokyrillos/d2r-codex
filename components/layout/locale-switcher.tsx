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
              const search = globalThis.location.search;
              if (!search) return; // Nothing to carry; let the link do its job.
              event.preventDefault();
              router.push(`${href}${search}`);
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
