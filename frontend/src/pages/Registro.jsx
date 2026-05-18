import { useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, Alert, ProgressBar, InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Registro.module.css";

// CAPTCHA matemático
function generarCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { pregunta: `¿Cuánto es ${a} + ${b}?`, respuesta: String(a + b) };
}

const REGLAS = [
  { id: "longitud",  label: "Mínimo 8 caracteres",          test: (p) => p.length >= 8 },
  { id: "mayuscula", label: "Al menos una letra mayúscula",  test: (p) => /[A-Z]/.test(p) },
  { id: "numero",    label: "Al menos un número",            test: (p) => /[0-9]/.test(p) },
  { id: "especial",  label: "Al menos un carácter especial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function calcularFortaleza(p) { return REGLAS.filter((r) => r.test(p)).length; }
function colorFortaleza(n) { return n <= 1 ? "danger" : n === 2 ? "warning" : n === 3 ? "info" : "success"; }
function labelFortaleza(n) { return ["", "Muy débil", "Débil", "Aceptable", "Fuerte ✓"][n] || ""; }

function Registro() {
  const navigate = useNavigate();
  const { registro } = useAuth();

  const [form, setForm] = useState({
    nombre: "", apellido: "", correo: "", telefono: "", ciudad: "",
    password: "", confirmar: "",
  });
  const [mostrarPass, setMostrarPass] = useState(false);
  const [captcha] = useState(generarCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const fortaleza = calcularFortaleza(form.password);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmar) return setError("Las contraseñas no coinciden");
    if (fortaleza < 3) return setError("La contraseña es muy débil");
    if (captchaInput.trim() !== captcha.respuesta) return setError("Respuesta del CAPTCHA incorrecta");

    setEnviando(true);
    try {
      await registro({
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        telefono: form.telefono || undefined,
        ciudad: form.ciudad || undefined,
        password: form.password,
      });
      setExito(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <Container className="py-5 text-center">
        <div style={{ fontSize: "4rem" }}>🎉</div>
        <h2 className="text-success mt-3">¡Registro exitoso!</h2>
        <p className="text-muted">Redirigiendo a tu perfil...</p>
      </Container>
    );
  }

  return (
    <main className={styles.pagina}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <h1 className={styles.titulo}>Crear cuenta</h1>
            <p className="text-muted mb-4">
              Únete a Second Hand y comienza a comprar y vender artículos usados.
            </p>

            <Card className={styles.card}>
              <Card.Body>
                {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Apellido *</Form.Label>
                        <Form.Control name="apellido" value={form.apellido} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico *</Form.Label>
                    <Form.Control
                      type="text" name="correo" value={form.correo}
                      onChange={handleChange} placeholder="tu@correo.com" required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control name="telefono" value={form.telefono} onChange={handleChange} placeholder="3001234567" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ej: Bogotá" />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Contraseña con indicador de fortaleza */}
                  <Form.Group className="mb-2">
                    <Form.Label>Contraseña *</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={mostrarPass ? "text" : "password"}
                        name="password" value={form.password} onChange={handleChange}
                        placeholder="Mínimo 8 caracteres" required
                      />
                      <Button variant="outline-secondary" onClick={() => setMostrarPass((v) => !v)}>
                        {mostrarPass ? "🙈" : "👁️"}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {form.password && (
                    <div className="mb-3">
                      <ProgressBar
                        now={(fortaleza / 4) * 100}
                        variant={colorFortaleza(fortaleza)}
                        style={{ height: "6px" }}
                        className="mb-1"
                      />
                      <small className={`text-${colorFortaleza(fortaleza)}`}>
                        {labelFortaleza(fortaleza)}
                      </small>
                      <ul className={styles.reglasList}>
                        {REGLAS.map((r) => (
                          <li key={r.id} className={r.test(form.password) ? styles.reglaOk : styles.reglaFail}>
                            {r.test(form.password) ? "✅" : "❌"} {r.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar contraseña *</Form.Label>
                    <Form.Control
                      type={mostrarPass ? "text" : "password"}
                      name="confirmar" value={form.confirmar} onChange={handleChange}
                      placeholder="Repite la contraseña" required
                    />
                    {form.confirmar && form.password !== form.confirmar && (
                      <Form.Text className="text-danger">Las contraseñas no coinciden</Form.Text>
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
                    {enviando ? "Registrando..." : "Crear cuenta gratis"}
                  </Button>
                </Form>

                <p className="text-center mt-3 mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/">Inicia sesión desde la barra de navegación</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default Registro;
