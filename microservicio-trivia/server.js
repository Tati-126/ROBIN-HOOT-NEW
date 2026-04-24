import "dotenv/config";
import { PUERTO } from "./src/config/env.js";
import app from "./src/app.js";

app.listen(PUERTO, () => {
  console.log(`Microservicio Trivia corriendo en http://localhost:${PUERTO}`);
  console.log(`Endpoints disponibles:`);
  console.log(`  GET  http://localhost:${PUERTO}/trivia/estado`);
  console.log(`  GET  http://localhost:${PUERTO}/trivia/categorias`);
  console.log(`  GET  http://localhost:${PUERTO}/trivia/preguntas`);
  console.log(`  POST http://localhost:${PUERTO}/trivia/importar`);
});
