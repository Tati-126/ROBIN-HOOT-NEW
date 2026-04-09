# 🗄️ Configurar MongoDB Atlas

## 1️⃣ Crear cuenta en MongoDB Atlas

1. Ve a https://www.mongodb.com/cloud/atlas
2. Haz clic en "Sign Up" (Registrate)
3. Completa el formulario y verifica tu email

## 2️⃣ Crear un Cluster

1. Después de iniciar sesión, haz clic en "Create a Deployment"
2. Elige el plan **FREE** (M0 Sandbox)
3. Selecciona tu región (AWS, GCP, Azure - elige la más cercana)
4. Nombre del cluster: `robin-hoot-cluster`
5. Haz clic en "Create Deployment"

Espera ~5 minutos a que se cree...

## 3️⃣ Obtener Connection String

1. Una vez creado el cluster, haz clic en "Connect"
2. Si es la primera vez, necesitas crear un usuario:
   - Username: `robinhoot`
   - Password: `tu_contraseña_segura` (cópiala)
3. Haz clic en "Create User"
4. Selecciona "MongoDB for VS Code" o "Drivers"
5. Copia la cadena de conexión que se parece a:
   ```
   mongodb+srv://robinhoot:PASSWORD@robin-hoot-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 4️⃣ Actualizar .env

Sustituye `PASSWORD` por tu contraseña y actualiza el archivo `.env`:

```env
MONGO_URI=mongodb+srv://robinhoot:TU_CONTRASEÑA@robin-hoot-cluster.xxxxx.mongodb.net/robinhoot?retryWrites=true&w=majority
JWT_SECRET=robin_hoot_secret_key_2024
PORT=5000
NODE_ENV=development
```

Ejemplo real:
```env
MONGO_URI=mongodb+srv://robinhoot:abc123@robin-hoot-cluster.z1a2b3.mongodb.net/robinhoot?retryWrites=true&w=majority
JWT_SECRET=robin_hoot_secret_key_2024
PORT=5000
NODE_ENV=development
```

## 5️⃣ Permitir acceso desde cualquier IP

1. En la página de Atlas, ve a "Network Access" (Acceso a Red)
2. Haz clic en "Add IP Address"
3. Selecciona "Allow access from anywhere" (0.0.0.0/0)
4. Confirma

✅ **¡Listo!** Ahora puedes conectar desde tu app.

---

**Nota:** En producción, deberías restringir a IPs específicas, pero para desarrollo está bien.
