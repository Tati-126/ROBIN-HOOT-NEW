import OpcionRespuesta from "../models/OpcionRespuesta.js";

// GET /api/opciones - Obtener todas las opciones
export const getOpciones = async (req, res) => {
    try {
        const opciones = await OpcionRespuesta.find().populate("preguntaId");
        res.json(opciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las opciones", error: error.message });
    }
};

// GET /api/opciones/:id - Obtener una opción por ID
export const getOpcionById = async (req, res) => {
    try {
        const opcion = await OpcionRespuesta.findById(req.params.id).populate("preguntaId");
        if (!opcion) {
            return res.status(404).json({ message: "Opción no encontrada" });
        }
        res.json(opcion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la opción", error: error.message });
    }
};

// GET /api/opciones/pregunta/:preguntaId - Obtener opciones por preguntaId
export const getOpcionesByPregunta = async (req, res) => {
    try {
        const opciones = await OpcionRespuesta.find({ preguntaId: req.params.preguntaId });
        res.json(opciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las opciones de la pregunta", error: error.message });
    }
};

// POST /api/opciones - Crear una nueva opción
export const createOpcion = async (req, res) => {
    try {
        const { texto, esCorrecta, preguntaId } = req.body;
        const nuevaOpcion = new OpcionRespuesta({ texto, esCorrecta, preguntaId });
        const opcionGuardada = await nuevaOpcion.save();
        res.status(201).json(opcionGuardada);
    } catch (error) {
        res.status(400).json({ message: "Error al crear la opción", error: error.message });
    }
};

// PUT /api/opciones/:id - Actualizar una opción
export const updateOpcion = async (req, res) => {
    try {
        const opcionActualizada = await OpcionRespuesta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!opcionActualizada) {
            return res.status(404).json({ message: "Opción no encontrada" });
        }
        res.json(opcionActualizada);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar la opción", error: error.message });
    }
};

// DELETE /api/opciones/:id - Eliminar una opción
export const deleteOpcion = async (req, res) => {
    try {
        const opcionEliminada = await OpcionRespuesta.findByIdAndDelete(req.params.id);
        if (!opcionEliminada) {
            return res.status(404).json({ message: "Opción no encontrada" });
        }
        res.json({ message: "Opción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la opción", error: error.message });
    }
};
