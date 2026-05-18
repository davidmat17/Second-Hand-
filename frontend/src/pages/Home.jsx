import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Spinner,
} from "react-bootstrap";
import styles from "../styles/Home.module.css";

const CATEGORIAS = [
  { img: "/categorias/electronica.jpeg", nombre: "Electronica", desc: "Celulares, computadores, tablets y más." },
  { img: "/categorias/ropa.jpg",         nombre: "Ropa",        desc: "Moda para hombre, mujer y niños."        },
  { img: "/categorias/hogar.png",        nombre: "Hogar",       desc: "Muebles, electrodomésticos y decoración." },
  { img: "/categorias/deportes.jpg",     nombre: "Deportes",    desc: "Equipos y accesorios deportivos."         },
  { img: "/categorias/vehiculos.jpeg",   nombre: "Vehiculos",   desc: "Carros, motos y repuestos."               },
  { img: "/categorias/libros.jpg",       nombre: "Libros",      desc: "Textos, novelas y revistas usadas."       },
];

function colorEstado(estado) {
  if (estado === "Como nuevo") return "success";
  if (estado === "Bueno") return "primary";
  return "warning";
}

function imgSrc(producto) {
  if (producto.imagen_principal) return producto.imagen_principal;
  return `https://placehold.co/300x200?text=${encodeURIComponent(producto.titulo)}`;
}

const popoverInfo = (
  <Popover>
    <Popover.Header>¿Cómo funciona?</Popover.Header>
    <Popover.Body>
      Regístrate, publica tu artículo con fotos y precio, y empieza a recibir ofertas de compradores.
    </Popover.Body>
  </Popover>
);

const CATEGORIAS_RAPIDAS = [
  { label: "📱 Electrónica", valor: "Electronica" },
  { label: "👕 Ropa",        valor: "Ropa"        },
  { label: "🏠 Hogar",       valor: "Hogar"       },
  { label: "⚽ Deportes",    valor: "Deportes"    },
  { label: "🚗 Vehículos",   valor: "Vehiculos"   },
  { label: "📚 Libros",      valor: "Libros"      },
];

function Home() {
  const navigate = useNavigate();
  const [productoModal, setProductoModal] = useState(null);
  const [verMas, setVerMas] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  function handleBuscar(e) {
    e.preventDefault();
    const q = textoBusqueda.trim();
    if (q) navigate(`/catalogo?busqueda=${encodeURIComponent(q)}`);
  }

  function handleCategoriaRapida(valor) {
    navigate(`/catalogo?categoria=${encodeURIComponent(valor)}`);
  }

  useEffect(() => {
    fetch("/api/productos/destacados")
      .then((r) => r.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main>
      {/* ── CARRUSEL ── */}
      <Carousel fade className={styles.carrusel}>
        <Carousel.Item>
          <div className={`${styles.slideUno} ${styles.slide}`}>
            <Carousel.Caption>
              <h1 className={styles.slidetitulo}>Compra lo que necesitas</h1>
              <p>Miles de artículos usados a precios increíbles</p>
              <Button variant="warning" size="lg" as={Link} to="/catalogo">
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
              <Button variant="success" size="lg" as={Link} to="/publicar">
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
              <Button variant="info" size="lg" as={Link} to="/catalogo">
                Conoce más
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* ── BUSCADOR RÁPIDO ── */}
      <section className={styles.seccionBuscador}>
        <Container>
          <p className={styles.buscadorSubtitulo}>¿Qué estás buscando hoy?</p>
          <form onSubmit={handleBuscar} className={styles.buscadorForm}>
            <input
              type="text"
              className={styles.buscadorInput}
              placeholder="Ej: bicicleta, celular Samsung, silla..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
            />
            <button type="submit" className={styles.buscadorBtn}>
              🔍 Buscar
            </button>
          </form>
          <div className={styles.categoriasRapidas}>
            {CATEGORIAS_RAPIDAS.map((cat) => (
              <button
                key={cat.valor}
                className={styles.chipCategoria}
                onClick={() => handleCategoriaRapida(cat.valor)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* ── INTRO ── */}
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <p className={`${styles.introTexto} texto-decorado`}>
              Second Hand es la plataforma colombiana donde compradores y vendedores se encuentran
              para darle una nueva vida a los objetos. Encuentra lo que buscas a precios increíbles
              o vende lo que ya no necesitas de forma rápida y segura.
            </p>
            <Button variant="outline-success" size="sm" onClick={() => setVerMas(!verMas)} className="mt-2">
              {verMas ? "Ver menos ▲" : "Ver más ▼"}
            </Button>
            <Collapse in={verMas}>
              <div className={styles.masInfo}>
                <p className="mt-3">
                  Somos un proyecto académico desarrollado por estudiantes de Programación en la
                  Web — Grupo B1. Nuestra plataforma usa React, Node.js y MySQL para ofrecer una
                  experiencia de compraventa moderna y segura.
                </p>
                <OverlayTrigger trigger="click" placement="top" overlay={popoverInfo}>
                  <Button variant="link" size="sm">¿Cómo funciona? ℹ️</Button>
                </OverlayTrigger>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Container>

      {/* ── CATEGORÍAS ── */}
      <section className={styles.seccionCategorias}>
        <Container>
          <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>Explora por categoría</h2>
          <Row xs={2} sm={3} md={3} lg={6} className="g-3">
            {CATEGORIAS.map((cat) => (
              <Col key={cat.nombre}>
                <Link to={`/catalogo?categoria=${cat.nombre}`} style={{ textDecoration: "none" }}>
                  <Card className={`text-center h-100 ${styles.cardCategoria}`}>
                    <div className={styles.categoriaImgWrap}>
                      <img src={cat.img} alt={cat.nombre} className={styles.categoriaImg} />
                    </div>
                    <Card.Body className="pt-2 pb-3">
                      <Card.Title className={styles.categoriaNombre}>{cat.nombre}</Card.Title>
                      <Card.Text className={styles.categoriaDesc}>{cat.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <Container className="my-5">
        <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>Productos destacados</h2>
        {cargando ? (
          <div className="text-center py-5">
            <Spinner variant="success" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} className="g-4">
            {productos.map((prod) => (
              <Col key={prod.id}>
                <Card className={`h-100 ${styles.cardProducto}`}>
                  <Card.Img variant="top" src={imgSrc(prod)} alt={prod.titulo} />
                  <Card.Body>
                    <Badge bg={colorEstado(prod.estado)} className="mb-2">{prod.estado}</Badge>
                    <Card.Title>{prod.titulo}</Card.Title>
                    <Card.Text className={styles.precio}>
                      ${Number(prod.precio).toLocaleString("es-CO")}
                    </Card.Text>
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
        )}
        <div className="text-center mt-4">
          <Button variant="outline-success" as={Link} to="/catalogo">
            Ver todos los productos →
          </Button>
        </div>
      </Container>

      {/* ── VIDEO ── */}
      <section className={styles.seccionVideo}>
        <Container>
          <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>¿Cómo funciona Second Hand?</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className={styles.videoWrapper}>
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

      {/* ── FAQ ── */}
      <Container className="my-5">
        <h2 className={`text-center mb-4 ${styles.tituloSeccion}`}>Preguntas frecuentes</h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>¿Cómo publico un producto?</Accordion.Header>
                <Accordion.Body>
                  Regístrate o inicia sesión, haz clic en <strong>Publicar</strong> en el menú,
                  completa el formulario con fotos, descripción y precio, y tu artículo estará
                  visible en minutos.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>¿Es gratis publicar?</Accordion.Header>
                <Accordion.Body>
                  Sí, publicar en Second Hand es completamente gratuito.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>¿Cómo me pagan?</Accordion.Header>
                <Accordion.Body>
                  Los pagos se coordinan directamente entre comprador y vendedor.
                  Próximamente integraremos pasarelas de pago seguras.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>¿Qué hago si hay un problema con mi compra?</Accordion.Header>
                <Accordion.Body>
                  Contáctanos a través del formulario de soporte o escríbenos por el sistema de
                  mensajería interna de la plataforma.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>

      {/* ── MODAL DETALLE ── */}
      <Modal show={productoModal !== null} onHide={() => setProductoModal(null)} centered>
        {productoModal && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{productoModal.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img src={imgSrc(productoModal)} alt={productoModal.titulo} className="w-100 mb-3 rounded" />
              <p>
                <strong>Estado:</strong>{" "}
                <Badge bg={colorEstado(productoModal.estado)}>{productoModal.estado}</Badge>
              </p>
              <p className={styles.precioModal}>
                ${Number(productoModal.precio).toLocaleString("es-CO")} COP
              </p>
              <p className="text-muted">
                Artículo en condición <strong>{productoModal.estado.toLowerCase()}</strong>.
                Contáctate con el vendedor para coordinar entrega y pago.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setProductoModal(null)}>Cerrar</Button>
              <Button variant="success" as={Link} to="/catalogo" onClick={() => setProductoModal(null)}>
                Ver en catálogo
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
}

export default Home;
