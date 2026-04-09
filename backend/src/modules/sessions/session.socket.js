import * as sessionService from "./session.service.js";

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
                const { sessionId } = payload;
                const room = `session_${sessionId}`;

                const { answer, puntaje } = await sessionService.submitAnswer(payload);

                // Confirmar al que respondió
                socket.emit("answer_processed", {
                    success: true,
                    correcta: answer.correcta,
                    puntosGanados: answer.puntosGanados,
                    puntajeTotal: puntaje,
                });

                // Actualizar ranking para todos en la sala
                const ranking = await sessionService.getRanking(sessionId);
                io.to(room).emit("ranking_updated", { ranking });

                console.log(
                    `[Socket] Respuesta registrada por participante ${payload.participantId} – puntos: ${answer.puntosGanados}`
                );
            } catch (error) {
                socket.emit("answer_processed", {
                    success: false,
                    message: error.message,
                });
            }
        });

        // ── disconnect ──────────────────────────────────────────────────────────
        socket.on("disconnect", () => {
            console.log(`[Socket] Cliente desconectado: ${socket.id}`);
        });
    });
};
