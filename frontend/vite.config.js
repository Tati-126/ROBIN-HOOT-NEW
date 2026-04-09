import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        // Proxy para evitar CORS en desarrollo local
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },
});
