import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useBlock, useContent, sendMessage, phoneInput, validPhone, cleanPhone } from '../lib/content'

/* ───────── أيقونات ───────── */
const P = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  check: 'M5 12.5l4.5 4.5L19 7',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3',
  play: 'M8 5v14l11-7z',
  up: 'M12 19V5M6 11l6-6 6 6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  file: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  shield: 'M12 3l8 3v6c0 4.6-3.4 8.4-8 9-4.6-.6-8-4.4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
  briefcase: 'M3 8h18v12H3zM8 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 13h18',
  scale: 'M12 4v16M7 20h10M5 8h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0z',
  building: 'M4 21V5l8-3v19M12 9h8v12M8 8h.01M8 12h.01M8 16h.01M16 13h.01M16 17h.01M2 21h20',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
}
export function Icon({ name, size = 20, stroke = 1.8, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={name === 'play' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={P[name]} />
    </svg>
  )
}
export const WhatsAppIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.56 4.19 1.61 6.01L4 29l8.17-1.58a12.03 12.03 0 0 0 3.87.64h.01C22.68 28.06 28 22.68 28 16.04 28 9.4 22.68 3 16.04 3zm5.42 15.5c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
)
const SOCIAL_PATHS = {
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z',
  linkedin: 'M6 9H3v12h3zM4.5 3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM21 21h-3v-6c0-1.6-.6-2.6-2-2.6s-2 1-2 2.6v6h-3V9h3v1.6c.6-1 1.7-1.8 3.3-1.8C19.5 8.8 21 10.4 21 13.4z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01',
  x: 'M4 4l16 16M20 4L4 20',
  threads: 'M12 21c-5 0-8-3-8-9s3-9 8-9c4 0 6.5 2 7.5 5M16 12.5c0 2-1.6 3.5-3.6 3.5S9 15 9 13.3c0-2 2-3 5-2.8 2 .1 4 1.2 4 3.7 0 3.3-2.7 5-6 5',
  youtube: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9v6l5-3z',
}
export function Socials({ className = '' }) {
  const s = useBlock('social')
  const items = Object.entries(SOCIAL_PATHS).filter(([k]) => s[k])
  if (!items.length) return null
  return (
    <ul className={`socials ${className}`}>
      {items.map(([k, d]) => (
        <li key={k}><a href={s[k]} target="_blank" rel="noreferrer" aria-label={k}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={k === 'facebook' || k === 'linkedin' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
        </a></li>
      ))}
    </ul>
  )
}

/* ───────── اللوجو (من ملف الشركة) ───────── */
export function Logo({ light = false, className = '' }) {
  return (
    <span className={`logo ${light ? 'is-light' : ''} ${className}`} aria-label="Riqueza">
      <img src={light ? '/logo-white.svg' : '/logo.svg'} alt="Riqueza" width="120" height="78" />
    </span>
  )
}

/* ───────── ظهور العناصر مع النزول ───────── */
export function useReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.in)')
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  })
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
}

/* ───────── عدّاد أرقام ───────── */
export function Counter({ to, suffix = '', duration = 1800 }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  const target = parseFloat(String(to).replace(/[^\d.]/g, '')) || 0
  const isNum = /^\d/.test(String(to))
  useEffect(() => {
    if (!isNum) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return }
    const el = ref.current
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration)
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, isNum, duration])
  return <span ref={ref} className="counter">{isNum ? v : to}{suffix && <em>{suffix}</em>}</span>
}

/* ───────── سلايدر أفقي (سحب + أسهم + شريط تقدم) ───────── */
export function Slider({ children, className = '', label = 'slider' }) {
  const track = useRef(null)
  const { dir, u } = useLang()
  const [prog, setProg] = useState(0)
  const drag = useRef(null)
  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProg(max > 0 ? Math.abs(el.scrollLeft) / max : 0)
  }, [])
  useEffect(() => { update() }, [children, update])
  const go = (d) => {
    const el = track.current
    const card = el.querySelector(':scope > *')
    const w = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: d * w * (dir === 'rtl' ? -1 : 1), behavior: 'smooth' })
  }
  const down = (e) => { if (e.pointerType !== 'mouse') return; drag.current = { x: e.clientX, s: track.current.scrollLeft, moved: false } }
  const move = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 5) drag.current.moved = true
    track.current.scrollLeft = drag.current.s - dx
  }
  const up = () => { setTimeout(() => { drag.current = null }, 0) }
  const clickCapture = (e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation() } }
  return (
    <div className={`slider ${className}`}>
      <div className="slider-track" ref={track} onScroll={update} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onClickCapture={clickCapture} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="slider-ui">
        <div className="slider-bar"><span style={{ transform: `scaleX(${Math.max(0.08, prog)})` }} /></div>
        <div className="slider-btns">
          <button type="button" onClick={() => go(-1)} aria-label={u.prev}><Icon name="arrow" className="flip-prev" /></button>
          <button type="button" onClick={() => go(1)} aria-label={u.next}><Icon name="arrow" className="flip-next" /></button>
        </div>
      </div>
    </div>
  )
}

/* ───────── شريط أسماء متحرك ───────── */
export function Marquee({ items, reverse = false, speed = 60 }) {
  const list = [...items, ...items]
  return (
    <div className={`marquee ${reverse ? 'is-rev' : ''}`} style={{ '--dur': `${Math.max(20, items.length * 120 / speed)}s` }}>
      <div className="marquee-track">
        {list.map((x, i) => <span key={i} className="marquee-item" aria-hidden={i >= items.length}>{x}</span>)}
      </div>
    </div>
  )
}

/* ───────── عناوين الأقسام ───────── */
export function SectionHead({ eyebrow, title, text, light = false, center = false, action }) {
  return (
    <header className={`shead ${light ? 'is-light' : ''} ${center ? 'is-center' : ''}`} data-reveal>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="h2">{title}</h2>}
        {text && <p className="lead">{text}</p>}
      </div>
      {action}
    </header>
  )
}

export function PageHero({ title, eyebrow, text, image, crumbs = [] }) {
  const { u } = useLang()
  return (
    <section className="phero">
      <div className="phero-bg" style={{ backgroundImage: `url(${image || '/media/waves.webp'})` }} />
      <div className="wrap phero-in">
        <nav className="crumbs" aria-label="breadcrumb">
          <Link to="/">{u.home}</Link>
          {crumbs.map(([to, label]) => <span key={to}><i>/</i>{to ? <Link to={to}>{label}</Link> : label}</span>)}
        </nav>
        {eyebrow && <p className="eyebrow light">{eyebrow}</p>}
        <h1 className="phero-title">{title}</h1>
        {text && <p className="phero-text">{text}</p>}
      </div>
    </section>
  )
}

/* ───────── أكورديون ───────── */
export function Accordion({ items, openFirst = true }) {
  const [open, setOpen] = useState(openFirst ? 0 : -1)
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div key={i} className={`acc-item ${open === i ? 'is-open' : ''}`}>
          <button type="button" className="acc-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{it.title}</span><i aria-hidden="true"><Icon name="plus" /></i>
          </button>
          <div className="acc-a"><div><p>{it.text}</p></div></div>
        </div>
      ))}
    </div>
  )
}

/* ───────── نموذج التواصل ───────── */
export function ContactForm({ source = 'contact', compact = false, defaultService = '', onDone }) {
  const { u, tx } = useLang()
  const { services } = useContent()
  const [state, setState] = useState({ busy: false, note: '', ok: false })
  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const v = Object.fromEntries(new FormData(f).entries())
    if (!v.name?.trim() || !v.phone?.trim()) { setState({ busy: false, note: u.required, ok: false }); return }
    if (!validPhone(v.phone)) { setState({ busy: false, note: u.badPhone, ok: false }); return }
    setState({ busy: true, note: '', ok: false })
    try {
      await sendMessage({ source, name: v.name.trim(), phone: cleanPhone(v.phone), email: v.email || null, company: v.company || null, subject: v.service || null, body: v.message || null })
      f.reset()
      setState({ busy: false, note: u.sent, ok: true })
      onDone?.()
    } catch (err) {
      console.error('[Riqueza] إرسال الرسالة فشل:', err?.message || err, err)
      setState({ busy: false, note: u.failed, ok: false })
    }
  }
  return (
    <form className={`cform ${compact ? 'is-compact' : ''}`} onSubmit={submit} noValidate>
      <div className="cform-grid">
        <label><span>{u.name} *</span><input name="name" autoComplete="name" required /></label>
        <label><span>{u.phone} *</span><input name="phone" {...phoneInput} autoComplete="tel" placeholder="01xxxxxxxxx" required /></label>
        {!compact && <label><span>{u.email}</span><input name="email" type="email" autoComplete="email" dir="ltr" /></label>}
        {!compact && <label><span>{u.company}</span><input name="company" autoComplete="organization" /></label>}
        <label className="span2"><span>{u.service}</span>
          <select name="service" defaultValue={defaultService}>
            <option value="">{u.choose}</option>
            {services.map((s) => <option key={s.slug} value={tx(s, 'title')}>{tx(s, 'title')}</option>)}
          </select>
        </label>
        <label className="span2"><span>{u.message}</span><textarea name="message" rows={compact ? 3 : 4} /></label>
      </div>
      <button className="btn btn-lime" type="submit" disabled={state.busy}>{state.busy ? u.sending : u.send}<Icon name="arrow" className="flip-next" /></button>
      <p className={`cform-note ${state.ok ? 'is-ok' : ''}`} role="status">{state.note}</p>
    </form>
  )
}

/* ───────── نافذة الاستشارة (Popup) ───────── */
const ConsultCtx = createContext({ open: () => {} })
export const useConsult = () => useContext(ConsultCtx)

export function ConsultProvider({ children }) {
  const [state, setState] = useState({ open: false, service: '' })
  const pop = useBlock('popup')
  const { u, tx } = useLang()
  const { pathname } = useLocation()
  const open = useCallback((service = '') => setState({ open: true, service }), [])
  const close = () => setState((s) => ({ ...s, open: false }))
  // تظهر لوحدها مرة واحدة في الزيارة بعد عدد ثواني محدد من لوحة التحكم
  useEffect(() => {
    if (!pop.enabled || pathname.startsWith('/admin')) return
    let seen = false
    try { seen = sessionStorage.getItem('rq-pop') === '1' } catch { /* ignore */ }
    if (seen) return
    const id = setTimeout(() => {
      setState((s) => (s.open ? s : { open: true, service: '' }))
      try { sessionStorage.setItem('rq-pop', '1') } catch { /* ignore */ }
    }, Math.max(4, Number(pop.delay) || 14) * 1000)
    return () => clearTimeout(id)
  }, [pop.enabled, pop.delay, pathname])
  useEffect(() => {
    if (!state.open) return
    const k = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', k)
    document.body.classList.add('no-scroll')
    return () => { document.removeEventListener('keydown', k); document.body.classList.remove('no-scroll') }
  }, [state.open])
  return (
    <ConsultCtx.Provider value={{ open }}>
      {children}
      {state.open && (
        <div className="pop" role="dialog" aria-modal="true" aria-label={tx(pop, 'title')} onClick={close}>
          <div className="pop-card" onClick={(e) => e.stopPropagation()}>
            <div className="pop-art" style={{ backgroundImage: `url(${pop.image_url || '/media/bell.webp'})` }}>
              <Logo light />
              <ul>
                <li><Icon name="check" size={16} />{u.freeCall}</li>
                <li><Icon name="check" size={16} />{u.licensed.split('—')[0]}</li>
              </ul>
            </div>
            <div className="pop-body">
              <button className="pop-x" type="button" onClick={close} aria-label={u.close}><Icon name="close" /></button>
              <h3>{tx(pop, 'title')}</h3>
              <p>{tx(pop, 'text')}</p>
              <ContactForm compact source="popup" defaultService={state.service} />
            </div>
          </div>
        </div>
      )}
    </ConsultCtx.Provider>
  )
}

/* ───────── عناصر عائمة ───────── */
export function WhatsAppFloat() {
  const c = useBlock('contact')
  const { u } = useLang()
  const { pathname } = useLocation()
  const [top, setTop] = useState(true)
  useEffect(() => {
    const on = () => setTop(window.scrollY < window.innerHeight * 0.6)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [pathname])
  if (!c.whatsapp) return null
  const num = String(c.whatsapp).replace(/\D/g, '')
  return (
    <a className={`wa-float ${top && pathname === '/' ? 'at-top' : ''}`} href={`https://wa.me/${num}`} target="_blank" rel="noreferrer" aria-label={u.whatsapp}>
      <WhatsAppIcon /><span>{u.whatsapp}</span>
    </a>
  )
}

export function ScrollProgress() {
  const [p, setP] = useState(0)
  const [top, setTop] = useState(false)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - innerHeight
      setP(h > 0 ? scrollY / h : 0)
      setTop(scrollY > innerHeight * 0.8)
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  const { u } = useLang()
  return (
    <>
      <div className="sprog" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
      <button type="button" className={`totop ${top ? 'is-on' : ''}`} onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label={u.backTop}>
        <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><circle cx="20" cy="20" r="18" className="ring" style={{ strokeDashoffset: 113 - 113 * p }} /></svg>
        <Icon name="up" size={16} />
      </button>
    </>
  )
}

export function Preloader() {
  const [gone, setGone] = useState(false)
  useEffect(() => { const id = setTimeout(() => setGone(true), 1100); return () => clearTimeout(id) }, [])
  return (
    <div className={`preloader ${gone ? 'is-gone' : ''}`} aria-hidden="true">
      <img src="/logo.svg" alt="" />
      <span className="preloader-bar" />
    </div>
  )
}
