import { searchIndex } from "@/lib/search";

/**
 * The search index as a single static JSON file.
 *
 * Serialising the index into every page's RSC payload cost roughly 46KB per
 * page — on a 103KB rune page, nearly half the weight, repeated on all 117
 * routes and re-sent on every navigation.
 *
 * Emitting it once as a static asset means it is fetched at most once per
 * visitor, only if they actually open search, and then served from the browser
 * cache for the rest of the session.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "content-type": "application/json",
      // Content only changes on rebuild, so it can be cached hard.
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
