// Footer con contactos del equipo y redes sociales
import styles from "../styles/Footer.module.css";

// Datos del equipo
const EQUIPO = [
  {
    nombre: "Arnold Navarro",
    rol: "Líder / Coordinación",
    email: "arnold@secondhand.co",
  },
  {
    nombre: "David Martínez",
    rol: "Backend / BD",
    email: "david@secondhand.co",
  },
  {
    nombre: "Andrés Mojica",
    rol: "Frontend / Diseño",
    email: "andres@secondhand.co",
  },
  {
    nombre: "Diego Duque",
    rol: "JS / Validaciones",
    email: "diego@secondhand.co",
  },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row py-4">
          {/* Columna: Sobre el proyecto */}
          <div className="col-md-4 mb-3">
            <h5 className={styles.titulo}>🏷️ Second Hand</h5>
            <p className={styles.descripcion}>
              Plataforma colombiana de compraventa de artículos usados. Economía
              circular, sostenible y accesible.
            </p>
          </div>

          {/* Columna: Equipo (al hacer clic muestra datos) */}
          <div className="col-md-4 mb-3">
            <h5 className={styles.titulo}>Nuestro equipo</h5>
            {EQUIPO.map((m, i) => (
              <div key={i} className={styles.miembro}>
                <strong>{m.nombre}</strong> — {m.rol}
                <br />
                <small>{m.email}</small>
              </div>
            ))}
          </div>

          {/* Columna: Redes sociales */}
          <div className="col-md-4 mb-3">
            <h5 className={styles.titulo}>Síguenos</h5>
            <div className={styles.redes}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className={styles.red}
              >
                📘 Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className={styles.red}
              >
                🐦 Twitter / X
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className={styles.red}
              >
                📷 Instagram
              </a>
            </div>
          </div>
        </div>
        <hr className={styles.linea} />
        <p
          className="text-center mb-2"
          style={{ color: "#aaa", fontSize: "0.85rem" }}
        >
          © 2026 Second Hand – Grupo B1. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
