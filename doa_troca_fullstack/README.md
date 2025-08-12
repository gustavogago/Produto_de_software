# Plataforma de Doações e Trocas — Monorepo

- `backend/` FastAPI + SQLite + testes (pytest)
- `frontend/` React + Vite (TS)

## Passo a passo
1. **Backend**
   - `cd backend`
   - criar venv, instalar deps e rodar: `uvicorn app.main:app --reload`
   - abrir Swagger: http://127.0.0.1:8000/docs
   - (opcional) POST `/dev/seed` para popular demo

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
   - acessar: http://127.0.0.1:5173

3. **Testes do backend**
   - `cd backend`
   - `pytest -q`
