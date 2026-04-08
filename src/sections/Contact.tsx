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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
