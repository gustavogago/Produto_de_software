

````markdown
# Backend — Plataforma de Doações e Trocas (FastAPI)

API desenvolvida em **FastAPI** com banco de dados **SQLite**.  
Inclui suíte de testes automatizados com **pytest**.

---

## 🚀 Como executar o backend

1. **Acesse a pasta do backend**:
   ```bash
   cd backend
````

2. **Crie e ative um ambiente virtual**:

   **Windows**:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

   **Linux/Mac**:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Instale as dependências**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Inicie o servidor**:

   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **Acesse a documentação interativa (Swagger)**:

   * [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Executar testes

Para rodar os testes automatizados:

```bash
pytest -q
```

---

## 📂 Estrutura do projeto

```
backend/
│── app/                # Código da aplicação
│   ├── main.py          # Ponto de entrada da API
│   ├── ...              # Demais módulos
│
│── tests/               # Testes automatizados
│── requirements.txt     # Dependências do projeto
│── app.db               # Banco de dados SQLite
│── README.md            # Este arquivo
```

```
```
