import { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlayerCard from '@/components/PlayerCard';
import RankHistory from '@/components/RankHistory';
import MatchList from '@/components/MatchList';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Overlay from '@/pages/Overlay';
import { PlayerCardSkeleton, RankHistorySkeleton, MatchCardSkeleton } from '@/components/skeletons';
import FavoritesList from '@/components/FavoritesList';
import { usePlayer } from '@/hooks/usePlayer';
import { MOCK_ACCOUNTS } from '@/mock/data';

function SearchPage() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col gap-10">
      <section className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-end pt-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-brutal text-accent font-bold mb-4">
            <span className="w-6 h-px bg-accent" />
            Riot ID Lookup
          </div>
          <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.85] tracking-tight">
            Track your
            <br />
            <span className="text-accent">Valorant</span> career
          </h1>
          <p className="text-text-secondary mt-5 max-w-md text-base leading-relaxed">
            Rank, RR trajectory, and per-match stats. Search any Riot ID and pin players to your favorites for quick access.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-2 font-mono text-[11px] uppercase tracking-brutal text-text-muted">
          <div className="flex items-center gap-2">
            <span>Mock Dataset</span>
            <span className="w-1.5 h-1.5 bg-win" />
          </div>
          <div>Prototype Build</div>
        </div>
      </section>

      <SearchBar onSearch={(n, t, r) => nav(`/player/${encodeURIComponent(n)}/${encodeURIComponent(t)}?region=${r}`)} />

      <div className="grid md:grid-cols-[1fr_340px] gap-6">
        <section className="bg-bg-secondary border border-border">
          <div className="p-5 border-b border-border flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-brutal text-text-muted">Demo</div>
              <h2 className="font-display text-2xl uppercase tracking-brutal leading-none mt-0.5">
                Sample Profiles
              </h2>
            </div>
            <span className="text-[10px] uppercase tracking-brutal text-text-muted font-mono">
              {MOCK_ACCOUNTS.length} Loaded
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-border">
            {MOCK_ACCOUNTS.map(a => (
              <Link
                key={a.puuid}
                to={`/player/${encodeURIComponent(a.gameName)}/${encodeURIComponent(a.tagLine)}?region=${a.region}`}
                className="group relative bg-bg-secondary hover:bg-bg-tertiary transition-colors p-5 block"
              >
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                <div className="font-display text-xl uppercase tracking-brutal leading-none truncate">
                  {a.gameName}
                </div>
                <div className="text-accent font-mono text-sm mt-1">#{a.tagLine}</div>
                <div className="text-[10px] uppercase tracking-brutal text-text-muted mt-3 font-mono">
                  Lvl {a.accountLevel}
                  <span className="mx-1.5 text-border">/</span>
                  {a.region.toUpperCase()}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <FavoritesList />
      </div>
    </div>
  );
}

function PlayerNotFound({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="relative bg-bg-secondary border border-border p-16 text-center corner-accent">
      <div className="font-display text-8xl text-accent/30 uppercase tracking-tight leading-none">
        404
      </div>
      <div className="mt-4 font-display text-3xl uppercase tracking-brutal">
        Player Not Found
      </div>
      <div className="text-text-secondary mt-3 max-w-md mx-auto">
        We could not locate <span className="font-mono text-text-primary">{name}#{tag}</span>.
        Verify the Riot ID and region, then try again.
      </div>
    </div>
  );
}

function PlayerPage() {
  const { name = '', tag = '' } = useParams();
  const region = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('region') ?? 'eu';
  const nav = useNavigate();
  const { data, loading, error } = usePlayer(decodeURIComponent(name), decodeURIComponent(tag), region);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        initialName={decodeURIComponent(name)}
        initialTag={decodeURIComponent(tag)}
        onSearch={(n, t, r) => nav(`/player/${encodeURIComponent(n)}/${encodeURIComponent(t)}?region=${r}`)}
      />

      {loading && (
        <>
          <PlayerCardSkeleton />
          <RankHistorySkeleton />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        </>
      )}

      {error && <PlayerNotFound name={decodeURIComponent(name)} tag={decodeURIComponent(tag)} />}

      {data && (
        <>
          <PlayerCard account={data.account} mmr={data.mmr} />
          <RankHistory mmr={data.mmr} />
          <MatchList matches={data.matches} />
        </>
      )}
    </div>
  );
}

function TrackerShell() {
  const nav = useNavigate();
  useEffect(() => {
    if (!window.valtrq || window.valtrq.isOverlay) return;
    const off = window.valtrq.onNavigate(route => nav(route));
    // Replay user's stored hotkey to main on startup so the binding survives restart.
    try {
      const stored = localStorage.getItem('valtrq:hotkey');
      if (stored) window.valtrq.hotkey.set(stored);
    } catch {
      // ignore storage failures
    }
    return () => off?.();
  }, [nav]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/player/:name/:tag" element={<PlayerPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  if (window.valtrq?.isOverlay) {
    return (
      <Routes>
        <Route path="*" element={<Overlay />} />
      </Routes>
    );
  }
  return <TrackerShell />;
}
