"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  BookOpen,
  Calendar,
  Home,
  CreditCard,
  Briefcase,
  Bell,
  Code,
  Activity,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import { Portal, EventItem, NoticeItem, ProjectItem, PulseData } from "@/types";
import { PortalCard } from "@/components/portals/PortalCard";
import { EventCard } from "@/components/events/EventCard";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [quickPortals, setQuickPortals] = useState<Portal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [pulseRes, portalsRes] = await Promise.allSettled([
          fetch("http://localhost:8000/api/v1/pulse").then((r) => r.json()),
          fetch("http://localhost:8000/api/v1/portals?quick_only=true").then((r) => r.json()),
        ]);

        if (pulseRes.status === "fulfilled") {
          setPulseData(pulseRes.value);
        }
        if (portalsRes.status === "fulfilled") {
          setQuickPortals(portalsRes.value);
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularKeywords = [
    { label: "Exams", q: "exam" },
    { label: "Canvas LMS", q: "lms" },
    { label: "Library", q: "library" },
    { label: "Academic Calendar", q: "calendar" },
    { label: "Hostels", q: "hostel" },
    { label: "Placements", q: "placement" },
  ];

  const suggestedAIPrompts = [
    "Where is the examination registration portal?",
    "What events and workshops are happening today?",
    "What is the minimum attendance rule?",
    "Show student innovation projects in AI",
  ];

  return (
    <div className="space-y-12 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="wiki-container text-center pt-4 pb-8 sm:pt-8 sm:pb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-4 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Official SRM University-AP Digital Ecosystem</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-3 sm:mb-4">
          SRM AP Wiki
        </h1>

        <p className="text-base sm:text-xl font-normal text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Everything SRM AP, in one place.
        </p>

        {/* Global Search Bar */}
        <div className="max-w-2xl mx-auto mb-5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search portals, exams, notices, events, projects, regulations..."
              className="w-full h-13 sm:h-14 pl-12 pr-28 text-sm sm:text-base rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular Keyword Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Popular:</span>
          {popularKeywords.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(`/search?q=${encodeURIComponent(item.q)}`)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. QUICK ACCESS CHIPS */}
      <section className="wiki-container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            Quick Access Portals
          </h2>
          <Link
            href="/portals"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Portals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {quickPortals.slice(0, 6).map((portal) => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-card p-3 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600">
                  {portal.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                  <span>Open</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 3. SRM AP PULSE SUMMARY BANNER */}
      {pulseData && (
        <section className="wiki-container">
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live Campus Pulse
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white">What&apos;s happening at SRM AP right now</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Real-time aggregation of today&apos;s lectures, urgent examination circulars, and impending project deadlines.
                </p>
              </div>

              {/* Stat Chips */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Link
                  href="/notices"
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex flex-col items-center transition-colors"
                >
                  <span className="text-lg font-extrabold">{pulseData.counts.notices || 5}</span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wide">Notices</span>
                </Link>
                <Link
                  href="/events"
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex flex-col items-center transition-colors"
                >
                  <span className="text-lg font-extrabold">{pulseData.counts.today_events || 2}</span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wide">Today</span>
                </Link>
                <Link
                  href="/opportunities"
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex flex-col items-center transition-colors"
                >
                  <span className="text-lg font-extrabold">{pulseData.counts.deadlines || 3}</span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wide">Deadlines</span>
                </Link>
                <Link
                  href="/pulse"
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm ml-1"
                >
                  <span>Open Pulse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. TODAY AT SRM AP */}
      <section className="wiki-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today at SRM AP
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Workshops, guest lectures, and student activities scheduled for today
            </p>
          </div>
          <Link
            href="/events"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : pulseData && pulseData.today_events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pulseData.today_events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pulseData?.upcoming_events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 5. LATEST NOTICES */}
      <section className="wiki-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Latest Notices & Circulars
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official university circulars with source verification
            </p>
          </div>
          <Link
            href="/notices"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : pulseData && pulseData.new_notices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pulseData.new_notices.slice(0, 4).map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 6. STUDENT PROJECTS */}
      <section className="wiki-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-600" />
              Student Innovations & Projects
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open source tools, robotics rovers, and research software built by SRM AP students
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        ) : pulseData && pulseData.recent_projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pulseData.recent_projects.slice(0, 3).map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 7. ASK SRM AP WIKI (AI Entry Point) */}
      <section className="wiki-container">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Navigation & Discovery</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
              Ask SRM AP Wiki
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Don&apos;t know where to look? Ask natural-language questions grounded strictly in verified university sources, academic regulations, and portal directories.
            </p>

            {/* Quick Prompt Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {suggestedAIPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/ai?q=${encodeURIComponent(prompt)}`)}
                  className="p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors group flex items-center justify-between"
                >
                  <span className="line-clamp-1 italic">&ldquo;{prompt}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>

            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/30"
            >
              <span>Open AI Assistant</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
