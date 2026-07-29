import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { usuario } = useAuth();
  const inicial = usuario?.nome?.charAt(0).toUpperCase() ?? "?";
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
        {inicial}
      </div>
      <div>
        <h3 className="font-semibold">{usuario?.nome}</h3>
        <p className="text-sm text-slate-500">
          {usuario?.tipo === "ADMIN" ? "Administrador" : "Professor"}
        </p>
      </div>
    </div>
  );
}
