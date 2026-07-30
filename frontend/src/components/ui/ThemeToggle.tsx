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
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce5df] bg-white text-[#1f513a] shadow-sm transition hover:bg-[#f2f7f4] focus:outline-none focus:ring-2 focus:ring-[#347b58] dark:border-[#294337] dark:bg-[#17271f] dark:text-emerald-200 dark:hover:bg-[#203529]"
    >
      {escuro ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}