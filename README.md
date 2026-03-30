# Njård G11 – Treningsplanlegger

## Oppsett

### 1. Klon og åpne i Claude Code
```bash
git clone <din-repo-url>
cd njaerd-g11
```

### 2. Deploy til Vercel
```bash
npx vercel --prod
```

### 3. Legg til Anthropic API-nøkkel i Vercel
I Vercel-dashboardet → Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sk-ant-...
```

Redeploy etter at nøkkelen er lagt inn.

## Struktur
```
njaerd-app/
├── api/
│   └── claude.js        # Serverless proxy for Anthropic API
├── public/
│   └── index.html       # Hele appen (én fil)
├── vercel.json          # Routing-konfig
└── package.json
```

## Lokal utvikling
```bash
npx vercel dev
```
Krever at du har `ANTHROPIC_API_KEY` satt i `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
