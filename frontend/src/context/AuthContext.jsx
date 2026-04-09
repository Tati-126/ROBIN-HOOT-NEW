import { createContext, useState, useEffect, useCallback } from "react";
import { loginUsuario, registrarUsuario, obtenerPerfil, logout as apiLogout } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Verificar si hay una sesión activa al cargar
  const verificarSesion = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const data = await obtenerPerfil();
      setUsuario(data.usuario || data); // Podría venir como { usuario: ... } o directo
    } catch (error) {
      console.error("[AuthContext] Error al verificar sesión:", error);
      apiLogout();
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  const login = async (email, password) => {
    try {
      const data = await loginUsuario(email, password);
      // El token ya se guarda en localStorage dentro de api.js, 
      // pero actualizamos el estado aquí
      setUsuario(data.usuario);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const registro = async (nombre, email, password) => {
    try {
      const data = await registrarUsuario(nombre, email, password);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const cerrarSesion = () => {
    apiLogout();
    setUsuario(null);
  };

  const value = {
    usuario,
    cargando,
    login,
    registro,
    cerrarSesion,
    actualizarUsuario: setUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
