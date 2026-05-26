# ValTrq — Checkpoint 2026-05-26

Где мы остановились. Возвращайся сюда чтобы поднять контекст.

## Готово в этой сессии

1. **UI-редизайн** под tactical-Valorant: display-шрифт Anton, локнутый красный
   акцент `#ff4655`, острые углы, угловые срезы (`clip-tag`/`clip-notch-l`),
   моно-цифры, grain overlay. Em-dash вычищен. Все компоненты переделаны
   (Layout, SearchBar, PlayerCard, MatchCard, MatchList, RankHistory,
   FavoritesList, skeletons).

2. **Архитектурный pivot:** ValTrq теперь overlay-first.
   - Главный продукт — прозрачный always-on-top оверлей, показывающий 5v5
     ростер во время матча.
   - Tracker (поиск по Riot ID + профиль + история матчей) — вторая
     поверхность того же приложения, fallback.

3. **Electron — 2 окна из одной React-сборки** (hash-роутинг):
   - Tracker window 1280×800.
   - Overlay window 420×720, `frame:false`, `transparent:true`,
     `alwaysOnTop:'screen-saver'`, `focusable:true`, click-through по умолчанию.
   - `electron/main.ts` спавнит оба, кэширует last game state, переотсылает на
     `did-finish-load` (фикс race condition).

4. **Mock game-state watcher** (`electron/lockfile.ts`):
   - Сейчас держит overlay в `in-game` постоянно (без цикла).
   - Скелет под реальный lockfile-парсер + 127.0.0.1 polling готов, помечен
     TODO для stage 2.

5. **Overlay UI:**
   - `src/pages/Overlay.tsx` + `components/overlay/{RosterTeam,RosterPlayer}`.
   - Ally сверху (зелёная полоска), Enemy снизу (красная).
   - На строке: агент, ник#тег, ранг, K/D act, HS%, WR20, level, streak.
   - Hit-test через forwarded mousemove → `elementFromPoint` → IPC
     `setClickThrough` — Discord-style: курсор над пустотой проваливается в
     игру, над интерактивными зонами активируется.
   - Клик на игрока → `valtrq.openPlayer()` → main фокусит tracker и шлёт
     `valtrq:navigate` → React Router переходит на `/player/Name/Tag`.

6. **Глобальный хоткей:**
   - Дефолт `Ctrl+Shift+V` (toggle show/hide overlay).
   - Settings → секция Overlay → `HotkeyCapture` пишет в localStorage и
     перерегистрирует через IPC.
   - Tracker на старте реплицирует stored-хоткей в main → переживает рестарт.

7. **Снос регистрации (RSO):**
   - Удалены `context/AuthContext.tsx`, `components/RSOLogin.tsx`,
     `components/Disclaimer.tsx`.
   - Settings очищен от Account/Privacy секций, остались Overlay + Local Data
     (clear favorites).
   - About переписан без RSO.
   - Свой PUUID будет определяться по lockfile, не через OAuth.

## Что дальше (stage 2 — реальная интеграция)

### Local Valorant client
- Заполнить `electron/lockfile.ts` реальным poller-ом:
  - читать lockfile (port + password + protocol)
  - basic auth `riot:{password}` на `https://127.0.0.1:{port}` с
    `rejectUnauthorized:false`
  - long-poll `/chat/v4/presences` + `/product-session/v1/external-sessions`
  - парсить `sessionLoopState`/`partyState` → FSM
  - комбинировать `fs.watch` + `existsSync`-poll каждые 2-3 сек (Windows race)

### FSM состояний
- `idle → pre-game → agent-select → in-game → post-match`
- Overlay показывается **только** на `agent-select` или `in-game`.
- Unit-тест на переходы — критично для Production Key (см. риски).

### Stats aggregator
- На каждого из 10 PUUID-ов:
  - `val-ranked-v1` → current rank + peak
  - `val-match-v1/matchlists/by-puuid` → последние 20 матчей
  - агрегировать K/D act, HS%, WR20, main agent, streak, hours
- Кэшировать результат до конца матча.

### Production Key application
- Переписать `RIOT_APPLICATION.md` с акцентом на:
  - "post-agent-lock roster stats only, no pre-queue lookup"
  - "no user accounts, no PII collection, no backend"
  - "PUUIDs sourced from local game client (same as Blitz/Tracker.gg)"

### Distribution
- Code signing (~$100/год EV-сертификат) иначе SmartScreen блочит
- Auto-update механизм (electron-updater) для ротации API-ключа

## Открытые риски (см. полное обсуждение в чате)

- **API key в клиенте** — лёгкий прокси на Cloudflare Workers как альтернатива
- **Fullscreen exclusive** — оверлей не работает, нужен warning в UI
- **Lockfile race на Windows** — нужен fallback-poll
- **Pre-game timing leak** — главный риск для Production Key
- **Hotkey blacklist** — запретить bare keys без модификаторов (юзер забиндит
  `Tab` и съест игровой ввод)
- **Code signing** — нет = красный SmartScreen warning
- **GitHub Pages build (`build:web`)** — никогда не класть в неё реальный
  API-ключ

## Что точно НЕ опасно (после отказа от RSO)

- PII пользователей, токены, GDPR, утечка БД, XSS/CSRF — всё неприменимо,
  нет аккаунтов и нет бэкенда.

## Полезные команды

```powershell
npm install
npm run dev               # Electron + HMR
npm run build             # production build
npm run build:web         # web-only mock сборка (для GitHub Pages)
```

Перезапуск нужен только при изменении `electron/*` — renderer ловит HMR.

## Ссылки внутри проекта

- `CLAUDE.md` — обновлённая архитектура и фичи
- Memory: `~/.claude/projects/C--Users-User-Documents-ValTrq/memory/project_overlay_vision.md`
