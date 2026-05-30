import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        // Proxy para evitar CORS en desarrollo local
        proxy: {
            "/api": {
                target: "http://localhost:5001",
                changeOrigin: true,
            },
            "/socket.io": {
                target: "http://localhost:5001",
                changeOrigin: true,
                ws: true,
            },
            "/trivia": {
                target: "http://localhost:5002",
                changeOrigin: true,
            },
        },
    },
    test: {
        // Simula el entorno del navegador (DOM) en Node.js
        environment: "jsdom",
        // Permite usar describe/it/expect sin importarlos en cada archivo
        globals: true,
        // Carga los matchers de jest-dom (toBeInTheDocument, etc.) antes de cada test
        setupFiles: "./src/test/setup.js",
    },
});