import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlayerCard from '@/components/PlayerCard';
import RankHistory from '@/components/RankHistory';
import MatchList from '@/components/MatchList';
import RSOLogin from '@/components/RSOLogin';
import Disclaimer from '@/components/Disclaimer';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import { PlayerCardSkeleton, RankHistorySkeleton, MatchCardSkeleton } from '@/components/skeletons';
import FavoritesList from '@/components/FavoritesList';
import { usePlayer } from '@/hooks/usePlayer';
import { MOCK_ACCOUNTS } from '@/mock/data';

function SearchPage() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center mt-4">
        <h1 className="text-4xl font-bold uppercase tracking-widest">
          Track your <span className="text-accent">Valorant</span> career
        </h1>
        <p className="text-text-secondary mt-2 max-w-xl mx-auto">
          Rank, MMR history, and match stats — search any Riot ID to begin.
        </p>
      </div>

      <SearchBar onSearch={(n, t, r) => nav(`/player/${encodeURIComponent(n)}/${encodeURIComponent(t)}?region=${r}`)} />

      <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-3 text-text-secondary text-xs uppercase tracking-widest">
        <div className="h-px bg-bg-tertiary" />
        <div>or</div>
        <div className="h-px bg-bg-tertiary" />
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        <RSOLogin />
        <Disclaimer />
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="bg-bg-secondary border border-bg-tertiary p-5">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-3">Try a sample profile</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {MOCK_ACCOUNTS.map(a => (
              <Link
                key={a.puuid}
                to={`/player/${encodeURIComponent(a.gameName)}/${encodeURIComponent(a.tagLine)}?region=${a.region}`}
                className="bg-bg-tertiary hover:bg-bg-primary border border-bg-tertiary hover:border-accent transition-colors p-4 block"
              >
                <div className="font-bold">{a.gameName}<span className="text-text-secondary font-mono ml-1">#{a.tagLine}</span></div>
                <div className="text-xs uppercase tracking-wider text-text-secondary mt-1">Level {a.accountLevel} · {a.region.toUpperCase()}</div>
              </Link>
            ))}
          </div>
        </div>

        <FavoritesList />
      </div>
    </div>
  );
}

function PlayerNotFound({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary p-12 text-center clip-angled">
      <div className="text-6xl text-accent/40 font-bold uppercase tracking-widest">404</div>
      <div className="mt-3 text-xl font-bold uppercase tracking-widest">Player not found</div>
      <div className="text-text-secondary mt-2">
        We couldn't find <span className="font-mono text-text-primary">{name}#{tag}</span>.
        Check the Riot ID and region, then try again.
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

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/player/:name/:tag" element={<PlayerPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
