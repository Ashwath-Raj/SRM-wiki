import React from "react";
import Link from "next/link";
import { ExternalLink, Award, BookOpen, Calendar, Home, CreditCard, Briefcase, ShieldAlert, Wifi } from "lucide-react";
import { Portal } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";
import { VerificationBadge } from "../ui/VerificationBadge";

interface PortalCardProps {
  portal: Portal;
}

export const PortalCard: React.FC<PortalCardProps> = ({ portal }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "award":
        return <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "book-open":
        return <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case "calendar":
        return <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "home":
        return <Home className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "credit-card":
        return <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case "briefcase":
        return <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case "shield-alert":
        return <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case "wifi":
        return <Wifi className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="wiki-card p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <SourceBadge sourceType={portal.source_type} size="sm" />
          <VerificationBadge status={portal.verification_status} />
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
            {getIcon(portal.icon)}
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <Link href={`/portals/${portal.slug}`}>{portal.name}</Link>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{portal.category}</span>
          </div>
        </div>

        {/* Description */}
        {portal.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {portal.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link
          href={`/portals/${portal.slug}`}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          Details
        </Link>

        <a
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
        >
          <span>Open Portal</span>
          <span className="text-xs">↗</span>
        </a>
      </div>
    </div>
  );
};
