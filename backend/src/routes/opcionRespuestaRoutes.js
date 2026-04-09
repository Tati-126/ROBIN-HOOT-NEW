import { Router } from "express";
import {
    getOpciones,
    getOpcionById,
    getOpcionesByPregunta,
    createOpcion,
    updateOpcion,
    deleteOpcion,
} from "../controllers/opcionRespuestaController.js";
import { verificarToken, autorizarRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/", getOpciones);
router.get("/:id", getOpcionById);
router.get("/pregunta/:preguntaId", getOpcionesByPregunta);
router.post("/", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), createOpcion);
router.put("/:id", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), updateOpcion);
router.delete("/:id", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), deleteOpcion);

export default router;
