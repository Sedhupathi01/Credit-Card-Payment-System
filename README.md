# Credit Card Payment System (Full-Stack)

A premium, secure fintech application architected with **Django**, **FastAPI**, **React**, and **MySQL**, designed to meet all 12 evaluation modules.

## Modules Completed ✅

| Module | Feature Set | Status |
| :--- | :--- | :--- |
| **1: User Auth** | JWT Auth, Registration, Login, Encrypted Passwords (PBKDF2), Protected Routes | ✅ Complete |
| **2: Card Mgmt** | Add/Delete, Vault Masking (`** 1234`), **NO CVV STORAGE** | ✅ Complete |
| **3: Payment Core**| Async Payment Simulation (2s delay), Initial PENDING status -> SUCCESS/FAILED | ✅ Complete |
| **4: Transactions** | Advanced Ledger UI with Status/Date/Amount filtering, secure CSV Export | ✅ Complete |
| **5: Admin Panel** | Custom `Daily Payment Summary` tab, user & overall gross metric management. | ✅ Complete |
| **6: Frontend UI** | Premium React + Tailwind CSS v4 "Glassmorphism" theme. | ✅ Complete |
| **7: Database** | MySQL Schema deployed automatically with proper Users/Cards/Transactions relations. | ✅ Complete |
| **8: Security Rules**| No plain-text data, Anti-SQL injection via ORM, and JWT Authorization middleware. | ✅ Complete |
| **9: API Docs** | Auto-generated Swagger (FastAPI & DRF Spectacular) + Postman Collection provided. | ✅ Complete |
| **10: Dockerization**| Multi-container `docker-compose.yml` with separate `Dockerfile` for React, Django, FastAPI, MySQL. | ✅ Complete |
| **11: Testing** | 94% Django Test Coverage & 77% FastAPI Test Coverage (Requirements call for >50%). | ✅ Complete |
| **12: Git & Docs** | Comprehensive Markdown and properly committed repo. | ✅ Complete |

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend Core**: Django REST Framework (Auth, Users, Cards, Transactions)
- **Backend Services**: FastAPI (Async Sim Gateway)
- **Database**: MySQL 8.0 (Containerized)

## 🗄 Database Schema
* **Users (`auth_user`)**: Django default user model with PBKDF2 hashing.
* **Cards (`cards_card`)**: `id`, `user_id` (FK), `cardholder_name`, `masked_number`, `last_4_digits`, `expiry_year`, `expiry_month`. **No CVV stored here.**
* **Transactions (`transactions_transaction`)**: `id`, `transaction_id`, `user_id` (FK), `card_id` (FK), `amount`, `currency`, `status` (PENDING, SUCCESS, FAILED), `timestamps`.

## ⚙️ Setup & Deployment

### Run via Docker (Recommended)
```bash
docker-compose up --build
```
*Docker will orchestrate MySQL, Django, FastAPI, and Nginx/React automatically.*

### Run Locally (Dev Mode)
**1. Backend Core (Django)**
```bash
cd backend/django
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8080
```
**2. Payment Service (FastAPI)**
```bash
cd backend/fastapi
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```
**3. Frontend (React)**
```bash
cd frontend
npm install
npm run dev -- --port 3000
```

## 📖 API Documentation
- **Django API Docs**: [http://localhost:8080/api/docs/](http://localhost:8080/api/docs/) (Powered by drf-spectacular)
- **FastAPI Auth/Payments Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) (Powered by Swagger UI)
- **Postman**: Import `postman_collection.json` included in repository root.

## 🧪 Testing Coverage Execution
- **Django (94% Coverage)**: `cd backend/django && coverage run manage.py test && coverage report`
- **FastAPI (77% Coverage)**: `cd backend/fastapi && pytest --cov=main test_main.py`

## 🔑 Default Admin Account
- **Email**: `admin@localhost`
- **Password**: `admin`
- Access the Django Panel at `localhost:8080/admin` to view the **Daily Payment Summary**.

## 🎨 Screenshots
Screenshots of the UI (Login, Dashboard, Payment Gateway, Admin Panel) have been added to the `/screenshots/` directory for physical assessment.
