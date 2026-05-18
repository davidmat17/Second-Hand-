require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes subidas como archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Contenido estático turístico ──────────────────────────────
// Imágenes turísticas de Bucaramanga y área metropolitana
// Acceso: GET /turistico/bucaramanga/<nombre>.jpg
app.use("/turistico", express.static(path.join(__dirname, "public")));

// ── Rutas de la API ───────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/productos",  require("./routes/productos"));

// ── Ruta de salud ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── 404 catch-all ─────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// ── Arrancar servidor ─────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅  API Second Hand corriendo en http://localhost:${PORT}`);
});
