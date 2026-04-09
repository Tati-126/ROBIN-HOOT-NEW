import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria", // Relación con Categoria
      required: true,
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

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;