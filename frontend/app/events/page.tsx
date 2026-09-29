"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { EventItem } from "@/types";
import { Calendar, Filter, Sparkles } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tab, setTab] = useState<"all" | "today" | "upcoming">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "Workshop", "Hackathon", "Guest Lecture", "Technical", "Cultural", "Sports"];

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        let url = "http://localhost:8000/api/v1/events?";
        if (tab === "today") url += "today_only=true&";
        else if (tab === "upcoming") url += "upcoming_only=true&";
        if (selectedCategory !== "All") url += `category=${encodeURIComponent(selectedCategory)}&`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, [tab, selectedCategory]);

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Events" }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-blue-600" />
            Campus Events & Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover workshops, hackathons, seminars, and cultural festivals happening across campus.
          </p>
        </div>

        {/* View Tabs: All, Today, Upcoming */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === "all"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setTab("today")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              tab === "today"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Today</span>
          </button>
          <button
            onClick={() => setTab("upcoming")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === "upcoming"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Upcoming
          </button>
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

      {/* Grid of Events */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No events found"
          description={`No scheduled events found for ${tab === "today" ? "today" : "the selected filters"}. Check back soon!`}
          actionText="View all events"
          actionHref="/events"
        />
      )}
    </div>
  );
}
