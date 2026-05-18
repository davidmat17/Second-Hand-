// Footer con contactos del equipo y redes sociales
// Al hacer clic en un miembro se abre un modal con sus datos básicos
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "../styles/Footer.module.css";

// Datos del equipo
// NOTA: reemplaza `foto` con la ruta real (ej: "/equipo/arnold.jpg")
//       y los `codigo` con los códigos estudiantiles reales.
const EQUIPO = [
  {
    nombre: "Arnold Navarro",
    rol: "Coordinación",
    correo: "arnold@secondhand.co",
    carrera: "Ingeniería de Sistemas",
    codigo: "2191234",
    foto: "/public/Equipo/Arnold.png",
  },
  {
    nombre: "David Martínez",
    rol: "Lider/Backend / BD",
    correo: "david@secondhand.co",
    carrera: "Ingeniería de Sistemas",
    codigo: "2231879",
    foto: "/public/Equipo/David.png",
  },
  {
    nombre: "Andrés Mojica",
    rol: "Frontend / Diseño Interfaz",
    correo: "andres@secondhand.co",
    carrera: "Ingeniería de Sistemas",
    codigo: "2185432",
    foto: "/public/Equipo/santiago.png",
  },
  {
    nombre: "Diego Duque",
    rol: "JS / Validaciones",
    correo: "diego@secondhand.co",
    carrera: "Ingeniería de Sistemas",
    codigo: "2207654",
    foto: "/public/Equipo/Diego.png",
  },
];

// Genera las iniciales a partir del nombre completo
function iniciales(nombre) {
  return nombre
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function Footer() {
  const [miembroSel, setMiembroSel] = useState(null);

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

          {/* Columna: Equipo */}
          <div className="col-md-4 mb-3">
            <h5 className={styles.titulo}>Nuestro equipo</h5>
            <p className={styles.subtituloEquipo}>
              Haz clic en un miembro para ver sus datos
            </p>
            {EQUIPO.map((m) => (
              <button
                key={m.correo}
                type="button"
                className={styles.miembroBtn}
                onClick={() => setMiembroSel(m)}
              >
                <span className={styles.avatarMini}>{iniciales(m.nombre)}</span>
                <span className={styles.miembroTexto}>
                  <strong>{m.nombre}</strong>
                  <small>{m.rol}</small>
                </span>
              </button>
            ))}
          </div>

          {/* Columna: Redes sociales */}
          <div className="col-md-4 mb-3">
            <h5 className={styles.titulo}>Síguenos</h5>
            <div className={styles.redes}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.red}
              >
                📘 Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.red}
              >
                🐦 Twitter / X
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
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

      {/* ── Modal con datos del miembro ── */}
      <Modal
        show={miembroSel !== null}
        onHide={() => setMiembroSel(null)}
        centered
      >
        {miembroSel && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>👤 Datos del estudiante</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {miembroSel.foto ? (
                <img
                  src={miembroSel.foto}
                  alt={miembroSel.nombre}
                  className={styles.avatarModal}
                />
              ) : (
                <div className={styles.avatarModalIniciales}>
                  {iniciales(miembroSel.nombre)}
                </div>
              )}
              <h4 className="mt-3 mb-1">{miembroSel.nombre}</h4>
              <p className={styles.rolModal}>{miembroSel.rol}</p>
              <div className={styles.datosLista}>
                <div className={styles.datoFila}>
                  <span className={styles.datoLabel}>📧 Correo</span>
                  <span className={styles.datoValor}>{miembroSel.correo}</span>
                </div>
                <div className={styles.datoFila}>
                  <span className={styles.datoLabel}>🎓 Carrera</span>
                  <span className={styles.datoValor}>{miembroSel.carrera}</span>
                </div>
                <div className={styles.datoFila}>
                  <span className={styles.datoLabel}>🔢 Código</span>
                  <span className={styles.datoValor}>{miembroSel.codigo}</span>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setMiembroSel(null)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </footer>
  );
}

export default Footer;
