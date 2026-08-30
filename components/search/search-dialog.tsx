"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  searchEntries,
  searchKindLabels,
  type SearchEntry,
} from "@/lib/search";

/**
 * Global search.
 *
 * The only client component on the site. Everything else is server-rendered
 * static HTML, so this is where the entire interactive budget goes.
 *
 * The index is fetched lazily from a static JSON file the first time search
 * opens, rather than being serialised into every page. Inlining it cost about
 * 46KB per page across 117 routes; this way it is downloaded at most once per
 * visitor and only if they actually search.
 */
export function SearchDialog({ entryCount }: { entryCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(
    () => (index ? searchEntries(query, index) : []),
    [query, index],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  // Cmd/Ctrl+K opens, "/" opens when not already typing somewhere.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        close();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Fetch the index once, on first open.
  useEffect(() => {
    if (!open || index || loadFailed) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: SearchEntry[]) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index, loadFailed]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[active];
      if (target) {
        close();
        router.push(target.h);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink-subtle transition-colors hover:border-border-strong hover:text-ink-muted"
        aria-label="Search the site"
      >
        <span aria-hidden>⌕</span>
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-2 hidden rounded border border-border px-1.5 font-mono text-[10px] text-ink-subtle lg:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 cursor-default bg-abyss/80 backdrop-blur-sm"
            onClick={close}
          />

          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border-strong bg-surface-raised shadow-2xl shadow-abyss">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span aria-hidden className="text-ink-subtle">
                ⌕
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // Reset the highlighted row here rather than in an effect —
                  // this is the event that invalidates it.
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search items, runewords, builds, mechanics…"
                className="flex-1 bg-transparent py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none"
                aria-label="Search query"
                aria-controls="search-results"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle">
                Esc
              </kbd>
            </div>

            {query.trim().length >= 2 && loadFailed && (
              <p className="px-4 py-6 text-center text-sm text-danger">
                Search index failed to load. Use the navigation instead.
              </p>
            )}

            {query.trim().length >= 2 && !index && !loadFailed && (
              <p className="px-4 py-6 text-center text-sm text-ink-subtle">
                Loading index…
              </p>
            )}

            {query.trim().length >= 2 && index && (
              <ul
                id="search-results"
                ref={listRef}
                className="max-h-[55vh] overflow-y-auto py-1"
              >
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-ink-subtle">
                    Nothing matches &ldquo;{query}&rdquo;.
                    <p className="mt-1 text-xs">
                      Not every item in the game is catalogued yet — see{" "}
                      <Link
                        href="/about/sources"
                        onClick={close}
                        className="text-ember hover:text-ember-bright"
                      >
                        coverage
                      </Link>
                      .
                    </p>
                  </li>
                )}

                {results.map((entry, i) => (
                  <li key={`${entry.k}-${entry.h}-${entry.n}`}>
                    <Link
                      href={entry.h}
                      onClick={close}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${
                        i === active ? "bg-surface-overlay" : ""
                      }`}
                    >
                      <span className="mt-0.5 w-20 shrink-0 text-[10px] font-semibold tracking-wide text-ink-subtle uppercase">
                        {searchKindLabels[entry.k]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">
                          {entry.n}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-subtle">
                          {entry.d}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {query.trim().length < 2 && (
              <div className="px-4 py-6 text-sm text-ink-subtle">
                <p>Type at least two characters.</p>
                <p className="mt-2 text-xs">
                  Nicknames work: <span className="text-ink-muted">shako</span>,{" "}
                  <span className="text-ink-muted">hoto</span>,{" "}
                  <span className="text-ink-muted">soj</span>,{" "}
                  <span className="text-ink-muted">alvl 85</span>,{" "}
                  <span className="text-ink-muted">hdin</span>.
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-ink-subtle">
              <span>
                <kbd className="font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> open
              </span>
              <span>
                <kbd className="font-mono">esc</kbd> close
              </span>
              <span className="ml-auto">{entryCount} entries indexed</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
