import { notFound } from "next/navigation";

import { buildSearchIndex } from "@/lib/search";
import { LOCALES, isLocale } from "@/lib/i18n/config";

/**
 * The search index for one locale, as a static JSON file.
 *
 * Route Handlers cannot read `next/root-params`, so the locale arrives through
 * the ordinary `params` object instead — which is why this file takes the
 * segment explicitly while every Server Component on the site does not.
 *
 * Serialising the index into every page's RSC payload cost roughly 46KB per
 * page. Emitting it once per locale as a static asset means it is fetched at
 * most once per visitor, only if they actually open search, and then served
 * from the browser cache for the rest of the session.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/[lang]/search-index.json">,
) {
  const { lang } = await ctx.params;
  if (!isLocale(lang)) notFound();

  return new Response(JSON.stringify(buildSearchIndex(lang)), {
    headers: {
      "content-type": "application/json",
      // Content only changes on rebuild, so it can be cached hard.
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
