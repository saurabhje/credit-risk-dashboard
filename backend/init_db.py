import pandas as pd
import sqlite3
import os

def init_db(csv_path="UCI_Credit_Card.csv"):
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Please place the CSV file in the backend directory.")
        return

    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Rename 'ID' to 'id' if it exists to match the code's expectation
    if 'ID' in df.columns:
        df.rename(columns={'ID': 'id'}, inplace=True)
    
    # Ensure risk_score and risk_label columns exist
    if 'risk_score' not in df.columns:
        df['risk_score'] = 0.0
    if 'risk_label' not in df.columns:
        df['risk_label'] = 'Pending'

    conn = sqlite3.connect("credit_risk.db")
    
    print("Writing to SQLite database (credit_risk.db)...")
    # Clean up column names (remove quotes if any)
    df.columns = [c.replace('"', '').replace("'", "") for c in df.columns]
    
    df.to_sql("clients", conn, if_exists="replace", index=False)
    
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()
