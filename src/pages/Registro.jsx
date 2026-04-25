// Página de registro de usuarios
// Validaciones completas del lado del cliente
// CAPTCHA matemático simulado
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Registro.module.css";

// Usuarios simulados (en Fase 5 vendrá de la BD)
const USUARIOS_REGISTRADOS = ["admin@secondhand.co", "test@correo.com"];

// CAPTCHA matemático
function generarCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { pregunta: `¿Cuánto es ${a} + ${b}?`, respuesta: String(a + b) };
}

// Reglas de validación de contraseña
const REGLAS = [
  { id: "longitud", label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
  {
    id: "mayuscula",
    label: "Al menos una letra mayúscula",
    test: (p) => /[A-Z]/.test(p),
  },
  { id: "numero", label: "Al menos un número", test: (p) => /[0-9]/.test(p) },
  {
    id: "especial",
    label: "Al menos un carácter especial",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

// Calcula el nivel de fortaleza (0-4)
function calcularFortaleza(password) {
  return REGLAS.filter((r) => r.test(password)).length;
}

function colorFortaleza(nivel) {
  if (nivel <= 1) return "danger";
  if (nivel === 2) return "warning";
  if (nivel === 3) return "info";
  return "success";
}

function labelFortaleza(nivel) {
  if (nivel === 0) return "";
  if (nivel === 1) return "Muy débil";
  if (nivel === 2) return "Débil";
  if (nivel === 3) return "Aceptable";
  return "Fuerte ✓";
}

function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Campos del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    ciudad: "",
    password: "",
    confirmar: "",
  });

  // UI
  const [errores, setErrores] = useState({});
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");

  // CAPTCHA
  const [captcha, setCaptcha] = useState(generarCaptcha);
  const [respuestaCaptcha, setRespuestaCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const fortaleza = calcularFortaleza(form.password);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
    setErrorGlobal("");
  }

  // Validaciones completas
  function validar() {
    const e = {};

    // Nombre
    if (!form.nombre.trim() || form.nombre.trim().length < 2)
      e.nombre = "El nombre debe tener al menos 2 caracteres.";

    // Apellido
    if (!form.apellido.trim() || form.apellido.trim().length < 2)
      e.apellido = "El apellido debe tener al menos 2 caracteres.";

    // Correo — validación con expresión regular
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.correo.trim()) e.correo = "El correo es obligatorio.";
    else if (!regexCorreo.test(form.correo))
      e.correo = "El formato del correo no es válido.";
    else if (USUARIOS_REGISTRADOS.includes(form.correo.toLowerCase()))
      e.correo = "Este correo ya está registrado. ¿Quieres iniciar sesión?";

    // Teléfono (opcional pero si se escribe debe ser válido)
    if (form.telefono && !/^[0-9]{7,10}$/.test(form.telefono))
      e.telefono = "El teléfono debe tener entre 7 y 10 dígitos.";

    // Contraseña — todas las reglas
    if (!form.password) e.password = "La contraseña es obligatoria.";
    else if (calcularFortaleza(form.password) < 4)
      e.password = "La contraseña no cumple todos los requisitos.";

    // Confirmación
    if (!form.confirmar) e.confirmar = "Debes confirmar tu contraseña.";
    else if (form.password !== form.confirmar)
      e.confirmar = "Las contraseñas no coinciden.";

    return e;
  }

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

    // 3. Simular registro exitoso
    setCargando(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCargando(false);
    setEnviado(true);

    // Auto-login después del registro
    setTimeout(() => {
      login("admin", "1234");
      navigate("/dashboard");
    }, 2000);
  }

  // Pantalla de éxito
  if (enviado) {
    return (
      <Container className="mt-5 text-center">
        <div className={styles.exito}>
          <div className={styles.exitoIcon}>🎉</div>
          <h2>¡Registro exitoso!</h2>
          <p className="text-muted">
            Bienvenido a Second Hand, <strong>{form.nombre}</strong>. Iniciando
            sesión automáticamente...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <main className={styles.pagina}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={9} lg={7}>
            <Card className={styles.card}>
              <Card.Body>
                {/* Encabezado */}
                <div className={styles.encabezado}>
                  <h2 className={styles.titulo}>🏷️ Crear cuenta</h2>
                  <p className="text-muted">
                    Únete a Second Hand y empieza a comprar y vender
                  </p>
                </div>

                {errorGlobal && <Alert variant="danger">{errorGlobal}</Alert>}

                <Form noValidate onSubmit={handleSubmit}>
                  {/* Nombre y Apellido */}
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Nombre <span className={styles.req}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          placeholder="Ej: Carlos"
                          value={form.nombre}
                          onChange={handleChange}
                          isInvalid={!!errores.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.nombre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Apellido <span className={styles.req}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="apellido"
                          placeholder="Ej: Martínez"
                          value={form.apellido}
                          onChange={handleChange}
                          isInvalid={!!errores.apellido}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.apellido}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Correo */}
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      Correo electrónico <span className={styles.req}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="correo"
                      placeholder="tu@correo.com"
                      value={form.correo}
                      onChange={handleChange}
                      isInvalid={!!errores.correo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.correo}{" "}
                      {errores.correo?.includes("ya está registrado") && (
                        <Link to="/" className={styles.linkLogin}>
                          Iniciar sesión
                        </Link>
                      )}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Teléfono y Ciudad */}
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          Teléfono{" "}
                          <span className={styles.opcional}>(opcional)</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="telefono"
                          placeholder="Ej: 3001234567"
                          value={form.telefono}
                          onChange={handleChange}
                          isInvalid={!!errores.telefono}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.telefono}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>Ciudad</Form.Label>
                        <Form.Select
                          name="ciudad"
                          value={form.ciudad}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar...</option>
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

                  {/* Contraseña */}
                  <Form.Group className="mb-2">
                    <Form.Label className={styles.label}>
                      Contraseña <span className={styles.req}>*</span>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={verPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mínimo 8 caracteres"
                        value={form.password}
                        onChange={handleChange}
                        isInvalid={!!errores.password}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setVerPassword(!verPassword)}
                        tabIndex={-1}
                      >
                        {verPassword ? "🙈" : "👁️"}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errores.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Indicador de fortaleza */}
                  {form.password && (
                    <div className={styles.fortalezaBox}>
                      <div className={styles.fortalezaHeader}>
                        <small>Fortaleza:</small>
                        <small className={`text-${colorFortaleza(fortaleza)}`}>
                          <strong>{labelFortaleza(fortaleza)}</strong>
                        </small>
                      </div>
                      <ProgressBar
                        now={(fortaleza / 4) * 100}
                        variant={colorFortaleza(fortaleza)}
                        style={{ height: "6px", marginBottom: "8px" }}
                      />
                      {/* Checklist de reglas */}
                      <ul className={styles.reglasList}>
                        {REGLAS.map((r) => (
                          <li
                            key={r.id}
                            className={
                              r.test(form.password)
                                ? styles.reglaOk
                                : styles.reglaPendiente
                            }
                          >
                            {r.test(form.password) ? "✅" : "⬜"} {r.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Confirmar contraseña */}
                  <Form.Group className="mb-3 mt-3">
                    <Form.Label className={styles.label}>
                      Confirmar contraseña <span className={styles.req}>*</span>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={verConfirmar ? "text" : "password"}
                        name="confirmar"
                        placeholder="Repite tu contraseña"
                        value={form.confirmar}
                        onChange={handleChange}
                        isInvalid={!!errores.confirmar}
                        isValid={
                          form.confirmar.length > 0 &&
                          form.password === form.confirmar
                        }
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setVerConfirmar(!verConfirmar)}
                        tabIndex={-1}
                      >
                        {verConfirmar ? "🙈" : "👁️"}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errores.confirmar}
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="valid">
                        ¡Las contraseñas coinciden!
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* CAPTCHA */}
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

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="w-100 mt-4"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Registrando...
                      </>
                    ) : (
                      "🚀 Crear cuenta"
                    )}
                  </Button>

                  <p
                    className="text-center mt-3 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    ¿Ya tienes cuenta?{" "}
                    <span
                      className={styles.linkLogin}
                      onClick={() => navigate("/")}
                      style={{ cursor: "pointer" }}
                    >
                      Inicia sesión aquí
                    </span>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default Registro;
