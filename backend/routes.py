from fastapi import APIRouter, HTTPException, Query
from db import get_db_connection

router = APIRouter()

@router.get("/clients")
def get_clients(
    limit: int = Query(default=10, ge=1, le=100), 
    offset: int = Query(default=0, ge=0),
    defaulted: int | None = Query(None)
    ):

    conn = get_db_connection()
    cursor = conn.cursor()
    
    base_query = "SELECT * FROM clients";
    filter = []
    params = []

    if defaulted is not None:
        filter.append('"default payment next month" = %s')
        params.append(defaulted)
    
    if filter:
        base_query += " WHERE " + " AND ".join(filter)
    
    base_query += " ORDER BY id LIMIT %s OFFSET %s;"
    params.extend([limit, offset])

    cursor.execute(base_query, tuple(params))
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    result = [dict(zip(columns, row)) for row in rows]
    if not result:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="No clients found")
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

    cursor.execute('SELECT COUNT(*) FROM clients WHERE "default payment next month" = 1;')
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

@router.get("/summary/education")
def get_education_default_rate():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            CASE
                WHEN "EDUCATION" = 1 THEN 'Graduate'
                WHEN "EDUCATION" = 2 THEN 'University'
                WHEN "EDUCATION" = 3 THEN 'High School'
                ELSE 'Others'
            END AS education_group,
            COUNT(*) AS total,
            SUM(CASE WHEN "default payment next month" = 1 THEN 1 ELSE 0 END) AS defaults
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