import { Router } from "express";
import {
    getPreguntas,
    getPreguntaById,
    getPreguntasByJuego,
    createPregunta,
    updatePregunta,
    deletePregunta,
} from "../controllers/preguntaController.js";
import { verificarToken, autorizarRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/", getPreguntas);
router.get("/:id", getPreguntaById);
router.get("/juego/:juegoId", getPreguntasByJuego);
router.post("/", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), createPregunta);
router.put("/:id", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), updatePregunta);
router.delete("/:id", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), deletePregunta);

export default router;
