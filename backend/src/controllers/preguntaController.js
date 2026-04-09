import Pregunta from "../models/Pregunta.js";

// GET /api/preguntas - Obtener todas las preguntas
export const getPreguntas = async (req, res) => {
    try {
        const preguntas = await Pregunta.find().populate("juegoId");
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las preguntas", error: error.message });
    }
};

// GET /api/preguntas/:id - Obtener una pregunta por ID
export const getPreguntaById = async (req, res) => {
    try {
        const pregunta = await Pregunta.findById(req.params.id).populate("juegoId");
        if (!pregunta) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }
        res.json(pregunta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la pregunta", error: error.message });
    }
};

// GET /api/preguntas/juego/:juegoId - Obtener preguntas por juegoId
export const getPreguntasByJuego = async (req, res) => {
    try {
        const preguntas = await Pregunta.find({ juegoId: req.params.juegoId });
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las preguntas del juego", error: error.message });
    }
};

// POST /api/preguntas - Crear una nueva pregunta
export const createPregunta = async (req, res) => {
    try {
        const { enunciado, tipo, tiempoLimite, juegoId } = req.body;
        const nuevaPregunta = new Pregunta({ enunciado, tipo, tiempoLimite, juegoId });
        const preguntaGuardada = await nuevaPregunta.save();
        res.status(201).json(preguntaGuardada);
    } catch (error) {
        res.status(400).json({ message: "Error al crear la pregunta", error: error.message });
    }
};

// PUT /api/preguntas/:id - Actualizar una pregunta
export const updatePregunta = async (req, res) => {
    try {
        const preguntaActualizada = await Pregunta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!preguntaActualizada) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }
        res.json(preguntaActualizada);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar la pregunta", error: error.message });
    }
};

// DELETE /api/preguntas/:id - Eliminar una pregunta
export const deletePregunta = async (req, res) => {
    try {
        const preguntaEliminada = await Pregunta.findByIdAndDelete(req.params.id);
        if (!preguntaEliminada) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }
        res.json({ message: "Pregunta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la pregunta", error: error.message });
    }
};
