import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { Bell, Calendar, ExternalLink, ShieldCheck, ArrowLeft, FileText } from "lucide-react";
import { NoticeItem } from "@/types";

async function getNotice(slug: string): Promise<NoticeItem | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/notices/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notice = await getNotice(slug);

  if (!notice) {
    notFound();
  }

  const pubDate = notice.published_at
    ? new Date(notice.published_at).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs
        items={[
          { label: "Explore", href: "/explore" },
          { label: "Notices", href: "/notices" },
          { label: notice.title },
        ]}
      />

      <div className="max-w-3xl mx-auto my-6 space-y-6">
        <div className="wiki-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={notice.priority} />
              <SourceBadge sourceType={notice.source_type} size="md" />
            </div>
            <VerificationBadge status={notice.verification_status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {notice.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Published {pubDate}</span>
            </span>
            <span>·</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Category: {notice.category}</span>
          </div>

          {/* Full notice description */}
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-4 mb-8">
            <p className="text-base leading-relaxed">{notice.description}</p>
          </div>

          {/* Source Provenance Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Official Verification & Authority
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This notice was issued by the authorized university division and verified by the SRM AP Wiki aggregation index.
            </p>

            {notice.source_url && (
              <div className="pt-2">
                <a
                  href={notice.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Open authoritative source announcement</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/notices"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all notices</span>
            </Link>

            {notice.source_url && (
              <a
                href={notice.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <span>Original Source</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
