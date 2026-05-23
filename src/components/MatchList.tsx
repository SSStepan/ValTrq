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

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="uppercase tracking-widest text-sm font-bold text-text-secondary">Recent Matches</h2>
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs px-3 py-1.5 uppercase tracking-wide transition-colors ${
                filter === f.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bg-secondary border border-bg-tertiary p-8 text-center text-text-secondary">
          No matches for this filter.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((m, i) => <MatchCard key={m.matchId} match={m} index={i} />)}
        </div>
      )}
    </div>
  );
}
