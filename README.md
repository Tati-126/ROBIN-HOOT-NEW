# 🏹 Robin HOOT — Plataforma de Quizzes Interactivos

Aplicación web SPA de quizzes en tiempo real construida con **React + Vite** (frontend) y **Express + MongoDB + Socket.io** (backend).

[![Ver documentación en Postman](https://run.pstmn.io/button.svg)](https://diazt0346-7144053.postman.co/workspace/2606d8f2-b50f-4c74-84ae-c373550d9a69/collection/53390292-7f54ae44-f5c5-49dc-8e0c-9cfabd72dfc7?action=share&source=copy-link&creator=53390292)

> Para importar y probar localmente: Postman → **Import** → selecciona `backend/robin-hoot.postman_collection.json`

---

## Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 5.x | Framework HTTP |
| MongoDB | Atlas / Local | Base de datos |
| Mongoose | 9.x | ODM |
| JSON Web Token | 9.x | Autenticación |
| cookie-parser | 1.x | Cookies HTTP-only |
| bcryptjs | 3.x | Hash de contraseñas |
| Socket.io | 4.x | Tiempo real |
| dotenv | 17.x | Variables de entorno |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Vite | 6.0.5 | Bundler y dev server |
| React | 18.3.1 | UI Library |
| React Router DOM | 7.x | Enrutamiento SPA |
| React Hook Form | 7.x | Manejo de formularios |
| Zod | 3.x | Validación de esquemas |
| Socket.io Client | 4.8.1 | Comunicación en tiempo real |

---

## Estructura del Proyecto

```
ROBIN-HOOT/
├── frontend/
│   └── src/
│       ├── components/         # Componentes reutilizables (ui/, GameBoard, etc.)
│       ├── context/            # AuthContext (Context API)
│       ├── hooks/              # useAuth
│       ├── pages/              # LandingPage, LoginPage, RegisterPage, Dashboard
│       └── services/           # api.js
└── backend/
    ├── server.js               # Punto de entrada (HTTP + Socket.io)
    └── src/
        ├── config/
        │   └── db.js           # Conexión a MongoDB
        ├── models/
        │   ├── Usuario.js      # Modelo Usuario → ref: Rol
        │   ├── Producto.js     # Modelo Producto → ref: Categoria, Usuario
        │   ├── Categoria.js    # Modelo Categoría
        │   └── Rol.js          # Modelo Rol
        ├── controllers/
        │   ├── usuarioController.js
        │   ├── productoController.js
        │   └── categoriaController.js
        ├── routes/
        │   ├── usuarioRoutes.js
        │   ├── productoRoutes.js
        │   └── categoriaRoutes.js
        ├── middlewares/
        │   ├── auth.js         # Verificación de JWT desde cookie HTTP-only
        │   ├── validacion.js   # Validación de campos requeridos
        │   └── errorHandler.js # Manejo centralizado de errores
        └── modules/
            └── sessions/       # Lógica de partidas en tiempo real (Socket.io)
```

### Relaciones entre modelos

```
Rol  ←──── Usuario ────→  (crea) Producto ──→ Categoria
```

Cada `Producto` tiene una referencia `ObjectId` a `Categoria` y otra a `Usuario` (creadoPor).  
Cada `Usuario` tiene una referencia `ObjectId` a `Rol`.

---

## Instalación y Ejecución

### Requisitos previos
- Node.js 18+
- MongoDB (local o Atlas)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/robin-hoot.git
cd robin-hoot
```

### 2. Backend

```bash
cd backend
npm install
```

Crea el archivo de variables de entorno:

```bash
# backend/.env
MONGO_URI=mongodb://localhost:27017/robinhoot
JWT_SECRET=tu_secreto_jwt_muy_seguro
PORT=5000
NODE_ENV=development
```

Inicia el servidor:

```bash
npm run dev      # modo desarrollo (nodemon)
npm start        # modo producción
npm run seed     # cargar datos de prueba
```

El servidor API estará disponible en `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## Seguridad — Autenticación JWT con Cookies HTTP-only

El token JWT se almacena en una **cookie HTTP-only**, lo que impide su acceso desde JavaScript del navegador y mitiga ataques XSS.

```
POST /api/usuarios/auth/login
→ Set-Cookie: token=<JWT>; HttpOnly; SameSite=Strict
```

Las rutas protegidas verifican la cookie automáticamente mediante el middleware `src/middlewares/auth.js`.

---

## Referencia de la API

### Auth (públicas)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/usuarios/auth/registrar` | Registrar nuevo usuario |
| POST | `/api/usuarios/auth/login` | Login → devuelve cookie HTTP-only |
| POST | `/api/usuarios/auth/logout` | Logout → borra cookie |
| GET | `/api/usuarios/perfil` | 🔒 Perfil del usuario autenticado |

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| PUT | `/api/usuarios/:id` | 🔒 Actualizar usuario |
| DELETE | `/api/usuarios/:id` | 🔒 Eliminar usuario |

### Categorías

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/categorias/:id` | Obtener categoría |
| POST | `/api/categorias` | 🔒 Crear categoría |
| PUT | `/api/categorias/:id` | 🔒 Actualizar categoría |
| DELETE | `/api/categorias/:id` | 🔒 Eliminar categoría |

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar productos (con categoría populada) |
| GET | `/api/productos/:id` | Obtener producto |
| POST | `/api/productos` | 🔒 Crear producto |
| PUT | `/api/productos/:id` | 🔒 Actualizar producto |
| DELETE | `/api/productos/:id` | 🔒 Eliminar producto |

> 🔒 = Requiere autenticación (cookie JWT activa)

### Ejemplo: Registro y Login

```bash
# Registrar
curl -X POST http://localhost:5000/api/usuarios/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","email":"ana@demo.com","password":"secret123"}'

# Login (guarda cookie automáticamente con -c)
curl -c cookies.txt -X POST http://localhost:5000/api/usuarios/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@demo.com","password":"secret123"}'

# Ruta protegida (envía cookie con -b)
curl -b cookies.txt http://localhost:5000/api/usuarios/perfil
```

---

## Características Implementadas

- ✅ Estructura MVC en `src/` (models, controllers, routes, config, middlewares)
- ✅ 3 modelos relacionados con `ObjectId`: `Usuario → Rol`, `Producto → Categoria`, `Producto → Usuario`
- ✅ Autenticación JWT con registro y login
- ✅ Token JWT en cookie **HTTP-only** (mitiga XSS)
- ✅ Rutas protegidas con middleware de autenticación
- ✅ CORS configurado para frontend local (`localhost:5173`)
- ✅ Tiempo real con Socket.io para partidas de quiz
- ✅ Hash de contraseñas con bcryptjs
- ✅ Manejo centralizado de errores

