import { useEffect, useRef } from 'react';
import { useRoster } from '@/hooks/useRoster';
import RosterTeam from '@/components/overlay/RosterTeam';
import type { RosterPlayer } from '@/types';

export default function Overlay() {
  const { game, roster } = useRoster();
  const isClickThrough = useRef(true);

  // Hit-test via forwarded mousemove events. Cursor over an element marked
  // [data-interactive] disables click-through so the UI receives clicks;
  // anywhere else, clicks fall through to the game beneath.
  useEffect(() => {
    if (!window.valtrq?.isOverlay) return;
    function onMove(e: MouseEvent) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = !!el?.closest('[data-interactive]');
      const wantClickThrough = !interactive;
      if (wantClickThrough !== isClickThrough.current) {
        isClickThrough.current = wantClickThrough;
        window.valtrq!.overlay.setClickThrough(wantClickThrough);
      }
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  function openPlayer(p: RosterPlayer) {
    window.valtrq?.openPlayer(p.gameName, p.tagLine, p.region);
  }

  if (!roster || (game !== 'in-game' && game !== 'agent-select')) {
    return null;
  }

  return (
    <div className="min-h-screen p-3 text-text-primary select-none">
      <header
        data-interactive
        className="flex items-center justify-between mb-2 bg-bg-primary/85 backdrop-blur-md border border-border px-3 py-1.5"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 bg-accent clip-notch-l flex items-center justify-center font-display text-sm text-white leading-none flex-shrink-0">
            V
          </div>
          <div className="font-display text-sm uppercase tracking-brutal leading-none">
            ValTrq
          </div>
          <span className="text-[10px] font-mono uppercase tracking-brutal text-text-muted truncate">
            {roster.map}
            <span className="mx-1 text-border">/</span>
            {game === 'agent-select' ? 'Agent Lock' : 'Live'}
          </span>
        </div>
        <button
          onClick={() => window.valtrq?.overlay.hide()}
          className="text-text-muted hover:text-loss px-2 py-1 text-sm font-bold leading-none"
          title="Hide overlay"
          aria-label="Hide overlay"
        >
          ✕
        </button>
      </header>

      <div className="grid grid-cols-1 gap-2">
        <RosterTeam team="ally" players={roster.ally} onOpen={openPlayer} />
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-mono uppercase tracking-brutal text-text-muted">VS</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <RosterTeam team="enemy" players={roster.enemy} onOpen={openPlayer} />
      </div>
    </div>
  );
}
