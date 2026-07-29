import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface MenuItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function MenuItem({
  to,
  label,
  icon: Icon,
  onClick,
}: MenuItemProps) {
  const location = useLocation();

  const active = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition
      ${
        active
          ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon size={19} strokeWidth={active ? 2.25 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}


