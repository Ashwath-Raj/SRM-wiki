import React from "react";
import Link from "next/link";
import { Building2, ExternalLink, Globe, Mail } from "lucide-react";
import { OrganizationItem } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";

interface OrganizationCardProps {
  organization: OrganizationItem;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  return (
    <div className="wiki-card p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <SourceBadge sourceType="ORGANIZATION" size="sm" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {organization.type}
          </span>
        </div>

        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
          <Link href={`/organizations/${organization.slug}`}>{organization.name}</Link>
        </h3>

        {organization.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {organization.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <Link
          href={`/organizations/${organization.slug}`}
          className="font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          View Profile
        </Link>

        {organization.website_url && (
          <a
            href={organization.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
