import type { MatchData } from '@/types';
import AgentIcon from './AgentIcon';
import { formatDateTime, kdRatio } from '@/utils/format';

interface Props {
  match: MatchData;
  index?: number;
}

export default function MatchCard({ match, index = 0 }: Props) {
  const p = match.playerStats;
  const won = p.won;
  return (
    <div
      className="group relative flex items-stretch bg-bg-secondary border border-border hover:border-accent/60 transition-all duration-200 animate-fadein overflow-hidden"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(11,15,20,0.95) 0%, rgba(11,15,20,0.65) 55%, transparent 100%), url(${match.mapIcon})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className={`relative w-2 ${won ? 'bg-win' : 'bg-loss'}`} />

      <div className="relative flex-1 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[220px_1fr_auto_auto] items-center gap-4 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <AgentIcon
            src={p.agentIcon}
            name={p.agent}
            size={64}
            className="flex-shrink-0 border border-border"
          />
          <div className="min-w-0">
            <div className="font-display text-xl uppercase tracking-brutal leading-none truncate">
              {p.agent}
            </div>
            <div className="text-sm text-text-secondary truncate mt-1">{match.map}</div>
            <div className="text-[10px] uppercase tracking-brutal text-text-muted mt-0.5">
              {match.mode}
            </div>
          </div>
        </div>

        <div className="text-center min-w-[180px]">
          <div className="font-mono text-3xl font-bold leading-none">
            <span>{p.kills}</span>
            <span className="text-text-muted mx-1.5">/</span>
            <span className="text-loss">{p.deaths}</span>
            <span className="text-text-muted mx-1.5">/</span>
            <span>{p.assists}</span>
          </div>
          <div className="text-[11px] uppercase tracking-brutal text-text-muted mt-2">
            <span className="font-mono text-text-secondary">K/D {kdRatio(p.kills, p.deaths)}</span>
            <span className="mx-2 text-text-muted">/</span>
            <span className="font-mono text-text-secondary">ADR {p.adr}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-1 bg-bg-elevated w-28 overflow-hidden" title={`Headshot ${p.headshotPct}%`}>
              <div className="h-full bg-accent" style={{ width: `${p.headshotPct}%` }} />
            </div>
            <span className="text-[10px] uppercase tracking-brutal text-text-muted font-mono">
              HS {p.headshotPct}%
            </span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center min-w-[80px]">
          <div className="font-mono text-2xl leading-none">
            <span className="text-win">{p.roundsWon}</span>
            <span className="text-text-muted mx-1">:</span>
            <span className="text-loss">{p.roundsLost}</span>
          </div>
          <div className="text-[10px] uppercase tracking-brutal text-text-muted mt-2">Rounds</div>
        </div>

        <div className="flex flex-col items-center sm:items-end min-w-[100px]">
          <div
            className={`font-display text-2xl uppercase tracking-brutal leading-none ${
              won ? 'text-win' : 'text-loss'
            }`}
          >
            {won ? 'Victory' : 'Defeat'}
          </div>
          <div className="text-[10px] uppercase tracking-brutal text-text-muted mt-2 font-mono">
            {formatDateTime(match.startTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
