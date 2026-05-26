import { useEffect, useState } from 'react';
import type { GameState, Roster } from '@/types';
import { MOCK_ROSTER } from '@/mock/roster';

interface State {
  game: GameState;
  roster: Roster | null;
}

/**
 * Subscribes to overlay game-state events from the main process.
 * Falls back to MOCK_ROSTER + a manual state toggle when running in browser
 * (no window.valtrq).
 */
export function useRoster(): State {
  const [game, setGame] = useState<GameState>('idle');
  const [roster, setRoster] = useState<Roster | null>(null);

  useEffect(() => {
    const v = window.valtrq;
    if (!v) {
      // Browser dev: pretend we're in-game so the overlay route renders.
      setGame('in-game');
      setRoster(MOCK_ROSTER);
      return;
    }
    const offState = v.onGameState((payload: any) => {
      const next: GameState = payload?.state ?? 'idle';
      setGame(next);
      if (next === 'agent-select' || next === 'in-game') {
        setRoster({ ...MOCK_ROSTER, state: next });
      } else {
        setRoster(null);
      }
    });
    const offRoster = v.onRoster((r: any) => setRoster(r as Roster));
    return () => { offState?.(); offRoster?.(); };
  }, []);

  return { game, roster };
}
