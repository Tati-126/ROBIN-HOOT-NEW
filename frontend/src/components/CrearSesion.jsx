import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { crearSesion } from "../services/api.js";
import socket from "../socket.js";
import CustomCard from "./ui/CustomCard";
import MyButton from "./ui/MyButton";
import { Rocket, Users, Copy, CheckCircle } from "lucide-react";

/**
 * CrearSesion - Panel para que el docente cree una sala y comparta el PIN
 * Muestra participantes uniéndose en tiempo real y botón para iniciar el juego
 */
export default function CrearSesion() {
  const { usuario } = useAuth();
  const [juegoNombre, setJuegoNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [sesion, setSesion] = useState(null); // { sessionId, pin }
  const [participantes, setParticipantes] = useState([]);
  const [iniciada, setIniciada] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sesion) return;
    const onRankingUpdated = ({ ranking }) => setParticipantes(ranking);
    const onSessionStarted = () => setIniciada(true);
    socket.on("ranking_updated", onRankingUpdated);
    socket.on("session_started", onSessionStarted);
    return () => {
      socket.off("ranking_updated", onRankingUpdated);
      socket.off("session_started", onSessionStarted);
    };
  }, [sesion]);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!juegoNombre.trim()) return setError("Ingresa un nombre para la partida");
    setLoading(true);
    setError(null);
    try {
      const result = await crearSesion(
        juegoNombre.trim(),
        usuario?._id || usuario?.id || "host"
      );
      const { sessionId, pin } = result.data;
      setSesion({ sessionId, pin });
      // El host se une al socket room para recibir eventos de la sala
      socket.emit("join_session", {
        pin,
        usuarioId: usuario?._id || usuario?.id || "host",
        nombre: `${usuario?.nombre || "Docente"} (host)`,
      });
    } catch (err) {
      setError(err.message || "Error al crear la partida");
    } finally {
      setLoading(false);
    }
  };

  const handleIniciar = () => {
    if (!sesion) return;
    socket.emit("start_session", { sessionId: sesion.sessionId });
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(sesion.pin);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Filtramos el host de la lista de participantes visibles
  const jugadores = participantes.filter((p) => !p.nombre.includes("(host)"));

  // Formulario inicial
  if (!sesion) {
    return (
      <CustomCard variant="purple" icon={<Rocket size={32} />} title="Crear Partida">
        <p style={{ marginBottom: "20px" }}>
          Crea una sala y comparte el PIN con tus estudiantes.
        </p>
        <form onSubmit={handleCrear} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Nombre del juego (ej: Parcial Biología)"
            value={juegoNombre}
            onChange={(e) => setJuegoNombre(e.target.value)}
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              border: "2px solid #eee", fontSize: "1rem", outline: "none",
              boxSizing: "border-box"
            }}
          />
          <MyButton
            type="submit"
            variant="purple"
            disabled={loading || !juegoNombre}
            fullWidth
            style={{ padding: "16px" }}
          >
            {loading ? "CREANDO..." : "CREAR PARTIDA"}
          </MyButton>
        </form>
        {error && (
          <div style={{
            marginTop: "16px", padding: "14px",
            backgroundColor: "var(--color-kahoot-red)", color: "#fff",
            borderRadius: "12px", fontWeight: "bold"
          }}>
            {error}
          </div>
        )}
      </CustomCard>
    );
  }

  // Sala activa: PIN visible + lista de participantes + botón iniciar
  return (
    <CustomCard
      variant="purple"
      icon={<Users size={32} />}
      title={iniciada ? "¡Partida en Curso!" : "Sala Activa"}
    >
      <div style={{ textAlign: "center" }}>
        {!iniciada ? (
          <>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "12px" }}>
              Comparte este PIN con tus estudiantes:
            </p>
            <div style={{
              fontSize: "3.5rem", fontWeight: "900", letterSpacing: "12px",
              color: "var(--color-kahoot-purple)",
              backgroundColor: "rgba(100,16,200,0.07)",
              borderRadius: "16px", padding: "20px", marginBottom: "12px"
            }}>
              {sesion.pin}
            </div>
            <MyButton
              variant="secondary"
              onClick={handleCopiar}
              style={{ marginBottom: "24px", padding: "10px 24px" }}
            >
              {copiado
                ? <><CheckCircle size={18} /> ¡Copiado!</>
                : <><Copy size={18} /> Copiar PIN</>}
            </MyButton>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <p style={{ fontWeight: "700", marginBottom: "10px", textAlign: "center" }}>
                Participantes ({jugadores.length}):
              </p>
              {jugadores.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textAlign: "center" }}>
                  Esperando participantes...
                </p>
              ) : (
                jugadores.map((p, idx) => (
                  <div key={p.participantId || idx} style={{
                    padding: "10px 14px", marginBottom: "6px",
                    backgroundColor: "#f5f5f5", borderRadius: "10px", fontWeight: "600"
                  }}>
                    {p.nombre}
                  </div>
                ))
              )}
            </div>

            <MyButton
              variant="primary"
              onClick={handleIniciar}
              disabled={jugadores.length === 0}
              fullWidth
              style={{ padding: "16px" }}
            >
              INICIAR JUEGO
            </MyButton>
          </>
        ) : (
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--color-primary)", marginBottom: "16px" }}>
              ✅ ¡Partida iniciada!
            </p>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "20px" }}>
              PIN activo: <strong style={{ color: "var(--color-kahoot-purple)", fontSize: "1.2rem" }}>{sesion.pin}</strong>
            </p>
            {jugadores.map((p, idx) => (
              <div key={p.participantId || idx} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 14px", marginBottom: "6px",
                backgroundColor: "#f5f5f5", borderRadius: "10px", fontWeight: "600"
              }}>
                <span>#{idx + 1} {p.nombre}</span>
                <span style={{ fontWeight: "900" }}>{p.puntaje} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomCard>
  );
}
