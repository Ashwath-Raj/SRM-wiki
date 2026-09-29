"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { SearchResponse, SearchResultItem } from "@/types";
import {
  Search,
  Filter,
  ExternalLink,
  ArrowRight,
  Award,
  Calendar,
  Bell,
  Code2,
  Building2,
  BookOpen,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialCat = searchParams.get("category") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sourceTypeFilter, setSourceTypeFilter] = useState("all");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function executeSearch() {
      setIsLoading(true);
      try {
        let url = `http://localhost:8000/api/v1/search?q=${encodeURIComponent(query)}&limit=30`;
        if (activeCategory !== "all") {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        if (sourceTypeFilter !== "all") {
          url += `&source_type=${encodeURIComponent(sourceTypeFilter)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      executeSearch();
    }, 150);

    return () => clearTimeout(timer);
  }, [query, activeCategory, sourceTypeFilter]);

  const categories = [
    { id: "all", label: "All Results" },
    { id: "portals", label: "Portals" },
    { id: "events", label: "Events" },
    { id: "notices", label: "Notices" },
    { id: "projects", label: "Projects" },
    { id: "organizations", label: "Clubs & Labs" },
    { id: "documents", label: "Regulations" },
    { id: "opportunities", label: "Opportunities" },
  ];

  const sourceTypes = [
    { id: "all", label: "All Sources" },
    { id: "OFFICIAL", label: "Official" },
    { id: "DEPARTMENT", label: "Department" },
    { id: "ORGANIZATION", label: "Organization" },
    { id: "STUDENT", label: "Student" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "portal":
        return <Award className="w-4 h-4 text-blue-500" />;
      case "event":
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case "notice":
        return <Bell className="w-4 h-4 text-amber-500" />;
      case "project":
        return <Code2 className="w-4 h-4 text-purple-500" />;
      case "document":
        return <BookOpen className="w-4 h-4 text-rose-500" />;
      case "organization":
        return <Building2 className="w-4 h-4 text-indigo-500" />;
      case "opportunity":
        return <Briefcase className="w-4 h-4 text-teal-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Search" }]} />

      {/* Main Search Input */}
      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
          Search Knowledge Base
        </h1>

        <div className="relative max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type keywords, courses, rules, portals, or deadlines..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filters Sidebar */}
        <aside className="space-y-6">
          <div className="wiki-card p-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Categories</span>
              </h3>
              <div className="space-y-1">
                {categories.map((c) => {
                  const count = data?.grouped_counts[c.id];
                  const isActive = activeCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{c.label}</span>
                      {count !== undefined && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Source Trust</span>
              </h3>
              <div className="space-y-1">
                {sourceTypes.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSourceTypeFilter(st.id)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      sourceTypeFilter === st.id
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Results Column */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>
              {data ? `Found ${data.total} result${data.total === 1 ? "" : "s"}` : "Searching..."}
            </span>
            {query && <span>Keywords: &ldquo;{query}&rdquo;</span>}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : data && data.results.length > 0 ? (
            data.results.map((item) => (
              <div
                key={item.id}
                className="wiki-card p-4 hover:border-blue-500 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="shrink-0">{getIcon(item.type)}</div>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.url.startsWith("http") ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      ) : (
                        <Link href={item.url}>{item.title}</Link>
                      )}
                    </span>
                    <SourceBadge sourceType={item.source_type} size="sm" />
                    {item.badge && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.date && (
                    <span className="text-[11px] text-slate-400 block">{item.date}</span>
                  )}
                </div>

                <div className="shrink-0">
                  {item.url.startsWith("http") ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      <span>Open Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No matching records found"
              description="No results in the SRM AP Wiki knowledge base matched your query. Try broadening your keywords or resetting filters."
              actionText="Reset filters"
              actionHref="/search"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="wiki-container py-12 text-center text-xs text-slate-400">Loading search interface...</div>}>
      <SearchContent />
    </Suspense>
  );
}
