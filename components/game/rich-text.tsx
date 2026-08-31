import { Fragment, type ReactNode } from "react";

/**
 * A deliberately tiny inline formatter for content strings.
 *
 * Content in `content/` is plain TypeScript, but prose reads much better with
 * emphasis, and authoring `<strong>` tags inside data files would be
 * miserable. So the data layer allows exactly three markers and this renders
 * them:
 *
 *   **bold**    -> <strong>
 *   *italic*    -> <em>
 *   `code`      -> <code>
 *
 * This is not a Markdown parser and must not grow into one. If a page needs
 * real rich content, it belongs in a `ContentBlock[]`, not in a string.
 *
 * There is no injection surface: this only ever emits three known elements
 * around plain text, and never renders raw HTML. Anything the content author
 * writes that is not one of these three patterns comes out verbatim — which is
 * what keeps literals like `+skills`, `2*3` and a lone asterisk intact.
 *
 * Every site that renders a content string has to go through this. It does not
 * fail loudly when it is skipped: the markers simply print, which is how
 * "**A variante para Uber Tristram...**" once reached a shipped page. That is
 * what `npm run test:markup` exists to catch.
 */

// Order matters. `**bold**` has to be tried before `*italic*`, and the italic
// pattern additionally refuses to start on whitespace or an asterisk so it
// cannot swallow a bold run or a stray separator.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g;

export function RichText({ children }: { children: string }): ReactNode {
  const parts = children.split(TOKEN);

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
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code key={i} className="rounded bg-surface-raised px-1 font-mono text-[0.9em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
