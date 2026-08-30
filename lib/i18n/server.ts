import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "./config";
import { dictionaryFor, type Dictionary } from "./index";

/**
 * Server-only locale access.
 *
 * `next/root-params` is new in Next.js 16 and is what makes the whole
 * internationalisation work without prop-drilling: because the root layout
 * lives at `app/[lang]/layout.tsx`, `lang` is a *root* parameter, and any
 * Server Component — including one nested six levels deep inside a gear table —
 * can read it directly.
 *
 * It cannot be used in Client Components, Server Actions or Route Handlers.
 * The search dialog (a Client Component) receives its strings as props, and the
 * search-index Route Handler reads the segment from `params` instead.
 */

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaryFor(await getLocale());
}

/**
 * Both at once. Almost every page needs the locale (to build links) as well as
 * the dictionary, and fetching them separately means two awaits per page.
 */
export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: dictionaryFor(locale) };
}
