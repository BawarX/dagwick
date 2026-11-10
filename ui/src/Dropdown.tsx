import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import { type Option, navIndex, typeAhead } from "./scope";

const TYPE_AHEAD_MS = 700;

/**
 * A dropdown that looks like the native one when closed, with a styled list when open.
 * Keyboard: Enter/Space/↓ opens, ↑/↓ Home End PgUp PgDn move, letters jump to a match,
 * Enter picks, Esc closes. The first row ("All …") clears the filter.
 */
export function Dropdown({
  label,
  all,
  empty,
  options,
  value,
  onChange,
}: {
  label: string;
  all: string;
  /** Shown, greyed out, when there is nothing to pick (the filter stays in place). */
  empty: string;
  options: Option[];
  value?: string;
  onChange: (value: string | undefined) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  // Keep the current value listed even if it matches nothing (an old link).
  const known = value && !options.some((o) => o.name === value) ? [{ name: value, count: 0 }, ...options] : options;
  const rows = [{ name: "", label: all, count: undefined as number | undefined }, ...known.map((o) => ({ ...o, label: o.name }))];
  const selected = Math.max(0, rows.findIndex((r) => r.name === (value ?? "")));
  const nothing = rows.length === 1;

  const show = () => {
    setActive(selected);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };
  const choose = (i: number) => {
    close();
    onChange(rows[i].name || undefined);
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const outside = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);
  useEffect(() => {
    if (open) list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const jump = (key: string) => {
    const now = Date.now();
    typed.current = { text: (now - typed.current.at < TYPE_AHEAD_MS ? typed.current.text : "") + key, at: now };
    const at = typeAhead(rows.map((r) => r.label), typed.current.text, active);
    if (at !== undefined) setActive(at);
  };

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  };
  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const to = navIndex(e.key, active, rows.length);
    if (to !== undefined) {
      e.preventDefault();
      setActive(to);
    } else if (e.key === "Enter" || (e.key === " " && !typed.current.text)) {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      jump(e.key);
    }
  };

  return (
    <div className="dagwick-dd" ref={root}>
      <span id={`${id}-label`} className="dagwick-sr-only">
        {label}
      </span>
      <button
        ref={button}
        id={`${id}-button`}
        type="button"
        className={`dagwick-select${value ? " is-set" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-button`}
        disabled={nothing}
        onClick={() => (open ? close() : show())}
        onKeyDown={onButtonKey}
      >
        <span className="dagwick-dd-value">{value ?? (nothing ? empty : all)}</span>
      </button>
      {open && (
        <ul
          ref={list}
          className="dagwick-dd-list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && setOpen(false)}
        >
          {rows.map((r, i) => [
            <li
              key={r.name || "__all"}
              id={`${id}-opt-${i}`}
              data-i={i}
              role="option"
              aria-selected={i === selected}
              className={`dagwick-dd-opt${i === active ? " is-active" : ""}`}
              onMouseMove={() => i !== active && setActive(i)}
              onClick={() => choose(i)}
            >
              <span className="dagwick-dd-check" aria-hidden="true">
                {i === selected ? "✓" : ""}
              </span>
              <span className="dagwick-dd-name">{r.label}</span>
              {r.count !== undefined && <span className="dagwick-dd-count">{r.count}</span>}
            </li>,
            i === 0 && rows.length > 1 && <li key="__sep" className="dagwick-dd-sep" role="presentation" />,
          ])}
        </ul>
      )}
    </div>
  );
}
