"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProjectItem } from "@/types";
import { Code2, PlusCircle, Search } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const departments = ["All", "CSE", "ECE", "Mechanical", "Civil"];

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      try {
        let url = "http://localhost:8000/api/v1/projects?";
        if (selectedDept !== "All") url += `department=${encodeURIComponent(selectedDept)}&`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, [selectedDept]);

  const filteredProjects = projects.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const techs = (p.technologies || []).join(" ").toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      techs.includes(q)
    );
  });

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Projects" }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-purple-600" />
            Student Projects Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover innovative software systems, robotics hardware, and research repositories built by SRM AP students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by tech or title..."
              className="w-full text-xs h-10 pl-9 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>

          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Project</span>
          </Link>
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDept === dept
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="No student innovations matched the current filters. Have you built something exciting?"
          actionText="Submit your project"
          actionHref="/submit"
        />
      )}
    </div>
  );
}
