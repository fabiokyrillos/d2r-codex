"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  applyTierState,
  anchorOffsetPx,
  clearTier,
  readTier,
  resolveActiveTier,
  tierAnchorHref,
  tierAnchorId,
  tierFromHash,
  writeTier,
  type ProgressionTierLike,
} from "@/lib/prefs";

/**
 * "Where are you?" — the one control that writes the tier preference.
 *
 * This is the whole client surface of Phase 1. Everything it needs arrives as
 * six serialisable records and eight strings; the tiers themselves, all
 * sixteen thousand pixels of them, stay on the server and are never imported
 * here. That is the difference between a six-button island and shipping the
 * catalogue to the browser.
 *
 * **Why it swaps elements instead of rendering the final ones.**
 * Without JavaScript the control has to be six links — that is the navigation
 * half of R-BUILD-1, and it is in the served HTML for every reader. With
 * JavaScript it has to be six toggle buttons, because `aria-pressed` is
 * invalid on a link and `role="button"` on an `<a href>` removes it from the
 * links list and breaks Space. Rendering the buttons directly would be a
 * hydration mismatch; rendering both and hiding one would ship six duplicate
 * accessible names. So the first client render is byte-identical to the
 * server's, and a layout effect flips `enhanced` afterwards. React only ever
 * compares the *first* render, so the swap is an ordinary state update.
 *
 * **Why a layout effect and not `useEffect`.**
 * On a soft navigation from `/builds` — which is how most readers arrive —
 * the inline boot script does not run: Next inserts it through a DOM update,
 * and inserted scripts do not execute. The RSC payload carries all six tiers
 * open, because that is R-BUILD-12. A `useEffect` would let that paint and
 * then collapse it, dropping sixteen thousand pixels after the fact. A layout
 * effect runs after the commit and before paint, so there is no such frame.
 *
 * **Why it never controls `open`.**
 * `components/layout/mobile-navigation.tsx` documents this repository trying
 * exactly that and reverting it: `toggle` is queued rather than dispatched
 * during the press, so any React copy of the state is one task stale. The
 * elements are the source of truth; this writes `open` on them directly, and
 * a reader who opens a second tier by hand keeps both open.
 */

export interface TierOption {
  slug: ProgressionTierLike;
  label: string;
  short: string;
  from: number;
  to: number;
}

export interface TierSelectorStrings {
  legend: string;
  myTier: string;
  announce: string;
  goToGear: string;
  clear: string;
  clearLabel: string;
  levelsRange: string;
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

export function TierSelector({ tiers, strings }: { tiers: TierOption[]; strings: TierSelectorStrings }) {
  /*
   * One state object rather than three.
   *
   * `enhanced`, `preferred` and `active` always change together, and the
   * enhancement effect below sets all three at once — as separate states that
   * would be three synchronous updates inside one effect, which is what
   * React's cascading-render rule is about.
   */
  interface View {
    enhanced: boolean;
    preferred: ProgressionTierLike | null;
    active: ProgressionTierLike | null;
  }
  const [view, setView] = useState<View>({ enhanced: false, preferred: null, active: null });
  const { enhanced, preferred, active } = view;
  const [announcement, setAnnouncement] = useState("");
  /*
   * Whether the chip row actually overflows.
   *
   * The fade is a mask, and a mask clips the 2px focus ring at the row's
   * edges — so it is only worth wearing when there is something off screen to
   * hint at. Measured rather than assumed from a breakpoint, because whether
   * six chips overflow depends on the language: "Início do Hell" is fourteen
   * characters and "Hell" is four.
   */
  const [overflows, setOverflows] = useState(false);
  const rowRef = useRef<HTMLDivElement | null>(null);

  /** Re-reads storage and the hash, and puts the six disclosures in step. */
  const sync = useCallback(() => {
    const resolved = resolveActiveTier({ hash: window.location.hash, stored: readTier() });
    setView({ enhanced: true, preferred: resolved.preferred, active: resolved.active });
    applyTierState(document);
  }, []);

  /*
   * Before paint, and deliberately synchronous.
   *
   * This is the enhancement itself: the server rendered six links, and this is
   * the render that turns them into six toggle buttons. It has to be one
   * extra render — that is what progressive enhancement *is* — and it has to
   * happen in a layout effect rather than `useEffect`, because on a soft
   * navigation from /builds the boot script never runs and a post-paint
   * collapse would drop sixteen thousand pixels after the reader has seen it.
   *
   * eslint-disable, with the reason: the "cascading renders" rule is about
   * effects that set state in a loop or in response to their own output. This
   * sets it exactly once, from a source that cannot be read during render.
   */
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    sync();
  }, [sync]);

  /* Re-measured on resize, because the row wraps from 640px and stops scrolling. */
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => setOverflows(row.scrollWidth > row.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [enhanced]);

  /*
   * Back and forward between anchors, and the in-Gear mirror.
   *
   * Two things happen here, and the second one is not optional.
   *
   * Landing on an empty or unknown fragment deliberately leaves the
   * disclosures alone: collapsing content because the reader pressed Back
   * would move the page under them.
   *
   * Landing on a *tier* fragment has to re-align afterwards. The browser
   * begins its jump to the anchor, and then this handler collapses the other
   * five tiers — so the document shrinks by thousands of pixels underneath a
   * scroll that was already in flight, and the reader arrives nowhere near
   * what they asked for. Measured before this was here: tapping "Optimized"
   * in the sticky mirror left its heading 6,757px below the viewport.
   *
   * Re-aligning is sanctioned movement, not automatic movement: the reader
   * activated an anchor, and R-BUILD-2 allows "the browser's own jump to the
   * anchor". It happens once, after the collapse, with the same offset the
   * boot script uses.
   */
  useEffect(() => {
    const onHash = () => {
      const target = tierFromHash(window.location.hash);
      /*
       * Nothing at all for a fragment that is not a tier, and Back is the
       * common case: `sync()` re-resolves with an empty hash, falls back to
       * the stored preference, and collapses whatever the reader was reading
       * in order to open something else — measured at up to 3,825px of
       * displacement on an ordinary Back press.
       */
      if (!target) return;
      sync();
      const el = document.getElementById(tierAnchorId(target));
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - anchorOffsetPx(window.innerWidth);
      window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [sync]);

  /** Keeps the pressed chip in view horizontally, and only horizontally. */
  const centre = useCallback((slug: string) => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-tier="${slug}"]`);
    if (!row || !chip) return;
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, []);

  const select = useCallback(
    (slug: ProgressionTierLike) => {
      // Re-activating the pressed control is idempotent, never destructive:
      // with a hash pointing elsewhere the pressed chip is not the shown one,
      // and "show me my tier again" must not mean "forget my tier".
      writeTier(slug);
      setView({ enhanced: true, preferred: slug, active: slug });
      for (const t of tiers) {
        const el = document.getElementById(tierAnchorId(t.slug));
        if (el) (el as HTMLDetailsElement).open = t.slug === slug;
      }
      const option = tiers.find((t) => t.slug === slug);
      if (option) {
        setAnnouncement(fill(strings.announce, { tier: option.label, from: option.from, to: option.to }));
      }
      centre(slug);
    },
    [tiers, strings.announce, centre],
  );

  const clear = useCallback(() => {
    /*
     * Move focus before the button unmounts.
     *
     * "Clear" only renders while a preference exists, so pressing it removes
     * the focused element and the browser drops focus to `body` — a keyboard
     * reader is dumped to the top of the document and Tabs again from the
     * header. The chip they came from is the right place to land.
     */
    const chip = preferred
      ? rowRef.current?.querySelector<HTMLElement>(`[data-tier="${preferred}"]`)
      : null;
    (chip ?? rowRef.current?.querySelector<HTMLElement>("[data-tier]"))?.focus({ preventScroll: true });
    clearTier();
    setView({ enhanced: true, preferred: null, active: null });
    setAnnouncement("");
    for (const t of tiers) {
      const el = document.getElementById(tierAnchorId(t.slug));
      if (el) (el as HTMLDetailsElement).open = false;
    }
  }, [tiers, preferred]);

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

  const activeOption = tiers.find((t) => t.slug === preferred) ?? null;
  const legend = activeOption
    ? fill(strings.myTier, { tier: activeOption.label, from: activeOption.from, to: activeOption.to })
    : strings.legend;

  const chipClass =
    "tier-chip flex min-h-11 min-w-[5.5rem] shrink-0 flex-col justify-center gap-0.5 rounded border border-border px-3 py-2 text-left transition-colors hover:border-ink-subtle hover:bg-surface-raised";

  const body = tiers.map((tier) => {
    const isPreferred = tier.slug === preferred;
    const isActive = tier.slug === active;
    const shared = {
      "data-tier": tier.slug,
      className: `${chipClass} ${isPreferred ? "border-ember bg-ember-dim/10" : ""}`,
      children: (
        <>
          <span aria-hidden="true" className="font-mono text-xs text-ember">
            {String(tiers.indexOf(tier) + 1).padStart(2, "0")}
          </span>
          {/*
            One span when the two forms are the same word, two when they are
            not. `budgetLabel` and `budgetShort` are both "Budget" in en-US,
            and three of the six coincide in pt-BR — rendering both would have
            a screen reader say "Econômico Econômico Níveis 75–85".
          */}
          {tier.label === tier.short ? (
            <span className="font-display text-sm text-ink">{tier.label}</span>
          ) : (
            <>
              <span className="font-display text-sm text-ink sm:hidden">{tier.short}</span>
              <span className="font-display text-sm text-ink sr-only sm:not-sr-only">{tier.label}</span>
            </>
          )}
          <span className="text-xs text-ink-subtle">
            {fill(strings.levelsRange, { from: tier.from, to: tier.to })}
          </span>
        </>
      ),
    };

    if (!enhanced) {
      return <a key={tier.slug} href={tierAnchorHref(tier.slug)} {...shared} />;
    }
    return (
      <button
        key={tier.slug}
        type="button"
        aria-pressed={isPreferred}
        {...(isActive ? { "aria-current": "location" as const } : {})}
        tabIndex={isPreferred || (!preferred && tiers.indexOf(tier) === 0) ? 0 : -1}
        onClick={() => select(tier.slug)}
        {...shared}
      />
    );
  });

  const goToHref = active ? tierAnchorHref(active) : "#";

  return (
    <div>
      <p id="tier-picker-legend" className="text-sm font-medium text-ink">
        {legend}
      </p>

      {enhanced ? (
        <div
          ref={rowRef}
          role="group"
          aria-labelledby="tier-picker-legend"
          onKeyDown={onKeyDown}
          className={`tier-chips mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0 ${
            overflows ? "tier-chips-fade" : ""
          }`}
        >
          {body}
        </div>
      ) : (
        <nav
          ref={rowRef as React.RefObject<HTMLDivElement>}
          aria-labelledby="tier-picker-legend"
          className="tier-chips mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {body}
        </nav>
      )}

      {/*
        Always in the layout, even when empty.

        The boot script aligns to a hash before React renders anything. A row
        that mounts afterwards pushes the target down by its own height —
        measured at 32px, so a hash load settled at 104px instead of the 72px
        the offset computes. §6 row 2 calls this "espaço reservado".
      */}
      <p
        className="mt-3 flex min-h-9 flex-wrap items-center gap-x-4 gap-y-2"
        aria-hidden={!(enhanced && active)}
      >
        {enhanced && active && (
          <>
          <a
            data-go-to-gear=""
            href={goToHref}
            onClick={() => {
              // The browser's own anchor jump, nudged past the sticky mirror.
              // Not scrollIntoView: it moves the page vertically even with
              // `block: "nearest"`, and this is the one place a move is asked
              // for, so it is the one place the offset has to be right.
              const el = document.getElementById(tierAnchorId(active));
              if (!el) return;
              const y = el.getBoundingClientRect().top + window.pageYOffset - anchorOffsetPx(window.innerWidth);
              window.scrollTo(0, Math.max(0, y));
            }}
            className="text-sm font-medium text-ember hover:text-ember-bright"
          >
            {strings.goToGear}
            </a>
            {preferred && (
              <button
                data-clear-tier=""
                type="button"
                aria-label={strings.clearLabel}
                onClick={clear}
                className="text-sm text-ink-subtle hover:text-ink-muted"
              >
                {strings.clear}
              </button>
            )}
          </>
        )}
      </p>

      {/*
        Announced only on a confirmed selection — never on load, never when
        focus moves. A live region that fires on arrow keys reads the whole
        control on every keystroke.
      */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
