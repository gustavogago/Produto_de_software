Backend — Plataforma de Doações e Trocas (FastAPI)

API desenvolvida em FastAPI com banco de dados SQLite.
Inclui suíte de testes automatizados com pytest.

🚀 Como executar o backend

Acesse a pasta do backend:

cd backend


Crie e ative um ambiente virtual:

Windows:

python -m venv .venv
.venv\Scripts\activate


Linux/Mac:

python3 -m venv .venv
source .venv/bin/activate


Instale as dependências:

pip install -r requirements.txt


Inicie o servidor:

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000


Acesse a documentação interativa (Swagger):

http://127.0.0.1:8000/docs

🧪 Executar testes

Para rodar os testes automatizados:

pytest -q

📂 Estrutura do projeto
backend/
│── app/                # Código da aplicação
│   ├── main.py          # Ponto de entrada da API
│   ├── ...              # Demais módulos
│
│── tests/               # Testes automatizados
│── requirements.txt     # Dependências do projeto
│── app.db               # Banco de dados SQLite
│── README.md            # Este arquivo