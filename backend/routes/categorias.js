const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/categorias
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categorias ORDER BY nombre");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
