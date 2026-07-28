import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";


interface Props {
  children: ReactNode;
  admin?: boolean;
}


export default function PrivateRoute({
  children,
  admin = false,
}: Props) {

  const { usuario } = useAuth();



  if (!usuario) {

    return <Navigate to="/login" />;

  }



  if (admin && usuario.tipo !== "ADMIN") {

    return <Navigate to="/dashboard" />;

  }



  return children;

}