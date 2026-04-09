import mongoose from "mongoose";

const rolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: ["ADMIN", "DOCENTE", "ESTUDIANTE"],
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model("Rol", rolSchema);
