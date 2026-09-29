import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { Code2, ExternalLink, Users, Calendar, ArrowLeft } from "lucide-react";
import { ProjectItem } from "@/types";

async function getProject(slug: string): Promise<ProjectItem | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/projects/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="wiki-container py-6">
      <Breadcrumbs
        items={[
          { label: "Explore", href: "/explore" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />

      <div className="max-w-3xl mx-auto my-6 space-y-6">
        <div className="wiki-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <SourceBadge sourceType="STUDENT" size="md" />
            <VerificationBadge status={project.verification_status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {project.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Department: {project.department}
            </span>
            <span>·</span>
            <span>Year: {project.year}</span>
            {project.organization_name && (
              <>
                <span>·</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {project.organization_name}
                </span>
              </>
            )}
          </div>

          {/* Team Members */}
          {project.team && project.team.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Project Creators & Team
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {project.team.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About the Project</h3>
              <p>{project.description}</p>
            </div>
          )}

          {/* Technology Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions & Code Links */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all projects</span>
            </Link>

            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
