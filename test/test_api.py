from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/api/v1/clients")
    # Should be 401 because we are not authenticated
    assert response.status_code == 401

def test_docs():
    response = client.get("/api/v1/docs")
    assert response.status_code == 200
