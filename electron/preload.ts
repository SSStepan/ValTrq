import { contextBridge, ipcRenderer } from 'electron';

const isOverlay = process.argv.includes('--valtrq-window=overlay');

contextBridge.exposeInMainWorld('valtrq', {
  platform: process.platform,
  version: '0.2.0',
  isOverlay,
  onRoster: (cb: (roster: unknown) => void) => {
    const listener = (_: unknown, payload: unknown) => cb(payload);
    ipcRenderer.on('valtrq:roster', listener);
    return () => ipcRenderer.removeListener('valtrq:roster', listener);
  },
  onGameState: (cb: (state: unknown) => void) => {
    const listener = (_: unknown, payload: unknown) => cb(payload);
    ipcRenderer.on('valtrq:game-state', listener);
    return () => ipcRenderer.removeListener('valtrq:game-state', listener);
  },
  onNavigate: (cb: (route: string) => void) => {
    const listener = (_: unknown, payload: string) => cb(payload);
    ipcRenderer.on('valtrq:navigate', listener);
    return () => ipcRenderer.removeListener('valtrq:navigate', listener);
  },
  openPlayer: (name: string, tag: string, region: string) =>
    ipcRenderer.send('valtrq:open-player', { name, tag, region }),
  hotkey: {
    get: (): Promise<string> => ipcRenderer.invoke('valtrq:hotkey:get'),
    set: (accel: string): Promise<{ ok: boolean; current: string }> =>
      ipcRenderer.invoke('valtrq:hotkey:set', accel),
    default: (): Promise<string> => ipcRenderer.invoke('valtrq:hotkey:default')
  },
  overlay: {
    setClickThrough: (enabled: boolean) =>
      ipcRenderer.send('valtrq:overlay:click-through', enabled),
    hide: () => ipcRenderer.send('valtrq:overlay:hide'),
    moveTo: (corner: 'tl' | 'tr' | 'bl' | 'br') =>
      ipcRenderer.send('valtrq:overlay:move', corner)
  }
});
