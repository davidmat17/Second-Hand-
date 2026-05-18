const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, nombre);
  },
});

function filtroImagenes(_req, file, cb) {
  const permitidos = /jpeg|jpg|png|webp/;
  const esValido = permitidos.test(path.extname(file.originalname).toLowerCase());
  if (esValido) cb(null, true);
  else cb(new Error("Solo se permiten imágenes (jpg, png, webp)"));
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por imagen
  fileFilter: filtroImagenes,
});

module.exports = upload;
