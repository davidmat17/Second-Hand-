// Componente que protege rutas privadas
// Si la bandera (autenticado) está apagada, redirige al inicio
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RutaPrivada() {
  const { autenticado } = useAuth();

  // Si no está autenticado, bloquea la entrada (sin puertas traseras)
  if (!autenticado) {
    return <Navigate to="/" replace />;
  }

  // Outlet renderiza los componentes hijos de esta ruta
  return <Outlet />;
}

export default RutaPrivada;
