import { useState } from "react";
import { loginUsuario, registrarUsuario } from "../services/api.js";

/**
 * Componente Login
 * Permite que usuarios se registren o inicien sesión
 */
export default function Login({ onLoginSuccess }) {
  const [modo, setModo] = useState("login"); // "login" o "registrar"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!email || !password) {
        throw new Error("Email y contraseña requeridos");
      }
      
      const data = await loginUsuario(email, password);
      setSuccess("Login exitoso");
      
      // Llamar callback al padre
      if (onLoginSuccess) {
        onLoginSuccess(data.usuario);
      }
    } catch (err) {
      setError(err.message || "Error en login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!nombre || !email || !password) {
        throw new Error("Todos los campos son requeridos");
      }
      
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const data = await registrarUsuario(nombre, email, password);
      setSuccess("Usuario registrado. Ahora puedes iniciar sesión");
      
      // Limpiar formulario
      setNombre("");
      setEmail("");
      setPassword("");
      
      // Cambiar a modo login
      setTimeout(() => {
        setModo("login");
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.message || "Error en registro");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#282828",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      fontFamily: "Arial, sans-serif",
    },
    titulo: {
      textAlign: "center",
      color: "#f5c518",
      marginBottom: "30px",
      fontSize: "28px",
    },
    subtitulo: {
      textAlign: "center",
      color: "#aaa",
      marginBottom: "20px",
      fontSize: "14px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    campo: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    label: {
      color: "#fff",
      fontSize: "14px",
      fontWeight: "bold",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #444",
      backgroundColor: "#1e1e1e",
      color: "#fff",
      fontSize: "14px",
    },
    boton: {
      padding: "12px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#f5c518",
      color: "#000",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    botonSecundario: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #f5c518",
      backgroundColor: "transparent",
      color: "#f5c518",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "14px",
      transition: "all 0.3s",
    },
    error: {
      color: "#ff6b6b",
      backgroundColor: "#3d1a1a",
      padding: "10px",
      borderRadius: "5px",
      fontSize: "14px",
      textAlign: "center",
    },
    success: {
      color: "#00ff88",
      backgroundColor: "#1a3d2a",
      padding: "10px",
      borderRadius: "5px",
      fontSize: "14px",
      textAlign: "center",
    },
    toggle: {
      textAlign: "center",
      marginTop: "15px",
      color: "#aaa",
      fontSize: "14px",
    },
    toggleLink: {
      color: "#f5c518",
      cursor: "pointer",
      textDecoration: "underline",
      marginLeft: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>🎮 Robin Hoot</h1>
      <p style={styles.subtitulo}>
        {modo === "login" ? "Inicia sesión para jugar" : "Crea tu cuenta"}
      </p>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form style={styles.form} onSubmit={modo === "login" ? handleLogin : handleRegistro}>
        {modo === "registrar" && (
          <div style={styles.campo}>
            <label style={styles.label}>Nombre</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        )}

        <div style={styles.campo}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Contraseña</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          style={styles.boton}
          type="submit"
          disabled={loading}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#daa511")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f5c518")}
        >
          {loading ? "⏳ Procesando..." : modo === "login" ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      <div style={styles.toggle}>
        {modo === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <span
              style={styles.toggleLink}
              onClick={() => setModo("registrar")}
            >
              Regístrate aquí
            </span>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <span
              style={styles.toggleLink}
              onClick={() => setModo("login")}
            >
              Inicia sesión aquí
            </span>
          </>
        )}
      </div>
    </div>
  );
}
