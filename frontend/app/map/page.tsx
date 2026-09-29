"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Search,
  Layers,
  Building as BuildingIcon,
  Navigation,
  User,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Copy,
  Info,
  ChevronRight,
  Maximize2
} from "lucide-react";
import {
  CAMPUS_BUILDINGS,
  ALL_ROOMS,
  CATEGORY_LABELS,
  Building,
  RoomLocation
} from "@/data/campusMapData";

export default function CampusMapPage() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("block-a");
  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRoom, setActiveRoom] = useState<RoomLocation | null>(null);
  const [copiedDirection, setCopiedDirection] = useState(false);

  const selectedBuilding = useMemo(() => {
    return CAMPUS_BUILDINGS.find((b) => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];
  }, [selectedBuildingId]);

  // Filtered rooms based on search, building, floor, and category
  const filteredRooms = useMemo(() => {
    return ALL_ROOMS.filter((room) => {
      // If user is searching globally, don't restrict strictly to building unless they cleared search
      const matchesSearch =
        searchQuery.trim() === "" ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.facultyName && room.facultyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.department && room.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBuilding = searchQuery.trim() !== "" ? true : room.buildingId === selectedBuildingId;
      const matchesFloor = selectedFloor === "all" || room.floor === selectedFloor;
      const matchesCategory = selectedCategory === "all" || room.category === selectedCategory;

      return matchesSearch && matchesBuilding && matchesFloor && matchesCategory;
    });
  }, [selectedBuildingId, selectedFloor, searchQuery, selectedCategory]);

  const handleCopyDirections = (directions: string) => {
    navigator.clipboard.writeText(directions);
    setCopiedDirection(true);
    setTimeout(() => setCopiedDirection(false), 2000);
  };

  const quickPicks = [
    { label: "GDG Hackathon (X-Lab)", query: "X-Lab Main Auditorium" },
    { label: "Dr. Sravanthi (Cabin A-108)", query: "Dr. Naga Sravanthi" },
    { label: "ALC Seminar Hall", query: "ALC Seminar Hall" },
    { label: "Student Affairs (DSA)", query: "Directorate of Student Affairs" },
    { label: "24/7 Health Clinic", query: "Health Center" },
  ];

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="wiki-container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 mb-2">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Interactive Campus Navigator</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                SRM AP Campus Map & Floor Finder
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Explore campus blocks, search faculty cabins, research labs, lecture halls, and get instant step-by-step walking directions.
              </p>
            </div>

            {/* Global Search Bar */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty, cabin, lab, hall..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Find Tags */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick Jump:</span>
            {quickPicks.map((pick) => (
              <button
                key={pick.label}
                onClick={() => setSearchQuery(pick.query)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-all font-medium flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>{pick.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wiki-container mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Vector 2D Campus Map & Building Selector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BuildingIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  Campus Layout & Zones
                </h2>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Click any building to inspect
              </span>
            </div>

            {/* Interactive SVG Campus Canvas */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
              <svg viewBox="0 0 1050 480" className="w-full h-full select-none">
                {/* Background Grid & Walkways */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                  <linearGradient id="mainRoad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>
                <rect width="1050" height="480" fill="#090d16" />
                <rect width="1050" height="480" fill="url(#grid)" opacity="0.6" />

                {/* Campus Main Walkways / Avenues */}
                <path d="M 50 230 L 1000 230" stroke="#334155" strokeWidth="22" strokeLinecap="round" opacity="0.7" />
                <path d="M 390 50 L 390 420" stroke="#334155" strokeWidth="18" strokeLinecap="round" opacity="0.7" />
                <path d="M 620 50 L 620 420" stroke="#334155" strokeWidth="18" strokeLinecap="round" opacity="0.7" />
                <path d="M 840 50 L 840 420" stroke="#334155" strokeWidth="16" strokeLinecap="round" opacity="0.7" />

                {/* Entry Gate Indicator */}
                <g transform="translate(30, 215)">
                  <rect width="50" height="30" rx="6" fill="#2563EB" opacity="0.8" />
                  <text x="25" y="19" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    GATE 1
                  </text>
                </g>

                {/* Campus Buildings SVG Render */}
                {CAMPUS_BUILDINGS.map((building) => {
                  const isSelected = selectedBuildingId === building.id;
                  const { x, y, width, height } = building.coordinates;

                  return (
                    <g
                      key={building.id}
                      onClick={() => {
                        setSelectedBuildingId(building.id);
                        setSelectedFloor("all");
                      }}
                      className="cursor-pointer transition-all duration-300"
                    >
                      {/* Selection Glow Pulse */}
                      {isSelected && (
                        <rect
                          x={x - 6}
                          y={y - 6}
                          width={width + 12}
                          height={height + 12}
                          rx="14"
                          fill="none"
                          stroke={building.color}
                          strokeWidth="3"
                          strokeDasharray="6 4"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Building Body */}
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx="10"
                        fill={isSelected ? building.color : "#1e293b"}
                        stroke={building.color}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                        opacity={isSelected ? 0.95 : 0.8}
                        className="transition-all hover:opacity-100"
                      />

                      {/* Building Name & Label */}
                      <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {building.name}
                      </text>

                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 10}
                        fill={isSelected ? "#ffffff" : "#94a3b8"}
                        fontSize="10"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {building.totalFloors} Floors • {building.rooms.length} Key Rooms
                      </text>

                      {/* Mini Floor Count Tag */}
                      <rect
                        x={x + width - 36}
                        y={y + 6}
                        width="30"
                        height="16"
                        rx="4"
                        fill="#000000"
                        opacity="0.4"
                      />
                      <text
                        x={x + width - 21}
                        y={y + 18}
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {building.shortCode}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Building Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
              {CAMPUS_BUILDINGS.map((b) => {
                const isSelected = selectedBuildingId === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBuildingId(b.id);
                      setSelectedFloor("all");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {b.name}
                      </span>
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: b.color }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {b.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Building Deep-Dive Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedBuilding.color }}
                  />
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {selectedBuilding.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedBuilding.description}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedFloor("all")}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    selectedFloor === "all"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  All Floors
                </button>
                {selectedBuilding.floors.map((fl) => (
                  <button
                    key={fl}
                    onClick={() => setSelectedFloor(fl)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedFloor === fl
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {fl === 0 ? "G" : `L${fl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Landmarks in Building */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Key Facilities & Landmarks:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedBuilding.keyLandmarks.map((lm) => (
                  <span
                    key={lm}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    📍 {lm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Room Matrix & Turn-by-Turn Walking Directions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              }`}
            >
              All Types ({filteredRooms.length})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([catKey, catVal]) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  selectedCategory === catKey
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                }`}
              >
                {catVal.label}
              </button>
            ))}
          </div>

          {/* Room Directory List */}
          <div className="space-y-3">
            {filteredRooms.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <div className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  No rooms or cabins found
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your floor filter, category, or search keywords.
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const isSelected = activeRoom?.id === room.id;
                const catInfo = CATEGORY_LABELS[room.category];
                const bldg = CAMPUS_BUILDINGS.find((b) => b.id === room.buildingId);

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${catInfo.bg} ${catInfo.color}`}
                          >
                            {catInfo.label}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {bldg?.shortCode} • {room.floor === 0 ? "Ground Floor" : `Floor ${room.floor}`}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1.5">
                          {room.name}
                        </h3>
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                          Room #{room.roomNumber}
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                        <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Faculty Cabin Specific Details */}
                    {room.facultyName && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          <span>{room.facultyName}</span>
                        </div>
                        {room.timings && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>{room.timings}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Active Selected Room Direction Card Modal */}
          {activeRoom && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/90 to-slate-900 border border-blue-500/40 text-white shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Step-by-Step Directions
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {activeRoom.name}
                  </h3>
                  <div className="text-xs text-blue-200 mt-0.5 font-mono">
                    Target: {activeRoom.roomNumber} ({activeRoom.floor === 0 ? "Ground Floor" : `Floor ${activeRoom.floor}`})
                  </div>
                </div>

                <button
                  onClick={() => setActiveRoom(null)}
                  className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-400/20 text-xs text-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <Compass className="w-4 h-4" />
                  <span>Walking Route:</span>
                </div>
                <p className="leading-relaxed text-slate-100">
                  {activeRoom.directions}
                </p>
              </div>

              {activeRoom.facultyEmail && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeRoom.facultyEmail}</span>
                  </div>
                  <a
                    href={`mailto:${activeRoom.facultyEmail}`}
                    className="font-bold text-blue-300 hover:text-white transition-colors"
                  >
                    Email Faculty →
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopyDirections(activeRoom.directions)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md"
                >
                  {copiedDirection ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Copied Directions!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Directions</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
