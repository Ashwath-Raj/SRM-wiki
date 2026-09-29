"use client";

import React, { useState } from "react";
import { BUILDINGS, BuildingInfo, RoomLocation } from "@/data/campusMapData";
import { MapPin, Navigation, Info, Compass, Layers, Sparkles } from "lucide-react";

interface CampusMapViewProps {
  selectedBuildingId: string | null;
  onSelectBuilding: (buildingId: string) => void;
  activeDestination?: RoomLocation | null;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  selectedBuildingId,
  onSelectBuilding,
  activeDestination,
}) => {
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingInfo | null>(null);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white shadow-2xl">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg pointer-events-auto">
          <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
          <span className="text-xs font-bold text-slate-200">SRM AP Campus Map (Interactive)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold uppercase">
            Amaravati
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs text-slate-300 pointer-events-auto">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Click any block to view floor plans</span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full aspect-[16/10] min-h-[420px] max-h-[620px] overflow-hidden">
        <svg
          viewBox="0 0 1000 560"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients and drop shadows */}
          <defs>
            <radialGradient id="campusGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
            </radialGradient>

            <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="1000" height="560" fill="url(#campusGlow)" />
          <rect width="1000" height="560" fill="url(#campusGrid)" />

          {/* Green zones / Landscaping */}
          <ellipse cx="500" cy="300" rx="420" ry="200" fill="rgba(16, 185, 129, 0.05)" />
          <path
            d="M 50 490 Q 200 470, 400 480 T 950 490 L 950 560 L 50 560 Z"
            fill="rgba(16, 185, 129, 0.08)"
          />

          {/* Roads & Campus Arteries */}
          {/* Main Ring Road */}
          <path
            d="M 100 460 Q 500 430, 900 460"
            stroke="url(#roadGrad)"
            strokeWidth="24"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 100 460 Q 500 430, 900 460"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            strokeDasharray="8 8"
            fill="none"
          />

          {/* North-South Central Spine */}
          <path
            d="M 500 450 L 500 130"
            stroke="url(#roadGrad)"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 500 450 L 500 130"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* East-West Avenues */}
          <path d="M 230 270 L 800 270" stroke="url(#roadGrad)" strokeWidth="14" fill="none" />
          <path d="M 300 130 L 700 130" stroke="url(#roadGrad)" strokeWidth="12" fill="none" />

          {/* Main Entrance Gate Indicator */}
          <g transform="translate(500, 520)">
            <rect x="-60" y="-18" width="120" height="28" rx="6" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="0" y="0" textAnchor="middle" fill="#93C5FD" fontSize="10" fontWeight="bold" letterSpacing="1">
              MAIN CAMPUS GATE
            </text>
          </g>

          {/* Render Buildings */}
          {BUILDINGS.map((b) => {
            const isSelected = selectedBuildingId === b.id;
            const isDestination = activeDestination?.buildingId === b.id;
            const isHovered = hoveredBuilding?.id === b.id;

            const { x, y, width, height } = b.coordinates;

            return (
              <g
                key={b.id}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectBuilding(b.id)}
                onMouseEnter={() => setHoveredBuilding(b)}
                onMouseLeave={() => setHoveredBuilding(null)}
              >
                {/* Highlight Halo if Selected or Target */}
                {(isSelected || isDestination) && (
                  <rect
                    x={x - 8}
                    y={y - 8}
                    width={width + 16}
                    height={height + 16}
                    rx="20"
                    fill="none"
                    stroke={b.color}
                    strokeWidth="3"
                    strokeDasharray={isSelected ? "none" : "6 6"}
                    className={isSelected ? "animate-pulse" : ""}
                    filter="url(#glow)"
                  />
                )}

                {/* Building Base Shadow */}
                <rect
                  x={x + 4}
                  y={y + 6}
                  width={width}
                  height={height}
                  rx="14"
                  fill="rgba(0, 0, 0, 0.5)"
                />

                {/* Building Structure Body */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="14"
                  fill={isSelected ? b.color : isHovered ? "#334155" : "#1E293B"}
                  stroke={isSelected ? "#FFFFFF" : b.color}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  fillOpacity={isSelected ? 0.25 : 0.85}
                  className="transition-colors duration-200"
                />

                {/* Roof Architectural Accents */}
                <line
                  x1={x + 12}
                  y1={y + 12}
                  x2={x + width - 12}
                  y2={y + 12}
                  stroke={b.color}
                  strokeWidth="2"
                  strokeOpacity="0.4"
                />

                {/* Building Badge Icon & Label */}
                <g transform={`translate(${x + width / 2}, ${y + height / 2 - 10})`}>
                  <circle cx="0" cy="-6" r="16" fill="#0F172A" stroke={b.color} strokeWidth="1.5" />
                  <text
                    x="0"
                    y="-2"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {b.shortCode.slice(0, 3).toUpperCase()}
                  </text>

                  {/* Building Title */}
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="bold"
                    className="drop-shadow"
                  >
                    {b.name}
                  </text>

                  {/* Floor count tag */}
                  <text
                    x="0"
                    y="36"
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="8.5"
                    fontWeight="medium"
                  >
                    {b.totalFloors} Floors • {b.subtitle.split("&")[0]}
                  </text>
                </g>

                {/* Live Destination Indicator Pin */}
                {isDestination && (
                  <g transform={`translate(${x + width - 20}, ${y + 15})`} className="animate-bounce">
                    <circle cx="0" cy="0" r="12" fill="#EF4444" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      📍
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Building Tooltip */}
        {hoveredBuilding && (
          <div className="absolute bottom-4 left-4 z-30 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl max-w-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredBuilding.color }}
              />
              <span className="font-bold text-sm text-white">{hoveredBuilding.name}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{hoveredBuilding.description}</p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{hoveredBuilding.totalFloors} Floors • Click to inspect floor plan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
