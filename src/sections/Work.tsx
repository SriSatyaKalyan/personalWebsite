import { useGitHubActivity } from '../hooks/useGitHubActivity'
import './Work.css'

const LANGUAGES = [
  'Java', 'JavaScript', 'Python'
]
const AUTO_TOOLS = [
  'Playwright', 'Selenium', 'Cucumber', 'JMeter', 'k6', 'RestAssured'
]
const CI_CD_TOOLS = [
  'Jenkins', 'GitHub Actions', 'Docker', 'AWS'
]

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
    tags: ['Selenium', 'Cucumber', 'BDD'],
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
    tags: ['Playwright', 'POM', 'E2E'],
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
    tags: ['k6', 'Load', 'Performance'],
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

        {/* GitHub activity */}
        <GitHubActivityWidget />

        {/* <div className="about__cta-row">
            <a
              href="https://github.com/SriSatyaKalyan"
              target="_blank"
              rel="noreferrer"
              className="about__cta about__cta--secondary"
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kalyan-kallepalli/"
              target="_blank"
              rel="noreferrer"
              className="about__cta about__cta--secondary"
            >
              <LinkedInIcon /> LinkedIn
            </a>
          </div> */}

      {/* Skills */}
        <div className="about__skills-section">
          <h2 className="about__section-title">Tech Stack</h2>
          <div className="about__skills-grid">
            {LANGUAGES.map(skill => (
              <span key={skill} className="about__skill-tag">{skill}</span>
            ))}
            <div style={{ flexBasis: '100%', height: 0 }} />
            {AUTO_TOOLS.map(skill => (
              <span key={skill} className="about__skill-tag">{skill}</span>
            ))}
            <div style={{ flexBasis: '100%', height: 0 }} />
            {CI_CD_TOOLS.map(skill => (
              <span key={skill} className="about__skill-tag">{skill}</span>
            ))}
            <div style={{ flexBasis: '100%', height: 0 }} />
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── GitHub Activity Widget ──────────────────────────────────────── */
function GitHubActivityWidget() {
  const { events, loading, error } = useGitHubActivity(8)

  return (
    <div className="work__gh-widget">
      <div className="work__gh-header">
        <span className="work__gh-icon-wrap"><GithubIcon /></span>
        <span className="work__gh-title">Recent Activity</span>
        <a
          href="https://github.com/SriSatyaKalyan"
          target="_blank"
          rel="noreferrer"
          className="work__gh-profile-link"
        >
          View profile <ArrowIcon />
        </a>
      </div>

      {loading && (
        <div className="work__gh-skeleton-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="work__gh-skeleton-row">
              <div className="work__gh-skeleton work__gh-skeleton--icon" />
              <div className="work__gh-skeleton-lines">
                <div className="work__gh-skeleton work__gh-skeleton--text" />
                <div className="work__gh-skeleton work__gh-skeleton--sub" />
              </div>
              <div className="work__gh-skeleton work__gh-skeleton--time" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="work__gh-error">Could not load GitHub activity.</p>}

      {!loading && !error && (
        <ul className="work__gh-list">
          {events.map(event => (
            <li key={event.id} className="work__gh-event">
              <span className="work__gh-event-dot">
                {ghEventIcon(event.type)}
              </span>
              <div className="work__gh-event-body">
                <a
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="work__gh-event-desc"
                >
                  {event.description}
                </a>
                {event.commitMessages.length > 0 && (
                  <ul className="work__gh-commits">
                    {event.commitMessages.map((msg, i) => (
                      <li key={i} className="work__gh-commit-msg">{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="work__gh-event-time">{event.createdAt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ghEventIcon(type: string) {
  switch (type) {
    case 'PushEvent':
    case 'CreateEvent':
    case 'DeleteEvent':
      return <CommitIcon />
    case 'PullRequestEvent':
      return <PullRequestIcon />
    case 'IssuesEvent':
    case 'IssueCommentEvent':
      return <IssueIcon />
    case 'WatchEvent':
      return <StarIcon />
    case 'ForkEvent':
      return <ForkIcon />
    default:
      return <CommitIcon />
  }
}

function PullRequestIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
      <path d="M13 6h3a2 2 0 012 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
    </svg>
  )
}

function IssueIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function ForkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <line x1="6" y1="9" x2="6" y2="15"/><path d="M18 9a9 9 0 01-9 9"/>
    </svg>
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

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
