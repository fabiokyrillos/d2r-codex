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
 * Deliberately minimal: no ICU MessageFormat. Where a count decides the
 * wording, the dictionary carries both forms and `plural()` picks one.
 */
export function fmt(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** A string whose wording depends on a count. Both forms are required. */
export interface Plural {
  readonly one: string;
  readonly other: string;
}

/**
 * Picks the singular or plural form.
 *
 * `count === 1` rather than `Intl.PluralRules`, and the difference is not
 * pedantry: CLDR classifies zero as *singular* in Portuguese (`one: i = 0..1`),
 * so `Intl.PluralRules("pt-BR").select(0)` returns `"one"` and would render
 * "0 ponto". Brazilian usage — and this product's copy — is "0 pontos". The
 * rule below produces the right string in both languages the site ships.
 *
 * A language whose plural rule this does not fit (Polish, Russian, Arabic)
 * would need a real rules engine, and the `Plural` shape would have to grow
 * more forms. That is a deliberate future cost, not an oversight.
 */
export function plural(forms: Plural, count: number): string {
  return count === 1 ? forms.one : forms.other;
}

/**
 * A count of hard skill points, as text: "1 point", "20 points", "0 pontos".
 *
 * The single place a point count becomes a string. Every surface that shows
 * one — tile, panel, table, budget line, skill page, the no-JavaScript
 * fallback and the accessible name — goes through here, because "1 pts"
 * shipped from three separate call sites each doing its own interpolation.
 */
export function formatPoints(forms: Plural, count: number): string {
  return fmt(plural(forms, count), { points: count });
}
