import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface MenuItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

export default function MenuItem({
  to,
  label,
  icon: Icon,
}: MenuItemProps) {
  const location = useLocation();

  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition
      ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}