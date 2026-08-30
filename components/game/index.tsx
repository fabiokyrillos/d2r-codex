import Link from "next/link";
import type { ReactNode } from "react";

import type {
  Confidence,
  Difficulty,
  Element,
  GearPick,
  GearSlot,
  ItemRef,
  Rune,
  Runeword,
  StatLine,
} from "@/lib/types";
import { resolveRef } from "@/lib/registry/resolve";
import {
  confidenceLabels,
  difficultyColors,
  difficultyLabels,
  elementColors,
  elementLabels,
  qualityColors,
} from "@/lib/labels";
import { Badge, Callout, cn } from "@/components/ui";
import { RichText } from "./rich-text";

export { RichText };

// ---------------------------------------------------------------------------
// Cross-references
// ---------------------------------------------------------------------------

/**
 * The heart of the cross-linking system.
 *
 * A build says `{ kind: 'runeword', slug: 'spirit' }` and gets a correctly
 * coloured, correctly linked, correctly named reference — without the build
 * author writing any of that. This is what stops the same item being described
 * twelve different ways across twelve pages.
 */
export function ItemRefLink({
  refItem,
  showKind = false,
}: {
  refItem: ItemRef;
  showKind?: boolean;
}) {
  const resolved = resolveRef(refItem);

  // Refs to entities we have not catalogued yet render as plain coloured text
  // rather than a link to a 404.
  if (!resolved.found) {
    return (
      <span className={cn("font-medium", qualityColors[resolved.quality])}>
        {resolved.name}
      </span>
    );
  }

  return (
    <Link
      href={resolved.href}
      className={cn(
        "font-medium underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current",
        qualityColors[resolved.quality],
      )}
      title={resolved.summary}
    >
      {resolved.name}
      {showKind && (
        <span className="ml-1 text-xs text-ink-subtle">({resolved.kind})</span>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge tone="outline" className={difficultyColors[difficulty]}>
      {difficultyLabels[difficulty]}
    </Badge>
  );
}

export function ElementBadge({ element }: { element: Element }) {
  return (
    <Badge tone="outline" className={elementColors[element]}>
      {elementLabels[element]}
    </Badge>
  );
}

export function AreaLevelBadge({ level, isEighty5 }: { level: number; isEighty5?: boolean }) {
  return (
    <Badge tone={isEighty5 ? "ember" : "neutral"}>
      <span className="font-mono">alvl {level}</span>
      {isEighty5 && <span className="text-[10px] tracking-wide uppercase">top TC</span>}
    </Badge>
  );
}

/**
 * Surfaced only when confidence is *not* `verified`. Readers should be able to
 * assume verified is the baseline; flagging every verified claim would train
 * them to ignore the badge entirely.
 */
export function ConfidenceNote({ confidence }: { confidence?: Confidence }) {
  if (!confidence) return null;
  const label = confidenceLabels[confidence];
  if (!label) return null;

  return (
    <Badge tone={confidence === "unverified" ? "warning" : "outline"}>{label}</Badge>
  );
}

// ---------------------------------------------------------------------------
// Runes and sockets
// ---------------------------------------------------------------------------

/** A rune rendered as an inline chip, in socket order. */
export function RuneChip({ rune, index }: { rune: Rune | undefined; index?: number }) {
  if (!rune) return null;
  return (
    <Link
      href={`/runes/${rune.slug}`}
      className="group inline-flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2 py-1 transition-colors hover:border-rarity-rune/50 hover:bg-surface-overlay"
      title={`${rune.name} — required level ${rune.requiredLevel || "none"}`}
    >
      {index !== undefined && (
        <span className="font-mono text-[10px] text-ink-subtle">{index + 1}</span>
      )}
      <span className="text-sm font-semibold text-rarity-rune">{rune.name}</span>
    </Link>
  );
}

/**
 * A runeword's rune sequence.
 *
 * Order is rendered explicitly with numbered sockets, because socketing runes
 * in the wrong order is one of the two mistakes that ruin a base item.
 */
export function RuneSequence({
  runes,
  resolveRune,
}: {
  runes: string[];
  resolveRune: (slug: string) => Rune | undefined;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {runes.map((slug, i) => (
        <div key={`${slug}-${i}`} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="text-ink-subtle">
              +
            </span>
          )}
          <RuneChip rune={resolveRune(slug)} index={i} />
        </div>
      ))}
    </div>
  );
}

/** Visual socket count. Makes "exactly N sockets" impossible to misread. */
export function SocketDisplay({ count, filled }: { count: number; filled?: number }) {
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${count} sockets`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "size-3 rounded-[2px] border",
            (filled ?? count) > i
              ? "border-rarity-rune/60 bg-rarity-rune/25"
              : "border-border-strong bg-abyss",
          )}
        />
      ))}
    </span>
  );
}

/**
 * The runeword base-type rule, rendered as an unmissable block.
 *
 * A product requirement, not a design flourish: attempting a runeword in the
 * wrong base type is the single most common and most expensive D2 mistake.
 */
export function RunewordBaseRule({ runeword }: { runeword: Runeword }) {
  return (
    <div className="rounded-lg border border-ember-dim/40 bg-ember-dim/10 p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div>
          <p className="text-xs tracking-wide text-ink-subtle uppercase">Base required</p>
          <p className="mt-0.5 font-display text-lg text-ember-bright">
            {runeword.bases.display}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs tracking-wide text-ink-subtle uppercase">Sockets</p>
            <p className="mt-1">
              <SocketDisplay count={runeword.sockets} />
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-wide text-ink-subtle uppercase">Level</p>
            <p className="mt-0.5 font-display text-lg text-ink">{runeword.requiredLevel}</p>
          </div>
        </div>
      </div>

      {runeword.bases.exclusions && runeword.bases.exclusions.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-ember-dim/30 pt-3">
          {runeword.bases.exclusions.map((ex) => (
            <li key={ex} className="flex gap-2 text-sm text-ink-muted">
              <span aria-hidden className="text-danger">
                ✕
              </span>
              <span className="text-pretty">
                <RichText>{ex}</RichText>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Item stats
// ---------------------------------------------------------------------------

export function StatLines({ stats }: { stats: StatLine[] }) {
  return (
    <ul className="space-y-1">
      {stats.map((stat, i) => (
        <li
          key={i}
          className={cn(
            "flex items-start gap-2 text-sm leading-relaxed",
            stat.notable ? "font-medium text-ink" : "text-ink-muted",
          )}
        >
          {stat.notable && (
            <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-ember" />
          )}
          <span className={cn(!stat.notable && "pl-3")}>{stat.text}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Gear
// ---------------------------------------------------------------------------

export const gearSlotLabels: Record<GearSlot, string> = {
  helm: "Helm",
  amulet: "Amulet",
  weapon: "Weapon",
  offhand: "Off-hand",
  body: "Body Armor",
  gloves: "Gloves",
  belt: "Belt",
  boots: "Boots",
  ring1: "Ring",
  ring2: "Ring",
};

/**
 * One gear recommendation, with its alternatives nested underneath.
 *
 * Alternatives are shown inline rather than hidden behind a toggle: "what do I
 * use if I don't have that" is the most common question a build page has to
 * answer, and burying it defeats the purpose.
 */
export function GearPickView({ pick, depth = 0 }: { pick: GearPick; depth?: number }) {
  const label = pick.ref ? <ItemRefLink refItem={pick.ref} /> : <span className="font-medium text-ink">{pick.label}</span>;

  return (
    <div className={cn(depth > 0 && "border-l border-border pl-4")}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {depth > 0 && (
          <span className="text-xs tracking-wide text-ink-subtle uppercase">or</span>
        )}
        {label}
        {pick.tradeOnly && <Badge tone="warning">Trade only</Badge>}
      </div>

      <p className="mt-1 text-sm leading-relaxed text-pretty text-ink-muted">
        <RichText>{pick.why}</RichText>
      </p>

      {pick.sockets && (
        <p className="mt-1.5 text-sm text-ink-subtle">
          <span className="text-ink-subtle">Sockets: </span>
          <span className="text-ink-muted">
            <RichText>{pick.sockets}</RichText>
          </span>
        </p>
      )}

      {pick.lookFor && pick.lookFor.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-xs text-ink-subtle">Look for:</span>
          {pick.lookFor.map((affix) => (
            <Badge key={affix} tone="outline">
              {affix}
            </Badge>
          ))}
        </div>
      )}

      {pick.alternatives && pick.alternatives.length > 0 && (
        <div className="mt-3 space-y-3">
          {pick.alternatives.map((alt, i) => (
            <GearPickView key={i} pick={alt} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Callout helper
// ---------------------------------------------------------------------------

export function InfoCallout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Callout variant="info" title={title}>
      {children}
    </Callout>
  );
}

export function WarningCallout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Callout variant="warning" title={title}>
      {children}
    </Callout>
  );
}
