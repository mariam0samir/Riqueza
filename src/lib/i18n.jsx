import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const UI = {
  ar: {
    home: 'الرئيسية', about: 'عن ركويزا', services: 'خدماتنا', clients: 'شركاء النجاح', insights: 'المعرفة', media: 'المركز الإعلامي', library: 'مكتبة ركويزا', libraryText: 'ملفات ودراسات وأدلة من إعداد فريق ركويزا — متاحة للتحميل مجانًا.', download: 'تحميل', view: 'عرض', search: 'ابحث في الملفات…', noFiles: 'لا توجد ملفات في هذا القسم حاليًا.', libCats: { profile: 'الملف التعريفي', studies: 'دراسات', guides: 'أدلة إرشادية', reports: 'تقارير وأبحاث', regulations: 'قوانين ولوائح', presentations: 'عروض تقديمية' }, discover: 'اكتشف', findService: 'ابحث عن الخدمة المناسبة', lookingFor: 'أبحث عن خدمة في', forMy: 'لشركتي', stage: 'وهي حاليًا', explore: 'اعرض الخدمة', latestUpdates: 'آخر الأخبار', seeAll: 'عرض الكل', learnMore: 'اعرف المزيد', meetTeam: 'تعرّف على الفريق', mission: 'رسالتنا', vision: 'رؤيتنا', trackRecord2: 'سابقة أعمالنا',
    invest: 'استثمر في مصر', careers: 'الوظائف', contact: 'تواصل معنا', consult: 'احجز استشارة', menu: 'القائمة', close: 'إغلاق',
    allServices: 'كل الخدمات', viewService: 'تفاصيل الخدمة', readMore: 'اقرأ المزيد', viewAll: 'عرض الكل', next: 'التالي', prev: 'السابق',
    scroll: 'مرّر للأسفل', ourNumbers: 'ركويزا بالأرقام', whatWeDo: 'ما نقدمه لعملائنا', featured: 'الخدمات الرئيسية', more: 'خدمات أخرى',
    licenses: 'التراخيص والقيود الرسمية', chairman: 'كلمة رئيس مجلس الإدارة', board: 'مجلس الإدارة', structure: 'الهيكل التنظيمي',
    values: 'قيمنا التي نلتزم بها', goals: 'أهداف الشركة', why: 'لماذا تختار ركويزا', trackRecord: 'سابقة الأعمال', trustedBy: 'شركات وثقت في ركويزا',
    latest: 'أحدث المقالات', definition: 'تعريف الخدمة', framework: 'الإطار التنظيمي', importance: 'الأهمية', ourServices: 'محاور الخدمة',
    useCases: 'متى تحتاج هذه الخدمة؟', method: 'منهجية العمل', outputs: 'مخرجات الخدمة', faq: 'أسئلة شائعة', otherServices: 'خدمات أخرى قد تهمك',
    name: 'الاسم', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', company: 'اسم الشركة', service: 'الخدمة المطلوبة', message: 'رسالتك', choose: 'اختر الخدمة',
    send: 'إرسال', sending: 'جارٍ الإرسال…', sent: 'تم إرسال طلبك بنجاح. سيتواصل معك أحد مستشارينا قريبًا.', failed: 'تعذر الإرسال الآن. جرّب مرة أخرى أو راسلنا على واتساب.',
    required: 'اكتب الاسم ورقم الهاتف لنتمكن من التواصل معك.', badPhone: 'اكتب رقم هاتف صحيح — أرقام فقط (من 8 إلى 15 رقم).', address: 'العنوان', hours: 'مواعيد العمل', followUs: 'تابعنا', whatsapp: 'راسلنا على واتساب',
    all: 'الكل', holding: 'الشركات القابضة', listed: 'شركات مقيدة بالبورصة', prior: 'سابقة الأعمال', emak: 'مجموعة إيماك للسياحة والاستثمار', international: 'عملاء دوليون وقطاعات متنوعة',
    searchClients: 'ابحث باسم الشركة…', gallery: 'معرض الصور', videos: 'مكتبة الفيديو', noJobs: 'لا توجد وظائف متاحة حاليًا، لكن يسعدنا استقبال سيرتك الذاتية.',
    applyTitle: 'انضم إلى فريق ركويزا', cvLink: 'رابط السيرة الذاتية (Google Drive / LinkedIn)', position: 'الوظيفة', apply: 'أرسل طلبك',
    rights: 'جميع الحقوق محفوظة', licensed: 'مرخّصة من الهيئة العامة للرقابة المالية — ترخيص رقم 521', backTop: 'لأعلى', lang: 'English',
    notFound: 'الصفحة غير موجودة', backHome: 'العودة للرئيسية', freeCall: 'مكالمة استكشافية مجانية', step: 'المرحلة', clientsCount: 'عميل',
  },
  en: {
    home: 'Home', about: 'About', services: 'Services', clients: 'Clients', insights: 'Insights', media: 'Media', library: 'Riqueza Library', libraryText: 'Files, studies and guides prepared by the Riqueza team — free to download.', download: 'Download', view: 'View', search: 'Search files…', noFiles: 'No files in this section yet.', libCats: { profile: 'Company profile', studies: 'Studies', guides: 'Guides', reports: 'Reports & research', regulations: 'Laws & regulations', presentations: 'Presentations' }, discover: 'Discover', findService: 'Find the right service', lookingFor: 'I am looking for a service in', forMy: 'for my', stage: 'which is currently', explore: 'View service', latestUpdates: 'Latest updates', seeAll: 'See all', learnMore: 'Learn more', meetTeam: 'Meet the team', mission: 'Mission', vision: 'Vision', trackRecord2: 'Our track record',
    invest: 'Invest in Egypt', careers: 'Careers', contact: 'Contact', consult: 'Book a consultation', menu: 'Menu', close: 'Close',
    allServices: 'All services', viewService: 'View service', readMore: 'Read more', viewAll: 'View all', next: 'Next', prev: 'Previous',
    scroll: 'Scroll', ourNumbers: 'Riqueza in numbers', whatWeDo: 'What we offer', featured: 'Core services', more: 'More services',
    licenses: 'Licenses & registrations', chairman: 'A word from the Chairperson', board: 'Board of Directors', structure: 'Organisational structure',
    values: 'Our core values', goals: 'Our goals', why: 'Why Riqueza', trackRecord: 'Track record', trustedBy: 'Companies that trust Riqueza',
    latest: 'Latest insights', definition: 'About the service', framework: 'Regulatory framework', importance: 'Why it matters', ourServices: 'What we deliver',
    useCases: 'When do you need it?', method: 'Our methodology', outputs: 'Deliverables', faq: 'FAQ', otherServices: 'You may also need',
    name: 'Name', email: 'Email', phone: 'Phone', company: 'Company', service: 'Service', message: 'Message', choose: 'Choose a service',
    send: 'Send', sending: 'Sending…', sent: 'Thank you. One of our advisors will contact you shortly.', failed: 'Could not send right now. Please try again or message us on WhatsApp.',
    required: 'Please add your name and phone number.', badPhone: 'Please enter a valid phone number — digits only (8 to 15).', address: 'Address', hours: 'Working hours', followUs: 'Follow us', whatsapp: 'Chat on WhatsApp',
    all: 'All', holding: 'Holding companies', listed: 'EGX-listed companies', prior: 'Prior work', emak: 'EMAK Tourism & Investment Group', international: 'International & diversified clients',
    searchClients: 'Search by company name…', gallery: 'Photo gallery', videos: 'Video library', noJobs: 'There are no open positions right now, but we welcome your CV.',
    applyTitle: 'Join the Riqueza team', cvLink: 'CV link (Google Drive / LinkedIn)', position: 'Position', apply: 'Submit application',
    rights: 'All rights reserved', licensed: 'Licensed by the Financial Regulatory Authority — licence no. 521', backTop: 'Top', lang: 'العربية',
    notFound: 'Page not found', backHome: 'Back to home', freeCall: 'Free discovery call', step: 'Step', clientsCount: 'clients',
  },
}

const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('rq-lang') || 'ar' } catch { return 'ar' }
  })
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem('rq-lang', lang) } catch { /* private mode */ }
  }, [lang])
  const value = useMemo(() => ({
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
    u: UI[lang],
    // اختيار الحقل حسب اللغة: tx(obj, 'title') → title_ar أو title_en (ولو فاضي يرجع للعربي)
    tx: (obj, field) => (obj?.[`${field}_${lang}`] || obj?.[`${field}_ar`] || ''),
  }), [lang])
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
