// Componente raíz: define todas las rutas de la aplicación
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaPrivada from "./components/RutaPrivada";
import Registro from "./pages/Registro";

// Páginas públicas
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";

// Páginas privadas (requieren login)
import Dashboard from "./pages/Dashboard";
import Publicar from "./pages/Publicar";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Rutas públicas — cualquiera puede verlas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas privadas — solo usuarios autenticados */}
          <Route element={<RutaPrivada />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/publicar" element={<Publicar />} />
          </Route>

          {/* Ruta 404 */}
          <Route
            path="*"
            element={<h2 className="text-center mt-5">Página no encontrada</h2>}
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
