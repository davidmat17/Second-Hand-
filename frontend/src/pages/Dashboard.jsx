import { useState, useEffect, useCallback, useRef } from "react";
import {
  Container, Row, Col, Card, Tab, Nav, Badge,
  Button, Form, Alert, Modal, Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Dashboard.module.css";

const ESTADOS_PROD = ["Como nuevo", "Bueno", "Regular", "Para reparar"];

function colorEstado(estado) {
  if (estado === "Como nuevo") return "success";
  if (estado === "Bueno")      return "primary";
  return "warning";
}

function Dashboard() {
  const { usuario, getToken, logout } = useAuth();

  // Perfil
  const [perfil, setPerfil]             = useState(null);
  const [editando, setEditando]         = useState(false);
  const [formPerfil, setFormPerfil]     = useState({});
  const [mensajePerfil, setMensajePerfil] = useState(null);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  // Foto de perfil
  const fotoInputRef                    = useRef(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // Publicaciones
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargandoPub, setCargandoPub]     = useState(true);

  // Categorías (para modal editar)
  const [categorias, setCategorias] = useState([]);

  // Modal eliminar
  const [modalEliminar, setModalEliminar] = useState(null);
  const [eliminando, setEliminando]       = useState(false);

  // Modal editar producto
  const [modalEditar, setModalEditar]         = useState(null);
  const [formEditar, setFormEditar]           = useState({});
  const [cargandoEditar, setCargandoEditar]   = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion]       = useState("");

  const authHeader = { Authorization: `Bearer ${getToken()}` };

  const cargarPerfil = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/perfil", { headers: authHeader });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      const data = await res.json();
      setPerfil(data);
      setFormPerfil({
        nombre:   data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || "",
        ciudad:   data.ciudad   || "",
      });
    } catch { /* red caída */ }
  }, []); // eslint-disable-line

  const cargarPublicaciones = useCallback(async () => {
    setCargandoPub(true);
    try {
      const res  = await fetch("/api/productos/mis-productos", { headers: authHeader });
      const data = await res.json();
      setPublicaciones(Array.isArray(data) ? data : []);
    } catch {
      setPublicaciones([]);
    } finally {
      setCargandoPub(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    cargarPerfil();
    cargarPublicaciones();
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias)
      .catch(() => {});
  }, []);

  // ── Guardar perfil ──────────────────────────────────────────
  async function guardarPerfil(e) {
    e.preventDefault();
    setGuardandoPerfil(true);
    setMensajePerfil(null);
    try {
      const res = await fetch("/api/auth/perfil", {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(formPerfil),
      });
      if (!res.ok) throw new Error();
      setMensajePerfil({ tipo: "success", texto: "Perfil actualizado correctamente" });
      cargarPerfil();
      setEditando(false);
    } catch {
      setMensajePerfil({ tipo: "danger", texto: "Error al actualizar el perfil" });
    } finally {
      setGuardandoPerfil(false);
    }
  }

  // ── Subir foto de perfil ────────────────────────────────────
  async function subirFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoFoto(true);
    const fd = new FormData();
    fd.append("foto", file);
    try {
      const res  = await fetch("/api/auth/perfil/foto", { method: "POST", headers: authHeader, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPerfil((prev) => ({ ...prev, foto_perfil: data.foto_perfil }));
    } catch { /* ignorar */ }
    finally { setSubiendoFoto(false); }
  }

  // ── Pausar / activar publicación ────────────────────────────
  async function cambiarEstadoPublicacion(id, activo) {
    try {
      await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ activo }),
      });
      cargarPublicaciones();
    } catch { /* ignorar */ }
  }

  // ── Eliminar publicación ────────────────────────────────────
  async function eliminarPublicacion() {
    if (!modalEliminar) return;
    setEliminando(true);
    try {
      await fetch(`/api/productos/${modalEliminar}`, { method: "DELETE", headers: authHeader });
      setModalEliminar(null);
      cargarPublicaciones();
    } catch { /* ignorar */ }
    finally { setEliminando(false); }
  }

  // ── Abrir modal editar producto ─────────────────────────────
  async function abrirEditar(pub) {
    setModalEditar(pub);
    setErrorEdicion("");
    setCargandoEditar(true);
    try {
      const res  = await fetch(`/api/productos/${pub.id}`);
      const data = await res.json();
      setFormEditar({
        titulo:       data.titulo       || "",
        descripcion:  data.descripcion  || "",
        precio:       data.precio       || "",
        estado:       data.estado       || "Bueno",
        categoria_id: data.categoria_id || "",
        ciudad:       data.ciudad       || "",
        activo:       data.activo,
      });
    } catch {
      setFormEditar({
        titulo: pub.titulo, descripcion: "", precio: pub.precio,
        estado: pub.estado, categoria_id: "", ciudad: pub.ciudad || "", activo: pub.activo,
      });
    } finally {
      setCargandoEditar(false);
    }
  }

  // ── Guardar edición de producto ─────────────────────────────
  async function guardarEdicion(e) {
    e.preventDefault();
    setErrorEdicion("");
    setGuardandoEdicion(true);
    try {
      const res = await fetch(`/api/productos/${modalEditar.id}`, {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(formEditar),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setModalEditar(null);
      cargarPublicaciones();
    } catch (err) {
      setErrorEdicion(err.message);
    } finally {
      setGuardandoEdicion(false);
    }
  }

  const iniciales = perfil
    ? `${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <main className={styles.pagina}>
      <Container>
        <h1 className={styles.titulo}>Mi perfil</h1>

        <Tab.Container defaultActiveKey="perfil">
          <Row>
            {/* ── Sidebar ── */}
            <Col md={3} className="mb-4">
              <Card className={styles.sidebarCard}>
                <Card.Body className="text-center">
                  {/* Avatar clicable para subir foto */}
                  <input
                    ref={fotoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={subirFoto}
                  />
                  <div
                    className={styles.avatarWrapper}
                    onClick={() => fotoInputRef.current?.click()}
                    title="Cambiar foto de perfil"
                  >
                    {perfil?.foto_perfil ? (
                      <img
                        src={perfil.foto_perfil}
                        alt="foto perfil"
                        className={styles.avatarGrandeImg}
                      />
                    ) : (
                      <div className={styles.avatarGrande}>{iniciales}</div>
                    )}
                    <div className={styles.avatarOverlay}>
                      {subiendoFoto ? <Spinner size="sm" /> : "📷"}
                    </div>
                  </div>

                  <h5 className="mt-2 mb-0">{usuario?.nombre} {perfil?.apellido}</h5>
                  <small className="text-muted">{perfil?.correo}</small>
                  {perfil?.ciudad && (
                    <p className="mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
                      📍 {perfil.ciudad}
                    </p>
                  )}
                </Card.Body>
                <Nav variant="pills" className="flex-column p-2">
                  <Nav.Item><Nav.Link eventKey="perfil">👤 Mis datos</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="publicaciones">📦 Mis publicaciones</Nav.Link></Nav.Item>
                </Nav>
              </Card>
            </Col>

            {/* ── Contenido ── */}
            <Col md={9}>
              <Tab.Content>
                {/* Tab: Perfil */}
                <Tab.Pane eventKey="perfil">
                  <Card className={styles.contenidoCard}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <strong>Información personal</strong>
                      {!editando && (
                        <Button size="sm" variant="outline-success" onClick={() => setEditando(true)}>
                          ✏️ Editar
                        </Button>
                      )}
                    </Card.Header>
                    <Card.Body>
                      {mensajePerfil && (
                        <Alert variant={mensajePerfil.tipo} onClose={() => setMensajePerfil(null)} dismissible>
                          {mensajePerfil.texto}
                        </Alert>
                      )}

                      {!perfil ? (
                        <div className="text-center py-4"><Spinner variant="success" /></div>
                      ) : editando ? (
                        <Form onSubmit={guardarPerfil}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                  value={formPerfil.nombre}
                                  onChange={(e) => setFormPerfil((p) => ({ ...p, nombre: e.target.value }))}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                  value={formPerfil.apellido}
                                  onChange={(e) => setFormPerfil((p) => ({ ...p, apellido: e.target.value }))}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                  value={formPerfil.telefono}
                                  onChange={(e) => setFormPerfil((p) => ({ ...p, telefono: e.target.value }))}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Ciudad</Form.Label>
                                <Form.Control
                                  value={formPerfil.ciudad}
                                  onChange={(e) => setFormPerfil((p) => ({ ...p, ciudad: e.target.value }))}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex gap-2">
                            <Button type="submit" variant="success" disabled={guardandoPerfil}>
                              {guardandoPerfil ? <Spinner size="sm" /> : "Guardar cambios"}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => setEditando(false)}>
                              Cancelar
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <div className={styles.datosList}>
                          {[
                            ["📧 Correo",   perfil.correo],
                            ["👤 Nombre",   `${perfil.nombre} ${perfil.apellido}`],
                            ["📞 Teléfono", perfil.telefono || "—"],
                            ["📍 Ciudad",   perfil.ciudad   || "—"],
                            ["📅 Registro", new Date(perfil.fecha_registro).toLocaleDateString("es-CO", { year: "numeric", month: "long" })],
                          ].map(([label, valor]) => (
                            <div key={label} className={styles.datoFila}>
                              <span className={styles.datoLabel}>{label}</span>
                              <span className={styles.datoValor}>{valor}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Tab: Publicaciones */}
                <Tab.Pane eventKey="publicaciones">
                  <Card className={styles.contenidoCard}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <strong>Mis publicaciones ({publicaciones.length})</strong>
                      <Button size="sm" variant="success" href="/publicar">+ Nueva</Button>
                    </Card.Header>
                    <Card.Body>
                      {cargandoPub ? (
                        <div className="text-center py-4"><Spinner variant="success" /></div>
                      ) : publicaciones.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                          <p>Aún no tienes publicaciones.</p>
                          <Button variant="success" href="/publicar">Publicar mi primer artículo</Button>
                        </div>
                      ) : (
                        publicaciones.map((pub) => (
                          <div key={pub.id} className={styles.pubFila}>
                            <div className={styles.pubInfo}>
                              <strong>{pub.titulo}</strong>
                              <div className="mt-1">
                                <Badge bg={colorEstado(pub.estado)} className="me-1">{pub.estado}</Badge>
                                <Badge bg="secondary" className="me-1">{pub.categoria}</Badge>
                                <Badge bg={pub.activo ? "success" : "secondary"}>
                                  {pub.activo ? "Activo" : "Inactivo"}
                                </Badge>
                              </div>
                              <small className="text-muted">
                                💰 ${Number(pub.precio).toLocaleString("es-CO")} · 👁️ {pub.visitas} visitas
                              </small>
                            </div>
                            <div className={styles.pubAcciones}>
                              <Button
                                size="sm" variant="outline-primary"
                                onClick={() => abrirEditar(pub)}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant={pub.activo ? "outline-warning" : "outline-success"}
                                onClick={() => cambiarEstadoPublicacion(pub.id, pub.activo ? 0 : 1)}
                              >
                                {pub.activo ? "Pausar" : "Activar"}
                              </Button>
                              <Button
                                size="sm" variant="outline-danger"
                                onClick={() => setModalEliminar(pub.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      {/* ── Modal confirmar eliminar ── */}
      <Modal show={modalEliminar !== null} onHide={() => setModalEliminar(null)} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar eliminación</Modal.Title></Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalEliminar(null)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminarPublicacion} disabled={eliminando}>
            {eliminando ? <Spinner size="sm" /> : "Sí, eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal editar producto ── */}
      <Modal show={modalEditar !== null} onHide={() => setModalEditar(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cargandoEditar ? (
            <div className="text-center py-4"><Spinner variant="success" /></div>
          ) : (
            <Form id="formEditar" onSubmit={guardarEdicion}>
              {errorEdicion && <Alert variant="danger">{errorEdicion}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>Título *</Form.Label>
                <Form.Control
                  value={formEditar.titulo || ""}
                  onChange={(e) => setFormEditar((p) => ({ ...p, titulo: e.target.value }))}
                  maxLength={200} required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea" rows={3}
                  value={formEditar.descripcion || ""}
                  onChange={(e) => setFormEditar((p) => ({ ...p, descripcion: e.target.value }))}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio (COP) *</Form.Label>
                    <Form.Control
                      type="number" min={0}
                      value={formEditar.precio || ""}
                      onChange={(e) => setFormEditar((p) => ({ ...p, precio: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado *</Form.Label>
                    <Form.Select
                      value={formEditar.estado || "Bueno"}
                      onChange={(e) => setFormEditar((p) => ({ ...p, estado: e.target.value }))}
                    >
                      {ESTADOS_PROD.map((e) => <option key={e}>{e}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      value={formEditar.categoria_id || ""}
                      onChange={(e) => setFormEditar((p) => ({ ...p, categoria_id: e.target.value }))}
                    >
                      <option value="">Sin categoría</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.icon} {c.nombre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad *</Form.Label>
                    <Form.Control
                      value={formEditar.ciudad || ""}
                      onChange={(e) => setFormEditar((p) => ({ ...p, ciudad: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalEditar(null)}>Cancelar</Button>
          <Button
            type="submit" form="formEditar" variant="success"
            disabled={guardandoEdicion || cargandoEditar}
          >
            {guardandoEdicion ? <Spinner size="sm" /> : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default Dashboard;
