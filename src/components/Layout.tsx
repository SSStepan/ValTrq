import { Link, NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

const NAV = [
  { to: '/', label: 'Search' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About' }
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-accent clip-notch-l flex items-center justify-center font-display text-2xl text-white leading-none pt-0.5">
                V
              </div>
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-accent" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-brutal uppercase group-hover:text-accent transition-colors">
                ValTrq
              </span>
              <span className="text-[10px] uppercase tracking-brutal text-text-muted mt-0.5">
                Performance Tracker
              </span>
            </div>
          </Link>
          <nav className="flex items-center">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative px-5 h-16 flex items-center text-xs font-bold uppercase tracking-brutal transition-colors ${
                    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] uppercase tracking-brutal text-text-muted">
          <span>ValTrq Prototype</span>
          <span className="hidden sm:block">Mock Dataset Active</span>
          <span>Not Affiliated With Riot Games</span>
        </div>
      </footer>
    </div>
  );
}
