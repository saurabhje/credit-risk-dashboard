from fastapi import APIRouter
from db import get_db_connection

router = APIRouter()

@router.get("/clients")
def get_clients():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients LIMIT 10;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"clients": rows}
