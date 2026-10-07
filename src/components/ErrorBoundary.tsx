import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, log or report without breaking user flow
    console.error('Portfolio ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <section className="not-found-page" role="alert">
          <div className="not-found-shell page-shell">
            <div className="not-found-header">
              <span className="eyebrow eyebrow--muted">APPLICATION ERROR <i /> SYSTEM RECOVERY</span>
              <span className="not-found-stamp">MA / 500</span>
            </div>
            <div className="not-found-body">
              <h1>Notice<span>.</span></h1>
              <div className="not-found-info">
                <h2>An unexpected interface exception occurred.</h2>
                <p>The system caught the error safely. You can refresh the application to resume browsing.</p>
                <div className="not-found-actions">
                  <button
                    type="button"
                    className="button button--light"
                    onClick={() => {
                      this.setState({ hasError: false })
                      window.location.reload()
                    }}
                  >
                    <RefreshCw size={15} strokeWidth={1.5} aria-hidden="true" />
                    <span>Reload Experience</span>
                  </button>
                  <a href="/" className="text-link text-link--light" onClick={() => (window.location.href = '/')}>
                    <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
                    <span>Return to Home</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
