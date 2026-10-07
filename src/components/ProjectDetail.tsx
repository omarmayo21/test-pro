import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import type { Project } from '../data/projects'
import ProjectArtwork from './ProjectArtwork'

type ProjectDetailProps = {
  project: Project | null
  projects: Project[]
  onClose: () => void
  onNavigate: (project: Project) => void
}

export default function ProjectDetail({ project, projects, onClose, onNavigate }: ProjectDetailProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [project, onClose])

  const currentIndex = project ? projects.findIndex((item) => item.id === project.id) : -1
  const nextProject = currentIndex >= 0 ? projects[(currentIndex + 1) % projects.length] : null
  const previousProject = currentIndex >= 0 ? projects[(currentIndex - 1 + projects.length) % projects.length] : null

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            className="project-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="detail-topbar">
              <a className="detail-back" href="#work" onClick={(event) => { event.preventDefault(); onClose() }}>
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>Back to selected work</span>
              </a>
              <span className="detail-counter">{project.number} <i /> {String(projects.length).padStart(2, '0')}</span>
              <button ref={closeButtonRef} className="detail-close" type="button" aria-label="Close project details" onClick={onClose}>
                <span>Close</span><X size={19} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="detail-heading page-shell">
              <div>
                <p className="eyebrow eyebrow--dark">{project.categoryLabel} <i /> {project.industry}</p>
                <h2 id="detail-title">{project.title}<span>.</span></h2>
              </div>
              <div className="detail-meta">
                <div><span>INDUSTRY</span><strong>{project.industry}</strong></div>
                <div><span>SCOPE</span><strong>{project.scope}</strong></div>
              </div>
            </div>

            <div className={`detail-art detail-art--${project.media}`}>
              <ProjectArtwork project={project} loading="eager" sizes="100vw" />
            </div>

            <div className="detail-bottom page-shell">
              <p>Selected {project.categoryLabel.toLowerCase()} work<br />{project.industry}</p>
              <div className="detail-nav">
                {previousProject && (
                  <button type="button" onClick={() => onNavigate(previousProject)} aria-label={`Previous project: ${previousProject.title}`}>
                    <ArrowLeft size={16} strokeWidth={1.5} /><span>Previous</span>
                  </button>
                )}
                {nextProject && (
                  <button type="button" onClick={() => onNavigate(nextProject)} aria-label={`Next project: ${nextProject.title}`}>
                    <span>Next</span><ArrowRight size={16} strokeWidth={1.5} />
                  </button>
                )}
                <a href="#contact" onClick={onClose}>Start a project <ArrowUpRight size={15} strokeWidth={1.5} /></a>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
