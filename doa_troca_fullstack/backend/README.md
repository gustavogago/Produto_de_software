# Backend — Plataforma de Doações e Trocas (FastAPI)

API em FastAPI com SQLite. Inclui testes com pytest.

## Rodar
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Swagger: http://127.0.0.1:8000/docs

## Testes
```bash
pytest -q
```
