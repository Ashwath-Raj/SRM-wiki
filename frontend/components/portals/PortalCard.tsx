import React from "react";
import Link from "next/link";
import { ExternalLink, Award, BookOpen, Calendar, Home, CreditCard, Briefcase, ShieldAlert, Wifi, Globe, Code, Cpu } from "lucide-react";
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
      case "code":
        return <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case "cpu":
        return <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case "globe":
        return <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="wiki-card p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <SourceBadge sourceType={portal.source_type} size="sm" />
          <VerificationBadge status={portal.verification_status} />
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/80 dark:from-blue-950/60 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-900/50 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            {getIcon(portal.icon)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              <Link href={`/portals/${portal.slug}`}>{portal.name}</Link>
            </h3>
            <span className="inline-block mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {portal.category}
            </span>
          </div>
        </div>

        {/* Description */}
        {portal.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {portal.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link
          href={`/portals/${portal.slug}`}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Details →
        </Link>

        <a
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:scale-102"
        >
          <span>Open Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
