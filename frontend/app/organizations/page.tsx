"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OrganizationCard } from "@/components/organizations/OrganizationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrganizationItem } from "@/types";
import { Building2 } from "lucide-react";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<OrganizationItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  const types = ["All", "LAB", "CHAPTER", "COMMUNITY", "STUDENT_ORGANIZATION"];

  useEffect(() => {
    async function loadOrgs() {
      setIsLoading(true);
      try {
        let url = "http://localhost:8000/api/v1/organizations";
        if (selectedType !== "All") url += `?type=${encodeURIComponent(selectedType)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setOrgs(data);
        }
      } catch (err) {
        console.error("Error loading organizations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrgs();
  }, [selectedType]);

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Organizations" }]} />

      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-7 h-7 text-indigo-600" />
          Clubs, Chapters & Research Labs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore student-led innovation laboratories, computing chapters, and community societies at SRM AP.
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : orgs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No organizations found"
          description="No student clubs or laboratories matched this filter."
          actionText="View all organizations"
          actionHref="/organizations"
        />
      )}
    </div>
  );
}
