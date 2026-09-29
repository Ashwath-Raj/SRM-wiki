import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShieldCheck, Compass, Search, Sparkles, BookOpen, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About — SRM AP Wiki",
  description: "About SRM AP Wiki, our mission, source verification architecture, and governance principles.",
};

export default function AboutPage() {
  return (
    <div className="wiki-container py-6 max-w-3xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          About SRM AP Wiki
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Everything SRM AP, in one place.
        </p>
      </div>

      <div className="wiki-card p-6 sm:p-8 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
            Why SRM AP Wiki exists
          </h2>
          <p>
            SRM University-AP information is distributed across university domains, department portals, examination systems, Canvas LMS, clubs, and student project repositories. The problem is not lack of information — the problem is fragmentation. Students and faculty frequently waste precious time searching for the correct official source.
          </p>
          <p className="mt-2">
            SRM AP Wiki solves this by serving as a unified information aggregation and navigation layer that indexes verified portals, notices, events, and statutory regulations into a single fast, searchable directory.
          </p>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Core Architecture Principles
          </h2>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Browse-First, Search-First, AI-Second:</strong> The website remains completely functional and intuitive without AI. AI serves as an accelerator for natural-language questions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Source Provenance:</strong> Every record retains its source URL, authority type (Official, Department, Organization, Student), and timestamp. Original sources remain authoritative.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Zero Hallucination AI:</strong> The AI navigation assistant never invents university URLs or regulations. Answers are strictly grounded in retrieved database records.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Public Information Scope:</strong> We never collect, store, or index private student grades, ERP logins, passwords, or attendance records. Only public and appropriately submitted information is cataloged.</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <span>Explore the Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Submit a project or notice →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
