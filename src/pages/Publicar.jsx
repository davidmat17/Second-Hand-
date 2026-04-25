// Formulario para publicar un producto (ruta privada)
// Usa react-bootstrap/Form con validaciones y CAPTCHA simulado
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Publicar.module.css";

const CATEGORIAS = [
  "Electrónica",
  "Ropa",
  "Hogar",
  "Deportes",
  "Vehículos",
  "Libros",
  "Otro",
];
const ESTADOS = ["Como nuevo", "Bueno", "Regular"];
const CIUDADES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Bucaramanga",
  "Cartagena",
  "Otra",
];

// CAPTCHA simulado: operación matemática simple
function generarCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { pregunta: `¿Cuánto es ${a} + ${b}?`, respuesta: String(a + b) };
}

function Publicar() {
  const navigate = useNavigate();

  // Campos del formulario
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    precio: "",
    estado: "",
    ciudad: "",
  });

  // Validaciones
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // CAPTCHA
  const [captcha, setCaptcha] = useState(generarCaptcha);
  const [respuestaCaptcha, setRespuestaCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Actualiza un campo del formulario
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Borra el error del campo al escribir
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // Validaciones del lado del cliente
  function validar() {
    const nuevosErrores = {};

    if (!form.titulo.trim() || form.titulo.length < 5)
      nuevosErrores.titulo = "El título debe tener al menos 5 caracteres.";

    if (!form.descripcion.trim() || form.descripcion.length < 20)
      nuevosErrores.descripcion =
        "La descripción debe tener al menos 20 caracteres.";

    if (!form.categoria) nuevosErrores.categoria = "Selecciona una categoría.";

    const precioNum = Number(form.precio);
    if (!form.precio || isNaN(precioNum) || precioNum <= 0)
      nuevosErrores.precio = "Ingresa un precio válido mayor a 0.";

    if (precioNum > 999999999)
      nuevosErrores.precio = "El precio no puede superar $999.999.999.";

    if (!form.estado)
      nuevosErrores.estado = "Selecciona el estado del artículo.";

    if (!form.ciudad) nuevosErrores.ciudad = "Selecciona tu ciudad.";

    return nuevosErrores;
  }

  // Calcula el progreso del formulario (para la barra)
  const camposLlenos = Object.values(form).filter((v) => v !== "").length;
  const progreso = Math.round((camposLlenos / 6) * 100);

  async function handleSubmit(e) {
    e.preventDefault();

    // 1. Validar campos
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // 2. Validar CAPTCHA
    if (respuestaCaptcha.trim() !== captcha.respuesta) {
      setCaptchaError("Respuesta incorrecta. Intenta de nuevo.");
      setCaptcha(generarCaptcha());
      setRespuestaCaptcha("");
      return;
    }

    // 3. Simular envío
    setCargando(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCargando(false);
    setEnviado(true);

    // Redirigir al catálogo luego de 2 segundos
    setTimeout(() => navigate("/catalogo"), 2000);
  }

  if (enviado) {
    return (
      <Container className="mt-5 text-center">
        <div className={styles.exito}>
          <div className={styles.exitoIcon}>✅</div>
          <h2>¡Producto publicado!</h2>
          <p className="text-muted">
            Tu artículo fue publicado exitosamente. Redirigiendo al catálogo...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <main className={styles.pagina}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={7}>
            <Card className={styles.card}>
              <Card.Body>
                <h2 className={styles.titulo}>📦 Publicar producto</h2>
                <p className="text-muted mb-1">
                  Completa todos los campos para publicar tu artículo.
                </p>

                {/* Barra de progreso */}
                <div className="mb-4">
                  <small className="text-muted">
                    Progreso: {camposLlenos} de 6 campos
                  </small>
                  <ProgressBar
                    now={progreso}
                    variant="success"
                    className="mt-1"
                    style={{ height: "6px" }}
                  />
                </div>

                <Form noValidate onSubmit={handleSubmit}>
                  {/* Título */}
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      Título del artículo{" "}
                      <span className={styles.requerido}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="titulo"
                      placeholder="Ej: iPhone 13 Pro 256GB azul"
                      value={form.titulo}
                      onChange={handleChange}
                      isInvalid={!!errores.titulo}
                      maxLength={80}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.titulo}
                    </Form.Control.Feedback>
                    <Form.Text muted>
                      {form.titulo.length}/80 caracteres
                    </Form.Text>
                  </Form.Group>

                  {/* Descripción */}
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      Descripción <span className={styles.requerido}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="descripcion"
                      placeholder="Describe el artículo: características, motivo de venta, tiempo de uso..."
                      value={form.descripcion}
                      onChange={handleChange}
                      isInvalid={!!errores.descripcion}
                      maxLength={500}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.descripcion}
                    </Form.Control.Feedback>
                    <Form.Text muted>
                      {form.descripcion.length}/500 caracteres
                    </Form.Text>
                  </Form.Group>

                  {/* Categoría y Estado en la misma fila */}
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Categoría <span className={styles.requerido}>*</span>
                        </Form.Label>
                        <Form.Select
                          name="categoria"
                          value={form.categoria}
                          onChange={handleChange}
                          isInvalid={!!errores.categoria}
                        >
                          <option value="">Seleccionar...</option>
                          {CATEGORIAS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errores.categoria}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Estado <span className={styles.requerido}>*</span>
                        </Form.Label>
                        <Form.Select
                          name="estado"
                          value={form.estado}
                          onChange={handleChange}
                          isInvalid={!!errores.estado}
                        >
                          <option value="">Seleccionar...</option>
                          {ESTADOS.map((e) => (
                            <option key={e}>{e}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errores.estado}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Precio y Ciudad en la misma fila */}
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Precio (COP){" "}
                          <span className={styles.requerido}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="precio"
                          placeholder="Ej: 350000"
                          value={form.precio}
                          onChange={handleChange}
                          isInvalid={!!errores.precio}
                          min={1}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.precio}
                        </Form.Control.Feedback>
                        {form.precio && !errores.precio && (
                          <Form.Text muted>
                            ${Number(form.precio).toLocaleString("es-CO")} COP
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Ciudad <span className={styles.requerido}>*</span>
                        </Form.Label>
                        <Form.Select
                          name="ciudad"
                          value={form.ciudad}
                          onChange={handleChange}
                          isInvalid={!!errores.ciudad}
                        >
                          <option value="">Seleccionar...</option>
                          {CIUDADES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errores.ciudad}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* CAPTCHA simulado */}
                  <div className={styles.captchaBox}>
                    <p className={styles.captchaTitulo}>
                      🤖 Verificación anti-robots
                    </p>
                    <p className={styles.captchaPregunta}>{captcha.pregunta}</p>
                    <Form.Control
                      type="text"
                      placeholder="Tu respuesta"
                      value={respuestaCaptcha}
                      onChange={(e) => {
                        setRespuestaCaptcha(e.target.value);
                        setCaptchaError("");
                      }}
                      isInvalid={!!captchaError}
                      className={styles.captchaInput}
                    />
                    {captchaError && (
                      <Alert variant="danger" className="mt-2 py-2 mb-0">
                        {captchaError}
                      </Alert>
                    )}
                  </div>

                  {/* Botón submit */}
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="w-100 mt-3"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Publicando...
                      </>
                    ) : (
                      "📤 Publicar artículo"
                    )}
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
