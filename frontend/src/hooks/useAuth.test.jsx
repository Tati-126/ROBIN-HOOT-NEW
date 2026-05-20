/**
 * PRUEBAS UNITARIAS: useAuth (Custom Hook)
 *
 * ¿QUÉ SE PRUEBA?
 * El hook `useAuth` expone el estado de autenticación (usuario, cargando) y
 * las acciones (login, cerrarSesion, registro) que viven en `AuthContext`.
 * Probamos que:
 *   1. El hook lanza un error si se usa fuera de un AuthProvider.
 *   2. El estado inicial es correcto (usuario null, cargando true->false).
 *   3. La función `login` actualiza el estado del usuario en caso exitoso.
 *   4. La función `login` propaga el error si la API falla.
 *   5. La función `cerrarSesion` limpia el usuario del estado.
 *
 * HERRAMIENTAS:
 * - vitest: framework de tests (describe, it, expect, vi)
 * - @testing-library/react: renderHook + act para hooks de React
 *
 * ESTRATEGIA DE MOCK:
 * Las llamadas reales a la API (fetch al backend) se reemplazan con funciones
 * simuladas (vi.mock). Esto aísla la prueba: si el test falla, es por la
 * lógica del hook/contexto, NO por el backend.
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "./useAuth";

// ─── MOCK DE LA CAPA DE API ────────────────────────────────────────────────
// Reemplazamos TODAS las funciones del módulo api.js con espías vacíos.
// Cada test individual configura lo que debe devolver cada función.
vi.mock("../services/api", () => ({
    loginUsuario: vi.fn(),
    registrarUsuario: vi.fn(),
    obtenerPerfil: vi.fn(),
    logout: vi.fn(),
}));

// Importamos los mocks DESPUÉS de vi.mock para poder configurarlos en cada test
import {
    loginUsuario,
    obtenerPerfil,
    logout as apiLogout,
    registrarUsuario,
} from "../services/api";

// ─── WRAPPER ───────────────────────────────────────────────────────────────
// renderHook necesita que el hook esté dentro de su Provider.
// Este wrapper lo envuelve automáticamente en cada test.
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

// ─── SUITE PRINCIPAL ───────────────────────────────────────────────────────
describe("useAuth (Custom Hook)", () => {
    // Limpia el estado de localStorage y los mocks antes de cada test
    // para que los tests sean independientes entre sí.
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    // ── TEST 1 ─────────────────────────────────────────────────────────────
    it("debe lanzar un error si se usa fuera de AuthProvider", () => {
        /**
         * PROPÓSITO:
         *   Garantizar que el hook falla de forma clara y explicativa si alguien
         *   lo usa en un componente que no está dentro de <AuthProvider>.
         *
         * ACCIÓN:
         *   Renderizamos useAuth SIN el wrapper (sin Provider).
         *
         * ASERCIÓN:
         *   Esperamos que se lance un Error con el mensaje específico del hook.
         */

        // Silenciamos el error de React en consola para este test (es esperado)
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => renderHook(() => useAuth())).toThrow(
            "useAuth debe usarse dentro de un AuthProvider"
        );

        consoleError.mockRestore();
    });

    // ── TEST 2 ─────────────────────────────────────────────────────────────
    it("debe tener usuario null y cargando false cuando no hay token", async () => {
        /**
         * PROPÓSITO:
         *   Verificar el estado inicial del contexto cuando el usuario NO ha
         *   iniciado sesión (no hay token en localStorage).
         *
         * ACCIÓN:
         *   - localStorage está vacío (sin token).
         *   - obtenerPerfil NO debe llamarse.
         *   - Renderizamos el hook y esperamos a que `cargando` sea false.
         *
         * ASERCIÓN:
         *   - usuario debe ser null.
         *   - cargando debe ser false (terminó de verificar que no hay sesión).
         *   - obtenerPerfil no debe haberse invocado.
         */
        obtenerPerfil.mockResolvedValue({}); // por si acaso, no debería llamarse

        const { result } = renderHook(() => useAuth(), { wrapper });

        // Esperamos a que el efecto inicial de verificación termine
        await waitFor(() => {
            expect(result.current.cargando).toBe(false);
        });

        expect(result.current.usuario).toBeNull();
        expect(obtenerPerfil).not.toHaveBeenCalled();
    });

    // ── TEST 3 ─────────────────────────────────────────────────────────────
    it("debe actualizar el usuario en el estado al hacer login exitoso", async () => {
        /**
         * PROPÓSITO:
         *   Probar el "camino feliz" del login: que al llamar a login(),
         *   el estado del contexto se actualice con los datos del usuario.
         *
         * ACCIÓN:
         *   1. Configuramos loginUsuario para que devuelva un usuario simulado.
         *   2. Renderizamos el hook.
         *   3. Llamamos a login() envuelto en `act` (modifica estado de React).
         *
         * ASERCIÓN:
         *   - result.current.usuario debe contener los datos del usuario simulado.
         */
        const usuarioSimulado = {
            _id: "abc123",
            nombre: "Robin Hoot",
            email: "robin@hoot.com",
        };

        loginUsuario.mockResolvedValue({ usuario: usuarioSimulado });
        obtenerPerfil.mockResolvedValue({});

        const { result } = renderHook(() => useAuth(), { wrapper });

        // Esperamos que termine la verificación inicial de sesión
        await waitFor(() => expect(result.current.cargando).toBe(false));

        // Ejecutamos el login dentro de act porque modifica el estado de React
        await act(async () => {
            await result.current.login("robin@hoot.com", "password123");
        });

        expect(result.current.usuario).toEqual(usuarioSimulado);
        expect(loginUsuario).toHaveBeenCalledWith(
            "robin@hoot.com",
            "password123"
        );
    });

    // ── TEST 4 ─────────────────────────────────────────────────────────────
    it("debe propagar el error si el login falla", async () => {
        /**
         * PROPÓSITO:
         *   Probar que cuando la API rechaza el login (credenciales incorrectas,
         *   servidor caído, etc.), el hook propaga el error correctamente para
         *   que el componente lo pueda capturar y mostrar al usuario.
         *
         * ACCIÓN:
         *   1. Configuramos loginUsuario para que rechace la promesa (error 401).
         *   2. Llamamos a login() y esperamos que lance una excepción.
         *
         * ASERCIÓN:
         *   - La promesa de login() debe rechazarse.
         *   - El usuario debe seguir siendo null (no se guarda estado con error).
         */
        const errorCredenciales = new Error("Credenciales inválidas");
        loginUsuario.mockRejectedValue(errorCredenciales);
        obtenerPerfil.mockResolvedValue({});

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.cargando).toBe(false));

        await expect(
            act(async () => {
                await result.current.login("malo@hoot.com", "wrongpass");
            })
        ).rejects.toThrow("Credenciales inválidas");

        // El usuario NO debe haberse actualizado tras un error
        expect(result.current.usuario).toBeNull();
    });

    // ── TEST 5 ─────────────────────────────────────────────────────────────
    it("debe limpiar el usuario al cerrar sesión", async () => {
        /**
         * PROPÓSITO:
         *   Verificar que cerrarSesion() limpia el estado del usuario en el
         *   contexto Y llama a la función de logout de la API (para limpiar el
         *   token del localStorage).
         *
         * ACCIÓN:
         *   1. Hacemos login primero para que haya un usuario en el estado.
         *   2. Llamamos a cerrarSesion().
         *
         * ASERCIÓN:
         *   - resultado.current.usuario debe volver a ser null.
         *   - apiLogout debe haber sido llamado exactamente una vez.
         */
        const usuarioSimulado = {
            _id: "abc123",
            nombre: "Robin Hoot",
            email: "robin@hoot.com",
        };

        loginUsuario.mockResolvedValue({ usuario: usuarioSimulado });
        obtenerPerfil.mockResolvedValue({});

        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.cargando).toBe(false));

        // Primero hacemos login
        await act(async () => {
            await result.current.login("robin@hoot.com", "password123");
        });
        expect(result.current.usuario).toEqual(usuarioSimulado);

        // Ahora cerramos sesión
        act(() => {
            result.current.cerrarSesion();
        });

        expect(result.current.usuario).toBeNull();
        expect(apiLogout).toHaveBeenCalledTimes(1);
    });
});
