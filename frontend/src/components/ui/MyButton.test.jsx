import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import MyButton from "./MyButton";

describe("MyButton - Componente UI aislado", () => {
  it("renderiza el texto recibido por props", () => {
    // Propósito: validar que el componente muestra correctamente el texto pasado como children.
    render(<MyButton>Enviar</MyButton>);

    // Acción: buscar el botón por su texto visible.
    const button = screen.getByRole("button", { name: /Enviar/i });

    // Aserción: el botón debe estar presente en el DOM.
    expect(button).toBeInTheDocument();
  });

  it("llama a onClick al hacer clic", async () => {
    // Propósito: asegurar que el evento de clic se propaga correctamente al callback onClick.
    const handleClick = vi.fn();
    render(<MyButton onClick={handleClick}>Clic aquí</MyButton>);

    // Acción: simular un clic sobre el botón.
    await userEvent.click(screen.getByRole("button", { name: /Clic aquí/i }));

    // Aserción: la función de clic debe haberse llamado exactamente una vez.
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
