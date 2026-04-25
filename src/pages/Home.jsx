// Página de inicio de Second Hand
// Incluye: carrusel, sección 3 columnas, acordeón, modal, efectos Bootstrap
import { useState } from "react";
import {
  Carousel,
  Container,
  Row,
  Col,
  Card,
  Button,
  Accordion,
  Modal,
  Badge,
  OverlayTrigger,
  Popover,
  Collapse,
} from "react-bootstrap";
import styles from "../styles/Home.module.css";

// Datos de categorías para las 3 columnas
const CATEGORIAS = [
  {
    icon: "📱",
    nombre: "Electrónica",
    desc: "Celulares, computadores, tablets y más.",
    color: "#0d6efd",
  },
  {
    icon: "👗",
    nombre: "Ropa",
    desc: "Moda para hombre, mujer y niños.",
    color: "#6f42c1",
  },
  {
    icon: "🏠",
    nombre: "Hogar",
    desc: "Muebles, electrodomésticos y decoración.",
    color: "#fd7e14",
  },
  {
    icon: "⚽",
    nombre: "Deportes",
    desc: "Equipos y accesorios deportivos.",
    color: "#198754",
  },
  {
    icon: "🚗",
    nombre: "Vehículos",
    desc: "Carros, motos y repuestos.",
    color: "#dc3545",
  },
  {
    icon: "📚",
    nombre: "Libros",
    desc: "Textos, novelas y revistas usadas.",
    color: "#20c997",
  },
];

// Productos destacados simulados
const PRODUCTOS = [
  {
    id: 1,
    nombre: "iPhone 13 Pro",
    precio: 1800000,
    estado: "Como nuevo",
    img: "https://placehold.co/300x200?text=iPhone+13",
  },
  {
    id: 2,
    nombre: "Bicicleta MTB",
    precio: 650000,
    estado: "Bueno",
    img: "https://placehold.co/300x200?text=Bicicleta",
  },
  {
    id: 3,
    nombre: "Sofá 3 puestos",
    precio: 480000,
    estado: "Regular",
    img: "https://placehold.co/300x200?text=Sofa",
  },
  {
    id: 4,
    nombre: "Laptop Dell i5",
    precio: 1200000,
    estado: "Como nuevo",
    img: "https://placehold.co/300x200?text=Laptop",
  },
  {
    id: 5,
    nombre: "Raqueta de tenis",
    precio: 90000,
    estado: "Bueno",
    img: "https://placehold.co/300x200?text=Raqueta",
  },
  {
    id: 6,
    nombre: "Cámara Canon",
    precio: 750000,
    estado: "Como nuevo",
    img: "https://placehold.co/300x200?text=Camara",
  },
];

// Color del badge según estado
function colorEstado(estado) {
  if (estado === "Como nuevo") return "success";
  if (estado === "Bueno") return "primary";
  return "warning";
}

// Popover reutilizable
const popoverInfo = (
  <Popover>
    <Popover.Header>¿Cómo funciona?</Popover.Header>
    <Popover.Body>
      Regístrate, publica tu artículo con fotos y precio, y empieza a recibir
      ofertas de compradores.
    </Popover.Body>
  </Popover>
);

function Home() {
  // Estado para el modal de producto
  const [productoModal, setProductoModal] = useState(null);
  // Estado para el collapse de "más información"
  const [verMas, setVerMas] = useState(false);

  return (
    <main>
      {/* ── CARRUSEL ─────────────────────────────────────────── */}
      <Carousel fade className={styles.carrusel}>
        <Carousel.Item>
          <div className={`${styles.slideUno} ${styles.slide}`}>
            <Carousel.Caption>
              <h1 className={styles.slidetitulo}>Compra lo que necesitas</h1>
              <p>Miles de artículos usados a precios increíbles</p>
              <Button variant="warning" size="lg" href="/catalogo">
                Explorar catálogo
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={`${styles.slideDos} ${styles.slide}`}>
            <Carousel.Caption>
              <h1 className={styles.slidetitulo}>Vende lo que ya no usas</h1>
              <p>Publica gratis y llega a compradores en toda Colombia</p>
              <Button variant="success" size="lg" href="/publicar">
                Publicar ahora
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className={`${styles.slideTres} ${styles.slide}`}>
            <Carousel.Caption>
              <h1 className={styles.slidetitulo}>Economía circular</h1>
              <p>Dale una segunda vida a los objetos y cuida el planeta</p>
              <Button variant="info" size="lg">
                Conoce más
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* ── SECCIÓN INTRO (texto con primera letra grande) ───── */}
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <p className={`${styles.introTexto} texto-decorado`}>
              Second Hand es la plataforma colombiana donde compradores y
              vendedores se encuentran para darle una nueva vida a los objetos.
              Encuentra lo que buscas a precios increíbles o vende lo que ya no
              necesitas de forma rápida y segura.
            </p>
            {/* Botón COLLAPSE para "ver más" */}
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setVerMas(!verMas)}
              className="mt-2"
            >
              {verMas ? "Ver menos ▲" : "Ver más ▼"}
            </Button>
            <Collapse in={verMas}>
              <div className={styles.masInfo}>
                <p className="mt-3">
                  Somos un proyecto académico desarrollado por estudiantes de
                  Programación en la Web — Grupo B1. Nuestra plataforma aplica
                  tecnologías como React, Node.js y MySQL para ofrecer una
                  experiencia de compraventa moderna y segura.
                </p>
                {/* Popover informativo */}
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  overlay={popoverInfo}
                >
                  <Button variant="link" size="sm">
                    ¿Cómo funciona? ℹ️
                  </Button>
                </OverlayTrigger>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Container>

      {/* ── CATEGORÍAS — 3 columnas ───────────────────────────── */}
      <section className={styles.seccionCategorias}>
        <Container>
          <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>
            Explora por categoría
          </h2>
          <Row xs={2} sm={3} md={3} lg={6} className="g-3">
            {CATEGORIAS.map((cat, i) => (
              <Col key={i}>
                <Card
                  className={`text-center h-100 ${styles.cardCategoria}`}
                  style={{ borderTop: `4px solid ${cat.color}` }}
                >
                  <Card.Body>
                    <div className={styles.categoriaIcon}>{cat.icon}</div>
                    <Card.Title className={styles.categoriaNombre}>
                      {cat.nombre}
                    </Card.Title>
                    <Card.Text className={styles.categoriaDesc}>
                      {cat.desc}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── PRODUCTOS DESTACADOS — 3 columnas ────────────────── */}
      <Container className="my-5">
        <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>
          Productos destacados
        </h2>
        <Row xs={1} sm={2} md={3} className="g-4">
          {PRODUCTOS.map((prod) => (
            <Col key={prod.id}>
              <Card className={`h-100 ${styles.cardProducto}`}>
                <Card.Img variant="top" src={prod.img} alt={prod.nombre} />
                <Card.Body>
                  <Badge bg={colorEstado(prod.estado)} className="mb-2">
                    {prod.estado}
                  </Badge>
                  <Card.Title>{prod.nombre}</Card.Title>
                  <Card.Text className={styles.precio}>
                    ${prod.precio.toLocaleString("es-CO")}
                  </Card.Text>
                  {/* Abre modal con detalles del producto */}
                  <Button
                    variant="success"
                    size="sm"
                    className="w-100"
                    onClick={() => setProductoModal(prod)}
                  >
                    Ver detalles
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ── VIDEO PROMOCIONAL ─────────────────────────────────── */}
      <section className={styles.seccionVideo}>
        <Container>
          <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>
            ¿Cómo funciona Second Hand?
          </h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className={styles.videoWrapper}>
                {/* Video de YouTube embebido */}
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Cómo funciona Second Hand"
                  allowFullScreen
                  className={styles.video}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── ACORDEÓN — Preguntas frecuentes ──────────────────── */}
      <Container className="my-5">
        <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>
          Preguntas frecuentes
        </h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>¿Cómo publico un producto?</Accordion.Header>
                <Accordion.Body>
                  Regístrate o inicia sesión, haz clic en{" "}
                  <strong>Publicar</strong> en el menú, completa el formulario
                  con fotos, descripción y precio, y tu artículo estará visible
                  en minutos.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>¿Es gratis publicar?</Accordion.Header>
                <Accordion.Body>
                  Sí, publicar en Second Hand es completamente gratuito. Solo
                  pagas cuando concretas una venta exitosa.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>¿Cómo me pagan?</Accordion.Header>
                <Accordion.Body>
                  Los pagos se coordinan directamente entre comprador y
                  vendedor. Próximamente integraremos pasarelas de pago seguras.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  ¿Qué hago si hay un problema con mi compra?
                </Accordion.Header>
                <Accordion.Body>
                  Contáctanos a través del formulario de soporte o escríbenos
                  directamente por el sistema de mensajería interna de la
                  plataforma.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>

      {/* ── MODAL — Detalle del producto ─────────────────────── */}
      <Modal
        show={productoModal !== null}
        onHide={() => setProductoModal(null)}
        centered
      >
        {productoModal && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{productoModal.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={productoModal.img}
                alt={productoModal.nombre}
                className="w-100 mb-3 rounded"
              />
              <p>
                <strong>Estado:</strong>{" "}
                <Badge bg={colorEstado(productoModal.estado)}>
                  {productoModal.estado}
                </Badge>
              </p>
              <p className={styles.precioModal}>
                ${productoModal.precio.toLocaleString("es-CO")} COP
              </p>
              <p className="text-muted">
                Artículo en excelentes condiciones. Contáctate con el vendedor
                para coordinar entrega y método de pago.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setProductoModal(null)}
              >
                Cerrar
              </Button>
              <Button variant="success">Contactar vendedor</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
}

export default Home;
