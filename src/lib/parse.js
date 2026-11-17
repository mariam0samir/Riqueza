// القوائم في لوحة التحكم مكتوبة كنص: كل سطر عنصر
export const lines = (s) => String(s || '').split('\n').map((l) => l.trim()).filter(Boolean)

// "عنوان | نص" أو "قيمة | لاحقة | عنوان" ...
export const rows = (s) => lines(s).map((l) => l.split('|').map((x) => x.trim()))

// "عنوان | وصف"
export const pairs = (s) => rows(s).map(([title, text = '']) => ({ title, text }))

// "عنوان | بند ؛ بند ؛ بند"
export const cards = (s) => rows(s).map(([title, rest = '']) => ({
  title,
  items: rest.split(/[;؛]/).map((x) => x.trim()).filter(Boolean),
}))

export const paragraphs = (s) => String(s || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

export const pad2 = (n) => String(n).padStart(2, '0')
