/**
 * PRUEBAS DE INTEGRACIÓN: RankingTable (Lista de líderes)
 *
 * ¿QUÉ SE PRUEBA?
 * Probamos la integración entre el componente `RankingTable` y la capa de servicios `api.js`.
 * Específicamente que:
 *   1. Al renderizar un componente contenedor que obtiene los datos de la API, se realiza la llamada al backend simulado.
 *   2. El componente pinta exactamente la cantidad de filas devueltas por el mock de la API (3 jugadores).
 *   3. Se muestran correctamente los nombres y los puntajes de los jugadores en la interfaz.
 *
 * HERRAMIENTAS:
 * - vitest: framework de tests (describe, it, expect, vi)
 * - @testing-library/react: render, screen, waitFor
 *
 * ESTRATEGIA DE MOCK:
 * Mockeamos la función `getBackendData` de `../services/api` para devolver una lista estática de 3 jugadores.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect, useState } from "react";
import RankingTable from "./RankingTable";

// Mock del servicio API
vi.mock("../services/api", () => ({
    getBackendData: vi.fn(),
}));

import { getBackendData } from "../services/api";

// Componente contenedor de integración para simular la obtención de datos y su renderizado
function RankingIntegrationWrapper() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await getBackendData();
                setRanking(data || []);
            } catch (err) {
                setError("Error al cargar");
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, []);

    if (loading) return <div>Cargando ranking...</div>;
    if (error) return <div>{error}</div>;
    return <RankingTable ranking={ranking} />;
}

describe("RankingTable (Prueba de Integración)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("debe cargar los datos desde la API y renderizar exactamente 3 filas con los nombres de los jugadores", async () => {
        /**
         * PROPÓSITO:
         *   Verificar que los datos devueltos por el backend mockeado se cargan
         *   y se pintan de manera exacta en la tabla de posiciones.
         *
         * ACCIÓN:
         *   1. Definimos un array estático con 3 jugadores de prueba.
         *   2. Configuramos `getBackendData` para resolver la promesa con estos datos.
         *   3. Renderizamos el componente contenedor `RankingIntegrationWrapper`.
         *   4. Esperamos a que el texto "Cargando ranking..." desaparezca.
         *
         * ASERCIÓN:
         *   - Los nombres de los tres jugadores mockeados aparecen en el documento.
         *   - Sus respectivos puntajes aparecen correctamente en el documento.
         *   - Se renderizan exactamente 3 filas de datos en el cuerpo de la tabla.
         */
        const mockRanking = [
            { usuarioId: "u1", nombre: "Carlos Alcaraz", puntaje: 950 },
            { usuarioId: "u2", nombre: "Iga Swiatek", puntaje: 880 },
            { usuarioId: "u3", nombre: "Jannik Sinner", puntaje: 820 },
        ];

        getBackendData.mockResolvedValue(mockRanking);

        render(<RankingIntegrationWrapper />);

        // Esperamos a que la carga termine y aparezca la tabla
        await waitFor(() => {
            expect(screen.queryByText("Cargando ranking...")).not.toBeInTheDocument();
        });

        // Verificamos que los nombres de los usuarios mockeados estén en el DOM
        expect(screen.getByText("Carlos Alcaraz")).toBeInTheDocument();
        expect(screen.getByText("Iga Swiatek")).toBeInTheDocument();
        expect(screen.getByText("Jannik Sinner")).toBeInTheDocument();

        // Verificamos que los puntajes también aparezcan
        expect(screen.getByText("950")).toBeInTheDocument();
        expect(screen.getByText("880")).toBeInTheDocument();
        expect(screen.getByText("820")).toBeInTheDocument();

        // Verificamos que haya exactamente 3 filas en la tabla (excluyendo la del encabezado)
        // En HTML de la tabla, las filas del body tienen la etiqueta 'tr' dentro de 'tbody'
        const tableRows = screen.getAllByRole("row");
        // Nota: 1 fila de cabecera (thead tr) + 3 filas de datos (tbody tr) = 4 filas en total
        expect(tableRows.length).toBe(4);
    });
});
