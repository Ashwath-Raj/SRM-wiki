"use client";

import React, { useState } from "react";
import { BUILDINGS, CAMPUS_ROOMS, RoomLocation } from "@/data/campusMapData";
import {
  Layers,
  User,
  Clock,
  Mail,
  Navigation,
  Sparkles,
  Building,
  CheckCircle2,
  Compass,
} from "lucide-react";

interface FloorPlanViewerProps {
  buildingId: string;
  onSelectRoom: (room: RoomLocation) => void;
  selectedRoom: RoomLocation | null;
  onGetDirections: (room: RoomLocation) => void;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  buildingId,
  onSelectRoom,
  selectedRoom,
  onGetDirections,
}) => {
  const building = BUILDINGS.find((b) => b.id === buildingId) || BUILDINGS[0];
  const [activeFloor, setActiveFloor] = useState<number>(
    selectedRoom && selectedRoom.buildingId === buildingId ? selectedRoom.floor : building.floors[0]
  );

  // Filter rooms for this building and floor
  const floorRooms = CAMPUS_ROOMS.filter(
    (r) => r.buildingId === building.id && r.floor === activeFloor
  );

  const getFloorName = (fl: number) => {
    if (fl === 0) return "Ground Floor";
    if (fl === 1) return "1st Floor";
    if (fl === 2) return "2nd Floor";
    if (fl === 3) return "3rd Floor";
    return `${fl}th Floor`;
  };

  const getTypeBadge = (type: RoomLocation["type"]) => {
    switch (type) {
      case "faculty":
        return { label: "Faculty Cabin", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900" };
      case "seminar":
        return { label: "Seminar / Audi", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900" };
      case "lab":
        return { label: "Research Lab", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" };
      case "admin":
        return { label: "Administrative", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900" };
      case "dining":
        return { label: "Dining & Food", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900" };
      case "library":
        return { label: "Library Section", bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900" };
      default:
        return { label: "Campus Facility", bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800" };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
      {/* Building Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: building.color }}
            />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {building.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {building.shortCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {building.description}
          </p>
        </div>

        {/* Floor Level Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl overflow-x-auto max-w-full">
          {building.floors.map((fl) => (
            <button
              key={fl}
              onClick={() => setActiveFloor(fl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFloor === fl
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
              }`}
            >
              {fl === 0 ? "Ground" : `L${fl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Current Floor Plan Information Bar */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
            {getFloorName(activeFloor)} Layout
          </span>
          <span className="text-[11px] text-slate-400">
            ({floorRooms.length} mapped spaces)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Faculty
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Seminar
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Labs
          </span>
        </div>
      </div>

      {/* Interactive Floor Rooms Grid */}
      {floorRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {floorRooms.map((room) => {
            const isSelected = selectedRoom?.id === room.id;
            const badge = getTypeBadge(room.type);

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                    : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-500/40 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {room.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                    {room.code}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {room.description}
                </p>

                {/* Faculty details if applicable */}
                {room.facultyName && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>{room.facultyName}</span>
                    </div>
                    {room.timings && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Hours: {room.timings}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>View Room Details</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGetDirections(room);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Building className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
            Classrooms & Study Areas
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Standard smart classrooms, open student discussion lounges, and high-speed campus Wi-Fi zones are situated along this corridor.
          </p>
        </div>
      )}

      {/* Building Amenities Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Building Amenities & Facilities
        </h4>
        <div className="flex flex-wrap gap-2">
          {building.amenities.map((amenity, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
