import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

// ── Rutas MVC (src/routes) ────────────────────────────────────────────────────
import usuarioRoutes from "./routes/usuarioRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";

// ── Rutas heredadas ───────────────────────────────────────────────────────────
import sessionRoutes from "./modules/sessions/session.routes.js";
import preguntaRoutes from "./routes/preguntaRoutes.js";
import opcionRespuestaRoutes from "./routes/opcionRespuestaRoutes.js";
import juegoRoutes from "./routes/juegoRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ── CORS: habilita peticiones desde el frontend local ─────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite llamadas sin origin (Postman, curl) y orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origen no permitido – ${origin}`));
      }
    },
    credentials: true, // Necesario para enviar/recibir cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Parseo de JSON y cookies ──────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Swagger UI ───────────────────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "RobinHoot API funcionando", version: "1.0.0", docs: "/api-docs" });
});

// ── Rutas MVC principales ─────────────────────────────────────────────────────
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);

// ── Rutas adicionales ─────────────────────────────────────────────────────────
app.use("/api/sessions", sessionRoutes);
app.use("/api/preguntas", preguntaRoutes);
app.use("/api/opciones", opcionRespuestaRoutes);
app.use("/api/juegos", juegoRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/roles", rolRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

// ── Error handler (debe ir al final) ─────────────────────────────────────────
app.use(errorHandler);

export default app;
