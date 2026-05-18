-- =============================================================
--  SECOND HAND — Base de datos completa
--  Importar en phpMyAdmin: selecciona "secondhand_db" y ejecuta
-- =============================================================

CREATE DATABASE IF NOT EXISTS secondhand_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE secondhand_db;

-- -------------------------------------------------------------
--  CATEGORIAS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  icon    VARCHAR(10)  NOT NULL DEFAULT '📦',
  color   VARCHAR(20)  NOT NULL DEFAULT '#6c757d'
);

INSERT INTO categorias (nombre, icon, color) VALUES
  ('Electronica',  '📱', '#0d6efd'),
  ('Ropa',         '👗', '#6f42c1'),
  ('Hogar',        '🏠', '#fd7e14'),
  ('Deportes',     '⚽', '#198754'),
  ('Vehiculos',    '🚗', '#dc3545'),
  ('Libros',       '📚', '#20c997');

-- -------------------------------------------------------------
--  USUARIOS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100)  NOT NULL,
  apellido        VARCHAR(100)  NOT NULL,
  correo          VARCHAR(150)  NOT NULL UNIQUE,
  telefono        VARCHAR(20),
  ciudad          VARCHAR(100),
  password_hash   VARCHAR(255)  NOT NULL,
  foto_perfil     VARCHAR(255),
  fecha_registro  DATETIME      DEFAULT NOW(),
  activo          TINYINT(1)    DEFAULT 1
);

-- Usuario de prueba: admin / 1234
-- (el hash es generado por bcrypt, se reemplaza al registrar)
INSERT INTO usuarios (nombre, apellido, correo, telefono, ciudad, password_hash) VALUES
  ('Admin', 'Second Hand', 'admin@secondhand.co', '3001234567', 'Bogotá',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy2');

-- -------------------------------------------------------------
--  PRODUCTOS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  titulo            VARCHAR(200)  NOT NULL,
  descripcion       TEXT,
  precio            DECIMAL(12,2) NOT NULL,
  estado            ENUM('Como nuevo','Bueno','Regular','Para reparar') NOT NULL DEFAULT 'Bueno',
  categoria_id      INT,
  vendedor_id       INT           NOT NULL,
  ciudad            VARCHAR(100),
  imagen_principal  VARCHAR(255),
  visitas           INT           DEFAULT 0,
  activo            TINYINT(1)    DEFAULT 1,
  fecha_publicacion DATETIME      DEFAULT NOW(),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
  FOREIGN KEY (vendedor_id)  REFERENCES usuarios(id)   ON DELETE CASCADE
);

-- Productos de ejemplo
INSERT INTO productos (titulo, descripcion, precio, estado, categoria_id, vendedor_id, ciudad, imagen_principal) VALUES
  ('iPhone 13 Pro', 'Excelente estado, cargador original incluido, sin rayones.', 1800000, 'Como nuevo', 1, 1, 'Bogotá',        NULL),
  ('Bicicleta MTB Trek', 'Rodada 29, frenos de disco hidráulicos, poco uso.',       650000,  'Bueno',     4, 1, 'Medellín',     NULL),
  ('Sofá 3 puestos', 'Tela gris, muy cómodo, sin manchas.',                         480000,  'Regular',   3, 1, 'Cali',         NULL),
  ('Laptop Dell i5', 'Intel i5 11va gen, 8GB RAM, SSD 256GB, cargador original.',  1200000, 'Como nuevo', 1, 1, 'Bogotá',       NULL),
  ('Raqueta de tenis Wilson', 'Encordada de fábrica, una temporada de uso.',         90000,  'Bueno',     4, 1, 'Barranquilla', NULL),
  ('Cámara Canon T7', 'Cuerpo + lente 18-55mm, 2 baterías, funda incluida.',        750000, 'Como nuevo', 1, 1, 'Bogotá',       NULL),
  ('Vestido de fiesta', 'Talla S, color negro, usado una sola vez.',                  85000, 'Como nuevo', 2, 1, 'Medellín',     NULL),
  ('Mesa de comedor', 'Madera sólida, 6 sillas incluidas, fácil desmontaje.',       320000, 'Bueno',      3, 1, 'Cali',         NULL),
  ('Chaqueta de cuero', 'Talla M, cuero genuino, estilo clásico.',                  150000, 'Bueno',      2, 1, 'Bogotá',       NULL),
  ('PlayStation 4', '500GB, dos mandos, 5 juegos físicos.',                          900000, 'Como nuevo', 1, 1, 'Bucaramanga',  NULL),
  ('Libro Clean Code', 'Robert C. Martin, edición en inglés, muy buen estado.',      35000, 'Bueno',      6, 1, 'Bogotá',       NULL),
  ('Moto Honda 125cc', 'Modelo 2021, papeles al día, seguro vigente.',             4500000, 'Bueno',      5, 1, 'Medellín',     NULL);

-- -------------------------------------------------------------
--  IMÁGENES ADICIONALES (galería del producto)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imagenes_producto (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  ruta        VARCHAR(255) NOT NULL,
  orden       TINYINT DEFAULT 0,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- =============================================================
--  FIN DEL SCRIPT
-- =============================================================
