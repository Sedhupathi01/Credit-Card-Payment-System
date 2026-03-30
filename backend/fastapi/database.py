import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///../django/db.sqlite3"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users_user"
    id = Column(Integer, primary_key=True)

class Card(Base):
    __tablename__ = "cards_card"
    id = Column(Integer, primary_key=True)

class Transaction(Base):
    __tablename__ = "transactions_transaction"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(100), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users_user.id")) 
    card_id = Column(Integer, ForeignKey("cards_card.id"), nullable=True)
    amount = Column(Numeric(10, 2))
    currency = Column(String(10), default='USD')
    status = Column(String(20), default='PENDING')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
