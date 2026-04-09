import express from "express";
import Participant from "../modules/sessions/participant.model.js";

const router = express.Router();

// Ranking global: suma de puntajes por usuario en todas las sesiones
router.get("/", async (req, res) => {
  try {
    const ranking = await Participant.aggregate([
      {
        $group: {
          _id: "$usuarioId",
          nombre: { $first: "$nombre" },
          puntaje: { $sum: "$puntaje" },
        },
      },
      { $sort: { puntaje: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          usuarioId: "$_id",
          nombre: 1,
          puntaje: 1,
        },
      },
    ]);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
