import Usuario from "../models/Usuario.js";
import Rol from "../models/Rol.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registrar usuario (para registro público)
export const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    // Hash de contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Obtener rol por defecto (ESTUDIANTE)
    let rolPorDefecto = await Rol.findOne({ nombre: "ESTUDIANTE" });
    if (!rolPorDefecto) {
      // Si no existe, crear el rol por defecto
      rolPorDefecto = await Rol.create({ nombre: "ESTUDIANTE" });
    }

    const usuario = new Usuario({
      nombre,
      email,
      contraseña: hashed,
      rolId: rolPorDefecto._id,
    });

    await usuario.save();

    res.status(201).json({ 
      message: "Usuario registrado exitosamente",
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, usuario.contraseña);
    if (!match) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Enviar token en cookie HTTP-only (mitiga ataques XSS)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.json({ 
      message: "Login exitoso",
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Perfil
export const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.userId).select("-contraseña");
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate("rolId", "nombre");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate("rolId", "nombre");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Crear usuario (para admin)
export const crearUsuario = async (req, res) => {
  const { nombre, email, contraseña, rolId } = req.body;

  try {
    // Validaciones
    if (!nombre || !email || !contraseña || !rolId) {
      return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    // Verificar si el rol existe
    const rol = await Rol.findById(rolId);
    if (!rol) {
      return res.status(404).json({ mensaje: "El rol no existe" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contraseña: contraseñaEncriptada,
      rolId,
    });

    const usuarioGuardado = await nuevoUsuario.save();
    const usuarioPopulado = await usuarioGuardado.populate("rolId", "nombre");

    res.status(201).json(usuarioPopulado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, rolId } = req.body;

    // Si se actualiza email, verificar que no exista
    if (email) {
      const usuarioExistente = await Usuario.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: "El email ya está registrado" });
      }
    }

    // Si se actualiza rol, verificar que exista
    if (rolId) {
      const rol = await Rol.findById(rolId);
      if (!rol) {
        return res.status(404).json({ mensaje: "El rol no existe" });
      }
    }

    const datosActualizar = { nombre, email, rolId };
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true, runValidators: true }
    ).populate("rolId", "nombre");

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Cambiar contraseña
export const cambiarContraseña = async (req, res) => {
  try {
    const { contraseñaActual, contraseñaNueva } = req.body;

    if (!contraseñaActual || !contraseñaNueva) {
      return res.status(400).json({ mensaje: "Las contraseñas son requeridas" });
    }

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar contraseña actual
    const contraseñaValida = await bcrypt.compare(
      contraseñaActual,
      usuario.contraseña
    );
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: "Contraseña actual incorrecta" });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const nuevaContraseña = await bcrypt.hash(contraseñaNueva, salt);

    usuario.contraseña = nuevaContraseña;
    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};