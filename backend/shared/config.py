import os
from dotenv import load_dotenv

# Carga automáticamente las variables definidas en un archivo .env
# y las añade al entorno de ejecución actual.
load_dotenv()

# URL base del servicio Piston utilizado para ejecutar código.
# Si la variable de entorno PISTON_URL no existe,
# se utilizará la URL por defecto indicada.
PISTON_URL = os.getenv("PISTON_URL", "https://emkc.org/api/v2/piston")

# Lista de orígenes permitidos para CORS.
# Se obtiene desde la variable de entorno CORS_ORIGINS.
#
# Ejemplo de valor en .env:
# CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:5173
#
# split(",") transforma la cadena en una lista de URLs.
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
