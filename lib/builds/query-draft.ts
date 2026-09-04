/**
 * Reconciling what the reader is typing with what the URL says.
 *
 * The search box is the one filter control that cannot be driven straight from
 * the URL: writing every keystroke through history and reading it back makes
 * the caret jump on fast typing. So the box owns its value and the URL is
 * caught up on a trailing edge — which means two writers for one string, and a
 * rule for telling their edits apart.
 *
 * That rule was wrong once, in a way no data test could see. The URL trims, so
 * typing `"cold "` produces `?q=cold`; a resync that compared the *raw* draft
 * with what the URL handed back saw a difference that was only the trim, and
 * helpfully replaced the box's contents with the trimmed value while the reader
 * was still typing. Pausing after `"cold "` left `"cold"`, so the next word
 * arrived as `"coldmastery"` and the listing went empty.
 *
 * The three decisions live here rather than inside the component because a
 * React effect is not something the repository's test harness can run, and a
 * regression that only shows up between two keystrokes is exactly the kind that
 * needs a gate. `scripts/query-draft.test.ts` drives `reduceQueryDraft` — which
 * is built out of these same three functions — through real typing sequences,
 * and carries the broken comparison as a control.
 *
 * The invariant all of it protects: **normalisation compares, it never
 * rewrites.** `normalizeQuery` decides whether the draft and the URL agree, and
 * decides what the URL carries. Nothing here ever hands a normalised string
 * back to the input.
 */
import { normalizeQuery } from "./filter";

/**
 * What the URL will hand back for a query we are about to write.
 *
 * `serializeFilterState` trims and `parseFilterState` truncates, so a draft
 * makes this round trip before it comes back through `useSearchParams`. Storing
 * the *echo* rather than the draft is what lets the resync below tell "the
 * reader moved" apart from "the URL trimmed what I just wrote".
 */
export function echoOf(draft: string): string {
  return normalizeQuery(draft);
}

/** Whether the draft has changes the URL has not caught up with yet. */
export function needsWrite(draft: string, urlQuery: string): boolean {
  return normalizeQuery(draft) !== urlQuery;
}

/**
 * What the box should show now that the URL says `urlQuery`.
 *
 * `null` means leave the reader's draft alone — the URL is only echoing our own
 * last write back at us. Anything else is Back, Forward, a pasted link or a
 * language switch, and the box should follow it.
 */
export function draftForUrl(urlQuery: string, echo: string): string | null {
  return urlQuery === echo ? null : urlQuery;
}

// ---------------------------------------------------------------------------
// The same three decisions, as something a test can drive
// ---------------------------------------------------------------------------

export interface QueryDraftState {
  /** The input's visible value. Exactly what was typed, always. */
  draft: string;
  /** The `q` the URL currently carries. */
  url: string;
  /** The form the URL gives back for our last write. */
  echo: string;
}

export type QueryDraftEvent =
  /** A keystroke, a paste, or a clear — whatever the input now reads. */
  | { type: "type"; value: string }
  /** The trailing-edge timer fired and we write the URL. */
  | { type: "settle" }
  /** The URL moved underneath us: Back, Forward, a link, a reload. */
  | { type: "url"; q: string };

/** Opening a page — or reloading one — with `q` already in the URL. */
export function openQueryDraft(urlQuery: string): QueryDraftState {
  return { draft: urlQuery, url: urlQuery, echo: urlQuery };
}

/**
 * One step of the reconciliation, with no React in it.
 *
 * Each branch is one of the three exported decisions, in the same order the
 * component applies them: `needsWrite` guards the trailing-edge write,
 * `echoOf` records what that write will come back as, and `draftForUrl`
 * decides whether an incoming URL should touch the box.
 */
export function reduceQueryDraft(
  state: QueryDraftState,
  event: QueryDraftEvent,
): QueryDraftState {
  switch (event.type) {
    case "type":
      return { ...state, draft: event.value };

    case "settle": {
      if (!needsWrite(state.draft, state.url)) return state;
      const written = echoOf(state.draft);
      // The draft is deliberately untouched: the URL takes the canonical form,
      // the box keeps what the reader typed.
      return { ...state, url: written, echo: written };
    }

    case "url": {
      const next = draftForUrl(event.q, state.echo);
      if (next === null) return { ...state, url: event.q };
      return { draft: next, url: event.q, echo: event.q };
    }
  }
}

/** Convenience for tests and callers: fold a whole sequence of events. */
export function runQueryDraft(
  initial: QueryDraftState,
  events: readonly QueryDraftEvent[],
): QueryDraftState {
  return events.reduce(reduceQueryDraft, initial);
}
