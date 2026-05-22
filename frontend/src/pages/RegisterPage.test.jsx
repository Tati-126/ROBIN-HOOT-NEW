/**
 * PRUEBAS DE INTEGRACIÓN: RegisterPage (Página de Registro)
 *
 * ¿QUÉ SE PRUEBA?
 * Probamos la integración del componente `RegisterPage` con la biblioteca `react-hook-form`,
 * el validador de esquemas `zod`, y el servicio de API `registrarUsuario`.
 * Específicamente validamos:
 *   1. El renderizado correcto de todos los elementos del formulario de registro.
 *   2. El flujo de validación fallido (campos vacíos) y la aparición de mensajes de error de Zod de forma asíncrona.
 *   3. La validación de coincidencia de contraseñas ("Las contraseñas no coinciden").
 *   4. El flujo de éxito: simular que el usuario llena correctamente los campos, se invoca
 *      la API con el payload esperado, se abre el modal de éxito, y al cerrarlo navega a `/login`.
 *
 * HERRAMIENTAS:
 * - vitest: framework de tests (describe, it, expect, vi, beforeEach)
 * - @testing-library/react: render, screen, waitFor
 * - @testing-library/user-event: simulación realista de eventos del usuario (teclado/click)
 * - react-router-dom: MemoryRouter para simular enrutamiento y mock de useNavigate.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "./RegisterPage";

// Mock de useNavigate conservando el resto de funcionalidades de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock del servicio de registro de usuario
vi.mock("../services/api", () => ({
  registrarUsuario: vi.fn(),
}));

import { registrarUsuario } from "../services/api";

describe("RegisterPage (Prueba de Integración)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el formulario con todos los campos y el botón de registro", () => {
    /**
     * ASERCIÓN:
     *   Verificar que la interfaz inicial muestra los campos correspondientes a:
     *   Nombre completo, Email, Contraseña, Confirmar contraseña, y el botón de Registrarse.
     */
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tu nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@uniputumayo.edu.co")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mínimo 6 caracteres")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repite tu contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
  });

  it("debe mostrar errores de validación de Zod si se envía el formulario vacío", async () => {
    /**
     * ACCIÓN:
     *   1. Inicializamos userEvent.setup().
     *   2. Renderizamos la página envuelta en MemoryRouter.
     *   3. Damos click directamente en el botón de registrarse sin llenar ningún campo.
     *
     * ASERCIÓN:
     *   - Aparecen en pantalla los mensajes de error correspondientes a Zod usando findBy.
     */
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /registrarse/i });
    await user.click(submitBtn);

    // Esperar y verificar que los mensajes de error asíncronos de Zod aparezcan
    expect(await screen.findByText("El nombre es requerido")).toBeInTheDocument();
    expect(await screen.findByText("El email es requerido")).toBeInTheDocument();
    expect(await screen.findByText("La contraseña es requerida")).toBeInTheDocument();
    expect(await screen.findByText("Confirma tu contraseña")).toBeInTheDocument();

    // Validar que la API no haya sido llamada
    expect(registrarUsuario).not.toHaveBeenCalled();
  });

  it("debe mostrar error de validación si las contraseñas no coinciden", async () => {
    /**
     * ACCIÓN:
     *   1. Inicializamos userEvent.setup().
     *   2. Llenamos campos válidos pero ponemos contraseñas diferentes en los dos campos.
     *   3. Damos click en Registrarse.
     *
     * ASERCIÓN:
     *   - Aparece el mensaje "Las contraseñas no coinciden" (definido en el refinement de Zod).
     *   - La API no es llamada.
     */
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Tu nombre"), "Farid Castellanos");
    await user.type(screen.getByPlaceholderText("tu@uniputumayo.edu.co"), "farid@uniputumayo.edu.co");
    await user.type(screen.getByPlaceholderText("Mínimo 6 caracteres"), "secreto123");
    await user.type(screen.getByPlaceholderText("Repite tu contraseña"), "secreto999"); // Diferente

    const submitBtn = screen.getByRole("button", { name: /registrarse/i });
    await user.click(submitBtn);

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();
    expect(registrarUsuario).not.toHaveBeenCalled();
  });

  it("debe enviar el formulario correctamente, invocar la API con el payload adecuado, mostrar el modal de éxito y navegar al cerrarse", async () => {
    /**
     * ACCIÓN:
     *   1. Inicializamos userEvent.setup().
     *   2. Configuramos la respuesta exitosa para la llamada `registrarUsuario`.
     *   3. Completamos el formulario con datos válidos.
     *   4. Hacemos click en el botón de registrarse.
     *
     * ASERCIÓN:
     *   - La API `registrarUsuario` se llama exactamente una vez con los argumentos correctos.
     *   - Se abre el Modal de éxito en pantalla.
     *   - Al dar click en el botón del modal "IR A INICIAR SESIÓN", se ejecuta la redirección a `/login`.
     */
    const user = userEvent.setup();
    registrarUsuario.mockResolvedValue({ success: true, message: "Usuario creado" });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Llenado de campos
    await user.type(screen.getByPlaceholderText("Tu nombre"), "Farid Castellanos");
    await user.type(screen.getByPlaceholderText("tu@uniputumayo.edu.co"), "farid@uniputumayo.edu.co");
    await user.type(screen.getByPlaceholderText("Mínimo 6 caracteres"), "123456");
    await user.type(screen.getByPlaceholderText("Repite tu contraseña"), "123456");

    const submitBtn = screen.getByRole("button", { name: /registrarse/i });
    await user.click(submitBtn);

    // Aserción de llamada a la API (nombre, email, password)
    await waitFor(() => {
      expect(registrarUsuario).toHaveBeenCalledTimes(1);
      expect(registrarUsuario).toHaveBeenCalledWith(
        "Farid Castellanos",
        "farid@uniputumayo.edu.co",
        "123456"
      );
    });

    // Verificación del modal de éxito
    expect(await screen.findByText("¡Registro Exitoso!")).toBeInTheDocument();
    expect(screen.getByText("Tu cuenta ha sido creada correctamente. ¡Bienvenido a la comunidad!")).toBeInTheDocument();

    // Cerrar el modal y verificar redirección
    const modalBtn = screen.getByRole("button", { name: /ir a iniciar sesión/i });
    await user.click(modalBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
