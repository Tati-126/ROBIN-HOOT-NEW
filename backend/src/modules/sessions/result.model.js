import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: [true, "sessionId es requerido"],
        },
        usuarioId: {
            type: String,
            required: [true, "usuarioId es requerido"],
            trim: true,
        },
        totalPuntos: {
            type: Number,
            default: 0,
            min: 0,
        },
        posicion: {
            type: Number,
            required: true,
            min: 1,
        },
        resumen: [
            {
                preguntaId: String,
                opcionId: String,
                correcta: Boolean,
                tiempoRespuestaMs: Number,
                puntosGanados: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
