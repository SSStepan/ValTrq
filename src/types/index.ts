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
