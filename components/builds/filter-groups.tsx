"use client";

import { cn } from "@/components/ui";
import type { BuildFilterState, FacetCounts, FilterGroup } from "@/lib/builds/filter";

/**
 * The four advanced groups, as the popover and the sheet both render them.
 *
 * One component rather than two copies, because the three things that make a
 * row correct are exactly the things a copy loses: the row *is* the label, so
 * the whole strip toggles with no dead space inside it and clears WCAG
 * 2.5.8's 24px on its own (`py-1` around a 20px line is 28px); `data-group`
 * and `data-value` are what the browser gates steer by, so no gate has to
 * parse a generated id; and the count beside every option is the
 * **conditional** one — what ticking it would list under the other groups'
 * selections — handed in by the surface, which knows whether it is counting
 * the applied state or a draft.
 *
 * **An option at zero is disabled and still says `0`.** The number is the
 * information ("no cold build of this class"), and the disabled state is what
 * keeps a click from producing an empty list (R-FILT-4). A *checked* option is
 * never disabled, whatever its count: a reader who arrived by URL with
 * `class=necromancer&damage=cold` sees Cold at `0` and has to be able to
 * un-tick it. What un-ticking takes with it is `toggleKeepingResults`'s
 * business, upstream of here.
 *
 * Each group is a `<details>`, the first open (R-FILT-3). Only the initial
 * `open` is written; the reader's own toggling is the element's, never
 * mirrored into React — `components/layout/mobile-navigation.tsx` records why
 * a controlled `open` is one task stale.
 *
 * `idPrefix` differs between the popover and the sheet so that, on the rare
 * resize that has one unmounting as the other mounts, two inputs never share
 * an id.
 */
export interface FilterGroupView {
  group: FilterGroup;
  legend: string;
  options: { value: string; label: string }[];
}

export function FilterGroups({
  groups,
  state,
  counts,
  idPrefix,
  onToggle,
  note,
  className,
}: {
  groups: FilterGroupView[];
  /** The selection the rows reflect: the URL's, or the sheet's draft. */
  state: BuildFilterState;
  /** `facetCounts` of that same selection. */
  counts: FacetCounts;
  idPrefix: string;
  onToggle: (group: FilterGroup, value: string) => void;
  /** What "Good at" means, already interpolated. Rendered under the groups. */
  note?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {groups.map((group, index) => {
        const selected = state[group.group].length;
        return (
          <details
            key={group.group}
            data-group={group.group}
            open={index === 0 ? true : undefined}
            className="group/g min-w-0"
          >
            <summary className="flex min-h-7 cursor-pointer list-none items-center gap-2 py-1 text-xs font-semibold tracking-widest text-ink-subtle uppercase transition-colors hover:text-ink-muted [&::-webkit-details-marker]:hidden">
              <span aria-hidden className="inline-block w-2 text-[0.6rem] transition-transform group-open/g:rotate-90">
                ▶
              </span>
              <span className="text-ink-muted">{group.legend}</span>
              {selected > 0 && (
                <span className="font-mono text-ember normal-case tracking-normal">({selected})</span>
              )}
            </summary>
            <div className="mb-2 grid gap-y-0.5 pl-4">
              {group.options.map((option) => {
                const id = `${idPrefix}-${group.group}-${option.value}`;
                const checked = state[group.group].includes(option.value);
                const count = counts[group.group]?.[option.value] ?? 0;
                // A checked box is never disabled — see the header.
                const disabled = !checked && count === 0;
                return (
                  <label
                    key={option.value}
                    htmlFor={id}
                    className={cn(
                      "flex min-h-6 items-center gap-2 py-1 text-sm",
                      disabled
                        ? "cursor-not-allowed text-ink-subtle"
                        : checked
                          ? "cursor-pointer text-ink"
                          : "cursor-pointer text-ink-muted hover:text-ink",
                    )}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      data-group={group.group}
                      data-value={option.value}
                      onChange={() => onToggle(group.group, option.value)}
                      className="size-3.5 shrink-0 accent-[var(--color-ember)]"
                    />
                    <span className="grow">{option.label}</span>
                    <span data-count className="font-mono text-xs text-ink-subtle tabular-nums">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </details>
        );
      })}
      {/*
        Directly under the group it defines, wherever that group is rendered.
        It used to sit after the whole listing — four screens below the "Good
        at" boxes on the unfiltered catalogue.
      */}
      {note && <p className="col-span-full pt-1 text-xs text-ink-subtle">{note}</p>}
    </div>
  );
}
