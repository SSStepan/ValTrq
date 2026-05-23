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
      className="relative flex items-stretch bg-bg-secondary border border-bg-tertiary hover:border-accent/50 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/40 transition-all duration-200 animate-fadein overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(15,25,35,0.85) 70%), url(${match.mapIcon})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className={`relative w-1.5 ${won ? 'bg-win' : 'bg-loss'}`} />
      <div className="relative flex-1 flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="flex items-center gap-3 min-w-[180px]">
          <AgentIcon src={p.agentIcon} name={p.agent} size={56} className="clip-angled-sm" />
          <div>
            <div className="font-bold">{p.agent}</div>
            <div className="text-sm text-text-secondary">{match.map}</div>
            <div className="text-xs uppercase tracking-wider text-text-secondary mt-0.5">{match.mode}</div>
          </div>
        </div>

        <div className="flex-1 text-center min-w-[160px]">
          <div className="font-mono text-2xl font-bold">
            <span>{p.kills}</span>
            <span className="text-text-secondary mx-1">/</span>
            <span className="text-loss">{p.deaths}</span>
            <span className="text-text-secondary mx-1">/</span>
            <span>{p.assists}</span>
          </div>
          <div className="text-xs text-text-secondary mt-0.5">
            K/D {kdRatio(p.kills, p.deaths)} · ADR {p.adr}
          </div>
          <div className="mt-2 h-1 bg-bg-tertiary w-32 mx-auto overflow-hidden" title={`Headshot ${p.headshotPct}%`}>
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${p.headshotPct}%` }}
            />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">HS {p.headshotPct}%</div>
        </div>

        <div className="flex flex-col items-center min-w-[100px]">
          <div className="font-mono text-lg">
            <span className="text-win">{p.roundsWon}</span>
            <span className="text-text-secondary mx-1">:</span>
            <span className="text-loss">{p.roundsLost}</span>
          </div>
          <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${won ? 'text-win' : 'text-loss'}`}>
            {won ? 'Victory' : 'Defeat'}
          </div>
          <div className="text-xs text-text-secondary mt-1">{formatDateTime(match.startTime)}</div>
        </div>
      </div>
    </div>
  );
}
