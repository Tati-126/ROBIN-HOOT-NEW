/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos del catálogo
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *   post:
 *     summary: Crear un producto (protegido)
 *     tags: [Productos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio, categoria]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Curso de Álgebra
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 example: 29.99
 *               categoria:
 *                 type: string
 *                 description: ObjectId de la categoría
 *                 example: 664f1b2c3d4e5f6a7b8c9d10
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Faltan campos requeridos
 *       401:
 *         description: No autenticado
 *
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualizar producto (protegido)
 *     tags: [Productos]
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
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrado
 *   delete:
 *     summary: Eliminar producto (protegido)
 *     tags: [Productos]
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
 *         description: Producto eliminado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrado
 */

import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  eliminarProducto,
} from "../controllers/productoController.js";

const router = express.Router();

router.post("/", crearProducto);
router.get("/", obtenerProductos);
router.get("/:id", obtenerProducto);
router.delete("/:id", eliminarProducto);

export default router;