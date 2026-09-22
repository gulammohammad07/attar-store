import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e0] bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-[#6b7280] sm:text-sm">{title}</p>

          <h2 className="mt-2 truncate text-2xl font-bold text-[#111111] sm:mt-3 sm:text-4xl">{value}</h2>
        </div>

        <div className="shrink-0 rounded-xl bg-black p-3 text-white sm:p-4">{icon}</div>
      </div>
    </div>
  );
}
