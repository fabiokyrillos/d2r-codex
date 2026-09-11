"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/components/ui";
import { clearTier, writeTier, type ProgressionTierLike } from "@/lib/prefs";

/**
 * "Where are you?" on a listing — the third writer of `d2rc.tier`, and the
 * only control on the page that is not a filter (R-FILT-2).
 *
 * It is the build page's tier control, recognisably: the same mono number in
 * ember, the same Cinzel name, the same bordered chip that fills with ember
 * when pressed, the same one-tab-stop keyboard model. What it does is
 * different, and the difference is the whole point of PRD §7.1: the tier is a
 * **preference**, not a filter. Choosing one writes `localStorage` through
 * `lib/prefs` and tells the listing; the listing enables the "For my stage"
 * sort and puts a line on every card. It never touches the URL, never adds a
 * history entry, never removes a build and never moves a count — a preference
 * that filtered would be a second, silent filter the link does not carry, and
 * `scripts/filters-desktop.test.ts` presses this control and checks every one
 * of those things did not happen (mutation M2).
 *
 * That is also why it is controlled from outside. `tier` is the listing's
 * state — read from storage once, in an effect, after the first render — and
 * this component only reports a change. The listing is what has to react (the
 * sort options, the cards), so the listing owns the value.
 *
 * `writeTier`/`clearTier` are called here and nowhere else in this directory;
 * `scripts/hygiene.test.ts` keeps a named allowlist of the files that may.
 * The level range the build page shows under each tier is deliberately absent:
 * it varies per build, and a listing spans fifty of them.
 *
 * **Keyboard.** A roving tabindex, as on the build page: Tab lands on the
 * pressed chip (or the first), arrows move inside the group, Home and End go
 * to the ends, and moving focus never moves the page. The `role="status"`
 * region speaks only a confirmed selection — never focus movement, never a
 * load — so arrowing through six chips is not six announcements.
 *
 * It exists only in the hydrated tree. The static HTML has no way to store a
 * preference, so it carries no control that pretends to (R-PREF-4).
 */

export interface StageOption {
  slug: ProgressionTierLike;
  /** The full name, for the tablet up and for screen readers. */
  label: string;
  /** The short name a phone shows. Equal to `label` where there is no short form. */
  short: string;
}

export interface StagePickerStrings {
  /** "Where are you?" */
  legend: string;
  /** "My stage: {tier}" */
  mine: string;
  clear: string;
  clearLabel: string;
  /** The one-sentence promise that the preference does not filter. */
  help: string;
  /** "My stage: {tier}." — spoken on a confirmed selection. */
  announce: string;
}

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");

export function StagePicker({
  tiers,
  tier,
  onChange,
  strings,
}: {
  tiers: StageOption[];
  /** The saved preference, owned by the listing. */
  tier: ProgressionTierLike | null;
  onChange: (tier: ProgressionTierLike | null) => void;
  strings: StagePickerStrings;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [announcement, setAnnouncement] = useState("");
  /*
   * Whether the chip row overflows, measured — the fade is a mask, and a mask
   * clips the focus ring at the row's edges, so it is only worn when there is
   * something off screen to hint at. Whether six chips overflow depends on
   * the language ("Início do Hell" against "Hell") and on the text size.
   */
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => setOverflows(row.scrollWidth > row.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  /** Keeps a chip in view horizontally, and only horizontally. */
  const centre = useCallback((slug: string) => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-tier="${slug}"]`);
    if (!row || !chip) return;
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, []);

  const select = useCallback(
    (slug: ProgressionTierLike) => {
      // Re-pressing the pressed chip is idempotent: "show me my stage again"
      // must not mean "forget my stage".
      writeTier(slug);
      onChange(slug);
      const option = tiers.find((t) => t.slug === slug);
      if (option) setAnnouncement(fill(strings.announce, { tier: option.label }));
      centre(slug);
    },
    [tiers, onChange, strings.announce, centre],
  );

  const clear = useCallback(() => {
    /*
     * Move focus before the button unmounts. "Clear" renders only while a
     * preference exists, so pressing it removes the focused element and the
     * browser would drop focus to `body`, dumping a keyboard reader at the top
     * of the document. The chip they had chosen is the right place to land.
     */
    const chip = tier ? rowRef.current?.querySelector<HTMLElement>(`[data-tier="${tier}"]`) : null;
    (chip ?? rowRef.current?.querySelector<HTMLElement>("[data-tier]"))?.focus({ preventScroll: true });
    clearTier();
    onChange(null);
    setAnnouncement("");
  }, [tier, onChange]);

  /** Roving tabindex: one stop into the group, arrows inside it. */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      const row = rowRef.current;
      if (!row) return;
      const chips = [...row.querySelectorAll<HTMLElement>("[data-tier]")];
      const here = chips.indexOf(document.activeElement as HTMLElement);
      if (here < 0) return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? chips.length - 1
            : (here + (event.key === "ArrowRight" ? 1 : -1) + chips.length) % chips.length;
      // preventScroll, because moving focus is not a request to move the page.
      chips[next]?.focus({ preventScroll: true });
      const slug = chips[next]?.dataset.tier;
      if (slug) centre(slug);
    },
    [centre],
  );

  const chosen = tiers.find((t) => t.slug === tier) ?? null;
  const legend = chosen ? fill(strings.mine, { tier: chosen.label }) : strings.legend;

  /*
   * `sm:contents` on the root and on the legend line: from the tablet up the
   * legend, the clear control, the chips and the help sentence are direct
   * children of the listing's second row, so they sit inline with "More
   * filters", the sort and the count. Below it the root is an ordinary block
   * — a legend line, a scrolling row of chips, a sentence — stacked above the
   * tools line. The `data-stage-picker` root keeps its DOM nesting either
   * way, which is what the gates scope their queries by.
   */
  return (
    <div data-stage-picker className="sm:contents">
      <div className="flex flex-wrap items-baseline gap-x-3 sm:contents">
        <p id="stage-legend" className="text-sm text-ink">
          {legend}
        </p>
        {tier && (
          <button
            type="button"
            data-clear-tier=""
            aria-label={strings.clearLabel}
            onClick={clear}
            className="text-sm text-ink-subtle transition-colors hover:text-ink-muted"
          >
            {strings.clear}
          </button>
        )}
      </div>

      <div
        ref={rowRef}
        role="group"
        aria-labelledby="stage-legend"
        onKeyDown={onKeyDown}
        className={cn(
          // `relative`, so `offsetLeft` is measured from this row and
          // `centre` scrolls to the chip, not to the chip plus the row's
          // distance from the page edge.
          "chip-row relative -mx-5 mt-1 -mb-1 flex gap-1.5 overflow-x-auto px-5 py-1 sm:-mx-1 sm:-my-1 sm:flex-wrap sm:px-1",
          overflows && "chip-row-fade",
        )}
      >
        {tiers.map((option, index) => {
          const pressed = option.slug === tier;
          return (
            <button
              key={option.slug}
              type="button"
              data-tier={option.slug}
              aria-pressed={pressed}
              tabIndex={pressed || (!tier && index === 0) ? 0 : -1}
              onClick={() => select(option.slug)}
              className={cn(
                "tier-chip inline-flex min-h-11 shrink-0 items-center gap-2 rounded border px-2.5 text-left transition-colors",
                pressed
                  ? "border-ember bg-ember-dim/10"
                  : "border-border hover:border-ink-subtle hover:bg-surface-raised",
              )}
            >
              <span aria-hidden="true" className="font-mono text-xs text-ember">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/*
                The short form is the visible one at every width, and the long
                form is the accessible name; one span when the two are the
                same word, so a screen reader never hears "Econômico
                Econômico". The build page shows the long form from `sm` up;
                this row cannot. It shares a line with "More filters", the
                sort and the count, and with the long names it measures
                1,381px in pt-BR against the 1,216px the widest layout has —
                so it would wrap at every width there is, on the widest
                screens included. The short forms are the community's own
                words (NM, Hell, BiS), the reader has seen them on the build
                page, and the legend says the long one back the moment a
                stage is chosen.
              */}
              {option.label === option.short ? (
                <span className="font-display text-sm text-ink">{option.label}</span>
              ) : (
                <>
                  <span aria-hidden="true" className="font-display text-sm text-ink">
                    {option.short}
                  </span>
                  <span className="sr-only">{option.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/*
        The one sentence that keeps the preference from being read as a
        filter, shown from the moment there is a preference. That is when the
        question arises — the reader has just pressed a chip and the list did
        not shrink — and before it the legend is a question that explains
        itself. Rendering it always would cost every phone reader two lines
        of the fold for a caveat about a control they have not used.
      */}
      {tier && (
        <p className="mt-2 text-xs text-ink-subtle sm:order-last sm:mt-0 sm:basis-full">{strings.help}</p>
      )}

      {/* Spoken only on a confirmed selection — never on load, never on focus. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
