import { createContext, useContext, useState, type ReactNode } from "react";

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
