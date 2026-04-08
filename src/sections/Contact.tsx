import { useState } from 'react'
import './Contact.css'

const LINKS = [
  {
    label: 'GitHub',
    handle: '@SriSatyaKalyan',
    url: 'https://github.com/SriSatyaKalyan',
    icon: <GithubIcon />,
    desc: '47+ repositories',
  },
  {
    label: 'LinkedIn',
    handle: 'kalyan-kallepalli',
    url: 'https://www.linkedin.com/in/kalyan-kallepalli/',
    icon: <LinkedInIcon />,
    desc: 'Connect professionally',
  },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const email = 'kalyan.kallepalli@example.com'

  function handleCopy() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <section className="section section--contact">
      <div className="contact__blob contact__blob--1" />
      <div className="contact__blob contact__blob--2" />

      <div className="contact__container">
        {/* Hero text */}
        <div className="contact__hero">
          <p className="contact__eyebrow">Get In Touch</p>
          <h2 className="contact__title">
            Let's build something<br />
            <span className="contact__title-accent">great together.</span>
          </h2>
          <p className="contact__subtitle">
            Whether you have a project in mind, want to talk automation, or just want
            to say hello — my inbox is always open.
          </p>
        </div>

        {/* Social links */}
        <div className="contact__links">
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="contact__link-card"
            >
              <span className="contact__link-icon">{link.icon}</span>
              <div className="contact__link-info">
                <span className="contact__link-label">{link.label}</span>
                <span className="contact__link-handle">{link.handle}</span>
              </div>
              <div className="contact__link-right">
                <span className="contact__link-desc">{link.desc}</span>
                <ArrowIcon />
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="contact__divider">
          <span className="contact__divider-line" />
          <span className="contact__divider-text">or reach me directly</span>
          <span className="contact__divider-line" />
        </div>

        {/* Email CTA */}
        <div className="contact__email-block">
          <div className="contact__email-display">
            <MailIcon />
            <span className="contact__email-address">{email}</span>
            <button
              className={`contact__copy-btn ${copied ? 'contact__copy-btn--copied' : ''}`}
              onClick={handleCopy}
              title="Copy email address"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Availability banner */}
        <div className="contact__availability">
          <span className="contact__avail-dot" />
          <span className="contact__avail-text">
            Open to new opportunities &amp; collaborations
          </span>
        </div>
      </div>
    </section>
  )
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
