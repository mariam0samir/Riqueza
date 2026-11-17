import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useBlock, useContent, useReady, sendMessage } from '../lib/content'
import { lines, pairs, cards, rows, paragraphs, pad2 } from '../lib/parse'
import { Icon, PageHero, SectionHead, Accordion, ContactForm, Slider, useConsult, WhatsAppIcon } from '../components/ui'
import { Stats, Chairman, Why, CtaBand, InsightsSlider, HScroll } from '../home/Home'
import { PlusBtn, TwoCol, WideImage, Checker, Collage, ProfileBand, Banner, FilterCarousel, Tabs, NumberStrip, BoardGrid, useServiceGroups } from '../components/sections'

function useHashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    return () => clearTimeout(id)
  }, [hash])
}

const useTitle = (t) => useEffect(() => { if (t) document.title = `${t} | Riqueza` }, [t])

/* ═════════ أقسام تحريرية مشتركة ═════════ */
// عنوان ثابت على جنب + صفوف بخطوط فاصلة (زي المواقع الكبيرة بدل الكروت)
function Rows({ id, eyebrow, title, lead, items, soft, numbered = true, compact }) {
  if (!items?.length) return null
  return (
    <section className={`sec rs ${soft ? 'soft' : ''}`} id={id}>
      <div className="wrap rs-grid">
        <div className="rs-aside" data-reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2">{title}</h2>
          {lead && <p className="rs-lead">{lead}</p>}
        </div>
        <ol className={`rs-list ${compact ? 'is-compact' : ''}`}>
          {items.map((it, k) => (
            <li key={k} data-reveal className={!it.text && !it.list?.length ? 'is-solo' : ''}>
              {numbered && <span className="rs-num" dir={it.num ? 'ltr' : undefined}>{it.num || pad2(k + 1)}</span>}
              <h3>{it.title}</h3>
              {(it.text || it.list?.length > 0) && (
                <div className="rs-body">
                  {it.text && <p>{it.text}</p>}
                  {it.list?.length > 0 && <ul className="rs-tags">{it.list.map((x) => <li key={x}>{x}</li>)}</ul>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// صورة عرض الشاشة بتأثير parallax وجملة كبيرة فوقها
function ImageBreak({ src, text, sub }) {
  return (
    <section className="ib" aria-hidden={!text}>
      <div className="ib-media"><img src={src} alt="" loading="lazy" /></div>
      {text && <div className="wrap ib-in" data-reveal><p>{text}</p>{sub && <span>{sub}</span>}</div>}
    </section>
  )
}
const asCards = (txt) => (txt || '').match(/[;؛]/) ? cards(txt).map((c) => ({ title: c.title, list: c.items })) : pairs(txt)

/* ═════════ عن ركويزا ═════════ */
export function About() {
  const { tx, u } = useLang()
  const intro = useBlock('intro')
  const why = useBlock('why')
  const lic = useBlock('licenses')
  const { board } = useContent()
  useHashScroll(); useTitle(u.about)
  const ap = useBlock('about_page')
  const ckImgs = lines(ap.checker_images)
  const ck = pairs(tx(why, 'items')).slice(0, 3).map((x, k) => ({ ...x, image: ckImgs[k % Math.max(1, ckImgs.length)] }))
  return (
    <>
      <PageHero title={u.about} image={ap.hero_image_url} crumbs={[['', u.about]]} />
      <TwoCol title={tx(intro, 'title')}>
        {paragraphs(tx(intro, 'text')).map((p, k) => <p key={k}>{p}</p>)}
      </TwoCol>
      <Checker items={ck} />
      <Stats />

      <section className="sec mv">
        <div className="wrap">
          {[['mission', ap.mission_image_url], ['vision', ap.vision_image_url]].map(([k, img]) => (
            <div key={k} className="mv-row" data-reveal>
              <img src={img} alt="" loading="lazy" />
              <div><h2 className="h2">{u[k]}</h2><p>{tx(intro, k)}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div id="chairman"><Chairman full /></div>

      <div id="board">
        <FilterCarousel title={tx(ap, 'team_title')} filters={[['board', u.board, '/board']]} action={<PlusBtn to="/board">{u.viewAll}</PlusBtn>}
          items={board.map((m) => ({ cat: 'all', image: m.photo_url, title: tx(m, 'name'), sub: tx(m, 'role'), to: `/board?m=${m.id}` }))} />
      </div>

      <NumberStrip items={rows(tx(lic, 'items')).slice(0, 4)} />
      <Collage />
      <ProfileBand />
      <Banner image={ap.careers_image_url} title={tx(ap, 'careers_title')}
        text={tx(ap, 'careers_text')}
        action={<PlusBtn to="/careers" light>{u.careers}</PlusBtn>} />
    </>
  )
}

/* ═════════ مجلس الإدارة ═════════ */
export function Board() {
  const { board } = useContent()
  const { tx, u } = useLang()
  const pg = useBlock('pages')
  useTitle(u.board)
  return (
    <>
      <PageHero title={u.board} image={pg.board_image_url} crumbs={[['/about', u.about], ['', u.board]]} />
      <section className="sec">
        <div className="wrap">
          <div className="fc-head" data-reveal>
            <h2 className="h2">{tx(pg, 'board_title')}</h2>
          </div>
          <BoardGrid list={board} />
        </div>
      </section>
      <CtaBand />
    </>
  )
}

/* ═════════ مكتبة ركويزا ═════════ */
export function Library() {
  const { library } = useContent()
  const { tx, u, lang } = useLang()
  const pg = useBlock('pages')
  useTitle(u.library)
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const cats = Object.keys(u.libCats).filter((c) => library.some((f) => f.category === c))
  const list = library.filter((f) => (cat === 'all' || f.category === cat) && (!q || `${f.title_ar} ${f.title_en} ${f.description_ar} ${f.description_en}`.toLowerCase().includes(q.toLowerCase())))
  const ext = (url) => (url || '').split('?')[0].split('.').pop().toUpperCase().slice(0, 4)
  return (
    <>
      <PageHero title={u.library} image={pg.library_image_url} text={u.libraryText} crumbs={[['', u.library]]} />
      <section className="sec">
        <div className="wrap">
          <div className="cl-bar" data-reveal>
            <div className="chips" role="tablist">
              <button className={cat === 'all' ? 'is-on' : ''} onClick={() => setCat('all')}>{u.all}<i>{library.length}</i></button>
              {cats.map((c) => <button key={c} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{u.libCats[c]}<i>{library.filter((f) => f.category === c).length}</i></button>)}
            </div>
            <label className="cl-search"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.search} aria-label={u.search} /></label>
          </div>
          {list.length ? (
            <div className="lib-grid">
              {list.map((f, k) => (
                <article key={f.id || k} className="lib-card" data-reveal style={{ transitionDelay: `${(k % 3) * 80}ms` }}>
                  <a href={f.file_url} target="_blank" rel="noreferrer" className="lib-cover" aria-label={u.view}>
                    <img src={f.cover_url || '/media/documents.webp'} alt="" loading="lazy" />
                    <span className="lib-type"><Icon name="file" size={16} />{ext(f.file_url)}</span>
                  </a>
                  <div className="lib-body">
                    <span className="lib-cat">{u.libCats[f.category] || f.category}</span>
                    <h3>{tx(f, 'title')}</h3>
                    {tx(f, 'description') && <p>{tx(f, 'description')}</p>}
                    <div className="lib-meta">{fmtDate(f.published_at, lang)}{f.pages ? ` · ${f.pages} ${lang === 'ar' ? 'صفحة' : 'pages'}` : ''}</div>
                    <div className="lib-btns">
                      <a className="btn btn-lime btn-sm" href={f.file_url} download><Icon name="download" size={16} />{u.download}</a>
                      <a className="plus-btn" href={f.file_url} target="_blank" rel="noreferrer"><i><Icon name="eye" size={15} /></i>{u.view}</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="lib-empty">{u.noFiles}</p>}
        </div>
      </section>
      <CtaBand />
    </>
  )
}

/* ═════════ الخدمات ═════════ */
export function Services() {
  const { services } = useContent()
  const { tx, u } = useLang()
  const pg = useBlock('pages')
  useTitle(u.services)
  const featured = services.filter((s) => s.featured)
  const others = services.filter((s) => !s.featured)
  // كروت عريضة بتتوزع بحيث آخر صف يكون مكتمل مهما كان عدد الخدمات
  const wides = (() => {
    const n = featured.length; const cand = []
    for (let i = 0; i < n; i++) if (i % 7 === 0 || i % 7 === 3) cand.push(i)
    for (let w = Math.min(cand.length, 5); w >= 0; w--) if ((n + w) % 3 === 0) return new Set(cand.slice(0, w))
    return new Set([0])
  })()
  return (
    <>
      <PageHero title={tx(pg, 'services_title')} eyebrow={u.services} image={pg.services_image_url} crumbs={[['', u.services]]}
        text={tx(pg, 'services_text')} />
      <section className="sec">
        <div className="wrap">
          <div className="svc-grid">
            {featured.map((s, k) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className={`svc-tile ${wides.has(k) ? 'is-wide' : ''}`} data-reveal style={{ transitionDelay: `${(k % 3) * 80}ms` }}>
                <img src={s.image_url} alt="" loading="lazy" />
                <div className="svc-tile-shade" />
                <div className="svc-tile-body">
                  <span>{pad2(k + 1)}</span>
                  <h3>{tx(s, 'title')}</h3>
                  <p>{tx(s, 'short')}</p>
                  <i><Icon name="arrow" className="flip-next" /></i>
                </div>
              </Link>
            ))}
          </div>
          {others.length > 0 && (
            <div className="svc-more" data-reveal>
              <h3 className="h3">{u.more}</h3>
              <ul>{others.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}><span>{tx(s, 'title')}</span><Icon name="arrow" size={18} className="flip-next" /></Link></li>)}</ul>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  )
}

export function ServiceDetail() {
  const { slug } = useParams()
  const { services } = useContent()
  const ready = useReady()
  const { tx, u, lang } = useLang()
  const { open } = useConsult()
  const groups = useServiceGroups()
  const sp = useBlock('service_page')
  const s = services.find((x) => x.slug === slug)
  const grp = groups.find((g) => g.items.some((x) => x.slug === slug))
  useTitle(s ? tx(s, 'title') : '')
  if (!s) return ready ? <NotFound /> : <div className="page-loading" />
  const T = (k) => tx(s, k)
  const others = services.filter((x) => x.featured && x.slug !== slug).slice(0, 6)
  const pool = lines(sp.step_images).length ? lines(sp.step_images) : ['/media/people.webp']
  const seed = [...slug].reduce((n, c) => n + c.charCodeAt(0), 0)
  const stepImgs = pool.map((_, k) => pool[(seed + k) % pool.length]).filter((x) => x !== s.image_url)
  const wides = lines(sp.wide_images).length ? lines(sp.wide_images) : ['/media/city.webp']
  const brk = wides[seed % wides.length]
  const pillars = asCards(T('pillars'))
  return (
    <>
      <PageHero title={T('title')} eyebrow={u.services} image={s.image_url} crumbs={[['/services', u.services], ['', T('title')]]} />
      <div className="sd-strip">
        <div className="wrap sd-strip-in">
          <div><small>{u.services}</small><b>{grp ? grp[lang] : u.services}</b></div>
          <div><small>{tx(sp, 'license_label')}</small><b>{tx(sp, 'license_value')}</b></div>
          <div><small>{tx(sp, 'first_label')}</small><b>{tx(sp, 'first_value')}</b></div>
          <PlusBtn onClick={() => open(T('title'))} light>{u.consult}</PlusBtn>
        </div>
      </div>
      <TwoCol title={T('def_title') || tx(sp, 'about_title')}>
        <p>{T('def_lead') || T('intro') || T('short')}</p>
      </TwoCol>
      <WideImage src={brk} />
      {pillars.length > 0 && <Tabs eyebrow={u.ourServices} title={tx(sp, 'tabs_title')} items={pillars} imgs={stepImgs} />}
      {T('importance') && (
        <section className="sec" id="imp">
          <div className="wrap">
            <div className="fc-head" data-reveal><div><p className="eyebrow">{u.importance}</p><h2 className="h2">{tx(sp, 'importance_title')}</h2></div></div>
            <div className="tiles">
              {pairs(T('importance')).slice(0, 6).map((c, k) => (
                <article key={k} className={`tile c${k % 4}`} data-reveal style={{ transitionDelay: `${(k % 3) * 90}ms` }} tabIndex={0}>
                  <Icon name={['chart', 'shield', 'users', 'building', 'scale', 'spark'][k % 6]} size={34} />
                  <h3>{c.title}</h3><p>{c.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      {T('steps') && <HScroll id="steps" eyebrow={u.method} title={tx(sp, 'steps_title')} items={pairs(T('steps'))} imgs={stepImgs} />}

      {T('faq') && (
        <section className="sec" id="faq">
          <div className="wrap faq-grid">
            <SectionHead eyebrow={u.faq} title={tx(sp, 'faq_title')} />
            <div data-reveal><Accordion items={pairs(T('faq'))} /></div>
          </div>
        </section>
      )}

      <section className="sec sd-cta">
        <div className="wrap sd-cta-in" data-reveal>
          <div><h2 className="h2">{tx(sp, 'cta_title').replace('{service}', T('title'))}</h2>
            <p className="lead">{tx(sp, 'cta_text')}</p></div>
          <ContactForm source={`service:${s.slug}`} defaultService={T('title')} />
        </div>
      </section>

      {others.length > 0 && (
        <section className="sec">
          <div className="wrap"><SectionHead eyebrow={u.services} title={u.otherServices} /></div>
          <div className="wrap-bleed"><Slider label={u.otherServices}>
            {others.map((o) => (
              <Link key={o.slug} to={`/services/${o.slug}`} className="svc-card is-sm">
                <div className="svc-card-img"><img src={o.image_url} alt="" loading="lazy" draggable="false" /></div>
                <div className="svc-card-body"><h3>{tx(o, 'title')}</h3><p>{tx(o, 'short')}</p></div>
              </Link>
            ))}
          </Slider></div>
        </section>
      )}
    </>
  )
}

/* ═════════ شركاء النجاح ═════════ */
export function Clients() {
  const { clients } = useContent()
  const { tx, u } = useLang()
  const pg = useBlock('pages')
  useTitle(u.clients)
  const cats = ['holding', 'listed', 'prior', 'emak', 'international'].filter((c) => clients.some((x) => x.category === c))
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => clients.filter((c) => (cat === 'all' || c.category === cat) && (!q || tx(c, 'name').toLowerCase().includes(q.toLowerCase()))), [clients, cat, q, tx])
  return (
    <>
      <PageHero title={u.trustedBy} eyebrow={u.trackRecord} image={pg.clients_image_url} crumbs={[['', u.clients]]}
        text={`${clients.length} — ${tx(pg, 'clients_text')}`} />
      <Stats dark={false} />
      <section className="sec">
        <div className="wrap">
          <div className="cl-bar" data-reveal>
            <div className="chips" role="tablist">
              <button type="button" className={cat === 'all' ? 'is-on' : ''} onClick={() => setCat('all')}>{u.all} <i>{clients.length}</i></button>
              {cats.map((c) => <button key={c} type="button" className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{u[c]} <i>{clients.filter((x) => x.category === c).length}</i></button>)}
            </div>
            <label className="cl-search"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.searchClients} /></label>
          </div>
          <ul className="cl-grid">
            {list.map((c, k) => (
              <li key={c.id || k} className="cl" style={{ animationDelay: `${Math.min(k, 30) * 15}ms` }}>
                {c.logo_url ? <img src={c.logo_url} alt="" loading="lazy" /> : <span className="cl-ini">{tx(c, 'name').replace(/^(شركة|الشركة)\s+/, '').charAt(0)}</span>}
                <div><b>{tx(c, 'name')}</b><small>{u[c.category]}</small></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  )
}

/* ═════════ المعرفة ═════════ */
const fmtDate = (d, lang) => d ? new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

export function Insights() {
  const { posts } = useContent()
  const { tx, u, lang } = useLang()
  const pg = useBlock('pages')
  useTitle(u.insights)
  const [first, ...rest] = posts
  return (
    <>
      <PageHero title={u.latest} eyebrow={u.insights} image={pg.insights_image_url} crumbs={[['', u.insights]]} />
      <section className="sec">
        <div className="wrap">
          {first && (
            <Link to={`/insights/${first.slug}`} className="ins-feature" data-reveal>
              <div className="ins-img"><img src={first.image_url} alt="" /></div>
              <div><div className="ins-meta"><span>{tx(first, 'category')}</span><time>{fmtDate(first.published_at, lang)}</time></div>
                <h2 className="h2">{tx(first, 'title')}</h2><p className="body">{tx(first, 'excerpt')}</p>
                <span className="link-arrow">{u.readMore}<Icon name="arrow" size={18} className="flip-next" /></span></div>
            </Link>
          )}
          <div className="ins-grid">
            {rest.map((p, k) => (
              <Link key={p.slug} to={`/insights/${p.slug}`} className="ins-card" data-reveal style={{ transitionDelay: `${(k % 3) * 80}ms` }}>
                <div className="ins-img"><img src={p.image_url} alt="" loading="lazy" /></div>
                <div className="ins-meta"><span>{tx(p, 'category')}</span><time>{fmtDate(p.published_at, lang)}</time></div>
                <h3>{tx(p, 'title')}</h3><p>{tx(p, 'excerpt')}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function Post() {
  const { slug } = useParams()
  const { posts } = useContent()
  const ready = useReady()
  const { tx, u, lang } = useLang()
  const p = posts.find((x) => x.slug === slug)
  useTitle(p ? tx(p, 'title') : '')
  if (!p) return ready ? <NotFound /> : <div className="page-loading" />
  return (
    <>
      <PageHero title={tx(p, 'title')} eyebrow={tx(p, 'category')} image={p.image_url} crumbs={[['/insights', u.insights], ['', tx(p, 'title')]]} text={fmtDate(p.published_at, lang)} />
      <article className="sec">
        <div className="wrap narrow post">
          <p className="lead" data-reveal>{tx(p, 'excerpt')}</p>
          {paragraphs(tx(p, 'body')).map((x, k) => <p key={k} className="body big" data-reveal>{x}</p>)}
        </div>
      </article>
      <InsightsSlider />
    </>
  )
}

/* ═════════ المركز الإعلامي ═════════ */
export function Media() {
  const { gallery, videos } = useContent()
  const { tx, u } = useLang()
  const pg = useBlock('pages')
  const [lb, setLb] = useState(-1)
  useTitle(u.media)
  useEffect(() => {
    if (lb < 0) return
    const k = (e) => { if (e.key === 'Escape') setLb(-1); if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setLb((i) => (i + (e.key === 'ArrowRight' ? 1 : -1) + gallery.length) % gallery.length) }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [lb, gallery.length])
  const embed = (url) => {
    const y = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
    return y ? `https://www.youtube.com/embed/${y[1]}` : url
  }
  return (
    <>
      <PageHero title={u.media} eyebrow={u.media} image={pg.media_image_url} crumbs={[['', u.media]]} />
      {gallery.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <SectionHead eyebrow={u.gallery} title={u.gallery} />
            <div className="gal">
              {gallery.map((g, k) => (
                <button key={g.id || k} type="button" className="gal-item" onClick={() => setLb(k)} data-reveal>
                  <img src={g.image_url} alt={tx(g, 'title')} loading="lazy" />{tx(g, 'title') && <span>{tx(g, 'title')}</span>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      {videos.length > 0 && (
        <section className="sec soft">
          <div className="wrap">
            <SectionHead eyebrow={u.videos} title={u.videos} />
            <div className="vid-grid">
              {videos.map((v, k) => (
                <figure key={v.id || k} className="vid" data-reveal>
                  {/youtu/.test(v.video_url) ? <iframe src={embed(v.video_url)} title={tx(v, 'title') || 'video'} loading="lazy" allowFullScreen /> : <video src={v.video_url} poster={v.thumb_url} controls preload="none" />}
                  {tx(v, 'title') && <figcaption>{tx(v, 'title')}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
      {!gallery.length && !videos.length && <section className="sec"><div className="wrap narrow center"><p className="lead">{tx({ t_ar: 'سيتم إضافة الصور والفيديوهات قريبًا.', t_en: 'Photos and videos are coming soon.' }, 't')}</p></div></section>}
      {lb >= 0 && gallery[lb] && (
        <div className="lb" role="dialog" aria-modal="true" onClick={() => setLb(-1)}>
          <img src={gallery[lb].image_url} alt={tx(gallery[lb], 'title')} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lb-x" onClick={() => setLb(-1)} aria-label={u.close}><Icon name="close" /></button>
        </div>
      )}
    </>
  )
}

/* ═════════ استثمر في مصر ═════════ */
export function Invest() {
  const b = useBlock('invest')
  const { tx, u } = useLang()
  useTitle(u.invest)
  return (
    <>
      <PageHero title={tx(b, 'title')} eyebrow={u.invest} image={b.image_url} text={tx(b, 'lead')} crumbs={[['', u.invest]]} />
      <section className="sec">
        <div className="wrap">
          <div className="invest-grid">
            {pairs(tx(b, 'items')).map((c, k) => (
              <article key={k} className="invest" data-reveal style={{ transitionDelay: `${(k % 3) * 80}ms` }}><span>{pad2(k + 1)}</span><h3>{c.title}</h3><p>{c.text}</p></article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}

/* ═════════ الوظائف ═════════ */
export function Careers() {
  const { jobs } = useContent()
  const { tx, u } = useLang()
  const pg = useBlock('pages')
  const [state, setState] = useState({ busy: false, note: '', ok: false })
  useTitle(u.careers)
  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const v = Object.fromEntries(new FormData(f).entries())
    if (!v.name?.trim() || !v.phone?.trim()) { setState({ busy: false, note: u.required, ok: false }); return }
    setState({ busy: true, note: '', ok: false })
    try {
      await sendMessage({ source: 'careers', name: v.name.trim(), phone: v.phone.trim(), email: v.email || null, subject: v.position || null, link: v.link || null, body: v.message || null })
      f.reset(); setState({ busy: false, note: u.sent, ok: true })
    } catch { setState({ busy: false, note: u.failed, ok: false }) }
  }
  return (
    <>
      <PageHero title={u.applyTitle} eyebrow={u.careers} image={pg.careers_image_url} crumbs={[['', u.careers]]} />
      <section className="sec">
        <div className="wrap careers">
          <div>
            {jobs.length ? jobs.map((j) => (
              <article key={j.id} className="job" data-reveal>
                <h3>{tx(j, 'title')}</h3>
                <p className="job-meta">{[tx(j, 'location'), tx(j, 'type')].filter(Boolean).join(' · ')}</p>
                {tx(j, 'description') && <p>{tx(j, 'description')}</p>}
              </article>
            )) : <p className="lead" data-reveal>{u.noJobs}</p>}
          </div>
          <form className="cform" onSubmit={submit} noValidate data-reveal>
            <div className="cform-grid">
              <label><span>{u.name} *</span><input name="name" required /></label>
              <label><span>{u.phone} *</span><input name="phone" type="tel" dir="ltr" required /></label>
              <label><span>{u.email}</span><input name="email" type="email" dir="ltr" /></label>
              <label><span>{u.position}</span>{jobs.length ? <select name="position"><option value="">—</option>{jobs.map((j) => <option key={j.id}>{tx(j, 'title')}</option>)}</select> : <input name="position" />}</label>
              <label className="span2"><span>{u.cvLink}</span><input name="link" type="url" dir="ltr" placeholder="https://" /></label>
              <label className="span2"><span>{u.message}</span><textarea name="message" rows="4" /></label>
            </div>
            <button className="btn btn-lime" type="submit" disabled={state.busy}>{state.busy ? u.sending : u.apply}</button>
            <p className={`cform-note ${state.ok ? 'is-ok' : ''}`} role="status">{state.note}</p>
          </form>
        </div>
      </section>
    </>
  )
}

/* ═════════ تواصل معنا ═════════ */
export function Contact() {
  const c = useBlock('contact')
  const pg = useBlock('pages')
  const { tx, u } = useLang()
  useTitle(u.contact)
  const wa = String(c.whatsapp || '').replace(/\D/g, '')
  return (
    <>
      <PageHero title={tx(pg, 'contact_title')} eyebrow={u.contact} image={pg.contact_image_url} crumbs={[['', u.contact]]} />
      <section className="sec">
        <div className="wrap contact">
          <div className="contact-info" data-reveal>
            <div className="ci"><Icon name="pin" /><div><b>{u.address}</b><p>{tx(c, 'address')}</p></div></div>
            <div className="ci"><Icon name="phone" /><div><b>{u.phone}</b>{lines(c.phones).map((p) => <p key={p}><a href={`tel:${p.replace(/\s/g, '')}`} dir="ltr">{p}</a></p>)}</div></div>
            {c.email && <div className="ci"><Icon name="mail" /><div><b>{u.email}</b><p><a href={`mailto:${c.email}`}>{c.email}</a></p></div></div>}
            <div className="ci"><Icon name="clock" /><div><b>{u.hours}</b><p>{tx(c, 'hours')}</p></div></div>
            {wa && <a className="btn btn-wa" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={20} />{u.whatsapp}</a>}
          </div>
          <div data-reveal><ContactForm /></div>
        </div>
        {c.map_url && <div className="wrap"><iframe className="map" src={c.map_url} title="map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
      </section>
    </>
  )
}

export function NotFound() {
  const { u } = useLang()
  return (
    <section className="nf">
      <div className="wrap center"><b>404</b><h1 className="h2">{u.notFound}</h1><Link to="/" className="btn btn-lime">{u.backHome}</Link></div>
    </section>
  )
}
