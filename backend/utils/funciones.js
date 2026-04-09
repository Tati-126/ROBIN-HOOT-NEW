import bcrypt from "bcryptjs";

// Encriptar contraseña
export const encriptarContraseña = async (contraseña) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(contraseña, salt);
};

// Comparar contraseña
export const compararContraseña = async (contraseña, contraseñaEncriptada) => {
  return await bcrypt.compare(contraseña, contraseñaEncriptada);
};

// Validar email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Respuesta estándar de éxito
export const respuestaExito = (datos, mensaje = "Operación exitosa") => {
  return { exito: true, mensaje, datos };
};

// Respuesta estándar de error
export const respuestaError = (mensaje, codigo = 500) => {
  return { exito: false, mensaje, codigo };
};
