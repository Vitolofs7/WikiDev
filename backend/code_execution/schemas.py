from pydantic import BaseModel
from typing import Literal, Optional


class RunCodeRequest(BaseModel):
    language: Literal["python", "javascript"]
    code: str


class RunCodeResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: Optional[int] = None