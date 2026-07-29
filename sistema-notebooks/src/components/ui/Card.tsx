import type { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function Card({
  title,
  value,
  icon,
  color,
}: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </h2>
        </div>

        <div className={`${color} rounded-lg p-3 text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

