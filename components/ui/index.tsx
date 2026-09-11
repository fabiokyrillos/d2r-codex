import Link from "next/link";
import { RichText } from "@/components/game/rich-text";
import type { ReactNode } from "react";

/**
 * UI primitives.
 *
 * All server components — nothing here needs interactivity, which keeps the
 * client bundle for a typical content page at essentially zero.
 */

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow" | "shell";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-7xl",
    // For the app shell (header, footer) rather than prose. A nav bar aligns to
    // the window, not to the reading column, and capping it at the prose width
    // is what left the three-tier header 74px short of the room it needed.
    shell: "max-w-[96rem]",
  };
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", widths[size], className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  compact = false,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;
  /**
   * The listing variant: the same eyebrow and title, a description — if one
   * is given — at body size from `sm` up and not drawn on a phone, and less
   * room below. A catalogue's header is the thing standing between the
   * reader and its first card, and every pixel of it counts against the fold
   * (R-FILT-1, R-FILT-11). Nothing else changes, so the page still reads as
   * this site.
   *
   * The phone rule is measured, not stylistic: at 320px a listing's
   * description wraps to four lines in en-US and five in pt-BR — 91 to
   * 114px — inside a budget of 120px between the title's bottom edge and the
   * first row of controls, which R-FILT-1 fixes for every width. The build
   * catalogue passes no description at all; its page says why.
   */
  compact?: boolean;
}) {
  return (
    <header className={cn("border-b border-border", compact ? "pb-4" : "pb-8")}>
      {eyebrow && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-ink-subtle uppercase">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-3xl leading-tight text-balance text-ink sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "leading-relaxed text-pretty text-ink-muted",
            compact ? "mt-2 hidden max-w-5xl text-sm sm:block" : "mt-3 max-w-3xl text-lg",
          )}
        >
          {description}
        </p>
      )}
      {meta && <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
    </header>
  );
}

/**
 * A raw string handed to one of these primitives is content, so it goes
 * through the inline formatter; a ReactNode is the caller's own business and
 * is left alone.
 *
 * This rule exists because the alternative — remembering to wrap at every call
 * site — was not remembered, and 44 pages shipped with literal `**` in them.
 * Putting it in the primitive makes the safe thing the default.
 */
function asContent(node: ReactNode): ReactNode {
  return typeof node === "string" ? <RichText>{node}</RichText> : node;
}

export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      {title && (
        <div className="mb-4">
          <h2 className="font-display text-xl text-ink sm:text-2xl">{title}</h2>
          {description && (
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-muted">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <As
      className={cn(
        "rounded-lg border border-border bg-surface p-5",
        className,
      )}
    >
      {children}
    </As>
  );
}

export function LinkCard({
  href,
  children,
  className,
  attrs,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /**
   * `data-*` attributes only, spread onto the link. The build card carries
   * `data-card` so the browser gates can tell a build from the other links
   * on a listing without parsing hrefs; nothing else about the element is
   * open to the caller.
   */
  attrs?: Record<`data-${string}`, string>;
}) {
  return (
    <Link
      href={href}
      {...attrs}
      className={cn(
        "group block rounded-lg border border-border bg-surface p-5 transition-colors",
        "hover:border-border-strong hover:bg-surface-raised",
        className,
      )}
    >
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "ember" | "info" | "success" | "warning" | "danger" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-overlay text-ink-muted border-border",
    outline: "bg-transparent text-ink-subtle border-border",
    ember: "bg-ember-dim/20 text-ember-bright border-ember-dim/40",
    info: "bg-info/10 text-info border-info/25",
    success: "bg-success/10 text-success border-success/25",
    warning: "bg-warning/10 text-warning border-warning/25",
    danger: "bg-danger/10 text-danger border-danger/25",
  };
  return (
    <span
      className={cn(
        // whitespace-nowrap is the design intent: a badge is a short chip, not
        // prose. max-w-full plus truncate means an over-long one degrades to an
        // ellipsis inside its own row rather than widening the page — which is
        // what happened twice before check:content started enforcing the length.
        "inline-flex max-w-full items-center gap-1.5 truncate rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Callouts
// ---------------------------------------------------------------------------

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: ReactNode;
}) {
  const styles = {
    info: { border: "border-l-info", icon: "i", tone: "text-info" },
    warning: { border: "border-l-warning", icon: "!", tone: "text-warning" },
    success: { border: "border-l-success", icon: "✓", tone: "text-success" },
    danger: { border: "border-l-danger", icon: "!", tone: "text-danger" },
  }[variant];

  return (
    <div
      className={cn(
        "rounded-r border border-l-4 border-border bg-surface px-4 py-3",
        styles.border,
      )}
    >
      {title && (
        <p className={cn("mb-1 flex items-center gap-2 text-sm font-semibold", styles.tone)}>
          <span aria-hidden className="font-mono">
            {styles.icon}
          </span>
          {title}
        </p>
      )}
      <div className="text-sm leading-relaxed text-pretty text-ink-muted [&_strong]:text-ink">
        {asContent(children)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data display
// ---------------------------------------------------------------------------

export function StatGrid({
  items,
}: {
  items: { label: string; value: ReactNode; hint?: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-4 py-3">
          <dt className="text-xs tracking-wide text-ink-subtle uppercase">{item.label}</dt>
          <dd className="mt-1 font-display text-lg text-ink">{item.value}</dd>
          {item.hint && <p className="mt-0.5 text-xs text-ink-subtle">{item.hint}</p>}
        </div>
      ))}
    </dl>
  );
}

export function DataTable({
  headers,
  rows,
  caption,
  highlightRow,
}: {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
  /** Index of a row to emphasise, e.g. the recommended breakpoint. */
  highlightRow?: number;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border">
      {/* Wide tables scroll inside their own container, never the page body. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-raised">
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-ink-subtle uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-border/60 last:border-0",
                  highlightRow === i ? "bg-ember-dim/15" : "bg-surface",
                )}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-4 py-2.5 align-top",
                      j === 0 ? "font-medium text-ink" : "text-ink-muted",
                    )}
                  >
                    {asContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="border-t border-border bg-surface-raised px-4 py-2 text-xs text-ink-subtle">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ProsCons({
  pros,
  cons,
  prosLabel,
  consLabel,
}: {
  pros: string[];
  cons: string[];
  prosLabel: string;
  consLabel: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-success">
          <span aria-hidden>+</span> {prosLabel}
        </h3>
        <ul className="space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
              <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-success" />
              <span className="text-pretty">
                <RichText>{p}</RichText>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-danger">
          <span aria-hidden>−</span> {consLabel}
        </h3>
        <ul className="space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
              <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-danger" />
              <span className="text-pretty">
                <RichText>{c}</RichText>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * A 1-5 rating rendered as pips. Coarse on purpose.
 *
 * `valueLabel` carries the already-localized "N out of 5" string — the
 * component has no dictionary access of its own because it is used inside both
 * server and (potentially) client trees.
 */
export function Rating({
  value,
  label,
  valueLabel,
}: {
  value: number;
  label: string;
  valueLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="flex gap-1" role="img" aria-label={valueLabel}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "size-1.5 rounded-full",
              i <= value ? "bg-ember" : "bg-border-strong",
            )}
          />
        ))}
      </span>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-pretty text-ink-muted [&_strong]:font-semibold [&_strong]:text-ink">
      {children}
    </div>
  );
}

export function BulletList({ items, marker = "ember" }: { items: ReactNode[]; marker?: "ember" | "muted" }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
          <span
            aria-hidden
            className={cn(
              "mt-2 size-1 shrink-0 rounded-full",
              marker === "ember" ? "bg-ember" : "bg-border-strong",
            )}
          />
          <span className="text-pretty [&_strong]:text-ink">{asContent(item)}</span>
        </li>
      ))}
    </ul>
  );
}
