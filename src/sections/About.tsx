
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
          <div className="about__badge">Based in US. From India.</div>
          <h1 className="about__name">
            {/* Sri Satya<br /> */}
            <span className="about__name-accent">Kalyan Kallepalli</span>
          </h1>
          <p className="about__tagline">"I like breaking things!"</p>
          <p className="about__bio">
            Software Testing Engineer with a passion for quality, automation, and building
            things that scale. I thrive at the intersection of development and testing. I have 
            crafted robust frameworks, hunted edge cases, and worked towards ensuring every line of
            code ships with confidence.
          </p>
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
        {/* <div className="about__achievements">
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
        </div> */}
      </div>
    </section>
  )
}
