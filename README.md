# Tutor App Monorepo

## Prerequisites
- Node.js 20+
- PostgreSQL (optional for now)

## Apps
- apps/web: React + Vite frontend
- apps/api: Node + Express API

## Quickstart

### Frontend
```
cd apps/web
npm install
npm run dev
```

### Backend
```
cd apps/api
npm install
# copy .env.example to .env and set DATABASE_URL if using Postgres
npm run dev
```

## Environment
- apps/api/.env
```
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev-secret
# DATABASE_URL=postgres://user:pass@localhost:5432/tutor
```

## Notes
- Auth is in-memory for now. Replace with Postgres models.
- Zoom/Meet integration to be added next.


