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

const router = Router();

// POST /api/sessions – Crear partida (forma original)
router.post("/", createSession);

// POST /api/sessions/start – Crear partida + generar PIN numérico (ej: 384920)
router.post("/start", iniciarPartida);

// POST /api/sessions/join – Unirse con PIN + nickname
router.post("/join", joinSession);

// POST /api/sessions/:sessionId/start – Activar sesión ya creada
router.post("/:sessionId/start", startSession);

// POST /api/sessions/:sessionId/answer – Registrar respuesta
router.post("/:sessionId/answer", submitAnswer);

// GET /api/sessions/:sessionId/ranking – Ranking en vivo
router.get("/:sessionId/ranking", getRanking);

// POST /api/sessions/:sessionId/end – Finalizar partida
router.post("/:sessionId/end", endSession);

export default router;
