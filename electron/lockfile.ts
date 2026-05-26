import { existsSync, readFileSync, watch } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { EventEmitter } from 'events';

export interface LockfileData {
  name: string;
  pid: number;
  port: number;
  password: string;
  protocol: 'http' | 'https';
}

export interface GameStatePayload {
  state: 'idle' | 'pre-game' | 'agent-select' | 'in-game' | 'post-match';
  matchId?: string;
  partyId?: string;
  map?: string;
  puuids?: string[];
}

function lockfilePath(): string {
  if (process.platform === 'win32') {
    const local = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local');
    return join(local, 'Riot Games', 'Riot Client', 'Config', 'lockfile');
  }
  return join(homedir(), 'Library', 'Application Support', 'Riot Games', 'Riot Client', 'Config', 'lockfile');
}

export function readLockfile(): LockfileData | null {
  const path = lockfilePath();
  if (!existsSync(path)) return null;
  try {
    const raw = readFileSync(path, 'utf8').trim();
    const [name, pid, port, password, protocol] = raw.split(':');
    return {
      name,
      pid: Number(pid),
      port: Number(port),
      password,
      protocol: protocol === 'https' ? 'https' : 'http'
    };
  } catch {
    return null;
  }
}

/**
 * Game-state watcher.
 *
 * Real mode (stage 2): polls local Valorant client via lockfile credentials,
 * listens to /chat/v4/presences for VALORANT partyState transitions, emits
 * game state + lobby PUUIDs.
 *
 * Mock mode (stage 1): cycles through a fake idle → agent-select → in-game
 * loop every few seconds so the overlay UI can be developed without Valorant.
 */
export class GameWatcher extends EventEmitter {
  private timer: NodeJS.Timeout | null = null;
  private fsWatcher: ReturnType<typeof watch> | null = null;
  private mockStep = 0;

  start(mock: boolean): void {
    if (mock) {
      this.startMockLoop();
      return;
    }
    // Stage 2: watch lockfile, then poll local client.
    const path = lockfilePath();
    this.emitState('idle');
    try {
      this.fsWatcher = watch(path, () => {
        const lf = readLockfile();
        // TODO: connect to https://127.0.0.1:{lf.port} with Basic 'riot:{lf.password}'
        // poll /chat/v4/presences and /product-session/v1/external-sessions
        if (lf) this.emit('lockfile', lf);
      });
    } catch {
      // lockfile does not exist yet — keep emitting idle until client starts
    }
  }

  stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.fsWatcher) { this.fsWatcher.close(); this.fsWatcher = null; }
  }

  private startMockLoop(): void {
    // Stage 1 dev: hold the overlay open in 'in-game' state so the UI is
    // always visible. State-machine cycling will return in stage 2 when we
    // wire the real client poller.
    setTimeout(() => this.emitState('in-game'), 300);
  }

  private emitState(state: GameStatePayload['state']): void {
    this.emit('state', { state, matchId: state === 'idle' ? undefined : 'mock-match-0001' });
  }
}
