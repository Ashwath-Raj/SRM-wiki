"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PortalCard } from "@/components/portals/PortalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Portal } from "@/types";
import { Award, Search } from "lucide-react";

export default function PortalsPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    "Academic",
    "Examination",
    "Student",
    "Library",
    "Career",
    "Finance",
    "Administration",
  ];

  useEffect(() => {
    async function loadPortals() {
      setIsLoading(true);
      try {
        const url =
          selectedCategory === "All"
            ? "http://localhost:8000/api/v1/portals"
            : `http://localhost:8000/api/v1/portals?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPortals(data);
        }
      } catch (err) {
        console.error("Error loading portals:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPortals();
  }, [selectedCategory]);

  const filteredPortals = portals.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Portals" }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-blue-600" />
            University Portals Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified official access points for SRM University-AP portals and digital services.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter portals..."
            className="w-full text-xs h-10 pl-9 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
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

      {/* Grid of Portals */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : filteredPortals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPortals.map((portal) => (
            <PortalCard key={portal.id} portal={portal} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No portals found"
          description={`No portals matched the category "${selectedCategory}" or search query "${searchFilter}".`}
          actionText="Reset filters"
          actionHref="/portals"
        />
      )}
    </div>
  );
}
