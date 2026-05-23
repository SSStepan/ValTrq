import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RSOLogin() {
  const { signIn, account } = useAuth();
  const nav = useNavigate();
  const [stage, setStage] = useState<'idle' | 'redirecting' | 'success'>('idle');

  async function handle() {
    setStage('redirecting');
    await signIn();
    setStage('success');
    setTimeout(() => {
      setStage('idle');
    }, 600);
  }

  if (account) {
    return (
      <button
        onClick={() => nav(`/player/${encodeURIComponent(account.gameName)}/${encodeURIComponent(account.tagLine)}?region=${account.region}`)}
        className="w-full bg-bg-secondary border border-bg-tertiary hover:border-accent transition-colors px-5 py-3 flex items-center justify-between"
      >
        <span className="flex items-center gap-3">
          <span className="w-8 h-8 bg-accent clip-angled-sm flex items-center justify-center font-bold text-white text-sm">
            {account.gameName[0]}
          </span>
          <span>
            <span className="font-bold">{account.gameName}</span>
            <span className="text-text-secondary font-mono ml-1">#{account.tagLine}</span>
          </span>
        </span>
        <span className="text-xs uppercase tracking-widest text-text-secondary">View Profile →</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handle}
        disabled={stage !== 'idle'}
        className="w-full bg-accent hover:bg-accent-hover disabled:opacity-60 transition-colors px-5 py-3 font-bold uppercase tracking-widest text-white clip-angled-sm flex items-center justify-center gap-2"
      >
        <span className="font-mono text-xs bg-white/15 px-1.5 py-0.5">R</span>
        Sign in with Riot Games
      </button>

      {stage === 'redirecting' && (
        <div className="fixed inset-0 bg-bg-primary/85 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-bg-secondary border-l-4 border-accent clip-angled p-8 max-w-sm w-full text-center">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="mt-4 font-bold uppercase tracking-widest">Redirecting to Riot Sign On…</div>
            <div className="text-text-secondary text-sm mt-2">
              You will be returned to ValTrq once authorized.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
