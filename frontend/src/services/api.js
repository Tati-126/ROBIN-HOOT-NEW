// ─── Configuración de API ───────────────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const buildApiUrl = (path) => `${BACKEND_URL}${path}`;

const fetchApi = (path, options = {}) => {
  return fetch(buildApiUrl(path), {
    credentials: "include",
    ...options,
  });
};

const parseErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data.message || data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

/**
 * PERSONA 1: Función para obtener el ranking del backend
 * TODO: Agregar manejo de errores y validación de datos
 */
export const getBackendData = async () => {
  console.log(`[API] Solicitando datos de: ${buildApiUrl("/api/ranking")}`);
  
  try {
    const response = await fetchApi("/api/ranking");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("[API] Error al obtener datos:", error);
    throw error;
  }
};

/**
 * Función para hacer POST al backend
 */
export const postToBackend = async (data) => {
  console.log(`[API] Enviando POST a: ${buildApiUrl("/api/game")}`, data);
  
  try {
    const response = await fetchApi("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("[API] Error en POST:", error);
    throw error;
  }
};

// ─── FUNCIONES DE AUTENTICACIÓN ─────────────────────────────────────────────────

/**
 * Registrar nuevo usuario
 */
export const registrarUsuario = async (nombre, email, password) => {
  console.log(`[API] Registrando usuario: ${email}`);
  
  try {
    const response = await fetchApi("/api/usuarios/auth/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    
    if (!response.ok) {
      const message = await parseErrorMessage(response, `Error al registrar (HTTP ${response.status})`);
      throw new Error(message);
    }
    
    return await response.json();
  } catch (error) {
    console.error("[API] Error en registro:", error);
    throw error;
  }
};

/**
 * Login de usuario
 */
export const loginUsuario = async (email, password) => {
  console.log(`[API] Login usuario: ${email}`);
  
  try {
    const response = await fetchApi("/api/usuarios/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const message = await parseErrorMessage(response, `Error de autenticación (HTTP ${response.status})`);
      throw new Error(message);
    }
    
    const data = await response.json();
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
    }
    
    return data;
  } catch (error) {
    console.error("[API] Error en login:", error);
    throw error;
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const obtenerPerfil = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }
  
  console.log(`[API] Obteniendo perfil del usuario`);
  
  try {
    const response = await fetchApi("/api/usuarios/perfil", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error("Error al obtener perfil");
    }
    
    return await response.json();
  } catch (error) {
    console.error("[API] Error obteniendo perfil:", error);
    throw error;
  }
};

/**
 * Logout: limpiar token y datos del usuario
 */
export const logout = () => {
  console.log(`[API] Logout`);
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

/**
 * Crear una sesion de juego (genera PIN)
 */
export const crearSesion = async (juegoId, creadorId) => {
  try {
    const response = await fetchApi("/api/sessions/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ juegoId, creadorId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear la sesion");
    }
    return await response.json();
  } catch (error) {
    console.error("[API] Error al crear sesion:", error);
    throw error;
  }
};

/**
 * Crear un juego en el backend principal (ADMIN o DOCENTE)
 */
export const crearJuego = async (titulo, creadorId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  try {
    const response = await fetchApi("/api/juegos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo,
        creadorId,
      }),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, `Error al crear juego (HTTP ${response.status})`);
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("[API] Error al crear juego:", error);
    throw error;
  }
};

/**
 * Unirse a una sesion existente por PIN
 */
export const unirseASesion = async (pin, nickname, usuarioId) => {
  try {
    const response = await fetchApi("/api/sessions/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, nickname, usuarioId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "PIN invalido o sesion no encontrada");
    }
    return await response.json();
  } catch (error) {
    console.error("[API] Error al unirse a sesion:", error);
    throw error;
  }
};

/**
 * Obtener preguntas de un juego
 */
export const obtenerPreguntasDelJuego = async (juegoId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  try {
    const response = await fetchApi(`/api/preguntas/juego/${juegoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, `Error al obtener preguntas (HTTP ${response.status})`);
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("[API] Error al obtener preguntas del juego:", error);
    throw error;
  }
};

/**
 * Obtener opciones de respuesta por pregunta
 */
export const obtenerOpcionesPorPregunta = async (preguntaId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  try {
    const response = await fetchApi(`/api/opciones/pregunta/${preguntaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, `Error al obtener opciones (HTTP ${response.status})`);
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("[API] Error al obtener opciones de la pregunta:", error);
    throw error;
  }
};
