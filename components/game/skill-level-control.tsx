"use client";

import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

import { clearLevel, isLevel, writeLevel } from "@/lib/prefs";
import type { SkillTreesStrings } from "@/lib/skill-tree-data-pure";

/**
 * "My level" — the one control that writes `d2rc.level` (R-TREE-9, decision
 * D1). One 44 px line: label, a three-character number input (1–99), "Clear";
 * `levelHelp` reaches the input through `aria-describedby`. It exists only in
 * the hydrated tree (R-PREF-4) and is the only importer of `writeLevel` and
 * `clearLevel` — `scripts/hygiene.test.ts` keeps the allowlist. Emptying the
 * field is a clear; anything that is not a whole number from 1 to 99 writes
 * nothing and shows `levelInvalid`.
 *
 * `onChange` fires only after a write or clear that succeeded, so the island
 * never shows a level that did not land — the same reason `writeLevel`
 * dispatches its event only after `setItem` returned.
 *
 * The field is controlled by the island's `level` (another tab's `storage`
 * event, or a clear, has to reach it), but a draft the reader is still typing
 * is not rewritten under them: "05" already denotes 5, and turning it into
 * "5" mid-keystroke moves the caret. The draft follows the prop only when the
 * two disagree, decided during render rather than in an effect — an effect
 * would paint the stale draft first.
 */
export interface SkillLevelControlProps {
  level: number | null;
  /** Reports the new value (or null after a clear); the island re-derives every state. */
  onChange: (level: number | null) => void;
  strings: Pick<
    SkillTreesStrings,
    "levelLabel" | "levelHelp" | "levelClear" | "levelClearLabel" | "levelInvalid"
  >;
}

const asDraft = (level: number | null) => (level === null ? "" : String(level));

/**
 * The control's box before the island mounts: the same label, a box the
 * size of the input, a box the size of the button, the same gaps — so it
 * wraps exactly where the control wraps at every width and text size, and
 * the section is as tall before hydration as after (browser gate C2b; a
 * fixed `min-height` reserved 44px where a 200 % reader's control is 192
 * or 248). Inert and `aria-hidden`: not a control, so R-PREF-4 holds — and
 * `.tree-level-skeleton` is `display: none` unless `(scripting: enabled)`,
 * so without scripts nothing is reserved for a control that never comes.
 */
export function SkillLevelSkeleton({ strings }: Pick<SkillLevelControlProps, "strings">): ReactNode {
  return (
    <div data-level-skeleton="" aria-hidden="true" className="tree-level-skeleton min-h-11 flex-wrap items-center gap-2">
      <span className="text-sm text-ink">{strings.levelLabel}</span>
      <span className="h-11 w-14 rounded border border-border bg-surface" />
      <span className="flex min-h-11 items-center rounded border border-border px-3 text-sm text-ink-muted">{strings.levelClear}</span>
      <span className="text-xs" />
    </div>
  );
}

export function SkillLevelControl({ level, onChange, strings }: SkillLevelControlProps): ReactNode {
  const id = useId();
  const inputId = `${id}-level`;
  const helpId = `${id}-help`;
  const messageId = `${id}-message`;
  const [draft, setDraft] = useState(() => asDraft(level));
  const [invalid, setInvalid] = useState(false);
  const [seen, setSeen] = useState(level);

  if (level !== seen) {
    setSeen(level);
    const denotes = draft === "" ? null : Number(draft);
    if (denotes !== level) {
      setDraft(asDraft(level));
      setInvalid(false);
    }
  }

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    /*
     * A number input reports "" for text it could not parse ("18e", "1.")
     * and marks it `badInput`. That is not a request to clear, and not a
     * value to judge either: nothing is written, React restores the field to
     * the draft, and the keystroke is simply refused — a message beside a
     * field that still shows a valid number would be about nothing (review L8).
     */
    if (input.validity.badInput) return;
    const value = input.value;
    setDraft(value);
    if (value === "") {
      setInvalid(false);
      if (clearLevel()) onChange(null);
      return;
    }
    const next = Number(value);
    if (!isLevel(next)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    if (writeLevel(next)) onChange(next);
  };

  const onClear = () => {
    setDraft("");
    setInvalid(false);
    if (clearLevel()) onChange(null);
  };

  // Enter in the field must not submit anything; the value is already stored.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    // No margin of its own: the slot the island reserves for it carries the
    // spacing and the 44px floor, so filling the slot moves nothing.
    <form data-level="" onSubmit={onSubmit} className="flex min-h-11 flex-wrap items-center gap-2">
      <label htmlFor={inputId} className="text-sm text-ink">
        {strings.levelLabel}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={1}
        max={99}
        step={1}
        value={draft}
        onChange={onInput}
        aria-describedby={invalid && draft !== "" ? `${helpId} ${messageId}` : helpId}
        aria-invalid={invalid || undefined}
        className="h-11 w-14 rounded border border-border bg-surface px-2 text-center font-mono text-sm text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ember"
      />
      <button
        type="button"
        data-clear-level=""
        aria-label={strings.levelClearLabel}
        onClick={onClear}
        className="min-h-11 rounded border border-border px-3 text-sm text-ink-muted hover:border-ink-subtle hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        {strings.levelClear}
      </button>
      <span id={helpId} className="sr-only">
        {strings.levelHelp}
      </span>
      {/* Inline and polite: the message appears beside the field it is about,
          only while the draft is non-empty and not a level. */}
      <span id={messageId} role="status" className="text-xs text-danger">
        {invalid && draft !== "" ? strings.levelInvalid : ""}
      </span>
    </form>
  );
}
