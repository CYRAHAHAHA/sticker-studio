# Label Studio

Local-first A4 sticker-sheet prototype for small event offices.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Participant data is pasted into the browser, merged into the selected layout, and used to build the PDF in memory with `pdf-lib`.

The prototype includes eight A4 stock profiles, eight content patterns, field mapping, simple text formatting, overflow checks, sample data, PDF export, and separate Print guide and Privacy pages.

## PWA / offline demo

For the installable, offline-cached build:

```bash
npm run build
npm run preview
```

Open the preview URL in a Chromium-based browser and use the browser’s install control, or the in-app Install app button when it appears. The service worker caches the app shell and same-origin assets; participant data remains in memory only.
