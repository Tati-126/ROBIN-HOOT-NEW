# Diccionario de Endpoints — Robin HOOT API

> Base URL: `http://localhost:5000`  
> Autenticación: JWT almacenado en **cookie HTTP-only** (`token`). Se activa después de hacer login.  
> Rutas marcadas con 🔒 requieren estar autenticado.

---

## Auth / Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `POST` | `/api/usuarios/auth/registrar` | Registrar nuevo usuario | `{ nombre, email, password }` | `201 Created` | `400` campos faltantes / email duplicado · `500` error servidor |
| `POST` | `/api/usuarios/auth/login` | Iniciar sesión — setea cookie `token` | `{ email, password }` | `200 OK` + cookie | `400` credenciales inválidas / campos faltantes |
| `POST` | `/api/usuarios/auth/logout` | Cerrar sesión — borra cookie | — | `200 OK` | — |
| `GET` | `/api/usuarios/perfil` 🔒 | Obtener perfil del usuario autenticado | — | `200 OK` `{ usuario }` | `401` no autenticado |
| `GET` | `/api/usuarios` | Listar todos los usuarios | — | `200 OK` `[...]` | `500` error servidor |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID | — | `200 OK` `{ usuario }` | `404` no encontrado · `500` ID inválido |
| `POST` | `/api/usuarios` | Crear usuario (admin) | `{ nombre, email, password }` | `201 Created` | `400` datos inválidos |
| `PUT` | `/api/usuarios/:id` 🔒 | Actualizar usuario | `{ nombre?, email? }` | `200 OK` | `401` no autenticado · `404` no encontrado |
| `PATCH` | `/api/usuarios/:id/cambiar-contraseña` 🔒 | Cambiar contraseña | `{ passwordActual, passwordNueva }` | `200 OK` | `400` contraseña incorrecta · `401` · `404` |
| `DELETE` | `/api/usuarios/:id` 🔒 | Eliminar usuario | — | `200 OK` | `401` no autenticado · `404` no encontrado |

---

## Categorías (`/api/categorias`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/categorias` | Listar todas las categorías | — | `200 OK` `[...]` | `500` error servidor |
| `GET` | `/api/categorias/:id` | Obtener categoría por ID | — | `200 OK` `{ categoria }` | `404` no encontrada |
| `POST` | `/api/categorias` 🔒 | Crear categoría | `{ nombre, descripcion? }` | `201 Created` | `400` nombre duplicado · `401` no autenticado |
| `PUT` | `/api/categorias/:id` 🔒 | Actualizar categoría | `{ nombre?, descripcion? }` | `200 OK` | `401` · `404` |
| `DELETE` | `/api/categorias/:id` 🔒 | Eliminar categoría | — | `200 OK` | `401` · `404` |

---

## Productos (`/api/productos`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/productos` | Listar todos los productos | — | `200 OK` `[...]` | `500` error servidor |
| `GET` | `/api/productos/:id` | Obtener producto por ID | — | `200 OK` `{ producto }` | `404` no encontrado |
| `POST` | `/api/productos` 🔒 | Crear producto | `{ nombre, descripcion?, precio, categoria }` | `201 Created` | `400` faltan campos · `401` |
| `PUT` | `/api/productos/:id` 🔒 | Actualizar producto | `{ nombre?, precio?, descripcion?, categoria? }` | `200 OK` | `401` · `404` |
| `DELETE` | `/api/productos/:id` 🔒 | Eliminar producto | — | `200 OK` | `401` · `404` |

---

## Roles (`/api/roles`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/roles` | Listar todos los roles | — | `200 OK` `[...]` | `500` |
| `GET` | `/api/roles/:id` | Obtener rol por ID | — | `200 OK` | `404` |
| `POST` | `/api/roles` | Crear rol | `{ nombre }` | `201 Created` | `400` |
| `PUT` | `/api/roles/:id` | Actualizar rol | `{ nombre }` | `200 OK` | `404` |
| `DELETE` | `/api/roles/:id` | Eliminar rol | — | `200 OK` | `404` |

---

## Juegos (`/api/juegos`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/juegos` | Listar juegos | — | `200 OK` `[...]` | `500` |
| `GET` | `/api/juegos/:id` | Obtener juego por ID | — | `200 OK` | `404` |
| `POST` | `/api/juegos` 🔒 | Crear juego | `{ titulo, descripcion?, categoria }` | `201 Created` | `400` · `401` |
| `PUT` | `/api/juegos/:id` 🔒 | Actualizar juego | `{ titulo?, descripcion? }` | `200 OK` | `401` · `404` |
| `DELETE` | `/api/juegos/:id` 🔒 | Eliminar juego | — | `200 OK` | `401` · `404` |

---

## Preguntas (`/api/preguntas`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/preguntas` | Listar preguntas | — | `200 OK` `[...]` | `500` |
| `GET` | `/api/preguntas/:id` | Obtener pregunta por ID | — | `200 OK` | `404` |
| `POST` | `/api/preguntas` 🔒 | Crear pregunta | `{ enunciado, juegoId, tiempoLimite? }` | `201 Created` | `400` · `401` |
| `PUT` | `/api/preguntas/:id` 🔒 | Actualizar pregunta | `{ enunciado?, tiempoLimite? }` | `200 OK` | `401` · `404` |
| `DELETE` | `/api/preguntas/:id` 🔒 | Eliminar pregunta | — | `200 OK` | `401` · `404` |

---

## Opciones de Respuesta (`/api/opciones`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/opciones` | Listar opciones | — | `200 OK` `[...]` | `500` |
| `GET` | `/api/opciones/:id` | Obtener opción por ID | — | `200 OK` | `404` |
| `POST` | `/api/opciones` 🔒 | Crear opción | `{ texto, esCorrecta, preguntaId }` | `201 Created` | `400` · `401` |
| `PUT` | `/api/opciones/:id` 🔒 | Actualizar opción | `{ texto?, esCorrecta? }` | `200 OK` | `401` · `404` |
| `DELETE` | `/api/opciones/:id` 🔒 | Eliminar opción | — | `200 OK` | `401` · `404` |

---

## Sesiones en Tiempo Real (`/api/sessions`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `POST` | `/api/sessions` 🔒 | Crear sesión de juego | `{ juegoId }` | `201 Created` `{ pin }` | `400` · `401` |
| `GET` | `/api/sessions/:pin` | Obtener sesión por PIN | — | `200 OK` | `404` |
| `POST` | `/api/sessions/:pin/join` | Unirse a una sesión | `{ nickname }` | `200 OK` | `400` · `404` |
| `POST` | `/api/sessions/:pin/start` 🔒 | Iniciar la sesión | — | `200 OK` | `401` · `404` |

> Las sesiones también se controlan en tiempo real vía **Socket.io** en los eventos:  
> `join-session` · `start-game` · `submit-answer` · `next-question` · `end-game`

---

## Ranking (`/api/ranking`)

| Método | Endpoint | Descripción | Request Body | ✅ Éxito | ❌ Errores |
|--------|----------|-------------|-------------|---------|----------|
| `GET` | `/api/ranking` | Obtener ranking global | — | `200 OK` `[...]` | `500` |
| `GET` | `/api/ranking/:sesionId` | Ranking de una sesión | — | `200 OK` `[...]` | `404` |

---

## Estructura de Respuestas

### Éxito (2xx)
```json
{
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Error (4xx / 5xx)
```json
{
  "message": "Descripción del error"
}
```

---

## Stack Tecnológico

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **Node.js** | ≥18 | Runtime de JavaScript |
| **Express** | ^5.x | Framework HTTP |
| **Mongoose** | ^9.x | ODM para MongoDB |
| **MongoDB Atlas** | — | Base de datos NoSQL en la nube |
| **jsonwebtoken** | ^9.x | Generación y verificación de JWT |
| **bcryptjs** | ^3.x | Hash de contraseñas |
| **cookie-parser** | ^1.4 | Lectura de cookies HTTP |
| **cors** | ^2.8 | Control de acceso entre orígenes |
| **dotenv** | ^17.x | Variables de entorno |
| **socket.io** | ^4.x | Comunicación en tiempo real (WebSockets) |
| **swagger-jsdoc** | ^6.x | Generación de spec OpenAPI desde JSDoc |
| **swagger-ui-express** | ^5.x | Visualización de docs en `/api-docs` |
| **Jest** | ^29.x | Framework de testing |
| **Supertest** | ^7.x | Testing de endpoints HTTP |
| **nodemon** | ^3.x | Reinicio automático en desarrollo |
