/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Gestión de categorías de productos/juegos
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *   post:
 *     summary: Crear una categoría (protegido)
 *     tags: [Categorías]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ciencias
 *               descripcion:
 *                 type: string
 *                 example: Preguntas de ciencias naturales
 *     responses:
 *       201:
 *         description: Categoría creada
 *       400:
 *         description: Nombre ya existe o faltan campos
 *       401:
 *         description: No autenticado
 *
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *   put:
 *     summary: Actualizar categoría (protegido)
 *     tags: [Categorías]
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
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrada
 *   delete:
 *     summary: Eliminar categoría (protegido)
 *     tags: [Categorías]
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
 *         description: Categoría eliminada
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrada
 */

import express from "express";
import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriaController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoria);
router.post("/", verificarToken, crearCategoria);
router.put("/:id", verificarToken, actualizarCategoria);
router.delete("/:id", verificarToken, eliminarCategoria);

export default router;
