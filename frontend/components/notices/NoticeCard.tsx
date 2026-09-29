import React from "react";
import Link from "next/link";
import { Bell, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { NoticeItem } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";
import { StatusBadge } from "../ui/StatusBadge";

interface NoticeCardProps {
  notice: NoticeItem;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const pubDate = notice.published_at
    ? new Date(notice.published_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const isUrgent = notice.priority === "URGENT";

  return (
    <div
      className={`wiki-card p-5 flex flex-col justify-between group ${
        isUrgent ? "ring-1 ring-red-500/30 dark:ring-red-500/20" : ""
      }`}
    >
      <div>
        {/* Top Badges: Category, Priority, Source */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={notice.priority} />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
              {notice.category}
            </span>
          </div>
          <SourceBadge sourceType={notice.source_type} size="sm" />
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link href={`/notices/${notice.slug}`}>{notice.title}</Link>
        </h3>

        {/* Description Snippet */}
        {notice.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {notice.description}
          </p>
        )}
      </div>

      {/* Footer: Published Date + Read Notice Link */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{pubDate}</span>

        <div className="flex items-center gap-3">
          {notice.source_url && (
            <a
              href={notice.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
              title="Original Source"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <Link
            href={`/notices/${notice.slug}`}
            className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Read Notice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
