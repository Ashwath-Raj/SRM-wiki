import React from "react";
import { CheckCircle2, Clock } from "lucide-react";

interface VerificationBadgeProps {
  status?: string;
  lastVerified?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status = "VERIFIED", lastVerified }) => {
  const isVerified = status.toUpperCase() === "VERIFIED";

  if (!isVerified) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
        <Clock className="w-3 h-3" />
        <span>Pending Review</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
      title={lastVerified ? `Verified: ${lastVerified}` : "Verified by SRM AP Wiki"}
    >
      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
      <span>Verified</span>
    </span>
  );
};
