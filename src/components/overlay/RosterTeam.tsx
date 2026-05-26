import type { RosterPlayer, Team } from '@/types';
import RosterPlayerRow from './RosterPlayer';

interface Props {
  team: Team;
  players: RosterPlayer[];
  onOpen: (p: RosterPlayer) => void;
}

export default function RosterTeam({ team, players, onOpen }: Props) {
  const accent = team === 'ally' ? 'bg-win' : 'bg-loss';
  const label = team === 'ally' ? 'Allies' : 'Enemies';
  const avgKD = (players.reduce((a, p) => a + p.kdAct, 0) / players.length).toFixed(2);

  return (
    <section className="bg-bg-primary/70 backdrop-blur-md border border-border">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-4 ${accent}`} />
          <span className="font-display text-sm uppercase tracking-brutal leading-none">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-brutal text-text-muted">
          Avg K/D <span className="text-text-primary">{avgKD}</span>
        </span>
      </div>
      <div>
        {players.map(p => (
          <RosterPlayerRow key={p.puuid} player={p} team={team} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
