"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Database,
  Globe,
  Award,
  Calendar,
  Bell,
  Code2,
  ExternalLink,
  Play,
  Activity,
} from "lucide-react";

interface AdminDashboardData {
  content_counts: Record<string, number>;
  review_queue: { pending: number };
  system_health: Record<string, any>;
  recent_changes: Array<{ id: string; type: string; summary: string; time: string }>;
}

interface ReviewQueueItem {
  id: string;
  entity_type: string;
  title: string;
  raw_data: Record<string, any>;
  status: string;
  submitted_by: string;
  source_url?: string;
  created_at: string;
}

export default function AdminPage() {
  const [token, setToken] = useState("srmwiki-admin-secret-token-2026");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "review" | "crawler">("overview");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlMsg, setCrawlMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        loadDashboardData(token);
      } else {
        setAuthError("Invalid administrative secret token.");
      }
    } catch (err) {
      setAuthError("Failed to reach authentication service.");
    }
  };

  const loadDashboardData = async (adminToken: string) => {
    try {
      const [dashRes, queueRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/admin/dashboard", {
          headers: { "X-Admin-Token": adminToken },
        }),
        fetch("http://localhost:8000/api/v1/admin/review-queue", {
          headers: { "X-Admin-Token": adminToken },
        }),
      ]);

      if (dashRes.ok) setDashboard(await dashRes.json());
      if (queueRes.ok) setReviewQueue(await queueRes.json());
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  const handleReviewAction = async (itemId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/review-queue/${itemId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        // Refresh queue
        loadDashboardData(token);
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const triggerCrawler = async () => {
    setIsCrawling(true);
    setCrawlMsg("Initiating polite crawler run on allowlisted domains...");
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/crawler/trigger", {
        method: "POST",
        headers: { "X-Admin-Token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setCrawlMsg(`Crawl complete! Processed ${data.details?.length || 0} sources.`);
        loadDashboardData(token);
      }
    } catch (err) {
      setCrawlMsg("Crawl execution failed.");
    } finally {
      setIsCrawling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wiki-container py-12 max-w-md mx-auto">
        <div className="wiki-card p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto text-blue-600">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            SRM AP Wiki Admin Console
          </h1>
          <p className="text-xs text-slate-500">
            Authentication required to review submissions, manage sources, and control the crawler engine.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Secret Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token..."
                className="w-full text-xs h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default dev token: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">srmwiki-admin-secret-token-2026</code>
              </span>
            </div>

            {authError && <div className="text-xs text-red-500">{authError}</div>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Verify Session →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-container py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Admin Console" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Knowledge Base Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Content curation, crawler health, source provenance control, and review queue.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "review"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>Review Queue</span>
            {reviewQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {reviewQueue.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("crawler")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "crawler"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Crawler Controls
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === "overview" && dashboard && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="wiki-card p-4">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Total Portals</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
                {dashboard.content_counts.portals}
              </span>
            </div>
            <div className="wiki-card p-4">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Campus Events</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
                {dashboard.content_counts.events}
              </span>
            </div>
            <div className="wiki-card p-4">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Active Notices</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
                {dashboard.content_counts.notices}
              </span>
            </div>
            <div className="wiki-card p-4">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Pending Reviews</span>
              <span className="text-2xl font-extrabold text-amber-500 mt-1 block">
                {dashboard.review_queue.pending}
              </span>
            </div>
          </div>

          {/* System Health Section */}
          <div className="wiki-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>System & Crawler Health Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Primary Database</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ONLINE & HEALTHY</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Allowlisted Sources</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {dashboard.content_counts.sources} verified domains
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Crawled Pages Indexed</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {dashboard.content_counts.crawled_pages} pages
                </span>
              </div>
            </div>
          </div>

          {/* Recent System Changes Log */}
          <div className="wiki-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Audit & Activity Log
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {dashboard.recent_changes.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{c.summary}</span>
                  <span className="text-slate-400 text-[11px] shrink-0">{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEW QUEUE */}
      {activeTab === "review" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Submissions Awaiting Verification ({reviewQueue.length})
            </h2>
            <button
              onClick={() => loadDashboardData(token)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Queue</span>
            </button>
          </div>

          {reviewQueue.length === 0 ? (
            <div className="wiki-card p-8 text-center text-xs text-slate-500">
              The review queue is currently clear! All student submissions and crawled items have been verified.
            </div>
          ) : (
            <div className="space-y-3">
              {reviewQueue.map((item) => (
                <div key={item.id} className="wiki-card p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">
                      {item.entity_type}
                    </span>
                    <span className="text-xs text-slate-400">
                      Submitted by: <strong className="text-slate-600 dark:text-slate-300">{item.submitted_by}</strong>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{item.title}</h3>

                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Review Original Source Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Raw Data Preview */}
                  <pre className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-800">
                    {JSON.stringify(item.raw_data, null, 2)}
                  </pre>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleReviewAction(item.id, "APPROVE")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => handleReviewAction(item.id, "REJECT")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CRAWLER CONTROLS */}
      {activeTab === "crawler" && (
        <div className="wiki-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Polite Crawler Management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Execute automated discovery runs over approved SRM AP domains adhering to robots.txt and rate limits.
              </p>
            </div>

            <button
              onClick={triggerCrawler}
              disabled={isCrawling}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              {isCrawling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isCrawling ? "Crawling..." : "Trigger Manual Crawl"}</span>
            </button>
          </div>

          {crawlMsg && (
            <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs border border-blue-200 dark:border-blue-900/60">
              {crawlMsg}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Configured Allowlist Domains
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                "srmap.edu.in (Main institutional portal)",
                "srmap.edu.in/examination (Examination Branch)",
                "srmap.edu.in/library (Central Library OPAC)",
                "nexttechlab.io (Student research laboratories)",
                "srmap.acm.org (ACM Student Chapter)",
                "gdg.community.dev (GDG on Campus SRM AP)",
              ].map((domain, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{domain}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
