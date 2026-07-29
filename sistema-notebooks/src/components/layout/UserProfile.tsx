import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { usuario } = useAuth();
  const inicial = usuario?.nome?.charAt(0).toUpperCase() ?? "?";
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white ring-2 ring-emerald-100 dark:ring-emerald-900">
        {inicial}
      </div>
      <div className="hidden sm:block">
        <h3 className="max-w-32 truncate text-sm font-semibold">{usuario?.nome}</h3>
        <p className="text-xs text-slate-500">
          {usuario?.tipo === "ADMIN" ? "Administrador" : "Professor"}
        </p>
      </div>
    </div>
  );
}


