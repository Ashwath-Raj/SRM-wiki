import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = status.toUpperCase();

  const isLive = s === "LIVE NOW" || s === "ONGOING";

  const styles: Record<string, { badge: string; dot?: string }> = {
    "LIVE NOW": {
      badge: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
      dot: "bg-rose-500",
    },
    ONGOING: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      dot: "bg-emerald-500",
    },
    UPCOMING: {
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/70",
    },
    COMPLETED: {
      badge: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700",
    },
    CANCELLED: {
      badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    },
    URGENT: {
      badge: "bg-red-500 text-white border-red-600 dark:bg-red-600 dark:text-white dark:border-red-500 font-bold shadow-sm shadow-red-500/20",
    },
    IMPORTANT: {
      badge: "bg-amber-50 text-amber-800 border-amber-300/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/80 font-semibold",
    },
    NORMAL: {
      badge: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
    },
    ACTIVE: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    },
  };

  const current = styles[s] || styles.NORMAL;

  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider transition-all ${current.badge}`}
    >
      {isLive && current.dot && (
        <span className="relative flex h-2 w-2 mr-1.5 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
        </span>
      )}
      {status}
    </span>
  );
};
