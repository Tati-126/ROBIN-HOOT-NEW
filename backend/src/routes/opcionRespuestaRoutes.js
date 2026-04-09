import { Router } from "express";
import {
    getOpciones,
    getOpcionById,
    getOpcionesByPregunta,
    createOpcion,
    updateOpcion,
    deleteOpcion,
} from "../controllers/opcionRespuestaController.js";

const router = Router();

router.get("/", getOpciones);
router.get("/:id", getOpcionById);
router.get("/pregunta/:preguntaId", getOpcionesByPregunta);
router.post("/", createOpcion);
router.put("/:id", updateOpcion);
router.delete("/:id", deleteOpcion);

export default router;
