import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getBackendData } from "../services/api";
import CustomCard from "../components/ui/CustomCard";
import MyButton from "../components/ui/MyButton";
import RankingTable from "../components/RankingTable";
import GameBoard from "../components/GameBoard";
import CrearSesion from "../components/CrearSesion.jsx";
import { useNavigate } from "react-router-dom";
import { User, Trophy, Star, Activity, LogOut, Settings, Gamepad2, Rocket } from "lucide-react";

/**
 * Dashboard - Página protegida del usuario autenticado
 */
export default function Dashboard() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getBackendData();
        setRanking(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <div className="dashboard" style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="dashboard-header" style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>
          Hola, {usuario?.nombre || "Usuario"}! <Gamepad2 size={48} style={{ verticalAlign: "middle", marginLeft: "12px", color: "var(--color-primary-glow)" }} />
        </h1>
        <p style={{ fontSize: "1.25rem", fontWeight: "500", color: "var(--color-text-muted)" }}>Bienvenido a tu panel de Robin HOOT</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: "60px", gap: "30px" }}>
        <CustomCard variant="blue" title="Puntuacion" icon={<Star size={32} />}>
          <div style={{ fontSize: "3rem", fontWeight: "900", textAlign: "center", margin: "10px 0" }}>{(ranking?.length || 0) * 10}</div>
          <p style={{ textAlign: "center", fontWeight: "600" }}>Puntos acumulados</p>
        </CustomCard>
        <CustomCard variant="purple" title="Partidas" icon={<Activity size={32} />}>
          <div style={{ fontSize: "3rem", fontWeight: "900", textAlign: "center", margin: "10px 0" }}>5</div>
          <p style={{ textAlign: "center", fontWeight: "600" }}>Completadas hoy</p>
        </CustomCard>
        <CustomCard variant="yellow" title="Ranking UP" icon={<Trophy size={32} />}>
          <div style={{ fontSize: "3rem", fontWeight: "900", textAlign: "center", margin: "10px 0" }}>#3</div>
          <p style={{ textAlign: "center", fontWeight: "600" }}>Posicion global</p>
        </CustomCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px", marginBottom: "60px" }}>
        {/* Info del usuario */}
        <CustomCard icon={<User size={32} />} title="Perfil Academico" variant="primary">
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
            <p style={{ fontSize: "1.1rem" }}><strong>Nombre:</strong> {usuario?.nombre}</p>
            <p style={{ fontSize: "1.1rem" }}><strong>Email:</strong> {usuario?.email}</p>
            <p><small style={{ opacity: 0.6, fontSize: "0.9rem" }}>ID: {usuario?._id || "UP-USER"}</small></p>
            <MyButton variant="secondary" style={{ marginTop: "15px", padding: "12px" }}>
              <Settings size={20} style={{ marginRight: "10px" }} /> Editar Perfil
            </MyButton>
          </div>
        </CustomCard>

        {/* Join Game */}
        <GameBoard />
        {/* Crear Partida (docente) */}
        <CrearSesion />
      </div>

      <h2 style={{ fontSize: "2.2rem", fontWeight: "900", color: "var(--color-primary)", marginBottom: "32px", display: "flex", alignItems: "center" }}>
        <Rocket size={40} style={{ marginRight: "15px", color: "var(--color-kahoot-red)" }} /> Panel de Desafios
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "60px" }}>
        <CustomCard variant="red" icon={<Gamepad2 size={32} />} title="Desafio Clasico">
          <p style={{ marginBottom: "20px", fontSize: "1rem" }}>El quiz de toda la vida. Responde rapido y gana puntos para tu racha.</p>
          <MyButton variant="red" fullWidth style={{ padding: "16px" }}>¡JUGAR YA!</MyButton>
        </CustomCard>
        <CustomCard variant="blue" icon={<Trophy size={32} />} title="Duelo de Sabios">
          <p style={{ marginBottom: "20px", fontSize: "1rem" }}>Compite 1 vs 1 contra un compañero de tu misma facultad en tiempo real.</p>
          <MyButton variant="blue" fullWidth style={{ padding: "16px" }}>BUSCAR RIVAL</MyButton>
        </CustomCard>
        <CustomCard variant="yellow" icon={<Star size={32} />} title="Maraton UP">
          <p style={{ marginBottom: "20px", fontSize: "1rem" }}>Demuestra tu resistencia con 50 preguntas seguidas de cultura institucional.</p>
          <MyButton variant="yellow" fullWidth style={{ padding: "16px" }}>EMPEZAR</MyButton>
        </CustomCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
        {/* Ranking */}
        <CustomCard icon={<Trophy size={32} />} title="Lideres de la Semana" variant="yellow">
          <div style={{ marginTop: "20px" }}>
            {loading && <p style={{ textAlign: "center", padding: "40px" }}>Buscando jugadores estrella...</p>}
            {error && <p style={{ color: "var(--color-error)", textAlign: "center", padding: "20px" }}>Error: {error}</p>}
            {!loading && !error && <RankingTable ranking={ranking} />}
          </div>
        </CustomCard>
      </div>

      {/* Logout */}
      <div style={{ textAlign: "center", marginTop: "80px", marginBottom: "40px" }}>
        <MyButton variant="danger" onClick={handleLogout} style={{ padding: "16px 50px", fontSize: "1.1rem" }}>
          <LogOut size={22} style={{ marginRight: "10px" }} /> CERRAR SESION
        </MyButton>
      </div>
    </div>
  );
}




