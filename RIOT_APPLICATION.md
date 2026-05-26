# ValTrq — Production API Key Application

## Project Name
**ValTrq** — In-Game Roster Overlay and Public Stats Lookup for Valorant

## Project Type
Desktop application (Electron + React + TypeScript). Two surfaces inside one
installer: a transparent in-game **overlay** that displays roster stats during
a competitive match, and a **lookup page** for searching public Valorant
profiles by Riot ID.

## URL
https://valtrq.app (placeholder — to be replaced before submission)

## Contact
- Email: deburuni@mail.ru
- Discord: cprcorn

---

## 1. Summary

ValTrq is a desktop client that helps a Valorant player understand the ten
people in their current match: their ranks, recent-form K/D, headshot
percentage, win rate, and main agent. The same app also lets the user look up
any player's public profile by Riot ID.

ValTrq has **no user accounts, no backend, no database, and no telemetry**.
It runs entirely on the user's machine. It calls the official Riot API
directly with an embedded application key, and it reads the local Valorant
client's `lockfile` to learn which match the user is currently in — the same
pattern used by Blitz, Mobalytics, and Tracker.gg.

## 2. Use Case

When a competitive Valorant player loads into a match, they want to quickly
understand the skill distribution of both teams: who the smurf is, who is on
a losing streak, who is on their main, whether their support has competitive
experience. Today, players do this by alt-tabbing to tracker.gg and pasting
ten Riot IDs.

ValTrq replaces that workflow with a single transparent overlay window that
fetches roster stats automatically once agent select locks in. After the
match, the same app lets the player look up specific opponents for a longer
read on their history.

## 3. Product Surfaces

### 3.A Overlay (primary)
A frameless, transparent, always-on-top Electron window. Activates only when
the local game state is **agent-select-locked** or **in-game**; hidden in
queue, menu, and post-match. Default position top-right. Toggle visibility
with a configurable global hotkey (default `Ctrl+Shift+V`).

Each roster row shows: agent portrait, Riot ID, current rank, peak rank,
account level, K/D this act, headshot percent, win rate over last 20 ranked
matches, main agent + percentage of last 20 on that agent, hours played this
act, current streak (e.g. `W3` / `L2`). All values are derived from the
official Riot API.

The overlay is interactive only above its own panels (cursor over an empty
region falls through to the game beneath via `setIgnoreMouseEvents(true,
{forward:true})` plus hit-test on `mousemove`). Clicking a row opens the
lookup surface on that player.

### 3.B Lookup page
Standard desktop window. User types a Riot ID (`Name#Tag`) and region, sees:
rank icon and tier name, current RR, peak rank, win rate, an RR-history line
chart (last 15 ranked matches), and a filterable list of recent matches with
K/D/A, headshot %, ADR, agent, map and round score.

Players the user has visited can be pinned to a local **Favorites** list
(stored in `localStorage` on the user's machine).

## 4. Critical Design Constraint: No Pre-Queue Lookup

The overlay **never** shows opponent stats before agent select has locked in.
This is enforced by an explicit state-machine gate, not by convention. The
states are:

```
idle → pre-game → agent-select → in-game → post-match
                       ▲              ▲
                       │              │
                  overlay shows from here on
```

This rule mirrors the policy that Riot enforces for similar third-party
tools: showing opponent stats during the queue-accept window would enable
dodge-sniping, which damages matchmaking integrity. ValTrq treats this as
the single most important compliance requirement and will include a unit
test suite covering every transition.

## 5. Data Sources

### 5.A Local Valorant client (PUUID discovery only)
ValTrq reads `%LOCALAPPDATA%\Riot Games\Riot Client\Config\lockfile` to
obtain the local client's port, password, and protocol, then queries
`https://127.0.0.1:{port}/chat/v4/presences` and
`/product-session/v1/external-sessions` to:
- detect the current `sessionLoopState` (drives the FSM above), and
- extract the PUUIDs of all ten players in the current match.

No game memory is read. No code is injected. Nothing is modified. The
overlay is rendered by the OS compositor (DWM on Windows), the same way
Discord overlay, Steam overlay, and the named third-party trackers work.

### 5.B Official Riot API (all displayed stats)
Once PUUIDs are known, every value the user sees comes from the official
Riot API. See section 6 for the endpoint list.

### 5.C Asset icons (cached separately)
Agent portraits, map splashes and rank icons load from `valorant-api.com`,
not from Riot endpoints, to avoid burning API quota on static assets.

## 6. Endpoints Used

| API            | Endpoint                                                       | Purpose                              |
| -------------- | -------------------------------------------------------------- | ------------------------------------ |
| account-v1     | `GET /riot/account/v1/accounts/by-riot-id/{name}/{tag}`        | Lookup PUUID for the search bar      |
| account-v1     | `GET /riot/account/v1/accounts/by-puuid/{puuid}`               | Resolve game name and tag            |
| val-match-v1   | `GET /val/match/v1/matchlists/by-puuid/{puuid}`                | Recent match IDs per roster player   |
| val-match-v1   | `GET /val/match/v1/matches/{matchId}`                          | Per-match stats for aggregation      |
| val-ranked-v1  | `GET /val/ranked/v1/leaderboards/by-act/{actId}`               | Tier and RR context                  |
| val-content-v1 | `GET /val/content/v1/contents`                                 | Agent, map, and act metadata         |
| val-status-v1  | `GET /val/status/v1/platform-data`                             | Service status indicator             |

ValTrq does **not** use any RSO-scoped endpoints (`accounts/me`,
`active-shards/by-puuid/{puuid}/me`, etc.). All consumed endpoints are the
public-key variants intended for third-party tools.

## 7. Rate-Limit Handling

- Single shared rate-limiter module governs every outbound API call.
- Per-route budgets respected; exponential backoff with jitter on 429.
- Aggressive in-memory cache with conservative TTLs:
  - account name → PUUID: 1 hour
  - match list: 60 seconds
  - individual match payload: 24 hours
  - act content: 12 hours
  - leaderboard slices: 5 minutes
- A single roster-fetch (10 players × matchlist + 5 detail matches each)
  is batched and deduplicated against the cache, typical cost ~50 calls
  per match, amortized across the match duration.
- Rate-limit headers from Riot's response are inspected and respected even
  before our own budget triggers.

## 8. Privacy, Consent, and Data Handling

- **No user accounts.** ValTrq has no sign-in flow. There is no RSO, no
  OAuth, no credential collection.
- **No backend.** There is no ValTrq server. Nothing is sent anywhere
  except to Riot's official API (and `valorant-api.com` for static assets).
- **No PII storage.** ValTrq does not store, log, or transmit any
  personally-identifying information. Riot IDs viewed in the lookup tab,
  pinned Favorites, the overlay hotkey, and other preferences live in
  `localStorage` on the user's machine. Settings → Local Data offers a
  one-click "Clear Favorites" button.
- **Only public data is shown.** Every stat displayed in the overlay or
  lookup is already publicly accessible via the Riot API for any holder of
  a development or production key. ValTrq does not surface anything that
  would otherwise be private.
- **Lockfile is read-only.** ValTrq's interaction with the local Valorant
  client is read-only: it parses the lockfile, opens HTTPS connections to
  `127.0.0.1`, and consumes presence/session JSON. It does not write to the
  client, the game, or any Riot file.
- **No competitive-integrity risk.** The FSM gate in section 4 prevents
  any pre-queue stat exposure. The overlay does not provide aim assistance,
  positional information, or any data not visible to a player on
  tracker.gg or valorant.com.

## 9. Why a Production Key?

The default development key:
- Has a per-route ceiling (~20 req/s) that one full 10-player roster fetch
  exceeds, especially when several roster members are heavy-rotation players
  with long matchlists.
- Cannot be redistributed in a public installer.
- Is intended for single-developer testing, not for end-user installs.

A Production Key is required to ship ValTrq as a public desktop application
that users can install from a signed Windows installer (`.exe`, Authenticode
signed) or macOS `.dmg` (notarized) under the rate ceilings and ToS clauses
appropriate for distributed third-party tools.

## 10. Tech Stack and Distribution

- Electron 32 (Chromium 128) + React 18 + TypeScript 5 (strict mode)
- electron-vite build pipeline
- Tailwind CSS v3
- Recharts (RR-history visualization)
- axios with shared interceptors for rate-limit, retry, caching
- Distribution: Windows (.exe, Authenticode signed), macOS (.dmg, notarized),
  Linux (.AppImage). Auto-update via `electron-updater`.

## 11. Screenshots

> To attach before submission:
> - `screenshots/overlay-in-game.png` — overlay during a live match (10-player roster)
> - `screenshots/overlay-agent-select.png` — overlay during agent-select (locked rosters only)
> - `screenshots/lookup-search.png` — lookup tab with search bar and Favorites
> - `screenshots/lookup-profile.png` — profile page (rank, RR history chart, recent matches)
> - `screenshots/settings.png` — hotkey configuration + "no account, no server" notice

## 12. Comparable Tools

ValTrq follows the same architectural pattern as the following Riot-approved
third-party clients, which all use lockfile-based PUUID discovery and the
official API for stats:
- Blitz (https://blitz.gg)
- Mobalytics (https://mobalytics.gg)
- Tracker Network (https://tracker.gg/valorant)

ValTrq differs by being narrower in scope (no coaching, no guides, no
loadouts) and by holding no user data on a server.

## 13. Compliance Checklist

- [x] No RSO; no credential collection; no scraping.
- [x] No backend; no PII storage; no telemetry.
- [x] Overlay activates **only after agent-select lock** (FSM-gated, unit-tested).
- [x] No game-memory reading, no injection, no client modification.
- [x] Lockfile interaction is read-only and follows the Blitz/Mobalytics pattern.
- [x] Rate limits respected via shared limiter, backoff on 429, aggressive caching.
- [x] Trademark disclaimer present in the About page and installer:
      "ValTrq is not endorsed by Riot Games and does not reflect the views or
      opinions of Riot Games or anyone officially involved in producing or
      managing Riot Games properties."
- [x] Does not impersonate or imply endorsement by Riot Games.
- [x] Configurable global hotkey defaults to a modifier-required combination
      (`Ctrl+Shift+V`) so it cannot accidentally intercept in-game input.
