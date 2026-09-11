"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { trapTarget } from "@/lib/focus-trap";
import { lockScroll } from "@/lib/scroll-lock";
import {
  facetCounts,
  filterBuilds,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
  type OptionSets,
} from "@/lib/builds/filter";
import {
  clearFilterDraft,
  cloneFilterState,
  toggleDraftValue,
} from "@/lib/builds/filter-sheet";
import { FilterGroups, type FilterGroupView } from "./filter-groups";

/**
 * The advanced filter groups, below `sm`, as a modal bottom sheet.
 *
 * **Why a sheet at all.** The groups used to expand inline above the results.
 * Five of them is most of a phone screen, so the listing was pushed out of view
 * by the act of deciding how to narrow it, and then re-rendered underneath on
 * every tick — the exact motion a reader opens a filter panel to stop.
 *
 * **Why the selections are a draft.** Each tick used to write `pushState`, so
 * four choices left four entries between the reader and the page they arrived
 * from, and Back walked out of them one at a time. Here the count in the
 * primary action follows every tick while the page and the URL stay where they
 * were, and Apply writes one entry. Escape, the close control and the backdrop
 * discard; reopening starts from what is applied, not from what was abandoned.
 *
 * **Why it is genuinely modal.** It lays a scrim over the page that swallows
 * every pointer event. A mouse user cannot reach what is behind it, so a
 * keyboard user must not either: `aria-modal="true"`, focus into the sheet on
 * open, Tab and Shift+Tab contained by `trapTarget`, the document held still by
 * `lockScroll`, and focus back on the trigger on the way out. That is the same
 * contract `components/game/skill-tree-interactive.tsx` settled on, and the
 * same two helpers, rather than a second opinion about what modal means.
 *
 * **What it holds, since Phase 3: the four advanced groups and nothing else**
 * (R-FILT-12). The class chips and the stage picker are always on the page,
 * above the results, on both layouts. A class chip inside a draft would be the
 * one control whose tick is not a decision, and a stage picker inside a modal
 * would hide a preference behind Apply. So the sheet renders `FilterGroups` —
 * the same disclosures the desktop popover shows — over the **draft**, with
 * the draft's own conditional counts: every option says what the sheet would
 * list with it ticked, a `0` is disabled, and the number in the primary action
 * is the same `filterBuilds` the listing renders from (R-FILT-4, "também
 * dentro da sheet"). The rows are the parent's; the sheet only holds a state.
 *
 * **Nothing here moves.** The site ships no animation, so a sheet that slid up
 * would be a new visual language rather than the established one — and it would
 * be the one piece of motion a `prefers-reduced-motion` reader has to opt out
 * of. There is nothing to disable because there is nothing to disable, and
 * `scripts/mobile-filter-sheet.test.ts` measures that from computed style so it
 * stays that way.
 *
 * It is mounted only while open, so a closed sheet leaves nothing in the
 * accessibility tree and nothing in the prerendered HTML.
 */

export interface MobileFilterSheetStrings {
  /** The sheet's heading, and its accessible name. */
  title: string;
  /** Accessible name of the ✕ in the header. */
  close: string;
  /** The secondary action beside Apply. Discards, like Escape. */
  cancel: string;
  /** Empties the draft's advanced groups. The class chips are outside the sheet. */
  clear: string;
  /** `Show {count} build`. */
  showOne: string;
  /** `Show {count} builds`. */
  showMany: string;
}

export function MobileFilterSheet({
  applied,
  groups,
  options,
  rows,
  strings,
  note,
  labelledBy,
  onApply,
  onCancel,
}: {
  /** The state the page is currently rendering from. The draft starts as a copy. */
  applied: BuildFilterState;
  groups: FilterGroupView[];
  options: OptionSets;
  /** Every row the listing was built from — what the counts and the guarded toggle are computed over. */
  rows: readonly BuildRow[];
  strings: MobileFilterSheetStrings;
  note?: string;
  /** The id the parent gave the sheet, so the trigger's `aria-controls` resolves. */
  labelledBy: string;
  /** Commits the draft. Exactly one history entry, written by the parent. */
  onApply: (next: BuildFilterState) => void;
  /** Discards. Escape, the close control and the backdrop all land here. */
  onCancel: () => void;
}) {
  /*
   * Mounting *is* opening — the parent renders this only while the sheet is
   * open — so the draft is seeded once, from the applied state, and reopening
   * cannot inherit an abandoned one. `cloneFilterState` copies every group
   * array, which is what keeps a tick in here from reaching the page out there.
   */
  const [draft, setDraft] = useState(() => cloneFilterState(applied));
  const sheetRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  /*
   * The primary action says what applying the draft *would* produce, and the
   * rows say what each option would add to that — both from the same pure
   * functions the listing renders from, rather than from an estimate.
   */
  const count = useMemo(() => filterBuilds(rows, draft).length, [rows, draft]);
  const counts = useMemo(() => facetCounts(rows, draft), [rows, draft]);

  /*
   * The effect below runs once, for the life of the open sheet, and reads the
   * cancel handler through a ref rather than depending on it. Depending on it
   * would re-run the whole thing on every render — so every tick would release
   * and retake the scroll lock and drag focus back to the close control, out of
   * the group the reader was working through.
   */
  const cancelRef = useRef(onCancel);
  useEffect(() => {
    cancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    // Hold the page still. Without this a drag that starts inside the sheet's
    // own scrolling body and runs past its end carries into the listing behind,
    // which slides away while the reader is choosing how to filter it.
    const unlock = lockScroll(document.body);

    // The first thing a screen-reader user needs is the way out, and the close
    // control is a stable target whatever the groups happen to be.
    const focusables = () =>
      [
        ...sheet.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.offsetParent !== null || el === document.activeElement);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const target = trapTarget(
        items.length,
        items.indexOf(document.activeElement as HTMLElement),
        e.shiftKey,
      );
      if (target === null) return;
      e.preventDefault();
      items[target].focus();
    };
    // Capture, so nothing between here and the document can swallow it first.
    document.addEventListener("keydown", onKey, true);

    // One cleanup for both halves: React runs it when the sheet closes and when
    // the tree unmounts, which is every way out of a locked page.
    return () => {
      document.removeEventListener("keydown", onKey, true);
      unlock();
    };
  }, []);

  // `toggleDraftValue` is `toggleKeepingResults` plus a clone: an un-tick
  // inside the draft follows the same reconciliation the live surfaces do, so
  // a draft can never apply as the empty list the counts exist to prevent.
  const toggle = (group: FilterGroup, value: string) =>
    setDraft((d) => toggleDraftValue(d, group, value, options[group] ?? [], rows));

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-abyss/60 sm:hidden"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        id={labelledBy}
        role="dialog"
        aria-modal="true"
        aria-label={strings.title}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-xl border-t border-border bg-surface-raised sm:hidden"
      >
        {/* A fixed header the body scrolls under, so long copy cannot push the
            way out of reach. */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 id={headingId} className="font-display text-sm text-ink">
            {strings.title}
          </h2>
          <button
            type="button"
            data-close
            onClick={onCancel}
            aria-label={strings.close}
            className="rounded border border-border px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <FilterGroups
          groups={groups}
          state={draft}
          counts={counts}
          idPrefix={`${headingId}-sheet`}
          onToggle={toggle}
          note={note}
          className="grid min-h-0 grow content-start gap-y-1 overflow-y-auto px-4 py-3"
        />

        <div className="flex shrink-0 items-center gap-3 border-t border-border px-4 py-3">
          <button
            type="button"
            data-clear
            onClick={() => setDraft((d) => clearFilterDraft(d))}
            className="text-sm font-medium text-ember underline-offset-2 hover:text-ember-bright hover:underline"
          >
            {strings.clear}
          </button>
          <button
            type="button"
            data-cancel
            onClick={onCancel}
            className="ml-auto rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
          >
            {strings.cancel}
          </button>
          <button
            type="button"
            data-apply
            onClick={() => onApply(draft)}
            className="rounded-md border border-ember-dim bg-ember-dim/25 px-3 py-2 text-sm font-medium text-ember-bright transition-colors hover:bg-ember-dim/40"
          >
            {(count === 1 ? strings.showOne : strings.showMany).replace("{count}", String(count))}
          </button>
        </div>
      </div>
    </>
  );
}
