import type { GameState, Roster } from './index';

declare global {
  interface Window {
    valtrq?: {
      platform: NodeJS.Platform;
      version: string;
      isOverlay: boolean;
      onRoster: (cb: (roster: Roster) => void) => () => void;
      onGameState: (cb: (state: GameState | { state: GameState }) => void) => () => void;
      onNavigate: (cb: (route: string) => void) => () => void;
      openPlayer: (name: string, tag: string, region: string) => void;
      hotkey: {
        get: () => Promise<string>;
        set: (accel: string) => Promise<{ ok: boolean; current: string }>;
        default: () => Promise<string>;
      };
      overlay: {
        setClickThrough: (enabled: boolean) => void;
        hide: () => void;
        moveTo: (corner: 'tl' | 'tr' | 'bl' | 'br') => void;
      };
    };
  }
}

export {};
