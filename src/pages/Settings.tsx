import { useEffect, useState } from 'react';
import HotkeyCapture, { loadStoredHotkey, saveStoredHotkey } from '@/components/HotkeyCapture';

export default function Settings() {
  const [hotkey, setHotkey] = useState<string>('');
  const [defaultHotkey, setDefaultHotkey] = useState<string>('CommandOrControl+Shift+V');
  const [hotkeyError, setHotkeyError] = useState<string | null>(null);

  useEffect(() => {
    const v = window.valtrq;
    if (!v) {
      setHotkey(loadStoredHotkey() ?? 'CommandOrControl+Shift+V');
      return;
    }
    v.hotkey.default().then(setDefaultHotkey);
    const stored = loadStoredHotkey();
    if (stored) {
      v.hotkey.set(stored).then(({ ok, current }) => {
        setHotkey(current);
        if (!ok) setHotkeyError('Stored hotkey could not be registered');
      });
    } else {
      v.hotkey.get().then(setHotkey);
    }
  }, []);

  async function applyHotkey(next: string) {
    setHotkeyError(null);
    const v = window.valtrq;
    if (!v) {
      setHotkey(next);
      saveStoredHotkey(next);
      return;
    }
    const { ok, current } = await v.hotkey.set(next);
    setHotkey(current);
    if (ok) saveStoredHotkey(next);
    else setHotkeyError('That combination is already in use by another app');
  }

  function resetHotkey() {
    applyHotkey(defaultHotkey);
  }

  function clearFavorites() {
    if (!confirm('Remove all pinned players from favorites?')) return;
    try {
      localStorage.removeItem('valtrq:favorites');
      location.reload();
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <header>
        <div className="text-[10px] uppercase tracking-brutal text-accent font-bold">Preferences</div>
        <h1 className="font-display text-5xl uppercase tracking-brutal leading-none mt-1">
          Settings
        </h1>
        <p className="text-text-secondary mt-3">
          Configure the overlay hotkey and local data. ValTrq stores everything on this machine
          and never sends your data anywhere.
        </p>
      </header>

      <section className="bg-bg-secondary border border-border">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-display text-lg uppercase tracking-brutal leading-none">Overlay</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="font-bold">Toggle hotkey</div>
              <div className="text-sm text-text-secondary mt-1">
                Global shortcut that shows or hides the overlay window. Works even while Valorant
                has focus.
              </div>
              {hotkeyError && (
                <div className="text-xs text-loss mt-2 font-mono">{hotkeyError}</div>
              )}
            </div>
            <HotkeyCapture
              value={hotkey}
              onChange={applyHotkey}
              onReset={resetHotkey}
            />
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary border border-border">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-display text-lg uppercase tracking-brutal leading-none">Local Data</h2>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="font-bold">Favorites</div>
              <div className="text-sm text-text-secondary mt-1">
                Pinned players are saved to this machine only. Clearing wipes the list.
              </div>
            </div>
            <button
              onClick={clearFavorites}
              className="bg-transparent border border-loss text-loss hover:bg-loss hover:text-white transition-colors px-5 py-2.5 text-xs uppercase tracking-brutal font-bold"
            >
              Clear Favorites
            </button>
          </div>

          <div className="text-xs text-text-secondary mt-6 leading-relaxed border-t border-border pt-4">
            <div className="text-[10px] uppercase tracking-brutal text-text-primary font-bold mb-2">
              No Account, No Server
            </div>
            ValTrq has no sign-in and no backend database. All data you see comes from public
            Valorant endpoints lookup by Riot ID, or from the local Valorant client running on
            this machine. Nothing leaves your computer except the API calls themselves.
          </div>
        </div>
      </section>
    </div>
  );
}
