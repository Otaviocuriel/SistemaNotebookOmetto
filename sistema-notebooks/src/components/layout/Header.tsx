import { Bell, Search } from "lucide-react";
import UserProfile from "./UserProfile";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      <div className="relative">

        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />

        <input
          placeholder="Pesquisar..."
          className="w-80 rounded-xl border pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></span>

        </button>

        <UserProfile />

      </div>

    </header>
  );
}