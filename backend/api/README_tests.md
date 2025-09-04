# 🧪 Testes do Projeto Django

Este projeto utiliza **Django + Django REST Framework** e o framework de testes **pytest** com o plugin `pytest-django`.

## 📋 Pré-requisitos
- Python 3.11+  
- Virtualenv configurado (`.venv`)  
- Dependências instaladas:
  ```bash
  pip install -r requirements.txt
  ```

## ▶️ Rodando os testes

### 1. Ativar o ambiente virtual
No Windows (PowerShell):
```powershell
.\.venv\Scripts\Activate
```

No Linux/macOS (bash/zsh):
```bash
source .venv/bin/activate
```

### 2. Executar todos os testes
Na raiz do **backend** (onde está o `manage.py`):
```bash
pytest
```

Isso vai:
- Carregar as configurações do Django (`backend.settings`)
- Rodar todos os arquivos que seguem os padrões `tests.py`, `test_*.py` e `*_tests.py`
- Criar um banco de dados temporário apenas para os testes

### 3. Rodar testes específicos
Rodar apenas os testes da app `api`:
```bash
pytest api/
```

Rodar apenas uma classe de testes:
```bash
pytest -k "UserRegistrationTest"
```

Rodar apenas um método específico:
```bash
pytest api/tests.py::UserRegistrationTest::test_user_registration_with_valid_data
```

### 4. Gerar relatório HTML
Para gerar um relatório visual:
```bash
pytest --html=report.html --self-contained-html
```

Abra o arquivo `report.html` no navegador.  
Se quiser aplicar um tema mais bonito:
```bash
pytest --html=report.html --self-contained-html --css=custom-pytest-report.css
```

---

## 📂 Tipos de testes existentes

- **HealthCheckTest** → testa se o sistema responde no endpoint `/api/health/`.
- **UserRegistrationTest** → testa fluxo de cadastro de usuários (novo e duplicado).
- **TokenObtainTest** → testa login com credenciais válidas/inválidas (JWT).
- **TokenRefreshTest** → testa refresh de token válido/inválido.
- **ProtectedEndpointTest** → valida acesso a endpoints protegidos (JWT).

> Observação: são **testes de integração/funcionais de API**, não unitários. Eles validam o comportamento completo da aplicação (views, banco de dados, autenticação, etc).

---

## ⚡ Dicas úteis
- Para ver a saída de `print` nos testes:
  ```bash
  pytest -s
  ```
- Para rodar com detalhes (verbose):
  ```bash
  pytest -v
  ```
- Para limpar cache do pytest:
  ```bash
  pytest --cache-clear
  ```
