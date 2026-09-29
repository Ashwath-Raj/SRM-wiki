import React from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  Bell,
  Code2,
  Building2,
  BookOpen,
  Briefcase,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "Explore Directory — SRM AP Wiki",
  description: "Browse verified university portals, events, official notices, student innovations, and academic regulations.",
};

export default function ExplorePage() {
  const categories = [
    {
      title: "Portals Directory",
      description: "Direct verified links to LMS, Examination Branch, Library OPAC, Fees, and Hostel portals.",
      icon: Award,
      href: "/portals",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/50",
      badge: "Official Portals",
    },
    {
      title: "Campus Events",
      description: "Workshops, technical hackathons, distinguished guest lectures, and cultural fests.",
      icon: Calendar,
      href: "/events",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/50",
      badge: "Live Calendar",
    },
    {
      title: "Official Notices",
      description: "Authoritative circulars, examination schedules, academic calendar announcements, and hostel guidelines.",
      icon: Bell,
      href: "/notices",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/50",
      badge: "Verified Notices",
    },
    {
      title: "Student Projects",
      description: "Showcase of robotics rovers, AR campus maps, decentralized apps, and AI research tools built by students.",
      icon: Code2,
      href: "/projects",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900/50",
      badge: "Student Works",
    },
    {
      title: "Clubs & Research Labs",
      description: "Student organizations including Next Tech Lab, ACM Student Chapter, GDG, and Ennovab E-Cell.",
      icon: Building2,
      href: "/organizations",
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900/50",
      badge: "Organizations",
    },
    {
      title: "Academic Regulations",
      description: "B.Tech regulations, 75% attendance rule, grading scale, student code of conduct, and handbooks.",
      icon: BookOpen,
      href: "/documents",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/50",
      badge: "Regulations & PDFs",
    },
    {
      title: "Opportunities",
      description: "Campus placements, undergraduate research fellowships, hackathon grants, and internship drives.",
      icon: Briefcase,
      href: "/opportunities",
      color: "text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-900/50",
      badge: "Deadlines",
    },
    {
      title: "SRM AP Pulse",
      description: "Live real-time feed tracking new notices, today's schedule, source updates, and recent changes.",
      icon: Activity,
      href: "/pulse",
      color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900/50",
      badge: "Real-time",
    },
  ];

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs items={[{ label: "Explore" }]} />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          Explore Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Browse the categorized knowledge base of the SRM University-AP digital ecosystem. Select a category below to discover verified information.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              href={cat.href}
              className="wiki-card p-5 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                  {cat.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Browse {cat.title.split(" ")[0]}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
