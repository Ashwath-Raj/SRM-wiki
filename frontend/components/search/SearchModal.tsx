"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, ExternalLink, Calendar, Bell, Award, Code, BookOpen, Building } from "lucide-react";
import { SearchResultItem } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/search?q=${encodeURIComponent(query)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    if (item.url.startsWith("http")) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.url);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "portal":
        return <Award className="w-4 h-4 text-blue-500" />;
      case "event":
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case "notice":
        return <Bell className="w-4 h-4 text-amber-500" />;
      case "project":
        return <Code className="w-4 h-4 text-purple-500" />;
      case "document":
        return <BookOpen className="w-4 h-4 text-rose-500" />;
      case "organization":
        return <Building className="w-4 h-4 text-indigo-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10 transition-colors">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && results.length > 0) handleSelect(results[0]);
            }}
            placeholder="Search portals, exams, notices, events, projects, regulations..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Searching SRM AP knowledge base...</div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition-colors group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </span>
                      <SourceBadge sourceType={item.source_type} size="sm" />
                      {item.badge && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 pl-2">
                  {item.url.startsWith("http") ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))
          ) : query ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No direct matches for &ldquo;{query}&rdquo;.
              <div className="mt-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View full search results page →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-xs text-slate-400 text-center">
              Type keywords like <span className="font-semibold text-slate-600 dark:text-slate-300">exam</span>,{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">lms</span>,{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">workshop</span>,{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">regulations</span>, or{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">hostel</span>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
          <span>Navigate with ↵ Enter</span>
          <button
            onClick={() => {
              onClose();
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Full search page →
          </button>
        </div>
      </div>
    </div>
  );
};
