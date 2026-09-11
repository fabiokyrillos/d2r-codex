"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { Badge, cn } from "@/components/ui";
import {
  EMPTY_FILTER_STATE,
  FILTER_GROUPS,
  SORT_KEYS,
  activeCount,
  advancedCount,
  facetCounts,
  filterBuilds,
  filterQueryString,
  parseFilterState,
  toggleKeepingResults,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
  type OptionSets,
  type RatingAxis,
  type SortKey,
} from "@/lib/builds/filter";
import { nearBuilds, undoAvailable, zeroingGroups, type Decision } from "@/lib/builds/empty-state";
import { applyFilterDraft } from "@/lib/builds/filter-sheet";
import { availableSorts, sortBuilds } from "@/lib/builds/sort";
import type { Locale } from "@/lib/i18n/config";
import { readTier, type ProgressionTierLike } from "@/lib/prefs";
import { routes } from "@/lib/routes";
import type { ClassSlug } from "@/lib/types/core";
import { ClassChip } from "./class-chip";
import { FilterGroups, type FilterGroupView } from "./filter-groups";
import { FilterPopover, type PopoverCloseReason } from "./filter-popover";
import { ListingContext, type ListingView } from "./listing-context";
import { MobileFilterSheet } from "./mobile-filter-sheet";
import { StagePicker, type StageOption } from "./stage-picker";

/**
 * The controls over any listing of build cards, and the listing itself.
 *
 * **The cards are rendered by the server, not by this component.** They
 * arrive as `ReactNode` alongside their row and this component only decides
 * which of them to render, and in what order. That is not an optimisation, it
 * is the only thing that works: `BuildCard` reads the registry and the
 * dictionary, and `client-boundary.test.ts` fails the build if either reaches
 * a `"use client"` entry. What the cards need to know about the reader — the
 * "Good at" axes in the URL, the saved stage — reaches them through
 * `ListingContext`, read by the two small islands inside each card. They
 * arrive wrapped in a promise, read with `use`, for a reason that is entirely
 * the server's: `filterable-build-list.tsx` explains what a plain prop did.
 *
 * **The static HTML is the Suspense fallback.** `useSearchParams` in a
 * prerendered route forces the tree up to the nearest boundary to be
 * client-rendered, so what the page passes as that boundary's fallback is what
 * the built HTML contains: `StaticListing`, the complete list under the eight
 * class chips as links. With no filters in the URL this component lists the
 * same cards in the same order, so the swap adds the second row of controls
 * and moves nothing else.
 *
 * **Every decision is one `pushState`, and the URL is the state.** A class
 * chip, a tick in the popover, a sort change, an applied chip's ✕, "Clear
 * all", "Remove {group}", the sheet's Apply — each writes exactly one history
 * entry through the History API, which Next integrates with `useSearchParams`,
 * so Back undoes one decision and Forward redoes it, and the controls and the
 * list follow the address rather than a memo of the first render (R-FILT-9;
 * plan mutation M5). A write whose URL is the current one is skipped. The
 * decisions are also kept in a session log, because "Remove last filter" is
 * defined as undoing the last one *this component* made (plan §4.3).
 *
 * **Every toggle goes through `toggleKeepingResults`.** Never the plain one:
 * an un-tick that would empty the list takes its inert siblings with it, so
 * no click lands on the empty state (plan §4.2; mutation M8). Every count is
 * `facetCounts` of the applied state, so an option at `0` really would show
 * nothing and is disabled (R-FILT-4; mutations M1, M3, M9).
 *
 * **The stage is a preference, not a filter.** `tier` is read from storage in
 * an effect, written only by `StagePicker`, and used for exactly two things:
 * it enables the "For my stage" sort — `availableSorts` withholds the key
 * without it, so `?sort=stage` opened cold degrades to Recommended — and it
 * puts a line on every card. Filtering and counting never see it (PRD §7.1;
 * mutation M2).
 *
 * **Two surfaces for the advanced groups, one trigger.** From `sm` up the
 * trigger opens `FilterPopover`, non-modal, applying live; below it, the
 * modal `MobileFilterSheet` with its draft and single Apply. `sm` is asked
 * with `matchMedia` rather than guessed, and the answer arrives in the same
 * commit as the hydration marker, so a gate that waits for `data-filters-ready`
 * never sees the wrong surface. The disclosure's open state is this
 * component's own, not the URL's, which is what lets the popover stay open
 * while every tick inside it changes the address.
 */

export interface BuildFilterStrings {
  /** Accessible name of the whole controls region. */
  regionLabel: string;
  /** Accessible name of the class chip row. */
  classesLabel: string;
  stageLegend: string;
  stageMine: string;
  stageClear: string;
  stageClearLabel: string;
  stageHelp: string;
  stageAnnounce: string;
  /** The trigger's name from `sm` up; `showFilters` is the phone's. */
  moreFilters: string;
  showFilters: string;
  sortLabel: string;
  sortRecommended: string;
  sortStage: string;
  sortEasiest: string;
  sortCheapest: string;
  sortName: string;
  sortHelpLabel: string;
  sortHelpRecommended: string;
  sortHelpStage: string;
  /** `{count}` builds shown. Singular and plural. */
  resultsOne: string;
  resultsMany: string;
  activeLabel: string;
  /** `{filter}` — accessible name of an applied chip's remove button. */
  removeOne: string;
  clearAll: string;
  emptyTitle: string;
  emptyBody: string;
  removeLast: string;
  /** `{group}` — the legend(s) of the group(s) whose removal brings builds back. */
  removeGroup: string;
  nearTitle: string;
  /** The mobile sheet's heading, and the popover's accessible name. */
  sheetTitle: string;
  sheetClose: string;
  sheetCancel: string;
  sheetClear: string;
  showResultsOne: string;
  showResultsMany: string;
  /**
   * What "Good at" means, already interpolated. Omitted when the surface does
   * not offer that group, because a note explaining a control the page does
   * not render is worse than no note.
   */
  goodAtNote?: string;
}

export interface BuildFilterItem {
  row: BuildRow;
  card: ReactNode;
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

export function BuildFilters({
  data,
  classOptions,
  groups,
  tiers,
  strings,
  listClassName,
  locale,
}: {
  /**
   * The cards with their rows, and the leading cell — the class page's
   * journey card, rendered as the first cell and never filtered. A promise
   * the server has already resolved; see `filterable-build-list.tsx`.
   */
  data: Promise<{ items: BuildFilterItem[]; leading?: ReactNode }>;
  /** The catalogue's classes, in chip order. Absent on a class page, which has no class control. */
  classOptions?: { value: ClassSlug; label: string }[];
  /** The advanced groups, in `ADVANCED_GROUPS` order: what the popover and the sheet hold. */
  groups: FilterGroupView[];
  tiers: StageOption[];
  strings: BuildFilterStrings;
  /** The grid classes the surrounding page already uses for this list. */
  listClassName: string;
  /** For the name sort's collator and the near builds' links. */
  locale: Locale;
}) {
  const { items, leading } = use(data);
  const searchParams = useSearchParams();
  const panelId = useId();
  const sortId = `${panelId}-sort`;
  const noteId = `${panelId}-note`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  /*
   * What only the browser can tell us, read once after mount, in one state
   * object so the three facts land in the same commit: the hydration marker
   * the gates wait for, the stored stage, and which of the two disclosure
   * surfaces is live. `narrow` starts false because the server never renders
   * this tree at all; the first client render is simply the desktop shape,
   * and nothing is visible until the effect has run.
   *
   * eslint-disable, with the reason: the "cascading renders" rule is about
   * effects that set state in response to their own output. This sets it
   * exactly once, from sources that cannot be read during render.
   */
  const [boot, setBoot] = useState<{ ready: boolean; tier: ProgressionTierLike | null; narrow: boolean }>({
    ready: false,
    tier: null,
    narrow: false,
  });
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { ready, tier, narrow } = boot;

  useEffect(() => {
    // `40rem` is Tailwind's `sm`, written once here so the query and the
    // classes that lay out each surface cannot drift apart.
    const mq = window.matchMedia("(min-width: 40rem)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setBoot({ ready: true, tier: readTier(), narrow: !mq.matches });
    // Crossing `sm` in either direction closes whatever is open: a draft the
    // sheet was holding is dropped, and the desktop panel — or the phone's
    // sheet — reopens from what the URL actually carries.
    const onChange = () => {
      setBoot((b) => ({ ...b, narrow: !mq.matches }));
      setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /*
   * What this page offers, and therefore what its URL may select. The sort
   * list depends on the preference: without a stage there is no "For my
   * stage", and a `?sort=stage` link opened without one falls back to the
   * default the same way an unknown value for any group does.
   */
  const options: OptionSets = useMemo(() => {
    const sets: Record<string, readonly string[]> = {};
    if (classOptions) sets.class = classOptions.map((o) => o.value);
    for (const g of groups) sets[g.group] = g.options.map((o) => o.value);
    return { ...sets, sort: availableSorts(tier !== null) } as OptionSets;
  }, [classOptions, groups, tier]);

  const urlState = useMemo(() => parseFilterState(searchParams, options), [searchParams, options]);
  const rows = useMemo(() => items.map((i) => i.row), [items]);
  const cardBySlug = useMemo(() => new Map(items.map((i) => [i.row.slug, i.card])), [items]);
  const counts = useMemo(() => facetCounts(rows, urlState), [rows, urlState]);
  const visible = useMemo(
    () => sortBuilds(filterBuilds(rows, urlState), urlState.sort, tier, locale),
    [rows, urlState, tier, locale],
  );

  /*
   * The session's decisions, for "Remove last filter". Every push records the
   * query string before and after; `undoAvailable` compares the top of the
   * log with the current address, so after Back — or on any arrival by URL —
   * the offer is withdrawn rather than stepping the reader out of the page.
   *
   * State rather than a ref, because the offer is derived during render and
   * a ref may not be read there. Appending is the only write, and it happens
   * in the same event as the `pushState` it records.
   */
  const [log, setLog] = useState<Decision[]>([]);
  const write = useCallback((next: BuildFilterState) => {
    const to = filterQueryString(next);
    const from = window.location.search;
    if (to === from) return;
    setLog((l) => [...l, { from, to }]);
    window.history.pushState(null, "", `${window.location.pathname}${to}`);
  }, []);

  const toggle = useCallback(
    (group: FilterGroup, value: string) =>
      write(toggleKeepingResults(urlState, group, value, options[group] ?? [], rows)),
    [write, urlState, options, rows],
  );
  const clearAll = () => write({ ...EMPTY_FILTER_STATE, sort: urlState.sort });

  /** Keeps a class chip in view horizontally, and only horizontally. */
  const centreChip = useCallback((slug: string) => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-class="${slug}"]`);
    if (!row || !chip) return;
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, []);
  // A pressed chip is brought into view once, on arrival by URL.
  useEffect(() => {
    if (ready && urlState.class[0]) centreChip(urlState.class[0]);
    // Deliberately only on hydration: a later change is a press, and the
    // press centres its own chip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Whether the class chip row overflows: the edge fade is worn only then.
  const [chipsOverflow, setChipsOverflow] = useState(false);
  useEffect(() => {
    const row = chipsRef.current;
    if (!row) return;
    const measure = () => setChipsOverflow(row.scrollWidth > row.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [ready]);

  /*
   * The disclosure. One trigger, one `open`, two surfaces: which one renders
   * is `narrow`'s business. Closing is never a decision — it writes nothing —
   * and only Escape (and the sheet's every way out, which is modal) hands
   * focus back to the trigger; a pointer press elsewhere is the reader
   * reaching for something else.
   */
  const close = useCallback((refocus: boolean) => {
    if (refocus) triggerRef.current?.focus();
    setOpen(false);
  }, []);
  const onPopoverClose = useCallback((reason: PopoverCloseReason) => close(reason === "escape"), [close]);
  const applyDraft = useCallback(
    (next: BuildFilterState) => {
      // One `pushState`, so Back undoes the whole visit to the sheet at once.
      write(applyFilterDraft(next, options));
      close(true);
    },
    [options, write, close],
  );

  const onTierChange = useCallback((next: ProgressionTierLike | null) => {
    setBoot((b) => ({ ...b, tier: next }));
  }, []);

  const view: ListingView = useMemo(
    () => ({ focusAxes: urlState.goodAt as RatingAxis[], tier }),
    [urlState.goodAt, tier],
  );

  const legendOf = (group: FilterGroup) =>
    group === "class" ? strings.classesLabel : (groups.find((g) => g.group === group)?.legend ?? group);
  const labelFor = (group: FilterGroup, value: string) =>
    group === "class"
      ? (classOptions?.find((o) => o.value === value)?.label ?? value)
      : (groups.find((g) => g.group === group)?.options.find((o) => o.value === value)?.label ?? value);

  const count = visible.length;
  const resultText = fill(count === 1 ? strings.resultsOne : strings.resultsMany, { count });
  const advanced = advancedCount(urlState);
  const applied = FILTER_GROUPS.flatMap((group) =>
    urlState[group].map((value) => ({ group, value, label: labelFor(group, value) })),
  );

  const sortLabels: Record<SortKey, string> = {
    recommended: strings.sortRecommended,
    stage: strings.sortStage,
    easiest: strings.sortEasiest,
    cheapest: strings.sortCheapest,
    name: strings.sortName,
  };

  // The empty state's offers, all from the pure model over the applied state.
  const current = searchParams.toString();
  const undo = count === 0 && undoAvailable(log, current ? `?${current}` : "");
  const zeroing = count === 0 ? zeroingGroups(rows, urlState) : [];
  const near = count === 0 ? nearBuilds(rows, urlState) : null;
  const groupNames = (list: readonly FilterGroup[]) => list.map(legendOf).join(", ");

  const groupsPanel = (
    <FilterGroups
      groups={groups}
      state={urlState}
      counts={counts}
      idPrefix={`${panelId}-pop`}
      onToggle={toggle}
      note={strings.goodAtNote}
      className="grid gap-x-8 gap-y-1 md:grid-cols-2"
    />
  );

  const actionClass =
    "inline-flex min-h-8 items-center rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink";

  return (
    <div data-filters="" {...(ready ? { "data-filters-ready": "" } : {})} className="space-y-4">
      <ListingContext value={view}>
        {/*
          The controls, over a single hairline. Hierarchy is carried by weight:
          the class chips are the one bold row, everything on the second row is
          text-weight, and the border below is the only box on the page above
          the cards.
        */}
        <section aria-label={strings.regionLabel} className="border-b border-border pb-4">
          {classOptions && (
            <div
              ref={chipsRef}
              role="group"
              aria-label={strings.classesLabel}
              data-class-chips=""
              // `relative`, so a chip's `offsetLeft` is measured from this
              // row and `centreChip` scrolls to the chip rather than to the
              // chip plus the row's own distance from the page edge.
              className={cn(
                "chip-row relative -mx-5 -my-1 flex gap-2 overflow-x-auto px-5 py-1 sm:-mx-1 sm:flex-wrap sm:px-1",
                chipsOverflow && "chip-row-fade",
              )}
            >
              {classOptions.map((option) => {
                const pressed = urlState.class.includes(option.value);
                const n = counts.class?.[option.value] ?? 0;
                return (
                  <ClassChip
                    key={option.value}
                    slug={option.value}
                    label={option.label}
                    count={n}
                    pressed={pressed}
                    // A pressed chip is never disabled, whatever its count.
                    disabled={!pressed && n === 0}
                    onClick={() => {
                      toggle("class", option.value);
                      if (!pressed) centreChip(option.value);
                    }}
                  />
                );
              })}
            </div>
          )}

          {/*
            The second row. From `sm` up one wrapping flex line: the stage
            picker's legend and chips, "More filters", the sort, the count
            pushed right; the stage's help sentence, the sort note and the
            applied chips take whole lines at the end. Below `sm` the picker
            is a block (legend, scrolling chips, sentence) over a tools line.
          */}
          <div className={cn(classOptions && "mt-3", "sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2")}>
            <StagePicker
              tiers={tiers}
              tier={tier}
              onChange={onTierChange}
              strings={{
                legend: strings.stageLegend,
                mine: strings.stageMine,
                clear: strings.stageClear,
                clearLabel: strings.stageClearLabel,
                help: strings.stageHelp,
                announce: strings.stageAnnounce,
              }}
            />

            {/*
              The phone's tools line. `gap-x-3`, because at 320px "Filters",
              the sort and "53 builds" measure 272px against the 280 the
              container leaves, and one more gap step puts the count on a
              line of its own. From `sm` up the wrapper dissolves into the
              row above and its gap no longer applies.
            */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 sm:contents">
              <div className="relative">
                <button
                  ref={triggerRef}
                  type="button"
                  data-more-filters=""
                  aria-expanded={open}
                  aria-haspopup="dialog"
                  aria-controls={panelId}
                  onClick={() => (open ? close(false) : setOpen(true))}
                  className="inline-flex min-h-8 items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {/*
                    Two names, one exposed: `display: none` takes a node out
                    of the accessibility tree. On a phone the class chips are
                    not "more" of anything a reader has opened, so the trigger
                    is simply "Filters".
                  */}
                  <span className="sm:hidden">{strings.showFilters}</span>
                  <span className="hidden sm:inline">{strings.moreFilters}</span>
                  {/*
                    The badge counts what the disclosure holds, not
                    `activeCount`: a class ticked in the always-visible row is
                    not something the reader has to open a panel to find, and
                    a badge that counted it would open onto nothing ticked.
                  */}
                  {advanced > 0 && (
                    <Badge tone="ember">
                      <span data-badge="">{advanced}</span>
                    </Badge>
                  )}
                </button>
                {open && !narrow && (
                  <FilterPopover id={panelId} label={strings.sheetTitle} triggerRef={triggerRef} onClose={onPopoverClose}>
                    {groupsPanel}
                  </FilterPopover>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/*
                  Visible from `sm` up; on a phone the tools line has 280px to
                  hold this, "Filters" and the count, and the word is the one
                  thing on it the select's own value already implies.
                */}
                <label htmlFor={sortId} className="text-sm text-ink-subtle sr-only sm:not-sr-only">
                  {strings.sortLabel}
                </label>
                {/*
                  A native `<select>` drawn as text: the picker is the
                  platform's, the keyboard is the platform's, and only the
                  closed control is styled. `scheme-dark` so the open list
                  matches the page instead of flashing white;
                  `field-sizing-content` so the box hugs the chosen word
                  rather than the widest option, which put the glyph half a
                  row away from "Recommended" — a browser without it falls
                  back to the wide box, and nothing else changes.
                */}
                <span className="relative inline-flex items-center">
                  <select
                    id={sortId}
                    data-sort=""
                    value={urlState.sort}
                    onChange={(e) => write({ ...urlState, sort: e.target.value as SortKey })}
                    className="min-h-8 cursor-pointer appearance-none rounded bg-transparent py-1 pr-4 pl-1 text-sm text-ink transition-colors field-sizing-content scheme-dark hover:bg-surface-raised"
                  >
                    {SORT_KEYS.map((key) => (
                      <option key={key} value={key} disabled={key === "stage" && tier === null}>
                        {sortLabels[key]}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden className="pointer-events-none absolute right-0 text-sm text-ink-muted">
                    ▾
                  </span>
                </span>
                <button
                  type="button"
                  data-sort-help=""
                  aria-expanded={helpOpen}
                  aria-controls={noteId}
                  aria-label={strings.sortHelpLabel}
                  onClick={() => setHelpOpen((v) => !v)}
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full border text-xs transition-colors",
                    helpOpen
                      ? "border-ember text-ember"
                      : "border-border text-ink-subtle hover:border-border-strong hover:text-ink",
                  )}
                >
                  ?
                </button>
              </div>

              <p data-results="" aria-live="polite" className="ml-auto text-sm text-ink-subtle">
                {resultText}
              </p>
            </div>

            {helpOpen && (
              <div
                id={noteId}
                data-sort-note=""
                className="mt-2 space-y-1 text-xs text-ink-subtle sm:order-last sm:mt-0 sm:basis-full"
              >
                <p>{strings.sortHelpRecommended}</p>
                <p>{strings.sortHelpStage}</p>
              </div>
            )}

            {applied.length > 0 && (
              <div
                data-applied=""
                className="mt-3 flex flex-wrap items-center gap-2 sm:order-last sm:mt-0 sm:basis-full"
              >
                <span className="text-xs tracking-wide text-ink-subtle uppercase">{strings.activeLabel}</span>
                {applied.map((chip) => (
                  <button
                    key={`${chip.group}-${chip.value}`}
                    type="button"
                    data-group={chip.group}
                    data-value={chip.value}
                    onClick={() => toggle(chip.group, chip.value)}
                    aria-label={fill(strings.removeOne, { filter: chip.label })}
                    className="inline-flex min-h-6 items-center gap-1.5 rounded bg-surface-overlay px-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {chip.label}
                    <span aria-hidden>✕</span>
                  </button>
                ))}
                {activeCount(urlState) >= 2 && (
                  <button
                    type="button"
                    data-clear-all=""
                    onClick={clearAll}
                    className="text-xs font-medium text-ember underline-offset-2 transition-colors hover:text-ember-bright hover:underline"
                  >
                    {strings.clearAll}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/*
          Mounted only while it is open, so a shut sheet leaves nothing in the
          accessibility tree — and `narrow` is required as well as `open`, so a
          click that reaches the trigger above `sm` opens the popover and can
          never lock the scroll of a page the sheet would not cover.
        */}
        {open && narrow && (
          <MobileFilterSheet
            applied={urlState}
            groups={groups}
            options={options}
            rows={rows}
            labelledBy={panelId}
            note={strings.goodAtNote}
            onApply={applyDraft}
            onCancel={() => close(true)}
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
          that filters every build away still shows its levelling card. The
          empty state sits below it rather than replacing it, because "no
          builds match" and "there is nothing on this page" are different
          messages.
        */}
        {(count > 0 || leading) && (
          <ul className={listClassName}>
            {leading && <li>{leading}</li>}
            {visible.map((row) => (
              <li key={row.slug}>{cardBySlug.get(row.slug)}</li>
            ))}
          </ul>
        )}

        {count === 0 && (
          <div data-empty="" className="rounded-lg border border-border bg-surface p-6 text-center">
            <p className="font-display text-base text-ink">{strings.emptyTitle}</p>
            <p className="mx-auto mt-1.5 max-w-prose text-sm text-pretty text-ink-muted">{strings.emptyBody}</p>
            {/*
              Three offers, each honest about what it does. "Remove last" is
              undo and exists only while the top of this session's log is the
              current address; "Remove {group}" names the group — or the
              groups, in order — whose removal brings builds back, and empties
              exactly those; "Clear all" is what it says.
            */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {undo && (
                <button type="button" data-remove-last="" onClick={() => window.history.back()} className={actionClass}>
                  {strings.removeLast}
                </button>
              )}
              {zeroing.length > 0 && (
                <button
                  type="button"
                  data-remove-group=""
                  data-group={zeroing.join(",")}
                  onClick={() => {
                    const next = { ...urlState };
                    for (const group of zeroing) next[group] = [];
                    write(next);
                  }}
                  className={actionClass}
                >
                  {fill(strings.removeGroup, { group: groupNames(zeroing) })}
                </button>
              )}
              <button type="button" data-clear-all="" onClick={clearAll} className={actionClass}>
                {strings.clearAll}
              </button>
            </div>
            {near && near.rows.length > 0 && (
              <div data-near="" className="mt-5 border-t border-border pt-4 text-left">
                <p className="text-xs tracking-wide text-ink-subtle uppercase">
                  {fill(strings.nearTitle, { group: groupNames(near.ignoring) })}
                </p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {near.rows.map((row) => (
                    <li key={row.slug}>
                      <Link
                        href={routes(locale).build(row.classSlug, row.slug)}
                        className="text-sm text-ember underline-offset-2 hover:text-ember-bright hover:underline"
                      >
                        {row.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </ListingContext>
    </div>
  );
}
