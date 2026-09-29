import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { EventItem } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";
import { StatusBadge } from "../ui/StatusBadge";

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const dateObj = new Date(event.start_time);
  const dayStr = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
  const monthStr = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const isLive = event.status === "LIVE NOW" || event.status === "ONGOING";

  return (
    <div
      className={`wiki-card p-5 flex flex-col justify-between group ${
        isLive ? "ring-1 ring-rose-500/30 dark:ring-rose-500/20" : ""
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <SourceBadge sourceType={event.source_type} size="sm" />
          <StatusBadge status={event.status} />
        </div>

        {/* Date Box + Title Header */}
        <div className="flex items-start gap-3.5 mb-3">
          {/* Calendar date icon */}
          <div className="shrink-0 flex flex-col items-center justify-center w-12 h-14 rounded-xl bg-gradient-to-b from-blue-50 to-indigo-50/70 dark:from-blue-950/60 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 text-center font-bold shadow-xs">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-extrabold">{monthStr}</span>
            <span className="text-lg text-slate-900 dark:text-slate-50 font-black leading-none mt-0.5">{dayStr}</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              <Link href={`/events/${event.slug}`}>{event.title}</Link>
            </h3>
            <span className="inline-block mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/50">
              {event.category}
            </span>
          </div>
        </div>

        {/* Event Metadata: Time, Venue, Organizer */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 my-3.5 bg-slate-50/80 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-medium">{timeStr} IST</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate font-medium">{event.organizer}</span>
            </div>
          )}
        </div>

        {/* Short description */}
        {event.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link
          href={`/events/${event.slug}`}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          View Details →
        </Link>

        {event.registration_url ? (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:scale-102"
          >
            <span>Register</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Details
          </Link>
        )}
      </div>
    </div>
  );
};
