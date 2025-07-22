# Credit Risk Analytics Dashboard

A full-stack interactive dashboard for analyzing credit risk, built with React, FastAPI, and PostgreSQL.

## Features

- Client Table  
  Paginated view of individual client data (age, credit limit, default status, etc.)

- Summary Statistics  
  Real-time metrics such as:
  - Total clients  
  - Defaulted clients  
  - Default rate (%)  
  - Average credit limit  
  - Average client age  

- Risk Tier Segmentation  
  Visualizes clients by risk tier (0–5), helping identify high-risk segments.

- Default Rate by Education  
  Bar or stacked bar graph showing trends in default rate based on education level.

- Extendable Visualizations  
  Easily add charts such as default rate by age, gender, or credit history.

## Tech Stack

- **Frontend**: React (Vite, TailwindCSS, Recharts)  
- **Backend**: FastAPI (Python)  
- **Database**: PostgreSQL  
- **Hosting**: Compatible with DigitalOcean, Render, or Vercel deployments

## API Endpoints

- `/api/clients?limit&offset&risk_tier&defaulted` – Paginated and filterable client data
    - limit: Number of results per page
    - offset: Pagination offset
    - risk_tier: Filter by risk tier (e.g. risk_tier=2)
    - defaulted: Filter by default status (defaulted=true or defaulted=false)  
- `/api/summary` – Summary statistics  

## Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```
cd frontend
npm install
npm run dev
```
Make sure to configure environment variables such as VITE_ADDS in a .env file in the frontend for API base URL access.

## Data Source
The project uses anonymized credit client data (e.g., UCI Credit Card Dataset or a similar dataset). This dashboard is suitable for academic, demo, or analytics use cases related to credit risk modeling.

