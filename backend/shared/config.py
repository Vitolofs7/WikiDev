import os
from dotenv import load_dotenv

load_dotenv()

PISTON_URL = os.getenv("PISTON_URL", "https://emkc.org/api/v2/piston")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")