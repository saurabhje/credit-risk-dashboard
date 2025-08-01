from fastapi import FastAPI
from routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "https://credit.saurabh.codes"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api")

