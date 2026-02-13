import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, icon, colorClass }) => {
  // Normalize 3-18 D&D stat range to percentage for the bar (max 20 for buffer)
  const percentage = Math.min(100, (value / 20) * 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1 text-slate-300 text-sm font-bold uppercase tracking-wider">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-slate-900/50 h-2 rounded-full overflow-hidden border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};