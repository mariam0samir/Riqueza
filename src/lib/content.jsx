import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { DEFAULT_DATA } from '../data/defaults'

const ContentCtx = createContext({ data: DEFAULT_DATA, ready: false })

const TABLES = ['services', 'board', 'clients', 'posts', 'gallery', 'videos', 'jobs', 'library']

// بيحمّل كل المحتوى من Supabase مرة واحدة. أي جدول فاضي أو فيه مشكلة → المحتوى الافتراضي.
async function loadAll() {
  if (!supabase) return DEFAULT_DATA
  const [blocksRes, ...tableRes] = await Promise.all([
    supabase.from('blocks').select('key,data'),
    ...TABLES.map((t) => supabase.from(t).select('*').eq('active', true).order('sort_order', { ascending: true })),
  ])
  const data = { ...DEFAULT_DATA, blocks: { ...DEFAULT_DATA.blocks } }
  if (!blocksRes.error) {
    for (const row of blocksRes.data || []) {
      // القيم الفاضية في لوحة التحكم ما بتمسحش الافتراضي
      const clean = Object.fromEntries(Object.entries(row.data || {}).filter(([, v]) => v !== '' && v !== null && v !== undefined))
      data.blocks[row.key] = { ...(DEFAULT_DATA.blocks[row.key] || {}), ...clean }
    }
  }
  TABLES.forEach((t, i) => {
    const r = tableRes[i]
    if (!r.error && r.data && r.data.length) data[t] = r.data
  })
  return data
}

export function ContentProvider({ children }) {
  const [state, setState] = useState({ data: DEFAULT_DATA, ready: !supabase })
  useEffect(() => {
    let alive = true
    loadAll()
      .then((data) => alive && setState({ data, ready: true }))
      .catch(() => alive && setState({ data: DEFAULT_DATA, ready: true }))
    return () => { alive = false }
  }, [])
  return <ContentCtx.Provider value={state}>{children}</ContentCtx.Provider>
}

export const useContent = () => useContext(ContentCtx).data
export const useBlock = (key) => useContext(ContentCtx).data.blocks[key] || {}
export const useReady = () => useContext(ContentCtx).ready

export async function sendMessage(payload) {
  if (!supabase) throw new Error('not-configured')
  const { error } = await supabase.from('messages').insert({ ...payload, is_read: false })
  if (error) throw error
}
