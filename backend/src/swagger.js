import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Robin HOOT API",
      version: "1.0.0",
      description:
        "API REST para Robin HOOT — plataforma de quizzes interactivos en tiempo real. Autenticación con JWT via cookie HTTP-only.",
    },
    servers: [
      { url: "http://localhost:5000", description: "Servidor de desarrollo" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Token JWT almacenado en cookie HTTP-only. Se setea automáticamente al hacer login.",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d0e" },
            nombre: { type: "string", example: "Ana García" },
            email: { type: "string", format: "email", example: "ana@example.com" },
            rolId: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d0f" },
            fechaRegistro: { type: "string", format: "date-time" },
          },
        },
        Categoria: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d10" },
            nombre: { type: "string", example: "Ciencias" },
            descripcion: { type: "string", example: "Preguntas de ciencias naturales" },
            fechaCreacion: { type: "string", format: "date-time" },
          },
        },
        Producto: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d11" },
            nombre: { type: "string", example: "Curso de Álgebra" },
            descripcion: { type: "string", example: "Material educativo de álgebra básica" },
            precio: { type: "number", example: 29.99 },
            categoria: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d10" },
            fechaCreacion: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Mensaje de error" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
