# SecureVault – Password Generator + Encrypted Vault (MVP)

Fast, privacy‑first password manager. Generate strong passwords, store credentials encrypted client‑side, and manage them in a clean UI.

## Features
- Password generator (length slider, include upper/lower/numbers/symbols, exclude look‑alikes)
- Simple auth (email + password, JWT)
- Vault items: title, username, password, URL, notes
- Client‑side encryption (PBKDF2 + AES‑CBC). Server never sees plaintext
- Copy to clipboard with auto‑clear (~15s)
- Basic search/filter by title/URL
- Optional dark mode toggle

## Tech Stack
- Frontend: Next.js 15 + React 19 + Tailwind
- Backend: Express + Mongoose (TypeScript, compiled to JS)
- DB: MongoDB Atlas
- Crypto: CryptoJS (PBKDF2 + AES‑CBC)

## Quick Start
1) Clone and install
```
git clone <your-repo-url>
cd password-manager
npm install
```

2) Configure environment variables
```
cp .env.example .env.local
# Edit .env.local and set values:
# MONGODB_URI=mongodb+srv://user:pass@cluster-host/securevault
# JWT_SECRET=long-random-string
# NEXTAUTH_URL=http://localhost:3000
# PORT=3001
```
Notes:
- Provide a database name in the URI (e.g., /securevault). If omitted, Mongo defaults to `test`.
- Secrets are ignored via `.gitignore`. Do not commit `.env.local`.

3) Run in development
```
# Build and start backend (compiled JS; no nodemon needed)
npm run build:backend
node dist-backend/server.js

# In another terminal: start Next.js dev server
node node_modules/next/dist/bin/next dev --turbopack
```
Open http://localhost:3000

## End‑to‑End Flow (acceptance)
1) Sign up or log in
2) Generate a password, add an item (only title/url are plaintext on server)
3) Copy username/password (clipboard auto‑clears after ~15s)
4) Search by title/URL, edit, delete

## API (dev quick checks)
Health:
```
curl -sS http://localhost:3001/api/health
```
Use the web UI for register/login to avoid shell JSON quirks.

## Data Model and Privacy
- Server stores `title`, `url` in plaintext for UX/search
- Sensitive fields (`username`, `password`, `notes`) are encrypted into `encryptedData`
- Models: `users`, `vaultitems` (MongoDB)

## Deployment (Vercel)
Recommended: deploy backend to a free host, then proxy `/api` from Vercel.

Option A – Proxy `/api` via `vercel.json`:
1) Deploy backend elsewhere (Render/Railway/Fly)
   - Build: `npm run build:backend`
   - Start: `node dist-backend/server.js`
   - Env: `MONGODB_URI`, `JWT_SECRET`, `NEXTAUTH_URL=https://<your-vercel>.vercel.app`, `PORT=3001`
2) Add `vercel.json`:
```
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://your-backend-host.example.com/api/:path*" }
  ]
}
```
3) Push to GitHub, import into Vercel, set env if needed.

Option B – Frontend calls external backend URL:
1) Set `NEXT_PUBLIC_BACKEND_URL` on Vercel (e.g., `https://your-backend-host.example.com/api`)
2) Ensure `src/utils/api.ts` uses it in production

## Security Notes
- Client‑side key derivation: PBKDF2 (10k iterations) → 256‑bit key; AES‑CBC with random IV per item
- For production hardening, consider Web Crypto API with AES‑GCM and higher KDF cost
- Clipboard is cleared after ~15 seconds if it still contains the copied value

## Updates Made
- Added backend TS build target (`tsconfig.backend.json`) and scripts:
  - `npm run build:backend` → outputs `dist-backend/`
  - `node dist-backend/server.js` to run backend without ts-node/nodemon
- Updated `package.json` scripts to allow Node‑invoked Next (`dev:frontend`) and Node‑run backend (`dev:backend:node`)
- Improved env loading in `backend/server.ts` (fallback to project‑root `.env.local`)
- Added stricter `.gitignore` rules to keep all env files out of Git (root and `backend/`)
- README now documents env, run steps, deployment, and privacy model

## License
MIT
