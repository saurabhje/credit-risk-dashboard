# Credit Risk Analytics Dashboard

A full-stack interactive dashboard for analyzing and predicting credit risk, built with React, FastAPI, and PostgreSQL — powered by a machine learning model trained on the UCI Credit Card Default Dataset.

## Features

- **Client Table**
  Paginated view of individual client data with risk scores, risk labels, and default status.

- **Summary Statistics**
  Real-time metrics including:
  - Total clients
  - Defaulted clients
  - Default rate (%)
  - Average credit limit
  - Average client age

- **ML-Powered Risk Scoring**
  Each client is assigned a predicted risk score and tier using a trained Random Forest model:
  - 🟢 Low Risk (0.00 – 0.25)
  - 🟡 Moderate Risk (0.25 – 0.50)
  - 🟠 High Risk (0.50 – 0.75)
  - 🔴 Critical Risk (0.75 – 1.00)

- **Client Detail View**
  Per-client breakdown with bill vs payment chart, payment status history, and profile cards.

- **Risk Tier Distribution**
  Bar chart showing client distribution across all four risk tiers.

- **Default Rate by Education**
  Visualization of default trends segmented by education level.

## ML Model

The dashboard uses a **Random Forest Classifier** trained on the [UCI Default of Credit Card Clients Dataset](https://archive.ics.uci.edu/ml/datasets/default+of+credit+card+clients).

### Feature Engineering
Three additional features were engineered beyond the raw dataset:
- `avg_utilization` — Average bill amount as a proportion of credit limit
- `max_utilization` — Peak bill amount as a proportion of credit limit
- `payment_ratio` — Most recent payment relative to most recent bill

### Model Performance

| Model | AUC-ROC | Notes |
|---|---|---|
| Logistic Regression | ~0.73 | Baseline model |
| Random Forest | ~0.79 | Selected model |

The Random Forest model was selected for deployment due to its superior AUC-ROC score. Predictions are pre-computed for all 30,000 clients and stored in PostgreSQL for fast retrieval.

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Recharts
- **Backend**: FastAPI (Python), Gunicorn + Uvicorn
- **Database**: PostgreSQL
- **ML**: scikit-learn (Random Forest, StandardScaler)
- **Hosting**: DigitalOcean Droplet

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/clients` | Paginated client list with filters (`limit`, `offset`, `risk_label`, `defaulted`) |
| `GET /api/clients/{id}` | Single client detail |
| `GET /api/summary` | Aggregate statistics |
| `GET /api/summary/education` | Default rate by education group |
| `GET /api/summary/risk-score` | Client count by risk tier |
| `GET /api/predict/all` | Run ML predictions on all clients and save to DB |
| `POST /api/predict` | Predict risk for a single client (manual input) |

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Configure `VITE_ADDS` in a `.env` file in the frontend directory with your API base URL.

## Data Source

UCI Default of Credit Card Clients Dataset — 30,000 anonymized records of credit card holders in Taiwan, including payment history, bill amounts, and demographic information.