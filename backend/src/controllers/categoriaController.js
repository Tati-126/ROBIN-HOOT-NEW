import Categoria from "../models/Categoria.js";

export const crearCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    const saved = await categoria.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
