import express from "express";
import {
  crearJuego,
  obtenerJuegos,
  obtenerJuego,
  actualizarJuego,
  eliminarJuego,
} from "../controllers/juegoController.js";
import { verificarToken, autorizarRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerJuegos);
router.get("/:id", obtenerJuego);
router.post("/", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), crearJuego);
router.put("/:id", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), actualizarJuego);
router.delete("/:id", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), eliminarJuego);

export default router;
