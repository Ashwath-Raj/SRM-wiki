"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { EventCard } from "@/components/events/EventCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { PulseData } from "@/types";
import { Activity, Bell, Calendar, Clock, GitCommit, Sparkles, ArrowRight } from "lucide-react";

export default function PulsePage() {
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPulse() {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/v1/pulse");
        if (res.ok) {
          const data = await res.json();
          setPulse(data);
        }
      } catch (err) {
        console.error("Error loading pulse:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPulse();
  }, []);

  return (
    <div className="wiki-container py-6 space-y-10">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Pulse" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Campus Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            SRM AP Pulse
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Real-time campus stream tracking new notices, today&apos;s lectures, upcoming registration deadlines, and newly verified student innovations.
          </p>
        </div>

        {pulse && (
          <div className="grid grid-cols-3 gap-2 text-center shrink-0">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block">{pulse.counts.today_events || 2}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Today</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xl font-extrabold text-amber-500 block">{pulse.counts.notices || 5}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Notices</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xl font-extrabold text-rose-500 block">{pulse.counts.deadlines || 3}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Deadlines</span>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : pulse ? (
        <>
          {/* Section 1: Today's Schedule */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Happening Today on Campus</span>
              </h2>
              <Link href="/events" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                All Events →
              </Link>
            </div>

            {pulse.today_events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pulse.today_events.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
                No events currently running today. View upcoming events below.
              </div>
            )}
          </section>

          {/* Section 2: Latest Official Notices */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>Recently Published Circulars</span>
              </h2>
              <Link href="/notices" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                All Notices →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pulse.new_notices.slice(0, 4).map((n) => (
                <NoticeCard key={n.id} notice={n} />
              ))}
            </div>
          </section>

          {/* Section 3: Approaching Deadlines */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                <span>Impending Deadlines</span>
              </h2>
              <Link href="/opportunities" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                All Opportunities →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pulse.deadlines.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>

          {/* Section 4: Live Change Activity Feed */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-indigo-600" />
              <span>Knowledge Base Activity Feed</span>
            </h2>

            <div className="wiki-card divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
              {pulse.recent_changes.map((change) => {
                const timeStr = new Date(change.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={change.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 shrink-0 uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {change.event_type.replace("_", " ")}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 truncate">{change.summary}</span>
                    </div>
                    <span className="text-slate-400 shrink-0 text-[11px]">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
