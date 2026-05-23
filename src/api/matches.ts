import { USE_MOCK, delay, riotClient, regionToValHost } from './client';
import { MOCK_MATCHES } from '@/mock/data';
import type { MatchData } from '@/types';

export async function getMatchlist(puuid: string, region = 'eu'): Promise<MatchData[]> {
  if (USE_MOCK) {
    const list = MOCK_MATCHES[puuid] ?? Object.values(MOCK_MATCHES)[0];
    return delay(list);
  }
  const host = regionToValHost(region);
  const { data } = await riotClient.get(`${host}/val/match/v1/matchlists/by-puuid/${puuid}`);
  return data.history ?? [];
}

export async function getMatch(matchId: string, region = 'eu'): Promise<MatchData | null> {
  if (USE_MOCK) {
    for (const list of Object.values(MOCK_MATCHES)) {
      const m = list.find(x => x.matchId === matchId);
      if (m) return delay(m);
    }
    return null;
  }
  const host = regionToValHost(region);
  const { data } = await riotClient.get(`${host}/val/match/v1/matches/${matchId}`);
  return data;
}
