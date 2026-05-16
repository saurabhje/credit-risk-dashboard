import pandas as pd
import numpy as np
import sqlite3
import joblib
import os
from fastapi import APIRouter, HTTPException, Query
from schema import CreditInput
from db import get_db_connection

router = APIRouter()

# Load model and scaler
MODEL_PATH = "credit_risk_model.pkl"
SCALER_PATH = "scaler.pkl"

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
else:
    model = None
    scaler = None
    print("Warning: Model or Scaler not found. Prediction endpoints will fail.")

@router.post("/predict")
def predict(data: CreditInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    avg_utilization = (data.BILL_AMT1 + data.BILL_AMT2 + data.BILL_AMT3 + data.BILL_AMT4 + data.BILL_AMT5 + data.BILL_AMT6) / (6 * (data.LIMIT_BAL + 1))
    max_utilization = max(data.BILL_AMT1, data.BILL_AMT2, data.BILL_AMT3, data.BILL_AMT4, data.BILL_AMT5, data.BILL_AMT6) / (data.LIMIT_BAL + 1)
    payment_ratio = data.PAY_AMT1 / (data.BILL_AMT1 + 1)

    features = [[
        data.LIMIT_BAL, data.SEX, data.EDUCATION, data.MARRIAGE, data.AGE,
        data.PAY_0, data.PAY_2, data.PAY_3, data.PAY_4, data.PAY_5, data.PAY_6,
        data.BILL_AMT1, data.BILL_AMT2, data.BILL_AMT3, data.BILL_AMT4, data.BILL_AMT5, data.BILL_AMT6,
        data.PAY_AMT1, data.PAY_AMT2, data.PAY_AMT3, data.PAY_AMT4, data.PAY_AMT5, data.PAY_AMT6,
        avg_utilization, max_utilization, payment_ratio
    ]]
    
    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)[0]
    probability = model.predict_proba(scaled_features)[0][1]
    
    return {
        "risk_label": "High Risk" if prediction == 1 else "Low Risk",
        "risk_score": round(float(probability), 2)
    }

@router.get("/predict/all")
def predict_all():
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients;")
    rows = cursor.fetchall()
    
    if not rows:
        conn.close()
        return {"message": "No clients found to predict"}
    
    columns = rows[0].keys()

    df = pd.DataFrame([dict(row) for row in rows], columns=columns)
    df = df.drop(columns=["risk_score", "risk_label"])
    
    df["avg_utilization"] = df[["BILL_AMT1","BILL_AMT2","BILL_AMT3","BILL_AMT4","BILL_AMT5","BILL_AMT6"]].mean(axis=1) / (df["LIMIT_BAL"] + 1)
    df["max_utilization"] = df[["BILL_AMT1","BILL_AMT2","BILL_AMT3","BILL_AMT4","BILL_AMT5","BILL_AMT6"]].max(axis=1) / (df["LIMIT_BAL"] + 1)
    df["payment_ratio"] = df["PAY_AMT1"] / (df["BILL_AMT1"] + 1)
    df = df.replace([np.inf, -np.inf], np.nan).fillna(0)

    feature_cols = [
        "LIMIT_BAL", "SEX", "EDUCATION", "MARRIAGE", "AGE",
        "PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6",
        "BILL_AMT1", "BILL_AMT2", "BILL_AMT3", "BILL_AMT4", "BILL_AMT5", "BILL_AMT6",
        "PAY_AMT1", "PAY_AMT2", "PAY_AMT3", "PAY_AMT4", "PAY_AMT5", "PAY_AMT6",
        "avg_utilization", "max_utilization", "payment_ratio"
    ]

    scaled = scaler.transform(df[feature_cols])
    df["risk_score"] = model.predict_proba(scaled)[:, 1].round(2)
    df["risk_label"] = df["risk_score"].apply(
        lambda x: "Low" if x < 0.25 else "Moderate" if x < 0.50 else "High" if x < 0.75 else "Critical"
    )    
    try:
        data_to_update = list(zip(df["risk_score"], df["risk_label"], df["id"]))
        cursor.executemany(
            "UPDATE clients SET risk_score = ?, risk_label = ? where id = ?;",
            data_to_update
        )
        conn.commit()
    except Exception as e:
        print("ERROR:", e)
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    return {"message": f"Predictions saved for {len(df)} clients"}

@router.get("/clients")
def get_clients(
    limit: int = Query(default=10, ge=1, le=100), 
    offset: int = Query(default=0, ge=0),
    defaulted: int | None = Query(None),
    risk_label: str | None = Query(None)):

    conn = get_db_connection()
    cursor = conn.cursor()
    
    base_query = "SELECT * FROM clients"
    filters = []
    params = []

    if defaulted is not None:
        filters.append('"`default.payment.next.month`" = ?')
        params.append(defaulted)

    if risk_label is not None:
        filters.append('risk_label = ?')
        params.append(risk_label)
    
    if filters:
        base_query += " WHERE " + " AND ".join(filters)
    
    base_query += " ORDER BY id LIMIT ? OFFSET ?;"
    params.extend([limit, offset])

    cursor.execute(base_query, tuple(params))
    rows = cursor.fetchall()
    result = [dict(row) for row in rows]
    
    cursor.close()
    conn.close()

    if not result:
        raise HTTPException(status_code=404, detail="No clients found")
    
    return {"clients": result}

@router.get("/clients/{client_id}")
def get_client(client_id: int): 
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients WHERE id = ?;", (client_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if row is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return dict(row)

@router.get("/summary")
def get_summary():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM clients;")
    total_clients = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM clients WHERE "default.payment.next.month" = 1;')
    defaulted_clients = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(LIMIT_BAL) FROM clients;")
    avg_limit_balance = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(AGE) FROM clients;")
    avg_age = cursor.fetchone()[0]

    cursor.close()
    conn.close()
    
    return {
        "total_clients": total_clients,
        "defaulted_clients": defaulted_clients,
        "default_rate_percent": round((defaulted_clients / total_clients) * 100, 2) if total_clients > 0 else 0,
        "avg_limit_balance": int(avg_limit_balance) if avg_limit_balance else 0,
        "avg_age": round(avg_age, 1) if avg_age else 0
    }

@router.get("/summary/education")
def get_education_default_rate():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            CASE
                WHEN EDUCATION = 1 THEN 'Graduate'
                WHEN EDUCATION = 2 THEN 'University'
                WHEN EDUCATION = 3 THEN 'High School'
                ELSE 'Others'
            END AS education_group,
            COUNT(*) AS total,
            SUM(CASE WHEN "default.payment.next.month" = 1 THEN 1 ELSE 0 END) AS defaults
        FROM clients
        GROUP BY education_group
        ORDER BY education_group;
    """)
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [
        {
            "education": row[0],
            "default_rate": round((row[2] / row[1]) * 100, 2) if row[1] > 0 else 0
        } for row in rows if row[1] > 0
    ]

@router.get("/summary/risk-score")
def get_risk_score_distribution():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT risk_label, COUNT(*) 
        FROM clients 
        GROUP BY risk_label
        ORDER BY risk_label;
    """)
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [
        {"risk_label": row[0], "count": row[1]}
        for row in rows
    ]
