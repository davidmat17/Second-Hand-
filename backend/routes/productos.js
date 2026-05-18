const express = require("express");
const pool = require("../db");
const verificarToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// GET /api/productos  — catálogo con filtros opcionales
// Query params: busqueda, categoria_id, estado, precio_min, precio_max, ciudad, page, limit
router.get("/", async (req, res) => {
  const {
    busqueda = "",
    categoria_id,
    estado,
    precio_min,
    precio_max,
    ciudad,
    page = 1,
    limit = 12,
  } = req.query;

  const condiciones = ["p.activo = 1"];
  const valores = [];

  if (busqueda) {
    condiciones.push("(p.titulo LIKE ? OR p.descripcion LIKE ?)");
    valores.push(`%${busqueda}%`, `%${busqueda}%`);
  }
  if (categoria_id) {
    condiciones.push("p.categoria_id = ?");
    valores.push(Number(categoria_id));
  }
  if (estado) {
    condiciones.push("p.estado = ?");
    valores.push(estado);
  }
  if (precio_min) {
    condiciones.push("p.precio >= ?");
    valores.push(Number(precio_min));
  }
  if (precio_max) {
    condiciones.push("p.precio <= ?");
    valores.push(Number(precio_max));
  }
  if (ciudad) {
    condiciones.push("p.ciudad LIKE ?");
    valores.push(`%${ciudad}%`);
  }

  const WHERE = condiciones.join(" AND ");
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM productos p WHERE ${WHERE}`,
      valores
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.titulo, p.precio, p.estado, p.ciudad, p.imagen_principal,
              p.visitas, p.fecha_publicacion,
              c.nombre AS categoria, c.icon AS categoria_icon,
              u.nombre AS vendedor_nombre, u.apellido AS vendedor_apellido
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       LEFT JOIN usuarios  u ON u.id = p.vendedor_id
       WHERE ${WHERE}
       ORDER BY p.fecha_publicacion DESC
       LIMIT ? OFFSET ?`,
      [...valores, Number(limit), offset]
    );

    res.json({ total, pagina: Number(page), productos: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/productos/destacados  — 6 productos más recientes para el Home
router.get("/destacados", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.titulo, p.precio, p.estado, p.ciudad, p.imagen_principal,
              c.nombre AS categoria, u.nombre AS vendedor_nombre
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       LEFT JOIN usuarios  u ON u.id = p.vendedor_id
       WHERE p.activo = 1
       ORDER BY p.fecha_publicacion DESC
       LIMIT 6`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/productos/mis-productos  — publicaciones del usuario autenticado
router.get("/mis-productos", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.titulo, p.precio, p.estado, p.activo, p.visitas,
              p.fecha_publicacion, c.nombre AS categoria
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.vendedor_id = ?
       ORDER BY p.fecha_publicacion DESC`,
      [req.usuario.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/productos/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*,
              c.nombre AS categoria, c.icon AS categoria_icon,
              u.nombre AS vendedor_nombre, u.apellido AS vendedor_apellido,
              u.ciudad AS vendedor_ciudad, u.telefono AS vendedor_telefono,
              u.correo AS vendedor_correo
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       LEFT JOIN usuarios  u ON u.id = p.vendedor_id
       WHERE p.id = ? AND p.activo = 1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });

    // Registrar visita
    await pool.query("UPDATE productos SET visitas = visitas + 1 WHERE id = ?", [req.params.id]);

    // Imágenes de la galería
    const [imagenes] = await pool.query(
      "SELECT ruta FROM imagenes_producto WHERE producto_id = ? ORDER BY orden",
      [req.params.id]
    );

    res.json({ ...rows[0], imagenes: imagenes.map((i) => i.ruta) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/productos  — crear publicación (requiere auth + imágenes)
router.post(
  "/",
  verificarToken,
  upload.array("imagenes", 5), // hasta 5 imágenes
  async (req, res) => {
    const { titulo, descripcion, precio, estado, categoria_id, ciudad } = req.body;

    if (!titulo || !precio || !estado) {
      return res.status(400).json({ error: "Título, precio y estado son obligatorios" });
    }

    const archivos = req.files || [];
    const imagenPrincipal = archivos.length > 0 ? `/uploads/${archivos[0].filename}` : null;

    try {
      const [result] = await pool.query(
        `INSERT INTO productos (titulo, descripcion, precio, estado, categoria_id, vendedor_id, ciudad, imagen_principal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          titulo,
          descripcion || null,
          Number(precio),
          estado,
          categoria_id ? Number(categoria_id) : null,
          req.usuario.id,
          ciudad || null,
          imagenPrincipal,
        ]
      );

      // Guardar imágenes adicionales
      for (let i = 1; i < archivos.length; i++) {
        await pool.query(
          "INSERT INTO imagenes_producto (producto_id, ruta, orden) VALUES (?, ?, ?)",
          [result.insertId, `/uploads/${archivos[i].filename}`, i]
        );
      }

      res.status(201).json({ mensaje: "Producto publicado", id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// PUT /api/productos/:id  — editar (solo el vendedor)
router.put("/:id", verificarToken, async (req, res) => {
  const { titulo, descripcion, precio, estado, categoria_id, ciudad, activo } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT vendedor_id FROM productos WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    if (rows[0].vendedor_id !== req.usuario.id)
      return res.status(403).json({ error: "No tienes permiso para editar este producto" });

    await pool.query(
      `UPDATE productos SET titulo = ?, descripcion = ?, precio = ?, estado = ?,
       categoria_id = ?, ciudad = ?, activo = ? WHERE id = ?`,
      [
        titulo,
        descripcion || null,
        Number(precio),
        estado,
        categoria_id ? Number(categoria_id) : null,
        ciudad || null,
        activo !== undefined ? activo : 1,
        req.params.id,
      ]
    );
    res.json({ mensaje: "Producto actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/productos/:id  — desactivar (solo el vendedor)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT vendedor_id FROM productos WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    if (rows[0].vendedor_id !== req.usuario.id)
      return res.status(403).json({ error: "No tienes permiso" });

    await pool.query("UPDATE productos SET activo = 0 WHERE id = ?", [req.params.id]);
    res.json({ mensaje: "Publicación eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
