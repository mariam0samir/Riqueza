import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useBlock, useContent } from '../lib/content'
import { lines } from '../lib/parse'
import { Icon, Logo, Socials, WhatsAppFloat, ScrollProgress, Preloader, useConsult, useReveal } from './ui'

function Header() {
  const { u, tx, toggle, lang } = useLang()
  const { services, gallery, videos } = useContent()
  const { open } = useConsult()
  const { pathname } = useLocation()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const [mega, setMega] = useState(false)
  const [hover, setHover] = useState(0)
  const featured = services.filter((s) => s.featured)
  const others = services.filter((s) => !s.featured)

  useEffect(() => {
    const on = () => setSolid(scrollY > 40)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMenu(false); setMega(false) }, [pathname])
  useEffect(() => { document.body.classList.toggle('no-scroll', menu) }, [menu])

  const links = [
    ['/about', u.about], ['/services', u.services, true], ['/clients', u.clients], ['/insights', u.insights],
    ...(gallery.length || videos.length ? [['/media', u.media]] : []), ['/invest-in-egypt', u.invest], ['/contact', u.contact],
  ]
  const light = !solid && !menu

  return (
    <header className={`hdr ${solid ? 'is-solid' : ''} ${menu ? 'is-menu' : ''}`} onMouseLeave={() => setMega(false)}>
      <div className="wrap hdr-in">
        <Link to="/" className="hdr-logo" aria-label={u.home}><Logo light={light} /></Link>
        <nav className="hdr-nav" aria-label="main">
          {links.map(([to, label, hasMega]) => (
            <div key={to} className="hdr-item" onMouseEnter={() => setMega(Boolean(hasMega))} onFocus={() => setMega(Boolean(hasMega))}>
              <NavLink to={to} className="hdr-link">{label}{hasMega && <i className="caret" aria-hidden="true" />}</NavLink>
            </div>
          ))}
        </nav>
        <div className="hdr-actions">
          <button type="button" className="hdr-lang" onClick={toggle} aria-label={u.lang}><Icon name="globe" size={18} /><span>{lang === 'ar' ? 'EN' : 'ع'}</span></button>
          <button type="button" className="btn btn-lime btn-sm hdr-cta" onClick={() => open()}>{u.consult}</button>
          <button type="button" className="hdr-burger" aria-expanded={menu} aria-label={menu ? u.close : u.menu} onClick={() => setMenu(!menu)}><span /><span /></button>
        </div>
      </div>

      {/* Mega menu للخدمات */}
      <div className={`mega ${mega ? 'is-open' : ''}`} onMouseLeave={() => setMega(false)}>
        <div className="wrap mega-in">
          <div className="mega-col">
            <p className="eyebrow">{u.featured}</p>
            <ul className="mega-list">
              {featured.map((s, i) => (
                <li key={s.slug} onMouseEnter={() => setHover(i)}><Link to={`/services/${s.slug}`}><span>{String(i + 1).padStart(2, '0')}</span>{tx(s, 'title')}</Link></li>
              ))}
            </ul>
          </div>
          <div className="mega-col mega-more">
            <p className="eyebrow">{u.more}</p>
            <ul>{others.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{tx(s, 'title')}</Link></li>)}</ul>
            <Link to="/services" className="link-arrow">{u.allServices}<Icon name="arrow" size={16} className="flip-next" /></Link>
          </div>
          {featured[hover] && (
            <Link to={`/services/${featured[hover].slug}`} className="mega-card" key={featured[hover].slug}>
              <img src={featured[hover].image_url} alt="" />
              <div><h4>{tx(featured[hover], 'title')}</h4><p>{tx(featured[hover], 'short')}</p></div>
            </Link>
          )}
        </div>
      </div>

      {/* قائمة الموبايل */}
      <div className={`mnav ${menu ? 'is-open' : ''}`}>
        <nav className="wrap">
          {[['/', u.home], ...links].map(([to, label], i) => (
            <NavLink key={to} to={to} end={to === '/'} style={{ transitionDelay: `${menu ? 80 + i * 45 : 0}ms` }}>{label}<Icon name="arrow" size={18} className="flip-next" /></NavLink>
          ))}
          <div className="mnav-foot">
            <button type="button" className="btn btn-lime" onClick={() => { setMenu(false); open() }}>{u.consult}</button>
            <Socials />
          </div>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  const { u, tx } = useLang()
  const c = useBlock('contact')
  const { services } = useContent()
  const { open } = useConsult()
  return (
    <footer className="ftr">
      <div className="ftr-cta">
        <div className="wrap ftr-cta-in">
          <h2>{u.consult}<br /><span>{tx(useBlock('cta'), 'text')}</span></h2>
          <button type="button" className="btn btn-lime btn-lg" onClick={() => open()}>{u.consult}<Icon name="arrow" className="flip-next" /></button>
        </div>
      </div>
      <div className="wrap ftr-grid">
        <div className="ftr-brand">
          <Logo />
          <p>{u.licensed}</p>
          <Socials />
        </div>
        <div>
          <h4>{u.services}</h4>
          <ul>{services.filter((s) => s.featured).slice(0, 7).map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{tx(s, 'title')}</Link></li>)}</ul>
        </div>
        <div>
          <h4>{u.about}</h4>
          <ul>
            <li><Link to="/about">{u.about}</Link></li>
            <li><Link to="/about#board">{u.board}</Link></li>
            <li><Link to="/clients">{u.clients}</Link></li>
            <li><Link to="/insights">{u.insights}</Link></li>
            <li><Link to="/invest-in-egypt">{u.invest}</Link></li>
            <li><Link to="/careers">{u.careers}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{u.contact}</h4>
          <ul className="ftr-contact">
            <li><Icon name="pin" size={18} /><span>{tx(c, 'address')}</span></li>
            {lines(c.phones).map((p) => <li key={p}><Icon name="phone" size={18} /><a href={`tel:${p.replace(/\s/g, '')}`} dir="ltr">{p}</a></li>)}
            {c.email && <li><Icon name="mail" size={18} /><a href={`mailto:${c.email}`}>{c.email}</a></li>}
          </ul>
        </div>
      </div>
      <div className="wrap ftr-legal">
        <span>© {new Date().getFullYear()} {tx({ n_ar: 'ركويزا للاستشارات المالية عن الأوراق المالية', n_en: 'Riqueza for Financial Consultancy on Securities' }, 'n')} — {u.rights}</span>
        <span>riqueza-eg.com</span>
      </div>
    </footer>
  )
}

export default function Layout() {
  useReveal()
  const { pathname } = useLocation()
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Header />
      <main key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
