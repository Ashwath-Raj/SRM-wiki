import React from "react";
import Link from "next/link";
import { Code2, ExternalLink, Users } from "lucide-react";
import { ProjectItem } from "@/types";
import { SourceBadge } from "../ui/SourceBadge";
import { GithubIcon } from "../ui/GithubIcon";

interface ProjectCardProps {
  project: ProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="wiki-card p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <SourceBadge sourceType="STUDENT" size="sm" />
          <span className="text-xs text-slate-400 font-medium">
            {project.department} · {project.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>

        {/* Team / Organization */}
        {(project.organization_name || (project.team && project.team.length > 0)) && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {project.organization_name || project.team.join(", ")}
            </span>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {project.description}
          </p>
        )}

        {/* Technologies Chips */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <Link
          href={`/projects/${project.slug}`}
          className="font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          Details
        </Link>

        <div className="flex items-center gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
              title="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
