from fastapi import APIRouter, HTTPException
from .schemas import RunCodeRequest, RunCodeResponse
from .service import execute_code
import traceback

# Crea un router específico para los endpoints relacionados con ejecución de código.
# La etiqueta permite agruparlos en la documentación automática de FastAPI.
router = APIRouter(tags=["code-execution"])


# Endpoint POST que recibe código para ejecutar.
# La respuesta estará validada automáticamente con el esquema RunCodeResponse.
@router.post("/execute", response_model=RunCodeResponse)
async def run_code(req: RunCodeRequest):
    try:
        # Llama al servicio principal encargado de ejecutar el código.
        return await execute_code(req)
    except Exception as e:
        # Registra el traceback completo en consola para facilitar depuración.
        print("ERROR:", traceback.format_exc())
        # Devuelve un error HTTP 500 al cliente.
        raise HTTPException(status_code=500, detail=str(e))
