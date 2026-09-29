import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 py-3">
      <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast || !item.href ? (
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
