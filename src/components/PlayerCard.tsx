import type { Account, PlayerMMR } from '@/types';
import RankIcon from './RankIcon';
import FavoriteStar from './FavoriteStar';

interface Props {
  account: Account;
  mmr: PlayerMMR;
}

export default function PlayerCard({ account, mmr }: Props) {
  const lastDate = mmr.rankHistory[mmr.rankHistory.length - 1]?.date ?? new Date().toISOString();

  return (
    <div className="relative bg-bg-secondary border border-border overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none" />
      <div className="absolute top-3 right-3 z-10">
        <FavoriteStar
          fav={{
            puuid: account.puuid,
            gameName: account.gameName,
            tagLine: account.tagLine,
            region: account.region,
            rankTier: mmr.currentRank,
            rankName: mmr.currentRankName,
            rr: mmr.currentRR,
            lastActivity: lastDate
          }}
        />
      </div>

      <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="relative animate-pop flex-shrink-0">
          <div className="absolute inset-0 bg-accent/20 blur-2xl" />
          <RankIcon
            tier={mmr.currentRank}
            large
            className="relative w-36 h-36 drop-shadow-[0_0_24px_rgba(255,70,85,0.4)]"
          />
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="text-[11px] uppercase tracking-brutal text-text-muted">Riot ID</div>
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight leading-none mt-1 break-words">
            {account.gameName}
            <span className="text-accent font-mono text-2xl md:text-3xl ml-2 align-middle">
              #{account.tagLine}
            </span>
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <span className="font-display text-xl uppercase tracking-brutal text-accent">
              {mmr.currentRankName}
            </span>
            <span className="font-mono text-text-primary text-lg">
              {mmr.currentRR}<span className="text-text-muted text-xs ml-1">RR</span>
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-xs uppercase tracking-brutal text-text-secondary">
              Level <span className="font-mono text-text-primary">{account.accountLevel}</span>
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-xs uppercase tracking-brutal text-text-secondary">
              <span className="font-mono text-text-primary">{account.region.toUpperCase()}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border md:flex-shrink-0">
          <Stat label="Win Rate" value={`${mmr.winRate}%`} accent />
          <Stat label="Peak" value={mmr.peakRankName} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-bg-secondary px-5 py-4 min-w-[120px] text-center">
      <div className="text-[10px] uppercase tracking-brutal text-text-muted">{label}</div>
      <div className={`font-display text-3xl mt-1 leading-none uppercase tracking-tight ${accent ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </div>
    </div>
  );
}
