
import './About.css'

const SKILLS = [
  'TypeScript', 'JavaScript', 'Java', 'React', 'Node.js',
  'Playwright', 'Selenium', 'REST APIs', 'CI/CD', 'Git',
  'Test Automation', 'HTML / CSS',
]

const ACHIEVEMENTS = [
  { icon: '🧊', label: 'Arctic Code Vault Contributor' },
  { icon: '🦈', label: 'Pull Shark'                   },
  { icon: '🎲', label: 'YOLO'                          },
]

export default function About() {
  return (
    <section className="section section--about">
      {/* Ambient glow blobs */}
      <div className="about__blob about__blob--1" />
      <div className="about__blob about__blob--2" />

      <div className="about__container">
        {/* Hero */}
        <div className="about__hero">
          <div className="about__badge">Based in the United States</div>
          <h1 className="about__name">
            Sri Satya<br />
            <span className="about__name-accent">Kalyan Kallepalli</span>
          </h1>
          <p className="about__tagline">"I like breaking things!"</p>
          <p className="about__bio">
            Software engineer with a passion for quality, automation, and building
            things that scale. I thrive at the intersection of development and testing —
            crafting robust frameworks, hunting edge cases, and ensuring every line of
            code ships with confidence.
          </p>

          <div className="about__cta-row">
            <a
              href="https://github.com/SriSatyaKalyan"
              target="_blank"
              rel="noreferrer"
              className="about__cta about__cta--primary"
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
          </div>
        </div>

        {/* Skills */}
        <div className="about__skills-section">
          <h2 className="about__section-title">Tech Stack</h2>
          <div className="about__skills-grid">
            {SKILLS.map(skill => (
              <span key={skill} className="about__skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        {/* GitHub achievements */}
        <div className="about__achievements">
          <h2 className="about__section-title">GitHub Highlights</h2>
          <div className="about__achievements-row">
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} className="about__achievement-card">
                <span className="about__achievement-icon">{a.icon}</span>
                <span className="about__achievement-label">{a.label}</span>
              </div>
            ))}
            <div className="about__achievement-card">
              <span className="about__achievement-icon">📦</span>
              <span className="about__achievement-label">47+ Public Repos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
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
