"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { DocumentItem } from "@/types";
import { BookOpen, FileText, Download, Calendar, ExternalLink } from "lucide-react";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  const types = ["All", "REGULATION", "HANDBOOK", "CIRCULAR", "SYLLABUS"];

  useEffect(() => {
    async function loadDocs() {
      setIsLoading(true);
      try {
        let url = "http://localhost:8000/api/v1/documents";
        if (selectedType !== "All") url += `?doc_type=${encodeURIComponent(selectedType)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDocs(data);
        }
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDocs();
  }, [selectedType]);

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Documents" }]} />

      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-rose-600" />
          Academic Regulations & Handbooks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official statutory regulations, academic policies, attendance criteria, and student handbooks.
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === t
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : docs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => {
            const pubDate = doc.published_at
              ? new Date(doc.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "2026";

            return (
              <div key={doc.id} className="wiki-card p-5 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
                      {doc.document_type}
                    </span>
                    <SourceBadge sourceType={doc.source_type} size="sm" />
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    <Link href={`/documents/${doc.slug}`}>{doc.title}</Link>
                  </h3>

                  {doc.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {doc.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{pubDate}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{doc.page_count} pages</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={`/documents/${doc.slug}`}
                    className="font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Read Overview
                  </Link>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No documents found"
          description="No official regulatory documents matched this filter."
          actionText="View all documents"
          actionHref="/documents"
        />
      )}
    </div>
  );
}
