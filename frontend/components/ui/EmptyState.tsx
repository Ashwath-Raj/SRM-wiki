import React from "react";
import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  icon?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  description = "We couldn't find anything matching your criteria. Try adjusting your search or filters.",
  actionText = "Explore all categories",
  actionHref = "/explore",
  icon: Icon = SearchX,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl my-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-500">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};
