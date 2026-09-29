import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { Building2, Globe, Mail, ExternalLink, ArrowLeft } from "lucide-react";
import { OrganizationItem } from "@/types";

async function getOrg(slug: string): Promise<OrganizationItem | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/organizations/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function OrganizationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrg(slug);

  if (!org) {
    notFound();
  }

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs
        items={[
          { label: "Explore", href: "/explore" },
          { label: "Organizations", href: "/organizations" },
          { label: org.name },
        ]}
      />

      <div className="max-w-3xl mx-auto my-6 space-y-6">
        <div className="wiki-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <SourceBadge sourceType="ORGANIZATION" size="md" />
            <VerificationBadge status={org.verification_status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {org.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {org.type}
            </span>
            {org.department && (
              <>
                <span>·</span>
                <span>Department: {org.department}</span>
              </>
            )}
          </div>

          {org.description && (
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About</h3>
              <p>{org.description}</p>
            </div>
          )}

          {/* Contact and Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {org.contact && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Contact</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{org.contact}</span>
                </div>
              </div>
            )}

            {org.website_url && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 block">Official Website</span>
                  <a
                    href={org.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                  >
                    {org.website_url}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/organizations"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all organizations</span>
            </Link>

            {org.website_url && (
              <a
                href={org.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                <span>Visit Lab / Club Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
