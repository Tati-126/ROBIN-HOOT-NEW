import * as sessionService from "./session.service.js";
import Session from "./session.model.js";
import Pregunta from "../../models/Pregunta.js";

/**
 * Map que almacena los timers de transición de preguntas por sessionId.
 * Evita que se acumulen timers y permite limpiarlos si el juego se cancela.
 * @type {Map<string, NodeJS.Timeout>}
 */
const questionTimers = new Map();

/**
 * Limpia el timeout de transición de pregunta para una sesión.
 * @param {string} sessionId
 */
const clearQuestionTimer = (sessionId) => {
    const timer = questionTimers.get(sessionId);
    if (timer) {
        clearTimeout(timer);
        questionTimers.delete(sessionId);
    }
};

/**
 * Maneja el avance a la siguiente pregunta.
 * Esta función se llama tanto manualmente (por el host) como automáticamente (por el timer).
 * @param {import("socket.io").Server} io
 * @param {string} sessionId
 * @param {number} preguntaIndex
 */
const handleNextQuestion = async (io, sessionId, preguntaIndex) => {
    try {
        const room = `session_${sessionId}`;
        console.log(`[handleNextQuestion] Iniciando para sessionId: ${sessionId}, preguntaIndex: ${preguntaIndex}`);
        
        const session = await Session.findById(sessionId);
        if (!session) {
            console.error(`[handleNextQuestion] Sesión no encontrada: ${sessionId}`);
            return;
        }

        // Limpiar timer previo si existe
        clearQuestionTimer(sessionId);

        const preguntas = await Pregunta.find({ juegoId: session.juegoId });
        console.log(`[handleNextQuestion] Total de preguntas: ${preguntas.length}, índice solicitado: ${preguntaIndex}`);

        if (preguntaIndex >= preguntas.length) {
            // Fin del juego — emitir ranking final a toda la sala
            console.log(`[handleNextQuestion] ✅ FIN DEL JUEGO - Emitiendo game_finished`);
            await sessionService.clearCurrentQuestion(sessionId);
            const ranking = await sessionService.getRanking(sessionId);
            io.to(room).emit("game_finished", { ranking });
            console.log(`[Socket] Juego finalizado en sesión ${sessionId}`);
        } else {
            // Avanzar a la siguiente pregunta (SIN opciones para evitar trampa)
            const pregunta = preguntas[preguntaIndex];
            const tiempoLimiteSec = pregunta.tiempoLimite;
            const tiempoLimiteMs = tiempoLimiteSec * 1000;
            const transitionDelayMs = 3000; // 3 segundos de transición

            await sessionService.setCurrentQuestion(
                sessionId,
                pregunta._id,
                preguntaIndex,
                tiempoLimiteSec
            );

            console.log(`[handleNextQuestion] 📤 Emitiendo question_changed para la pregunta ${preguntaIndex + 1}`);
            io.to(room).emit("question_changed", {
                preguntaIndex,
                pregunta: {
                    _id: pregunta._id,
                    enunciado: pregunta.enunciado,
                    tipo: pregunta.tipo,
                    tiempoLimite: pregunta.tiempoLimite,
                },
                serverTimestamp: Date.now(),
                durationMs: tiempoLimiteMs,
            });

            console.log(`[Socket] Pregunta ${preguntaIndex + 1} enviada a sesión ${sessionId} - Próximo auto-avance en ${tiempoLimiteMs + transitionDelayMs}ms`);

            // Programar automáticamente la siguiente pregunta después del tiempo + transición
            const nextQuestionTimer = setTimeout(async () => {
                console.log(`[Socket] ⏰ Auto-avanzando a pregunta ${preguntaIndex + 2} en sesión ${sessionId}`);
                await handleNextQuestion(io, sessionId, preguntaIndex + 1);
            }, tiempoLimiteMs + transitionDelayMs);

            questionTimers.set(sessionId, nextQuestionTimer);
        }
    } catch (error) {
        console.error(`[Socket] ❌ Error en handleNextQuestion: ${error.message}`, error);
    }
};

/**
 * Inicializa todos los eventos de Socket.io para el módulo de sesiones.
 * @param {import("socket.io").Server} io
 */
export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket] Cliente conectado: ${socket.id}`);

        // ── join_session ────────────────────────────────────────────────────────
        // El cliente envía: { pin, usuarioId, nombre }
        socket.on("join_session", async ({ pin, usuarioId, nombre }) => {
            try {
                const { session, participant } = await sessionService.joinSession(
                    pin,
                    nombre,     // nickname es el 2do parámetro del servicio
                    usuarioId   // usuarioId es el 3er parámetro del servicio
                );

                const room = `session_${session._id}`;
                socket.join(room);

                // Confirmar al participante que se unió
                socket.emit("session_joined", {
                    success: true,
                    sessionId: session._id,
                    juegoId: session.juegoId,
                    estado: session.estado,
                    participantId: participant._id,
                    nombre: participant.nombre,
                    puntaje: participant.puntaje,
                });

                // Notificar al resto de la sala
                socket.to(room).emit("participant_joined", {
                    participantId: participant._id,
                    nombre: participant.nombre,
                    puntaje: participant.puntaje,
                });

                // Ranking actualizado para todos en la sala
                const ranking = await sessionService.getRanking(session._id);
                io.to(room).emit("ranking_updated", { ranking });

                console.log(`[Socket] ${nombre} se unió a la sesión ${session._id}`);
            } catch (error) {
                socket.emit("session_joined", {
                    success: false,
                    message: error.message,
                });
            }
        });

        // ── start_session ───────────────────────────────────────────────────────
        // El cliente envía: { sessionId }
        socket.on("start_session", async ({ sessionId }) => {
            try {
                const session = await sessionService.startSession(sessionId);
                const room = `session_${sessionId}`;

                io.to(room).emit("session_started", {
                    sessionId: session._id,
                    startedAt: session.startedAt,
                });

                console.log(`[Socket] Sesión ${sessionId} iniciada`);
            } catch (error) {
                socket.emit("session_started", {
                    success: false,
                    message: error.message,
                });
            }
        });

        // ── submit_answer ───────────────────────────────────────────────────────
        // El cliente envía: { sessionId, participantId, preguntaId, opcionId, correcta, tiempoRespuestaMs }
        socket.on("submit_answer", async (payload) => {
            try {
                const { sessionId, participantId, correcta } = payload;
                const room = `session_${sessionId}`;

                console.log(`[Socket] 📝 Respuesta recibida: participante ${participantId}, correcta: ${correcta}`);

                const { answer, puntaje } = await sessionService.submitAnswer({
                    ...payload,
                    timeReceived: Date.now(),
                });

                // Confirmar al que respondió
                socket.emit("answer_processed", {
                    success: true,
                    correcta: answer.correcta,
                    puntosGanados: answer.puntosGanados,
                    puntajeTotal: puntaje,
                    serverTimestamp: Date.now(),
                });

                // Actualizar ranking para todos en la sala
                const ranking = await sessionService.getRanking(sessionId);
                io.to(room).emit("ranking_updated", { ranking });

                console.log(
                    `[Socket] ✅ Respuesta registrada: participante ${participantId} – puntos: ${answer.puntosGanados}`
                );
            } catch (error) {
                console.error(`[Socket] ❌ Error en submit_answer: ${error.message}`);
                socket.emit("answer_processed", {
                    success: false,
                    message: error.message,
                });
            }
        });

        // ── next_question ───────────────────────────────────────────────────────
        // El host envía: { sessionId, preguntaIndex } para avanzar manualmente
        socket.on("next_question", async ({ sessionId, preguntaIndex }) => {
            console.log(`[Socket] Host solicitando siguiente pregunta: sesión ${sessionId}, índice ${preguntaIndex}`);
            await handleNextQuestion(io, sessionId, preguntaIndex);
        });

        // ── disconnect ──────────────────────────────────────────────────────────
        socket.on("disconnect", () => {
            console.log(`[Socket] Cliente desconectado: ${socket.id}`);
        });
    });
};

/**
 * Limpia los timers de una sesión cuando el juego se cancela o finaliza.
 * @param {string} sessionId
 */
export const cleanupSessionTimers = (sessionId) => {
    clearQuestionTimer(sessionId);
};
