import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Tema = "claro" | "escuro";

interface ThemeContextValue {
  tema: Tema;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function temaInicial(): Tema {
  const salvo = localStorage.getItem("tema");

  if (salvo === "claro" || salvo === "escuro") {
    return salvo;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "escuro"
    : "claro";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    const escuro = tema === "escuro";

    document.documentElement.classList.toggle("dark", escuro);
    document.documentElement.style.colorScheme = escuro ? "dark" : "light";
    localStorage.setItem("tema", tema);
  }, [tema]);

  const value = useMemo(
    () => ({
      tema,
      alternarTema: () =>
        setTema((atual) => (atual === "claro" ? "escuro" : "claro")),
    }),
    [tema]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme precisa estar dentro de ThemeProvider");
  }

  return context;
}
