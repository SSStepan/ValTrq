import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <header className="border-b border-bg-tertiary bg-bg-secondary">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-accent clip-angled-sm flex items-center justify-center font-bold text-white text-lg">
              V
            </div>
            <div className="font-bold tracking-widest text-lg uppercase group-hover:text-accent transition-colors">
              ValTrq
            </div>
          </Link>
          <nav className="flex gap-6 text-sm uppercase tracking-wider text-text-secondary">
            <Link to="/" className="hover:text-text-primary">Search</Link>
            <Link to="/settings" className="hover:text-text-primary">Settings</Link>
            <Link to="/about" className="hover:text-text-primary">About</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
      <footer className="border-t border-bg-tertiary text-xs text-text-secondary text-center py-3">
        ValTrq prototype · Mock data · Not affiliated with Riot Games
      </footer>
    </div>
  );
}
