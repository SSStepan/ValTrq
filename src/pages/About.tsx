export default function About() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <header>
        <div className="text-[10px] uppercase tracking-brutal text-accent font-bold">About</div>
        <h1 className="font-display text-5xl uppercase tracking-brutal leading-none mt-1">
          ValTrq
        </h1>
        <p className="text-text-secondary mt-3 text-lg">
          A desktop overlay and lookup tool for Valorant. No sign-in, no servers, no databases.
        </p>
      </header>

      <Section title="What It Does">
        <p>
          ValTrq has two surfaces. The <strong>overlay</strong> is a transparent always-on-top
          window that appears during a match (after agent select locks in) and shows roster
          stats for all 10 players: rank, K/D this act, headshot %, recent win rate, main agent,
          streak. The <strong>tracker page</strong> lets you look up any player by Riot ID
          (Name#Tag) and view their rank, MMR history and recent matches. Players you visit can
          be pinned to favorites for quick access.
        </p>
      </Section>

      <Section title="User Flow">
        <ol className="space-y-2 text-text-primary">
          {[
            'Open ValTrq.',
            'Type a Riot ID (Name#Tag) and pick a region, or click a sample profile.',
            'View the player\'s rank, RR history graph, and recent matches.',
            'Pin the player with the star icon to keep them in your Favorites.',
            'Launch Valorant. When a match starts and agents lock in, the overlay appears automatically with roster stats. Toggle visibility with the configured hotkey.'
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-accent text-sm pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Privacy">
        <ul className="space-y-2">
          {[
            'No sign-in. ValTrq has no user accounts.',
            'No backend. There is no ValTrq server collecting or storing your data.',
            'All stats are looked up by Riot ID through the public Valorant API.',
            'In-game roster PUUIDs are read from your local Valorant client (lockfile + local HTTP), the same way Blitz and Tracker.gg work. Nothing is uploaded.',
            'Favorites, hotkey, and preferences are stored in localStorage on this machine. Clearing them in Settings wipes the data.'
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-accent mt-2 w-1 h-1 bg-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tech Stack">
        <dl className="grid grid-cols-2 gap-y-3 gap-x-6 font-mono text-sm">
          {[
            ['Framework', 'Electron + React + TS'],
            ['Build', 'electron-vite'],
            ['Styling', 'Tailwind CSS v3'],
            ['Charts', 'Recharts'],
            ['HTTP', 'axios'],
            ['Local Client', 'Riot lockfile + 127.0.0.1 HTTPS']
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] uppercase tracking-brutal text-text-muted">{k}</dt>
              <dd className="text-text-primary mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Contact">
        <dl className="space-y-2">
          {[
            ['Email', 'deburuni@mail.ru'],
            ['Discord', 'cprcorn'],
            ['Project', 'https://ssstepan.github.io/ValTrq/']
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4">
              <dt className="text-[10px] uppercase tracking-brutal text-text-muted w-20 pt-1">{k}</dt>
              <dd className="text-text-primary font-mono text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="text-xs text-text-muted border-t border-border pt-5 leading-relaxed">
        ValTrq is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games
        or anyone officially involved in producing or managing Riot Games properties. Riot Games and
        all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-bg-secondary border border-border">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="font-display text-lg uppercase tracking-brutal leading-none">{title}</h2>
      </div>
      <div className="p-5 text-text-primary leading-relaxed">{children}</div>
    </section>
  );
}
