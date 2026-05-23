export default function About() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header>
        <div className="text-xs uppercase tracking-widest text-accent">About</div>
        <h1 className="text-3xl font-bold uppercase tracking-widest mt-1">
          ValTrq — Valorant Performance Tracker
        </h1>
        <p className="text-text-secondary mt-2">
          A desktop application for tracking personal Valorant competitive performance.
        </p>
      </header>

      <Section title="Description">
        Players opt-in via Riot Sign On (RSO) to view their match history, rank progression,
        and detailed statistics. ValTrq is built as a focused, distraction-free tool for
        competitive self-improvement — not a scouting tool.
      </Section>

      <Section title="User Flow">
        <ol className="list-decimal pl-5 space-y-1.5 text-text-primary">
          <li>Player launches ValTrq and clicks <em>Sign in with Riot Account</em>.</li>
          <li>The user is redirected to Riot's official RSO page and grants consent.</li>
          <li>ValTrq fetches the player's profile: rank, RR, match history, per-match stats.</li>
          <li>The player can browse their stats, MMR history graph, and recent matches.</li>
          <li>The player can opt out at any time from <em>Settings → Disconnect Riot Account</em>,
            which revokes the RSO token and clears locally cached data.</li>
        </ol>
      </Section>

      <Section title="Privacy & Consent">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Data is only fetched for players who have explicitly authorized ValTrq through RSO.</li>
          <li>Profiles are <strong>private by default</strong> unless the player toggles "Make my profile public" in Settings.</li>
          <li>ValTrq never stores Riot credentials. Only the OAuth token and profile snapshot are kept locally.</li>
          <li>Disconnecting the account removes all locally cached data and revokes the token.</li>
          <li>Players can request full data deletion at any time.</li>
        </ul>
      </Section>

      <Section title="Tech Stack">
        <ul className="grid grid-cols-2 gap-y-1.5 text-text-primary font-mono text-sm">
          <li>Framework — Electron + React + TypeScript</li>
          <li>Build — electron-vite</li>
          <li>Styling — Tailwind CSS v3</li>
          <li>Charts — Recharts</li>
          <li>HTTP — axios</li>
          <li>Auth — Riot Sign On (OAuth 2.0)</li>
        </ul>
      </Section>

      <Section title="Contact">
        <div className="text-text-primary">
          <div><span className="text-text-secondary uppercase tracking-wider text-xs mr-2">Email</span> contact@valtrq.app</div>
          <div><span className="text-text-secondary uppercase tracking-wider text-xs mr-2">Project</span> https://valtrq.app</div>
        </div>
      </Section>

      <div className="text-xs text-text-secondary border-t border-bg-tertiary pt-4">
        ValTrq isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games
        or anyone officially involved in producing or managing Riot Games properties. Riot Games and
        all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-bg-secondary border border-bg-tertiary p-5">
      <h2 className="uppercase tracking-widest text-sm font-bold text-text-secondary mb-3">{title}</h2>
      <div className="text-text-primary leading-relaxed">{children}</div>
    </section>
  );
}
