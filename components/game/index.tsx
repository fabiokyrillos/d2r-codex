import Link from "next/link";
import type { ReactNode } from "react";

import type {
  Availability,
  Confidence,
  Difficulty,
  Element,
  GearPick,
  ItemRef,
  Rune,
  Runeword,
  Slug,
  StatLine,
} from "@/lib/types";
import { resolveRef } from "@/lib/registry/resolve";
import { hasSkillPages } from "@/lib/skills";
import { routes } from "@/lib/routes";
import { type Dictionary } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import {
  availabilityModeLabels,
  availabilityStatusLabels,
  availabilityStatusStyles,
  confidenceLabels,
  difficultyColors,
  difficultyLabels,
  elementColors,
  elementLabels,
  gearSlotLabels,
  qualityColors,
} from "@/lib/labels";
import { Badge, Callout, cn } from "@/components/ui";
import { RichText } from "./rich-text";

export { RichText };
export { SkillSigil } from "./skill-sigil";
export { SkillTreesSection } from "./skill-tree-section";

/**
 * Domain components.
 *
 * These are async Server Components that read the active locale themselves via
 * `next/root-params` rather than taking it as a prop. That is the single
 * biggest simplification internationalisation brought: an `<ItemRefLink>` deep
 * inside a gear table needs the locale to build its href, and without root
 * params that would have meant threading `locale` through every intermediate
 * component on the site.
 */

// ---------------------------------------------------------------------------
// Cross-references
// ---------------------------------------------------------------------------

/**
 * The heart of the cross-linking system.
 *
 * A build says `{ kind: 'runeword', slug: 'spirit' }` and gets a correctly
 * coloured, correctly linked, correctly named reference in the reader's
 * language — without the build author writing any of that.
 */
export async function ItemRefLink({
  refItem,
  showKind = false,
}: {
  refItem: ItemRef;
  showKind?: boolean;
}) {
  const { locale, t } = await getI18n();
  const resolved = resolveRef(locale, refItem);

  // Refs to entities we have not catalogued yet — and kinds the site has no
  // route for at all — render as plain coloured text rather than a link to a
  // 404. `href` is optional precisely so this branch cannot be skipped.
  if (!resolved.found || !resolved.href) {
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
        <span className="ml-1 text-xs text-ink-subtle">
          ({refKindLabel(t, resolved.kind)})
        </span>
      )}
    </Link>
  );
}

/**
 * A skill's name, linked to the skill's own page.
 *
 * The build page named skills in three places and linked them in none: the
 * tree panel was the only route from a plan to a skill, and the tree is exactly
 * what collapses on a phone. The tables are the plan at that width, so the name
 * in a table has to be the link.
 *
 * Guarded on `hasSkillPages` for the same reason the tree is: a class whose
 * skills are not in the extracted graph has no pages to link to, and a link to
 * a 404 is worse than plain text.
 */
export async function SkillLink({
  classSlug,
  skill,
  name,
}: {
  classSlug: Slug;
  skill: Slug;
  name: string;
}) {
  const { locale } = await getI18n();
  if (!hasSkillPages(classSlug)) {
    return <span className="font-medium text-ink">{name}</span>;
  }
  return (
    <Link
      href={routes(locale).skill(classSlug, skill)}
      className="font-medium text-ink underline decoration-current/30 underline-offset-2 transition-colors hover:text-ember-bright hover:decoration-current"
    >
      {name}
    </Link>
  );
}

/** Ref kinds map onto the search-kind labels; the item-ish ones all collapse. */
function refKindLabel(t: Dictionary, kind: ItemRef["kind"]): string {
  switch (kind) {
    case "rune":
      return t.searchKinds.rune;
    case "runeword":
      return t.searchKinds.runeword;
    default:
      return t.searchKinds.item;
  }
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export async function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { t } = await getI18n();
  return (
    <Badge tone="outline" className={difficultyColors[difficulty]}>
      {difficultyLabels(t)[difficulty]}
    </Badge>
  );
}

export async function ElementBadge({ element }: { element: Element }) {
  const { t } = await getI18n();
  return (
    <Badge tone="outline" className={elementColors[element]}>
      {elementLabels(t)[element]}
    </Badge>
  );
}

export async function AreaLevelBadge({
  level,
  isEighty5,
}: {
  level: number;
  isEighty5?: boolean;
}) {
  const { t } = await getI18n();
  return (
    <Badge tone={isEighty5 ? "ember" : "neutral"}>
      <span className="font-mono">alvl {level}</span>
      {isEighty5 && (
        <span className="text-[10px] tracking-wide uppercase">{t.farming.topTc}</span>
      )}
    </Badge>
  );
}

/**
 * Surfaced only when confidence is *not* `verified`. Readers should be able to
 * assume verified is the baseline; flagging every verified claim would train
 * them to ignore the badge entirely.
 */
export async function ConfidenceNote({ confidence }: { confidence?: Confidence }) {
  if (!confidence) return null;
  const { t } = await getI18n();
  const label = confidenceLabels(t)[confidence];
  if (!label) return null;

  return <Badge tone={confidence === "unverified" ? "warning" : "outline"}>{label}</Badge>;
}

// ---------------------------------------------------------------------------
// Runes and sockets
// ---------------------------------------------------------------------------

/** A rune rendered as an inline chip, in socket order. */
export async function RuneChip({
  rune,
  index,
}: {
  rune: Rune | undefined;
  index?: number;
}) {
  if (!rune) return null;
  const { locale, t } = await getI18n();
  // The caller already holds the rune, so the resolver finds it and hands back
  // an href — but the type no longer promises one, and a chip with no
  // destination is not a link.
  const href = resolveRef(locale, { kind: "rune", slug: rune.slug }).href;
  if (!href) return <span className="text-sm font-semibold text-rarity-rune">{rune.name}</span>;

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2 py-1 transition-colors hover:border-rarity-rune/50 hover:bg-surface-overlay"
      title={`${rune.name} — ${
        rune.requiredLevel > 0
          ? t.runes.requiredLevel.replace("{level}", String(rune.requiredLevel))
          : t.runes.noLevelRequirement
      }`}
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
    <span className="inline-flex items-center gap-1">
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
export async function RunewordBaseRule({ runeword }: { runeword: Runeword }) {
  const { t } = await getI18n();

  return (
    <div className="rounded-lg border border-ember-dim/40 bg-ember-dim/10 p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div>
          <p className="text-xs tracking-wide text-ink-subtle uppercase">
            {t.runewords.baseRequired}
          </p>
          <p className="mt-0.5 font-display text-lg text-ember-bright">
            {runeword.bases.display}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs tracking-wide text-ink-subtle uppercase">
              {t.runewords.socketsLabel}
            </p>
            <p className="mt-1">
              <SocketDisplay count={runeword.sockets} />
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-wide text-ink-subtle uppercase">
              {t.runewords.levelLabel}
            </p>
            <p className="mt-0.5 font-display text-lg text-ink">
              {runeword.requiredLevel}
            </p>
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
// Availability
// ---------------------------------------------------------------------------

/**
 * The craft-versus-wear table.
 *
 * Renders every row the data carries, in the order the data declares. It never
 * fills in a missing mode: the type requires all of them, so an absent row is
 * a validation failure to be caught by `check:content`, not something to paper
 * over at render time. `title` exists because the same block appears on the
 * item's own page, where the heading is generic, and on a build page, where it
 * names the item that gates the build.
 */
export async function AvailabilityTable({
  availability,
  title,
}: {
  availability: Availability;
  title?: string;
}) {
  const copy = availability.notes;
  const { t } = await getI18n();
  const modeLabel = availabilityModeLabels(t);
  const statusLabel = availabilityStatusLabels(t);

  return (
    <div className="rounded border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-ink">{title ?? t.availability.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        <RichText>{t.availability.description}</RichText>
      </p>

      <ul className="mt-3 space-y-2">
        {availability.rows.map((row) => (
          <li
            key={row.mode}
            className="flex flex-col gap-1 border-t border-border pt-2 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <span className="shrink-0 text-sm font-medium text-ink sm:w-40">
              {modeLabel[row.mode]}
            </span>
            <span
              className={cn(
                "inline-flex w-fit shrink-0 rounded border px-2 py-0.5 text-xs font-semibold",
                availabilityStatusStyles[row.status].tone,
              )}
            >
              {statusLabel[row.status]}
            </span>
            <span className="text-sm leading-relaxed text-ink-muted [&_strong]:text-ink">
              <RichText>{copy.rows[row.mode]}</RichText>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-ink-muted [&_strong]:text-ink">
        <strong className="text-ink">{t.availability.consequenceLabel}: </strong>
        <RichText>{copy.consequence}</RichText>
      </p>

      {copy.history && (
        <p className="mt-2 text-sm leading-relaxed text-ink-muted [&_strong]:text-ink">
          <strong className="text-ink">{t.availability.historyLabel}: </strong>
          <RichText>{copy.history}</RichText>
        </p>
      )}

      <dl className="mt-3 grid gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-ink-subtle sm:grid-cols-3">
        <div>
          <dt className="inline font-semibold">{t.availability.sourceLabel}: </dt>
          <dd className="inline">{availability.source}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">{t.availability.baselineLabel}: </dt>
          <dd className="inline">{availability.baseline}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">{t.availability.checkedLabel}: </dt>
          <dd className="inline">
            <time dateTime={availability.checked}>{availability.checked}</time>
          </dd>
        </div>
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gear
// ---------------------------------------------------------------------------

export { gearSlotLabels };

/**
 * One gear recommendation, with its alternatives nested underneath.
 *
 * Alternatives are shown inline rather than hidden behind a toggle: "what do I
 * use if I don't have that" is the most common question a build page has to
 * answer, and burying it defeats the purpose.
 */
export async function GearPickView({
  pick,
  depth = 0,
}: {
  pick: GearPick;
  depth?: number;
}) {
  const { t } = await getI18n();
  const label = pick.ref ? (
    <ItemRefLink refItem={pick.ref} />
  ) : (
    <span className="font-medium text-ink">{pick.label}</span>
  );

  return (
    <div className={cn(depth > 0 && "border-l border-border pl-4")}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {depth > 0 && (
          <span className="text-xs tracking-wide text-ink-subtle uppercase">
            {t.builds.orAlternative}
          </span>
        )}
        {label}
        {pick.tradeOnly && <Badge tone="warning">{t.builds.tradeOnly}</Badge>}
      </div>

      <p className="mt-1 text-sm leading-relaxed text-pretty text-ink-muted">
        <RichText>{pick.why}</RichText>
      </p>

      {pick.sockets && (
        <p className="mt-1.5 text-sm text-ink-subtle">
          <span className="text-ink-subtle">{t.builds.sockets} </span>
          <span className="text-ink-muted">
            <RichText>{pick.sockets}</RichText>
          </span>
        </p>
      )}

      {pick.lookFor && pick.lookFor.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-xs text-ink-subtle">{t.builds.lookFor}</span>
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
// Callout helpers
// ---------------------------------------------------------------------------

export function InfoCallout({ title, children }: { title?: string; children: ReactNode }) {
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
