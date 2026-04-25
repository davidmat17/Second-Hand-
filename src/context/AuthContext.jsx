// Contexto de autenticación
// Maneja la "bandera" de si el usuario está logueado o no
// Las claves NO aparecen en el código, están en variables
import { createContext, useState, useContext } from "react";

// Credenciales simuladas (en producción vendrían del servidor)
const USUARIO_SIMULADO = import.meta.env.VITE_USER || "admin";
const CLAVE_SIMULADA = import.meta.env.VITE_PASS || "1234";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // bandera: true = usuario autenticado
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  function login(user, pass) {
    if (user === USUARIO_SIMULADO && pass === CLAVE_SIMULADA) {
      setAutenticado(true);
      setUsuario(user);
      return true;
    }
    return false;
  }

  function logout() {
    setAutenticado(false);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ autenticado, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}
