"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { NoticeItem } from "@/types";
import { Bell, Filter, Search } from "lucide-react";

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "Examination", "Academic", "Hostel", "Placement", "Sports", "General"];
  const priorities = ["All", "URGENT", "IMPORTANT", "NORMAL"];

  useEffect(() => {
    async function loadNotices() {
      setIsLoading(true);
      try {
        let url = "http://localhost:8000/api/v1/notices?";
        if (selectedCategory !== "All") url += `category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedPriority !== "All") url += `priority=${encodeURIComponent(selectedPriority)}&`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        }
      } catch (err) {
        console.error("Error loading notices:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotices();
  }, [selectedCategory, selectedPriority]);

  const filteredNotices = notices.filter((n) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      (n.description && n.description.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Notices" }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-amber-500" />
            Official University Notices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authoritative announcements, examination schedules, academic deadlines, and circulars.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter notices..."
            className="w-full text-xs h-10 pl-9 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Filter Bars: Categories & Priorities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Priority:</span>
          {priorities.map((pri) => (
            <button
              key={pri}
              onClick={() => setSelectedPriority(pri)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                selectedPriority === pri
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {pri}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notices found"
          description={`No notices matched your current filter selection. Try changing the category or search keyword.`}
          actionText="Clear filters"
          actionHref="/notices"
        />
      )}
    </div>
  );
}
