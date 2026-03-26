# WikiDev — Description and Scope

## 1. Project Description

**WikiDev** es una aplicación de documentación personal de programación que permite a los usuarios:

- Crear, consultar y buscar **artículos de programación** en formato MDX
- Ejecutar **código de ejemplo** en Python y JavaScript de forma segura y controlada
- Mantener **notas personales** con soporte de imágenes y autoguardado
- Consultar un **historial de artículos visitados** para una navegación eficiente

El proyecto combina un **frontend interactivo** con un **backend ligero** que se encarga de la persistencia de datos y la ejecución segura de código.

---

## 2. Project Scope

### In Scope

- Desarrollo de **frontend web** con Next.js y TypeScript
- Renderizado de **artículos MDX** con ejemplos ejecutables
- Creación y gestión de **notas personales** con editor avanzado
- **Búsqueda fuzzy** de artículos y notas (Fuse.js)
- Registro de historial de navegación
- Ejecución de código local mediante **subprocess** en backend
- Persistencia de datos mediante **SQLite** y **SQLAlchemy**
- Implementación de **CI/CD básico** para frontend y backend
- Gestión de **versiones y documentación** del proyecto

### Out of Scope

- Exposición del servicio de ejecución de código a internet público (solo ejecución local)
- Autenticación y multiusuario (proyecto personal por ahora)
- Integración con bases de datos externas o servicios cloud
- Funcionalidades avanzadas de colaboración en tiempo real
- Escalabilidad a producción masiva o multi-servidor

---

## 3. Goals and Objectives

- Proveer un **entorno seguro y controlado** para experimentar con código
- Mantener **documentación y notas centralizadas** en un mismo lugar
- Facilitar **aprendizaje y repaso** mediante ejemplos ejecutables
- Garantizar **alta calidad de código** mediante tests y buenas prácticas
- Documentar el **flujo de trabajo y arquitectura** del proyecto para futura expansión

---

## 4. Users

- Desarrolladores o estudiantes que quieran **aprender y practicar** Python, JavaScript y algoritmos
- Usuarios que necesiten un **repositorio personal de documentación** y notas de programación
- Equipos pequeños que busquen un **entorno de pruebas local** para ejemplos de código

---

## 5. Constraints

- La ejecución de código está limitada a **5 segundos** por ejecución
- Máximo de **20 ejecuciones por minuto por IP**
- Tamaño máximo de imágenes: **5 MB**
- Proyecto orientado a **entorno local**, no a despliegue público sin seguridad adicional

---

## 6. Assumptions

- Node.js y Python están instalados y accesibles en el sistema
- El usuario dispone de un entorno local para ejecutar el frontend y backend
- Los artículos y notas se mantendrán de manera organizada en la estructura de carpetas