import { Link } from 'react-router'
import type { Project } from '../data/projects'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link to={`/works/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          loading="lazy"
          className="h-full w-full object-cover opacity-85 grayscale transition-all duration-[900ms] ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 font-mono text-[11px] text-mist/80">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl leading-tight text-bone md:text-3xl">
          {project.title}
        </h3>
        <span className="font-mono text-xs text-steel">{project.year}</span>
      </div>
      <div className="mt-1 flex items-center gap-3">
        <span className="h-px w-4 bg-signal transition-all duration-300 group-hover:w-8" />
        <span className="text-sm text-mist">{project.role}</span>
        <span className="ml-auto eyebrow text-steel">{project.category}</span>
      </div>
    </Link>
  )
}
