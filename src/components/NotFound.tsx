import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export default function NotFound({ onGoHome }: { onGoHome?: () => void }) {
  const handleHomeClick = (e: React.MouseEvent) => {
    if (onGoHome) {
      e.preventDefault()
      onGoHome()
    }
  }

  return (
    <section className="not-found-page" role="main" aria-labelledby="not-found-title">
      <div className="not-found-shell page-shell">
        <div className="not-found-header">
          <span className="eyebrow eyebrow--muted">ERROR 404 <i /> PAGE NOT FOUND</span>
          <span className="not-found-stamp">MA / 404</span>
        </div>

        <div className="not-found-body">
          <motion.h1
            id="not-found-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            404<span>.</span>
          </motion.h1>

          <motion.div
            className="not-found-info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>The page you are looking for does not exist.</h2>
            <p>
              It may have been moved, renamed, or temporarily unavailable. You can return to the portfolio overview or explore selected work.
            </p>

            <div className="not-found-actions">
              <a href="/" className="button button--light" onClick={handleHomeClick}>
                <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
                <span>Return to Portfolio</span>
              </a>
              <a href="/#work" className="text-link text-link--light" onClick={() => {
                if (window.location.pathname !== '/') {
                  window.location.href = '/#work'
                } else if (onGoHome) {
                  onGoHome()
                }
              }}>
                <span>Explore Selected Work</span>
                <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="not-found-footer">
          <span>Mohamed Ashraf — Senior Graphic Designer</span>
          <span>Bold, clear, and consistent visual design.</span>
        </div>
      </div>
    </section>
  )
}
