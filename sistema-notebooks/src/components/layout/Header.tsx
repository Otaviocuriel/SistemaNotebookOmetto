import { Bell, Menu, Search } from "lucide-react";
import UserProfile from "./UserProfile";

export default function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-20 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Abrir menu"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="relative hidden sm:block">

        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />

        <input
          placeholder="Pesquisar..."
          className="w-52 rounded-xl border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 lg:w-80"
        />

      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-6">

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></span>

        </button>

        <UserProfile />

      </div>

    </header>
  );
}

