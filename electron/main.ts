import { app, BrowserWindow, ipcMain, screen, globalShortcut } from 'electron';
import { join } from 'path';
import { GameWatcher } from './lockfile';

const DEFAULT_HOTKEY = 'CommandOrControl+Shift+V';
let currentHotkey = DEFAULT_HOTKEY;

const isDev = !app.isPackaged;
const USE_MOCK_WATCHER = true; // stage 1: no real Valorant client polling yet

let trackerWin: BrowserWindow | null = null;
let overlayWin: BrowserWindow | null = null;
const watcher = new GameWatcher();
let lastStatePayload: { state: string; matchId?: string } | null = null;

function rendererUrl(hash: string): string {
  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    return `${process.env['ELECTRON_RENDERER_URL']}#${hash}`;
  }
  return `file://${join(__dirname, '../renderer/index.html')}#${hash}`;
}

function createTrackerWindow(): void {
  trackerWin = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0b0f14',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      additionalArguments: ['--valtrq-window=tracker']
    }
  });
  trackerWin.loadURL(rendererUrl('/'));
  if (isDev) trackerWin.webContents.openDevTools({ mode: 'detach' });
  trackerWin.on('closed', () => { trackerWin = null; });
}

function createOverlayWindow(): void {
  const { workArea } = screen.getPrimaryDisplay();
  const W = 420;
  const H = 720;
  overlayWin = new BrowserWindow({
    width: W,
    height: H,
    x: workArea.x + workArea.width - W - 24,
    y: workArea.y + 24,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    focusable: true,                // needed so buttons can receive clicks
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      additionalArguments: ['--valtrq-window=overlay']
    }
  });
  overlayWin.setAlwaysOnTop(true, 'screen-saver');
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // Default: forward mouse events so renderer can hit-test and re-enable
  // interactivity when the cursor enters an interactive zone.
  overlayWin.setIgnoreMouseEvents(true, { forward: true });
  overlayWin.loadURL(rendererUrl('/overlay'));

  // Re-send the latest game state once the renderer is up so it never misses
  // the initial 'in-game' emit from the watcher.
  overlayWin.webContents.on('did-finish-load', () => {
    if (lastStatePayload && overlayWin) {
      overlayWin.webContents.send('valtrq:game-state', lastStatePayload);
      const visible = lastStatePayload.state === 'agent-select' || lastStatePayload.state === 'in-game';
      if (visible && !overlayWin.isVisible()) overlayWin.showInactive();
    }
  });

  overlayWin.on('closed', () => { overlayWin = null; });
}

function toggleOverlay(): void {
  if (!overlayWin) return;
  if (overlayWin.isVisible()) {
    overlayWin.hide();
  } else {
    overlayWin.showInactive();
  }
}

function registerHotkey(accel: string): boolean {
  globalShortcut.unregisterAll();
  if (!accel) {
    currentHotkey = '';
    return true;
  }
  try {
    const ok = globalShortcut.register(accel, toggleOverlay);
    if (ok) currentHotkey = accel;
    return ok;
  } catch {
    return false;
  }
}

function focusTracker(): void {
  if (!trackerWin) {
    createTrackerWindow();
    return;
  }
  if (trackerWin.isMinimized()) trackerWin.restore();
  trackerWin.show();
  trackerWin.focus();
}

function wireWatcher(): void {
  watcher.on('state', payload => {
    lastStatePayload = payload;
    if (!overlayWin) return;
    overlayWin.webContents.send('valtrq:game-state', payload);
    const visible = payload.state === 'agent-select' || payload.state === 'in-game';
    if (visible && !overlayWin.isVisible()) overlayWin.showInactive();
    if (!visible && overlayWin.isVisible()) overlayWin.hide();
  });
  watcher.start(USE_MOCK_WATCHER);
}

function wireIpc(): void {
  ipcMain.on('valtrq:overlay:click-through', (_e, enabled: boolean) => {
    overlayWin?.setIgnoreMouseEvents(!!enabled, { forward: true });
  });
  ipcMain.on('valtrq:overlay:hide', () => overlayWin?.hide());
  ipcMain.on('valtrq:overlay:move', (_e, corner: 'tl' | 'tr' | 'bl' | 'br') => {
    if (!overlayWin) return;
    const { workArea } = screen.getPrimaryDisplay();
    const [w, h] = overlayWin.getSize();
    const pad = 24;
    const pos = {
      tl: [workArea.x + pad, workArea.y + pad],
      tr: [workArea.x + workArea.width - w - pad, workArea.y + pad],
      bl: [workArea.x + pad, workArea.y + workArea.height - h - pad],
      br: [workArea.x + workArea.width - w - pad, workArea.y + workArea.height - h - pad]
    }[corner];
    overlayWin.setPosition(pos[0], pos[1]);
  });
  ipcMain.on('valtrq:open-player', (_e, payload: { name: string; tag: string; region: string }) => {
    focusTracker();
    const route = `/player/${encodeURIComponent(payload.name)}/${encodeURIComponent(payload.tag)}?region=${payload.region}`;
    trackerWin?.webContents.send('valtrq:navigate', route);
  });

  ipcMain.handle('valtrq:hotkey:get', () => currentHotkey);
  ipcMain.handle('valtrq:hotkey:set', (_e, accel: string) => {
    const ok = registerHotkey(accel);
    return { ok, current: currentHotkey };
  });
  ipcMain.handle('valtrq:hotkey:default', () => DEFAULT_HOTKEY);
}

app.whenReady().then(() => {
  createTrackerWindow();
  createOverlayWindow();
  wireWatcher();
  wireIpc();
  registerHotkey(DEFAULT_HOTKEY);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createTrackerWindow();
      createOverlayWindow();
    }
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
  watcher.stop();
  if (process.platform !== 'darwin') app.quit();
});
