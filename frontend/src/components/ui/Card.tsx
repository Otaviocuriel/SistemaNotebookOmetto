import type { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  tone?: "brand" | "forest" | "gold";
  description?: string;
}

const estilos = {
  brand: {
    borda: "border-l-[#286548]",
    icone: "bg-[#e5f0e9] text-[#1f513a]",
  },

  forest: {
    borda: "border-l-[#102d21]",
    icone: "bg-[#e4ebe7] text-[#102d21]",
  },

  gold: {
    borda: "border-l-[#9a7430]",
    icone: "bg-[#f5ecd7] text-[#795819]",
  },
};

export default function Card({
  title,
  value,
  icon,
  tone = "brand",
  description,
}: CardProps) {
  const estilo = estilos[tone];

  return (
    <article
      className={`rounded-2xl border border-[#dce5df] border-l-4 ${estilo.borda} bg-white p-5 shadow-[0_5px_18px_rgba(16,45,33,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(16,45,33,0.08)] dark:border-y-[#294337] dark:border-r-[#294337] dark:bg-[#101c16]`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-[-0.04em] text-slate-900 dark:text-white">
            {value}
          </h2>

          {description && (
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${estilo.icone}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}