import { Suspense, lazy, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ArrowUp, MoveRight, FileText } from 'lucide-react'
import SiteHeader from './components/SiteHeader'
import ProjectCard, { type ProjectLayout } from './components/ProjectCard'
import ProjectDetail from './components/ProjectDetail'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import { categoryFilters, projects, type Project, type ProjectCategory } from './data/projects'
import { credibility, industries, services, site } from './data/site'

// Lazy-load the WebGL 3D ambient kinetic sculpture
const Ambient3D = lazy(() => import('./components/Ambient3D'))

const categoryCounts: Record<'all' | ProjectCategory, string> = {
  all: String(projects.length).padStart(2, '0'),
  visuals: String(projects.filter((project) => project.category === 'visuals').length).padStart(2, '0'),
  social: String(projects.filter((project) => project.category === 'social').length).padStart(2, '0'),
  branding: String(projects.filter((project) => project.category === 'branding').length).padStart(2, '0'),
}

function layoutFor(index: number): ProjectLayout {
  if (index === 0 || index % 5 === 0) return 'wide'
  if (index % 5 === 1) return 'left'
  if (index % 5 === 2) return 'right'
  if (index % 5 === 3) return 'left-small'
  return 'right-large'
}

function SectionLabel({ number, label, dark = false }: { number: string; label: string; dark?: boolean }) {
  return (
    <div className={`section-label${dark ? ' section-label--dark' : ''}`}>
      <span>{number} <i /> {label}</span>
      <span className="section-label__rule" />
    </div>
  )
}

function Hero({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="hero" id="top">
      <div className="hero-shell page-shell">
        <div className="hero-kicker">
          <span>Portfolio <i /> Visual communication</span>
          <span className="hero-kicker__right">Visuals <i /> Identity <i /> Campaigns</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <motion.p
              className="eyebrow hero-eyebrow"
              initial={reduceMotion ? false : { opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              MOHAMED ASHRAF <i /> SENIOR GRAPHIC DESIGNER
            </motion.p>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              Designing<br />brands that<br />get noticed<span className="hero-period">.</span>
            </motion.h1>
            <div className="hero-copy__bottom">
              <p>{site.positioning}</p>
              <div className="hero-actions">
                <a className="button button--light" href="#work">View selected work <ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" /></a>
                <a className="text-link text-link--light" href="#contact">Let’s work together <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" /></a>
              </div>
            </div>
          </div>

          <motion.div
            className="hero-image-wrap"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Interactive WebGL 3D ambient experience with graceful fallback & Suspense */}
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <Ambient3D reducedMotion={reduceMotion} />
              </Suspense>
            </ErrorBoundary>

            <img
              src={projects[0].image}
              srcSet={projects[0].srcSet}
              sizes="(max-width: 820px) 100vw, 42vw"
              alt="Contemporary limestone architecture in warm late-afternoon light"
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero-image-caption"><i /> CAMPAIGN VISUAL / 01</span>
            <span className="hero-image-side">SELECTED WORK — 01</span>
            <span className="hero-image-mark" aria-hidden="true">MA<span>↗</span></span>
          </motion.div>
        </div>
        <div className="hero-bottomline">
          <span>15+ years shaping visual communication</span>
          <div className="hero-bottomline__links">
            <a href="#experience">A considered practice <ArrowDown size={13} strokeWidth={1.4} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">01<br /><span>—</span><br />04</div>
    </section>
  )
}

function Credibility() {
  return (
    <section id="experience" className="credibility" aria-label="Experience at a glance">
      <div className="credibility-inner page-shell">
        <div className="credibility-intro">
          <span className="eyebrow eyebrow--muted">A PRACTICE BUILT OVER TIME</span>
          <p>Experience<br />you can see.</p>
        </div>
        {credibility.map((item) => (
          <div className="stat" key={item.label}>
            <span className="stat__number">{item.value}</span>
            <span className="stat__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function IndustryLine() {
  return (
    <section className="industry-line page-shell" aria-label="Industries">
      <div className="industry-line__head">
        <span className="eyebrow eyebrow--dark">EXPERIENCE ACROSS</span>
        <span className="industry-line__small">A broad range of briefs.<br />One clear point of view.</span>
      </div>
      <div className="industry-line__list">
        {industries.map((industry, index) => (
          <span key={industry}>
            {industry}<i aria-hidden="true">{index === industries.length - 1 ? '↗' : ' / '}</i>
          </span>
        ))}
      </div>
    </section>
  )
}

function WorkSection({ onOpen }: { onOpen: (project: Project) => void }) {
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')
  const filteredProjects = useMemo(
    () => activeCategory === 'all' ? projects : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  )

  return (
    <section className="work-section" id="work">
      <div className="page-shell">
        <SectionLabel number="01" label="SELECTED WORK" dark />
        <div className="work-heading">
          <div>
            <p className="eyebrow eyebrow--dark">A CURATED VIEW</p>
            <h2>Work with<br /><span>intention.</span></h2>
          </div>
          <p className="work-heading__note">Visual campaigns, social design, and identity work—made to give brands a stronger point of view.</p>
        </div>

        <div className="work-toolbar">
          <span className="work-toolbar__label">EXPLORE BY DISCIPLINE</span>
          <div className="work-filters" role="group" aria-label="Filter selected projects">
            {categoryFilters.map((filter) => {
              const isActive = activeCategory === filter.id
              return (
                <button
                  className={`work-filter${isActive ? ' is-active' : ''}`}
                  type="button"
                  key={filter.id}
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(filter.id)}
                >
                  <span>{filter.label}</span><small>{categoryCounts[filter.id]}</small>
                </button>
              )
            })}
          </div>
        </div>

        <div className="project-grid" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                layout={layoutFor(index)}
                onOpen={onOpen}
              />
            ))}
          </AnimatePresence>
        </div>
        <p className="work-disclaimer"><span className="work-disclaimer__mark">*</span> Artwork shown is illustrative placeholder material. Replace with approved portfolio work before publishing.</p>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="page-shell">
        <SectionLabel number="02" label="ABOUT THE PRACTICE" />
        <div className="about-grid">
          <div className="about-display">
            <span className="about-asterisk" aria-hidden="true">✳</span>
            <p className="eyebrow eyebrow--muted">DESIGN WITH PURPOSE</p>
            <h2>Creative thinking.<br /><span>Commercial clarity.</span></h2>
          </div>
          <div className="about-copy">
            <p className="about-copy__lead">Good design is more than a strong first impression. It gives a brand a point of view—and the consistency to carry it forward.</p>
            <p>With 15+ years in graphic design, Mohamed works across campaigns, identities, and everyday brand communication. He brings creative judgement to the details while keeping the bigger commercial objective in view.</p>
            <p>The result is work that feels clear, confident, and considered in every context.</p>
            <div className="about-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
              <a className="text-link" href="#services">Explore capabilities <MoveRight size={16} strokeWidth={1.4} aria-hidden="true" /></a>
              <a className="text-link" href="/mohamed-ashraf-portfolio.pdf" target="_blank" rel="noopener noreferrer">
                <FileText size={15} strokeWidth={1.4} aria-hidden="true" />
                <span>Download PDF Deck</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section className="services-section" id="services">
      <div className="page-shell">
        <SectionLabel number="03" label="CAPABILITIES" dark />
        <div className="services-heading">
          <h2>Clear thinking.<br /><span>Considered design.</span></h2>
          <p>Focused creative support, from a single campaign visual to a more consistent brand presence.</p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <motion.div
              className="service-row"
              key={service.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="service-row__number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
              <ArrowUpRight className="service-row__arrow" size={17} strokeWidth={1.4} aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [notice, setNotice] = useState('')
  const hasContact = Boolean(site.contactEmail)
  const emailHref = hasContact ? `mailto:${site.contactEmail}?subject=${encodeURIComponent('Project enquiry — Mohamed Ashraf')}` : undefined

  const handleContactClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (hasContact) return
    event.preventDefault()
    setNotice('Add Mohamed’s confirmed email address in src/data/site.ts to activate this contact link.')
    window.setTimeout(() => setNotice(''), 5000)
  }

  return (
    <section className="contact-section" id="contact">
      <div className="page-shell">
        <SectionLabel number="04" label="NEXT STEPS" />
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="eyebrow eyebrow--muted">HAVE A GOOD BRIEF?</p>
            <h2>Make your<br />brand <span>stand out.</span></h2>
          </div>
          <div className="contact-action">
            <p>A clear first step toward a more distinctive visual voice.</p>
            <a className="contact-link" href={emailHref ?? '#contact'} onClick={handleContactClick}>
              <span>Start a project</span><ArrowUpRight size={20} strokeWidth={1.4} aria-hidden="true" />
            </a>
            <span className="contact-note">Project enquiries</span>
            <AnimatePresence>
              {notice && (
                <motion.p className="contact-notice" role="status" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {notice}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <a className="footer-brand" href="#top"><span>MOHAMED ASHRAF</span><small>Senior Graphic Designer</small></a>
        <div className="footer-meta">
          <span>Bold, clear, consistent.</span>
          <span>© {year} Mohamed Ashraf</span>
        </div>
        <a className="back-to-top" href="#top" aria-label="Back to top"><ArrowUp size={15} strokeWidth={1.5} /></a>
      </div>
    </footer>
  )
}

export default function App() {
  const reduceMotion = useReducedMotion() ?? false
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    // Check if user requested an explicit 404 or unknown sub-route
    const path = window.location.pathname
    if (path !== '/' && path !== '/index.html' && path !== '') {
      setIsNotFound(true)
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname
      setIsNotFound(currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleReturnHome = () => {
    window.history.pushState({}, '', '/')
    setIsNotFound(false)
  }

  if (isNotFound) {
    return (
      <ErrorBoundary>
        <NotFound onGoHome={handleReturnHome} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <Hero reduceMotion={reduceMotion} />
        <Credibility />
        <IndustryLine />
        <WorkSection onOpen={setSelectedProject} />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <ProjectDetail
        project={selectedProject}
        projects={projects}
        onClose={() => setSelectedProject(null)}
        onNavigate={setSelectedProject}
      />
    </ErrorBoundary>
  )
}
