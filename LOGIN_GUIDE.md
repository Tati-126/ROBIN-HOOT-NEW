# 🔐 Guía de Autenticación - Robin Hoot

## ✅ Cambios realizados

### Backend
1. ✅ **Rutas de autenticación agregadas** (`backend/routes/usuarioRoutes.js`)
   - `POST /api/usuarios/auth/registrar` - Crear usuario nuevo
   - `POST /api/usuarios/auth/login` - Iniciar sesión
   - `GET /api/usuarios/perfil` - Obtener perfil (protegido con token)

2. ✅ **Funciones corregidas** (`backend/controllers/usuarioController.js`)
   - `registrar()` - Ahora asigna rol por defecto (ESTUDIANTE)
   - `login()` - Genera JWT token y devuelve usuario + token
   - Usa campo correcto `contraseña` en lugar de `password`

3. ✅ **Variables de entorno** (`backend/.env.example`)
   - Agregada `JWT_SECRET` (requiere valor en `.env`)

### Frontend
1. ✅ **Funciones de API** (`frontend/src/services/api.js`)
   - `registrarUsuario(nombre, email, password)` - Registrar
   - `loginUsuario(email, password)` - Login (guarda token en localStorage)
   - `obtenerPerfil()` - Obtener datos del usuario autenticado
   - `logout()` - Eliminar token y datos

2. ✅ **Componente Login** (`frontend/src/components/Login.jsx`)
   - Modal de login/registro
   - Validaciones de campos
   - Manejo de errores y estados
   - Callback `onLoginSuccess`

3. ✅ **App.jsx actualizado** (`frontend/src/App.jsx`)
   - Muestra `<Login>` si no hay usuario autenticado
   - Muestra juego si hay usuario autenticado
   - Botón "Cerrar sesión"
   - Persiste usuario en localStorage

---

## 🚀 Cómo usar

### 1. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```
MONGO_URI=mongodb://localhost:27017/robinhoot
JWT_SECRET=mi_clave_secreta_super_segura_123
PORT=5000
NODE_ENV=development
```

Arrancar servidor:
```bash
npm run dev
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Probar Login

1. Abre `http://localhost:5173` (Vite default)
2. Verás el formulario de LOGIN
3. Haz clic en "Regístrate aquí"
4. Completa formulario (nombre, email, contraseña)
5. Vuelve a LOGIN con las mismas credenciales
6. ✅ Debería loguearse y mostrar el juego

---

## 📋 Flujo de autenticación

```
Usuario → Frontend (Login.jsx)
   ↓
[Registrar] → POST /api/usuarios/auth/registrar
   ↓
Backend crea usuario con rol ESTUDIANTE
   ↓
[Login] → POST /api/usuarios/auth/login
   ↓
Backend devuelve:
{
  token: "eyJhbG...",
  usuario: { id, nombre, email }
}
   ↓
Frontend guarda en localStorage
   ↓
App.jsx muestra Game Board + Ranking
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salts)
- ✅ JWT tokens con expiración (1 día)
- ✅ Middleware `auth.js` protege rutas
- ✅ Token guardado en localStorage
- ✅ Validación de campos requeridos

---

## 📝 Próximos pasos (opcionales)

- [ ] Agregar verificación de email
- [ ] Recuperar contraseña
- [ ] Roles (ADMIN, DOCENTE, ESTUDIANTE)
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Validación más estricta en servidor

---

## ⚠️ Errores comunes

**Error: "JWT_SECRET is not defined"**
→ Asegúrate de tener `JWT_SECRET=algo` en `.env`

**Error: "Email ya registrado"**
→ Ese email ya existe en la BD. Usa otro.

**Error: "Credenciales inválidas"**
→ Email o contraseña incorrectos

**Error CORS**
→ Verifica que VITE_BACKEND_URL en frontend sea correcto

---

Made with ❤️ for Robin Hoot
