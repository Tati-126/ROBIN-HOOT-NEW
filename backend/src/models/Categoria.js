import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es requerido"],
      trim: true,
      unique: true,
    },
    descripcion: {
      type: String,
      trim: true,
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

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
