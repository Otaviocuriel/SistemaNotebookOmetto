import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";


interface NotebookData {

  iniciais: {
    total: number;
    disponiveis: number;
    emUso: number;
  };

  finais: {
    total: number;
    disponiveis: number;
    emUso: number;
  };

}


interface NotebookContextType {

  notebooks: NotebookData;

  entregarNotebook: (
    categoria: "Anos Iniciais" | "Anos Finais",
    quantidade: number
  ) => boolean;


  receberNotebook: (
    categoria: "Anos Iniciais" | "Anos Finais",
    quantidade: number
  ) => void;

}



const NotebookContext =
  createContext<NotebookContextType | undefined>(
    undefined
  );



export function NotebookProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [notebooks, setNotebooks] =
    useState<NotebookData>({

      iniciais: {
        total: 40,
        disponiveis: 32,
        emUso: 8,
      },


      finais: {
        total: 35,
        disponiveis: 28,
        emUso: 7,
      },

    });



  function entregarNotebook(
    categoria: "Anos Iniciais" | "Anos Finais",
    quantidade: number
  ): boolean {


    const tipo =
      categoria === "Anos Iniciais"
        ? "iniciais"
        : "finais";


    const disponivel =
      notebooks[tipo].disponiveis;


    if (disponivel < quantidade) {

      return false;

    }



    setNotebooks((estado) => ({

      ...estado,

      [tipo]: {

        ...estado[tipo],

        disponiveis:
          estado[tipo].disponiveis - quantidade,


        emUso:
          estado[tipo].emUso + quantidade,

      },

    }));


    return true;

  }




  function receberNotebook(
    categoria: "Anos Iniciais" | "Anos Finais",
    quantidade: number
  ) {


    const tipo =
      categoria === "Anos Iniciais"
        ? "iniciais"
        : "finais";



    setNotebooks((estado) => ({

      ...estado,

      [tipo]: {

        ...estado[tipo],

        disponiveis:
          estado[tipo].disponiveis + quantidade,


        emUso:
          estado[tipo].emUso - quantidade,

      },

    }));

  }




  return (

    <NotebookContext.Provider
      value={{
        notebooks,
        entregarNotebook,
        receberNotebook,
      }}
    >

      {children}

    </NotebookContext.Provider>

  );

}





export function useNotebook() {

  const context =
    useContext(NotebookContext);


  if (!context) {

    throw new Error(
      "useNotebook precisa estar dentro do NotebookProvider"
    );

  }


  return context;

}