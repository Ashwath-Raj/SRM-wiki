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

  return (
    <div className="wiki-card p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <SourceBadge sourceType={event.source_type} size="sm" />
          <StatusBadge status={event.status} />
        </div>

        {/* Date Box + Title Header */}
        <div className="flex items-start gap-3.5 mb-3">
          {/* Calendar date icon */}
          <div className="shrink-0 flex flex-col items-center justify-center w-12 h-13 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-center font-bold">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider">{monthStr}</span>
            <span className="text-base text-slate-900 dark:text-slate-100 leading-none">{dayStr}</span>
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              <Link href={`/events/${event.slug}`}>{event.title}</Link>
            </h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{event.category}</span>
          </div>
        </div>

        {/* Event Metadata: Time, Venue, Organizer */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 my-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{timeStr}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.organizer}</span>
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
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link
          href={`/events/${event.slug}`}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          View Details
        </Link>

        {event.registration_url ? (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <span>Register</span>
            <span className="text-xs">↗</span>
          </a>
        ) : (
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Details
          </Link>
        )}
      </div>
    </div>
  );
};
