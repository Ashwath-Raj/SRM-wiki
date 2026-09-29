"use client";

import React, { useState, useMemo } from "react";
import { CAMPUS_ROOMS, BUILDINGS, RoomLocation } from "@/data/campusMapData";
import { Search, MapPin, User, Navigation, Layers, X, Filter } from "lucide-react";

interface LocationSearchProps {
  onSelectRoom: (room: RoomLocation) => void;
  onGetDirections: (room: RoomLocation) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectRoom,
  onGetDirections,
}) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Spaces" },
    { id: "faculty", label: "Faculty Cabins" },
    { id: "seminar", label: "Seminar & Auditoriums" },
    { id: "lab", label: "Labs & Workstations" },
    { id: "admin", label: "Admin & Services" },
    { id: "dining", label: "Dining & Mess" },
  ];

  const filteredRooms = useMemo(() => {
    return CAMPUS_ROOMS.filter((room) => {
      const matchesCategory =
        activeCategory === "all" || room.type === activeCategory;

      if (!matchesCategory) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        room.name.toLowerCase().includes(q) ||
        room.code.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q) ||
        (room.facultyName && room.facultyName.toLowerCase().includes(q)) ||
        (room.department && room.department.toLowerCase().includes(q)) ||
        room.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            <span>Search SRM AP Campus Directory</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Locate faculty cabins, seminar halls, labs, administrative offices, and cafeterias.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by professor (e.g. 'Dr. Naga Sravanthi'), room 'ALC-101', 'X-Lab', or 'CSE Lab'..."
          className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Results List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => {
            const building = BUILDINGS.find((b) => b.id === room.buildingId);

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className="group p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {room.type === "faculty" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {room.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        {room.code}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {building?.name} •{" "}
                      {room.floor === 0 ? "Ground Floor" : `Floor ${room.floor}`}
                      {room.department && ` • ${room.department.split("Department of ")[1] || room.department}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGetDirections(room);
                    }}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
                    title="Get Walking Route"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No campus spaces found matching &ldquo;{query}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};
