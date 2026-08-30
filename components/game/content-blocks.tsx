import type { ContentBlock } from "@/lib/types";
import { Callout, DataTable } from "@/components/ui";
import { ItemRefLink, RichText } from "@/components/game";

/**
 * Renders a mechanics article's typed content blocks.
 *
 * Prose lives as structured blocks rather than a Markdown string so that tables
 * keep their structure, formulas get their own presentation, and item
 * references inside articles stay type-checked and linkable — the same
 * cross-linking guarantee the rest of the site relies on.
 */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h3 className="pt-2 font-display text-lg text-ink">{block.text}</h3>
      ) : (
        <h2 className="scroll-mt-24 pt-4 font-display text-xl text-ink sm:text-2xl">
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="text-base leading-relaxed text-pretty text-ink-muted">
          <RichText>{block.text}</RichText>
        </p>
      );

    case "list":
      return block.ordered ? (
        <ol className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-ink-muted">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-surface-overlay font-mono text-xs text-ember">
                {i + 1}
              </span>
              <span className="text-pretty">
                <RichText>{item}</RichText>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-ink-muted">
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-ember" />
              <span className="text-pretty">
                <RichText>{item}</RichText>
              </span>
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <Callout variant={block.variant} title={block.title}>
          <RichText>{block.text}</RichText>
        </Callout>
      );

    case "formula":
      return (
        <figure className="overflow-hidden rounded-lg border border-border bg-surface-raised">
          <pre className="overflow-x-auto px-4 py-3 font-mono text-sm text-ember-bright">
            {block.expression}
          </pre>
          {block.caption && (
            <figcaption className="border-t border-border px-4 py-2 text-xs text-ink-subtle">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "table":
      return (
        <DataTable headers={block.headers} rows={block.rows} caption={block.caption} />
      );

    case "refs":
      return (
        <div>
          {block.title && (
            <p className="mb-2 text-sm font-semibold text-ink">{block.title}</p>
          )}
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {block.refs.map((ref, i) => (
              <li key={i}>
                <ItemRefLink refItem={ref} />
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
