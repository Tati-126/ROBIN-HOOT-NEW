import mongoose from "mongoose";

const opcionRespuestaSchema = new mongoose.Schema(
    {
        texto: {
            type: String,
            required: [true, "El texto de la opción es obligatorio"],
            trim: true,
        },
        esCorrecta: {
            type: Boolean,
            required: [true, "Debes indicar si la opción es correcta"],
            default: false,
        },
        preguntaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pregunta",
            required: [true, "El ID de la pregunta es obligatorio"],
        },
    },
    { timestamps: true }
);

const OpcionRespuesta = mongoose.model("OpcionRespuesta", opcionRespuestaSchema);

export default OpcionRespuesta;
