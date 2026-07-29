import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { tema, alternarTema } = useTheme();
  const escuro = tema === "escuro";

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? "Ativar tema claro" : "Ativar tema escuro"}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {escuro ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
