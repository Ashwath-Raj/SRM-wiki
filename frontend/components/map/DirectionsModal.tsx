"use client";

import React, { useState } from "react";
import { RoomLocation, BUILDINGS, WAYPOINTS, getWalkingRoute } from "@/data/campusMapData";
import {
  Navigation,
  MapPin,
  Clock,
  Footprints,
  ArrowRight,
  X,
  Compass,
  CheckCircle2,
  Building,
} from "lucide-react";

interface DirectionsModalProps {
  room: RoomLocation | null;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ room, onClose }) => {
  const [startPoint, setStartPoint] = useState<string>("main-gate");

  if (!room) return null;

  const building = BUILDINGS.find((b) => b.id === room.buildingId);
  const route = getWalkingRoute(startPoint, room);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Walking Directions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn-by-turn route to <span className="font-semibold text-blue-600 dark:text-blue-400">{room.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Start and End Selector */}
        <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
          {/* Starting point select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-500" />
              <span>Starting Location:</span>
            </label>
            <select
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(WAYPOINTS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Display */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Destination:</span>
            <div className="text-right">
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {room.code} • {building?.name}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {room.floor === 0 ? "Ground Floor" : `Floor ${room.floor}`}
              </div>
            </div>
          </div>
        </div>

        {/* Route Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-bold uppercase">
                Est. Time
              </div>
              <div className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                ~{route.estimatedMinutes} mins walk
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2.5">
            <Footprints className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-bold uppercase">
                Distance
              </div>
              <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                ~{route.distanceMeters} meters
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Directions */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Step-by-Step Route
          </h4>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {route.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors"
        >
          Close Directions
        </button>
      </div>
    </div>
  );
};
