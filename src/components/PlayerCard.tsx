import type { Account, PlayerMMR } from '@/types';
import RankIcon from './RankIcon';
import FavoriteStar from './FavoriteStar';

interface Props {
  account: Account;
  mmr: PlayerMMR;
}

export default function PlayerCard({ account, mmr }: Props) {
  return (
    <div className="relative bg-bg-secondary border-l-4 border-accent clip-angled p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="absolute top-2 right-3">
        <FavoriteStar
          fav={{
            puuid: account.puuid,
            gameName: account.gameName,
            tagLine: account.tagLine,
            region: account.region,
            rankTier: mmr.currentRank,
            rankName: mmr.currentRankName,
            rr: mmr.currentRR,
            lastActivity: mmr.rankHistory[mmr.rankHistory.length - 1]?.date ?? new Date().toISOString()
          }}
        />
      </div>
      <div className="relative animate-pop">
        <RankIcon tier={mmr.currentRank} large className="w-32 h-32 drop-shadow-[0_0_18px_rgba(255,70,85,0.35)]" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="text-xs uppercase tracking-widest text-text-secondary">Riot ID</div>
        <h1 className="text-3xl font-bold mb-1">
          {account.gameName}
          <span className="text-text-secondary font-mono text-xl ml-2">#{account.tagLine}</span>
        </h1>
        <div className="text-lg uppercase tracking-wide text-accent font-bold">{mmr.currentRankName}</div>
        <div className="text-text-secondary text-sm mt-1">
          <span className="font-mono text-text-primary">{mmr.currentRR}</span> RR · Level{' '}
          <span className="font-mono text-text-primary">{account.accountLevel}</span> · Region{' '}
          <span className="uppercase font-mono text-text-primary">{account.region}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <Stat label="Win Rate" value={`${mmr.winRate}%`} />
        <Stat label="Peak" value={mmr.peakRankName} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-tertiary px-4 py-3 min-w-[100px]">
      <div className="text-xs uppercase tracking-widest text-text-secondary">{label}</div>
      <div className="font-bold text-lg text-text-primary mt-1">{value}</div>
    </div>
  );
}
