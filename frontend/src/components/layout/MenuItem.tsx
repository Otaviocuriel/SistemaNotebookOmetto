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
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition ${
        active
          ? "bg-[#1f513a] text-white shadow-[0_4px_12px_rgba(31,81,58,0.16)] dark:bg-[#347b58]"
          : "text-slate-600 hover:bg-[#f2f7f4] hover:text-[#173d2c] dark:text-slate-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-200"
      }`}
    >
      <Icon size={19} strokeWidth={active ? 2.25 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}