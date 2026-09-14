import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e0] bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6b7280]">{title}</p>

          <h2 className="mt-3 text-4xl font-bold text-[#111111]">{value}</h2>
        </div>

        <div className="rounded-xl bg-black p-4 text-white">{icon}</div>
      </div>
    </div>
  );
}
