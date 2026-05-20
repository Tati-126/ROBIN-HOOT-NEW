// Este archivo se ejecuta ANTES de cada suite de tests.
// Extiende los matchers de vitest con los de @testing-library/jest-dom,
// habilitando aserciones como: toBeInTheDocument(), toHaveValue(), etc.
import "@testing-library/jest-dom";
