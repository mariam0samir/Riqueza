import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useBlock, useContent } from '../lib/content'
import { lines, pairs, rows, paragraphs, pad2 } from '../lib/parse'
import { Icon, Counter, Slider, SectionHead, Accordion, useConsult } from '../components/ui'
import { PlusBtn, TwoCol, WideImage, Showcase, Finder, Updates, Collage, ProfileBand } from '../components/sections'

/* مساعد: نسبة تقدّم العنصر مع السكرول (0 → 1) */
function useProgress(ref, mode = 'through') {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const calc = () => {
      raf = 0
      const el = ref.current; if (!el) return
      const r = el.getBoundingClientRect(); const vh = innerHeight
      const v = mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : mode === 'enter' ? (vh - r.top) / (vh * 0.9) : (vh - r.top) / (vh + r.height)
      setP(Math.min(1, Math.max(0, v)))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(calc) }
    calc(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [mode])
  return p
}
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/* ───── 1) الهيرو — فيديو كامل + عنوان + أرقام في كروت زجاجية ───── */
const SLIDE_MS = 7000
function Hero() {
  const h = useBlock('hero')
  const st = useBlock('stats')
  const { tx, u } = useLang()
  const { open } = useConsult()
  const slides = pairs(tx(h, 'slides'))
  const [i, setI] = useState(0)
  // فيديو (لو موجود في لوحة التحكم) — وإلا صور حقيقية بتتبدل بحركة زووم بطيئة
  const vids = lines(h.videos).length ? lines(h.videos) : h.video_url ? [h.video_url] : []
  const imgs = lines(h.images).length ? lines(h.images) : [h.poster_url]
  const vi = i % Math.max(1, vids.length)
  const box = useRef(null)
  useEffect(() => {
    box.current?.querySelectorAll('video').forEach((v, k) => {
      if (k === vi && !reduced()) { v.currentTime = 0; const p = v.play(); p && p.catch(() => {}) } else v.pause()
    })
  }, [vi, vids.length])
  useEffect(() => {
    if (slides.length < 2) return
    const id = setTimeout(() => setI((i + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(id)
  }, [i, slides.length])
  const s = slides[i] || {}
  const stats = rows(tx(st, 'items')).slice(0, 3)
  return (
    <section className="hero hero2">
      <div ref={box} className="hero-videos" aria-hidden="true">
        {vids.length ? vids.map((src, k) => (
          <video key={src + k} className={`hero-video ${k === vi ? 'is-on' : ''}`} src={src} poster={k === 0 ? h.poster_url : undefined} autoPlay={k === 0} muted loop playsInline preload={k === 0 ? 'auto' : 'metadata'} />
        )) : imgs.map((src, k) => <img key={src + k} src={src} alt="" className={`hero-img ${k === i % imgs.length ? 'is-on' : ''}`} />)}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero2-in">
        <div className="hero2-copy">
          <h1 className="hero-title" key={i}>
            {s.title?.split(' ').map((w, k, a) => <Fragment key={k}><span className="w"><span style={{ animationDelay: `${k * 80}ms` }}>{w}</span></span>{k < a.length - 1 ? ' ' : ''}</Fragment>)}
          </h1>
          <div className="hero2-btns">
            <PlusBtn to="/services" light>{u.services}</PlusBtn>
            <button type="button" className="btn btn-lime" onClick={() => open()}>{tx(h, 'cta')}</button>
          </div>
          <div className="hero-foot">
            <button type="button" className="hero-ring" onClick={() => setI((i + 1) % Math.max(1, slides.length))} aria-label={u.next}>
              <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" /><circle key={i} className="run" cx="22" cy="22" r="20" style={{ animationDuration: `${SLIDE_MS}ms` }} /></svg>
            </button>
            <span className="hero-count" dir="ltr">{i + 1}/{slides.length}</span>
            <p className="hero-sub" key={'t' + i}>{s.text}</p>
          </div>
        </div>
        <div className="hero2-stats">
          {stats.map(([val, suf, label], k) => (
            <div key={k} className="glass" style={{ animationDelay: `${600 + k * 120}ms` }}><b><Counter to={val} suffix={suf} /></b><span>{label}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───── 2) جملة كبيرة كلماتها بتنوّر مع السكرول ───── */
function Statement() {
  const b = useBlock('intro')
  const { tx, u } = useLang()
  const ref = useRef(null)
  const p = useProgress(ref)
  const words = (tx(b, 'statement') || tx(b, 'title')).split(' ')
  const lit = reduced() ? words.length : Math.round(Math.min(1, Math.max(0, (p - 0.15) / 0.45)) * words.length)
  return (
    <section className="statement" id="intro" ref={ref}>
      <div className="wrap">
        <p className="eyebrow">{tx(b, 'eyebrow')}</p>
        <p className="statement-text">
          {words.map((w, k) => <Fragment key={k}><span className={k < lit ? 'on' : ''}>{w}</span>{' '}</Fragment>)}
        </p>
        <Link to="/about" className="circle-link"><i><Icon name="arrow" size={20} className="flip-next" /></i>{u.readMore}</Link>
      </div>
    </section>
  )
}

/* ───── 3) صورة بتتمدّد لعرض الشاشة + الأرقام ───── */
function ImageBand() {
  const b = useBlock('stats')
  const intro = useBlock('intro')
  const { tx } = useLang()
  const ref = useRef(null)
  const p = useProgress(ref, 'enter')
  const k = reduced() ? 1 : p
  const inset = (1 - k) * 7
  return (
    <section className="band" ref={ref}>
      <div className="band-media" style={{ clipPath: `inset(${inset}% ${inset}% round ${(1 - k) * 32}px)` }}>
        <img src={intro.image_url} alt="" loading="lazy" style={{ transform: `scale(${1.18 - k * 0.18})` }} />
        <div className="band-shade" />
        <div className="wrap band-stats">
          {rows(tx(b, 'items')).map(([val, suf, label], j) => (
            <div key={j} className="band-stat"><b><Counter to={val} suffix={suf} /></b><span>{label}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───── 3b) الأرقام (بتتستخدم في صفحة عن ركويزا) ───── */
export function Stats() {
  const b = useBlock('stats')
  const { tx, u } = useLang()
  return (
    <section className="stats" aria-label={u.ourNumbers}>
      <div className="wrap stats-grid">
        {rows(tx(b, 'items')).map(([val, suf, label], k) => (
          <div key={k} className="stat" data-reveal style={{ transitionDelay: `${k * 90}ms` }}>
            <b><Counter to={val} suffix={suf} /></b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───── 4) الخدمات — قائمة كبيرة والصورة بتتبع الماوس ───── */
function ServicesIndex() {
  const { services } = useContent()
  const { tx, u } = useLang()
  const list = services.filter((s) => s.featured)
  const [hov, setHov] = useState(-1)
  const float = useRef(null)
  const move = (e) => { if (float.current) float.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)` }
  return (
    <section className="sec sx" onMouseMove={move}>
      <div className="wrap">
        <div className="sx-head" data-reveal>
          <div><p className="eyebrow">{u.services}</p><h2 className="h2">{u.whatWeDo}</h2></div>
          <Link to="/services" className="circle-link"><i><Icon name="arrow" size={20} className="flip-next" /></i>{u.allServices}</Link>
        </div>
        <ul className="sx-list" onMouseLeave={() => setHov(-1)}>
          {list.map((s, k) => (
            <li key={s.slug} data-reveal onMouseEnter={() => setHov(k)}>
              <Link to={`/services/${s.slug}`} className={hov === k ? 'is-hov' : hov > -1 ? 'is-dim' : ''}>
                <span className="sx-num">{pad2(k + 1)}</span>
                <img className="sx-thumb" src={s.image_url} alt="" loading="lazy" />
                <span className="sx-title">{tx(s, 'title')}</span>
                <span className="sx-short">{tx(s, 'short')}</span>
                <i className="sx-go"><Icon name="arrow" size={20} className="flip-next" /></i>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={`sx-float ${hov > -1 ? 'is-on' : ''}`} ref={float} aria-hidden="true">
        <div className="sx-float-in">{list.map((s, k) => <img key={s.slug} src={s.image_url} alt="" className={k === hov ? 'on' : ''} />)}</div>
      </div>
    </section>
  )
}

/* ───── 5) كيف نعمل — سكرول أفقي مثبّت (بيتستخدم كمان في صفحة الخدمة) ───── */
export function HScroll({ eyebrow, title, intro, items, imgs, id }) {
  const { dir } = useLang()
  const ref = useRef(null); const track = useRef(null)
  const [pin, setPin] = useState(true)
  const [dist, setDist] = useState(0)
  useEffect(() => {
    const m = matchMedia('(max-width: 960px), (prefers-reduced-motion: reduce)')
    const on = () => { setPin(!m.matches); if (track.current) setDist(Math.max(0, track.current.scrollWidth - innerWidth)) }
    on(); m.addEventListener('change', on); addEventListener('resize', on)
    const t = setTimeout(on, 400)
    return () => { m.removeEventListener('change', on); removeEventListener('resize', on); clearTimeout(t) }
  }, [items.length])
  const p = useProgress(ref, 'pin')
  const x = pin ? p * dist * (dir === 'rtl' ? 1 : -1) : 0
  return (
    <section id={id} className={`hw ${pin ? 'is-pin' : ''}`} ref={ref} style={pin ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className="hw-sticky">
        <div className="wrap hw-head">
          <div><p className="eyebrow">{eyebrow}</p><h2 className="h2">{title}</h2></div>
          <div className="hw-bar"><span style={{ transform: `scaleX(${pin ? p : 1})` }} /></div>
        </div>
        <div className="hw-track" ref={track} style={{ transform: `translateX(${x}px)` }}>
          {intro && <div className="hw-intro"><p>{intro}</p></div>}
          {items.map((s, k) => (
            <article key={k} className="hw-card">
              <img src={imgs[k % Math.max(1, imgs.length)]} alt="" loading="lazy" />
              <span className="hw-num">{pad2(k + 1)}</span>
              <div className="hw-card-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
function HowWeWork() {
  const b = useBlock('approach')
  const hb = useBlock('home')
  const { tx, u } = useLang()
  return <HScroll eyebrow={u.method} title={tx(b, 'title')} items={pairs(tx(b, 'items'))} imgs={lines(b.images)}
    intro={tx(hb, 'approach_intro')} />
}

/* ───── 6) بنتو: التراخيص + لماذا ركويزا ───── */
function Bento() {
  const lic = useBlock('licenses')
  const why = useBlock('why')
  const { tx, u } = useLang()
  const items = rows(tx(lic, 'items')).slice(0, 4)
  const reasons = pairs(tx(why, 'items'))
  return (
    <section className="sec bento-sec">
      <div className="wrap">
        <div className="sx-head" data-reveal>
          <div><p className="eyebrow">{u.licenses}</p><h2 className="h2">{tx({ t_ar: 'ترخيص وثقة ممتدة منذ 2009', t_en: 'Licensed and trusted since 2009' }, 't')}</h2></div>
        </div>
        <div className="bento">
          <Link to="/about" className="bt bt-hero" data-reveal>
            <img src="/media/people.webp" alt="" loading="lazy" />
            <div><b>2009</b><span>{u.licensed}</span><i><Icon name="arrow" size={18} className="flip-next" /></i></div>
          </Link>
          {items.map(([num, title, text], k) => (
            <article key={k} className={`bt bt-num ${k === 1 ? 'is-lime' : ''}`} data-reveal style={{ transitionDelay: `${k * 80}ms` }} tabIndex={0}>
              <b dir="ltr">{num}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
          <div className="bt bt-why" data-reveal>
            <p className="eyebrow">{u.why}</p>
            <ul>{reasons.map((r, k) => <li key={k}><Icon name="check" size={16} />{r.title}</li>)}</ul>
          </div>
          <div className="bt bt-img" data-reveal><img src="/media/handshake.webp" alt="" loading="lazy" /></div>
        </div>
      </div>
    </section>
  )
}

/* ───── 6b) التراخيص (صفحة عن ركويزا) ───── */
export function Licenses() {
  const b = useBlock('licenses')
  const { tx, u } = useLang()
  return (
    <section className="sec lic">
      <div className="wrap">
        <SectionHead eyebrow={u.licenses} title={tx({ t_ar: 'ترخيص وثقة ممتدة منذ 2009', t_en: 'Licensed and trusted since 2009' }, 't')} />
        <div className="lic-grid">
          {rows(tx(b, 'items')).map(([num, title, text], k) => (
            <article key={k} className="lic-card" data-reveal style={{ transitionDelay: `${k * 90}ms` }}>
              <span className="lic-num" dir="ltr">{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChairText({ text }) {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const ps = paragraphs(text)
  return (
    <div className={`chair-more ${open ? 'is-open' : ''}`}>
      <div className="chair-more-in">{ps.map((p, k) => <p key={k} className="body">{p}</p>)}</div>
      {ps.length > 1 && <button type="button" className="plus-btn" onClick={() => setOpen(!open)}><i><Icon name="plus" size={14} /></i>{open ? (lang === 'ar' ? 'إخفاء' : 'Show less') : (lang === 'ar' ? 'اقرأ الكلمة كاملة' : 'Read the full message')}</button>}
    </div>
  )
}

/* ───── 7) كلمة رئيس المجلس — شاشة مقسومة ───── */
export function Chairman({ full = false }) {
  const b = useBlock('chairman')
  const { tx, u } = useLang()
  return (
    <section className={`chair ${full ? 'is-full' : ''}`}>
      <div className="chair-photo">
        <img src={b.photo_url} alt={tx(b, 'name')} loading="lazy" />
      </div>
      <div className="chair-copy" data-reveal>
        <p className="eyebrow">{u.chairman}</p>
        <blockquote>“{tx(b, 'quote')}”</blockquote>
        <div className="chair-sign"><b>{tx(b, 'name')}</b><span>{tx(b, 'role')}</span></div>
        {full && <ChairText text={tx(b, 'text')} />}
        {!full && <Link to="/about#chairman" className="circle-link"><i><Icon name="arrow" size={20} className="flip-next" /></i>{u.readMore}</Link>}
      </div>
    </section>
  )
}

/* ───── 8) العملاء — شريط أسماء ضخم ───── */
function ClientsBig() {
  const { clients } = useContent()
  const { tx, u } = useLang()
  const names = clients.map((c) => tx(c, 'name'))
  const a = names.slice(0, 18), b2 = names.slice(18, 36)
  const Row = ({ items, rev }) => (
    <div className={`bigq ${rev ? 'is-rev' : ''}`} aria-hidden="true">
      <div className="bigq-track" style={{ '--dur': `${items.length * 5}s` }}>
        {[...items, ...items].map((n, k) => <span key={k} className={k % 2 ? 'o' : ''}>{n}<i>✦</i></span>)}
      </div>
    </div>
  )
  return (
    <section className="sec clients-big">
      <div className="wrap sx-head" data-reveal>
        <div><p className="eyebrow">{u.trackRecord}</p><h2 className="h2">{u.trustedBy}</h2></div>
        <Link to="/clients" className="circle-link"><i><Icon name="arrow" size={20} className="flip-next" /></i><span><b dir="ltr">{clients.length}+</b> {u.clientsCount}</span></Link>
      </div>
      <Row items={a} />
      <Row items={b2.length ? b2 : a} rev />
    </section>
  )
}

/* ───── لماذا ركويزا (صفحة عن ركويزا) ───── */
export function Why() {
  const b = useBlock('why')
  const { tx, u } = useLang()
  return (
    <section className="sec why">
      <div className="wrap why-grid">
        <div className="why-art" data-reveal>
          <img src={b.image_url} alt="" loading="lazy" />
          <div className="why-art-badge"><b>15+</b><span>{tx({ t_ar: 'عامًا في السوق المصري', t_en: 'years in Egypt' }, 't')}</span></div>
        </div>
        <div data-reveal>
          <SectionHead eyebrow={u.why} title={tx({ t_ar: 'شريك تعتمد عليه في كل قرار مالي', t_en: 'A partner you can rely on for every financial decision' }, 't')} />
          <Accordion items={pairs(tx(b, 'items'))} />
        </div>
      </div>
    </section>
  )
}

/* ───── 9) المقالات — تحريري ───── */
const fmt = (d, lang) => d ? new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
function HomeInsights() {
  const { posts } = useContent()
  const { tx, u, lang } = useLang()
  if (!posts.length) return null
  const [first, ...rest] = posts
  return (
    <section className="sec ed">
      <div className="wrap">
        <div className="sx-head" data-reveal>
          <div><p className="eyebrow">{u.insights}</p><h2 className="h2">{u.latest}</h2></div>
          <Link to="/insights" className="circle-link"><i><Icon name="arrow" size={20} className="flip-next" /></i>{u.viewAll}</Link>
        </div>
        <div className="ed-grid">
          <Link to={`/insights/${first.slug}`} className="ed-main" data-reveal>
            <img src={first.image_url} alt="" loading="lazy" />
            <div><span className="ed-tag">{tx(first, 'category')}</span><h3>{tx(first, 'title')}</h3><time>{fmt(first.published_at, lang)}</time></div>
          </Link>
          <div className="ed-side">
            {rest.slice(0, 3).map((p) => (
              <Link key={p.slug} to={`/insights/${p.slug}`} className="ed-item" data-reveal>
                <img src={p.image_url} alt="" loading="lazy" />
                <div><span className="ed-tag">{tx(p, 'category')}</span><h3>{tx(p, 'title')}</h3><time>{fmt(p.published_at, lang)}</time></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───── سلايدر المقالات (صفحات تانية) ───── */
export function InsightsSlider() {
  const { posts } = useContent()
  const { tx, u, lang } = useLang()
  if (!posts.length) return null
  return (
    <section className="sec ins-sec">
      <div className="wrap">
        <SectionHead eyebrow={u.insights} title={u.latest}
          action={<Link to="/insights" className="link-arrow" data-reveal>{u.viewAll}<Icon name="arrow" size={18} className="flip-next" /></Link>} />
      </div>
      <div className="wrap-bleed" data-reveal>
        <Slider label={u.insights}>
          {posts.map((p) => (
            <Link key={p.slug} to={`/insights/${p.slug}`} className="ins-card">
              <div className="ins-img"><img src={p.image_url} alt="" loading="lazy" draggable="false" /></div>
              <div className="ins-meta"><span>{tx(p, 'category')}</span><time>{fmt(p.published_at, lang)}</time></div>
              <h3>{tx(p, 'title')}</h3>
              <p>{tx(p, 'excerpt')}</p>
            </Link>
          ))}
        </Slider>
      </div>
    </section>
  )
}

/* ───── 10) دعوة للتواصل ───── */
export function CtaBand() {
  const b = useBlock('cta')
  const { tx } = useLang()
  const { open } = useConsult()
  return (
    <section className="cta-band">
      <div className="cta-bg" style={{ backgroundImage: `url(${b.image_url})` }} />
      <div className="wrap cta-in" data-reveal>
        <h2>{tx(b, 'title')}</h2>
        <p>{tx(b, 'text')}</p>
        <button type="button" className="btn btn-lime btn-lg" onClick={() => open()}>{tx(b, 'button')}<Icon name="arrow" className="flip-next" /></button>
      </div>
    </section>
  )
}

// ترتيب أقسام الرئيسية بيتحدد من لوحة التحكم (الرئيسية ← ترتيب الأقسام)
export const HOME_SECTIONS = {
  hero: 'الواجهة الرئيسية (صور/فيديو + الأرقام)', intro: 'عن ركويزا (عنوان ونص)', image: 'الصورة العريضة', showcase: 'عرض الخدمات بالتبويبات',
  finder: 'ابحث عن الخدمة المناسبة', updates: 'آخر الأخبار', values: 'القيم (كروت فوق صورة)', clients: 'شريط العملاء', profile: 'تحميل الملف التعريفي',
  stats: 'شريط الأرقام', howwework: 'كيف نعمل (سكرول بالعرض)', chairman: 'كلمة رئيس المجلس', cta: 'بانر احجز استشارة',
}
export default function Home() {
  const intro = useBlock('intro')
  const h = useBlock('home')
  const { tx, u } = useLang()
  const order = lines(h.sections).filter((k) => !k.startsWith('-') && HOME_SECTIONS[k])
  const render = {
    hero: () => <Hero />,
    intro: () => <TwoCol title={tx(intro, 'title')} action={<PlusBtn to="/about">{u.learnMore}</PlusBtn>}>{paragraphs(tx(intro, 'text')).slice(0, 2).map((p, k) => <p key={k}>{p}</p>)}</TwoCol>,
    image: () => <WideImage src={h.wide_image_url} />,
    showcase: () => <Showcase eyebrow={u.services} title={tx(h, 'showcase_title')} />,
    finder: () => <Finder />,
    updates: () => <Updates />,
    values: () => <Collage />,
    clients: () => <ClientsBig />,
    profile: () => <ProfileBand />,
    stats: () => <Stats />,
    howwework: () => <HowWeWork />,
    chairman: () => <Chairman />,
    cta: () => <CtaBand />,
  }
  return <>{(order.length ? order : ['hero']).map((k) => <Fragment key={k}>{render[k]()}</Fragment>)}</>
}
