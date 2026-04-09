import express from "express";
import {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
} from "../controllers/rolController.js";

const router = express.Router();

// Rutas para roles
router.get("/", obtenerRoles);
router.get("/:id", obtenerRolPorId);
router.post("/", crearRol);
router.put("/:id", actualizarRol);
router.delete("/:id", eliminarRol);

export default router;
