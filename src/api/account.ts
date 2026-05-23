import { USE_MOCK, delay, riotClient, regionToAccountHost } from './client';
import { findAccount, MOCK_MMR } from '@/mock/data';
import type { Account, PlayerMMR } from '@/types';

export async function getAccount(name: string, tag: string, region = 'eu'): Promise<Account> {
  if (USE_MOCK) {
    const acc = findAccount(name, tag);
    if (!acc) throw new Error('Player not found');
    return delay({ ...acc, region });
  }
  const host = regionToAccountHost(region);
  const { data } = await riotClient.get(
    `${host}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
  );
  return {
    puuid: data.puuid,
    gameName: data.gameName,
    tagLine: data.tagLine,
    accountLevel: 0,
    region
  };
}

export async function getPlayerMMR(puuid: string): Promise<PlayerMMR> {
  if (USE_MOCK) {
    const mmr = MOCK_MMR[puuid] ?? Object.values(MOCK_MMR)[0];
    return delay(mmr);
  }
  throw new Error('Not implemented for production API');
}
