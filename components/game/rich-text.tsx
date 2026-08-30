import { Fragment, type ReactNode } from "react";

/**
 * A deliberately tiny inline formatter for content strings.
 *
 * Content in `content/` is plain TypeScript, but prose reads much better with
 * emphasis, and authoring `<strong>` tags inside data files would be miserable.
 * So the data layer allows exactly one piece of markup — `**bold**` — and this
 * renders it.
 *
 * This is not a Markdown parser and must not grow into one. If a page needs
 * real rich content, it belongs in a `ContentBlock[]`, not in a string.
 * Because it only ever emits `<strong>` around plain text, there is no
 * injection surface: nothing here renders raw HTML.
 */
export function RichText({ children }: { children: string }): ReactNode {
  const parts = children.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
