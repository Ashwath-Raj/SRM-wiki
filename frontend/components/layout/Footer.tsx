import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, GitBranch, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 transition-colors mb-14 md:mb-0">
      <div className="wiki-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                AP
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-slate-100">SRM AP Wiki</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Everything SRM AP, in one place. A centralized knowledge discovery and navigation layer for the SRM University-AP digital ecosystem.
            </p>
          </div>

          {/* Directory */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/portals" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Portals Directory</Link></li>
              <li><Link href="/events" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Campus Events</Link></li>
              <li><Link href="/notices" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Official Notices</Link></li>
              <li><Link href="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Student Projects</Link></li>
              <li><Link href="/organizations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Clubs & Labs</Link></li>
              <li><Link href="/documents" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Academic Regulations</Link></li>
            </ul>
          </div>

          {/* Community & Real-Time */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Community & Real-time
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/pulse" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SRM AP Pulse</Link></li>
              <li><Link href="/opportunities" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fellowships & Hackathons</Link></li>
              <li><Link href="/ai" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ask AI Assistant</Link></li>
              <li><Link href="/submit" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-blue-600 dark:text-blue-400">+ Submit Information</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Provenance & Authoritative Sources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Source Provenance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SRM AP Wiki is an independent information aggregation platform. All links point back to official university domains and verified student repositories.
            </p>
            <div className="pt-2">
              <a
                href="https://srmap.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>srmap.edu.in official site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div>
            © 2026 SRM AP Wiki. Designed and maintained by student developers.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/submit" className="hover:underline">Submit Content</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              <span>Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
