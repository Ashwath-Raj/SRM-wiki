"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Building as BuildingIcon,
  Navigation,
  User,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  Info,
  Layers,
  MapPin,
  Utensils,
  Trophy,
  HeartPulse,
  Package,
  ShieldAlert,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import {
  CAMPUS_BUILDINGS,
  CAMPUS_LANDMARKS,
  ALL_ROOMS,
  CATEGORY_LABELS,
  Building,
  RoomLocation,
  Landmark
} from "@/data/campusMapData";

export default function CampusMapPage() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("cv-raman-block");
  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRoom, setActiveRoom] = useState<RoomLocation | null>(null);
  const [activeLandmark, setActiveLandmark] = useState<Landmark | null>(null);
  const [copiedDirection, setCopiedDirection] = useState(false);
  const [zoneFilter, setZoneFilter] = useState<"all" | "academic" | "hostels" | "dining" | "sports">("all");

  const selectedBuilding = useMemo(() => {
    return CAMPUS_BUILDINGS.find((b) => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];
  }, [selectedBuildingId]);

  // Filtered rooms based on search, building, floor, and category
  const filteredRooms = useMemo(() => {
    return ALL_ROOMS.filter((room) => {
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

  // Visible buildings based on zone filter
  const visibleBuildings = useMemo(() => {
    if (zoneFilter === "all") return CAMPUS_BUILDINGS;
    if (zoneFilter === "academic") {
      return CAMPUS_BUILDINGS.filter(b => ["cv-raman-block", "sr-block", "x-lab", "jc-bose-block", "vikram-sarabhai-block"].includes(b.id));
    }
    if (zoneFilter === "hostels") {
      return CAMPUS_BUILDINGS.filter(b => ["ganga-hostel", "yamuna-hostel"].includes(b.id));
    }
    if (zoneFilter === "dining") {
      return CAMPUS_BUILDINGS.filter(b => ["annapurna-mess", "food-court"].includes(b.id));
    }
    if (zoneFilter === "sports") {
      return CAMPUS_BUILDINGS.filter(b => b.id === "sports-complex");
    }
    return CAMPUS_BUILDINGS;
  }, [zoneFilter]);

  const handleCopyDirections = (directions: string) => {
    navigator.clipboard.writeText(directions);
    setCopiedDirection(true);
    setTimeout(() => setCopiedDirection(false), 2000);
  };

  const quickPicks = [
    { label: "Dr. Sravanthi (Cabin 312)", query: "Dr. Naga Sravanthi" },
    { label: "HoD CSE Dr. Sobin", query: "Dr. Sobin" },
    { label: "X-Lab Hackathon Arena", query: "X-Arena" },
    { label: "ALC-1 Active Learning", query: "ALC-1" },
    { label: "Central Library", query: "Central Library" },
    { label: "24/7 Health Clinic", query: "Health Clinic" },
    { label: "Annapurna Mess", query: "Annapurna Mess" },
    { label: "Courier Point", query: "Courier" }
  ];

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="wiki-container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 mb-2">
                <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                <span>Verified Campus Master Plan • Amaravati</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                SRM University-AP Campus Map & Navigator
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Architectural layout of SRM AP (Neerukonda). Explore CV Raman Block, SR Block, X-Lab, Annapurna Mess, Hostels, and locate faculty cabins with step-by-step directions.
              </p>
            </div>

            {/* Global Search Bar */}
            <div className="w-full md:w-88">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty cabin, ALC, lab, room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Find Tags */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Popular Destinations:</span>
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
        {/* Left Column: Interactive Vector Architectural Campus Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <BuildingIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  Campus Layout & Vector Survey
                </h2>
              </div>

              {/* Zone Filter Chips */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs overflow-x-auto">
                <button
                  onClick={() => setZoneFilter("all")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    zoneFilter === "all"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setZoneFilter("academic")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    zoneFilter === "academic"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Academic
                </button>
                <button
                  onClick={() => setZoneFilter("hostels")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    zoneFilter === "hostels"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Hostels
                </button>
                <button
                  onClick={() => setZoneFilter("dining")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    zoneFilter === "dining"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Dining
                </button>
                <button
                  onClick={() => setZoneFilter("sports")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    zoneFilter === "sports"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Sports
                </button>
              </div>
            </div>

            {/* Interactive Real SVG Campus Blueprint */}
            <div className="relative w-full aspect-[10/12] bg-[#0c121e] rounded-xl overflow-hidden border border-slate-800 shadow-2xl select-none">
              <svg viewBox="0 0 1000 1200" className="w-full h-full">
                {/* SVG Blueprint Grid */}
                <defs>
                  <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
                  </pattern>
                  <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0c121e" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="1000" height="1200" fill="#090d16" />
                <rect width="1000" height="1200" fill="url(#campusGrid)" />
                <rect width="1000" height="1200" fill="url(#campusGlow)" />

                {/* Main Campus Internal Roadways & Avenues */}
                {/* North-South Central Spine */}
                <path
                  d="M 500 50 L 500 1150"
                  stroke="#1e293b"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M 500 50 L 500 1150"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                />

                {/* East-West Cross Link towards Gate 3 */}
                <path
                  d="M 420 420 L 920 420"
                  stroke="#1e293b"
                  strokeWidth="20"
                  strokeLinecap="round"
                />

                {/* Southern Spine to CV Raman & Sports */}
                <path
                  d="M 150 820 L 700 820"
                  stroke="#1e293b"
                  strokeWidth="20"
                  strokeLinecap="round"
                />

                {/* Gate 3 Security Entrance Marker */}
                <g transform="translate(890, 400)">
                  <rect width="40" height="30" rx="6" fill="#2563EB" opacity="0.9" />
                  <text x="20" y="19" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    GATE 3
                  </text>
                </g>

                {/* Exit Gate Marker */}
                <g transform="translate(860, 1145)">
                  <rect width="50" height="24" rx="6" fill="#475569" opacity="0.9" />
                  <text x="25" y="16" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    EXIT GATE
                  </text>
                </g>

                {/* Campus Landmarks (Fountain, Plazas, Courts) */}
                {CAMPUS_LANDMARKS.map((lm) => (
                  <g
                    key={lm.id}
                    onClick={() => setActiveLandmark(lm)}
                    className="cursor-pointer group/lm transition-all"
                  >
                    <path
                      d={lm.path}
                      fill={lm.color}
                      opacity={activeLandmark?.id === lm.id ? 0.9 : 0.45}
                      stroke={lm.color}
                      strokeWidth="1.5"
                      className="transition-all hover:opacity-80"
                    />
                    <circle cx={lm.cx} cy={lm.cy} r="3" fill="#ffffff" opacity="0.8" />
                    <text
                      x={lm.cx}
                      y={lm.cy - 8}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {lm.name}
                    </text>
                  </g>
                ))}

                {/* Campus Real Surveyed Buildings */}
                {CAMPUS_BUILDINGS.map((building) => {
                  const isSelected = selectedBuildingId === building.id;

                  return (
                    <g
                      key={building.id}
                      onClick={() => {
                        setSelectedBuildingId(building.id);
                        setSelectedFloor("all");
                        setActiveLandmark(null);
                      }}
                      className="cursor-pointer group/bldg transition-all"
                    >
                      {/* Selection Glow Pulse */}
                      {isSelected && (
                        <path
                          d={building.path}
                          fill="none"
                          stroke={building.color}
                          strokeWidth="8"
                          strokeOpacity="0.4"
                          className="animate-pulse"
                        />
                      )}

                      {/* Actual Architectural Building Polygon */}
                      <path
                        d={building.path}
                        fill={isSelected ? building.color : "#1e293b"}
                        fillOpacity={isSelected ? 0.95 : 0.8}
                        stroke={building.color}
                        strokeWidth={isSelected ? "3" : "1.8"}
                        className="transition-all hover:fill-opacity-100"
                      />

                      {/* Building Name Tag */}
                      <text
                        x={building.cx}
                        y={building.cy - 4}
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-md tracking-tight"
                      >
                        {building.name}
                      </text>

                      {/* Subtitle / Floor Count */}
                      <text
                        x={building.cx}
                        y={building.cy + 12}
                        fill={isSelected ? "#ffffff" : "#94a3b8"}
                        fontSize="9.5"
                        textAnchor="middle"
                        className="pointer-events-none font-medium"
                      >
                        {building.totalFloors} {building.totalFloors === 1 ? "Level" : "Levels"} • {building.shortCode}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Building Directory Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
              {visibleBuildings.map((b) => {
                const isSelected = selectedBuildingId === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBuildingId(b.id);
                      setSelectedFloor("all");
                      setActiveLandmark(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 dark:border-blue-500 shadow-sm"
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

          {/* Active Landmark or Active Building Deep-Dive Panel */}
          {activeLandmark ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    {activeLandmark.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveLandmark(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeLandmark.description}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
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

                {/* Level / Floor Selector */}
                {selectedBuilding.floors.length > 1 && (
                  <div className="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setSelectedFloor("all")}
                      className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                        selectedFloor === "all"
                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      All Levels
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
                        L{fl}
                      </button>
                    ))}
                  </div>
                )}
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
          )}
        </div>

        {/* Right Column: Room Finder, Faculty Cabins & Turn-by-Turn Walking Directions */}
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
                            {bldg?.shortCode} • Level {room.floor}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1.5">
                          {room.name}
                        </h3>
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                          Location: {room.roomNumber}
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
                    Room: {activeRoom.roomNumber} (Level {activeRoom.floor})
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
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
