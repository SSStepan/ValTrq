# Промпт для Claude Code: деплой на GitHub Pages

```
Сделай следующее:

1. Адаптируй проект для сборки как обычное веб-приложение (не Electron):
   - Создай отдельный vite.config.web.ts для сборки только React-части (без Electron)
   - base: '/ValTrq/' (для GitHub Pages)
   - Убедись что все моковые данные работают, API вызовы с USE_MOCK=true

2. Добавь npm script: "build:web": "vite build --config vite.config.web.ts --outDir dist-web"

3. Собери: npm run build:web

4. Инициализируй git если ещё нет, добавь все файлы, сделай коммит "Initial commit: ValTrq prototype with mock data"

5. Создай публичный репозиторий ValTrq на GitHub (аккаунт SSStepan) через gh cli.
   Если gh недоступен — просто настрой remote: git remote add origin https://github.com/SSStepan/ValTrq.git

6. Запуши в main: git push -u origin main

7. Задеплой на GitHub Pages:
   - Установи gh-pages: npm install -D gh-pages
   - Добавь script: "deploy": "gh-pages -d dist-web"
   - Запусти: npm run deploy

После этого сайт будет доступен на https://SSStepan.github.io/ValTrq/

Убедись что всё работает: поиск, профиль с моковыми данными, график, матчи, страницы Settings и About.
```
