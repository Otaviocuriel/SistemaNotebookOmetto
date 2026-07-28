import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Pedido } from "../types/pedido";

interface PedidoContextType {
  pedidos: Pedido[];
  setPedidos: React.Dispatch<
    React.SetStateAction<Pedido[]>
  >;
}

const PedidoContext = createContext<
  PedidoContextType | undefined
>(undefined);


export function PedidoProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      professor: "João Silva",
      sala: "7º A",
      quantidade: 20,
      categoria: "Anos Finais",
      status: "Pendente",
      data: "28/07/2026",
    },

    {
      id: 2,
      professor: "Maria Souza",
      sala: "4º C",
      quantidade: 18,
      categoria: "Anos Iniciais",
      status: "Em uso",
      data: "28/07/2026",
    },
  ]);


  return (
    <PedidoContext.Provider
      value={{
        pedidos,
        setPedidos,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}


export function usePedidos() {

  const context = useContext(PedidoContext);

  if (!context) {
    throw new Error(
      "usePedidos deve estar dentro do PedidoProvider"
    );
  }

  return context;
}