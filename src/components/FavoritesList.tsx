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
    <div className="bg-bg-secondary border border-bg-tertiary p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="uppercase tracking-widest text-sm font-bold text-text-secondary">Favorites</h2>
        <span className="text-xs text-text-secondary font-mono">{favorites.length}</span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-sm text-text-secondary text-center py-6">
          No favorites yet. Open a player profile and tap the ★ to save them.
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {favorites.map(f => (
            <li key={f.puuid} className="group">
              <div className="flex items-center gap-3 bg-bg-tertiary hover:bg-bg-primary border border-transparent hover:border-accent transition-colors px-3 py-2">
                <RankIcon tier={f.rankTier} className="w-8 h-8 flex-shrink-0" />
                <Link
                  to={`/player/${encodeURIComponent(f.gameName)}/${encodeURIComponent(f.tagLine)}?region=${f.region}`}
                  className="flex-1 min-w-0"
                >
                  <div className="font-bold truncate">
                    {f.gameName}
                    <span className="text-text-secondary font-mono ml-1">#{f.tagLine}</span>
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {f.rankName} · {f.rr} RR · {timeAgo(f.lastActivity)}
                  </div>
                </Link>
                <button
                  onClick={() => remove(f.puuid)}
                  aria-label="Remove"
                  className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-loss transition-all text-xs uppercase tracking-widest px-2"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
