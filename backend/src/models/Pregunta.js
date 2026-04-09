import mongoose from "mongoose";

const preguntaSchema = new mongoose.Schema(
    {
        enunciado: {
            type: String,
            required: [true, "El enunciado es obligatorio"],
            trim: true,
        },
        tipo: {
            type: String,
            enum: ["multiple", "verdadero/falso"],
            required: [true, "El tipo de pregunta es obligatorio"],
        },
        tiempoLimite: {
            type: Number,
            required: [true, "El tiempo límite es obligatorio"],
            min: [1, "El tiempo límite debe ser al menos 1 segundo"],
        },
        juegoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Juego",
            required: [true, "El ID del juego es obligatorio"],
        },
    },
    { timestamps: true }
);

const Pregunta = mongoose.model("Pregunta", preguntaSchema);

export default Pregunta;
