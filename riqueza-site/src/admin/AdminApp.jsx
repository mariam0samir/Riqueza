import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { BLOCKS } from '../data/defaults'
import './admin.css'

/* ═══════════ إعدادات الأقسام ═══════════ */
const BLOCK_INFO = {
  hero: ['الواجهة الرئيسية (فيديو + عناوين)', 'كل سطر = شريحة: العنوان | النص — ولو حطيتي فيديو لكل شريحة بنفس الترتيب، الفيديو بيتغير مع العنوان'],
  intro: ['عن ركويزا (الرئيسية)', ''],
  stats: ['الأرقام', 'كل سطر: الرقم | العلامة (+ أو فاضي) | الوصف'],
  chairman: ['كلمة رئيس مجلس الإدارة', 'سطر فاضي بين الفقرات'],
  values: ['قيمنا', 'كل سطر: العنوان | النص'],
  goals: ['أهدافنا', 'كل سطر = هدف'],
  why: ['لماذا ركويزا', 'كل سطر: العنوان | النص'],
  licenses: ['التراخيص والاعتمادات', 'كل سطر: الرقم | العنوان | النص'],
  structure: ['الهيكل التنظيمي', 'كل سطر: الإدارة | قسم ؛ قسم ؛ قسم'],
  approach: ['كيف نعمل', 'كل سطر: الخطوة | النص — والصور: رابط في كل سطر'],
  cta: ['شريط الدعوة للاستشارة', ''],
  popup: ['النافذة المنبثقة (البوب أب)', 'التأخير بالثواني قبل ظهورها'],
  invest: ['استثمر في مصر', 'كل سطر: العنوان | النص'],
  contact: ['بيانات التواصل', 'التليفونات: رقم في كل سطر — الواتساب بالصيغة الدولية بدون +'],
  social: ['السوشيال ميديا', 'سيب الخانة فاضية لو مش عايز الأيقونة تظهر'],
}

const LABELS = {
  video_url: 'فيديو الخلفية', poster_url: 'صورة قبل تحميل الفيديو', image_url: 'الصورة', image2_url: 'الصورة الثانية', photo_url: 'الصورة',
  slides: 'الشرائح', cta: 'زر الدعوة', eyebrow: 'العنوان الصغير', title: 'العنوان', text: 'النص', items: 'العناصر', name: 'الاسم', role: 'المنصب',
  quote: 'الاقتباس', statement: 'الجملة الكبيرة في الرئيسية', top: 'أعلى الهيكل', images: 'الصور (رابط في كل سطر)', videos: 'فيديو لكل شريحة (رابط في كل سطر — اختياري)', button: 'نص الزر', enabled: 'مفعّلة', delay: 'التأخير (ثواني)',
  lead: 'المقدمة', address: 'العنوان', phones: 'التليفونات', email: 'الإيميل', whatsapp: 'واتساب', hours: 'مواعيد العمل', map_url: 'رابط الخريطة (embed)',
  facebook: 'فيسبوك', linkedin: 'لينكدإن', instagram: 'إنستجرام', x: 'X (تويتر)', threads: 'ثريدز', youtube: 'يوتيوب',
}

// جداول المحتوى: [المفتاح، النوع، العنوان]
const T = (k, type, label, extra = {}) => ({ k, type, label, ...extra })
const BI = (k, type, label) => [T(k + '_ar', type, label + ' (عربي)'), T(k + '_en', type, label + ' (English)', { ltr: true })]
const TABLES = {
  services: {
    title: 'الخدمات', display: (r) => r.title_ar, image: 'image_url',
    fields: [
      T('slug', 'text', 'الرابط (بالإنجليزي بدون مسافات)', { ltr: true, required: true }), T('featured', 'check', 'خدمة رئيسية (تظهر في السلايدر والقائمة)'), T('image_url', 'image', 'صورة الخدمة'),
      ...BI('title', 'text', 'اسم الخدمة'), ...BI('short', 'textarea', 'وصف قصير'), ...BI('intro', 'textarea', 'مقدمة الصفحة'),
      ...BI('def_title', 'text', 'عنوان التعريف'), ...BI('def_lead', 'textarea', 'نص التعريف'),
      ...BI('def_cards', 'textarea', 'كروت التعريف — العنوان | النص'), ...BI('framework', 'textarea', 'الإطار — العنوان | بند ؛ بند ؛ بند'),
      ...BI('importance', 'textarea', 'الأهمية — العنوان | النص'), ...BI('pillars', 'textarea', 'المحاور — العنوان | بند ؛ بند'),
      ...BI('usecases', 'textarea', 'حالات الاستخدام — العنوان | النص'), ...BI('steps', 'textarea', 'مراحل العمل — العنوان | النص'),
      ...BI('outputs', 'textarea', 'المخرجات — سطر لكل مُخرج'), ...BI('why', 'textarea', 'لماذا ركويزا — العنوان | النص'),
      ...BI('faq', 'textarea', 'الأسئلة الشائعة — السؤال | الإجابة'),
    ],
  },
  board: { title: 'مجلس الإدارة', display: (r) => r.name_ar, image: 'photo_url', fields: [T('photo_url', 'image', 'الصورة'), ...BI('name', 'text', 'الاسم'), ...BI('role', 'text', 'المنصب'), ...BI('bio', 'textarea', 'نبذة')] },
  clients: {
    title: 'العملاء', display: (r) => r.name_ar, image: 'logo_url', filter: 'category',
    fields: [...BI('name', 'text', 'اسم الشركة'), T('category', 'select', 'التصنيف', { options: [['holding', 'شركات قابضة'], ['listed', 'شركات مقيدة'], ['prior', 'سابقة أعمال'], ['emak', 'مجموعة إيماك'], ['international', 'شركات أخرى ودولية']] }), T('logo_url', 'image', 'اللوجو (اختياري)')],
  },
  posts: {
    title: 'المقالات والأخبار', display: (r) => r.title_ar, image: 'image_url',
    fields: [T('slug', 'text', 'الرابط (بالإنجليزي)', { ltr: true, required: true }), T('published_at', 'date', 'تاريخ النشر'), T('image_url', 'image', 'الصورة'), ...BI('category', 'text', 'التصنيف'), ...BI('title', 'text', 'العنوان'), ...BI('excerpt', 'textarea', 'ملخص'), ...BI('body', 'long', 'المقال (سطر فاضي بين الفقرات)')],
  },
  gallery: { title: 'معرض الصور', display: (r) => r.title_ar || 'صورة', image: 'image_url', fields: [T('image_url', 'image', 'الصورة', { required: true }), ...BI('title', 'text', 'وصف')] },
  videos: { title: 'الفيديوهات', display: (r) => r.title_ar || r.video_url, image: 'thumb_url', fields: [T('video_url', 'video', 'الفيديو (يوتيوب أو رفع ملف)', { required: true }), T('thumb_url', 'image', 'صورة مصغرة'), ...BI('title', 'text', 'العنوان')] },
  jobs: { title: 'الوظائف', display: (r) => r.title_ar, fields: [...BI('title', 'text', 'المسمى الوظيفي'), ...BI('location', 'text', 'المكان'), ...BI('type', 'text', 'نوع الدوام'), ...BI('description', 'textarea', 'الوصف')] },
}
const SOURCES = { contact: 'تواصل', consult: 'طلب استشارة', popup: 'البوب أب', service: 'من صفحة خدمة', careers: 'توظيف' }

/* ═══════════ أدوات ═══════════ */
async function upload(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `${new Date().toISOString().slice(0, 7)}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}
function useToast() {
  const [t, setT] = useState(null)
  useEffect(() => { if (!t) return; const id = setTimeout(() => setT(null), 3200); return () => clearTimeout(id) }, [t])
  return [t && <div className={`ad-toast ${t.bad ? 'bad' : ''}`}>{t.msg}</div>, (msg, bad) => setT({ msg, bad })]
}
const typeOf = (k, v) => k.endsWith('video_url') ? 'video' : (k.endsWith('_url') && k !== 'map_url') ? 'image' : typeof v === 'boolean' ? 'check' : typeof v === 'number' ? 'number' : (String(v).includes('\n') || String(v).length > 90 || k.startsWith('items') || k === 'images' || k === 'videos' || k === 'phones') ? 'textarea' : 'text'

function Field({ f, value, onChange, toast }) {
  const [busy, setBusy] = useState(false)
  const pick = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setBusy(true)
    try { onChange(await upload(file)); toast('تم رفع الملف ✓') } catch (err) { toast('فشل الرفع: ' + err.message, true) } finally { setBusy(false); e.target.value = '' }
  }
  const dir = f.ltr ? 'ltr' : undefined
  const wide = ['textarea', 'long'].includes(f.type)
  return (
    <label className={`ad-field ${wide ? 'wide' : ''} ${/_(ar|en)$/.test(f.k || '') ? '' : 'full'} ${f.type === 'check' ? 'is-check' : ''}`}>
      {f.type === 'check'
        ? <><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /><span>{f.label}</span></>
        : <span>{f.label}{f.required && ' *'}</span>}
      {f.type === 'text' && <input dir={dir} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}
      {f.type === 'number' && <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />}
      {f.type === 'date' && <input type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}
      {f.type === 'textarea' && <textarea dir={dir} rows={Math.min(16, Math.max(4, String(value ?? '').split('\n').length + Math.ceil(String(value ?? '').length / 75)))} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}
      {f.type === 'long' && <textarea dir={dir} rows={14} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}
      {f.type === 'select' && <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>}
      {(f.type === 'image' || f.type === 'video') && (
        <div className="ad-media">
          {value && (f.type === 'image' ? <img src={value} alt="" /> : /\.(mp4|webm|mov)(\?|$)/i.test(value) ? <video src={value} muted /> : null)}
          <input dir="ltr" placeholder="https://… أو ارفع ملف" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
          <span className={`ad-btn ghost sm ${busy ? 'busy' : ''}`}>{busy ? 'جاري الرفع…' : 'رفع ملف'}<input type="file" accept={f.type === 'image' ? 'image/*' : 'video/*'} onChange={pick} disabled={busy} /></span>
        </div>
      )}
    </label>
  )
}

/* ═══════════ تسجيل الدخول ═══════════ */
function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const go = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    if (error) setErr('الإيميل أو كلمة السر غلط'); setBusy(false)
  }
  return (
    <div className="ad-login">
      <form onSubmit={go} className="ad-box">
        <img src="/logo.svg" alt="Riqueza" />
        <h1>لوحة التحكم</h1>
        <label className="ad-field"><span>الإيميل</span><input dir="ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
        <label className="ad-field"><span>كلمة السر</span><input dir="ltr" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></label>
        {err && <p className="ad-err">{err}</p>}
        <button className="ad-btn" disabled={busy}>{busy ? '…' : 'دخول'}</button>
        <Link to="/" className="ad-back">← الرجوع للموقع</Link>
      </form>
    </div>
  )
}

/* ═══════════ محرر الأقسام ═══════════ */
function BlockEditor({ k, toast }) {
  const defaults = BLOCKS[k] || {}
  const [data, setData] = useState(null); const [saving, setSaving] = useState(false)
  useEffect(() => {
    setData(null)
    supabase.from('blocks').select('data').eq('key', k).maybeSingle().then(({ data: row }) => setData({ ...defaults, ...(row?.data || {}) }))
  }, [k])
  const keys = Object.keys(defaults)
  const groups = useMemo(() => {
    const seen = new Set(); const out = []
    keys.forEach((key) => {
      const base = key.replace(/_(ar|en)$/, '')
      if (seen.has(base)) return; seen.add(base)
      out.push(key.match(/_(ar|en)$/) ? [base + '_ar', base + '_en'] : [key])
    })
    return out
  }, [k])
  if (!data) return <div className="ad-loading" />
  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('blocks').upsert({ key: k, data, updated_at: new Date().toISOString() })
    setSaving(false); toast(error ? 'حصل خطأ: ' + error.message : 'تم الحفظ ✓ — هيظهر في الموقع بعد تحديث الصفحة', Boolean(error))
  }
  const [title, hint] = BLOCK_INFO[k] || [k, '']
  return (
    <section className="ad-panel">
      <header className="ad-head">
        <div><h2>{title}</h2>{hint && <p>{hint}</p>}</div>
        <div className="ad-head-actions">
          <button className="ad-btn ghost" onClick={() => confirm('ترجع للمحتوى الأصلي؟') && setData({ ...defaults })}>استرجاع الأصلي</button>
          <button className="ad-btn" onClick={save} disabled={saving}>{saving ? 'جاري الحفظ…' : 'حفظ'}</button>
        </div>
      </header>
      <div className="ad-form">
        {groups.map((g) => {
          const base = g[0].replace(/_(ar|en)$/, '')
          const label = LABELS[base] || base
          return g.map((key, i) => (
            <Field key={key} toast={toast} value={data[key]} onChange={(v) => setData((d) => ({ ...d, [key]: v }))}
              f={{ k: key, type: typeOf(key, defaults[key]), label: g.length > 1 ? `${label} (${i ? 'English' : 'عربي'})` : label, ltr: key.endsWith('_en') || /url|email|whatsapp|facebook|linkedin|instagram|^x$|threads|youtube|images|videos|phones/.test(key) }} />
          ))
        })}
      </div>
    </section>
  )
}

/* ═══════════ مدير الجداول ═══════════ */
function TableManager({ name, toast }) {
  const cfg = TABLES[name]
  const [rows, setRows] = useState(null); const [edit, setEdit] = useState(null); const [q, setQ] = useState(''); const [cat, setCat] = useState('')
  const load = () => supabase.from(name).select('*').order('sort_order').order('created_at').then(({ data, error }) => { if (error) toast(error.message, true); setRows(data || []) })
  useEffect(() => { setRows(null); setEdit(null); setQ(''); setCat(''); load() }, [name])

  const blank = () => Object.fromEntries([...cfg.fields.map((f) => [f.k, f.type === 'check' ? false : f.type === 'select' ? f.options[0][0] : '']), ['active', true], ['sort_order', (rows?.length || 0) + 1]])
  const save = async () => {
    const miss = cfg.fields.find((f) => f.required && !edit[f.k]) || (cfg.fields.find((f) => f.k.endsWith('_ar') && f.k.match(/^(title|name)_ar$/) && !edit[f.k]))
    if (miss) return toast('لازم تملا: ' + miss.label, true)
    const payload = { ...edit }; delete payload.created_at
    if (payload.published_at === '') payload.published_at = null
    const res = payload.id ? await supabase.from(name).update(payload).eq('id', payload.id) : await supabase.from(name).insert(payload)
    if (res.error) return toast('خطأ: ' + res.error.message, true)
    toast('تم الحفظ ✓'); setEdit(null); load()
  }
  const remove = async (r) => {
    if (!confirm(`حذف "${cfg.display(r) || ''}" نهائيًا؟`)) return
    const { error } = await supabase.from(name).delete().eq('id', r.id)
    toast(error ? error.message : 'تم الحذف', Boolean(error)); load()
  }
  const patch = async (r, p) => { const { error } = await supabase.from(name).update(p).eq('id', r.id); if (error) toast(error.message, true); load() }
  const move = async (i, d) => {
    const list = [...view]; const a = list[i], b = list[i + d]; if (!b) return
    await Promise.all([supabase.from(name).update({ sort_order: b.sort_order }).eq('id', a.id), supabase.from(name).update({ sort_order: a.sort_order === b.sort_order ? a.sort_order + d : a.sort_order }).eq('id', b.id)])
    load()
  }

  const view = (rows || []).filter((r) => (!cat || r[cfg.filter] === cat) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase())))

  if (edit) {
    return (
      <section className="ad-panel">
        <header className="ad-head">
          <div><button className="ad-link" onClick={() => setEdit(null)}>→ {cfg.title}</button><h2>{edit.id ? 'تعديل' : 'إضافة جديد'}</h2></div>
          <div className="ad-head-actions"><button className="ad-btn ghost" onClick={() => setEdit(null)}>إلغاء</button><button className="ad-btn" onClick={save}>حفظ</button></div>
        </header>
        <div className="ad-form">
          {cfg.fields.map((f) => <Field key={f.k} f={f} toast={toast} value={edit[f.k]} onChange={(v) => setEdit((e) => ({ ...e, [f.k]: v }))} />)}
          <Field f={{ k: 'sort_order', type: 'number', label: 'الترتيب' }} value={edit.sort_order} onChange={(v) => setEdit((e) => ({ ...e, sort_order: v }))} toast={toast} />
          <Field f={{ k: 'active', type: 'check', label: 'ظاهر في الموقع' }} value={edit.active} onChange={(v) => setEdit((e) => ({ ...e, active: v }))} toast={toast} />
        </div>
        <div className="ad-sticky-save"><button className="ad-btn" onClick={save}>حفظ</button></div>
      </section>
    )
  }

  return (
    <section className="ad-panel">
      <header className="ad-head">
        <div><h2>{cfg.title}</h2><p>{rows ? `${rows.length} عنصر` : '…'} — اسحب الترتيب بالأسهم، والعين تخفي/تظهر.</p></div>
        <div className="ad-head-actions"><button className="ad-btn" onClick={() => setEdit(blank())}>+ إضافة</button></div>
      </header>
      <div className="ad-tools">
        <input placeholder="بحث…" value={q} onChange={(e) => setQ(e.target.value)} />
        {cfg.filter && <select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">كل التصنيفات</option>{cfg.fields.find((f) => f.k === cfg.filter).options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>}
      </div>
      {!rows ? <div className="ad-loading" /> : !view.length ? <p className="ad-empty">لا يوجد عناصر — الموقع بيعرض المحتوى الافتراضي لحد ما تضيف.</p> : (
        <ul className="ad-list">
          {view.map((r, i) => (
            <li key={r.id} className={r.active ? '' : 'off'}>
              {cfg.image && <span className="ad-thumb">{r[cfg.image] ? <img src={r[cfg.image]} alt="" /> : (cfg.display(r) || '?')[0]}</span>}
              <div className="ad-li-text"><b>{cfg.display(r)}</b>{r.featured && <em>رئيسية</em>}{cfg.filter && <small>{cfg.fields.find((f) => f.k === cfg.filter).options.find(([v]) => v === r[cfg.filter])?.[1]}</small>}</div>
              <div className="ad-li-act">
                {!q && !cat && <><button title="لأعلى" onClick={() => move(i, -1)} disabled={!i}>↑</button><button title="لأسفل" onClick={() => move(i, 1)} disabled={i === view.length - 1}>↓</button></>}
                <button title={r.active ? 'إخفاء' : 'إظهار'} onClick={() => patch(r, { active: !r.active })}>{r.active ? '👁' : '🚫'}</button>
                <button onClick={() => setEdit({ ...r })}>تعديل</button>
                <button className="del" onClick={() => remove(r)}>حذف</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ═══════════ الرسائل ═══════════ */
function Inbox({ toast, onCount }) {
  const [rows, setRows] = useState(null); const [src, setSrc] = useState(''); const [open, setOpen] = useState(null)
  const load = () => supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(500).then(({ data }) => { setRows(data || []); onCount((data || []).filter((m) => !m.is_read).length) })
  useEffect(() => { load() }, [])
  const read = async (m) => { setOpen(open === m.id ? null : m.id); if (!m.is_read) { await supabase.from('messages').update({ is_read: true }).eq('id', m.id); load() } }
  const del = async (m) => { if (!confirm('حذف الرسالة؟')) return; await supabase.from('messages').delete().eq('id', m.id); toast('تم الحذف'); load() }
  const kind = (m) => String(m.source || 'contact').split(':')[0]
  const view = (rows || []).filter((m) => !src || kind(m) === src)
  const csv = () => {
    const cols = ['created_at', 'source', 'name', 'email', 'phone', 'company', 'subject', 'body', 'link']
    const body = [cols.join(','), ...view.map((m) => cols.map((c) => `"${String(m[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv' })); a.download = 'riqueza-messages.csv'; a.click()
  }
  return (
    <section className="ad-panel">
      <header className="ad-head">
        <div><h2>الرسائل والطلبات</h2><p>كل اللي بيتبعت من فورم التواصل، الاستشارة، البوب أب والتوظيف.</p></div>
        <div className="ad-head-actions"><button className="ad-btn ghost" onClick={csv}>تصدير Excel (CSV)</button></div>
      </header>
      <div className="ad-tools ad-chips">
        <button className={!src ? 'on' : ''} onClick={() => setSrc('')}>الكل ({rows?.length || 0})</button>
        {Object.entries(SOURCES).map(([k, l]) => <button key={k} className={src === k ? 'on' : ''} onClick={() => setSrc(k)}>{l} ({(rows || []).filter((m) => kind(m) === k).length})</button>)}
      </div>
      {!rows ? <div className="ad-loading" /> : !view.length ? <p className="ad-empty">لا توجد رسائل.</p> : (
        <ul className="ad-msgs">
          {view.map((m) => (
            <li key={m.id} className={`${m.is_read ? '' : 'new'} ${open === m.id ? 'open' : ''}`}>
              <button className="ad-msg-head" onClick={() => read(m)}>
                <i />
                <b>{m.name}</b><span className="tag">{SOURCES[kind(m)] || m.source}{m.source?.includes(':') ? ' · ' + m.source.split(':')[1] : ''}</span>
                <span className="sub">{m.subject || m.body?.slice(0, 70)}</span>
                <time>{new Date(m.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</time>
              </button>
              {open === m.id && (
                <div className="ad-msg-body">
                  <dl>
                    {m.phone && <><dt>تليفون</dt><dd><bdi dir="ltr"><a href={`tel:${m.phone}`}>{m.phone}</a> · <a href={`https://wa.me/${m.phone.replace(/\D/g, '').replace(/^0/, '20')}`} target="_blank" rel="noreferrer">واتساب</a></bdi></dd></>}
                    {m.email && <><dt>إيميل</dt><dd><bdi dir="ltr"><a href={`mailto:${m.email}`}>{m.email}</a></bdi></dd></>}
                    {m.company && <><dt>الشركة</dt><dd>{m.company}</dd></>}
                    {m.subject && <><dt>الموضوع</dt><dd>{m.subject}</dd></>}
                    {m.link && <><dt>رابط</dt><dd><bdi dir="ltr"><a href={m.link} target="_blank" rel="noreferrer">{m.link}</a></bdi></dd></>}
                  </dl>
                  {m.body && <p>{m.body}</p>}
                  <button className="ad-btn ghost sm del" onClick={() => del(m)}>حذف</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ═══════════ الرئيسية ═══════════ */
function Dashboard({ unread }) {
  const [counts, setCounts] = useState({})
  useEffect(() => {
    Object.keys(TABLES).forEach((t) => supabase.from(t).select('id', { count: 'exact', head: true }).then(({ count }) => setCounts((c) => ({ ...c, [t]: count ?? 0 }))))
  }, [])
  return (
    <section className="ad-panel">
      <header className="ad-head"><div><h2>أهلاً بيك 👋</h2><p>من هنا بتتحكم في كل محتوى موقع ركويزا بالعربي والإنجليزي.</p></div></header>
      <div className="ad-cards">
        <Link to="/admin/messages" className="ad-card hot"><b>{unread}</b><span>رسالة جديدة</span></Link>
        {Object.entries(TABLES).map(([k, c]) => <Link key={k} to={`/admin/t/${k}`} className="ad-card"><b>{counts[k] ?? '…'}</b><span>{c.title}</span></Link>)}
      </div>
      <h3 className="ad-sub">أقسام الموقع</h3>
      <div className="ad-blocks">{Object.entries(BLOCK_INFO).map(([k, [t]]) => <Link key={k} to={`/admin/b/${k}`}>{t}<i>←</i></Link>)}</div>
    </section>
  )
}

/* ═══════════ الإطار ═══════════ */
export default function AdminApp() {
  const [session, setSession] = useState(undefined); const [isAdmin, setIsAdmin] = useState(null); const [unread, setUnread] = useState(0); const [side, setSide] = useState(false)
  const [toastEl, toast] = useToast()
  useEffect(() => {
    document.documentElement.dir = 'rtl'; document.documentElement.lang = 'ar'; document.title = 'لوحة التحكم — Riqueza'
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!session) { setIsAdmin(null); return }
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(Boolean(data)))
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false).then(({ count }) => setUnread(count || 0))
  }, [session])

  if (!supabase) return (
    <div className="ad-login"><div className="ad-box"><img src="/logo.svg" alt="" /><h1>لوحة التحكم مش متوصلة</h1><p className="ad-note">لازم تضيف <code>VITE_SUPABASE_URL</code> و <code>VITE_SUPABASE_ANON_KEY</code> في ملف <code>.env</code> أو في إعدادات Vercel (Environment Variables) وبعدين Redeploy. التفاصيل في README.</p><Link to="/" className="ad-back">← الرجوع للموقع</Link></div></div>
  )
  if (session === undefined) return <div className="ad-loading full" />
  if (!session) return <Login />
  if (isAdmin === null) return <div className="ad-loading full" />
  if (!isAdmin) return (
    <div className="ad-login"><div className="ad-box"><img src="/logo.svg" alt="" /><h1>الحساب ده مش أدمن</h1><p className="ad-note">{session.user.email}<br />شغّل أمر إضافة الأدمن في Supabase SQL Editor (موجود في آخر schema.sql) بالإيميل ده.</p><button type="button" className="ad-btn" onClick={() => supabase.auth.signOut()}>تسجيل خروج</button></div></div>
  )

  const nav = (to, label, extra) => <NavLink to={to} end onClick={() => setSide(false)}>{label}{extra}</NavLink>
  return (
    <div className={`ad ${side ? 'side-open' : ''}`}>
      <aside className="ad-side">
        <Link to="/admin" className="ad-logo"><img src="/logo-white.svg" alt="Riqueza" /><span>لوحة التحكم</span></Link>
        <nav>
          {nav('/admin', 'الرئيسية')}
          {nav('/admin/messages', 'الرسائل', unread ? <em>{unread}</em> : null)}
          <p>المحتوى</p>
          {Object.entries(TABLES).map(([k, c]) => <span key={k}>{nav(`/admin/t/${k}`, c.title)}</span>)}
          <p>أقسام الموقع</p>
          {Object.entries(BLOCK_INFO).map(([k, [t]]) => <span key={k}>{nav(`/admin/b/${k}`, t)}</span>)}
        </nav>
        <div className="ad-side-foot">
          <a href="/" target="_blank" rel="noreferrer">عرض الموقع ↗</a>
          <button onClick={() => supabase.auth.signOut()}>خروج</button>
          <small dir="ltr">{session.user.email}</small>
        </div>
      </aside>
      <button className="ad-burger" onClick={() => setSide(!side)} aria-label="menu">☰</button>
      <main className="ad-main">
        <Routes>
          <Route index element={<Dashboard unread={unread} />} />
          <Route path="messages" element={<Inbox toast={toast} onCount={setUnread} />} />
          <Route path="t/:name" element={<TableRoute toast={toast} />} />
          <Route path="b/:key" element={<BlockRoute toast={toast} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
      {toastEl}
    </div>
  )
}

function TableRoute({ toast }) { const { name } = useParams(); return TABLES[name] ? <TableManager name={name} toast={toast} /> : <Navigate to="/admin" replace /> }
function BlockRoute({ toast }) { const { key } = useParams(); return BLOCKS[key] ? <BlockEditor k={key} toast={toast} /> : <Navigate to="/admin" replace /> }
