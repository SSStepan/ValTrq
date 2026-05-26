import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import RankIcon from './RankIcon';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function FavoritesList() {
  const { favorites, remove } = useFavorites();

  return (
    <section className="bg-bg-secondary border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <div className="text-[10px] uppercase tracking-brutal text-text-muted">Saved</div>
          <h2 className="font-display text-xl uppercase tracking-brutal leading-none mt-0.5">
            Favorites
          </h2>
        </div>
        <span className="font-mono text-2xl text-accent font-bold leading-none">
          {String(favorites.length).padStart(2, '0')}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-sm text-text-secondary text-center py-10 px-4">
          Save a player from their profile to pin them here.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {favorites.map(f => (
            <li key={f.puuid} className="group">
              <div className="flex items-center gap-3 hover:bg-bg-tertiary transition-colors px-4 py-3 relative">
                <div className="absolute inset-y-0 left-0 w-0.5 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                <RankIcon tier={f.rankTier} className="w-9 h-9 flex-shrink-0" />
                <Link
                  to={`/player/${encodeURIComponent(f.gameName)}/${encodeURIComponent(f.tagLine)}?region=${f.region}`}
                  className="flex-1 min-w-0"
                >
                  <div className="font-bold truncate">
                    {f.gameName}
                    <span className="text-text-muted font-mono ml-1">#{f.tagLine}</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-brutal text-text-muted truncate mt-0.5">
                    <span className="text-text-secondary">{f.rankName}</span>
                    <span className="mx-1.5">/</span>
                    <span className="font-mono text-accent">{f.rr}</span> RR
                    <span className="mx-1.5">/</span>
                    <span className="font-mono">{timeAgo(f.lastActivity)}</span>
                  </div>
                </Link>
                <button
                  onClick={() => remove(f.puuid)}
                  aria-label="Remove from favorites"
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-loss transition-all text-xs uppercase tracking-brutal px-2"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
