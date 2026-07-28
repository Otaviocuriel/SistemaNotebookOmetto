import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";


interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: "ADMIN" | "PROFESSOR";
}


interface AuthContextType {

  usuario: Usuario | null;

  login: (usuario: Usuario) => void;

  logout: () => void;

}


const AuthContext =
createContext<AuthContextType | undefined>(
  undefined
);



export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [usuario, setUsuario] =
    useState<Usuario | null>(() => {

      const salvo =
        localStorage.getItem("usuario");


      return salvo
        ? JSON.parse(salvo)
        : null;

    });



  function login(usuario: Usuario) {

    setUsuario(usuario);


    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

  }



  function logout() {

    setUsuario(null);

    localStorage.removeItem(
      "usuario"
    );

  }



  return (

    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}



export function useAuth() {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth precisa estar dentro do AuthProvider"
    );

  }


  return context;

}