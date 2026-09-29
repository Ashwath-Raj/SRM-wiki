import React from "react";
import { SourceType } from "@/types";
import { ShieldCheck, Building2, Users, GraduationCap, Globe, ExternalLink } from "lucide-react";

interface SourceBadgeProps {
  sourceType?: SourceType | string;
  size?: "sm" | "md";
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceType = "OFFICIAL", size = "sm" }) => {
  const type = (sourceType || "OFFICIAL").toUpperCase();

  const config: Record<string, { label: string; icon: any; className: string }> = {
    OFFICIAL: {
      label: "Official",
      icon: ShieldCheck,
      className: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    },
    DEPARTMENT: {
      label: "Department",
      icon: Building2,
      className: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
    },
    ORGANIZATION: {
      label: "Organization",
      icon: Users,
      className: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
    },
    STUDENT: {
      label: "Student Project",
      icon: GraduationCap,
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    },
    COMMUNITY: {
      label: "Community",
      icon: Globe,
      className: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    },
    EXTERNAL: {
      label: "External",
      icon: ExternalLink,
      className: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    },
  };

  const current = config[type] || config.OFFICIAL;
  const Icon = current.icon;

  const sizeClasses = size === "sm" ? "text-[10px] py-0.5 px-2" : "text-xs py-1 px-2.5";

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full uppercase tracking-wider ${sizeClasses} ${current.className}`}>
      <Icon className="w-3 h-3 stroke-[2.5]" />
      <span>{current.label}</span>
    </span>
  );
};
