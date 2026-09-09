"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { trapTarget } from "@/lib/focus-trap";
import { lockScroll } from "@/lib/scroll-lock";

/**
 * "Where am I?" — the build page's table of contents, in one surface and two
 * regimes.
 *
 * The page is 18,344px tall in en-US and every one of its eleven sections is a
 * scroll away from every other. This is the only thing on it that says what is
 * below.
 *
 * **Why it ships closed and no script ever writes `open`.** It used to ship
 * `open` and let the layout effect below close it under 640px. That shipped a
 * regression, because a height change after hydration is a height change in
 * the middle of the browser's ~1.6s smooth scroll to a URL fragment, and this
 * control sits *above* the gear section. Measured at 390px on
 * `/en-us/builds/sorceress/blizzard-sorceress#gear-budget`: 162px → 38px here,
 * 21,776px → 21,652px for the document, and `#gear-budget` landing at −52px —
 * behind the sticky header — where `anchorOffsetPx(390)` promises 72px. At
 * 1280px the summary stayed open, nothing moved, and the anchor landed at
 * 112px, which is why only the phone failed and why the gate that watches this
 * (`build-tier-heights.test.ts`) did not: it asserts the landing with scripting
 * disabled, where the collapse never happens.
 *
 * The rule is therefore stronger than "do not collapse": **nothing about this
 * element's height may depend on JavaScript having run.** So it ships closed —
 * its final height at every width — and `app/globals.css` reveals the panel
 * from 640px with `::details-content { content-visibility: visible }`, on a
 * disclosure that stays closed forever at that width. Re-measured on the same
 * URL, sampling every animation frame for two seconds: 38px at 390px and 60px
 * at 1280px, `min === max === load === settled` at both, the document fixed at
 * 21,652px and 12,923px, and `#gear-budget` landing at 72px and 112px. There is
 * no "settled" value any more, because there is nothing to settle.
 *
 * The obvious alternative fails green and is worth naming, because it is what
 * the first attempt reached for: a `sm:block` on the panel does nothing. A
 * closed `<details>` hides its content with `content-visibility: hidden` on the
 * `::details-content` pseudo-element, and a `display` on a *child* cannot
 * override a `content-visibility` on an *ancestor* — measured in Chrome 151,
 * `checkVisibility()` returns false while the links are still in the markup and
 * their boxes still lay out. An HTML gate reads the links, a height gate reads
 * 36px of panel, and the row is invisible on all 106 pages.
 * `display:flex|grid|contents|block` on the `<details>` itself fail the same
 * way. Only the pseudo-element works.
 *
 * **The floor, and the degradation.** `::details-content` is Chrome 131+,
 * Safari 18.4+, Firefox 139+, and the CSS gates both halves — the reveal and
 * the `display: none` that withdraws the trigger — behind one
 * `@supports selector(::details-content)`. Below the floor at ≥640px the guard
 * fails, the trigger stays, and the reader gets a working closed native
 * disclosure: one extra click, every link still reachable, nothing that needs
 * JavaScript. Below 640px there is no floor at all, because the sheet is an
 * enhancement over exactly that disclosure.
 *
 * Both halves of that were measured rather than reasoned. The guard
 * discriminates — `CSS.supports("selector(::details-content)")` is true in
 * Chrome 151 and `selector(::not-a-real-pseudo)` is false, so an engine that
 * does not know the pseudo-element drops the block instead of half-applying it.
 * And deleting that block through CSSOM at 1280px, which is what a parser below
 * the floor does with it, leaves exactly the promised fallback: the trigger
 * comes back at `display: flex`, the box is 38px and closed, and one click
 * opens all eleven links in normal flow.
 *
 * **Why the sheet's chrome is CSS and its semantics are not.** Everything that
 * turns the panel into a bottom sheet — fixed, scrim, rounded top, the header
 * row — hangs off one `data-sheet` attribute the island writes on the
 * `<details>`. That attribute is the JavaScript gate: without it the panel
 * lands in normal flow whenever it is shown at all, which is exactly what the
 * no-JS reader gets — a revealed row from 640px, and a native disclosure that
 * opens in place below it — and it is why none of this is keyed on the
 * breakpoint alone. It costs nothing on load either way, because the attribute
 * only ever styles a panel a closed `<details>` is not rendering. What CSS
 * cannot carry is `role="dialog"`: from 640px up this same box is a plain row
 * of links, and a dialog nobody can leave, or an authored `aria-label` on the
 * generic box it is the rest of the time, would both be wrong. So the three
 * ARIA attributes are written when the sheet opens and removed when it closes.
 *
 * **Why `open` is never mirrored in React state.**
 * `components/layout/mobile-navigation.tsx` documents this repository trying
 * that and reverting it: `toggle` is queued rather than dispatched during the
 * press, so any React copy is one task stale and a reader who opens and reaches
 * straight for Escape gets nothing. The element is the source of truth here
 * too; the listeners are always attached and read `details.open` directly.
 *
 * **Three tripwires this must not trip.** No `<h2>` or `<h3>` anywhere in here
 * — `scripts/heading-snapshot.json` pins the ordered heading list of all 106
 * build pages, so one new heading fails every page at once. No `aria-current`
 * — `build-tier-state.test.ts` reads `dataset.tier` off every
 * `[aria-current="location"]`, and this is not a tier control. No `next/link`
 * for a fragment — `hygiene.test.ts` fails a routed link whose href is a
 * fragment, because that hands the scroll to the router rather than to the
 * platform, and the platform is the half that works without us.
 */

/*
 * The section ids are *not* here, and that is not an oversight.
 *
 * They belong beside the `<Section>` elements that carry them, in the page, and
 * they cannot live in this file even so: a Server Component that imports a
 * plain value from a `"use client"` module receives a client reference, not the
 * value. Measured, because it looks like it works — the page compiled, the
 * types checked, the summary rendered eleven entries — and every one of them
 * came out `href="#undefined"` while all eleven `<Section id>` attributes
 * vanished, taking the seven published anchors with them. Only
 * `scripts/build-toc-html.test.ts` saw it.
 */

export interface PageSectionEntry {
  /** The `id` of a section that actually rendered. A dead anchor is defect D2. */
  id: string;
  /** The section's own heading text, so entry and heading cannot drift apart. */
  label: string;
  /** Carries the open tier's name. At most one entry sets it. */
  showsActiveTier?: boolean;
}

/** One gear tier, as the six `[data-tier-section]` elements identify themselves. */
export interface PageSectionTier {
  slug: string;
  label: string;
}

export interface PageSectionsStrings {
  /** Names the landmark, and the sheet. */
  label: string;
  /** The `<summary>`'s own text, which is the button below 640px. */
  trigger: string;
  /** Accessible name of the sheet's dismiss control. */
  close: string;
}

/** Tailwind's `sm`, in Tailwind's own unit, so the two cannot drift. */
const DESKTOP = "(min-width: 40rem)";

/**
 * What the trap counts, and what the sheet focuses first.
 *
 * The `<summary>` is deliberately outside it: in the sheet regime it is behind
 * the scrim, and a modal that lets Tab reach the page behind it is not modal.
 */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function PageSections({
  entries,
  tiers = [],
  strings,
}: {
  entries: PageSectionEntry[];
  /** Omit on a page with no gear tiers; then no tier name is ever drawn. */
  tiers?: PageSectionTier[];
  strings: PageSectionsStrings;
}) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const [activeTier, setActiveTier] = useState<string | null>(null);

  const isSheet = () => !window.matchMedia(DESKTOP).matches;

  /**
   * The modal half, put on and taken off the panel by hand.
   *
   * By hand because CSS cannot carry it and the markup must not: from 640px up
   * this same box is a plain row of links, so a `role="dialog"` in the HTML
   * would be a dialog nobody can leave, and an authored `aria-label` on the
   * generic box it is the rest of the time is the name ARIA forbids there.
   */
  const unlockRef = useRef<(() => void) | null>(null);

  const leave = useCallback(() => {
    const panel = panelRef.current;
    if (panel) {
      panel.removeAttribute("role");
      panel.removeAttribute("aria-modal");
      panel.removeAttribute("aria-labelledby");
    }
    unlockRef.current?.();
    unlockRef.current = null;
  }, []);

  const enter = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || unlockRef.current) return;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", headingId);
    // Hold the page still: a drag that starts in the sheet and runs past its
    // end would otherwise carry into the eighteen thousand pixels behind it.
    unlockRef.current = lockScroll(document.body);
    // The way out first, which is a stable target whatever the entries are.
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [headingId]);

  /** The one way out, used by every dismissal. */
  const close = useCallback(
    (returnFocus: boolean) => {
      const details = detailsRef.current;
      if (!details?.open) return;
      details.open = false;
      /*
       * Released here rather than on the queued `toggle`. Activating an entry
       * closes the sheet *and* jumps to a fragment, and the jump happens in the
       * same task as the click — into a document whose `body` would still carry
       * `overflow: hidden` if this waited a turn.
       */
      leave();
      if (returnFocus) summaryRef.current?.focus();
    },
    [leave],
  );

  /**
   * The regime, which is now only ever about the *chrome*.
   *
   * It used to end `details.open = desktop`, and that one line was the whole
   * defect: an unconditional write, on every mount, at a moment nothing else on
   * the page can see coming. What replaces it is guarded by `details.open`, so
   * on a first load — the only case that races the browser's scroll — this
   * function writes exactly one attribute, on a panel a closed `<details>` is
   * not rendering. Nothing it does can change a height.
   *
   * Both surviving writes are responses to something a reader already did.
   * Crossing 640px with the sheet up has to take the sheet down, because a
   * modal that lands in a layout with no scrim is a page nobody can scroll. And
   * a tap on the `<summary>` that beat hydration leaves a native disclosure open
   * whose chrome this effect is about to turn into a sheet, so the semantics
   * have to catch up with it; `enter` is idempotent, so the ordinary path where
   * `toggle` got there first costs nothing.
   *
   * Still a layout effect rather than `useEffect`, for the reason
   * `components/game/tier-selector.tsx` gives: that pre-hydration tap would
   * otherwise paint the panel in flow and then snatch it into a sheet.
   *
   * Re-run on `pathname` as well as on mount, because the panel is a
   * `<details>` and a soft navigation can keep the node. That is the defect
   * `mobile-navigation.tsx` was written for — the menu that stayed open across
   * a route change while every gate agreed the markup was right.
   */
  const applyRegime = useCallback(() => {
    const details = detailsRef.current;
    if (!details) return;
    const desktop = window.matchMedia(DESKTOP).matches;
    details.toggleAttribute("data-sheet", !desktop);
    if (desktop) {
      // Crossing 640px with the sheet up takes the lock and the ARIA off too.
      // Released here rather than on the queued `toggle`, for the reason
      // `close` gives.
      if (details.open) details.open = false;
      leave();
    } else if (details.open) {
      enter();
    }
  }, [enter, leave]);

  useLayoutEffect(() => {
    applyRegime();
    const query = window.matchMedia(DESKTOP);
    query.addEventListener("change", applyRegime);
    return () => query.removeEventListener("change", applyRegime);
  }, [applyRegime, pathname]);

  /*
   * The modal half, driven by the element's own `toggle`.
   *
   * `toggle` fires after `open` has already changed, which is precisely why it
   * is the right signal: it cannot disagree with the element. Crossing 640px
   * with the sheet open lands here too, through `applyRegime`, so the lock and
   * the ARIA come off on a resize as surely as on a dismissal.
   */
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const onToggle = () => {
      if (details.open && isSheet()) enter();
      else leave();
    };

    details.addEventListener("toggle", onToggle);
    return () => {
      details.removeEventListener("toggle", onToggle);
      leave();
    };
  }, [enter, leave]);

  /*
   * Escape and the Tab trap, attached for the life of the component rather
   * than while open — the race `mobile-navigation.tsx` documents. Both return
   * on the first property read unless the sheet is actually up.
   *
   * A native `<details>` does not close on Escape; only `<dialog>` does. While
   * this one claims to be a dialog it has to behave like one.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const details = detailsRef.current;
      const panel = panelRef.current;
      if (!details?.open || !panel || !isSheet()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const target = trapTarget(
        items.length,
        items.indexOf(document.activeElement as HTMLElement),
        event.shiftKey,
      );
      if (target === null) return;
      event.preventDefault();
      items[target].focus();
    };
    // Capture, so nothing between here and the document swallows it first.
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [close]);

  /*
   * Which tier is open, read from the DOM the Phase 1 work already declares the
   * source of truth.
   *
   * Nothing is imported from `lib/prefs` — not even `readTier`. A second reader
   * of the preference would be a second resolution rule, and the reason there is
   * exactly one writer is the same reason there is exactly one rule. The `open`
   * attribute of the six `[data-tier-section]` elements answers the question for
   * all three ways it can change: the property write in `applyTierState`, the
   * boot script's `setAttribute`, and a reader pressing a tier's `<summary>`.
   *
   * Degenerate cases are written, not left to chance: no tier open and more than
   * one tier open both draw nothing, because "you are here" is only true when
   * there is one here.
   */
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLDetailsElement>("[data-tier-section]")];
    if (nodes.length === 0) return;

    const read = () => {
      const open = nodes.filter((node) => node.open);
      if (open.length !== 1) return null;
      const slug = open[0].dataset.tierSection;
      return tiers.find((tier) => tier.slug === slug)?.label ?? null;
    };

    /*
     * eslint-disable, with the reason: the "cascading renders" rule is about
     * effects that set state in response to their own output. The first read
     * cannot happen during render — it is a fact about the document after the
     * boot script and after `applyTierState` — and no mutation will fire to
     * report a state that was already there.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setActiveTier(read());

    const observer = new MutationObserver(() => setActiveTier(read()));
    for (const node of nodes) {
      observer.observe(node, { attributes: true, attributeFilter: ["open"] });
    }
    return () => observer.disconnect();
  }, [tiers]);

  return (
    <details
      ref={detailsRef}
      /*
       * No `open`, at any width, ever. R-BUILD-8 is still true before a line of
       * JavaScript runs — from 640px because `app/globals.css` reveals
       * `::details-content` on this closed element, and below it because a
       * `<summary>` is a working disclosure without us. What the missing
       * attribute buys is that the served height *is* the settled height, so a
       * fragment the browser is already scrolling to cannot be moved out from
       * under it.
       */
      data-sections=""
      className="group"
    >
      {/*
        No `sm:hidden` here. The trigger is withdrawn from 640px by the same
        `@supports selector(::details-content)` block that reveals the panel,
        because the two are one decision: a browser that cannot reveal the panel
        must keep the trigger, and a utility would hide it unconditionally.
      */}
      <summary
        ref={summaryRef as React.RefObject<HTMLElement>}
        className="flex w-fit cursor-pointer list-none items-center gap-2 rounded border border-border px-3 py-2 text-sm text-ink-muted marker:hidden hover:border-border-strong hover:text-ink [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden className="text-base leading-none">
          ☰
        </span>
        {strings.trigger}
        <span aria-hidden className="text-xs transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>

      {/*
        The scrim, which is what makes the sheet modal rather than merely on
        top: it swallows every pointer event, so a mouse cannot reach the page
        behind it and neither may Tab. `hidden` until the island says otherwise,
        which is how the reader without JavaScript never meets it.
      */}
      <div
        aria-hidden="true"
        onClick={() => close(true)}
        className="fixed inset-0 z-40 hidden bg-abyss/60 group-data-[sheet]:block"
      />

      <div
        ref={panelRef}
        data-sections-panel=""
        className="group-data-[sheet]:fixed group-data-[sheet]:inset-x-0 group-data-[sheet]:bottom-0 group-data-[sheet]:z-50 group-data-[sheet]:flex group-data-[sheet]:max-h-[80vh] group-data-[sheet]:flex-col group-data-[sheet]:rounded-t-xl group-data-[sheet]:border-t group-data-[sheet]:border-border group-data-[sheet]:bg-surface-raised"
      >
        {/* A fixed header the list scrolls under, so the way out cannot be
            pushed off the bottom by a long list. */}
        <div className="hidden shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 group-data-[sheet]:flex">
          <p id={headingId} className="font-display text-sm text-ink">
            {strings.label}
          </p>
          <button
            type="button"
            data-sections-close=""
            onClick={() => close(true)}
            aria-label={strings.close}
            className="rounded border border-border px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <nav
          aria-label={strings.label}
          /*
           * Delegated, so a long list does not mean a closure per row — and
           * deliberately without returning focus. The browser is mid-jump to the
           * section the reader chose; pulling focus back to a `<summary>` some
           * seven hundred pixels above it would undo the one thing they asked
           * for. Escape, the backdrop and ✕ do return it, because those are
           * requests to go back where you were.
           */
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a") && isSheet()) close(false);
          }}
          className="group-data-[sheet]:min-h-0 group-data-[sheet]:overflow-y-auto group-data-[sheet]:px-4 group-data-[sheet]:py-1"
        >
          <ol className="flex list-none flex-wrap gap-x-4 gap-y-1 text-sm group-data-[sheet]:block">
            {entries.map((entry) => (
              <li key={entry.id} className="flex min-w-0 items-baseline gap-1.5">
                <a
                  href={`#${entry.id}`}
                  className="inline-flex min-h-6 items-center py-1 text-ink-muted underline-offset-2 transition-colors hover:text-ember-bright hover:underline group-data-[sheet]:min-h-11 group-data-[sheet]:py-2"
                >
                  {entry.label}
                </a>
                {/*
                  Not a control, not focusable, and never `aria-current` — that
                  attribute belongs to the tier picker, and a second element
                  wearing it would put a row with no `data-tier` in front of a
                  gate that reads `dataset.tier` off every one of them.
                */}
                {entry.showsActiveTier && activeTier && (
                  <span className="text-xs text-ink-subtle">· {activeTier}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </details>
  );
}
