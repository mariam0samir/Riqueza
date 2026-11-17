/* أقسام بأسلوب مواقع الشركات الكبيرة (زي SODIC): صور كبيرة، تبويبات، كاروسيل، فلاتر */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useBlock, useContent } from '../lib/content'
import { pairs, lines } from '../lib/parse'
import { Icon, Slider, useConsult } from './ui'

/* زر بإطار وعلامة + (زي SODIC) */
export function PlusBtn({ to, href, onClick, children, light, download }) {
  const cls = `plus-btn ${light ? 'is-light' : ''}`
  const inner = <><i><Icon name="plus" size={14} /></i>{children}</>
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  if (href) return <a href={href} className={cls} download={download} target={download ? undefined : '_blank'} rel="noreferrer">{inner}</a>
  return <button type="button" className={cls} onClick={onClick}>{inner}</button>
}

/* مقدمة بعمودين: عنوان كبير + نص وزر */
export function TwoCol({ title, children, action, eyebrow }) {
  return (
    <section className="twocol">
      <div className="wrap twocol-in" data-reveal>
        <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="h2">{title}</h2></div>
        <div className="twocol-text">{children}{action}</div>
      </div>
    </section>
  )
}

/* صورة عريضة بتكبر مع السكرول */
export function WideImage({ src }) {
  return <div className="wrap wide-img" data-reveal><img src={src} alt="" loading="lazy" /></div>
}

/* تصنيف الخدمات لمجموعات */
// المجموعات بتتكتب من لوحة التحكم: «اسم عربي | English | slug, slug»
export function useServiceGroups() {
  const { services } = useContent()
  const gb = useBlock('groups')
  return useMemo(() => {
    const GROUPS = lines(gb.items).map((l, k) => {
      const [ar, en, sl] = l.split('|').map((x) => (x || '').trim())
      return { key: 'g' + k, ar, en: en || ar, slugs: (sl || '').split(/[,،]/).map((x) => x.trim()).filter(Boolean) }
    })
    const featured = services.filter((s) => s.featured)
    const used = new Set()
    const groups = (GROUPS.length ? GROUPS : [{ key: 'all', ar: 'خدماتنا', en: 'Services', slugs: [] }]).map((g) => {
      const items = g.slugs.map((sl) => featured.find((s) => s.slug === sl)).filter(Boolean)
      items.forEach((s) => used.add(s.slug))
      return { ...g, items }
    })
    const rest = featured.filter((s) => !used.has(s.slug))
    if (rest.length) groups[0].items.push(...rest)
    return groups.filter((g) => g.items.length)
  }, [services, gb.items])
}

/* عرض الخدمات: صورة كاملة + تبويبات + قائمة جانبية (زي "Our Track Record") */
export function Showcase({ eyebrow, title }) {
  const groups = useServiceGroups()
  const { tx, lang, u } = useLang()
  const [g, setG] = useState(0)
  const [i, setI] = useState(0)
  const grp = groups[g] || groups[0]
  if (!grp) return null
  const s = grp.items[i] || grp.items[0]
  return (
    <section className="show">
      {grp.items.map((x) => <img key={x.slug} src={x.image_url} alt="" className={`show-bg ${x.slug === s.slug ? 'is-on' : ''}`} loading="lazy" />)}
      <div className="show-shade" />
      <div className="wrap show-in">
        <div className="show-top">
          {title && <h2 className="show-title">{title}</h2>}
          <div className="show-tabs" role="tablist" aria-label={eyebrow}>
            {groups.map((x, k) => <button key={x.key} role="tab" aria-selected={k === g} className={k === g ? 'is-on' : ''} onClick={() => { setG(k); setI(0) }}>{x[lang]}</button>)}
          </div>
        </div>
        <div className="show-bottom">
          <div className="show-copy" key={s.slug}>
            <h3>{tx(s, 'title')}</h3>
            <p>{tx(s, 'short')}</p>
            <PlusBtn to={`/services/${s.slug}`} light>{u.discover}</PlusBtn>
          </div>
          <ul className="show-list">
            {grp.items.map((x, k) => <li key={x.slug}><button className={x.slug === s.slug ? 'is-on' : ''} onClick={() => setI(k)}>{tx(x, 'title')}</button></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* فلاتر على الجنب + كاروسيل كروت صور (زي "Life at SODIC") */
export function FilterCarousel({ title, action, filters, items }) {
  const [f, setF] = useState('all')
  const list = items.filter((x) => f === 'all' || x.cat === f)
  return (
    <section className="sec fc">
      <div className="wrap">
        <div className="fc-head" data-reveal><h2 className="h2">{title}</h2>{action}</div>
        <div className="fc-body">
          <div className="fc-filters" data-reveal>
            {filters.map(([k, l, to]) => to ? <Link key={k} to={to} className="is-on">{l}<Icon name="arrow" size={14} className="flip-next" /></Link> : <button key={k} className={f === k ? 'is-on' : ''} onClick={() => setF(k)}>{l}</button>)}
          </div>
          <div className="fc-track" data-reveal>
            <Slider label={title} key={f}>
              {list.map((x, k) => {
                const body = <><div className="fc-img">{x.image ? <img src={x.image} alt="" loading="lazy" draggable="false" /> : <div className="fc-mono"><img src="/logo.svg" alt="" draggable="false" /></div>}{x.tag && <span>{x.tag}</span>}</div><h3>{x.title}</h3>{x.sub && <p>{x.sub}</p>}</>
                return x.href ? <a key={k} href={x.href} className="fc-card" target="_blank" rel="noreferrer">{body}</a>
                  : x.to ? <Link key={k} to={x.to} className="fc-card">{body}</Link>
                  : <div key={k} className="fc-card">{body}</div>
              })}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  )
}

/* "ابحث عن الخدمة المناسبة" — جملة فيها اختيارات */
export function Finder() {
  const { services } = useContent()
  const { tx, u } = useLang()
  const { open } = useConsult()
  const h = useBlock('home')
  const list = services.filter((s) => s.featured)
  const [slug, setSlug] = useState(list[0]?.slug)
  const stages = lines(tx(h, 'finder_stages'))
  const [stage, setStage] = useState(0)
  const svc = list.find((s) => s.slug === slug) || list[0]
  if (!svc) return null
  return (
    <section className="sec finder">
      <div className="wrap finder-grid">
        <div className="finder-in" data-reveal>
          <p className="eyebrow">{u.findService}</p>
          <h2>{tx(h, 'finder_title')}</h2>
          <p className="finder-sentence">
            <span>{u.lookingFor}</span>
            <label className="finder-sel"><select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label={u.services}>{list.map((s) => <option key={s.slug} value={s.slug}>{tx(s, 'title')}</option>)}</select></label>
            <span>{u.forMy}</span>
            <label className="finder-sel"><select value={stage} onChange={(e) => setStage(+e.target.value)} aria-label="stage">{stages.map((x, k) => <option key={k} value={k}>{x}</option>)}</select></label>
          </p>
          <div className="finder-btns">
            <PlusBtn to={`/services/${svc.slug}`}>{u.explore}</PlusBtn>
            <button type="button" className="btn btn-lime" onClick={() => open(`${tx(svc, 'title')} — ${stages[stage]}`)}>{u.consult}<Icon name="arrow" size={18} className="flip-next" /></button>
          </div>
        </div>
        <div className="finder-art" data-reveal>
          <img src={svc.image_url || h.finder_image_url} alt="" loading="lazy" key={svc.slug} />
          <div className="finder-card" key={'c' + svc.slug}>
            <small>{stages[stage]}</small>
            <b>{tx(svc, 'title')}</b>
            {tx(svc, 'short') && <p>{tx(svc, 'short')}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

/* آخر الأخبار: كروت نص وصورة بالتبادل */
const fmt = (d, lang) => d ? new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
export function Updates() {
  const { posts } = useContent()
  const { tx, u, lang } = useLang()
  if (!posts.length) return null
  return (
    <section className="sec upd">
      <div className="wrap">
        <div className="fc-head" data-reveal><h2 className="h2">{u.latestUpdates}</h2><PlusBtn to="/insights">{u.seeAll}</PlusBtn></div>
      </div>
      <div className="wrap-bleed" data-reveal>
        <Slider label={u.latestUpdates}>
          {posts.flatMap((p) => [
            <article key={p.slug + 't'} className="upd-card">
              <span className="upd-tag">{tx(p, 'category')}</span>
              <time>{fmt(p.published_at, lang)}</time>
              <h3>{tx(p, 'title')}</h3>
              <p>{tx(p, 'excerpt')}</p>
              <PlusBtn to={`/insights/${p.slug}`}>{u.learnMore}</PlusBtn>
            </article>,
            <Link key={p.slug + 'i'} to={`/insights/${p.slug}`} className="upd-img"><img src={p.image_url} alt="" loading="lazy" draggable="false" /></Link>,
          ])}
        </Slider>
      </div>
    </section>
  )
}

/* كولاج صور بقيم الشركة (زي "Sustainability") */
export function Collage() {
  const b = useBlock('values')
  const why = useBlock('why')
  const h = useBlock('home')
  const { tx, u } = useLang()
  const COLLAGE = lines(h.values_images).length ? lines(h.values_images) : ['/media/people.webp']
  const items = [...pairs(tx(b, 'items')), ...pairs(tx(why, 'items'))].slice(0, 5)
  const card = (v, k) => (
    <article key={k} className="sus-card" data-reveal style={{ transitionDelay: `${(k % 3) * 120}ms` }}>
      <img src={COLLAGE[k % COLLAGE.length]} alt="" loading="lazy" />
      <div><h3>{v.title}</h3><p>{v.text}</p></div>
    </article>
  )
  // 3 أعمدة متدرجة زي SODIC: عمود فيه كارت نازل لتحت، وعمودين فيهم كارتين
  const cols = [[items[0]], [items[1], items[2]], [items[3], items[4]]].map((c) => c.filter(Boolean))
  return (
    <section className="sus">
      <div className="sus-bg"><img src={h.values_bg_url} alt="" /></div>
      <div className="wrap sus-head" data-reveal>
        <p className="eyebrow light">{u.values}</p>
        <h2>{tx(h, 'values_title')}</h2>
        <p>{tx(h, 'values_text')}</p>
      </div>
      <div className="wrap sus-cols">
        {cols.map((c, ci) => <div key={ci} className={`sus-col c${ci}`}>{c.map((v) => card(v, items.indexOf(v)))}</div>)}
      </div>
    </section>
  )
}

/* شريط تحميل الملف التعريفي (زي "Download the app") */
export function ProfileBand() {
  const { library } = useContent()
  const { tx, u } = useLang()
  const prof = library.find((f) => f.category === 'profile') || library[0]
  return (
    <section className="sec pband">
      <div className="wrap pband-in" data-reveal>
        <div className="pband-cover"><img src={prof?.cover_url || '/media/building.webp'} alt="" loading="lazy" /><span><Icon name="file" size={22} />PDF</span></div>
        <div>
          <p className="eyebrow">{u.library}</p>
          <h2 className="h2">{prof ? tx(prof, 'title') : u.library}</h2>
          <p className="lead">{prof ? tx(prof, 'description') : u.libraryText}</p>
          <div className="pband-btns">
            {prof && <a className="btn btn-lime" href={prof.file_url} download><Icon name="download" size={18} />{u.download}</a>}
            <PlusBtn to="/library">{u.library}</PlusBtn>
          </div>
        </div>
      </div>
    </section>
  )
}

/* صورة ونص بالتبادل (زي "A Trusted Developer") */
export function Checker({ items }) {
  return (
    <section className="checker">
      {items.map((it, k) => (
        <div key={k} className={`ck-row ${k % 2 ? 'is-rev' : ''}`} data-reveal>
          <div className="ck-text"><h3>{it.title}</h3><p>{it.text}</p></div>
          <div className="ck-img"><img src={it.image} alt="" loading="lazy" /></div>
        </div>
      ))}
    </section>
  )
}

/* بانر بصورة وزر (زي "Working at SODIC") */
export function Banner({ image, title, text, action }) {
  return (
    <section className="banner">
      <img src={image} alt="" loading="lazy" />
      <div className="wrap banner-in" data-reveal><h2>{title}</h2>{text && <p>{text}</p>}{action}</div>
    </section>
  )
}

/* تبويبات جانبية: اختار بند فيظهر بصورته وتفاصيله */
export function Tabs({ eyebrow, title, items, imgs }) {
  const [i, setI] = useState(0)
  const it = items[i] || items[0]
  return (
    <section className="sec tabs-sec soft">
      <div className="wrap">
        <div className="fc-head" data-reveal><div><p className="eyebrow">{eyebrow}</p><h2 className="h2">{title}</h2></div></div>
        <div className="tabs" data-reveal>
          <div className="tabs-list" role="tablist">
            {items.map((x, k) => (
              <button key={k} role="tab" aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => setI(k)}>
                <span>{String(k + 1).padStart(2, '0')}</span>{x.title}
              </button>
            ))}
          </div>
          <div className="tabs-panel" key={i}>
            <img src={imgs[i % imgs.length]} alt="" loading="lazy" />
            <div className="tabs-body">
              <h3>{it.title}</h3>
              {it.text && <p>{it.text}</p>}
              {it.list?.length > 0 && <ul>{it.list.slice(0, 5).map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* أرقام التراخيص كبيرة ومتحركة */
export function NumberStrip({ items }) {
  return (
    <section className="nstrip">
      <div className="wrap nstrip-in">
        {items.map(([num, title], k) => (
          <div key={k} className="nstrip-item" data-reveal style={{ transitionDelay: `${k * 100}ms` }}>
            <b dir="ltr">{num}</b><span>{title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───── مجلس الإدارة: كروت + نافذة تفاصيل ───── */
export function BoardModal({ list, index, onClose, onGo }) {
  const { tx, u, lang } = useLang()
  const m = list[index]
  useEffect(() => {
    if (!m) return
    document.body.classList.add('no-scroll')
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onGo(lang === 'ar' ? 1 : -1)
      if (e.key === 'ArrowRight') onGo(lang === 'ar' ? -1 : 1)
    }
    addEventListener('keydown', key)
    return () => { document.body.classList.remove('no-scroll'); removeEventListener('keydown', key) }
  }, [m, lang])
  if (!m) return null
  const bio = tx(m, 'bio') || tx({ t_ar: `${tx(m, 'role')} في ركويزا للاستشارات المالية عن الأوراق المالية.`, t_en: `${tx(m, 'role')} at Riqueza for Financial Consultancy on Securities.` }, 't')
  return (
    <div className="bm" role="dialog" aria-modal="true" aria-label={tx(m, 'name')} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm-book" key={m.id || index}>
        <button type="button" className="bm-x" onClick={onClose} aria-label={u.close}><Icon name="close" size={18} /></button>
        <div className="bm-page bm-left">{m.photo_url ? <img src={m.photo_url} alt={tx(m, 'name')} /> : <img className="mono" src="/logo.svg" alt="" />}</div>
        <div className="bm-page bm-right">
          <p className="eyebrow">{u.board}</p>
          <h3>{tx(m, 'name')}</h3>
          <span className="bm-role">{tx(m, 'role')}</span>
          {bio.split(/\n{2,}/).map((p, k) => <p key={k}>{p}</p>)}
          {list.length > 1 && (
            <div className="bm-nav">
              <button type="button" onClick={() => onGo(-1)} aria-label={u.prev}><Icon name="arrow" size={18} className="flip-prev" /></button>
              <button type="button" onClick={() => onGo(1)} aria-label={u.next}><Icon name="arrow" size={18} className="flip-next" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function BoardGrid({ list, featureFirst = true }) {
  const { tx } = useLang()
  const [open, setOpen] = useState(-1)
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('m')
    if (id) { const k = list.findIndex((x) => String(x.id) === id); if (k > -1) setOpen(k) }
  }, [list.length])
  return (
    <>
      <div className="bd-grid">
        {list.map((m, k) => (
          <button type="button" key={m.id || k} className={`bd-card ${featureFirst && k === 0 ? 'bd-lead' : ''}`} data-reveal style={{ transitionDelay: `${(k % 4) * 80}ms` }} onClick={() => setOpen(k)}>
            <div className="bd-photo">{m.photo_url ? <img src={m.photo_url} alt="" loading="lazy" /> : <img className="mono" src="/logo.svg" alt="" />}</div>
            <div className="bd-info"><b>{tx(m, 'name')}</b><span>{tx(m, 'role')}</span><i><Icon name="plus" size={16} /></i></div>
          </button>
        ))}
      </div>
      <BoardModal list={list} index={open} onClose={() => setOpen(-1)} onGo={(d) => setOpen((open + d + list.length) % list.length)} />
    </>
  )
}
