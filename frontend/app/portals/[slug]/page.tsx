import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { ExternalLink, ShieldCheck, Clock, CheckCircle, Globe } from "lucide-react";
import { Portal } from "@/types";

async function getPortal(slug: string): Promise<Portal | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/portals/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function PortalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portal = await getPortal(slug);

  if (!portal) {
    notFound();
  }

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs
        items={[
          { label: "Explore", href: "/explore" },
          { label: "Portals", href: "/portals" },
          { label: portal.name },
        ]}
      />

      <div className="max-w-3xl mx-auto my-6 space-y-6">
        {/* Main Card */}
        <div className="wiki-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <SourceBadge sourceType={portal.source_type} size="md" />
            <VerificationBadge status={portal.verification_status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {portal.name}
          </h1>

          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider">
            Category: {portal.category}
          </div>

          {portal.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {portal.description}
            </p>
          )}

          {/* Direct Launch Action */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-0.5">
                Official Access URL
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 break-all">
                {portal.url}
              </span>
            </div>

            <a
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 shadow-sm transition-colors"
            >
              <span>Launch Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Provenance Box matching uiux.md Section 64 */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Source Provenance & Authority
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Authority</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Official SRM University-AP Portal
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Last Checked</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Continuous automated health checks active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
