import { Router } from "express";
import {
    getPreguntas,
    getPreguntaById,
    getPreguntasByJuego,
    createPregunta,
    updatePregunta,
    deletePregunta,
} from "../controllers/preguntaController.js";

const router = Router();

router.get("/", getPreguntas);
router.get("/:id", getPreguntaById);
router.get("/juego/:juegoId", getPreguntasByJuego);
router.post("/", createPregunta);
router.put("/:id", updatePregunta);
router.delete("/:id", deletePregunta);

export default router;
