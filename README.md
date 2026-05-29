# 2Coms AI Challenge Suite

This workspace contains two separate applications:

- `web-app`: Next.js web platform with 7 AI feature modules and server-side Groq API route.
- `mobile-app`: Expo React Native app with the same 7 modules and mobile-first experience.

## Web App (Next.js)

Path: `web-app`

### Features

- 7 module pages with module-specific intro text and capabilities.
- Groq API integration through `src/app/api/groq/route.ts`.
- 4 visual themes: Light, Dark, Sepia, OLED.
- Compact, professional dashboard UI with reusable components.

### Setup

1. Copy environment file:
   - `web-app/.env.example` to `web-app/.env.local`
2. Add Groq credentials:
   - `GROQ_API_KEY=...`
   - `GROQ_MODEL=llama-3.3-70b-versatile` (or your preferred Groq model)
3. Run:

```bash
cd web-app
npm install
npm run dev
```

Web URL: http://localhost:3000

## Mobile App (Expo)

Path: `mobile-app`

### Features

- Separate mobile UI with 7 module cards and dedicated detail views.
- On-page module demo text plus capability list.
- Groq-powered generation for each module.
- 4 visual themes: Light, Dark, Sepia, OLED.

### Setup

1. Copy environment file:
   - `mobile-app/.env.example` to `mobile-app/.env`
2. Add Groq credentials:
   - `EXPO_PUBLIC_GROQ_API_KEY=...`
   - `EXPO_PUBLIC_GROQ_MODEL=llama-3.3-70b-versatile`
3. Run:

```bash
cd mobile-app
npm install
npm run start
```

Then open Android/iOS/Web from Expo.

## Notes

- The mobile app currently calls Groq directly using `EXPO_PUBLIC_` variables for MVP speed.
- For production, route mobile calls through a secure backend proxy to avoid exposing API keys in client builds.
