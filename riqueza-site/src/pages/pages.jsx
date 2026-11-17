import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useBlock, useContent, useReady, sendMessage } from '../lib/content'
import { lines, pairs, cards, rows, paragraphs, pad2 } from '../lib/parse'
import { Icon, PageHero, SectionHead, Accordion, ContactForm, Slider, useConsult, WhatsAppIcon } from '../components/ui'
import { Stats, Licenses, Chairman, Why, CtaBand, InsightsSlider } from '../home/Home'

function useHashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    return () => clearTimeout(id)
  }, [hash])
}

const useTitle = (t) => useEffect(() => { if (t) document.title = `${t} | Riqueza` }, [t])

/* ═════════ عن ركويزا ═════════ */
export function About() {
  const { tx, u } = useLang()
  const intro = useBlock('intro')
  const values = useBlock('values')
  const goals = useBlock('goals')
  const st = useBlock('structure')
  const { board } = useContent()
  useHashScroll(); useTitle(u.about)
  const [lead, ...rest] = board
  return (
    <>
      <PageHero title={tx(intro, 'title')} eyebrow={u.about} image="/media/city.webp" crumbs={[['', u.about]]} />
      <section className="sec">
        <div className="wrap about-grid">
          <div data-reveal>
            <p className="eyebrow">{tx(intro, 'eyebrow')}</p>
            {paragraphs(tx(intro, 'text')).map((p, k) => <p key={k} className="body big">{p}</p>)}
          </div>
          <div className="about-img" data-reveal><img src={intro.image2_url} alt="" /></div>
        </div>
      </section>
      <Stats />
      <div id="chairman"><Chairman full /></div>

      <section className="sec soft">
        <div className="wrap">
          <SectionHead eyebrow={u.values} title={tx({ t_ar: 'قيم تحكم كل ما نقوم به', t_en: 'Values behind everything we do' }, 't')} />
          <div className="values-grid">
            {pairs(tx(values, 'items')).map((v, k) => (
              <article key={k} className="value" data-reveal style={{ transitionDelay: `${k * 80}ms` }}>
                <span>{pad2(k + 1)}</span><h3>{v.title}</h3><p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap goals-grid">
          <SectionHead eyebrow={u.goals} title={tx({ t_ar: 'ما نسعى إليه', t_en: 'What we strive for' }, 't')} />
          <ol className="goals">
            {lines(tx(goals, 'items')).map((g, k) => <li key={k} data-reveal><span>{pad2(k + 1)}</span><p>{g}</p></li>)}
          </ol>
        </div>
      </section>

      <Licenses />

      <section className="sec soft" id="board">
        <div className="wrap">
          <SectionHead eyebrow={u.board} title={tx({ t_ar: 'قيادة متمرّسة', t_en: 'Seasoned leadership' }, 't')} />
          <div className="board">
            {lead && (
              <article className="board-lead" data-reveal>
                <div className="board-photo">{lead.photo_url ? <img src={lead.photo_url} alt={tx(lead, 'name')} /> : <span>{tx(lead, 'name').charAt(0)}</span>}</div>
                <div><h3>{tx(lead, 'name')}</h3><p>{tx(lead, 'role')}</p>{tx(lead, 'bio') && <p className="board-bio">{tx(lead, 'bio')}</p>}</div>
              </article>
            )}
            <div className="board-grid">
              {rest.map((m, k) => (
                <article key={m.id || k} className="board-card" data-reveal style={{ transitionDelay: `${k * 70}ms` }}>
                  <div className="board-photo">{m.photo_url ? <img src={m.photo_url} alt={tx(m, 'name')} loading="lazy" /> : <span>{tx(m, 'name').charAt(0)}</span>}</div>
                  <h3>{tx(m, 'name')}</h3><p>{tx(m, 'role')}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="structure">
        <div className="wrap">
          <SectionHead eyebrow={u.structure} title={tx({ t_ar: 'الهيكل التنظيمي للشركة', t_en: 'Organisational structure' }, 't')} center />
          <div className="org" data-reveal>
            <div className="org-top">{tx(st, 'top')}</div>
            <div className="org-cols">
              {cards(tx(st, 'items')).map((c, k) => (
                <div key={k} className="org-col"><h4>{c.title}</h4><ul>{c.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Why />
      <CtaBand />
    </>
  )
}

/* ═════════ الخدمات ═════════ */
export function Services() {
  const { services } = useContent()
  const { tx, u } = useLang()
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
      <PageHero title={u.whatWeDo} eyebrow={u.services} image="/media/market.webp" crumbs={[['', u.services]]}
        text={tx({ t_ar: 'خدمات متكاملة تغطي رحلة الشركة من التأسيس ودراسة الجدوى إلى التقييم والهيكلة والحوكمة والقيد في البورصة.', t_en: 'Integrated services covering the company journey—from incorporation and feasibility to valuation, restructuring, governance and listing.' }, 't')} />
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
  const { tx, u } = useLang()
  const { open } = useConsult()
  const s = services.find((x) => x.slug === slug)
  useTitle(s ? tx(s, 'title') : '')
  if (!s) return ready ? <NotFound /> : <div className="page-loading" />
  const T = (k) => tx(s, k)
  const others = services.filter((x) => x.featured && x.slug !== slug).slice(0, 6)
  const toc = [
    ['def', u.definition, T('def_lead') || T('def_cards')], ['frame', u.framework, T('framework')], ['imp', u.importance, T('importance')],
    ['pil', u.ourServices, T('pillars')], ['use', u.useCases, T('usecases')], ['steps', u.method, T('steps')], ['out', u.outputs, T('outputs')], ['faq', u.faq, T('faq')],
  ].filter((x) => x[2])
  return (
    <>
      <PageHero title={T('title')} eyebrow={u.services} image={s.image_url} text={T('intro')} crumbs={[['/services', u.services], ['', T('title')]]} />
      {toc.length > 1 && (
        <nav className="toc" aria-label="sections">
          <div className="wrap toc-in">{toc.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
            <button type="button" className="btn btn-lime btn-sm" onClick={() => open(T('title'))}>{u.consult}</button></div>
        </nav>
      )}

      {(T('def_lead') || T('def_cards')) && (
        <section className="sec" id="def">
          <div className="wrap sd-def">
            <div data-reveal>
              <p className="eyebrow">{u.definition}</p>
              <h2 className="h2">{T('def_title') || T('title')}</h2>
              {T('def_lead') && <p className="body big">{T('def_lead')}</p>}
            </div>
            <div className="sd-cards">
              {T('def_cards') && (T('def_cards').includes('؛') || T('def_cards').includes(';')
                ? cards(T('def_cards')).map((c, k) => (
                  <article key={k} className="sd-card" data-reveal><h3>{c.title}</h3><ul className="ticks">{c.items.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul></article>))
                : pairs(T('def_cards')).map((c, k) => (
                  <article key={k} className="sd-card" data-reveal><h3>{c.title}</h3><p>{c.text}</p></article>)))}
            </div>
          </div>
        </section>
      )}
      {!T('def_lead') && !T('def_cards') && T('intro') && (
        <section className="sec"><div className="wrap narrow" data-reveal><p className="body big">{T('intro')}</p>
          <button type="button" className="btn btn-lime" onClick={() => open(T('title'))}>{u.consult}</button></div></section>
      )}

      {T('framework') && (
        <section className="sec soft" id="frame">
          <div className="wrap">
            <SectionHead eyebrow={u.framework} title={tx({ t_ar: 'نعمل وفق مرجعية واضحة', t_en: 'A clear frame of reference' }, 't')} />
            <div className="frame-grid">
              {cards(T('framework')).map((c, k) => (
                <article key={k} className="frame-card" data-reveal style={{ transitionDelay: `${k * 80}ms` }}>
                  <span className="frame-idx">{pad2(k + 1)}</span><h3>{c.title}</h3>
                  <ul className="ticks">{c.items.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {T('importance') && (
        <section className="sec soft" id="imp">
          <div className="wrap">
            <SectionHead eyebrow={u.importance} title={tx({ t_ar: 'لماذا تحتاج هذه الخدمة؟', t_en: 'Why it matters' }, 't')} />
            <div className="imp-grid">
              {pairs(T('importance')).map((c, k) => (
                <article key={k} className="imp" data-reveal style={{ transitionDelay: `${(k % 3) * 80}ms` }}><span>{pad2(k + 1)}</span><h3>{c.title}</h3><p>{c.text}</p></article>
              ))}
            </div>
          </div>
        </section>
      )}

      {T('pillars') && (
        <section className="sec" id="pil">
          <div className="wrap">
            <SectionHead eyebrow={u.ourServices} title={tx({ t_ar: `خدمات ركويزا في ${T('title')}`, t_en: `Riqueza ${T('title')} services` }, 't')} />
            <div className="pil-list">
              {cards(T('pillars')).map((c, k) => (
                <article key={k} className="pil" data-reveal>
                  <div className="pil-head"><span>{tx({ p_ar: 'المحور', p_en: 'Pillar' }, 'p')} {pad2(k + 1)}</span><h3>{c.title}</h3></div>
                  <ul>{c.items.map((x) => <li key={x}>{x}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {T('usecases') && (
        <section className="sec soft" id="use">
          <div className="wrap">
            <SectionHead eyebrow={u.useCases} title={u.useCases} />
            <div className="use-grid">
              {(T('usecases').match(/[;؛]/) ? cards(T('usecases')).map((c) => ({ title: c.title, text: c.items.join(' • ') })) : pairs(T('usecases'))).map((c, k) => (
                <article key={k} className="use" data-reveal style={{ transitionDelay: `${(k % 3) * 70}ms` }}><Icon name="check" size={20} /><div><h3>{c.title}</h3><p>{c.text}</p></div></article>
              ))}
            </div>
          </div>
        </section>
      )}

      {T('steps') && (
        <section className="sec" id="steps">
          <div className="wrap">
            <SectionHead eyebrow={u.method} title={tx({ t_ar: 'منهجية العمل في ركويزا', t_en: 'How Riqueza works' }, 't')} />
            <ol className="timeline">
              {pairs(T('steps')).map((c, k) => (
                <li key={k} data-reveal style={{ transitionDelay: `${k * 70}ms` }}><span className="tl-dot">{pad2(k + 1)}</span><h3>{c.title}</h3><p>{c.text}</p></li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(T('outputs') || T('why')) && (
        <section className="sec soft" id="out">
          <div className="wrap out-grid">
            {T('outputs') && (
              <div data-reveal>
                <p className="eyebrow">{u.outputs}</p>
                <h2 className="h2">{tx({ t_ar: 'ماذا تستلم في النهاية؟', t_en: 'What you receive' }, 't')}</h2>
                <ol className="outs">{lines(T('outputs')).map((x, k) => <li key={k}><span>{pad2(k + 1)}</span>{x}</li>)}</ol>
              </div>
            )}
            {T('why') && (
              <div className="out-why" data-reveal>
                <p className="eyebrow">{u.why}</p>
                {pairs(T('why')).map((c, k) => <div key={k} className="out-why-item"><Icon name="check" size={18} /><div><b>{c.title}</b><p>{c.text}</p></div></div>)}
              </div>
            )}
          </div>
        </section>
      )}

      {T('faq') && (
        <section className="sec" id="faq">
          <div className="wrap faq-grid">
            <SectionHead eyebrow={u.faq} title={tx({ t_ar: 'أسئلة يطرحها عملاؤنا', t_en: 'Questions our clients ask' }, 't')} />
            <div data-reveal><Accordion items={pairs(T('faq'))} /></div>
          </div>
        </section>
      )}

      <section className="sec sd-cta">
        <div className="wrap sd-cta-in" data-reveal>
          <div><h2 className="h2">{tx({ t_ar: `جاهز تبدأ في ${T('title')}؟`, t_en: `Ready to start with ${T('title')}?` }, 't')}</h2>
            <p className="lead">{tx({ t_ar: 'تواصل مع فريق ركويزا واحصل على استشارة مجانية لتقييم وضع شركتك.', t_en: 'Talk to the Riqueza team and get a free consultation.' }, 't')}</p></div>
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
  useTitle(u.clients)
  const cats = ['holding', 'listed', 'prior', 'emak', 'international'].filter((c) => clients.some((x) => x.category === c))
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => clients.filter((c) => (cat === 'all' || c.category === cat) && (!q || tx(c, 'name').toLowerCase().includes(q.toLowerCase()))), [clients, cat, q, tx])
  return (
    <>
      <PageHero title={u.trustedBy} eyebrow={u.trackRecord} image="/media/merge.webp" crumbs={[['', u.clients]]}
        text={tx({ t_ar: `${clients.length} شركة قابضة ومقيدة بالبورصة ومحلية ودولية — سابقة أعمال تمتد لأكثر من 15 عامًا.`, t_en: `${clients.length} holding, listed, local and international companies — a track record of more than 15 years.` }, 't')} />
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
  useTitle(u.insights)
  const [first, ...rest] = posts
  return (
    <>
      <PageHero title={u.latest} eyebrow={u.insights} image="/media/research.webp" crumbs={[['', u.insights]]} />
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
      <PageHero title={u.media} eyebrow={u.media} image="/media/people.webp" crumbs={[['', u.media]]} />
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
      <PageHero title={u.applyTitle} eyebrow={u.careers} image="/media/people.webp" crumbs={[['', u.careers]]} />
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
  const { tx, u } = useLang()
  useTitle(u.contact)
  const wa = String(c.whatsapp || '').replace(/\D/g, '')
  return (
    <>
      <PageHero title={tx({ t_ar: 'لنبدأ من حيث أنت', t_en: 'Let’s start where you are' }, 't')} eyebrow={u.contact} image="/media/city.webp" crumbs={[['', u.contact]]} />
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
