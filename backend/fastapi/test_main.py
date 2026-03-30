from fastapi.testclient import TestClient
from main import app, get_db, verify_token
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
import pytest

# Setup in-memory sqlite db for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_verify_token():
    # Return a mocked user_id
    return 1

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[verify_token] = override_verify_token

client = TestClient(app)

@pytest.fixture(autouse=True)
def wipe_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_process_payment():
    payment_data = {
        "amount": 100.50,
        "currency": "USD"
    }
    
    # We bypassed token so we just send req (FastAPI test client drops Bearer usually but we mocked it)
    response = client.post("/api/payments/process", json=payment_data)
    
    assert response.status_code == 200
    assert "transaction_id" in response.json()
    assert response.json()["status"] in ["SUCCESS", "FAILED"] 
    # Because of random sleep & random fail, it could be either. We just assert it is valid.
