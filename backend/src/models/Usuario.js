import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 6,
  },
  rolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rol",
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("Usuario", usuarioSchema);
