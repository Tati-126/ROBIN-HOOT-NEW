import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
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
        nombre: {
            type: String,
            required: [true, "nombre es requerido"],
            trim: true,
        },
        puntaje: {
            type: Number,
            default: 0,
            min: 0,
        },
        conectado: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Participant = mongoose.model("Participant", participantSchema);

export default Participant;
