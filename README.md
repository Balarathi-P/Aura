<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/4

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Server-side GenAI (recommended)

If you want image analysis done securely on the server (recommended), add your GenAI API key to `.env.local` as:

```
GENAI_API_KEY=sk-xxxxx
```

The backend will expose `/api/analyze` which the frontend calls to get the AI analysis. Do not expose your secret API key to the browser.

## Backend (local)

This project includes a small Express + SQLite backend used to persist wardrobe items.

Files added:

- `server.cjs` - Express server providing /api/wardrobe endpoints (GET, POST, DELETE) and a health check.
- `wardrobe.sqlite` - SQLite database file (created automatically the first time the server runs).

How to run the backend locally:

1. Install dependencies (if you haven't already):

```
npm install
```

2. Start the server:

```
npm run start:server
```

3. Health check (in a separate shell):

```
curl.exe http://localhost:3002/api/health
```

Notes:

- The backend will create `wardrobe.sqlite` and the `wardrobe` table automatically.
- The frontend runs on Vite and will need to call `http://localhost:3002/api/wardrobe` to read/write items (or set `VITE_API_URL` to override). CORS is enabled on the server.
