"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { Badge, cn } from "@/components/ui";
import {
  FILTER_GROUPS,
  MAX_QUERY_LENGTH,
  activeCount,
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
import { draftForUrl, echoOf, needsWrite } from "@/lib/builds/query-draft";

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
  hideFilters: string;
  searchChipPrefix: string;
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
  const [panelOpen, setPanelOpen] = useState(false);

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

  const visible = useMemo(
    () => filterBuilds(items.map((i) => i.row), state),
    [items, state],
  );
  const visibleSlugs = useMemo(() => new Set(visible.map((r) => r.slug)), [visible]);

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

          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            aria-controls={panelId}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink sm:hidden"
          >
            {panelOpen ? strings.hideFilters : strings.showFilters}
            {activeCount(state) > 0 && <Badge tone="ember">{activeCount(state)}</Badge>}
          </button>

          <p aria-live="polite" className="ml-auto text-sm text-ink-subtle">
            {resultText}
          </p>
        </div>

        <div
          id={panelId}
          className={cn(
            "grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3",
            panelOpen ? "grid" : "hidden sm:grid",
          )}
        >
          {groups.map((group) => (
            <fieldset key={group.group} className="min-w-0">
              <legend className="text-xs font-semibold tracking-widest text-ink-subtle uppercase">
                {group.legend}
              </legend>
              {/*
                The row *is* the label, rather than a wrapper holding a box and
                a label side by side. That is what makes the whole strip —
                checkbox, the gap between them, the option name and its count —
                one target: `<label>` activation covers its own padding, so
                there is no dead space inside the row, and no second handler to
                fire twice. The `for` and the nesting resolve to the same
                control, which is one labelled control either way.

                The drawn checkbox stays 14×14; what had to change is the target
                it sits in. `py-1` around a 20px line makes each row 28px tall,
                so the rule these rows satisfy is the 24×24 minimum itself
                rather than the spacing exception they were leaning on at 20px.
              */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5">
                {group.options.map((option) => {
                  const id = `${panelId}-${group.group}-${option.value}`;
                  const checked = state[group.group].includes(option.value);
                  return (
                    <label
                      key={option.value}
                      htmlFor={id}
                      className={cn(
                        "flex min-h-6 cursor-pointer items-center gap-1.5 py-1 text-sm",
                        checked ? "text-ink" : "text-ink-muted",
                      )}
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(group.group, option.value)}
                        className="size-3.5 shrink-0 accent-[var(--color-ember)]"
                      />
                      <span>
                        {option.label}{" "}
                        <span className="text-xs text-ink-subtle">({option.count})</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/*
          Directly under the group it defines. It used to sit after the whole
          listing — four screens below the "Good at" checkboxes on the
          unfiltered catalogue, and in the no-JS HTML, where it explained a
          control that is not rendered at all.
        */}
        {strings.goodAtNote && <p className="text-xs text-ink-subtle">{strings.goodAtNote}</p>}

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
