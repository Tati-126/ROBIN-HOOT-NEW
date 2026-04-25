import { useState, useEffect } from "react";
import {
  unirseASesion,
  obtenerPreguntasDelJuego,
  obtenerOpcionesPorPregunta,
} from "../services/api.js";
import socket from "../socket.js";
import { useAuth } from "../hooks/useAuth.jsx";
import CustomCard from "./ui/CustomCard";
import MyButton from "./ui/MyButton";
import { Hash, AlertCircle, Users, Trophy } from "lucide-react";

/** Retorna el emoji de medalla para el top 3 */
const getMedal = (index) => {
  const medals = ["🥇", "🥈", "🥉"];
  return medals[index] ?? null;
};

/**
 * GameBoard - Unirse a una partida por PIN con sala de espera en tiempo real
 */
export default function GameBoard() {
  const { usuario } = useAuth();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [iniciada, setIniciada] = useState(false);
  const [preguntasJuego, setPreguntasJuego] = useState([]);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(false);

  const cargarPreguntasJuego = async (juegoId) => {
    if (!juegoId) return;

    setCargandoPreguntas(true);
    try {
      const preguntas = await obtenerPreguntasDelJuego(juegoId);

      const preguntasConOpciones = await Promise.all(
        (preguntas || []).map(async (pregunta) => {
          const opciones = await obtenerOpcionesPorPregunta(pregunta._id);
          return {
            ...pregunta,
            opciones: opciones || [],
          };
        })
      );

      setPreguntasJuego(preguntasConOpciones);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las preguntas del juego");
    } finally {
      setCargandoPreguntas(false);
    }
  };

  useEffect(() => {
    if (!sesion) return;
    const onRankingUpdated = ({ ranking }) => setRanking(ranking);
    const onSessionStarted = async () => {
      setIniciada(true);
      await cargarPreguntasJuego(sesion.juegoId);
    };
    socket.on("ranking_updated", onRankingUpdated);
    socket.on("session_started", onSessionStarted);
    return () => {
      socket.off("ranking_updated", onRankingUpdated);
      socket.off("session_started", onSessionStarted);
    };
  }, [sesion]);

  const handleUnirse = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return setError("Ingresa un PIN válido");
    if (!nickname.trim()) return setError("Ingresa tu nickname");
    setLoading(true);
    setError(null);
    try {
      const result = await unirseASesion(
        pin.trim(),
        nickname.trim(),
        usuario?._id || usuario?.id
      );
      const { sessionId, participantId, juegoId, estado } = result.data;
      setSesion({ sessionId, participantId, juegoId });

      // Si el estudiante entra cuando la sesión ya está activa, cargamos preguntas de inmediato.
      if (estado === "ACTIVA") {
        setIniciada(true);
        await cargarPreguntasJuego(juegoId);
      }

      // Unirse al room de socket para recibir eventos en tiempo real
      socket.emit("join_session", {
        pin: pin.trim(),
        usuarioId: usuario?._id || usuario?.id || `guest_${Date.now()}`,
        nombre: nickname.trim(),
      });
    } catch (err) {
      setError(err.message || "PIN inválido o sesión no encontrada");
    } finally {
      setLoading(false);
    }
  };

  // Sala de espera / juego activo
  if (sesion) {
    return (
      <CustomCard
        variant="yellow"
        icon={iniciada ? <Trophy size={32} /> : <Users size={32} />}
        title={iniciada ? "¡Partida en Curso!" : "Sala de Espera"}
      >
        <div style={{ textAlign: "center" }}>
          {/* Badge prominente con el nickname del jugador */}
          <div className="player-badge">
            <Trophy size={20} />
            <span>{nickname}</span>
          </div>

          {iniciada ? (
            <>
              <p className="session-active-header">¡El juego ha comenzado!</p>

              {/* Área de preguntas — Persona 3 refactorizará esta sección */}
              {cargandoPreguntas ? (
                <p style={{ marginBottom: "18px", color: "var(--color-text-muted)" }}>
                  Cargando preguntas...
                </p>
              ) : (
                <div style={{ marginBottom: "18px", textAlign: "left" }}>
                  <p style={{ fontWeight: "800", marginBottom: "10px" }}>
                    Preguntas disponibles: {preguntasJuego.length}
                  </p>

                  {preguntasJuego.length === 0 ? (
                    <p style={{ color: "var(--color-text-muted)" }}>
                      Esta partida aún no tiene preguntas asociadas.
                    </p>
                  ) : (
                    <div
                      style={{
                        maxHeight: "220px",
                        overflowY: "auto",
                        display: "grid",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      {preguntasJuego.map((pregunta, idx) => (
                        <div
                          key={pregunta._id}
                          style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: "10px",
                            padding: "10px",
                            border: "1px solid #ececec",
                          }}
                        >
                          <p style={{ fontWeight: "700", marginBottom: "6px" }}>
                            {idx + 1}. {pregunta.enunciado}
                          </p>
                          <div style={{ display: "grid", gap: "4px" }}>
                            {(pregunta.opciones || []).map((opcion) => (
                              <span key={opcion._id} style={{ fontSize: "0.92rem" }}>
                                - {opcion.texto}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Ranking en tiempo real con top 3 destacado */}
              {ranking.length > 0 && (
                <>
                  <p className="ranking-section-title">Ranking en vivo</p>
                  <div className="ranking-list">
                    {ranking.map((p, idx) => {
                      const isTop3 = idx < 3;
                      const isCurrent = p.nombre === nickname;
                      const medal = getMedal(idx);
                      return (
                        <div
                          key={p.participantId || idx}
                          className={[
                            "ranking-item",
                            isTop3 ? "top-three" : "",
                            isCurrent ? "current-player" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <span className="ranking-player-name">
                            {medal && <span className="ranking-medal">{medal}</span>}
                            #{idx + 1} {p.nombre}
                            {isCurrent && (
                              <span style={{ fontSize: "0.8rem", marginLeft: "6px", opacity: 0.7 }}>
                                (tú)
                              </span>
                            )}
                          </span>
                          <span className="ranking-player-score">{p.puntaje} pts</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "20px" }}>
                Esperando que el docente inicie el juego...
              </p>
              {ranking.length > 0 && (
                <>
                  <p style={{ fontWeight: "700", marginBottom: "10px", textAlign: "center" }}>
                    Participantes ({ranking.length}):
                  </p>
                  <div className="waiting-room-list">
                    {ranking.map((p, idx) => (
                      <div key={p.participantId || idx} className="waiting-room-item">
                        {p.nombre}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CustomCard>
    );
  }

  // Formulario de entrada
  return (
    <CustomCard variant="yellow" icon={<Hash size={24} />} title="Unirse a Partida">
      <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
        Ingresa el PIN y tu nickname para unirte al desafío.
      </p>
      <form onSubmit={handleUnirse} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="PIN de la partida (ej: 384920)"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            border: "2px solid #eee", fontSize: "1.1rem", fontWeight: "900",
            textAlign: "center", letterSpacing: "4px", outline: "none",
            boxSizing: "border-box"
          }}
        />
        <input
          type="text"
          placeholder="Tu nickname en el juego"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            border: "2px solid #eee", fontSize: "1rem", outline: "none",
            boxSizing: "border-box"
          }}
        />
        <MyButton
          type="submit"
          variant="primary"
          disabled={loading || !pin || !nickname}
          fullWidth
          style={{ padding: "16px" }}
        >
          {loading ? "CONECTANDO..." : "UNIRSE AL JUEGO"}
        </MyButton>
      </form>
      {error && (
        <div style={{
          marginTop: "16px", padding: "14px",
          backgroundColor: "var(--color-kahoot-red)", color: "#fff",
          borderRadius: "12px", fontWeight: "bold",
          display: "flex", alignItems: "center", gap: "10px"
        }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}
    </CustomCard>
  );
}


