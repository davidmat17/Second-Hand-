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
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const { autenticado, usuario, login, logout } = useAuth();
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [formCorreo, setFormCorreo] = useState("");
  const [formPass, setFormPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      await login(formCorreo, formPass);
      setMostrarModal(false);
      setFormCorreo("");
      setFormPass("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function cerrarModal() {
    setMostrarModal(false);
    setError("");
    setFormCorreo("");
    setFormPass("");
  }

  return (
    <>
      <BsNavbar variant="dark" expand="lg" sticky="top" className={styles.navbar} style={{ background: '#00A650' }}>
        <Container>
          <BsNavbar.Brand as={Link} to="/" className={styles.brand}>
            <img src="/Logo.png" alt="Second Hand" height="40" style={{ objectFit: "contain" }} />
          </BsNavbar.Brand>
          <BsNavbar.Toggle />
          <BsNavbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/catalogo">Catálogo</Nav.Link>
              {autenticado && (
                <>
                  <Nav.Link as={Link} to="/publicar">Publicar</Nav.Link>
                  <Nav.Link as={Link} to="/dashboard">Mi perfil</Nav.Link>
                </>
              )}
            </Nav>

            <Nav>
              {autenticado ? (
                <>
                  <span className={`me-3 ${styles.saludo}`}>
                    Hola, {usuario?.nombre}
                  </span>
                  <Button className={styles.btnLogin} size="sm" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <Button className={styles.btnLogin} size="sm" onClick={() => setMostrarModal(true)}>
                    Iniciar sesión
                  </Button>
                  <Button className={styles.btnPublicar} size="sm" as={Link} to="/registro">
                    Registrarse
                  </Button>
                </div>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>

      {/* ── Modal de Login ── */}
      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="tu@correo.com"
                value={formCorreo}
                onChange={(e) => setFormCorreo(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={formPass}
                onChange={(e) => setFormPass(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100" disabled={cargando}>
              {cargando ? <Spinner size="sm" /> : "Entrar"}
            </Button>
          </Form>
          <p className="text-center mt-3 mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/registro" onClick={cerrarModal}>Regístrate gratis</Link>
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;
