# Frontend — Plataforma de Doações e Trocas (React + Vite)

App mínimo para listar e criar itens via API.

## Rodar
```bash
cd frontend
npm install
npm run dev
```
O Vite faz proxy de `/api` -> `http://127.0.0.1:8000` (configure em `vite.config.ts`).

Fluxo rápido:
1. Suba o backend (e opcionalmente rode `POST /dev/seed` no Swagger).
2. Login com `demo@demo.com / demo123`.
3. Clique em **Criar item de teste** e use a busca.
