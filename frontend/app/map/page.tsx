"use client";

import React, { useState } from "react";
import { CampusMapView } from "@/components/map/CampusMapView";
import { FloorPlanViewer } from "@/components/map/FloorPlanViewer";
import { LocationSearch } from "@/components/map/LocationSearch";
import { DirectionsModal } from "@/components/map/DirectionsModal";
import { RoomLocation, BUILDINGS } from "@/data/campusMapData";
import {
  Compass,
  MapPin,
  Building2,
  Layers,
  Sparkles,
  Search,
  Navigation,
  Share2,
} from "lucide-react";

export default function CampusMapPage() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("block-a");
  const [selectedRoom, setSelectedRoom] = useState<RoomLocation | null>(null);
  const [directionsRoom, setDirectionsRoom] = useState<RoomLocation | null>(null);

  const handleSelectRoom = (room: RoomLocation) => {
    setSelectedRoom(room);
    setSelectedBuildingId(room.buildingId);
  };

  const handleGetDirections = (room: RoomLocation) => {
    setDirectionsRoom(room);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="wiki-container space-y-8">
        {/* Header Title & Intro Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/80">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>SRM University-AP Campus Navigation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Campus Map & Floor Finder
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Interactive 2.5D visual campus guide to locate faculty cabins, seminar halls, research labs, dining hubs, and administrative offices across SRM AP.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">8</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Blocks Mapped</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">60+</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Cabins & Labs</div>
            </div>
          </div>
        </div>

        {/* Master Interactive SVG Campus Map */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Campus Master Plan (Click a Building to Inspect)</span>
            </h2>
            <span className="text-xs text-slate-500">Selected: <strong className="text-blue-600 dark:text-blue-400">{BUILDINGS.find(b => b.id === selectedBuildingId)?.name}</strong></span>
          </div>

          <CampusMapView
            selectedBuildingId={selectedBuildingId}
            onSelectBuilding={(bId) => {
              setSelectedBuildingId(bId);
              setSelectedRoom(null);
            }}
            activeDestination={directionsRoom}
          />
        </section>

        {/* Two-Column Explorer: Left = Floor Plan, Right = Directory Search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Floor Plan Viewer (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <FloorPlanViewer
              buildingId={selectedBuildingId}
              onSelectRoom={handleSelectRoom}
              selectedRoom={selectedRoom}
              onGetDirections={handleGetDirections}
            />
          </div>

          {/* Directory Search & Faculty Finder (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <LocationSearch
              onSelectRoom={handleSelectRoom}
              onGetDirections={handleGetDirections}
            />

            {/* Quick Tips Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <h4 className="font-bold text-sm">Need Help Finding a Lab?</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                You can ask the integrated AI Assistant anytime: <span className="font-semibold text-white">&ldquo;Where is the GDG Hackathon at X-Lab?&rdquo;</span> or <span className="font-semibold text-white">&ldquo;How do I reach Dr. Naga Sravanthi&apos;s cabin in Block A?&rdquo;</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Walking Directions Modal */}
      <DirectionsModal
        room={directionsRoom}
        onClose={() => setDirectionsRoom(null)}
      />
    </div>
  );
}
