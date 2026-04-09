import { useState, useEffect } from "react";
import { unirseASesion } from "../services/api.js";
import socket from "../socket.js";
import { useAuth } from "../hooks/useAuth.jsx";
import CustomCard from "./ui/CustomCard";
import MyButton from "./ui/MyButton";
import { Hash, AlertCircle, Users, Trophy } from "lucide-react";

/**
 * GameBoard - Unirse a una partida por PIN con sala de espera en tiempo real
 */
export default function GameBoard() {
  const { usuario } = useAuth();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sesion, setSesion] = useState(null); // { sessionId, participantId }
  const [ranking, setRanking] = useState([]);
  const [iniciada, setIniciada] = useState(false);

  useEffect(() => {
    if (!sesion) return;
    const onRankingUpdated = ({ ranking }) => setRanking(ranking);
    const onSessionStarted = () => setIniciada(true);
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
      const { sessionId, participantId } = result.data;
      setSesion({ sessionId, participantId });
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
          {!iniciada ? (
            <>
              <div style={{
                display: "inline-block", padding: "10px 28px",
                backgroundColor: "var(--color-kahoot-yellow)",
                borderRadius: "50px", fontWeight: "900", color: "#fff",
                marginBottom: "16px", fontSize: "1.1rem"
              }}>
                {nickname}
              </div>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "20px" }}>
                Esperando que el docente inicie el juego...
              </p>
              {ranking.length > 0 && (
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: "700", marginBottom: "10px", textAlign: "center" }}>
                    Participantes ({ranking.length}):
                  </p>
                  {ranking.map((p, idx) => (
                    <div key={p.participantId || idx} style={{
                      padding: "8px 14px", marginBottom: "6px",
                      backgroundColor: "#f5f5f5", borderRadius: "8px", fontWeight: "600"
                    }}>
                      {p.nombre}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--color-primary)", marginBottom: "20px" }}>
                ¡El juego ha comenzado!
              </p>
              {ranking.map((p, idx) => (
                <div key={p.participantId || idx} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 14px", marginBottom: "6px",
                  backgroundColor: p.nombre === nickname ? "rgba(27,94,32,0.12)" : "#f5f5f5",
                  borderRadius: "10px", fontWeight: "600",
                  border: p.nombre === nickname ? "2px solid var(--color-primary)" : "2px solid transparent"
                }}>
                  <span>#{idx + 1} {p.nombre}{p.nombre === nickname ? " (tú)" : ""}</span>
                  <span style={{ fontWeight: "900" }}>{p.puntaje} pts</span>
                </div>
              ))}
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


