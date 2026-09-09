import { tierBootScript } from "@/lib/prefs";

/**
 * The one inline script on this site, and the reason it has to be one.
 *
 * The build page ships its six gear tiers open, because that is what a reader
 * without JavaScript must get (R-BUILD-12). With JavaScript they collapse —
 * and *when* they collapse is the whole design:
 *
 *   - After paint (a `useEffect`), a reader arriving on `#gear-budget` would
 *     see the browser jump to the anchor, then watch thirteen thousand pixels
 *     vanish from above them and end up somewhere else entirely.
 *   - Before paint, during parsing, none of that is observable. The script
 *     runs before React has loaded, so there is no frame in which the wrong
 *     thing was on screen.
 *
 * `next/script` cannot do this: `beforeInteractive` has to live in a root
 * layout and explicitly does not block hydration. Next's own guide for this
 * problem — `01-app/02-guides/preventing-flash-before-hydration.md`, whose
 * worked example is a `<details>` accordion persisted to `localStorage` —
 * uses a raw `<script>`, and so does this.
 *
 * It must render *after* the six `<details>`. A script in `<head>`, or above
 * them, runs before the elements exist and silently finds nothing.
 *
 * The source lives in `lib/prefs.ts` rather than here so that it can be unit
 * tested. `scripts/prefs.test.ts` executes it against a hand-rolled document
 * and compares the result to `resolveActiveTier` across the whole state
 * matrix — otherwise the script and the module it mirrors could drift apart
 * with nothing to notice.
 *
 * No `InlineScript`-style `type="text/plain"` dance is needed. That trick
 * exists for scripts rendered by *Client* Components, which React re-inserts
 * on a soft navigation; this one is rendered on the server, so it is only
 * ever parsed on a real document load. Soft navigations are handled by the
 * island's layout effect instead.
 */
export function TierPreferenceScript() {
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: tierBootScript() }} />;
}
