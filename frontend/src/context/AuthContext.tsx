import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AUTH_EXPIRED_EVENT } from "../services/authEvents";
import { api } from "../services/api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: "ADMIN" | "PROFESSOR";
  categoria?: "INICIAIS" | "FINAIS" | null;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem("usuario");
    if (!salvo || !localStorage.getItem("token")) return null;
    try {
      return JSON.parse(salvo) as Usuario;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const encerrarSessao = () => setUsuario(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, encerrarSessao);
    async function atualizarConta() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await api.get<Usuario>("/auth/me");
        if (localStorage.getItem("token") !== token) return;
        localStorage.setItem("usuario", JSON.stringify(data));
        setUsuario(data);
      } catch {
        // A resposta 401 é tratada pelo interceptor da API.
      }
    }
    void atualizarConta();
    window.addEventListener("focus", atualizarConta);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, encerrarSessao);
      window.removeEventListener("focus", atualizarConta);
    };
  }, []);

  function login(novoUsuario: Usuario, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(novoUsuario));
    setUsuario(novoUsuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro do AuthProvider");
  return context;
}
