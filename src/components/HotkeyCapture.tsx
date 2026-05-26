import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (accel: string) => void;
  onReset: () => void;
}

const STORAGE_KEY = 'valtrq:hotkey';

export function loadStoredHotkey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveStoredHotkey(accel: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, accel);
  } catch {
    // ignore
  }
}

/**
 * Build an Electron Accelerator string from a KeyboardEvent.
 * Returns null while the user is still holding only modifiers.
 */
function buildAccelerator(e: KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('CommandOrControl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');

  const key = e.key;
  if (['Control', 'Shift', 'Alt', 'Meta', 'OS', 'AltGraph'].includes(key)) return null;

  let main: string;
  if (key.length === 1) {
    main = key.toUpperCase();
  } else if (key.startsWith('Arrow')) {
    main = key.replace('Arrow', '');
  } else if (key === ' ' || key === 'Spacebar') {
    main = 'Space';
  } else if (/^F\d+$/.test(key)) {
    main = key;
  } else {
    main = key.charAt(0).toUpperCase() + key.slice(1);
  }

  parts.push(main);
  if (parts.length < 2) return null;
  return parts.join('+');
}

function displayAccel(accel: string): string {
  if (!accel) return 'None';
  return accel
    .replace('CommandOrControl', 'Ctrl')
    .split('+')
    .join(' + ');
}

export default function HotkeyCapture({ value, onChange, onReset }: Props) {
  const [capturing, setCapturing] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!capturing) return;
    function onKey(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        setCapturing(false);
        setDraft(null);
        return;
      }
      const accel = buildAccelerator(e);
      if (accel) {
        setDraft(accel);
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (draft) {
        onChange(draft);
        setCapturing(false);
        setDraft(null);
      }
    }
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('keyup', onKeyUp, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
  }, [capturing, draft, onChange]);

  return (
    <div className="flex items-center gap-2">
      <button
        ref={ref}
        type="button"
        onClick={() => setCapturing(c => !c)}
        className={`font-mono text-sm px-4 py-2 border transition-colors min-w-[180px] text-left ${
          capturing
            ? 'bg-accent/10 border-accent text-accent animate-pulse'
            : 'bg-bg-tertiary border-border hover:border-accent/60 text-text-primary'
        }`}
      >
        {capturing ? (draft ? displayAccel(draft) : 'Press keys…') : displayAccel(value)}
      </button>
      {capturing ? (
        <span className="text-[10px] uppercase tracking-brutal text-text-muted">
          Esc to cancel
        </span>
      ) : (
        <button
          type="button"
          onClick={onReset}
          className="text-[10px] uppercase tracking-brutal font-bold text-text-secondary hover:text-accent px-2 py-1 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
