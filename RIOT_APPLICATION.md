# ValTrq — Production API Key Application

## Project Name
**ValTrq** — Valorant Performance Tracker

## Project Type
Desktop application (Electron + React + TypeScript) for personal Valorant competitive
performance tracking.

## URL
https://valtrq.app (placeholder — to be replaced before submission)

## Contact
- Email: contact@valtrq.app
- Discord: valtrq#0001 (placeholder)

---

## 1. Summary

ValTrq is a focused, distraction-free desktop application that lets a Valorant player
track their own competitive progression: current rank, RR, MMR history, and detailed
match-by-match statistics. The app is intentionally narrow in scope — it does not host
forums, leaderboards, or scouting tools. It is a personal-improvement instrument for
a single authenticated player at a time.

## 2. Use Case

A competitive Valorant player wants to:
1. See their current rank tier and RR at a glance.
2. Review how their RR has trended over the last 15 ranked matches.
3. Inspect recent matches with K/D/A, headshot percentage, ADR, agent, map and round
   score, to identify patterns (best/worst agents, best/worst maps, win streaks).
4. Optionally make their profile public so a small circle of teammates can review it.

ValTrq fills this need with a clean, performance-oriented UI in the visual language of
Valorant (dark, angular, red accent), built as a native desktop client so it does not
compete for browser tab space during play sessions.

## 3. User Flow

1. **Launch** — User opens ValTrq from desktop.
2. **Sign in with Riot Account** — User clicks the RSO button. A standard Riot OAuth 2.0
   authorization flow opens; the user grants consent on Riot's official page.
3. **First profile load** — On callback, ValTrq exchanges the auth code for an access
   token, calls `account-v1` to resolve PUUID, then `val-match-v1` and `val-ranked-v1`
   to populate the dashboard.
4. **Browse** — User sees:
   - Player card (rank icon, tier name, RR, peak rank, win rate, level).
   - RR-history line chart (last 15 matches, green/red dots for W/L, tooltip with
     map and K/D/A).
   - Recent matches list, filterable by mode (Competitive / Unrated / Deathmatch),
     each card showing agent, map, K/D/A, headshot %, ADR, round score, W/L.
5. **Favorites (opt-in)** — User can star public profiles (e.g. their own duo
   partner who has also authorized ValTrq). Favorites are stored locally.
6. **Settings** — User can toggle `Make my profile public` (off by default) and
   `Disconnect Riot Account`, which revokes the RSO token and clears local cache.

## 4. Privacy, Consent, and Data Handling

- **Opt-in only.** ValTrq fetches data exclusively for the authenticated player.
  We do not scrape, enumerate, or look up arbitrary Riot IDs.
- **Private by default.** A player's profile is visible only to themselves unless
  they explicitly toggle `Make my profile public`.
- **No credentials stored.** RSO handles authentication on Riot's domain; ValTrq
  only stores the OAuth access/refresh tokens and a snapshot of the player's
  profile data, locally on the user's machine.
- **Right to delete.** Disconnecting the Riot Account in Settings revokes the
  token via Riot's revocation endpoint and clears all locally cached data.
  Players can request full server-side data deletion at any time via the contact
  email.
- **Data minimization.** ValTrq requests only `openid` and `offline_access` scopes,
  and only the endpoints needed to render the UI described above.

## 5. Endpoints Used

| API           | Endpoint                                                              | Purpose                  |
| ------------- | --------------------------------------------------------------------- | ------------------------ |
| account-v1    | `GET /riot/account/v1/accounts/me`                                    | Authenticated PUUID/ID   |
| account-v1    | `GET /riot/account/v1/accounts/by-puuid/{puuid}`                      | Resolve game name / tag  |
| val-match-v1  | `GET /val/match/v1/matchlists/by-puuid/{puuid}`                       | Recent match IDs         |
| val-match-v1  | `GET /val/match/v1/matches/{matchId}`                                 | Per-match stats          |
| val-ranked-v1 | `GET /val/ranked/v1/leaderboards/by-act/{actId}`                      | Tier/RR context          |
| val-content-v1| `GET /val/content/v1/contents`                                        | Agents, maps, acts       |
| val-status-v1 | `GET /val/status/v1/platform-data`                                    | Service status indicator |

Asset icons (agent portraits, map splashes, rank tiers) are loaded from the free
community resource `valorant-api.com`, not from Riot endpoints, to avoid unnecessary
quota usage.

## 6. Rate-Limit Handling

- Per-route request budgets respected.
- Exponential backoff with jitter on 429 responses.
- Local cache (in-memory and IndexedDB) with TTLs: account data 1 h, match list
  60 s, individual match 24 h, content data 12 h.
- All quota-sensitive calls funnelled through a single rate-limiter module.

## 7. Tech Stack

- Electron 32 (Chromium 128) + React 18 + TypeScript 5
- electron-vite build pipeline
- Tailwind CSS v3
- Recharts (visualization)
- axios with shared interceptors for auth, retry, rate-limit

## 8. Distribution

- macOS (.dmg, notarized), Windows (.exe, signed), Linux (.AppImage)
- Code-signed installers
- Auto-update via `electron-updater`

## 9. Screenshots

> Screenshots to be attached:
> - `screenshots/search.png` — landing page with search + RSO button + Favorites
> - `screenshots/profile.png` — player profile (rank, MMR chart, matches)
> - `screenshots/match-detail.png` — match card details (HS%, ADR, agent, map)
> - `screenshots/settings.png` — privacy toggle + disconnect

## 10. Why a Production Key?

The default Development Key:
- Is restricted to a single developer account.
- Has a low rate ceiling that breaks once multiple opted-in users connect.
- Cannot be distributed in a signed installer to end users.

A Production Key is required to publish ValTrq as a real desktop tool that
authenticated players can install and use against their own Riot accounts under
the privacy and opt-in guarantees described above.

## 11. Compliance Checklist

- [x] RSO is the only authentication path; no scraping or credential harvesting.
- [x] Opt-in profile visibility (off by default).
- [x] Visible disclaimer on the sign-in screen.
- [x] Disconnect / data-deletion flow in Settings.
- [x] No competitive integrity violations (no overlays, no in-game telemetry).
- [x] Riot trademark disclaimer present in the About page and installer.
- [x] Does not impersonate or imply endorsement by Riot Games.
