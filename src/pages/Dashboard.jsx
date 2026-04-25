// Dashboard del usuario autenticado
// Muestra perfil, publicaciones, historial y opción de editar datos
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Badge,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Dashboard.module.css";

// Datos simulados del usuario
const PERFIL_MOCK = {
  nombre: "Admin",
  apellido: "Second Hand",
  correo: "admin@secondhand.co",
  telefono: "3001234567",
  ciudad: "Bogotá",
  foto: null, // sin foto por defecto
  fechaRegistro: "Marzo 2026",
};

// Publicaciones activas simuladas
const PUBLICACIONES_MOCK = [
  {
    id: 1,
    nombre: "iPhone 13 Pro",
    precio: 1800000,
    estado: "Como nuevo",
    categoria: "Electrónica",
    activo: true,
    visitas: 42,
  },
  {
    id: 2,
    nombre: "Bicicleta MTB",
    precio: 650000,
    estado: "Bueno",
    categoria: "Deportes",
    activo: true,
    visitas: 18,
  },
  {
    id: 3,
    nombre: "Sofá 3 puestos",
    precio: 480000,
    estado: "Regular",
    categoria: "Hogar",
    activo: false,
    visitas: 7,
  },
];

// Historial simulado
const HISTORIAL_MOCK = [
  {
    id: 1,
    tipo: "venta",
    producto: "Laptop Dell i5",
    monto: 1200000,
    fecha: "15 Mar 2026",
    contraparte: "Laura G.",
  },
  {
    id: 2,
    tipo: "compra",
    producto: "Libro Clean Code",
    monto: 35000,
    fecha: "10 Mar 2026",
    contraparte: "Diego A.",
  },
  {
    id: 3,
    tipo: "venta",
    producto: "Cámara Canon T7",
    monto: 750000,
    fecha: "02 Mar 2026",
    contraparte: "Pedro R.",
  },
  {
    id: 4,
    tipo: "compra",
    producto: "Raqueta de tenis",
    monto: 90000,
    fecha: "28 Feb 2026",
    contraparte: "Juan S.",
  },
];

function colorEstado(estado) {
  if (estado === "Como nuevo") return "success";
  if (estado === "Bueno") return "primary";
  return "warning";
}

function Dashboard() {
  const { usuario } = useAuth();

  // Tab activa
  const [tabActiva, setTabActiva] = useState("perfil");

  // Edición de perfil
  const [editando, setEditando] = useState(false);
  const [perfilForm, setPerfilForm] = useState(PERFIL_MOCK);
  const [perfilGuardado, setPerfilGuardado] = useState(false);

  // Modal confirmar desactivar publicación
  const [modalDesactivar, setModalDesactivar] = useState(null);
  const [publicaciones, setPublicaciones] = useState(PUBLICACIONES_MOCK);

  // Estadísticas calculadas
  const totalVentas = HISTORIAL_MOCK.filter((h) => h.tipo === "venta").length;
  const totalCompras = HISTORIAL_MOCK.filter((h) => h.tipo === "compra").length;
  const montoVentas = HISTORIAL_MOCK.filter((h) => h.tipo === "venta").reduce(
    (acc, h) => acc + h.monto,
    0,
  );

  function handlePerfilChange(e) {
    const { name, value } = e.target;
    setPerfilForm((prev) => ({ ...prev, [name]: value }));
  }

  function guardarPerfil(e) {
    e.preventDefault();
    setEditando(false);
    setPerfilGuardado(true);
    setTimeout(() => setPerfilGuardado(false), 3000);
  }

  function desactivarPublicacion(id) {
    setPublicaciones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: false } : p)),
    );
    setModalDesactivar(null);
  }

  return (
    <main className={styles.pagina}>
      <Container>
        {/* ── Encabezado del perfil ── */}
        <div className={styles.encabezado}>
          <div className={styles.avatar}>
            {perfilForm.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className={styles.nombreUsuario}>
              {perfilForm.nombre} {perfilForm.apellido}
            </h2>
            <p className={styles.infoUsuario}>
              📍 {perfilForm.ciudad} &nbsp;·&nbsp; 📅 Miembro desde{" "}
              {PERFIL_MOCK.fechaRegistro}
            </p>
          </div>
        </div>

        {/* ── Tarjetas de estadísticas ── */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <Card className={styles.statCard}>
              <Card.Body>
                <p className={styles.statLabel}>Publicaciones</p>
                <p className={styles.statValor}>
                  {publicaciones.filter((p) => p.activo).length}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className={styles.statCard}>
              <Card.Body>
                <p className={styles.statLabel}>Ventas</p>
                <p className={styles.statValor}>{totalVentas}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className={styles.statCard}>
              <Card.Body>
                <p className={styles.statLabel}>Compras</p>
                <p className={styles.statValor}>{totalCompras}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className={styles.statCard}>
              <Card.Body>
                <p className={styles.statLabel}>Total vendido</p>
                <p className={styles.statValor}>
                  ${montoVentas.toLocaleString("es-CO")}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ── Tabs principales ── */}
        <Tab.Container activeKey={tabActiva} onSelect={setTabActiva}>
          <Card className={styles.cardTabs}>
            {/* Navegación de tabs */}
            <Card.Header className={styles.tabsHeader}>
              <Nav variant="tabs" className={styles.tabs}>
                <Nav.Item>
                  <Nav.Link eventKey="perfil" className={styles.tabLink}>
                    👤 Mi perfil
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="publicaciones" className={styles.tabLink}>
                    📦 Publicaciones
                    <Badge bg="success" className="ms-2">
                      {publicaciones.filter((p) => p.activo).length}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="historial" className={styles.tabLink}>
                    📋 Historial
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              <Tab.Content>
                {/* ── TAB: Perfil ── */}
                <Tab.Pane eventKey="perfil">
                  {perfilGuardado && (
                    <Alert variant="success" className="mb-3">
                      ✅ Perfil actualizado correctamente.
                    </Alert>
                  )}

                  {!editando ? (
                    // Vista de solo lectura
                    <div>
                      <Row className="g-3">
                        {[
                          { label: "Nombre", valor: perfilForm.nombre },
                          { label: "Apellido", valor: perfilForm.apellido },
                          { label: "Correo", valor: perfilForm.correo },
                          { label: "Teléfono", valor: perfilForm.telefono },
                          { label: "Ciudad", valor: perfilForm.ciudad },
                        ].map((campo) => (
                          <Col xs={12} sm={6} key={campo.label}>
                            <div className={styles.campoPerfil}>
                              <span className={styles.campoLabel}>
                                {campo.label}
                              </span>
                              <span className={styles.campoValor}>
                                {campo.valor || "—"}
                              </span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <Button
                        variant="success"
                        className="mt-4"
                        onClick={() => setEditando(true)}
                      >
                        ✏️ Editar datos
                      </Button>
                    </div>
                  ) : (
                    // Formulario de edición
                    <Form onSubmit={guardarPerfil}>
                      <Row className="g-3">
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label className={styles.label}>
                              Nombre
                            </Form.Label>
                            <Form.Control
                              name="nombre"
                              value={perfilForm.nombre}
                              onChange={handlePerfilChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label className={styles.label}>
                              Apellido
                            </Form.Label>
                            <Form.Control
                              name="apellido"
                              value={perfilForm.apellido}
                              onChange={handlePerfilChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label className={styles.label}>
                              Correo
                            </Form.Label>
                            <Form.Control
                              name="correo"
                              type="email"
                              value={perfilForm.correo}
                              onChange={handlePerfilChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label className={styles.label}>
                              Teléfono
                            </Form.Label>
                            <Form.Control
                              name="telefono"
                              value={perfilForm.telefono}
                              onChange={handlePerfilChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label className={styles.label}>
                              Ciudad
                            </Form.Label>
                            <Form.Select
                              name="ciudad"
                              value={perfilForm.ciudad}
                              onChange={handlePerfilChange}
                            >
                              {[
                                "Bogotá",
                                "Medellín",
                                "Cali",
                                "Barranquilla",
                                "Bucaramanga",
                                "Cartagena",
                                "Otra",
                              ].map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-flex gap-2 mt-4">
                        <Button type="submit" variant="success">
                          💾 Guardar cambios
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setEditando(false);
                            setPerfilForm(PERFIL_MOCK);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  )}
                </Tab.Pane>

                {/* ── TAB: Publicaciones ── */}
                <Tab.Pane eventKey="publicaciones">
                  {publicaciones.length === 0 ? (
                    <div className={styles.vacio}>
                      <p>No tienes publicaciones aún.</p>
                      <Button variant="success" href="/publicar">
                        Publicar ahora
                      </Button>
                    </div>
                  ) : (
                    <Row className="g-3">
                      {publicaciones.map((pub) => (
                        <Col xs={12} md={6} key={pub.id}>
                          <Card
                            className={`${styles.cardPublicacion} ${!pub.activo ? styles.inactiva : ""}`}
                          >
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className={styles.pubNombre}>
                                    {pub.nombre}
                                  </h6>
                                  <p className={styles.pubPrecio}>
                                    ${pub.precio.toLocaleString("es-CO")} COP
                                  </p>
                                </div>
                                <div className="text-end">
                                  <Badge
                                    bg={colorEstado(pub.estado)}
                                    className="d-block mb-1"
                                  >
                                    {pub.estado}
                                  </Badge>
                                  <Badge
                                    bg={pub.activo ? "success" : "secondary"}
                                  >
                                    {pub.activo ? "Activa" : "Inactiva"}
                                  </Badge>
                                </div>
                              </div>
                              <p className={styles.pubMeta}>
                                📂 {pub.categoria} &nbsp;·&nbsp; 👁️{" "}
                                {pub.visitas} visitas
                              </p>
                              {pub.activo && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => setModalDesactivar(pub)}
                                >
                                  Desactivar
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                  <Button
                    variant="success"
                    size="sm"
                    className="mt-3"
                    href="/publicar"
                  >
                    + Nueva publicación
                  </Button>
                </Tab.Pane>

                {/* ── TAB: Historial ── */}
                <Tab.Pane eventKey="historial">
                  {HISTORIAL_MOCK.length === 0 ? (
                    <div className={styles.vacio}>
                      <p>No tienes transacciones aún.</p>
                    </div>
                  ) : (
                    <div className={styles.historialLista}>
                      {HISTORIAL_MOCK.map((h) => (
                        <div key={h.id} className={styles.historialItem}>
                          <div className={styles.historialIcono}>
                            {h.tipo === "venta" ? "💰" : "🛒"}
                          </div>
                          <div className={styles.historialInfo}>
                            <p className={styles.historialProducto}>
                              {h.producto}
                            </p>
                            <p className={styles.historialMeta}>
                              {h.tipo === "venta" ? "Vendido a" : "Comprado a"}{" "}
                              <strong>{h.contraparte}</strong>
                              &nbsp;·&nbsp; {h.fecha}
                            </p>
                          </div>
                          <div className="text-end">
                            <p
                              className={`${styles.historialMonto} ${h.tipo === "venta" ? styles.venta : styles.compra}`}
                            >
                              {h.tipo === "venta" ? "+" : "-"}$
                              {h.monto.toLocaleString("es-CO")}
                            </p>
                            <Badge
                              bg={h.tipo === "venta" ? "success" : "primary"}
                            >
                              {h.tipo}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </Container>

      {/* ── Modal confirmar desactivar ── */}
      <Modal
        show={modalDesactivar !== null}
        onHide={() => setModalDesactivar(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Desactivar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres desactivar{" "}
          <strong>{modalDesactivar?.nombre}</strong>? Ya no será visible en el
          catálogo.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalDesactivar(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => desactivarPublicacion(modalDesactivar.id)}
          >
            Sí, desactivar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default Dashboard;
