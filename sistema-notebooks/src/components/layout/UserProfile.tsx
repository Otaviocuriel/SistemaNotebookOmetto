export default function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
        O
      </div>

      <div>
        <h3 className="font-semibold">
          Otávio
        </h3>

        <p className="text-sm text-slate-500">
          Administrador
        </p>
      </div>
    </div>
  );
}