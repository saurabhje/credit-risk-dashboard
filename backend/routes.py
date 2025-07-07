from fastapi import APIRouter, HTTPException
from db import get_db_connection

router = APIRouter()

@router.get("/clients")
def get_clients():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients LIMIT 10;")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    result = [dict(zip(columns, row)) for row in rows]
    cursor.close()
    conn.close()
    return {"clients": result}

@router.get("/clients/{client_id}")
def get_client(client_id: int): 
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients WHERE id = %s;", (client_id,))
    row = cursor.fetchone()
    if row is None:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Client not found")
    columns = [desc[0] for desc in cursor.description]
    result = dict(zip(columns, row))
    cursor.close()
    conn.close()
    return result


@router.get("/summary")
def get_summary():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM clients;")
    total_clients = cursor.fetchone()[0]

    cursor.execute(
        'SELECT COUNT(*) FROM clients WHERE "default payment next month" = 1;'
    )
    defaulted_clients = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(\"LIMIT_BAL\") FROM clients;")
    avg_limit_balance = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(\"AGE\") FROM clients;")
    avg_age = cursor.fetchone()[0]

    cursor.close()
    conn.close()
    return {
        "total_clients": total_clients,
        "defaulted_clients": defaulted_clients,
        "default_rate_percent": round((defaulted_clients / total_clients) * 100, 2),
        "avg_limit_balance": int(avg_limit_balance),
        "avg_age": round(avg_age, 1)
    }