"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlusCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SubmitPage() {
  const [entityType, setEntityType] = useState<"project" | "event" | "notice">("project");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [url, setUrl] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !submittedBy.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        entity_type: entityType,
        title: title.trim(),
        raw_data: {
          title: title.trim(),
          description: description.trim(),
          department,
          url: url.trim(),
        },
        submitted_by: submittedBy.trim(),
        source_url: url.trim() || undefined,
      };

      const res = await fetch("http://localhost:8000/api/v1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wiki-container py-6 max-w-2xl mx-auto">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "Submit Information" }]} />

      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <PlusCircle className="w-7 h-7 text-blue-600" />
          Submit Content to SRM AP Wiki
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Have you built an innovative project, organized a club workshop, or found a verified announcement? Submit it here for inclusion after editorial review.
        </p>
      </div>

      {success ? (
        <div className="wiki-card p-8 text-center space-y-4 my-6">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Submission Queued for Verification!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your content has been recorded into the SRM AP Wiki review queue. Our moderators will verify source provenance before publishing it to the public index.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSuccess(false);
                setTitle("");
                setDescription("");
                setUrl("");
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Submit Another Item
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Go to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="wiki-card p-6 sm:p-8 space-y-5">
          {/* Submission Type Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              What are you submitting?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["project", "event", "notice"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEntityType(type)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    entityType === type
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                entityType === "project"
                  ? "e.g. SRM Campus Navigation AR"
                  : entityType === "event"
                  ? "e.g. AI & Robotics Hackathon 2026"
                  : "e.g. End Semester Schedule Update"
              }
              className="w-full text-xs h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="CSE">Computer Science & Engineering (CSE)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Management">School of Management</option>
              <option value="Sciences">School of Sciences</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a concise description of this submission..."
              className="w-full text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* URL / Source */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub URL / Live Demo / Source Link
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/... or https://..."
              className="w-full text-xs h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submitter Name / Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name & SRM Email *
            </label>
            <input
              type="text"
              required
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="e.g. Tarun K. (tarun_k@srmap.edu.in)"
              className="w-full text-xs h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Reassurance note */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
            <span>
              All submissions are verified against authentic repository links or club officers before being published to the Wiki public knowledge base.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
          >
            {isSubmitting ? "Submitting for Review..." : "Submit for Verification →"}
          </button>
        </form>
      )}
    </div>
  );
}
