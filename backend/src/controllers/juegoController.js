import Juego from "../models/Juego.js";

export const crearJuego = async (req, res) => {
  try {
    const juego = new Juego(req.body);
    const saved = await juego.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerJuegos = async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerJuego = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) return res.status(404).json({ message: "Juego no encontrado" });
    res.json(juego);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarJuego = async (req, res) => {
  try {
    const juego = await Juego.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!juego) return res.status(404).json({ message: "Juego no encontrado" });
    res.json(juego);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarJuego = async (req, res) => {
  try {
    const juego = await Juego.findByIdAndDelete(req.params.id);
    if (!juego) return res.status(404).json({ message: "Juego no encontrado" });
    res.json({ message: "Juego eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
