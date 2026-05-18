import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Publicar.module.css";

const ESTADOS_PROD = ["Como nuevo", "Bueno", "Regular", "Para reparar"];

// CAPTCHA matemático
function generarCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { pregunta: `¿Cuánto es ${a} + ${b}?`, respuesta: String(a + b) };
}

function Publicar() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    estado: "Bueno",
    categoria_id: "",
    ciudad: "",
  });
  const [imagenes, setImagenes] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // URL[]
  const [captcha] = useState(generarCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Progreso del formulario (0-100)
  const camposRequeridos = ["titulo", "precio", "estado", "ciudad"];
  const completados = camposRequeridos.filter((k) => form[k] !== "").length;
  const progreso = Math.round((completados / camposRequeridos.length) * 100);

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias)
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImagenes(e) {
    const files = Array.from(e.target.files).slice(0, 5);
    setImagenes(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function quitarImagen(idx) {
    const nuevas = imagenes.filter((_, i) => i !== idx);
    setImagenes(nuevas);
    setPreviews(previews.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (captchaInput.trim() !== captcha.respuesta) {
      return setError("Respuesta del CAPTCHA incorrecta");
    }
    if (!form.titulo || !form.precio || !form.estado || !form.ciudad) {
      return setError("Completa todos los campos obligatorios");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
    imagenes.forEach((img) => formData.append("imagenes", img));

    setEnviando(true);
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al publicar");
      setExito(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <Container className="py-5 text-center">
        <div style={{ fontSize: "4rem" }}>✅</div>
        <h2 className="text-success mt-3">¡Producto publicado!</h2>
        <p className="text-muted">Redirigiendo a tu perfil...</p>
      </Container>
    );
  }

  return (
    <main className={styles.pagina}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <h1 className={styles.titulo}>Publicar artículo</h1>
            <p className="text-muted mb-4">
              Completa los datos de tu artículo. Los campos marcados con * son obligatorios.
            </p>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Progreso del formulario</small>
                <small className="text-muted">{progreso}%</small>
              </div>
              <ProgressBar
                now={progreso}
                variant={progreso < 50 ? "warning" : progreso < 100 ? "info" : "success"}
              />
            </div>

            <Card className={styles.card}>
              <Card.Body>
                {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* Título */}
                  <Form.Group className="mb-3">
                    <Form.Label>Título *</Form.Label>
                    <Form.Control
                      name="titulo" value={form.titulo} onChange={handleChange}
                      placeholder="Ej: iPhone 13 Pro en perfecto estado"
                      maxLength={200} required
                    />
                    <Form.Text className="text-muted">{form.titulo.length}/200 caracteres</Form.Text>
                  </Form.Group>

                  {/* Descripción */}
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea" rows={4} name="descripcion"
                      value={form.descripcion} onChange={handleChange}
                      placeholder="Describe el artículo: accesorios incluidos, tiempo de uso, razón de venta..."
                    />
                  </Form.Group>

                  <Row>
                    {/* Precio */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Precio (COP) *</Form.Label>
                        <Form.Control
                          type="number" name="precio" value={form.precio}
                          onChange={handleChange} min={0} placeholder="Ej: 500000" required
                        />
                      </Form.Group>
                    </Col>
                    {/* Estado */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estado *</Form.Label>
                        <Form.Select name="estado" value={form.estado} onChange={handleChange}>
                          {ESTADOS_PROD.map((e) => <option key={e}>{e}</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Categoría */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                          <option value="">Sin categoría</option>
                          {categorias.map((c) => (
                            <option key={c.id} value={c.id}>{c.icon} {c.nombre}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    {/* Ciudad */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ciudad *</Form.Label>
                        <Form.Control
                          name="ciudad" value={form.ciudad} onChange={handleChange}
                          placeholder="Ej: Bogotá" required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Imágenes */}
                  <Form.Group className="mb-3">
                    <Form.Label>Fotos (máx. 5 imágenes, 5 MB c/u)</Form.Label>
                    <Form.Control
                      type="file" multiple accept="image/*"
                      onChange={handleImagenes}
                    />
                    {previews.length > 0 && (
                      <div className={styles.previewGrid}>
                        {previews.map((src, i) => (
                          <div key={i} className={styles.previewItem}>
                            <img src={src} alt={`preview-${i}`} className={styles.previewImg} />
                            <button
                              type="button" className={styles.quitarBtn}
                              onClick={() => quitarImagen(i)}
                            >✕</button>
                            {i === 0 && <span className={styles.badgePrincipal}>Principal</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Form.Group>

                  {/* CAPTCHA */}
                  <Form.Group className="mb-4">
                    <Form.Label>Verificación: {captcha.pregunta} *</Form.Label>
                    <Form.Control
                      type="number" value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Resultado" required style={{ maxWidth: 140 }}
                    />
                  </Form.Group>

                  <Button type="submit" variant="success" size="lg" className="w-100" disabled={enviando}>
                    {enviando ? <><Spinner size="sm" className="me-2" />Publicando...</> : "Publicar artículo"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default Publicar;
