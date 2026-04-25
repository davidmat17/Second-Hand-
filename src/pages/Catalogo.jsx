// Catálogo de productos con buscador y filtros
import { useState, useMemo } from "react";
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
} from "react-bootstrap";
import styles from "../styles/Catalogo.module.css";

// Productos simulados (en Fase 4 vendrán del servidor)
const PRODUCTOS_MOCK = [
  {
    id: 1,
    nombre: "iPhone 13 Pro",
    precio: 1800000,
    estado: "Como nuevo",
    categoria: "Electronica",
    img: "https://placehold.co/300x200?text=iPhone+13",
    vendedor: "Carlos M.",
    ciudad: "Bogotá",
  },
  {
    id: 2,
    nombre: "Bicicleta MTB Trek",
    precio: 650000,
    estado: "Bueno",
    categoria: "Deportes",
    img: "https://placehold.co/300x200?text=Bicicleta",
    vendedor: "Laura G.",
    ciudad: "Medellín",
  },
  {
    id: 3,
    nombre: "Sofá 3 puestos",
    precio: 480000,
    estado: "Regular",
    categoria: "Hogar",
    img: "https://placehold.co/300x200?text=Sofa",
    vendedor: "Pedro R.",
    ciudad: "Cali",
  },
  {
    id: 4,
    nombre: "Laptop Dell i5",
    precio: 1200000,
    estado: "Como nuevo",
    categoria: "Electronica",
    img: "https://placehold.co/300x200?text=Laptop",
    vendedor: "Ana T.",
    ciudad: "Bogotá",
  },
  {
    id: 5,
    nombre: "Raqueta de tenis",
    precio: 90000,
    estado: "Bueno",
    categoria: "Deportes",
    img: "https://placehold.co/300x200?text=Raqueta",
    vendedor: "Juan S.",
    ciudad: "Barranquilla",
  },
  {
    id: 6,
    nombre: "Cámara Canon T7",
    precio: 750000,
    estado: "Como nuevo",
    categoria: "Electronica",
    img: "https://placehold.co/300x200?text=Camara",
    vendedor: "María L.",
    ciudad: "Bogotá",
  },
  {
    id: 7,
    nombre: "Vestido de fiesta",
    precio: 85000,
    estado: "Como nuevo",
    categoria: "Ropa",
    img: "https://placehold.co/300x200?text=Vestido",
    vendedor: "Sofía V.",
    ciudad: "Medellín",
  },
  {
    id: 8,
    nombre: "Mesa de comedor",
    precio: 320000,
    estado: "Bueno",
    categoria: "Hogar",
    img: "https://placehold.co/300x200?text=Mesa",
    vendedor: "Roberto C.",
    ciudad: "Cali",
  },
  {
    id: 9,
    nombre: "Chaqueta cuero",
    precio: 150000,
    estado: "Bueno",
    categoria: "Ropa",
    img: "https://placehold.co/300x200?text=Chaqueta",
    vendedor: "Diego A.",
    ciudad: "Bogotá",
  },
  {
    id: 10,
    nombre: "PlayStation 4",
    precio: 900000,
    estado: "Como nuevo",
    categoria: "Electronica",
    img: "https://placehold.co/300x200?text=PS4",
    vendedor: "Felipe M.",
    ciudad: "Bucaramanga",
  },
  {
    id: 11,
    nombre: "Libro Clean Code",
    precio: 35000,
    estado: "Bueno",
    categoria: "Libros",
    img: "https://placehold.co/300x200?text=Libro",
    vendedor: "Valentina R.",
    ciudad: "Bogotá",
  },
  {
    id: 12,
    nombre: "Moto Honda 125cc",
    precio: 4500000,
    estado: "Bueno",
    categoria: "Vehiculos",
    img: "https://placehold.co/300x200?text=Moto",
    vendedor: "Camilo J.",
    ciudad: "Medellín",
  },
];

const CATEGORIAS = [
  "Todas",
  "Electronica",
  "Ropa",
  "Hogar",
  "Deportes",
  "Vehiculos",
  "Libros",
];
const ESTADOS = ["Todos", "Como nuevo", "Bueno", "Regular"];
const PRECIOS = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Menos de $100.000", min: 0, max: 100000 },
  { label: "$100k – $500k", min: 100000, max: 500000 },
  { label: "$500k – $1.500k", min: 500000, max: 1500000 },
  { label: "Más de $1.500k", min: 1500000, max: Infinity },
];

function colorEstado(estado) {
  if (estado === "Como nuevo") return "success";
  if (estado === "Bueno") return "primary";
  return "warning";
}

function Catalogo() {
  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [rangoPrecio, setRangoPrecio] = useState(0); // índice en PRECIOS

  // Modal de detalle
  const [productoModal, setProductoModal] = useState(null);

  // Filtrado reactivo con useMemo para no recalcular innecesariamente
  const productosFiltrados = useMemo(() => {
    const rango = PRECIOS[rangoPrecio];
    return PRODUCTOS_MOCK.filter((p) => {
      const coincideBusqueda = p.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideCategoria =
        categoria === "Todas" || p.categoria === categoria;
      const coincideEstado = estado === "Todos" || p.estado === estado;
      const coincidePrecio = p.precio >= rango.min && p.precio <= rango.max;
      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideEstado &&
        coincidePrecio
      );
    });
  }, [busqueda, categoria, estado, rangoPrecio]);

  function limpiarFiltros() {
    setBusqueda("");
    setCategoria("Todas");
    setEstado("Todos");
    setRangoPrecio(0);
  }

  return (
    <main className={styles.pagina}>
      <Container>
        {/* ── Encabezado ── */}
        <div className={styles.encabezado}>
          <h1 className={styles.titulo}>Catálogo de productos</h1>
          <p className="text-muted">
            {productosFiltrados.length} producto
            {productosFiltrados.length !== 1 ? "s" : ""} encontrado
            {productosFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Row className="g-4">
          {/* ── Panel de filtros (columna izquierda) ── */}
          <Col xs={12} md={3}>
            <div className={styles.panelFiltros}>
              <h5 className={styles.filtrosTitulo}>🔍 Filtros</h5>

              {/* Buscador */}
              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>Buscar</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ej: iPhone, bicicleta..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setBusqueda("")}
                    >
                      ✕
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>

              {/* Categoría */}
              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>
                  Categoría
                </Form.Label>
                <Form.Select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Estado */}
              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>Estado</Form.Label>
                <Form.Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  {ESTADOS.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Rango de precio */}
              <Form.Group className="mb-3">
                <Form.Label className={styles.labelFiltro}>
                  Precio: <strong>{PRECIOS[rangoPrecio].label}</strong>
                </Form.Label>
                <Form.Range
                  min={0}
                  max={PRECIOS.length - 1}
                  step={1}
                  value={rangoPrecio}
                  onChange={(e) => setRangoPrecio(Number(e.target.value))}
                />
              </Form.Group>

              <Button
                variant="outline-danger"
                size="sm"
                className="w-100"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </Button>
            </div>
          </Col>

          {/* ── Grid de productos (columna derecha) ── */}
          <Col xs={12} md={9}>
            {productosFiltrados.length === 0 ? (
              <div className={styles.sinResultados}>
                <p>😕 No se encontraron productos con esos filtros.</p>
                <Button variant="success" onClick={limpiarFiltros}>
                  Ver todos
                </Button>
              </div>
            ) : (
              <Row xs={1} sm={2} lg={3} className="g-3">
                {productosFiltrados.map((prod) => (
                  <Col key={prod.id}>
                    <Card className={`h-100 ${styles.cardProducto}`}>
                      <Card.Img
                        variant="top"
                        src={prod.img}
                        alt={prod.nombre}
                        className={styles.cardImg}
                      />
                      <Card.Body className="d-flex flex-column">
                        <div className="mb-1">
                          <Badge bg={colorEstado(prod.estado)} className="me-1">
                            {prod.estado}
                          </Badge>
                          <Badge
                            bg="secondary"
                            className={styles.badgeCategoria}
                          >
                            {prod.categoria}
                          </Badge>
                        </div>
                        <Card.Title className={styles.cardTitulo}>
                          {prod.nombre}
                        </Card.Title>
                        <p className={styles.cardPrecio}>
                          ${prod.precio.toLocaleString("es-CO")}
                        </p>
                        <p className={styles.cardVendedor}>
                          👤 {prod.vendedor} · 📍 {prod.ciudad}
                        </p>
                        <Button
                          variant="success"
                          size="sm"
                          className="mt-auto w-100"
                          onClick={() => setProductoModal(prod)}
                        >
                          Ver detalles
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      {/* ── Modal detalle del producto ── */}
      <Modal
        show={productoModal !== null}
        onHide={() => setProductoModal(null)}
        centered
        size="lg"
      >
        {productoModal && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{productoModal.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <img
                    src={productoModal.img}
                    alt={productoModal.nombre}
                    className="w-100 rounded mb-3"
                  />
                </Col>
                <Col md={6}>
                  <p>
                    <Badge bg={colorEstado(productoModal.estado)}>
                      {productoModal.estado}
                    </Badge>{" "}
                    <Badge bg="secondary">{productoModal.categoria}</Badge>
                  </p>
                  <h3 className={styles.precioModal}>
                    ${productoModal.precio.toLocaleString("es-CO")} COP
                  </h3>
                  <p>
                    📍 <strong>Ciudad:</strong> {productoModal.ciudad}
                  </p>
                  <p>
                    👤 <strong>Vendedor:</strong> {productoModal.vendedor}
                  </p>
                  <p className="text-muted">
                    Artículo en condición{" "}
                    <strong>{productoModal.estado.toLowerCase()}</strong>.
                    Contáctate con el vendedor para coordinar entrega y pago.
                  </p>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setProductoModal(null)}
              >
                Cerrar
              </Button>
              <Button variant="success">💬 Contactar vendedor</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
}

export default Catalogo;
