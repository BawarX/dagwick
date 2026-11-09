import { type KeyboardEvent, type ReactNode, useId, useMemo, useReducer, useRef } from "react";

import { COMBO_START, type Option, combo, comboText, suggest } from "./scope";

/**
 * A search field with a suggestions dropdown (an ARIA combobox). Scales to hundreds of names.
 * The picked value stays in the field with a clear button; clicking the field searches again.
 * All state changes go through `combo()` in scope.ts, which is unit-tested.
 */
export function ScopeFilter({
  label,
  noun,
  placeholder,
  options,
  value,
  onPick,
  onClear,
}: {
  label: string;
  noun: string;
  placeholder: string;
  options: Option[];
  value?: string;
  onPick: (name: string) => void;
  onClear: () => void;
}) {
  const id = useId();
  const [state, dispatch] = useReducer(combo, COMBO_START);
  const input = useRef<HTMLInputElement>(null);
  const { shown, more } = useMemo(() => suggest(options, state.query), [options, state.query]);
  const active = Math.min(state.active, Math.max(shown.length - 1, 0));
  const listId = `${id}-list`;
  const optId = (i: number) => `${id}-opt-${i}`;
  const clearable = Boolean(value || state.query);

  const pick = (name: string) => {
    onPick(name);
    dispatch({ type: "picked" });
  };
  // Clearing keeps the field ready: focus it and show suggestions for the next pick.
  const clear = () => {
    dispatch({ type: "cleared" });
    if (value) onClear();
    input.current?.focus();
    dispatch({ type: "focus" });
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      dispatch({ type: "move", by: e.key === "ArrowDown" ? 1 : -1, count: shown.length });
    } else if (e.key === "Enter" && state.open && shown[active]) {
      e.preventDefault();
      pick(shown[active].name);
    } else if (e.key === "Escape") {
      if (state.open) dispatch({ type: "close" });
      else clear();
    }
  };

  return (
    <div className="dagwick-scope-field">
      <label className="dagwick-scope-label" htmlFor={`${id}-input`}>
        {label}
      </label>
      <div className={`dagwick-combo${clearable ? " has-value" : ""}`}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          id={`${id}-input`}
          className="dagwick-search"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={state.open}
          aria-controls={listId}
          aria-activedescendant={state.open && shown.length ? optId(active) : undefined}
          placeholder={value ?? placeholder}
          value={comboText(state, value)}
          onFocus={() => dispatch({ type: "focus" })}
          onClick={() => !state.open && dispatch({ type: "focus" })}
          onBlur={() => dispatch({ type: "blur" })}
          onChange={(e) => dispatch({ type: "type", query: e.target.value })}
          onKeyDown={onKeyDown}
        />
        {clearable && (
          <button
            type="button"
            className="dagwick-combo-clear"
            aria-label={value ? `Clear ${noun} ${value}` : "Clear search"}
            title={value ? `Clear ${noun}` : "Clear search"}
            onMouseDown={(e) => e.preventDefault()} // keep the field's focus
            onClick={clear}
          >
            ✕
          </button>
        )}
        {state.open && (
          <ul className="dagwick-listbox" id={listId} role="listbox" aria-label={label}>
            {!state.query.trim() && shown.length > 0 && (
              <li className="dagwick-listbox-note" role="presentation">
                Most DAGs
              </li>
            )}
            {shown.map((o, i) => (
              <li
                key={o.name}
                id={optId(i)}
                role="option"
                aria-selected={i === active}
                className={`dagwick-opt${i === active ? " is-active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // pick before the field loses focus
                  pick(o.name);
                }}
                onMouseEnter={() => dispatch({ type: "hover", index: i })}
              >
                <span className="dagwick-opt-name">{highlight(o.name, state.query)}</span>
                <span className="dagwick-muted">
                  {o.name === value ? "✓ " : ""}
                  {o.count} DAG{o.count === 1 ? "" : "s"}
                </span>
              </li>
            ))}
            {shown.length === 0 && (
              <li className="dagwick-listbox-note" role="presentation">
                {state.query.trim() ? `No ${noun} matches “${state.query.trim()}”.` : `No ${noun}s here.`}
              </li>
            )}
            {more > 0 && (
              <li className="dagwick-listbox-note" role="presentation">
                {more} more. Keep typing to narrow it down.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function highlight(name: string, query: string): ReactNode {
  const q = query.trim().toLowerCase();
  const at = q ? name.toLowerCase().indexOf(q) : -1;
  if (at < 0) return name;
  return (
    <>
      {name.slice(0, at)}
      <mark>{name.slice(at, at + q.length)}</mark>
      {name.slice(at + q.length)}
    </>
  );
}
