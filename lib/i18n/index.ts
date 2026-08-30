import { BCP47, LOCALES, type Locale } from "./config";
import { enUS, type Dictionary } from "./dictionaries/en-us";
import { ptBR } from "./dictionaries/pt-br";

export * from "./config";
export type { Dictionary };

/**
 * Client-safe i18n surface.
 *
 * Everything here is pure data and pure functions, so it can be imported from
 * a Client Component. The locale *getters* live in `./server` because they read
 * `next/root-params`, which is Server Component only — importing them from here
 * would drag that API into the client bundle, and Turbopack refuses the build
 * when that happens. It caught exactly that mistake on the first attempt.
 */

const DICTIONARIES: Record<Locale, Dictionary> = {
  "en-us": enUS,
  "pt-br": ptBR,
};

/** The dictionary for an explicit locale. Used by metadata, sitemap and search. */
export function dictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Canonical and hreflang alternates for one page.
 *
 * `path` is the locale-*less* remainder, e.g. `/runewords/spirit`. Because
 * content slugs are identical in every locale, the alternate URL for each
 * language is a pure prefix swap — which is also why the language switcher can
 * keep the reader on the same page.
 *
 * Emitted on every page rather than only the home page: search engines need
 * per-URL hreflang to treat two language versions as translations rather than
 * as duplicate content.
 *
 * `x-default` points at the *unprefixed* path for the same page, which
 * `proxy.ts` resolves per visitor from their cookie or `Accept-Language`. That
 * is what x-default means — "we do not know which language this reader wants,
 * let the server decide" — and it works for every page, not just the root,
 * because the proxy prefixes any unprefixed path rather than only `/`.
 */
export function alternatesFor(locale: Locale, path = "") {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const suffix = clean ? `/${clean}` : "";
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      // Keys are BCP 47 tags; Next emits them as hreflang.
      ...(Object.fromEntries(
        LOCALES.map((l) => [BCP47[l], `/${l}${suffix}`]),
      ) as Record<string, string>),
      "x-default": suffix || "/",
    },
  };
}

/**
 * Interpolates `{placeholder}` tokens.
 *
 * Deliberately minimal: no pluralisation engine, no ICU MessageFormat. The two
 * places that genuinely need a plural (build counts) use explicit singular and
 * plural keys, which is honest about the fact that Portuguese and English
 * happen to agree on the rule here and would not for every language.
 */
export function fmt(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
