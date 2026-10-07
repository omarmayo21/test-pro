import type { Project } from '../data/projects'

type ProjectArtworkProps = {
  project: Project
  loading?: 'eager' | 'lazy'
  sizes?: string
}

function IdentityMark({ variant }: { variant: 1 | 2 | 3 }) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <path d="M44 194V120a76 76 0 0 1 152 0v74" />
        <path d="M78 194v-68a42 42 0 0 1 84 0v68" />
        <circle cx="120" cy="120" r="7" />
      </svg>
    )
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <path d="M48 72h144M48 120h144M48 168h144" />
        <path d="M72 48v144M120 48v144M168 48v144" />
        <circle cx="120" cy="120" r="38" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true">
      <path d="M120 35 205 120 120 205 35 120Z" />
      <path d="M120 75 165 120 120 165 75 120Z" />
      <circle cx="120" cy="120" r="12" />
    </svg>
  )
}

export function IdentityArtwork({ variant, large = false }: { variant: 1 | 2 | 3; large?: boolean }) {
  return (
    <div className={`identity-art identity-art--${variant}${large ? ' identity-art--large' : ''}`} role="img" aria-label={`Abstract logo exploration ${variant}`}>
      <div className="identity-art__topline">
        <span>IDENTITY STUDY</span>
        <span>0{variant} / 03</span>
      </div>
      <div className="identity-art__center">
        <div className="identity-art__mark"><IdentityMark variant={variant} /></div>
        <span className="identity-art__cross identity-art__cross--one">+</span>
        <span className="identity-art__cross identity-art__cross--two">+</span>
      </div>
      <div className="identity-art__footer">
        <span>MARK<br />SYSTEM</span>
        <div className="identity-art__swatches" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <span className="identity-art__index">MA — 0{variant}</span>
      </div>
    </div>
  )
}

export default function ProjectArtwork({ project, loading = 'lazy', sizes }: ProjectArtworkProps) {
  if (project.media === 'identity' && project.brandVariant) {
    return <IdentityArtwork variant={project.brandVariant} />
  }

  return (
    <img
      className="project-photo"
      src={project.image}
      srcSet={project.srcSet}
      alt={project.alt}
      loading={loading}
      decoding="async"
      sizes={sizes ?? '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 60vw'}
    />
  )
}
