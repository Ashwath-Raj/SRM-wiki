import React from "react";
import Link from "next/link";
import { Briefcase, Calendar, Building, ExternalLink, ArrowRight } from "lucide-react";
import { OpportunityItem } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";

interface OpportunityCardProps {
  opportunity: OpportunityItem;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const deadlineStr = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Ongoing";

  return (
    <div className="wiki-card p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
            {opportunity.type}
          </span>
          <SourceBadge sourceType={opportunity.source_type} size="sm" />
        </div>

        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
          <Link href={`/opportunities/${opportunity.slug}`}>{opportunity.title}</Link>
        </h3>

        {opportunity.company && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{opportunity.company}</span>
          </div>
        )}

        {opportunity.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {opportunity.description}
          </p>
        )}

        {opportunity.eligibility && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded border border-slate-100 dark:border-slate-800 mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Eligibility:</span> {opportunity.eligibility}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Deadline: {deadlineStr}</span>
        </div>

        {opportunity.apply_url ? (
          <a
            href={opportunity.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <Link
            href={`/opportunities/${opportunity.slug}`}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
