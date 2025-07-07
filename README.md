# 🧠 Credit Risk Dashboard

A full-stack data analytics dashboard for analyzing credit risk, built using **FastAPI**, **PostgreSQL**, and **React**.

---

## 📊 Features

- Upload and analyze credit card default data
- RESTful API with FastAPI
- PostgreSQL for relational data storage
- React + Tailwind dashboard (WIP)
- Docker-ready structure for deployment
- Secure `.env`-based configuration

---

## 📁 Project Structure


---

## 🚀 Getting Started

### 1. Backend (FastAPI + PostgreSQL)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
'''
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
uvicorn main:app --reload


