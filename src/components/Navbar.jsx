// Barra de navegación fija con modal de login
// Muestra rutas privadas solo cuando la bandera está encendida
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Alert,
  Navbar as BsNavbar,
  Nav,
  Container,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const { autenticado, usuario, login, logout } = useAuth();
  const navigate = useNavigate();

  // Estado del modal de login
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formUser, setFormUser] = useState("");
  const [formPass, setFormPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    const ok = login(formUser, formPass);
    if (ok) {
      setMostrarModal(false);
      setError("");
      setFormUser("");
      setFormPass("");
      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      {/* navbar fija en la parte superior */}
      <BsNavbar
        bg="success"
        variant="dark"
        expand="lg"
        sticky="top"
        className={styles.navbar}
      >
        <Container>
          <BsNavbar.Brand as={Link} to="/" className={styles.brand}>
            🏷️ Second Hand
          </BsNavbar.Brand>
          <BsNavbar.Toggle />
          <BsNavbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/catalogo">
                Catálogo
              </Nav.Link>

              {/* Rutas privadas: solo visibles si está autenticado */}
              {autenticado && (
                <>
                  <Nav.Link as={Link} to="/publicar">
                    Publicar
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard">
                    Mi perfil
                  </Nav.Link>
                </>
              )}
            </Nav>

            {/* ── AQUÍ está el cambio: botones de login y registro ── */}
            <Nav>
              {autenticado ? (
                <>
                  <span className="navbar-text text-white me-3">
                    Hola, {usuario}
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setMostrarModal(true)}
                  >
                    Iniciar sesión
                  </Button>
                  <Button variant="warning" size="sm" as={Link} to="/registro">
                    Registrarse
                  </Button>
                </div>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>

      {/* Modal de Login */}
      <Modal
        show={mostrarModal}
        onHide={() => {
          setMostrarModal(false);
          setError("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="admin"
                value={formUser}
                onChange={(e) => setFormUser(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="1234"
                value={formPass}
                onChange={(e) => setFormPass(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              Entrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;
