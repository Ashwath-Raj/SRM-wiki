"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { OpportunityItem } from "@/types";
import { Briefcase } from "lucide-react";

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<OpportunityItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  const types = ["All", "INTERNSHIP", "RESEARCH", "HACKATHON", "SCHOLARSHIP"];

  useEffect(() => {
    async function loadOpps() {
      setIsLoading(true);
      try {
        let url = "http://localhost:8000/api/v1/opportunities";
        if (selectedType !== "All") url += `?type=${encodeURIComponent(selectedType)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setOpps(data);
        }
      } catch (err) {
        console.error("Error loading opportunities:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOpps();
  }, [selectedType]);

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Opportunities" }]} />

      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <Briefcase className="w-7 h-7 text-teal-600" />
          Fellowships, Hackathons & Internships
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Active campus placement drives, funded research fellowships, and hackathon registrations.
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === t
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : opps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No active opportunities"
          description="There are currently no open calls matching this type. Check back soon for new drives."
          actionText="View all opportunities"
          actionHref="/opportunities"
        />
      )}
    </div>
  );
}
