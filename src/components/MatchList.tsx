import { useState, useMemo } from 'react';
import type { MatchData, MatchMode } from '@/types';
import MatchCard from './MatchCard';

const FILTERS: Array<{ value: 'all' | MatchMode; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'competitive', label: 'Competitive' },
  { value: 'unrated', label: 'Unrated' },
  { value: 'deathmatch', label: 'Deathmatch' }
];

export default function MatchList({ matches }: { matches: MatchData[] }) {
  const [filter, setFilter] = useState<'all' | MatchMode>('all');
  const filtered = useMemo(
    () => (filter === 'all' ? matches : matches.filter(m => m.mode === filter)),
    [matches, filter]
  );

  const wins = filtered.filter(m => m.playerStats.won).length;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-brutal text-text-muted">Activity</div>
          <h2 className="font-display text-3xl uppercase tracking-brutal leading-none mt-1">
            Recent Matches
          </h2>
          {filtered.length > 0 && (
            <div className="text-xs text-text-secondary mt-2 font-mono">
              {wins}W <span className="text-text-muted">/</span>{' '}
              <span className="text-loss">{filtered.length - wins}L</span>{' '}
              <span className="text-text-muted">of {filtered.length}</span>
            </div>
          )}
        </div>
        <div className="flex">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-[11px] px-4 py-2 uppercase tracking-brutal font-bold border-r border-border last:border-r-0 transition-colors ${
                filter === f.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bg-secondary border border-border p-12 text-center">
          <div className="font-display text-2xl uppercase tracking-brutal text-text-muted">
            No Matches
          </div>
          <div className="text-text-secondary text-sm mt-2">
            Nothing recorded for this mode yet.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((m, i) => (
            <MatchCard key={m.matchId} match={m} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
