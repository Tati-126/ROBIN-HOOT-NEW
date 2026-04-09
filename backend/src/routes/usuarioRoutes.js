import express from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  cambiarContraseña,
  eliminarUsuario,
  login,
  registrar,
  perfil,
} from "../controllers/usuarioController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Registro, autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /api/usuarios/auth/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ana García
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ana@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Email ya registrado o faltan campos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/auth/registrar", registrar);

/**
 * @swagger
 * /api/usuarios/auth/login:
 *   post:
 *     summary: Iniciar sesión (setea cookie HTTP-only con JWT)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ana@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login exitoso — cookie token seteada
 *       400:
 *         description: Credenciales inválidas o faltan campos
 */
router.post("/auth/login", login);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autenticado
 */
router.get("/perfil", verificarToken, perfil);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *   post:
 *     summary: Crear usuario (admin)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
 */
router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", actualizarUsuario);
router.patch("/:id/cambiar-contraseña", cambiarContraseña);
router.delete("/:id", eliminarUsuario);

export default router;
