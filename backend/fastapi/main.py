from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import jwt
import os
import uuid
import random
import asyncio
from datetime import datetime

from database import SessionLocal, Transaction, engine

# Create the FastAPI app
app = FastAPI(title="Payment Processing API")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT configuration (Must match Django)
DJANGO_SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-=^en((ui*(=i3gnr&pazc3wur3&osc7lr!6$j0@r79ke!p-+uh')
ALGORITHM = "HS256"

security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # verify token signature and get payload
        payload = jwt.decode(token, DJANGO_SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class PaymentRequest(BaseModel):
    card_id: int | None = None
    amount: float
    currency: str = "USD"
    
class PaymentResponse(BaseModel):
    transaction_id: str
    status: str
    message: str

@app.post("/api/payments/process", response_model=PaymentResponse)
async def process_payment(payment: PaymentRequest, user_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    # 1. Create a transaction record with status PENDING
    transaction_id = str(uuid.uuid4())
    
    new_txn = Transaction(
        transaction_id=transaction_id,
        user_id=user_id,
        card_id=payment.card_id,
        amount=payment.amount,
        currency=payment.currency,
        status="PENDING",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    
    # 2. Simulate Payment Gateway processing (2-3 seconds delay)
    await asyncio.sleep(2)
    
    # Simulate network success/failure randomly (e.g. 80% success rate)
    is_success = random.random() < 0.8
    
    final_status = "SUCCESS" if is_success else "FAILED"
    
    # Update the transaction record
    new_txn.status = final_status
    new_txn.updated_at = datetime.utcnow()
    db.commit()
    
    return PaymentResponse(
        transaction_id=new_txn.transaction_id,
        status=new_txn.status,
        message="Payment processed successfully" if is_success else "Payment failed due to simulated error"
    )
