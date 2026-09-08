"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui";
import {
  FILTER_GROUPS,
  MAX_QUERY_LENGTH,
  filterBuilds,
  filterQueryString,
  isEmptyState,
  parseFilterState,
  toggleValue,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
  type OptionSets,
} from "@/lib/builds/filter";
import { applyFilterDraft, sheetFilterCount } from "@/lib/builds/filter-sheet";
import { draftForUrl, echoOf, needsWrite } from "@/lib/builds/query-draft";
import { FilterGroupFieldsets, MobileFilterSheet } from "./mobile-filter-sheet";

/**
 * Filters for any listing of build cards.
 *
 * **The cards are rendered by the server, not by this component.** They arrive
 * as `ReactNode` alongside their row and this component only decides which of
 * them to render. That is not an optimisation, it is the only thing that works:
 * `ElementBadge` and the rest of `@/components/game` are async Server
 * Components that read the locale through `next/root-params`, and
 * `components/ui` reaches them. Rebuilding a card here would either duplicate
 * the markup or pull the registry across the client boundary, and
 * `client-boundary.test.ts` fails the build for the second one.
 *
 * **The unfiltered list is the Suspense fallback.** `useSearchParams` in a
 * prerendered route forces the tree up to the nearest boundary to be
 * client-rendered, so whatever the page passes as that boundary's fallback is
 * what ends up in the static HTML — and what a reader without JavaScript sees.
 * The pages pass the complete list. With no filters in the URL the hydrated
 * render is identical to it, so there is nothing to flash and nothing to
 * mismatch.
 *
 * **URL writes go through the History API, not the router.** Next.js integrates
 * `window.history.pushState`/`replaceState` with `useSearchParams`, so this
 * stays on the client with no RSC round-trip. Toggling a filter pushes, so Back
 * undoes exactly one decision; typing replaces, so a search box does not bury
 * the previous page under thirty history entries.
 *
 * **Below `sm` the groups are somewhere else, and they commit differently.**
 * They move into `MobileFilterSheet`, a modal bottom sheet whose selections are
 * a draft: the count in its primary action follows every tick while the listing
 * and the URL stay put, and Apply writes one entry. Desktop is unchanged —
 * inline, immediate, one push per tick — because there the reader can see what
 * each tick does. The search box and the results summary stay in the page on
 * both layouts, so search keeps its own trailing-edge `replaceState` either way.
 *
 * The groups are rendered *once*, in whichever of the two places is live, and
 * `sm` is asked with `matchMedia` rather than guessed. Two copies in the DOM
 * would mean two elements sharing an `id`, two checkboxes claiming the same
 * label, and a hidden set of zero-height rows for any gate measuring targets.
 * The first client render deliberately matches the server's — the inline panel,
 * `display: none` below `sm` — so there is nothing to mismatch during
 * hydration; the swap happens in an effect, on a panel nobody can see.
 */

export interface FilterGroupView {
  group: FilterGroup;
  legend: string;
  options: { value: string; label: string; count: number }[];
}

export interface BuildFilterStrings {
  /** Legend/label for the whole region. */
  regionLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  /** `{count}` builds shown. Singular and plural. */
  resultsOne: string;
  resultsMany: string;
  activeLabel: string;
  /** `{filter}` — accessible name of a chip's remove button. */
  removeOne: string;
  clearAll: string;
  emptyTitle: string;
  emptyBody: string;
  showFilters: string;
  searchChipPrefix: string;
  /** The mobile sheet's heading, and its accessible name. */
  sheetTitle: string;
  /** Accessible name of the sheet's ✕. */
  sheetClose: string;
  /** The sheet's discard action, beside Apply. */
  sheetCancel: string;
  /** Empties the sheet's draft. Not the search box, which is outside it. */
  sheetClear: string;
  /** `Show {count} build` — the sheet's primary action, singular. */
  showResultsOne: string;
  /** `Show {count} builds` — plural. */
  showResultsMany: string;
  /**
   * What "Good at" means, already interpolated. Omitted when the surface does
   * not offer that group, because a note explaining a control the page does not
   * render is worse than no note.
   */
  goodAtNote?: string;
}

export interface BuildFilterItem {
  row: BuildRow;
  card: ReactNode;
}

export function BuildFilters({
  items,
  groups,
  strings,
  listClassName,
  leading,
}: {
  items: BuildFilterItem[];
  groups: FilterGroupView[];
  strings: BuildFilterStrings;
  /** The grid classes the surrounding page already uses for this list. */
  listClassName: string;
  /** Rendered as the first cell and never filtered — the class page's journey card. */
  leading?: ReactNode;
}) {
  const searchParams = useSearchParams();
  const panelId = useId();
  const [sheetOpen, setSheetOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /*
   * Which of the two layouts is live.
   *
   * `40rem` is Tailwind's `sm`, written once here so the query and the classes
   * that hide each layout cannot drift apart. It starts `false` on purpose: the
   * server renders the inline panel, the first client render has to agree, and
   * the panel it renders is `display: none` below `sm` anyway — so the swap
   * happens in an effect, on something nobody can see.
   *
   * The listener is what makes a resize honest. Growing past `sm` while the
   * sheet is open closes it, which drops the draft and hands the reader the
   * desktop panel showing the state the URL actually carries.
   */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 40rem)");
    const sync = () => {
      setNarrow(!mq.matches);
      if (mq.matches) setSheetOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const options: OptionSets = useMemo(() => {
    const sets: Record<string, string[]> = {};
    for (const g of groups) sets[g.group] = g.options.map((o) => o.value);
    return sets as OptionSets;
  }, [groups]);

  const urlState = useMemo(
    () => parseFilterState(searchParams, options),
    [searchParams, options],
  );

  /*
   * The text box is the one control that cannot be driven straight from the
   * URL. Writing every keystroke through history and reading it back makes the
   * caret jump on fast typing, so the input owns its own value and the URL is
   * caught up on a trailing edge. Everything else — including Back, Forward and
   * a pasted link — flows the other way, which is why this resyncs whenever the
   * URL's own query changes underneath it.
   *
   * The three decisions that tell those two writers apart live in
   * `lib/builds/query-draft.ts`, driven by `scripts/query-draft.test.ts`. They
   * are here as function calls rather than as inline comparisons because
   * getting one of them wrong is invisible in the markup and only shows up
   * between two keystrokes — comparing the *raw* draft with what the URL handed
   * back once deleted the space out of "cold " mid-typing, and the next word
   * arrived as "coldsorceress".
   */
  const [draft, setDraft] = useState(urlState.q);
  const echo = useRef(urlState.q);
  useEffect(() => {
    const next = draftForUrl(urlState.q, echo.current);
    if (next === null) return;
    echo.current = urlState.q;
    setDraft(next);
  }, [urlState.q]);

  const state: BuildFilterState = useMemo(
    () => ({ ...urlState, q: draft }),
    [urlState, draft],
  );

  const write = useCallback((next: BuildFilterState, mode: "push" | "replace") => {
    // What the URL will hand back, so the resync above can tell "the reader
    // moved" apart from "the URL trimmed what I just wrote".
    echo.current = echoOf(next.q);
    const url = `${window.location.pathname}${filterQueryString(next)}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }, []);

  /*
   * Trailing-edge sync for the query.
   *
   * The groups come from `urlState` rather than from `state`, which is the
   * point: `urlState` only changes when the URL does, so this effect settles
   * instead of re-arming itself every keystroke. Once the write lands,
   * `draft === urlState.q` and the next run returns immediately.
   */
  useEffect(() => {
    if (!needsWrite(draft, urlState.q)) return;
    const id = window.setTimeout(() => write({ ...urlState, q: draft }, "replace"), 250);
    return () => window.clearTimeout(id);
  }, [draft, urlState, write]);

  const onToggle = (group: FilterGroup, value: string) => {
    const next = toggleValue(state, group, value, options[group] ?? []);
    write(next, "push");
  };

  const clearAll = () => {
    setDraft("");
    write({ q: "", class: [], damage: [], difficulty: [], budget: [], goodAt: [] }, "push");
  };

  const rows = useMemo(() => items.map((i) => i.row), [items]);
  const visible = useMemo(() => filterBuilds(rows, state), [rows, state]);
  const visibleSlugs = useMemo(() => new Set(visible.map((r) => r.slug)), [visible]);

  /*
   * The sheet's primary action has to say what applying its draft *would*
   * produce, so it asks the same `filterBuilds` the listing is rendered from
   * rather than estimating. The rows are the parent's; the sheet only holds a
   * state.
   */
  const resultCountFor = useCallback(
    (candidate: BuildFilterState) => filterBuilds(rows, candidate).length,
    [rows],
  );

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    // Before the sheet unmounts, so focus is never left on a removed node.
    triggerRef.current?.focus();
  }, []);

  const applyDraft = useCallback(
    (next: BuildFilterState) => {
      /*
       * One `pushState`, so Back undoes the whole visit to the sheet at once.
       * The search box is deliberately not touched: `applyFilterDraft` trims
       * the query for the URL, and handing that trimmed value back to the input
       * is the exact edit that once deleted the space out of "cold " while it
       * was still being typed. `write` records the echo, and the resync above
       * recognises its own write and leaves the box alone.
       */
      write(applyFilterDraft(next, options), "push");
      closeSheet();
    },
    [options, write, closeSheet],
  );

  const labelFor = (group: FilterGroup, value: string) =>
    groups.find((g) => g.group === group)?.options.find((o) => o.value === value)?.label ?? value;

  const count = visible.length;
  const resultText = (count === 1 ? strings.resultsOne : strings.resultsMany).replace(
    "{count}",
    String(count),
  );
  const chips = FILTER_GROUPS.flatMap((group) =>
    state[group].map((value) => ({ group, value, label: labelFor(group, value) })),
  );
  const showChips = chips.length > 0 || state.q.trim() !== "";

  return (
    <div className="space-y-4">
      <section aria-label={strings.regionLabel} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 grow sm:max-w-sm">
            <label htmlFor={`${panelId}-q`} className="sr-only">
              {strings.searchLabel}
            </label>
            <input
              id={`${panelId}-q`}
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={strings.searchPlaceholder}
              autoComplete="off"
              maxLength={MAX_QUERY_LENGTH}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-border-strong"
            />
          </div>

          {/*
            The badge counts what the sheet holds, not `activeCount`, which
            counts the query too. That was right while the query and the boxes
            shared one panel; with the box outside the sheet it would badge a
            "1" the reader cannot find, opening onto nothing ticked.
          */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen && narrow}
            aria-haspopup="dialog"
            aria-controls={panelId}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink sm:hidden"
          >
            {strings.showFilters}
            {sheetFilterCount(state) > 0 && <Badge tone="ember">{sheetFilterCount(state)}</Badge>}
          </button>

          <p aria-live="polite" className="ml-auto text-sm text-ink-subtle">
            {resultText}
          </p>
        </div>

        {/*
          Desktop, and the first client render everywhere. Below `sm` this is
          `display: none` and, once the effect has run, not rendered at all —
          the groups are in the sheet instead, and rendering both would put two
          checkboxes on every option and two elements on every `id`.
        */}
        {!narrow && (
          <FilterGroupFieldsets
            groups={groups}
            state={state}
            id={panelId}
            idPrefix={panelId}
            onToggle={onToggle}
            note={strings.goodAtNote}
            className="hidden gap-x-6 gap-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3"
          />
        )}

        {showChips && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <span className="text-xs tracking-wide text-ink-subtle uppercase">
              {strings.activeLabel}
            </span>
            {state.q.trim() !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  write({ ...state, q: "" }, "push");
                }}
                aria-label={strings.removeOne.replace(
                  "{filter}",
                  `${strings.searchChipPrefix} ${state.q.trim()}`,
                )}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-overlay px-2 py-0.5 text-xs font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
              >
                <span className="max-w-40 truncate">
                  {strings.searchChipPrefix} {state.q.trim()}
                </span>
                <span aria-hidden>✕</span>
              </button>
            )}
            {chips.map((chip) => (
              <button
                key={`${chip.group}-${chip.value}`}
                type="button"
                onClick={() => onToggle(chip.group, chip.value)}
                aria-label={strings.removeOne.replace("{filter}", chip.label)}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-overlay px-2 py-0.5 text-xs font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
              >
                {chip.label}
                <span aria-hidden>✕</span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-ember underline-offset-2 hover:text-ember-bright hover:underline"
            >
              {strings.clearAll}
            </button>
          </div>
        )}
      </section>

      {/*
        Mounted only while it is open, so a shut sheet leaves nothing in the
        accessibility tree — and `narrow` is required as well as `sheetOpen`, so
        a click that reaches the hidden trigger above `sm` (a script, a stale
        tap during a resize) cannot lock the scroll of a page it would not
        cover.
      */}
      {sheetOpen && narrow && (
        <MobileFilterSheet
          applied={state}
          groups={groups}
          options={options}
          labelledBy={panelId}
          note={strings.goodAtNote}
          resultCountFor={resultCountFor}
          onApply={applyDraft}
          onCancel={closeSheet}
          strings={{
            title: strings.sheetTitle,
            close: strings.sheetClose,
            cancel: strings.sheetCancel,
            clear: strings.sheetClear,
            showOne: strings.showResultsOne,
            showMany: strings.showResultsMany,
          }}
        />
      )}

      {/*
        The leading cell is not a build and never disappears, so a class page
        that filters every build away still shows its levelling card. The empty
        state sits below it rather than replacing it, because "no builds match"
        and "there is nothing on this page" are different messages.
      */}
      {(count > 0 || leading) && (
        <ul className={listClassName}>
          {leading && <li>{leading}</li>}
          {items
            .filter((item) => visibleSlugs.has(item.row.slug))
            .map((item) => (
              <li key={item.row.slug}>{item.card}</li>
            ))}
        </ul>
      )}

      {count === 0 && (
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="font-display text-base text-ink">{strings.emptyTitle}</p>
          <p className="mx-auto mt-1.5 max-w-prose text-sm text-pretty text-ink-muted">
            {strings.emptyBody}
          </p>
          {!isEmptyState(state) && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 inline-flex rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
            >
              {strings.clearAll}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
