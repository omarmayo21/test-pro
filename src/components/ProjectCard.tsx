import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import ProjectArtwork from './ProjectArtwork'

export type ProjectLayout = 'wide' | 'left' | 'right' | 'left-small' | 'right-large'

type ProjectCardProps = {
  project: Project
  layout: ProjectLayout
  onOpen: (project: Project) => void
  index: number
}

export default function ProjectCard({ project, layout, onOpen, index }: ProjectCardProps) {
  const openProject = () => onOpen(project)

  return (
    <motion.article
      className={`project-item project-item--${layout}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="project-trigger" type="button" onClick={openProject} aria-label={`Open ${project.title}, ${project.categoryLabel}`}>
        <span className="project-media">
          <ProjectArtwork
            project={project}
            sizes={layout === 'wide'
              ? '(max-width: 820px) 100vw, 92vw'
              : layout === 'left' || layout === 'right-large'
                ? '(max-width: 820px) 100vw, 62vw'
                : '(max-width: 820px) 100vw, 42vw'}
          />
          <span className="project-media__index">{project.number}<span> / 12</span></span>
          <span className="project-media__open" aria-hidden="true"><ArrowUpRight size={19} strokeWidth={1.45} /></span>
        </span>
        <span className="project-caption">
          <span className="project-caption__main">
            <span className="project-caption__meta">{project.industry}<i />{project.scope}</span>
            <span className="project-caption__title">{project.title}</span>
          </span>
          <span className="project-caption__action"><span>View project</span><ArrowUpRight size={15} strokeWidth={1.45} aria-hidden="true" /></span>
        </span>
      </button>
    </motion.article>
  )
}
