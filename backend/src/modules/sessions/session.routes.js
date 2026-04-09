import { Router } from "express";
import {
    createSession,
    iniciarPartida,
    startSession,
    joinSession,
    submitAnswer,
    getRanking,
    endSession,
} from "./session.controller.js";
import { verificarToken, autorizarRoles } from "../../middlewares/auth.js";

const router = Router();

// POST /api/sessions – Crear partida (forma original)
router.post("/", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), createSession);

// POST /api/sessions/start – Crear partida + generar PIN numérico (ej: 384920)
router.post("/start", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), iniciarPartida);

// POST /api/sessions/join – Unirse con PIN + nickname
router.post("/join", joinSession);

// POST /api/sessions/:sessionId/start – Activar sesión ya creada
router.post("/:sessionId/start", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), startSession);

// POST /api/sessions/:sessionId/answer – Registrar respuesta
router.post("/:sessionId/answer", submitAnswer);

// GET /api/sessions/:sessionId/ranking – Ranking en vivo
router.get("/:sessionId/ranking", getRanking);

// POST /api/sessions/:sessionId/end – Finalizar partida
router.post("/:sessionId/end", verificarToken, autorizarRoles("ADMIN", "DOCENTE"), endSession);

export default router;
