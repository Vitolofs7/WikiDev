from typing import Literal, Optional
from pydantic import BaseModel, Field

MAX_CODE_LENGTH = 10_000  # 10 KB
MAX_STDIN_LENGTH = 10_000  # 10 KB


class RunCodeRequest(BaseModel):
    language: Literal["python", "javascript"]
    code: str = Field(..., min_length=1, max_length=MAX_CODE_LENGTH)
    stdin: Optional[str] = Field(default="", max_length=MAX_STDIN_LENGTH)


class RunCodeResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: Optional[int] = None
