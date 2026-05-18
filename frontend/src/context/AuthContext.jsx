import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

const API = "/api/auth";

export function AuthProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // evita parpadeo al recargar

  // Al iniciar la app, restaurar sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("sh_token");
    const usuarioGuardado = localStorage.getItem("sh_usuario");
    if (token && usuarioGuardado) {
      setAutenticado(true);
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  async function login(correo, password) {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

    localStorage.setItem("sh_token", data.token);
    localStorage.setItem("sh_usuario", JSON.stringify(data.usuario));
    setAutenticado(true);
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function registro(datosForm) {
    const res = await fetch(`${API}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosForm),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrarse");

    localStorage.setItem("sh_token", data.token);
    localStorage.setItem("sh_usuario", JSON.stringify(data.usuario));
    setAutenticado(true);
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem("sh_token");
    localStorage.removeItem("sh_usuario");
    setAutenticado(false);
    setUsuario(null);
  }

  // Helper para llamadas autenticadas desde cualquier componente
  function getToken() {
    return localStorage.getItem("sh_token");
  }

  return (
    <AuthContext.Provider
      value={{ autenticado, usuario, cargando, login, registro, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
