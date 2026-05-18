import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Pagination,
} from "react-bootstrap";
import styles from "../styles/Catalogo.module.css";

const ESTADOS = ["Todos", "Como nuevo", "Bueno", "Regular", "Para reparar"];
const PRECIOS = [
  { label: "Todos",           min: "",       max: ""       },
  { label: "< $100.000",      min: "",       max: 100000   },
  { label: "$100k – $500k",   min: 100000,   max: 500000   },
  { label: "$500k – $1.500k", min: 500000,   max: 1500000  },
  { label: "> $1.500k",       min: 1500000,  max: ""       },
];

function colorEstado(estado) {
  if (estado === "Como nuevo") return "success";
  if (estado === "Bueno") return "primary";
  return "warning";
}

function imgSrc(prod) {
  if (prod.imagen_principal) return prod.imagen_principal;
  return `https://placehold.co/300x200?text=${encodeURIComponent(prod.titulo)}`;
}

function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros
  const [busqueda, setBusqueda]     = useState(searchParams.get("busqueda") || "");
  const [categoria, setCategoria]   = useState(searchParams.get("categoria") || "");
  const [estado, setEstado]         = useState("Todos");
  const [rangoPrecio, setRangoPrecio] = useState(0);
  const [pagina, setPagina]         = useState(1);

  // Datos
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos]   = useState([]);
  const [total, setTotal]           = useState(0);
  const [cargando, setCargando]     = useState(true);

  // Modal
  const [productoModal, setProductoModal] = useState(null);
  const [detalleModal, setDetalleModal]   = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const LIMIT = 12;

  // Cargar categorías una sola vez
  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias)
      .catch(() => {});
  }, []);

  // Cargar productos cuando cambian los filtros
  const cargarProductos = useCallback(() => {
    setCargando(true);
    const rango = PRECIOS[rangoPrecio];
    const params = new URLSearchParams();
    if (busqueda)     params.set("busqueda",    busqueda);
    if (categoria) {
      // Buscar id de la categoría seleccionada
      const cat = categorias.find(
        (c) => c.nombre.toLowerCase() === categoria.toLowerCase()
      );
      if (cat) params.set("categoria_id", cat.id);
    }
    if (estado !== "Todos") params.set("estado", estado);
    if (rango.min !== "") params.set("precio_min", rango.min);
    if (rango.max !== "") params.set("precio_max", rango.max);
    params.set("page",  pagina);
    params.set("limit", LIMIT);

    fetch(`/api/productos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProductos(data.productos || []);
        setTotal(data.total || 0);
      })
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }, [busqueda, categoria, estado, rangoPrecio, pagina, categorias]);

  useEffect(() => {
    if (categorias.length > 0 || categoria === "") cargarProductos();
  }, [cargarProductos, categorias.length, categoria]);

  function limpiarFiltros() {
    setBusqueda("");
    setCategoria("");
    setEstado("Todos");
    setRangoPrecio(0);
    setPagina(1);
    setSearchParams({});
  }

  function abrirDetalle(prod) {
    setProductoModal(prod);
    setCargandoDetalle(true);
    fetch(`/api/productos/${prod.id}`)
      .then((r) => r.json())
      .then(setDetalleModal)
      .catch(() => setDetalleModal(prod))
      .finally(() => setCargandoDetalle(false));
  }

  const totalPaginas = Math.ceil(total / LIMIT);

  return (
    <main className={styles.pagina}>
      <Container>
        <div className={styles.encabezado}>
          <h1 className={styles.titulo}>Catálogo de productos</h1>
          <p className="text-muted">
            {cargando ? "Buscando..." : `${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>
        </div>

        <Row className="g-4">
          {/* ── Panel de filtros ── */}
          <Col xs={12} md={3}>
            <div className={styles.panelFiltros}>
              <h5 className={styles.filtrosTitulo}>🔍 Filtros</h5>

              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>Buscar</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ej: iPhone, bicicleta..."
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                  />
                  {busqueda && (
                    <Button variant="outline-secondary" onClick={() => setBusqueda("")}>✕</Button>
                  )}
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>Categoría</Form.Label>
                <Form.Select value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1); }}>
                  <option value="">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.nombre}>{c.icon} {c.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>Estado</Form.Label>
                <Form.Select value={estado} onChange={(e) => { setEstado(e.target.value); setPagina(1); }}>
                  {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>
                  Precio: <strong>{PRECIOS[rangoPrecio].label}</strong>
                </Form.Label>
                <Form.Range
                  min={0} max={PRECIOS.length - 1} step={1}
                  value={rangoPrecio}
                  onChange={(e) => { setRangoPrecio(Number(e.target.value)); setPagina(1); }}
                />
              </Form.Group>

              <Button variant="outline-danger" size="sm" className="w-100" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            </div>
          </Col>

          {/* ── Grid de productos ── */}
          <Col xs={12} md={9}>
            {cargando ? (
              <div className="text-center py-5"><Spinner variant="success" /></div>
            ) : productos.length === 0 ? (
              <div className={styles.sinResultados}>
                <p>😕 No se encontraron productos con esos filtros.</p>
                <Button variant="success" onClick={limpiarFiltros}>Ver todos</Button>
              </div>
            ) : (
              <>
                <Row xs={1} sm={2} lg={3} className="g-3">
                  {productos.map((prod) => (
                    <Col key={prod.id}>
                      <Card className={`h-100 ${styles.cardProducto}`}>
                        <Card.Img
                          variant="top"
                          src={imgSrc(prod)}
                          alt={prod.titulo}
                          className={styles.cardImg}
                        />
                        <Card.Body className="d-flex flex-column">
                          <div className="mb-1">
                            <Badge bg={colorEstado(prod.estado)} className="me-1">{prod.estado}</Badge>
                            <Badge bg="secondary" className={styles.badgeCategoria}>
                              {prod.categoria_icon} {prod.categoria}
                            </Badge>
                          </div>
                          <Card.Title className={styles.cardTitulo}>{prod.titulo}</Card.Title>
                          <p className={styles.cardPrecio}>
                            ${Number(prod.precio).toLocaleString("es-CO")}
                          </p>
                          <p className={styles.cardVendedor}>
                            👤 {prod.vendedor_nombre} · 📍 {prod.ciudad}
                          </p>
                          <Button
                            variant="success" size="sm" className="mt-auto w-100"
                            onClick={() => abrirDetalle(prod)}
                          >
                            Ver detalles
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.Prev disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} />
                      {[...Array(totalPaginas)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1} active={pagina === i + 1}
                          onClick={() => setPagina(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next disabled={pagina === totalPaginas} onClick={() => setPagina(p => p + 1)} />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* ── Modal de detalle ── */}
      <Modal
        show={productoModal !== null}
        onHide={() => { setProductoModal(null); setDetalleModal(null); }}
        centered size="lg"
      >
        {productoModal && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{productoModal.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {cargandoDetalle ? (
                <div className="text-center py-4"><Spinner variant="success" /></div>
              ) : (
                <Row>
                  <Col md={6}>
                    <img
                      src={imgSrc(detalleModal || productoModal)}
                      alt={productoModal.titulo}
                      className="w-100 rounded mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <p>
                      <Badge bg={colorEstado(productoModal.estado)}>{productoModal.estado}</Badge>{" "}
                      <Badge bg="secondary">{productoModal.categoria_icon} {productoModal.categoria}</Badge>
                    </p>
                    <h3 className={styles.precioModal}>
                      ${Number(productoModal.precio).toLocaleString("es-CO")} COP
                    </h3>
                    {detalleModal?.descripcion && (
                      <p className="text-muted mb-2">{detalleModal.descripcion}</p>
                    )}
                    <p>📍 <strong>Ciudad:</strong> {productoModal.ciudad}</p>
                    <p>👤 <strong>Vendedor:</strong> {productoModal.vendedor_nombre} {detalleModal?.vendedor_apellido}</p>
                    {detalleModal?.vendedor_telefono && (
                      <p>📞 <strong>Teléfono:</strong> {detalleModal.vendedor_telefono}</p>
                    )}
                    {detalleModal?.vendedor_correo && (
                      <p>📧 <strong>Correo:</strong>{" "}
                        <a href={`mailto:${detalleModal.vendedor_correo}`}>{detalleModal.vendedor_correo}</a>
                      </p>
                    )}
                    <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                      👁️ {detalleModal?.visitas || productoModal.visitas || 0} visitas
                    </p>
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setProductoModal(null); setDetalleModal(null); }}>
                Cerrar
              </Button>
              {detalleModal?.vendedor_correo && (
                <Button variant="success" href={`mailto:${detalleModal.vendedor_correo}`}>
                  💬 Contactar vendedor
                </Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
}

export default Catalogo;
