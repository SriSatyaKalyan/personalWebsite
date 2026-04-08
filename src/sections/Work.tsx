import './Work.css'

interface Project {
  name: string
  description: string
  language: string
  langColor: string
  tags: string[]
  url: string
  commits?: number
  highlight?: string
}

const PROJECTS: Project[] = [
  {
    name: 'seleniumFrmwrk',
    description:
      'A production-grade Selenium + Cucumber BDD framework built to sharpen automation skills and integrate AI tooling. Ships with Jenkins CI pipelines, Grafana monitoring dashboards, and daily test script additions.',
    language: 'Java',
    langColor: '#b07219',
    tags: ['Java', 'Selenium', 'Cucumber', 'BDD', 'Jenkins', 'Grafana'],
    url: 'https://github.com/SriSatyaKalyan/seleniumFrmwrk',
    commits: 111,
    highlight: 'End to End Automation',
  },
  {
    name: 'playwrightFrmwrk',
    description:
      'A clean, minimal Playwright test automation framework built on TypeScript with a Page Object Model architecture. Supports headed, UI, and debug modes with HTML reporting and flexible environment config.',
    language: 'TypeScript',
    langColor: '#3178c6',
    tags: ['TypeScript', 'Playwright', 'POM', 'E2E', 'HTML Reports'],
    url: 'https://github.com/SriSatyaKalyan/playwrightFrmwrk',
    commits: 2,
    highlight: 'Agentic AI Framework',
  },
  {
    name: 'k6-learning',
    description:
      'A hands-on k6 performance & load testing learning project. Covers HTTP requests, parameters, thresholds, and scripting patterns — with results piped into Grafana for real-time dashboard visualisation.',
    language: 'JavaScript',
    langColor: '#f1e05a',
    tags: ['k6', 'JavaScript', 'Load Testing', 'Performance', 'Grafana'],
    url: 'https://github.com/SriSatyaKalyan/k6-learning',
    commits: 7,
    highlight: 'Performance Testing',
  },
]

const GRAFANA_URL = '#' // placeholder — to be updated

export default function Work() {
  return (
    <section className="section section--work">
      <div className="work__blob work__blob--1" />
      <div className="work__blob work__blob--2" />

      <div className="work__container">
        {/* Header */}
        <div className="work__header">
          <p className="work__eyebrow">Portfolio</p>
          <h2 className="work__title">Selected Work</h2>
          <p className="work__subtitle">
            Production-grade automation frameworks spanning UI, end-to-end,
            and performance testing — built with purpose.
          </p>
        </div>

        {/* Project cards */}
        <div className="work__grid">
          {PROJECTS.map(project => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="work__card"
            >
              {/* Top row */}
              <div className="work__card-top">
                <div className="work__card-icon"><FolderIcon /></div>
                <span className="work__card-highlight">{project.highlight}</span>
              </div>

              <h3 className="work__card-name">{project.name}</h3>
              <p className="work__card-desc">{project.description}</p>

              {/* Commits badge */}
              {project.commits !== undefined && (
                <div className="work__card-commits">
                  <CommitIcon />
                  <span>{project.commits} commits</span>
                </div>
              )}

              {/* Footer */}
              <div className="work__card-footer">
                <span className="work__card-lang">
                  <span
                    className="work__card-lang-dot"
                    style={{ background: project.langColor }}
                  />
                  {project.language}
                </span>
                <div className="work__card-tags">
                  {project.tags.slice(0, 3).map(t => (
                    <span key={t} className="work__card-tag">{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Grafana CTA */}
        <div className="work__grafana-banner">
          <div className="work__grafana-left">
            <span className="work__grafana-icon"><GrafanaIcon /></span>
            <div>
              <p className="work__grafana-title">Live Test Results</p>
              <p className="work__grafana-desc">
                Real-time metrics from k6 load tests &amp; Selenium runs, visualised in Grafana.
              </p>
            </div>
          </div>
          <a
            href={GRAFANA_URL}
            className="work__grafana-btn"
            target="_blank"
            rel="noreferrer"
          >
            <GrafanaIcon />
            Open Grafana
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  )
}

function CommitIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <line x1="3" y1="12" x2="9" y2="12"/>
      <line x1="15" y1="12" x2="21" y2="12"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

function GrafanaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.3 8.6c-.1-.3-.2-.5-.4-.8.1-.7.1-1.4-.1-2.1-.5-1.6-1.7-2.7-3-3.1-.7-.2-1.4-.2-2.1 0-.4-.3-.8-.5-1.3-.6C12.7 1.7 11.8 1.7 11 2c-.7.3-1.3.8-1.7 1.4-.7.1-1.4.4-2 .8-1.3.9-2 2.4-1.9 3.9 0 .3.1.7.2 1-.4.5-.7 1-.9 1.6-.4 1.5 0 3.1 1 4.2.1.3.2.5.4.8-.1.7-.1 1.4.1 2.1.5 1.6 1.7 2.7 3 3.1.7.2 1.4.2 2.1 0 .4.3.8.5 1.3.6.7.3 1.5.3 2.2 0 .7-.3 1.3-.8 1.7-1.4.7-.1 1.4-.4 2-.8 1.3-.9 2-2.4 1.9-3.9 0-.3-.1-.7-.2-1 .4-.5.7-1 .9-1.6.4-1.5 0-3.1-1-4.2zm-8.1 8.1c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7z"/>
      <path d="M12.2 9.5c-1.3 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.2-2.5-2.5-2.5zm0 3.8c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z"/>
    </svg>
  )
}
