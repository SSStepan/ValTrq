import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const { account, isPublic, setPublic, signOut } = useAuth();
  const nav = useNavigate();

  function disconnect() {
    signOut();
    nav('/');
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-widest">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your Riot connection and data sharing preferences.</p>
      </div>

      <section className="bg-bg-secondary border border-bg-tertiary p-5">
        <h2 className="uppercase tracking-widest text-sm font-bold text-text-secondary mb-3">Account</h2>
        {account ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">
                {account.gameName}
                <span className="text-text-secondary font-mono ml-2">#{account.tagLine}</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-text-secondary mt-1">
                Region {account.region.toUpperCase()} · Level {account.accountLevel}
              </div>
            </div>
            <button
              onClick={disconnect}
              className="bg-loss/10 border border-loss text-loss hover:bg-loss hover:text-white transition-colors px-4 py-2 text-sm uppercase tracking-widest font-bold"
            >
              Disconnect Riot Account
            </button>
          </div>
        ) : (
          <div className="text-text-secondary">Not signed in.</div>
        )}
      </section>

      <section className="bg-bg-secondary border border-bg-tertiary p-5">
        <h2 className="uppercase tracking-widest text-sm font-bold text-text-secondary mb-4">Privacy</h2>

        <label className="flex items-start justify-between gap-4 cursor-pointer">
          <div>
            <div className="font-bold">Make my profile public</div>
            <div className="text-sm text-text-secondary mt-0.5">
              Other ValTrq users can search and view your rank, MMR history and matches.
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            onClick={() => setPublic(!isPublic)}
            className={`relative w-12 h-6 transition-colors flex-shrink-0 ${
              isPublic ? 'bg-accent' : 'bg-bg-tertiary'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white transition-transform ${
                isPublic ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </label>

        <div className="text-xs text-text-secondary mt-5 leading-relaxed border-t border-bg-tertiary pt-4">
          <strong className="text-text-primary uppercase tracking-wider block mb-1">Your data</strong>
          ValTrq stores only the data needed to show your stats: Riot ID, PUUID, rank, MMR history and match summaries.
          We never store credentials. Disconnecting your account removes all locally cached data and revokes the RSO token.
          You can request full data deletion at any time.
        </div>
      </section>
    </div>
  );
}
