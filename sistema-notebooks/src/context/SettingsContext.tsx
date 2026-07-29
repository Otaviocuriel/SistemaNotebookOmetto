import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Densidade = "confortavel" | "compacta";

interface SettingsContextValue {
  densidade: Densidade;
  reduzirAnimacoes: boolean;
  mostrarAvisos: boolean;
  setDensidade: (densidade: Densidade) => void;
  setReduzirAnimacoes: (ativo: boolean) => void;
  setMostrarAvisos: (ativo: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

function lerBooleano(chave: string, padrao: boolean) {
  const valor = localStorage.getItem(chave);
  return valor === null ? padrao : valor === "true";
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [densidade, setDensidade] = useState<Densidade>(() =>
    localStorage.getItem("densidade") === "compacta"
      ? "compacta"
      : "confortavel"
  );
  const [reduzirAnimacoes, setReduzirAnimacoes] = useState(() =>
    lerBooleano("reduzirAnimacoes", false)
  );
  const [mostrarAvisos, setMostrarAvisos] = useState(() =>
    lerBooleano("mostrarAvisos", true)
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      "compact-ui",
      densidade === "compacta"
    );
    document.documentElement.classList.toggle(
      "reduce-motion",
      reduzirAnimacoes
    );
    localStorage.setItem("densidade", densidade);
    localStorage.setItem("reduzirAnimacoes", String(reduzirAnimacoes));
    localStorage.setItem("mostrarAvisos", String(mostrarAvisos));
  }, [densidade, reduzirAnimacoes, mostrarAvisos]);

  const value = useMemo(
    () => ({
      densidade,
      reduzirAnimacoes,
      mostrarAvisos,
      setDensidade,
      setReduzirAnimacoes,
      setMostrarAvisos,
    }),
    [densidade, reduzirAnimacoes, mostrarAvisos]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings precisa estar dentro de SettingsProvider");
  }
  return context;
}

