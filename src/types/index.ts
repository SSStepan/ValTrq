export interface Account {
  puuid: string;
  gameName: string;
  tagLine: string;
  accountLevel: number;
  region: string;
}

export interface RankHistoryEntry {
  date: string;
  rr: number;
  rrChange: number;
  map: string;
  kda: string;
  won: boolean;
}

export interface PlayerMMR {
  puuid: string;
  currentRank: number;
  currentRankName: string;
  currentRR: number;
  peakRank: number;
  peakRankName: string;
  winRate: number;
  rankHistory: RankHistoryEntry[];
}

export type MatchMode = 'competitive' | 'unrated' | 'deathmatch' | 'spikerush';

export interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  agent: string;
  agentIcon: string;
  score: number;
  team: 'Blue' | 'Red';
  roundsWon: number;
  roundsLost: number;
  won: boolean;
  headshotPct: number;
  adr: number;
}

export interface MatchData {
  matchId: string;
  map: string;
  mapIcon: string;
  mode: MatchMode;
  startTime: string;
  duration: number;
  playerStats: PlayerStats;
}

export interface Agent {
  uuid: string;
  displayName: string;
  displayIcon: string;
  role: string;
}

export interface ValorantMap {
  uuid: string;
  displayName: string;
  splash: string;
}

export interface CompetitiveTier {
  tier: number;
  tierName: string;
  smallIcon: string;
  largeIcon: string;
}

/* ---- Overlay roster ---- */

export type GameState =
  | 'idle'           // client closed or main menu
  | 'pre-game'       // queue popped, accepting
  | 'agent-select'   // picking agents
  | 'in-game'        // round 1+ live
  | 'post-match';    // results screen

export type Team = 'ally' | 'enemy';

export interface RosterPlayer {
  puuid: string;
  gameName: string;
  tagLine: string;
  team: Team;
  agent: string;
  agentIcon: string;
  locked: boolean;            // agent locked-in
  isSelf: boolean;            // owner of this client
  accountLevel: number;
  currentRank: number;
  currentRankName: string;
  currentRR: number;
  peakRank: number;
  peakRankName: string;
  kdAct: number;              // average K/D this act
  hsAct: number;              // headshot % this act
  winRate20: number;          // win rate last 20 ranked
  mainAgent: string;
  mainAgentPct: number;       // % of last 20 on main
  hoursAct: number;           // hours played this act
  streak: { type: 'W' | 'L'; count: number } | null;
  region: string;
}

export interface Roster {
  matchId: string;
  map: string;
  mode: MatchMode;
  state: GameState;
  fetchedAt: string;
  ally: RosterPlayer[];
  enemy: RosterPlayer[];
}
