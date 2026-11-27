import logging
from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user, verify_csrf
from auth.models import User
from code_execution.schemas import RunCodeRequest, RunCodeResponse
from code_execution.service import execute_code
from shared.logging_utils import log_security_event
from shared.rate_limit import code_execute_limiter

router = APIRouter(tags=["code-execution"])


@router.post(
    "/execute",
    response_model=RunCodeResponse,
    dependencies=[Depends(code_execute_limiter), Depends(verify_csrf)],
)
async def run_code(
    req: RunCodeRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        return await execute_code(req, user_id=current_user.id)
    except HTTPException:
        raise
    except Exception:
        log_security_event(
            "code_execution_internal_error",
            level=logging.ERROR,
            user_id=current_user.id,
            language=req.language,
        )
        raise HTTPException(
            status_code=500,
            detail="Error interno al ejecutar el código",
        )
