"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/components/ui";

/**
 * The header's mobile disclosure, and the only part of `SiteHeader` that is not
 * server-rendered.
 *
 * **Why it had to become a component at all.** The menu was a bare
 * `<details>` in the persistent root layout. A client-side navigation keeps
 * that DOM node — that is the whole point of a layout — so `open` survived the
 * route change and the reader arrived on the destination page with the menu
 * still covering it. Nothing caught it: the markup was correct, the links
 * resolved, the accessible name was right. It is a fact about a node's lifetime
 * across a soft navigation, and `scripts/mobile-navigation.test.ts` is the
 * gate that now holds it.
 *
 * **Why it is still a `<details>`.** A button and a panel would have been the
 * obvious shape, and it would have taken the menu away from every reader
 * without JavaScript — the site prerenders every page precisely so that reader
 * is served, and the header is on all 1004 of them. So the native disclosure
 * stays, and without scripting it is exactly what it always was.
 *
 * **Where the open state lives, and why it is not in React.** The design called
 * for a controlled `open`, and that version is what the gate first failed on:
 * `toggle` is queued rather than dispatched during the press, so any React copy
 * of the state is one task stale, and an effect keyed on it has not attached
 * when a quick reader reaches for Escape. The element is therefore the single
 * source of truth — every dismissal writes `element.open` directly, and the
 * listeners read it rather than a mirror. See the effect below for the failure
 * that produced the change.
 *
 * **Why there is no focus trap and no scroll lock.** This is a disclosure, not
 * a modal. Nothing is inert behind it, so focus stays in the document's own
 * order and the page keeps scrolling. The sheet in `components/builds` is the
 * modal one, and it uses `trapTarget` and `lockScroll` for exactly the reasons
 * this does not.
 *
 * **Why nothing is persisted.** A menu is a gesture, not a preference. Every
 * fresh page starts shut, and the gate asserts that storage is untouched.
 */

export interface MobileNavigationItem {
  href: string;
  label: string;
}

/**
 * Whether `pathname` sits in the section `href` owns.
 *
 * The trailing slash is load-bearing: without it `/pt-br/runewords` starts with
 * `/pt-br/runes` and two items light up at once. Asserted directly, because
 * that is the one case a reader would actually meet — the reference row holds
 * both.
 */
export function isCurrentSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({
  items,
  menuLabel,
  navigationLabel,
}: {
  items: MobileNavigationItem[];
  /** The trigger's name. Drawn from `sm` up, `sr-only` below it. */
  menuLabel: string;
  /** Names the region for a screen reader, since it duplicates two navs. */
  navigationLabel: string;
}) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  /** One way out, used by every dismissal. */
  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  // A completed route change, which covers following a link, the language
  // switcher, and Back. `pathname` carries the locale, so a language change is
  // a pathname change and needs no separate rule.
  useEffect(close, [pathname]);

  /*
   * Dismissal, attached for the life of the component rather than while open.
   *
   * This was written the other way first — `open` in `useState`, the element
   * rendered as `<details open={open}>`, these listeners attached by an effect
   * that depended on it — and the gate caught it: "Escape closes the menu"
   * failed while "Escape returns focus to the trigger" passed, in both
   * languages.
   *
   * The reason is that `toggle` is **asynchronous**. The platform queues it
   * rather than firing it during the press, so between opening the menu and the
   * next task the DOM says open and any React copy of that still says shut. An
   * effect keyed on the copy has not attached yet, so a reader who opens the
   * menu and reaches straight for Escape gets nothing — a real race, not a
   * timing artefact of the test, and the reason the element is the single
   * source of truth here rather than a mirror of it.
   *
   * Two always-on listeners is the price, and it is small: both return on the
   * first property read unless the menu is actually open.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const element = detailsRef.current;
      if (!element?.open || event.key !== "Escape") return;
      close();
      // Escape is a request to go back where you were, so the trigger takes its
      // focus again. A pointer dismissal deliberately does not do this.
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: Event) => {
      const element = detailsRef.current;
      if (!element?.open) return;
      if (!element.contains(event.target as Node)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    // `pointerdown` rather than `click`, so the menu is gone by the time the
    // press completes; `mousedown` alongside it because a synthesised event
    // from an automation harness may deliver only the mouse half.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("mousedown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("mousedown", onPointerDown, true);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      className="group relative min-[1400px]:hidden"
    >
      {/*
        Below `sm` the trigger is the glyph alone. The name is still there —
        `sr-only` text is in the accessible name computation and in the DOM, so
        this is a rendering decision rather than a label being dropped — and it
        is what buys the 320px row its headroom. See the arithmetic in
        `site-header.tsx`; there are about 22 spare pixels and nothing in the
        row can shrink.
      */}
      <summary
        ref={triggerRef as React.RefObject<HTMLElement>}
        className="flex cursor-pointer list-none items-center gap-2 rounded border border-border px-2.5 py-1.5 text-sm text-ink-muted marker:hidden hover:text-ink sm:px-3 [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden className="text-base leading-none sm:hidden">
          ☰
        </span>
        <span className="sr-only sm:not-sr-only">{menuLabel}</span>
        <span
          aria-hidden
          className="hidden text-xs transition-transform group-open:rotate-180 sm:inline"
        >
          ▾
        </span>
      </summary>
      {/*
        `w-56` is narrower than any viewport the site is read at, but the cap is
        not free to omit: at 200% zoom a 320px window is a 160px layout
        viewport, and a fixed 224px panel would hang off it.
      */}
      <nav
        aria-label={navigationLabel}
        className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-surface-raised p-2 shadow-2xl shadow-abyss"
      >
        {items.map((item) => {
          const current = isCurrentSection(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
              /*
               * A route change closes this, but choosing the page you are
               * already on is not a route change — and it is the one selection
               * where the menu staying put looks most like the old defect.
               */
              onClick={close}
              className={cn(
                "block rounded px-3 py-2 text-sm transition-colors",
                current
                  ? "bg-surface-overlay font-medium text-ember-bright"
                  : "text-ink-muted hover:bg-surface-overlay hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </details>
  );
}
