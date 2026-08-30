import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  matchLocale,
} from "@/lib/i18n/config";

/**
 * Locale routing.
 *
 * Note the filename: Next.js 16 renamed the `middleware` convention to
 * `proxy`. `middleware.ts` is deprecated.
 *
 * Everything the site serves lives under `/en-us/…` or `/pt-br/…`, so this
 * handles exactly one job: a request that arrives without a locale prefix gets
 * redirected to one. Resolution order is
 *
 *   1. the visitor's stored choice (cookie), because an explicit choice should
 *      survive; then
 *   2. `Accept-Language`, because a first-time Portuguese speaker should not
 *      have to find the switcher; then
 *   3. en-US.
 *
 * The redirect is 307 rather than 308 on purpose. A permanent redirect from
 * `/` would be cached by browsers against the *first* locale a visitor was
 * sent to, which would then be impossible to change from the switcher.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const stored = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored)
    ? stored
    : matchLocale(request.headers.get("accept-language")) || DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url, 307);
}

export const config = {
  /*
   * Skip Next internals and anything that looks like a file. sitemap.xml,
   * robots.txt and favicon.ico are deliberately *not* locale-prefixed — a
   * sitemap covering both languages is a single document, and robots.txt has
   * to live at the domain root to be honoured at all.
   */
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.[\\w]+$).*)",
  ],
};
