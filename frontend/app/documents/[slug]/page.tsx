import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { BookOpen, FileText, Download, Calendar, ExternalLink, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import { DocumentItem } from "@/types";

async function getDoc(slug: string): Promise<DocumentItem | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/documents/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getDoc(slug);

  if (!doc) {
    notFound();
  }

  const pubDate = doc.published_at
    ? new Date(doc.published_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "2026";

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs
        items={[
          { label: "Explore", href: "/explore" },
          { label: "Documents", href: "/documents" },
          { label: doc.title },
        ]}
      />

      <div className="max-w-3xl mx-auto my-6 space-y-6">
        <div className="wiki-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
              {doc.document_type}
            </span>
            <div className="flex items-center gap-2">
              <SourceBadge sourceType={doc.source_type} size="md" />
              <VerificationBadge status={doc.verification_status} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {doc.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {pubDate}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{doc.page_count} Pages</span>
            </span>
          </div>

          {doc.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {doc.description}
            </p>
          )}

          {/* AI Ask Assistant Widget for this document (Workflow 4) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/30 border border-blue-500/30 dark:border-blue-500/20 mb-6">
            <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Ask AI About This Document</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Ask natural-language questions about attendance criteria, letter grade scales, and detention policies indexed directly from this statutory document.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/ai?q=${encodeURIComponent("What is the minimum attendance rule in " + doc.title + "?")}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium hover:border-blue-500 transition-colors"
              >
                &ldquo;What is the minimum attendance rule?&rdquo; →
              </Link>
              <Link
                href={`/ai?q=${encodeURIComponent("What is the grading policy and CGPA scale?")}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium hover:border-blue-500 transition-colors"
              >
                &ldquo;What is the grading policy?&rdquo; →
              </Link>
            </div>
          </div>

          {/* Download Original PDF Button */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                Official Document PDF
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Original institutional document hosted on srmap.edu.in
              </span>
            </div>

            <a
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Document PDF</span>
            </a>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all documents</span>
            </Link>

            {doc.source_url && (
              <a
                href={doc.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                <span>Institutional Source Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
