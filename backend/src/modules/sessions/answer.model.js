import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        participantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participant",
            required: [true, "participantId es requerido"],
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: [true, "sessionId es requerido"],
        },
        preguntaId: {
            type: String,
            required: [true, "preguntaId es requerido"],
            trim: true,
        },
        opcionId: {
            type: String,
            required: [true, "opcionId es requerido"],
            trim: true,
        },
        correcta: {
            type: Boolean,
            required: true,
        },
        tiempoRespuestaMs: {
            type: Number,
            required: true,
            min: 0,
        },
        puntosGanados: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
