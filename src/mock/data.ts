import type { Account, PlayerMMR, MatchData, Agent, ValorantMap, CompetitiveTier, RankHistoryEntry } from '@/types';

export const MOCK_ACCOUNTS: Account[] = [
  { puuid: 'puuid-silver-001', gameName: 'AceHunter', tagLine: 'EUW', accountLevel: 87, region: 'eu' },
  { puuid: 'puuid-plat-002', gameName: 'PhantomStrike', tagLine: 'NA1', accountLevel: 142, region: 'na' },
  { puuid: 'puuid-immo-003', gameName: 'OperatorGod', tagLine: 'EUW', accountLevel: 218, region: 'eu' }
];

const AGENTS = [
  { name: 'Jett', icon: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png' },
  { name: 'Reyna', icon: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png' },
  { name: 'Omen', icon: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png' },
  { name: 'Sage', icon: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png' },
  { name: 'Sova', icon: 'https://media.valorant-api.com/agents/ded3520f-4264-bfed-162d-b080e2abccf9/displayicon.png' }
];

const MAPS = [
  { name: 'Ascent', splash: 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png' },
  { name: 'Bind', splash: 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png' },
  { name: 'Haven', splash: 'https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png' },
  { name: 'Icebox', splash: 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png' },
  { name: 'Lotus', splash: 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png' }
];

const RANK_NAMES = [
  'Unranked', 'Iron 1', 'Iron 2', 'Iron 3',
  'Bronze 1', 'Bronze 2', 'Bronze 3',
  'Silver 1', 'Silver 2', 'Silver 3',
  'Gold 1', 'Gold 2', 'Gold 3',
  'Platinum 1', 'Platinum 2', 'Platinum 3',
  'Diamond 1', 'Diamond 2', 'Diamond 3',
  'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
  'Immortal 1', 'Immortal 2', 'Immortal 3',
  'Radiant'
];

function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genRankHistory(startRR: number, kdRange: [number, number]): RankHistoryEntry[] {
  const entries: RankHistoryEntry[] = [];
  let rr = startRR;
  const now = Date.now();
  for (let i = 14; i >= 0; i--) {
    const won = Math.random() > 0.45;
    const rrChange = won ? randRange(15, 28) : -randRange(12, 25);
    rr = Math.max(0, rr + rrChange);
    const kills = randRange(Math.floor(kdRange[0] * 15), Math.floor(kdRange[1] * 22));
    const deaths = randRange(12, 20);
    const assists = randRange(2, 8);
    entries.push({
      date: new Date(now - i * 86400000 * 0.5).toISOString(),
      rr,
      rrChange,
      map: pick(MAPS).name,
      kda: `${kills}/${deaths}/${assists}`,
      won
    });
  }
  return entries;
}

export const MOCK_MMR: Record<string, PlayerMMR> = {
  'puuid-silver-001': {
    puuid: 'puuid-silver-001',
    currentRank: 8,
    currentRankName: 'Silver 2',
    currentRR: 47,
    peakRank: 10,
    peakRankName: 'Gold 1',
    winRate: 51,
    rankHistory: genRankHistory(47, [0.8, 1.1])
  },
  'puuid-plat-002': {
    puuid: 'puuid-plat-002',
    currentRank: 14,
    currentRankName: 'Platinum 2',
    currentRR: 63,
    peakRank: 16,
    peakRankName: 'Diamond 1',
    winRate: 56,
    rankHistory: genRankHistory(63, [1.0, 1.3])
  },
  'puuid-immo-003': {
    puuid: 'puuid-immo-003',
    currentRank: 23,
    currentRankName: 'Immortal 2',
    currentRR: 81,
    peakRank: 25,
    peakRankName: 'Radiant',
    winRate: 62,
    rankHistory: genRankHistory(81, [1.3, 1.8])
  }
};

function genMatches(puuid: string, kdRange: [number, number]): MatchData[] {
  const modes: Array<'competitive' | 'unrated' | 'deathmatch'> = ['competitive', 'competitive', 'competitive', 'unrated', 'deathmatch'];
  const matches: MatchData[] = [];
  for (let i = 0; i < 10; i++) {
    const agent = pick(AGENTS);
    const map = pick(MAPS);
    const mode = pick(modes);
    const roundsWon = randRange(7, 13);
    const roundsLost = randRange(7, 13);
    const won = roundsWon > roundsLost;
    const kills = randRange(Math.floor(kdRange[0] * 16), Math.floor(kdRange[1] * 24));
    const deaths = randRange(12, 22);
    matches.push({
      matchId: `match-${puuid}-${i}`,
      map: map.name,
      mapIcon: map.splash,
      mode,
      startTime: new Date(Date.now() - i * 3600000 * 6).toISOString(),
      duration: randRange(1800, 2700),
      playerStats: {
        kills,
        deaths,
        assists: randRange(2, 9),
        agent: agent.name,
        agentIcon: agent.icon,
        score: randRange(2800, 4500),
        team: Math.random() > 0.5 ? 'Blue' : 'Red',
        roundsWon,
        roundsLost,
        won,
        headshotPct: randRange(18, 38),
        adr: randRange(110, 185)
      }
    });
  }
  return matches;
}

export const MOCK_MATCHES: Record<string, MatchData[]> = {
  'puuid-silver-001': genMatches('puuid-silver-001', [0.8, 1.1]),
  'puuid-plat-002': genMatches('puuid-plat-002', [1.0, 1.3]),
  'puuid-immo-003': genMatches('puuid-immo-003', [1.3, 1.8])
};

export const MOCK_AGENTS: Agent[] = AGENTS.map((a, i) => ({
  uuid: `agent-${i}`,
  displayName: a.name,
  displayIcon: a.icon,
  role: 'Duelist'
}));

export const MOCK_MAPS: ValorantMap[] = MAPS.map((m, i) => ({
  uuid: `map-${i}`,
  displayName: m.name,
  splash: m.splash
}));

export const MOCK_TIERS: CompetitiveTier[] = RANK_NAMES.map((name, i) => ({
  tier: i,
  tierName: name,
  smallIcon: `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${i}/smallicon.png`,
  largeIcon: `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${i}/largeicon.png`
}));

export function findAccount(name: string, tag: string): Account | undefined {
  return MOCK_ACCOUNTS.find(
    a => a.gameName.toLowerCase() === name.toLowerCase() && a.tagLine.toLowerCase() === tag.toLowerCase()
  ) ?? MOCK_ACCOUNTS[0];
}
