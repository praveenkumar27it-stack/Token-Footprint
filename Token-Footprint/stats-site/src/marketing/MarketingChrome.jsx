import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Droplets, ArrowRight, Check, Menu, X } from 'lucide-react'
import { SITE } from '../config/site'
import { useScrollToSection } from './useScrollToSection'
import './marketing.css'

const SECTIONS = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'demo', label: 'Demo' },
  { id: 'privacy', label: 'Privacy' },
]

// Hoisted so the scroll-spy effect below has a stable dependency.
const SECTION_IDS = SECTIONS.map((s) => s.id)

// Primary download call-to-action. Runs locally: it opens the install page,
// which walks through loading the unpacked extension from this checkout.
export function ChromeCTA({ size = 'lg', block = false }) {
  const cls = `btn btn-primary btn-${size}${block ? ' btn-block' : ''}`
  return (
    <Link className={cls} to="/install">
      <span className="btn-shine" aria-hidden="true" />
      Add to Chrome, it&apos;s free <ArrowRight size={18} />
    </Link>
  )
}

/** Raises the bar once the page has scrolled off the very top. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/**
 * Scroll-spy for the header. Marks whichever section currently owns the band
 * just under the header, so the nav always says where you are. Degrades to "no
 * section active" wherever IntersectionObserver is missing.
 */
function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.4] },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [ids])
  return active
}

export function SiteNav() {
  const scrollTo = useScrollToSection()
  const scrolled = useScrolled()
  const active = useActiveSection(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the sheet, and the page never scrolls behind it.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  const go = (id) => { setMenuOpen(false); scrollTo(id) }

  return (
    <header className={`mk-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="mk-nav-inner">
        <Link to="/" className="mk-brand" aria-label="Token Footprint home">
          <span className="mk-brand-mark"><Droplets size={19} /></span>
          <span className="mk-brand-name">Token Footprint</span>
        </Link>

        <nav className="mk-nav-links" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`mk-nav-link${active === s.id ? ' is-active' : ''}`}
              aria-current={active === s.id ? 'true' : undefined}
              onClick={(e) => { e.preventDefault(); go(s.id) }}
            >
              {s.label}
            </a>
          ))}
          <Link to="/support" className="mk-nav-link">Support</Link>
        </nav>

        <div className="mk-nav-cta">
          <Link className="mk-nav-demo" to="/app">Live demo</Link>
          <ChromeCTA size="sm" />
          <button
            type="button"
            className="mk-nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet. Below 720px the inline links are hidden, so this is the
          only way to reach the sections — it has to carry all of them. */}
      {menuOpen && (
        <>
          <button className="mk-sheet-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setMenuOpen(false)} />
          <div className="mk-sheet" role="dialog" aria-modal="true" aria-label="Menu">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="mk-sheet-link" onClick={(e) => { e.preventDefault(); go(s.id) }}>
                {s.label}
              </a>
            ))}
            <Link to="/support" className="mk-sheet-link" onClick={() => setMenuOpen(false)}>Support</Link>
            <Link to="/app" className="mk-sheet-link" onClick={() => setMenuOpen(false)}>Live demo</Link>
            <div className="mk-sheet-cta"><ChromeCTA size="lg" block /></div>
          </div>
        </>
      )}
    </header>
  )
}

export function SiteFooter() {
  const year = 2026 // static: build runs without Date access; bump on release
  const scrollTo = useScrollToSection()
  return (
    <footer className="mk-footer">
      <div className="mk-footer-inner">
        <div className="mk-footer-brand">
          <div className="mk-brand">
            <span className="mk-brand-mark"><Droplets size={18} /></span>
            <span className="mk-brand-name">Token Footprint</span>
          </div>
          <p className="mk-footer-tag">{SITE.tagline}</p>
          <p className="mk-footer-badge"><Check size={13} /> Local-first · No accounts required</p>
        </div>

        <div className="mk-footer-cols">
          <div className="mk-footer-col">
            <h4>Product</h4>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features') }}>Features</a>
            <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('how') }}>How it works</a>
            <Link to="/app">Live demo</Link>
          </div>
          <div className="mk-footer-col">
            <h4>Trust</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); scrollTo('privacy') }}>Data &amp; privacy</a>
          </div>
          <div className="mk-footer-col">
            <h4>Support</h4>
            <Link to="/support">Help &amp; FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="mk-footer-col">
            <h4>Project</h4>
            <Link to="/app/learn">Methodology</Link>
          </div>
        </div>
      </div>
      <div className="mk-footer-legal">
        <span>© {year} Token Footprint</span>
        <span className="mk-dot">·</span>
        <span>{SITE.url.replace('https://', '')}</span>
        <span className="mk-dot">·</span>
        <span className="mk-footer-note">Estimates are approximations, not measurements.</span>
      </div>
    </footer>
  )
}

// Shared page wrapper for the non-landing marketing/legal pages.
export function MarketingPage({ children }) {
  return (
    <div className="mk">
      <SiteNav />
      <main className="mk-doc">{children}</main>
      <SiteFooter />
    </div>
  )
}
