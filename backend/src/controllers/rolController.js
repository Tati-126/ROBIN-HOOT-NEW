import Rol from "../models/Rol.js";

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener rol por ID
export const obtenerRolPorId = async (req, res) => {
  try {
    const rol = await Rol.findById(req.params.id);
    if (!rol) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Crear rol
export const crearRol = async (req, res) => {
  const { nombre } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({ mensaje: "El nombre es requerido" });
    }

    const rolExistente = await Rol.findOne({ nombre });
    if (rolExistente) {
      return res.status(400).json({ mensaje: "El rol ya existe" });
    }

    const nuevoRol = new Rol({ nombre });
    const rolGuardado = await nuevoRol.save();
    res.status(201).json(rolGuardado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar rol
export const actualizarRol = async (req, res) => {
  try {
    const rol = await Rol.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rol) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar rol
export const eliminarRol = async (req, res) => {
  try {
    const rol = await Rol.findByIdAndDelete(req.params.id);
    if (!rol) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json({ mensaje: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
