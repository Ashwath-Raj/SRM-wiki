import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Calendar, Clock, MapPin, Users, ExternalLink, ShieldCheck, ArrowLeft } from "lucide-react";
import { EventItem } from "@/types";

async function getEvent(slug: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/events/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const dateObj = new Date(event.start_time);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs
        items={[
          { label: "Explore", href: "/explore" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <div className="max-w-3xl mx-auto my-6 space-y-6">
        <div className="wiki-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <SourceBadge sourceType={event.source_type} size="md" />
            <StatusBadge status={event.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {event.title}
          </h1>

          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider">
            Category: {event.category}
          </div>

          {/* Quick Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Date</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{formattedDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Time</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{timeStr}</span>
              </div>
            </div>

            {event.venue && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Venue</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{event.venue}</span>
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Organized By</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{event.organizer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About the Event</h3>
              <p>{event.description}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all events</span>
            </Link>

            {event.registration_url && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <span>Register for Event</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
