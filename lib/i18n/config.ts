/**
 * Locale configuration.
 *
 * en-US is the editorial source. pt-BR is a full translation, not a partial
 * one: the type system enforces that every localized value carries both, so a
 * missing translation is a compile error rather than a runtime fallback.
 *
 * This module is deliberately dependency-free so it can be imported from the
 * proxy (which runs at the edge), from Server Components, and from the one
 * Client Component on the site.
 */

export const LOCALES = ["en-us", "pt-br"] as const;
export type Locale = (typeof LOCALES)[number];

/** The editorial source locale, and the fallback for the root redirect. */
export const DEFAULT_LOCALE: Locale = "en-us";

/**
 * URL segments are lowercase (`/pt-br/...`) because mixed-case paths are a
 * recurring source of duplicate-content and cache-key bugs. The BCP 47 tags
 * below are what goes in `<html lang>`, `hreflang` and Open Graph, where the
 * canonical casing does matter.
 */
export const BCP47: Record<Locale, string> = {
  "en-us": "en-US",
  "pt-br": "pt-BR",
};

/** Open Graph uses underscore-separated tags rather than BCP 47 hyphens. */
export const OG_LOCALE: Record<Locale, string> = {
  "en-us": "en_US",
  "pt-br": "pt_BR",
};

/** Names are written in their own language, as language pickers should be. */
export const LOCALE_NAMES: Record<Locale, string> = {
  "en-us": "English",
  "pt-br": "Português",
};

export const LOCALE_LONG_NAMES: Record<Locale, string> = {
  "en-us": "English (United States)",
  "pt-br": "Português (Brasil)",
};

/** Short label for the compact switcher in the header. */
export const LOCALE_SHORT: Record<Locale, string> = {
  "en-us": "EN",
  "pt-br": "PT",
};

/** Cookie holding the visitor's explicit choice. Read by the proxy. */
export const LOCALE_COOKIE = "d2rc_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Maps an `Accept-Language` header onto a supported locale.
 *
 * Deliberately hand-rolled rather than pulling in Negotiator and
 * intl-localematcher: the whole rule set is "any Portuguese variant means
 * pt-BR, everything else means en-US", and that does not justify two
 * dependencies in an edge bundle.
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag === "*") return DEFAULT_LOCALE;
    // Exact match on a supported segment, e.g. "pt-br".
    if (isLocale(tag)) return tag;
    // Any Portuguese variant (pt, pt-PT, pt-AO) maps to pt-BR — a Portuguese
    // speaker is far better served by Portuguese than by English.
    if (tag === "pt" || tag.startsWith("pt-")) return "pt-br";
    if (tag === "en" || tag.startsWith("en-")) return "en-us";
  }

  return DEFAULT_LOCALE;
}

/**
 * Splits a pathname into its locale segment and the rest.
 *
 * Used by the language switcher to preserve the current page across a locale
 * change, and by the proxy to detect an already-localized request.
 */
export function splitLocalePath(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const [first, ...others] = segments;
  if (isLocale(first)) {
    return { locale: first, rest: others.length ? `/${others.join("/")}` : "" };
  }
  return { locale: null, rest: pathname === "/" ? "" : pathname };
}

/** Builds a locale-prefixed path. `path` is the locale-less remainder. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
