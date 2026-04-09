import express from "express";
import {
  crearJuego,
  obtenerJuegos,
  obtenerJuego,
  actualizarJuego,
  eliminarJuego,
} from "../controllers/juegoController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerJuegos);
router.get("/:id", obtenerJuego);
router.post("/", verificarToken, crearJuego);
router.put("/:id", verificarToken, actualizarJuego);
router.delete("/:id", verificarToken, eliminarJuego);

export default router;
