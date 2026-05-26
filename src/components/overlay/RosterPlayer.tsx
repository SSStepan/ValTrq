import type { RosterPlayer } from '@/types';
import AgentIcon from '@/components/AgentIcon';
import RankIcon from '@/components/RankIcon';

interface Props {
  player: RosterPlayer;
  team: 'ally' | 'enemy';
  onOpen: (p: RosterPlayer) => void;
}

export default function RosterPlayerRow({ player: p, team, onOpen }: Props) {
  const accentBar = team === 'ally' ? 'bg-win/70' : 'bg-loss/70';
  return (
    <button
      type="button"
      data-interactive
      onClick={() => onOpen(p)}
      className={`relative w-full flex items-center gap-2 pl-2 pr-2 py-1.5 bg-bg-secondary/85 hover:bg-bg-tertiary/95 transition-colors border-b border-border/60 text-left ${
        p.isSelf ? 'ring-1 ring-accent ring-inset' : ''
      }`}
      title={`Main ${p.mainAgent} ${p.mainAgentPct}% / ${p.hoursAct}h this act / click for details`}
    >
      <span className={`absolute left-0 top-1 bottom-1 w-0.5 ${accentBar}`} />

      <AgentIcon
        src={p.agentIcon}
        name={p.agent}
        size={36}
        className="flex-shrink-0 border border-border"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm truncate text-text-primary">{p.gameName}</span>
          <span className="font-mono text-[10px] text-text-muted">#{p.tagLine}</span>
          {p.streak && (
            <span
              className={`text-[9px] font-mono font-bold leading-tight ${
                p.streak.type === 'W' ? 'text-win' : 'text-loss'
              }`}
            >
              {p.streak.type}{p.streak.count}
            </span>
          )}
          <span className="ml-auto text-[10px] font-mono text-text-muted">
            Lvl <span className="text-text-secondary">{p.accountLevel}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted mt-0.5">
          <span className="text-text-secondary truncate">{p.currentRankName}</span>
          <span className="text-border">/</span>
          <span>K/D <span className="text-text-primary">{p.kdAct.toFixed(2)}</span></span>
          <span className="text-border">/</span>
          <span>HS <span className="text-text-primary">{p.hsAct}%</span></span>
          <span className="text-border">/</span>
          <span>WR <span className="text-text-primary">{p.winRate20}%</span></span>
        </div>
      </div>

      <RankIcon tier={p.currentRank} className="w-8 h-8 flex-shrink-0" />
    </button>
  );
}
