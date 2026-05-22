import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import FormInput from "./FormInput";

describe("FormInput - Componente UI aislado", () => {
  it("acepta texto en el input", async () => {
    // Propósito: verificar que el input recibe y muestra el texto ingresado.
    render(<FormInput label="Nombre" placeholder="Ingresa tu nombre" />);

    // Acción: escribir texto en el campo de entrada.
    const input = screen.getByPlaceholderText(/Ingresa tu nombre/i);
    await userEvent.type(input, "Tatiana");

    // Aserción: el input debe contener el valor escrito.
    expect(input).toHaveValue("Tatiana");
  });

  it("muestra el mensaje de error cuando se pasa la prop error", () => {
    // Propósito: confirmar que el componente renderiza un mensaje de error cuando se le proporciona la prop correspondiente.
    render(
      <FormInput
        label="Correo"
        placeholder="Ingresa tu correo"
        error="El correo es inválido"
      />
    );

    // Acción: buscar el mensaje de error en el DOM.
    const errorMessage = screen.getByText(/El correo es inválido/i);

    // Aserción: el mensaje de error debe estar presente en el DOM.
    expect(errorMessage).toBeInTheDocument();
  });
});
