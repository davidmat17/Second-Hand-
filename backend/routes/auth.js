const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const verificarToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const validarCorreo = require("../middleware/validarCorreo");

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/auth/registro
router.post("/registro", validarCorreo, async (req, res) => {
  const { nombre, apellido, correo, telefono, ciudad, password } = req.body;

  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({ error: "Campos obligatorios faltantes" });
  }

  try {
    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo]
    );
    if (existe.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, correo, telefono, ciudad, password_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, telefono || null, ciudad || null, hash]
    );

    const token = jwt.sign(
      { id: result.insertId, correo, nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: { id: result.insertId, nombre, apellido, correo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/auth/login
router.post("/login", validarCorreo, async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ? AND activo = 1",
      [correo]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const usuario = rows[0];
    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        ciudad: usuario.ciudad,
        foto_perfil: usuario.foto_perfil,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/auth/perfil   (requiere token)
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, apellido, correo, telefono, ciudad, foto_perfil, fecha_registro
       FROM usuarios WHERE id = ?`,
      [req.usuario.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/auth/perfil/foto  (requiere token)
router.post("/perfil/foto", verificarToken, upload.single("foto"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });
  const ruta = `/uploads/${req.file.filename}`;
  try {
    await pool.query("UPDATE usuarios SET foto_perfil = ? WHERE id = ?", [ruta, req.usuario.id]);
    res.json({ foto_perfil: ruta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/auth/perfil   (requiere token)
router.put("/perfil", verificarToken, async (req, res) => {
  const { nombre, apellido, telefono, ciudad } = req.body;

  try {
    await pool.query(
      `UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, ciudad = ?
       WHERE id = ?`,
      [nombre, apellido, telefono || null, ciudad || null, req.usuario.id]
    );
    res.json({ mensaje: "Perfil actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
