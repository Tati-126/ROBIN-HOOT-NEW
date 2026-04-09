import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título del juego es requerido"],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    creadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El ID del creador es requerido"],
    },
    estado: {
      type: String,
      enum: ["BORRADOR", "PUBLICADO"],
      default: "BORRADOR",
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Juego = mongoose.model("Juego", juegoSchema);

export default Juego;
