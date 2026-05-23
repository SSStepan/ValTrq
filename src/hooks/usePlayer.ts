import { useEffect, useState } from 'react';
import { getAccount, getPlayerMMR } from '@/api/account';
import { getMatchlist } from '@/api/matches';
import type { Account, PlayerMMR, MatchData } from '@/types';

interface PlayerData {
  account: Account;
  mmr: PlayerMMR;
  matches: MatchData[];
}

export function usePlayer(name: string, tag: string, region = 'eu') {
  const [data, setData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const account = await getAccount(name, tag, region);
        const [mmr, matches] = await Promise.all([
          getPlayerMMR(account.puuid),
          getMatchlist(account.puuid, region)
        ]);
        if (!cancelled) setData({ account, mmr, matches });
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load player');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name, tag, region]);

  return { data, loading, error };
}
