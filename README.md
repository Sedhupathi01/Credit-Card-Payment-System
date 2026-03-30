# Credit Card Payment System (Full-Stack)

A premium, secure fintech application architected with **Django**, **FastAPI**, **React**, and **MySQL**.

## 🚀 Presentation & UI
The system features a **high-end Glassmorphism UI** with colorful gradients, dark mode aesthetics, and interactive elements.
- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend Core**: Django REST Framework (Auth, Users, Cards, Transactions)
- **Payment Processor**: FastAPI (Simulated async payment gateway)
- **Security**: JWT Authentication, PBKDF2 Password Hashing, No CVV storage.

## 🛠 Tech Stack
- **Languages**: Python 3.12+, JavaScript (ES6+)
- **Storage**: MySQL (Primary), SQLite (Local Fallback)
- **Frameworks**: Django, FastAPI, React
- **Dev-Ops**: Docker & Docker Compose

## 🔑 Admin Credentials
- **Email**: `admin@localhost`
- **Password**: `admin`
- **Link**: [http://localhost:8080/admin](http://localhost:8080/admin)

## 📋 Submission Checklist Requirements
- [x] **GitHub Repository**: (This repository)
- [x] **Database Dump**: Found in `scripts/dump_db.sql`
- [x] **Postman Collection**: Found in `postman_collection.json`
- [x] **UI Screenshots**: Generated in `screenshots/` directory
- [x] **Security Compliance**: No CVV stored, JWT used for all API calls.

## ⚙️ Setup & Installation

### 1. Backend (Django)
```bash
cd backend/django
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8080
```

### 2. Payment Service (FastAPI)
```bash
cd backend/fastapi
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev -- --port 3000
```

## 🐳 Docker Deployment
```bash
docker-compose up --build
```
*Docker will orchestrate MySQL, Django, FastAPI, and Nginx/React automatically.*

## 🧪 Testing & Postman
Import `postman_collection.json` into your Postman app.
1. Use the **Auth > Login** request to get your JWT.
2. Update the `access_token` variable in the collection.
3. Access protected endpoints like **List Cards** or **Process Payment**.
