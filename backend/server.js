import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/modules/sessions/session.socket.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// SERVIDOR HTTP + SOCKET
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Inicializar eventos de Socket.io
initSocket(io);

// CONEXIÓN A DB Y ARRANQUE
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Socket.io activo en ws://localhost:${PORT}`);
  });
});