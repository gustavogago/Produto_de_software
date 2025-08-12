
import json
import pytest
from fastapi.testclient import TestClient
from app.main import app, Base, engine, SessionLocal

@pytest.fixture(autouse=True, scope="module")
def setup_db():
    # Recria as tabelas em um banco limpo para testes
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def register_and_login(email="u@test.com", password="secret123"):
    r = client.post("/auth/register", json={"email": email, "password": password, "name":"U", "city":"SRS"})
    assert r.status_code == 201
    r = client.post("/auth/login", data={"username": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_health_docs():
    r = client.get("/openapi.json")
    assert r.status_code == 200

def test_categories_crud():
    headers = register_and_login()
    r = client.post("/categories", headers=headers, json={"name":"Eletrônicos", "description":"Gadgets"})
    assert r.status_code == 201
    cat = r.json()
    assert cat["name"] == "Eletrônicos"

    r = client.get("/categories")
    assert r.status_code == 200
    assert any(c["name"] == "Eletrônicos" for c in r.json())

def test_items_flow_and_filters():
    headers = register_and_login("b@test.com", "pass1234")
    # cria categoria
    client.post("/categories", headers=headers, json={"name":"Roupas"}).json()
    cats = client.get("/categories").json()
    cat_id = [c["id"] for c in cats if c["name"]=="Roupas"][0]

    # cria item doação
    r = client.post("/items", headers=headers, json={
        "title":"Camisa polo",
        "description":"Azul, M",
        "is_donation": True,
        "condition":"used",
        "city":"Santa Rita do Sapucaí",
        "category_id": cat_id
    })
    assert r.status_code == 201
    item = r.json()

    # lista com filtro texto
    r = client.get("/items", params={"q":"camisa"})
    assert r.status_code == 200
    assert len(r.json()) >= 1

    # lista por categoria
    r = client.get("/items", params={"category_id": cat_id})
    assert r.status_code == 200
    assert len(r.json()) >= 1

    # get by id
    r = client.get(f"/items/{item['id']}")
    assert r.status_code == 200
    assert r.json()["title"] == "Camisa polo"
