from fastapi import APIRouter, HTTPException
from .schemas import RunCodeRequest, RunCodeResponse
from .service import execute_code
import traceback

router = APIRouter(tags=["code-execution"])


@router.post("/execute", response_model=RunCodeResponse)
async def run_code(req: RunCodeRequest):
    try:
        return await execute_code(req)
    except Exception as e:
        print("ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))