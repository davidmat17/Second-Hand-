# INSTRUCCIONES DE PUESTA EN MARCHA — SECOND HAND (Full Stack)

## Orden de pasos

### PASO 1 — Importar la base de datos en phpMyAdmin

1. Abre XAMPP y arranca **Apache** y **MySQL**
2. Abre el navegador y entra a: http://localhost/phpmyadmin
3. Haz clic en **"Nueva"** (panel izquierdo)
4. Nombre de la base de datos: `secondhand_db` → botón **Crear**
5. Luego ve a la pestaña **"Importar"**
6. Selecciona el archivo: `database/secondhand.sql`
7. Clic en **"Continuar"**

Usuario de prueba ya creado para ingresar con Login en Front end:

- Correo: `admin@secondhand.co`
- Contraseña: `Admin1234@`

---

### PASO 2 — Instalar y arrancar el backend (API Express)

Abre una terminal (CMD o PowerShell) y ejecuta:

```
cd C:\Users\arnol\Downloads\01_secondhand\01_secondhand\01_secondhand\backend
npm install
npm run dev
```

Deberías ver:

```
✅  API Second Hand corriendo en http://localhost:3001
```

Deja esa terminal abierta.

---

### PASO 3 — Instalar y arrancar el frontend (React + Vite)

Abre OTRA terminal y ejecuta:

```
cd C:\Users\arnol\Downloads\01_secondhand\01_secondhand\01_secondhand
npm install
npm run dev
```

Deberías ver:

```
VITE v8.x.x  ready in 542 ms
->  Local:   http://localhost:5173/
```

Abre el navegador en: **http://localhost:5173**

---

## Estructura del proyecto completo

```
01_secondhand/
├── database/
│   └── secondhand.sql          ← Script SQL para phpMyAdmin
├── backend/                    ← API Node.js + Express
│   ├── .env                    ← Configuración BD y JWT
│   ├── package.json
│   ├── server.js               ← Punto de entrada del servidor
│   ├── db.js                   ← Pool de conexiones MySQL
│   ├── middleware/
│   │   ├── authMiddleware.js   ← Verificación de JWT
│   │   └── upload.js           ← Subida de imágenes (multer)
│   ├── routes/
│   │   ├── auth.js             ← Registro, login, perfil
│   │   ├── productos.js        ← CRUD de productos
│   │   └── categorias.js       ← Listado de categorías
│   └── uploads/                ← Imágenes subidas (auto-creado)
└── src/                        ← Frontend React
    ├── context/AuthContext.jsx ← Auth real con JWT + localStorage
    ├── components/
    │   ├── Navbar.jsx          ← Login modal con correo/contraseña
    │   └── RutaPrivada.jsx     ← Guard con manejo de carga
    └── pages/
        ├── Home.jsx            ← Productos destacados desde BD
        ├── Catalogo.jsx        ← Filtros reales + paginación
        ├── Publicar.jsx        ← Subida de fotos a servidor
        ├── Dashboard.jsx       ← Perfil + publicaciones reales
        └── Registro.jsx        ← Registro real en BD
```

## Endpoints de la API

| Método | Ruta                         | Auth | Descripción                        |
| ------ | ---------------------------- | ---- | ---------------------------------- |
| POST   | /api/auth/registro           | No   | Crear cuenta nueva                 |
| POST   | /api/auth/login              | No   | Iniciar sesión, devuelve JWT       |
| GET    | /api/auth/perfil             | Sí   | Ver datos del usuario              |
| PUT    | /api/auth/perfil             | Sí   | Editar nombre, teléfono, ciudad    |
| GET    | /api/categorias              | No   | Listar categorías                  |
| GET    | /api/productos               | No   | Catálogo con filtros y paginación  |
| GET    | /api/productos/destacados    | No   | 6 productos recientes para el Home |
| GET    | /api/productos/mis-productos | Sí   | Publicaciones del usuario actual   |
| GET    | /api/productos/:id           | No   | Detalle de un producto             |
| POST   | /api/productos               | Sí   | Publicar artículo + fotos          |
| PUT    | /api/productos/:id           | Sí   | Editar publicación propia          |
| DELETE | /api/productos/:id           | Sí   | Desactivar publicación propia      |

## Si MySQL tiene contraseña

Edita el archivo `backend/.env` y cambia:

```
DB_PASS=tu_contraseña_aqui
```
