from fastapi import FastAPI
from route import router as api_router

app = FastAPI()
app.include_router(api_router)

