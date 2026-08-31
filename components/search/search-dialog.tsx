"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// From `scoring` directly, never from the `@/lib/search` barrel. The barrel
// also exports `buildSearchIndex`, which imports the whole registry and through
// it every content module — and "use client" pulls a file's entire import graph
// into the browser bundle whether or not the symbols are used. That barrel
// import put the full corpus, both locales, into a 1.1 MB chunk on every page,
// while the comment below correctly said the index is fetched on demand.
import { searchEntries, type SearchEntry, type SearchKind } from "@/lib/search/scoring";

/**
 * Global search.
 *
 * One of only two client components on the site, so this is where most of the
 * interactive budget goes.
 *
 * It cannot call `next/root-params`, which is server-only, so the locale
 * reaches it as props: the index URL for the active locale, and the already
 * translated strings. That keeps the dictionary out of the client bundle —
 * only the handful of strings this component actually renders cross the
 * boundary.
 *
 * The index itself is fetched lazily from a per-locale static JSON file the
 * first time search opens. Inlining it cost about 46KB per page across every
 * route; this way it is downloaded at most once per visitor, and only if they
 * actually search.
 */
export interface SearchStrings {
  button: string;
  ariaLabel: string;
  dialogLabel: string;
  closeLabel: string;
  queryLabel: string;
  placeholder: string;
  minChars: string;
  nicknamesHint: string;
  loading: string;
  failed: string;
  noResults: string;
  noResultsHint: string;
  coverageLink: string;
  navigate: string;
  open: string;
  close: string;
  entriesIndexed: string;
}

export function SearchDialog({
  indexUrl,
  entryCount,
  strings,
  kindLabels,
}: {
  indexUrl: string;
  entryCount: number;
  strings: SearchStrings;
  kindLabels: Record<SearchKind, string>;
}) {
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
    fetch(indexUrl)
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
  }, [open, index, loadFailed, indexUrl]);

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

  const [noResultsBefore, noResultsAfter] = strings.noResultsHint.split("{link}");
  const sourcesHref = indexUrl.replace("/search-index.json", "/about/sources");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink-subtle transition-colors hover:border-border-strong hover:text-ink-muted"
        aria-label={strings.ariaLabel}
      >
        <span aria-hidden>⌕</span>
        <span className="hidden sm:inline">{strings.button}</span>
        <kbd className="ml-2 hidden rounded border border-border px-1.5 font-mono text-[10px] text-ink-subtle lg:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label={strings.dialogLabel}
        >
          <button
            type="button"
            aria-label={strings.closeLabel}
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
                placeholder={strings.placeholder}
                className="flex-1 bg-transparent py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none"
                aria-label={strings.queryLabel}
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
                {strings.failed}
              </p>
            )}

            {query.trim().length >= 2 && !index && !loadFailed && (
              <p className="px-4 py-6 text-center text-sm text-ink-subtle">
                {strings.loading}
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
                    {strings.noResults.replace("{query}", query)}
                    <p className="mt-1 text-xs">
                      {noResultsBefore}
                      <Link
                        href={sourcesHref}
                        onClick={close}
                        className="text-ember hover:text-ember-bright"
                      >
                        {strings.coverageLink}
                      </Link>
                      {noResultsAfter}
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
                        {kindLabels[entry.k]}
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
                <p>{strings.minChars}</p>
                <p className="mt-2 text-xs">
                  {strings.nicknamesHint.replace(
                    "{examples}",
                    "shako, hoto, soj, alvl 85, hdin",
                  )}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-ink-subtle">
              <span>
                <kbd className="font-mono">↑↓</kbd> {strings.navigate}
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> {strings.open}
              </span>
              <span>
                <kbd className="font-mono">esc</kbd> {strings.close}
              </span>
              <span className="ml-auto">
                {strings.entriesIndexed.replace("{count}", String(entryCount))}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
