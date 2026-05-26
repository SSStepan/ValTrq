import type { Roster, RosterPlayer } from '@/types';

const AGENTS = [
  { name: 'Jett', icon: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png' },
  { name: 'Reyna', icon: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png' },
  { name: 'Omen', icon: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png' },
  { name: 'Sage', icon: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png' },
  { name: 'Sova', icon: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png' },
  { name: 'Killjoy', icon: 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png' },
  { name: 'Raze', icon: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png' },
  { name: 'Phoenix', icon: 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png' },
  { name: 'Cypher', icon: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png' },
  { name: 'Brimstone', icon: 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png' }
];

const RANKS = [
  { tier: 11, name: 'Silver II' },
  { tier: 15, name: 'Gold III' },
  { tier: 17, name: 'Platinum II' },
  { tier: 21, name: 'Diamond II' },
  { tier: 24, name: 'Ascendant II' },
  { tier: 25, name: 'Immortal I' },
  { tier: 27, name: 'Immortal III' }
];

function mk(
  i: number,
  team: 'ally' | 'enemy',
  overrides: Partial<RosterPlayer> = {}
): RosterPlayer {
  const a = AGENTS[i % AGENTS.length];
  const r = RANKS[Math.floor((i * 7 + (team === 'enemy' ? 3 : 0)) % RANKS.length)];
  const peak = RANKS[Math.min(RANKS.length - 1, RANKS.indexOf(r) + 1)];
  const baseNames = ['NovaPrime', 'TenZeta', 'KazeFlick', 'IcedOut', 'Static', 'Hush', 'Vrtx', 'Pulse', 'Hexen', 'Drift'];
  const tags = ['EUW', 'NA1', 'EU1', 'KR1', 'AP1'];
  return {
    puuid: `${team}-puuid-${i}`,
    gameName: baseNames[i % baseNames.length],
    tagLine: tags[i % tags.length],
    team,
    agent: a.name,
    agentIcon: a.icon,
    locked: true,
    isSelf: team === 'ally' && i === 0,
    accountLevel: 40 + ((i * 13) % 250),
    currentRank: r.tier,
    currentRankName: r.name,
    currentRR: 10 + ((i * 17) % 90),
    peakRank: peak.tier,
    peakRankName: peak.name,
    kdAct: +(0.7 + ((i * 11) % 90) / 100).toFixed(2),
    hsAct: 18 + ((i * 7) % 28),
    winRate20: 35 + ((i * 13) % 45),
    mainAgent: AGENTS[(i + 2) % AGENTS.length].name,
    mainAgentPct: 30 + ((i * 19) % 55),
    hoursAct: 12 + ((i * 23) % 180),
    streak: i % 3 === 0
      ? { type: 'W', count: 2 + (i % 3) }
      : i % 4 === 0
      ? { type: 'L', count: 2 + (i % 2) }
      : null,
    region: 'eu',
    ...overrides
  };
}

export const MOCK_ROSTER: Roster = {
  matchId: 'mock-match-0001',
  map: 'Ascent',
  mode: 'competitive',
  state: 'in-game',
  fetchedAt: new Date().toISOString(),
  ally: [0, 1, 2, 3, 4].map(i => mk(i, 'ally')),
  enemy: [5, 6, 7, 8, 9].map(i => mk(i, 'enemy'))
};
