@echo off
set PORT=4000
set CORS_ORIGIN=http://localhost:5173
set JWT_SECRET=dev-secret
set DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres
node dist/index.js
