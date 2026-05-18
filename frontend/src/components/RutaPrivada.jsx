import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function RutaPrivada() {
  const { autenticado, cargando } = useAuth();

  // Esperar a que se restaure la sesión desde localStorage
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner variant="success" />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaPrivada;
