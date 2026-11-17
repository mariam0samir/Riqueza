-- ============================================================
--  RIQUEZA — قاعدة البيانات (Supabase)
--  شغّلي الملف ده كله مرة واحدة من SQL Editor
-- ============================================================

-- 1) الأدمن
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz default now());
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- 2) أقسام الموقع الثابتة (الهيرو، عن ركويزا، الأرقام، كلمة رئيس المجلس، ...) — كل قسم صف واحد
create table if not exists public.blocks (key text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz default now());

-- 3) الخدمات
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sort_order int not null default 0,
  featured boolean not null default false,
  image_url text,
  title_ar text,
  title_en text,
  short_ar text,
  short_en text,
  intro_ar text,
  intro_en text,
  def_title_ar text,
  def_title_en text,
  def_lead_ar text,
  def_lead_en text,
  def_cards_ar text,
  def_cards_en text,
  framework_ar text,
  framework_en text,
  importance_ar text,
  importance_en text,
  pillars_ar text,
  pillars_en text,
  usecases_ar text,
  usecases_en text,
  steps_ar text,
  steps_en text,
  outputs_ar text,
  outputs_en text,
  why_ar text,
  why_en text,
  faq_ar text,
  faq_en text,
  active boolean not null default true, created_at timestamptz default now()
);

-- 4) مجلس الإدارة
create table if not exists public.board (id uuid primary key default gen_random_uuid(), name_ar text not null, name_en text, role_ar text, role_en text, bio_ar text, bio_en text, photo_url text, sort_order int default 0, active boolean default true, created_at timestamptz default now());

-- 5) العملاء / سابقة الأعمال
create table if not exists public.clients (id uuid primary key default gen_random_uuid(), name_ar text not null, name_en text, category text not null default 'prior', logo_url text, sort_order int default 0, active boolean default true, created_at timestamptz default now());

-- 6) المقالات والأخبار
create table if not exists public.posts (id uuid primary key default gen_random_uuid(), slug text unique not null, category_ar text, category_en text, title_ar text not null, title_en text, excerpt_ar text, excerpt_en text, body_ar text, body_en text, image_url text, published_at date default current_date, sort_order int default 0, active boolean default true, created_at timestamptz default now());

-- 7) معرض الصور ومكتبة الفيديو
create table if not exists public.gallery (id uuid primary key default gen_random_uuid(), image_url text not null, title_ar text, title_en text, sort_order int default 0, active boolean default true, created_at timestamptz default now());
create table if not exists public.videos (id uuid primary key default gen_random_uuid(), video_url text not null, thumb_url text, title_ar text, title_en text, sort_order int default 0, active boolean default true, created_at timestamptz default now());

-- 8) الوظائف
create table if not exists public.jobs (id uuid primary key default gen_random_uuid(), title_ar text not null, title_en text, location_ar text, location_en text, type_ar text, type_en text, description_ar text, description_en text, sort_order int default 0, active boolean default true, created_at timestamptz default now());

-- 8b) مكتبة ركويزا (ملفات للتحميل: بروفايل، دراسات، أدلة، تقارير)
create table if not exists public.library (id uuid primary key default gen_random_uuid(), title_ar text not null, title_en text, description_ar text, description_en text, category text not null default 'profile', file_url text not null, cover_url text, pages int, published_at date default current_date, sort_order int default 0, active boolean default true, created_at timestamptz default now());

-- 9) رسائل التواصل وطلبات الاستشارة والتوظيف
create table if not exists public.messages (id uuid primary key default gen_random_uuid(), source text not null default 'contact', name text not null check (char_length(name) between 1 and 150), email text check (char_length(email) <= 200), phone text check (char_length(phone) <= 40), company text check (char_length(company) <= 200), subject text check (char_length(subject) <= 300), body text check (char_length(body) <= 5000), link text check (char_length(link) <= 500), is_read boolean not null default false, created_at timestamptz default now());

-- ============================================================
--  الصلاحيات: الزوار يقروا المحتوى الظاهر بس، والأدمن يعمل كل حاجة
-- ============================================================
alter table public.admin_users enable row level security;
drop policy if exists "admin reads admins" on public.admin_users;
create policy "admin reads admins" on public.admin_users for select using (public.is_admin());

alter table public.blocks enable row level security;
drop policy if exists "public read blocks" on public.blocks;
create policy "public read blocks" on public.blocks for select using (true);
drop policy if exists "admin write blocks" on public.blocks;
create policy "admin write blocks" on public.blocks for all using (public.is_admin()) with check (public.is_admin());

alter table public.services enable row level security;
drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (active or public.is_admin());
drop policy if exists "admin write services" on public.services;
create policy "admin write services" on public.services for all using (public.is_admin()) with check (public.is_admin());

alter table public.board enable row level security;
drop policy if exists "public read board" on public.board;
create policy "public read board" on public.board for select using (active or public.is_admin());
drop policy if exists "admin write board" on public.board;
create policy "admin write board" on public.board for all using (public.is_admin()) with check (public.is_admin());

alter table public.clients enable row level security;
drop policy if exists "public read clients" on public.clients;
create policy "public read clients" on public.clients for select using (active or public.is_admin());
drop policy if exists "admin write clients" on public.clients;
create policy "admin write clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());

alter table public.posts enable row level security;
drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts for select using (active or public.is_admin());
drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

alter table public.gallery enable row level security;
drop policy if exists "public read gallery" on public.gallery;
create policy "public read gallery" on public.gallery for select using (active or public.is_admin());
drop policy if exists "admin write gallery" on public.gallery;
create policy "admin write gallery" on public.gallery for all using (public.is_admin()) with check (public.is_admin());

alter table public.videos enable row level security;
drop policy if exists "public read videos" on public.videos;
create policy "public read videos" on public.videos for select using (active or public.is_admin());
drop policy if exists "admin write videos" on public.videos;
create policy "admin write videos" on public.videos for all using (public.is_admin()) with check (public.is_admin());

alter table public.jobs enable row level security;
drop policy if exists "public read jobs" on public.jobs;
create policy "public read jobs" on public.jobs for select using (active or public.is_admin());
drop policy if exists "admin write jobs" on public.jobs;
create policy "admin write jobs" on public.jobs for all using (public.is_admin()) with check (public.is_admin());

alter table public.library enable row level security;
drop policy if exists "public read library" on public.library;
create policy "public read library" on public.library for select using (active or public.is_admin());
drop policy if exists "admin write library" on public.library;
create policy "admin write library" on public.library for all using (public.is_admin()) with check (public.is_admin());

alter table public.messages enable row level security;
drop policy if exists "anyone can send" on public.messages;
create policy "anyone can send" on public.messages for insert with check (is_read = false);
drop policy if exists "admin reads messages" on public.messages;
create policy "admin reads messages" on public.messages for select using (public.is_admin());
drop policy if exists "admin updates messages" on public.messages;
create policy "admin updates messages" on public.messages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin deletes messages" on public.messages;
create policy "admin deletes messages" on public.messages for delete using (public.is_admin());

-- ============================================================
--  مكان رفع الصور والفيديوهات
-- ============================================================
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- ============================================================
--  المحتوى الأولي (بيتحط مرة واحدة بس — لو الجدول فاضي)
-- ============================================================
insert into public.blocks (key, data) values ('hero', $q${"video_url":"","poster_url":"/media/hero-poster.jpg","videos":"","images":"/media/hero-poster.jpg\n/media/hero-2.jpg\n/media/hero-3.jpg","slides_ar":"نضيء لك الطريق | شريكك في القرار المالي منذ 2009 — مرخّصة من الهيئة العامة للرقابة المالية وراعٍ معتمد لدى البورصة المصرية.\nمن الفكرة إلى البورصة | نرافق شركتك من دراسة الجدوى والتقييم والهيكلة حتى القيد والطرح وبدء التداول.\nأرقام تصنع الثقة | تقارير قيمة عادلة وتقييمات معتمدة وفق IFRS 13 ومعايير التقييم الدولية.","slides_en":"Lighting your way | Your partner in financial decisions since 2009 — FRA-licensed and an approved EGX sponsor.\nFrom idea to the exchange | We guide your company from feasibility, valuation and restructuring to listing and first trade.\nNumbers that build trust | Certified fair value reports and valuations under IFRS 13 and international standards.","cta_ar":"احجز استشارة مجانية","cta_en":"Book a free consultation"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('intro', $q${"eyebrow_ar":"عن ركويزا","eyebrow_en":"About Riqueza","title_ar":"خبرة تمتد لأكثر من 18 عامًا في الأسواق المالية المصرية","title_en":"More than 18 years in Egypt’s financial markets","text_ar":"ركويزا للاستشارات المالية عن الأوراق المالية شركة رائدة ومتخصصة في تقديم الخدمات الاستشارية المالية، تعمل بموجب ترخيص رقم (521) بتاريخ 30/04/2009 من الهيئة العامة للرقابة المالية، ومقيدة بسجل المستشارين الماليين المستقلين تحت رقم (1732).\n\nنتعامل مع كافة الشركات التي ترغب في الاستشارات المالية بكافة أنواعها، ونعمل بصفة رئيسية مع الهيئة العامة للرقابة المالية والبورصة المصرية والهيئة العامة للاستثمار وشركة مصر للمقاصة والإيداع والقيد المركزي.","text_en":"Riqueza for Financial Consultancy on Securities is a specialised advisory firm operating under FRA licence no. 521 (30/04/2009) and registered as an independent financial advisor under no. 1732.\n\nWe work with companies of every kind, and deal mainly with the Financial Regulatory Authority, the Egyptian Exchange, the General Authority for Investment and Misr for Central Clearing, Depository & Registry.","image_url":"/media/city.webp","image2_url":"/media/people.webp","mission_ar":"تقديم استشارات مالية مستقلة ودقيقة تساعد الشركات المصرية على اتخاذ قرارات واثقة، والنمو، والوصول إلى سوق المال بثبات.","mission_en":"To deliver independent, accurate financial advice that helps Egyptian companies make confident decisions, grow, and reach the capital market with confidence.","vision_ar":"أن تكون ركويزا الخيار الأول للاستشارات المالية في مصر، وشريكًا دائمًا في نجاح عملائها.","vision_en":"To be the first choice for financial advisory in Egypt, and a lasting partner in our clients’ success.","statement_ar":"منذ 2009 نرافق الشركات المصرية من دراسة الجدوى والتقييم حتى القيد في البورصة، بخبرة تمنح كل قرار مالي وضوحًا وثقة.","statement_en":"Since 2009 we have guided Egyptian companies from feasibility and valuation all the way to the stock exchange, bringing clarity and confidence to every financial decision."}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('stats', $q${"items_ar":"18 | + | سنة من الخبرة\n200 | + | شركة محلية ودولية\n750 | + | استشارة مالية\n192 | | عميل في سابقة أعمالنا","items_en":"18 | + | Years of experience\n200 | + | Local & international clients\n750 | + | Financial consultations\n192 | | Clients in our track record"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('chairman', $q${"name_ar":"أسماء محمد عبد الوهاب","name_en":"Asmaa Mohamed Abdelwahab","role_ar":"رئيس مجلس الإدارة","role_en":"Chairperson","photo_url":"/team/asmaa-abdelwahab.jpg","quote_ar":"نتطلع ليس إلى التوسع محليًا وإقليميًا فحسب، بل إلى العالمية بكل المستويات نظامًا وإدارة وانتشارًا.","quote_en":"We look beyond local and regional growth—to a global presence in systems, management and reach.","text_ar":"يسعدني أن أرحب بكم في شركتكم ركويزا للاستشارات المالية عن الأوراق المالية، وأن أشكركم عملاء وزملاء على الدعم والمساندة والمشاركة التي أوصلتنا إلى ما حققناه من نجاحات على مدار أكثر من 15 عامًا.\n\nنحن على يقين تام بأن العالم يشهد تغيرًا سريعًا في مختلف المجالات، ولتطوير حاضرنا لا بد من أن نضع رؤية واضحة لمستقبلنا قائمة على أسس صلبة تطبق أحدث النظم المالية والإدارية، متطلعين ليس إلى التوسع محليًا وإقليميًا فحسب، بل نتطلع إلى العالمية بكل المستويات نظامًا وإدارة وانتشارًا، واضعين نصب أعيننا القيم والمبادئ التي نشأنا عليها ونشأت أسرة ركويزا عليها.\n\nونعد عملاءنا من هذا المنطلق بتوظيف كافة إمكانياتنا، وتوفير فريق العمل المناسب للتنفيذ، واستثمار معرفتنا وخبراتنا وتجاربنا وعلاقاتنا، والتعامل بشفافية ومهنية واحترام؛ لنكون الاختيار الأول لعملائنا، ولنشكل معًا شراكات على أساس من الثقة المتبادلة والنزاهة وعلاقات وطيدة طويلة الأمد.","text_en":"It is my pleasure to welcome you to Riqueza for Financial Consultancy on Securities, and to thank our clients and colleagues for the support and partnership that brought us the successes of more than 15 years.\n\nThe world is changing fast in every field. To develop our present we need a clear vision for the future, built on solid foundations and the latest financial and administrative systems—looking not only to local and regional expansion, but to a global presence in systems, management and reach, while holding on to the values on which the Riqueza family was built.\n\nWe promise our clients to put all our capabilities to work, to provide the right team, and to invest our knowledge, experience and relationships with transparency, professionalism and respect—so that we remain our clients’ first choice and build partnerships founded on mutual trust, integrity and long-term relationships."}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('values', $q${"items_ar":"المصداقية | نقل الصورة بوضوح بعد فحص ودراسة ملف العميل بدقة لمساعدته على اتخاذ القرارات السليمة.\nجدية العمل | تنفيذ نطاق الأعمال المتفق عليها باهتمام ورعاية مع الالتزام بالمواعيد.\nالحرفية | اتباع المعايير والأساليب الفنية والمهنية وبذل عناية الرجل الحريص في تنفيذ كافة الأعمال.\nالخصوصية | الالتزام بسياسة الخصوصية فيما يتعلق بتعاملات عملائنا والخدمات التي نقدمها لهم والمستندات الخاصة بهم.","items_en":"Credibility | Presenting a clear picture after carefully studying each client’s file, to support sound decisions.\nDiligence | Delivering the agreed scope with care and on time.\nProfessionalism | Following technical and professional standards with the care of a prudent person.\nConfidentiality | Protecting our clients’ dealings, services and documents."}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('goals', $q${"items_ar":"أن نكون دائمًا الاختيار الأول في تقديم الاستشارات المالية للعملاء.\nأن نحقق نجاحات متتالية مع عملائنا ونصبح شريك نجاح فعّال بعلاقة قوية وطيدة الأمد.\nتقديم خدماتنا لكافة قطاعات الاستثمار المتنوعة.\nأن نضيء الطريق لأكبر قدر من العملاء حتى يتسنى لهم الانطلاق وتحقيق أهدافهم، ومن ثَمَّ ينمو الاقتصاد الوطني.\nزيادة وعي العملاء بأدوات سوق المال وكيفية تسخيرها لصالح استثماراتهم.\nزيادة عدد الشركات المقيدة بالبورصة لتوسيع هيكل الملكية وتوفير رأس المال المطلوب للتوسع وزيادة الإنتاج، ومن ثَمَّ زيادة فرص العمل وانخفاض الاستيراد وزيادة التصدير.","items_en":"To always be the first choice for financial advisory.\nTo achieve continuous success with our clients and be an effective, long-term partner.\nTo serve every investment sector.\nTo light the way for as many clients as possible to reach their goals—and grow the national economy.\nTo raise clients’ awareness of capital market tools and how to use them.\nTo increase the number of listed companies—broadening ownership, funding expansion and production, creating jobs, reducing imports and boosting exports."}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('why', $q${"items_ar":"خبرة عميقة | خبرة تمتد لأكثر من 15 سنة في السوق المصري.\nنخبة من المستشارين | مستشارون من ذوي الخبرات العالمية والعلمية والعملية.\nقيادة متمرّسة | مجلس إدارة من رجال وسيدات أعمال شغلوا وظائف مرموقة في القطاع الخاص ولديهم خبرة استشارية متميزة.\nقاعدة عملاء راسخة | قاعدة مختارة ومتميزة من العملاء تربطها بنا علاقات طويلة الأمد مبنية على المهنية والثقة المتبادلة.\nمرونة وأفق واسع | المرونة والأفق الواسع لمواكبة المتغيرات المحلية والدولية في إنجاز الأعمال والتواصل مع العملاء.","items_en":"Deep experience | More than 15 years in the Egyptian market.\nExpert advisors | Consultants with international, academic and practical experience.\nSeasoned leadership | A board of business leaders with senior private-sector and advisory backgrounds.\nTrusted clientele | Long-term relationships built on professionalism and mutual trust.\nAgility | The flexibility to keep pace with local and global change.","image_url":"/media/growth.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('licenses', $q${"items_ar":"521 | ترخيص مزاولة النشاط | ترخيص رقم (521) بتاريخ 30/04/2009 لمزاولة نشاط الاستشارات المالية عن الأوراق المالية من الهيئة العامة للرقابة المالية.\n1732 | سجل المستشارين الماليين المستقلين | قُيّدت الشركة بسجل المستشارين الماليين المستقلين بالهيئة العامة للرقابة المالية تحت رقم (1732) بتاريخ 31/08/2009.\nG50004 | مركز تحديث الصناعة | قُيّدت الشركة بمركز تحديث الصناعة في يوليو 2009 كمقدم خدمات بكود رقم G50004.\n26 | راعٍ رسمي معتمد بالبورصة | راعٍ رسمي معتمد بقرار مجلس إدارة البورصة المصرية بجلسته رقم (1) لسنة 2014، ومسجلة بسجل الرعاة المعتمدين للشركات الصغيرة والمتوسطة تحت رقم (26).","items_en":"521 | FRA licence | Licence no. 521 dated 30/04/2009 to practise financial consultancy on securities, issued by the Financial Regulatory Authority.\n1732 | Independent financial advisors | Registered with the FRA’s register of independent financial advisors under no. 1732 on 31/08/2009.\nG50004 | Industrial Modernisation Centre | Registered with the IMC as a service provider in July 2009, code G50004.\n26 | Official EGX sponsor | Approved by the EGX board (session 1 of 2014) and registered as an approved SME sponsor under no. 26."}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('structure', $q${"top_ar":"رئيس مجلس الإدارة","top_en":"Chairperson","items_ar":"العضو المنتدب للشؤون الفنية | إدارة الاستشارات ؛ إدارة القيد والرعاية ؛ إدارة هيكلة المشروعات\nلجنة المراجعة والحوكمة | إدارة الرقابة والمراجعة ؛ المراجع الداخلي ؛ المراقب الداخلي ؛ مكافحة غسل الأموال وتمويل الإرهاب\nالعضو المنتدب للشؤون الإدارية والمالية | الإدارة المالية ؛ الموارد البشرية ؛ العقود والشؤون القانونية ؛ التسويق وخدمة العملاء","items_en":"MD — Technical | Advisory ; Listing & sponsorship ; Project structuring\nAudit & Governance Committee | Control & audit ; Internal auditor ; Internal controller ; AML / CFT\nMD — Admin & Finance | Finance ; Human resources ; Contracts & legal ; Marketing & client service"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('approach', $q${"title_ar":"كيف نعمل معك","title_en":"How we work with you","items_ar":"نستمع | مكالمة استكشافية مجانية نفهم فيها وضع شركتك وأهدافك.\nنشخّص | دراسة دقيقة لملفك المالي والقانوني والتشغيلي وتحديد الفجوات.\nننفّذ | فريق متخصص ينفّذ الحل وفق المعايير الدولية ومتطلبات الجهات الرقابية.\nنرافقك | متابعة مستمرة حتى الاعتماد والتنفيذ وما بعده.","items_en":"Listen | A free discovery call to understand your company and goals.\nDiagnose | A careful review of your financial, legal and operational position.\nDeliver | A specialised team executes to international and regulatory standards.\nStay with you | Ongoing support through approval, execution and beyond.","images":"/media/people.webp\n/media/research.webp\n/media/documents.webp\n/media/growth.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('cta', $q${"title_ar":"جاهز تبدأ رحلة شركتك؟","title_en":"Ready to start your company’s journey?","text_ar":"احصل على استشارة مجانية لتقييم وضع شركتك وتحديد الخدمة الأنسب لها.","text_en":"Get a free consultation to assess your company and find the right service.","button_ar":"احجز استشارة مجانية","button_en":"Book a free consultation","image_url":"/media/city.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('popup', $q${"enabled":true,"delay":14,"title_ar":"استشارة مجانية مع خبير ركويزا","title_en":"A free consultation with a Riqueza expert","text_ar":"اترك بياناتك وسيتواصل معك أحد مستشارينا خلال يوم عمل لمناقشة احتياجات شركتك.","text_en":"Leave your details and one of our advisors will contact you within one business day.","image_url":"/media/bell.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('invest', $q${"title_ar":"استثمر في مصر","title_en":"Invest in Egypt","lead_ar":"تتمتع مصر بموقع استراتيجي يربط بين قارات العالم، وبشبكة من الاتفاقيات التجارية التي تفتح أمام المستثمرين أسواقًا واسعة.","lead_en":"Egypt sits at a strategic crossroads between continents, with trade agreements that open wide markets to investors.","items_ar":"موقع استراتيجي | ملتقى أفريقيا وآسيا وأوروبا، وتمر عبرها قناة السويس أحد أهم الممرات الملاحية في العالم.\nسوق كبير | سوق محلي واسع يتجاوز تعداده 100 مليون نسمة، وقاعدة شبابية من القوى العاملة.\nاتفاقيات تجارية | اتفاقيات تجارة حرة وتفضيلية تتيح الوصول إلى أسواق أفريقيا والدول العربية وأوروبا.\nسوق مال منظم | بورصة مصرية تضم سوقًا رئيسيًا وسوقًا للشركات الصغيرة والمتوسطة (النيلكس) تحت رقابة الهيئة العامة للرقابة المالية.\nبنية تحتية متطورة | مشروعات كبرى في الطرق والموانئ والطاقة والمدن الجديدة.\nكيف نساعدك | ندرس معك الفرصة الاستثمارية والجدوى والهيكل القانوني والمالي الأنسب لبدء استثمارك.","items_en":"Strategic location | Where Africa, Asia and Europe meet, home to the Suez Canal.\nLarge market | A domestic market of more than 100 million people and a young workforce.\nTrade agreements | Free and preferential trade access to African, Arab and European markets.\nRegulated capital market | The EGX main market and NILEX for SMEs, supervised by the FRA.\nModern infrastructure | Major projects in roads, ports, energy and new cities.\nHow we help | We study the opportunity, feasibility and the right legal and financial structure with you.","image_url":"/media/pyramids.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('contact', $q${"address_ar":"برج الياسمين، القطعة رقم 17 بلوك 86، الشطر الثالث عشر، زهراء المعادي، القاهرة","address_en":"Yasmin Tower, Plot 17, Block 86, Sector 13, Zahraa El-Maadi, Cairo, Egypt","phones":"02 2755 6602\n0101 121 6514\n0100 072 1718","email":"info@riqueza-eg.com","whatsapp":"201011216514","hours_ar":"متاحون على مدار 24 ساعة، 7 أيام في الأسبوع","hours_en":"Available 24/7","map_url":"https://www.google.com/maps?q=Zahraa+El+Maadi+Cairo&output=embed"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('social', $q${"facebook":"","linkedin":"","instagram":"","x":"","threads":"","youtube":""}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('home', $q${"sections":"hero\nintro\nimage\nshowcase\nupdates\nvalues\nclients\nfinder\nprofile\n-stats\n-howwework\n-chairman\n-cta","wide_image_url":"/media/city.webp","showcase_title_ar":"ما نقدمه لعملائنا","showcase_title_en":"What we do for our clients","finder_title_ar":"أخبرنا عن شركتك","finder_title_en":"Tell us about your company","finder_image_url":"/media/growth.webp","finder_stages_ar":"شركة ناشئة\nشركة قائمة تريد التوسع\nشركة تستعد للقيد\nشركة مقيدة بالبورصة","finder_stages_en":"a startup\nan established company planning to grow\na company preparing to list\na listed company","values_title_ar":"قيم نعمل بها كل يوم","values_title_en":"Values we live by every day","values_text_ar":"المصداقية والجدية والاحترافية ليست شعارات عندنا، بل طريقة عمل تظهر في كل تقرير وكل استشارة.","values_text_en":"Credibility, diligence and professionalism are how we work — in every report and every consultation.","values_bg_url":"/media/city.webp","values_images":"/media/handshake.webp\n/media/research.webp\n/media/people.webp\n/media/documents.webp\n/media/growth.webp","approach_intro_ar":"من أول مكالمة حتى التنفيذ الكامل — فريق واحد يرافقك في كل مرحلة.","approach_intro_en":"From the first call to full delivery — one team with you at every stage."}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('groups', $q${"items":"البورصة وسوق المال | Capital markets | egx-listing, capital-increase-reduction, research-reports\nالتقييم والدراسات | Valuation & studies | fair-value-reports, asset-valuation, feasibility-studies\nالهيكلة والحوكمة | Restructuring & governance | financial-administrative-restructuring, corporate-governance, mergers-acquisitions"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('about_page', $q${"hero_image_url":"/media/blocks.webp","checker_images":"/media/building.webp\n/media/people.webp\n/media/city.webp","mission_image_url":"/media/handshake.webp","vision_image_url":"/media/pyramids.webp","team_title_ar":"تعرّف على الفريق","team_title_en":"Meet the team","careers_title_ar":"اعمل مع ركويزا","careers_title_en":"Work at Riqueza","careers_text_ar":"انضم لفريق من المستشارين الماليين المعتمدين، وابنِ خبرتك في أكبر صفقات السوق المصري.","careers_text_en":"Join a team of licensed financial advisors and build your experience on major Egyptian market deals.","careers_image_url":"/media/research.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('service_page', $q${"license_label_ar":"الترخيص","license_label_en":"License","license_value_ar":"الهيئة العامة للرقابة المالية — 521","license_value_en":"FRA license no. 521","first_label_ar":"الاستشارة الأولى","first_label_en":"First consultation","first_value_ar":"مجانية","first_value_en":"Free","about_title_ar":"عن الخدمة","about_title_en":"About the service","tabs_title_ar":"ماذا نقدم لك؟","tabs_title_en":"What we deliver","importance_title_ar":"لماذا تحتاج هذه الخدمة؟","importance_title_en":"Why it matters","steps_title_ar":"خطوات العمل معنا","steps_title_en":"How we work with you","faq_title_ar":"أسئلة يطرحها عملاؤنا","faq_title_en":"Questions our clients ask","cta_title_ar":"جاهز تبدأ في {service}؟","cta_title_en":"Ready to start with {service}?","cta_text_ar":"تواصل مع فريق ركويزا واحصل على استشارة مجانية لتقييم وضع شركتك.","cta_text_en":"Talk to the Riqueza team and get a free consultation.","step_images":"/media/people.webp\n/media/research.webp\n/media/documents.webp\n/media/growth.webp\n/media/handshake.webp\n/media/merge.webp\n/media/blueprint.webp\n/media/market.webp","wide_images":"/media/city.webp\n/media/building.webp\n/media/blocks.webp\n/media/pillars.webp"}$q$::jsonb) on conflict (key) do nothing;
insert into public.blocks (key, data) values ('pages', $q${"services_image_url":"/media/market.webp","services_title_ar":"ما نقدمه لعملائنا","services_title_en":"What we do for our clients","services_text_ar":"خدمات متكاملة تغطي رحلة الشركة من التأسيس ودراسة الجدوى إلى التقييم والهيكلة والحوكمة والقيد في البورصة.","services_text_en":"Integrated services covering the company journey—from incorporation and feasibility to valuation, restructuring, governance and listing.","board_image_url":"/media/research.webp","board_title_ar":"قيادة متمرّسة تقود ركويزا","board_title_en":"Seasoned leadership behind Riqueza","clients_image_url":"/media/merge.webp","clients_text_ar":"شركات قابضة ومقيدة بالبورصة ومحلية ودولية — سابقة أعمال تمتد لأكثر من 15 عامًا.","clients_text_en":"Holding, listed, local and international companies — a track record of more than 15 years.","insights_image_url":"/media/research.webp","library_image_url":"/media/documents.webp","media_image_url":"/media/people.webp","careers_image_url":"/media/people.webp","contact_image_url":"/media/city.webp","contact_title_ar":"لنبدأ من حيث أنت","contact_title_en":"Let’s start where you are","form_title_ar":"تواصل معنا","form_title_en":"Get in touch"}$q$::jsonb) on conflict (key) do nothing;

insert into public.services (slug, sort_order, featured, image_url, title_ar, title_en, short_ar, short_en, intro_ar, intro_en, def_title_ar, def_title_en, def_lead_ar, def_lead_en, def_cards_ar, def_cards_en, framework_ar, framework_en, importance_ar, importance_en, pillars_ar, pillars_en, usecases_ar, usecases_en, steps_ar, steps_en, outputs_ar, outputs_en, why_ar, why_en, faq_ar, faq_en)
select * from (values
  ($q$fair-value-reports$q$, 1, true, $q$/media/balance.webp$q$, $q$إعداد تقارير القيمة العادلة$q$, $q$Fair Value Reports$q$, $q$تقارير قيمة عادلة وفق IFRS 13 ومتطلبات الهيئة العامة للرقابة المالية، جاهزة للمراجعة والاعتماد.$q$, $q$Fair value reports under IFRS 13 and FRA requirements, ready for review and approval.$q$, $q$تقدم ركويزا للاستشارات المالية عن الأوراق المالية خدمة إعداد تقارير القيمة العادلة (Fair Value Reports) وفقًا لأحكام المعايير الدولية للتقارير المالية IFRS 13 وبما يتوافق مع متطلبات الهيئة العامة للرقابة المالية في مصر.$q$, $q$Riqueza prepares Fair Value Reports in accordance with IFRS 13 and in line with the requirements of Egypt’s Financial Regulatory Authority (FRA).$q$, $q$ما هي تقارير القيمة العادلة وفقًا للمعايير؟$q$, $q$What is fair value under the standards?$q$, $q$وفقًا لمعيار IFRS 13، تُعرف القيمة العادلة بأنها: «السعر الذي يمكن الحصول عليه عند بيع أصل أو دفعه لنقل التزام في معاملة منظمة بين أطراف في السوق بتاريخ القياس».$q$, $q$Under IFRS 13, fair value is “the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.”$q$, $q$مفهوم سعر الخروج (Exit Price) | تقييم الأصول والالتزامات بناءً على السعر الذي يمكن تحقيقه في معاملة منظمة بالسوق
مدخلات قابلة للملاحظة | استخدام بيانات سوقية موثوقة وقابلة للملاحظة لتعظيم دقة التقييم
هرمية القيمة العادلة | تطبيق هرمية القيمة العادلة بمستوياتها الثلاثة (Level 1, 2, 3) لتصنيف المدخلات
تقليل التقديرات | تعظيم الاعتماد على البيانات السوقية الفعلية وتقليل التقديرات الذاتية$q$, $q$Exit price | Valuing assets and liabilities at the price achievable in an orderly market transaction
Observable inputs | Using reliable, observable market data to maximise accuracy
Fair value hierarchy | Classifying inputs across the three levels (Level 1, 2, 3)
Fewer estimates | Relying on actual market data and minimising subjective estimates$q$, $q$الهيئة العامة للرقابة المالية | الالتزام بمعايير التقييم المعتمدة ؛ الإفصاح عن منهجيات التقييم والافتراضات ؛ تقارير قابلة للمراجعة من الجهات الرقابية
معايير المحاسبة المصرية | متوافقة مع المعايير الدولية IFRS ؛ قياس الأدوات المالية والاستثمارات ؛ تقييم الأصول غير الملموسة
قوانين سوق المال | الالتزام بالشفافية والإفصاح ؛ حماية حقوق المستثمرين ؛ عدالة التقييمات في المعاملات المالية$q$, $q$Financial Regulatory Authority | Compliance with approved valuation standards ; Disclosure of methods and assumptions ; Reports reviewable by regulators
Egyptian Accounting Standards | Aligned with IFRS ; Measuring financial instruments and investments ; Valuing intangible assets
Capital market laws | Transparency and disclosure ; Investor protection ; Fair valuations in financial transactions$q$, $q$الامتثال الدولي والمحلي | الامتثال لمتطلبات التقارير المالية الدولية والمصرية وتجنب المخالفات الرقابية
الفحص النافي للجهالة | دعم عمليات الفحص النافي للجهالة (Due Diligence) بتقييمات دقيقة وموثقة
مصداقية القوائم المالية | تعزيز مصداقية القوائم المالية أمام المستثمرين والمدققين والجهات الرقابية
تقليل المخاطر القانونية | تقليل المخاطر القانونية المرتبطة بالتقييم ودعم قرارات الاستثمار والاستحواذ$q$, $q$Local & international compliance | Meeting Egyptian and international reporting requirements and avoiding regulatory breaches
Due diligence | Supporting due diligence with accurate, documented valuations
Credible financial statements | Strengthening credibility with investors, auditors and regulators
Lower legal risk | Reducing valuation-related legal risk and supporting investment and acquisition decisions$q$, $q$تقييم الشركات والاستثمارات | تقييم الشركات المقيدة وغير المقيدة ؛ تقييم الحصص الاستثمارية ؛ دعم عمليات الدمج والاستحواذ بتقارير دقيقة ومعتمدة
تقييم الأصول | الأصول الملموسة وغير الملموسة ؛ الأدوات المالية ؛ وفق هرمية القيمة العادلة ومعايير التقييم المعتمدة
تقارير متوافقة رقابيًا | متوافقة مع IFRS ؛ متوافقة مع متطلبات الهيئة العامة للرقابة المالية ؛ جاهزة للتدقيق والمراجعة$q$, $q$Company & investment valuation | Listed and unlisted companies ; Investment stakes ; Accurate, approved reports for M&A
Asset valuation | Tangible and intangible assets ; Financial instruments ; Per the fair value hierarchy and approved standards
Regulatory-compliant reports | IFRS-aligned ; Meeting FRA requirements ; Ready for audit and review$q$, $q$القوائم المالية السنوية | عند إعداد القوائم المالية التي تتطلب قياس الأصول بالقيمة العادلة
الطرح أو القيد بالبورصة | عند الطرح أو القيد حيث يتطلب الأمر تقييمات معتمدة
الاستحواذ أو الاندماج | لتحديد القيمة العادلة للأطراف المعنية
إدخال مستثمرين جدد | لتقييم عادل للحصص والأصول
إعادة هيكلة الشركات | لتقييم دقيق للأصول والالتزامات
طلب الجهات التنظيمية | عند طلب الجهات التنظيمية أو المدققين تقارير قيمة عادلة معتمدة$q$, $q$Annual financial statements | When assets must be measured at fair value
IPO or listing | When certified valuations are required
Acquisition or merger | To set the fair value for the parties involved
New investors | To value stakes and assets fairly
Restructuring | To value assets and liabilities accurately
Regulator request | When regulators or auditors ask for certified fair value reports$q$, $q$تحديد الغرض من التقييم | فهم الهدف من التقرير سواء للقوائم المالية أو الاستحواذ أو الطرح في البورصة
تحليل الأصل أو النشاط | دراسة تفصيلية للأصل أو النشاط محل التقييم وطبيعته وخصائصه
دراسة السوق والبيئة الاقتصادية | تحليل ظروف السوق والبيئة الاقتصادية المؤثرة على قيمة الأصل
اختيار منهج التقييم المناسب | منهج الدخل (DCF) أو منهج السوق أو منهج التكلفة
تحديد المدخلات وفق الهرمية | تصنيف المدخلات وفق هرمية القيمة العادلة (Level 1, 2, 3)
إعداد التقرير الشامل | تقرير متكامل متوافق مع المتطلبات الرقابية وجاهز للاعتماد$q$, $q$Define the purpose | Financial statements, acquisition or listing
Analyse the asset or business | A detailed study of its nature and characteristics
Study the market | Market and economic conditions affecting value
Choose the approach | Income (DCF), market or cost approach
Classify inputs | Per the fair value hierarchy (Level 1, 2, 3)
Issue the report | A complete, compliant report ready for approval$q$, $q$ملخص تنفيذي
وصف الأصل أو النشاط
تحليل السوق
منهجيات التقييم
الافتراضات الرئيسية
تصنيف المدخلات (Level 1, 2, 3)
تحليل الحساسية
القيمة العادلة النهائية
الإفصاحات المطلوبة$q$, $q$Executive summary
Description of the asset or business
Market analysis
Valuation methods
Key assumptions
Input classification (Level 1, 2, 3)
Sensitivity analysis
Final fair value
Required disclosures$q$, $q$التزام بالمعايير الدولية | التزام كامل بالمعايير الدولية وعلى رأسها IFRS 13
فهم التشريعات المصرية | فهم عميق للتشريعات ومتطلبات الهيئة العامة للرقابة المالية
تقارير احترافية | تقارير قابلة للاعتماد والتدقيق من الجهات المختصة
دعم مستمر | دعم حتى اعتماد التقرير من الجهات الرقابية والمدققين$q$, $q$International standards | Full adherence to IFRS, led by IFRS 13
Egyptian regulation | Deep knowledge of local rules and FRA requirements
Professional reports | Reports ready for approval and audit
Ongoing support | Support until regulators and auditors approve the report$q$, $q$هل تقارير القيمة العادلة إلزامية؟ | تُطلب في حالات محددة مثل القيد والطرح وزيادة رأس المال والاستحواذ، وعند قياس أصول بالقيمة العادلة في القوائم المالية. نحدد معك إن كانت حالتك تتطلبها.
هل التقارير معتمدة من الجهات الرقابية؟ | نعد التقارير وفق متطلبات الهيئة العامة للرقابة المالية ومعايير التقييم المعتمدة، ونتابعها حتى اعتمادها.
ما الفرق بين IFRS والمعايير المصرية؟ | معايير المحاسبة المصرية مبنية على المعايير الدولية مع بعض الاختلافات التي تراعي البيئة المحلية، ونطبق ما يناسب غرض التقرير والجهة المستخدمة له.
ما تكلفة إعداد تقرير القيمة العادلة؟ | تختلف حسب نطاق التقييم وحجم الشركة وعدد الأصول، ونرسل عرضًا فنيًا وماليًا بعد مكالمة استكشافية مجانية.
هل تقدم ركويزا تقارير لشركات خارج مصر؟ | نعم، ولدينا عملاء من خارج مصر، ونحدد نطاق العمل والمعايير المطبقة حسب الغرض.
ما المدة المتوقعة لإعداد التقرير؟ | تعتمد على حجم النشاط وتوافر البيانات، ونحدد جدولًا زمنيًا واضحًا في العرض.$q$, $q$Are fair value reports mandatory? | They are required in specific cases such as listing, IPOs, capital increases and acquisitions, and when assets are measured at fair value. We confirm whether your case requires one.
Are the reports accepted by regulators? | We prepare them under FRA requirements and approved valuation standards and follow up until approval.
IFRS vs. Egyptian standards? | Egyptian Accounting Standards are based on IFRS with some local differences; we apply what fits the report’s purpose and user.
What does a report cost? | It depends on scope, company size and number of assets; we send a proposal after a free discovery call.
Do you serve companies outside Egypt? | Yes, we have clients outside Egypt and set the scope and standards by purpose.
How long does it take? | It depends on size and data availability; the proposal includes a clear timeline.$q$),
  ($q$egx-listing$q$, 2, true, $q$/media/bell.webp$q$, $q$القيد بالبورصة المصرية$q$, $q$EGX Listing$q$, $q$مسار متكامل من دراسة الجاهزية والهيكلة حتى نشرة الاكتتاب وبدء التداول، بصفتنا راعيًا معتمدًا.$q$, $q$An end-to-end path from readiness and restructuring to the prospectus and first trade, as an approved sponsor.$q$, $q$ركويزا للاستشارات المالية عن الأوراق المالية تؤهّل شركتك للقيد والطرح في البورصة المصرية عبر مسار متكامل يبدأ من دراسة الجاهزية والهيكلة المالية والقانونية، ويمتد إلى إعداد نشرة الاكتتاب والتنسيق مع الجهات الرقابية حتى بدء التداول.$q$, $q$Riqueza prepares your company for listing and offering on the Egyptian Exchange through a complete path—from readiness assessment and financial and legal restructuring to the prospectus and regulatory coordination, up to the first day of trading.$q$, $q$ما هو القيد بالبورصة المصرية؟$q$, $q$What is listing on the EGX?$q$, $q$تحوّل مؤسسي يعيد صياغة هيكل الشركة وحوكمتها ومصادر تمويلها ويمنحها حضورًا أوسع في السوق.$q$, $q$An institutional transformation that reshapes a company’s structure, governance and funding, and gives it a wider market presence.$q$, $q$القيد في السوق الرئيسي | موجّه للشركات الكبيرة ذات رأس المال والسيولة الأعلى ؛ متطلبات إفصاح وحوكمة أوسع ؛ نسبة أعلى من الأسهم حرة التداول ؛ قوائم مالية مراجعة عن سنوات سابقة
القيد في سوق النيلكس (SMEs) | مخصص للشركات الصغيرة والمتوسطة ؛ متطلبات رأس مال وإفصاح أخف ؛ إشراف مستشار قيد معتمد طوال الفترة ؛ مسار تدريجي للانتقال لاحقًا للسوق الرئيسي$q$, $q$Main market | For large companies with higher capital and liquidity ; Broader disclosure and governance ; Higher free float ; Audited statements for prior years
NILEX (SMEs) | For small and medium companies ; Lighter capital and disclosure requirements ; Supervised by an approved listing advisor ; A gradual path to the main market$q$, $q$قوانين سوق المال | قانون سوق رأس المال ولائحته التنفيذية ؛ قانون الشركات وأحكام الشركات المساهمة
الجهات الرقابية | الهيئة العامة للرقابة المالية (FRA) ؛ البورصة المصرية (EGX) وشركة مصر للمقاصة والإيداع والقيد المركزي
المعايير المهنية | معايير المحاسبة المصرية ومعايير المراجعة ؛ قواعد القيد والشطب وقواعد الإفصاح الدوري$q$, $q$Capital market laws | Capital Market Law and its executive regulations ; Companies Law and joint-stock rules
Regulators | Financial Regulatory Authority (FRA) ; Egyptian Exchange (EGX) and Misr for Central Clearing, Depository & Registry
Professional standards | Egyptian accounting and auditing standards ; Listing, delisting and periodic disclosure rules$q$, $q$مصادر تمويل بديلة | رؤوس أموال جديدة لتمويل التوسعات دون الاعتماد الكامل على الاقتراض البنكي
رفع القيمة السوقية | تسعير عادل للسهم في سوق منظم يعكس القيمة الحقيقية للشركة
مصداقية وشفافية | الالتزام بقواعد الإفصاح والحوكمة يعزز ثقة العملاء والبنوك والمستثمرين
سيولة للمساهمين | آلية واضحة لدخول وخروج الشركاء دون تعطيل نشاط الشركة
تحوّل مؤسسي | الانتقال من الإدارة الفردية أو العائلية إلى إدارة مؤسسية
حضور في السوق | تعزيز العلامة التجارية والقدرة التفاوضية أمام البنوك والمستثمرين المؤسسيين$q$, $q$Alternative funding | New capital for expansion without relying fully on bank debt
Higher market value | Fair pricing in a regulated market
Credibility | Disclosure and governance build trust with clients, banks and investors
Shareholder liquidity | A clear mechanism for partners to enter and exit
Institutional shift | From individual or family management to institutional management
Market presence | A stronger brand and negotiating position$q$, $q$دراسة الجاهزية وتقييم الأهلية | تقييم أوضاع الشركة مقابل شروط القيد ؛ اختيار السوق الأنسب (الرئيسي أو النيلكس) ؛ الفحص النافي للجهالة المالي والقانوني والضريبي ؛ خطة معالجة بجدول زمني
الهيكلة المالية والقانونية والإدارية | التحويل إلى شركة مساهمة وتعديل النظام الأساسي ؛ ضبط هيكل رأس المال ونسب حرية التداول ؛ معالجة المعاملات مع الأطراف ذوي العلاقة ؛ بناء هيكل حوكمة ولجان مجلس الإدارة
التقييم والقوائم المالية | تقرير تقييم وتحديد القيمة العادلة للسهم ؛ إعادة عرض القوائم المالية وفق المعايير المصرية ؛ التنسيق مع مراقب الحسابات ؛ تحديد نطاق الطرح والسعر الاسترشادي
نشرة الاكتتاب والتنسيق الرقابي | صياغة نشرة الاكتتاب ومستندات القيد ؛ تقديم الملف ومتابعته مع البورصة والهيئة ؛ الرد على الاستفسارات حتى الموافقة ؛ دعم ما بعد القيد والإفصاحات الدورية$q$, $q$Readiness & eligibility | Gap assessment against listing rules ; Choosing the right market (main or NILEX) ; Financial, legal and tax due diligence ; A remediation plan with a timeline
Financial, legal & admin restructuring | Conversion to a joint-stock company ; Capital structure and free float ; Related-party transactions ; Governance structure and board committees
Valuation & financial statements | Fair value of the share ; Restating statements under EAS ; Coordinating with the auditor ; Offer size and indicative price
Prospectus & regulators | Drafting the prospectus and listing documents ; Filing and follow-up with EGX and FRA ; Answering queries until approval ; Post-listing disclosure support$q$, $q$شركات في مرحلة التحوّل | شركات عائلية تسعى للتحول المؤسسي ؛ شركات صغيرة ومتوسطة مستهدفة لسوق النيلكس ؛ شركات مستعدة للطرح العام الأولي (IPO)
احتياجات تمويلية واستثمارية | شركات تبحث عن تمويل التوسعات بدل الاقتراض ؛ مساهمون يرغبون في آلية خروج منظمة ؛ صناديق استثمار مباشر في مرحلة التخارج$q$, $q$Companies in transition | Family businesses moving to institutional management ; SMEs targeting NILEX ; Companies ready for an IPO
Funding & investment needs | Funding expansion instead of borrowing ; Shareholders seeking an orderly exit ; Private equity funds exiting$q$, $q$التشخيص والفحص النافي للجهالة | مراجعة شاملة للأوضاع المالية والقانونية والضريبية والتشغيلية
خطة التأهيل | جدول زمني بالإجراءات التصحيحية: الهيكلة والحوكمة والأنظمة المحاسبية
التنفيذ والإعداد | التعديلات القانونية وإعداد القوائم والتقييم وصياغة نشرة الاكتتاب
تقديم الملف والمتابعة | تقديم طلب القيد ومتابعته حتى الموافقة وبدء التداول
ما بعد القيد | دعم الإفصاحات الدورية وعلاقات المستثمرين والالتزام المستمر$q$, $q$Diagnosis & due diligence | A full review of financial, legal, tax and operational matters
Readiness plan | A timeline of corrective actions: structure, governance, accounting systems
Execution | Legal changes, statements, valuation and the prospectus
Filing & follow-up | Submitting and following up until approval and first trade
After listing | Periodic disclosure, investor relations and ongoing compliance$q$, $q$تقرير جاهزية مفصّل بالفجوات وخطة المعالجة
هيكل مالي وقانوني متوافق مع قواعد القيد
تقرير تقييم وتحديد القيمة العادلة للسهم
قوائم مالية معدّة ومراجعة وفق المعايير المصرية
نشرة اكتتاب ومستندات قيد مكتملة
ملف مقدَّم ومتابَع لدى البورصة والهيئة حتى الموافقة$q$, $q$A detailed readiness report with gaps and a remediation plan
A financial and legal structure compliant with listing rules
A valuation report setting the share’s fair value
Financial statements prepared and audited under EAS
A complete prospectus and listing file
A filing submitted and followed up until approval$q$, $q$خبرة متخصصة | خبرة عملية في ملفات القيد والطرح بالسوق الرئيسي والنيلكس
راعٍ معتمد | راعٍ رسمي معتمد لدى البورصة المصرية ومقيد بسجل رعاة الشركات الصغيرة والمتوسطة
فريق متعدد التخصصات | محللون ماليون ومستشارون قانونيون وخبراء حوكمة في فريق واحد
دعم متكامل | مرافقة من دراسة الجاهزية حتى بدء التداول وما بعده$q$, $q$Specialised experience | Hands-on listing work on the main market and NILEX
Approved sponsor | An official EGX sponsor registered for SMEs
Multi-disciplinary team | Analysts, legal advisors and governance experts
End-to-end support | From readiness to first trade and beyond$q$, $q$ما أهم شروط القيد بالبورصة المصرية؟ | تشمل شكلًا قانونيًا مناسبًا (شركة مساهمة)، وقوائم مالية مراجعة، وحدًا أدنى لرأس المال ونسبة الأسهم حرة التداول، والتزامًا بقواعد الحوكمة والإفصاح، وتختلف بين السوق الرئيسي والنيلكس.
كم تستغرق عملية القيد؟ | تعتمد على جاهزية الشركة؛ نحدد المدة بعد دراسة الجاهزية ونضع لها جدولًا زمنيًا واضحًا.
ما الفرق بين السوق الرئيسي والنيلكس؟ | السوق الرئيسي للشركات الأكبر بمتطلبات أعلى، والنيلكس مخصص للشركات الصغيرة والمتوسطة بمتطلبات أخف وإشراف راعٍ معتمد.
هل يجب التحويل إلى شركة مساهمة قبل القيد؟ | نعم، ونتولى إجراءات التحويل وتعديل النظام الأساسي ضمن الخدمة.
هل تقدمون الدعم بعد القيد؟ | نعم، ندعم الإفصاحات الدورية وعلاقات المستثمرين والالتزام بقواعد القيد والاستمرار.$q$, $q$What are the key listing requirements? | A suitable legal form (joint-stock), audited statements, minimum capital and free float, and governance and disclosure compliance; they differ between the main market and NILEX.
How long does listing take? | It depends on readiness; we set a clear timeline after the readiness study.
Main market vs. NILEX? | The main market is for larger companies with higher requirements; NILEX is for SMEs with lighter rules and an approved sponsor.
Must we convert to a joint-stock company first? | Yes, and we handle the conversion as part of the service.
Do you support companies after listing? | Yes—periodic disclosure, investor relations and continued compliance.$q$),
  ($q$financial-administrative-restructuring$q$, 3, true, $q$/media/blocks.webp$q$, $q$الهيكلة المالية والإدارية$q$, $q$Financial & Administrative Restructuring$q$, $q$إعادة تنظيم الموارد المالية والإدارية بما يدعم النمو المستدام ويعزز الكفاءة التشغيلية والمركز المالي.$q$, $q$Reorganising financial and administrative resources to support sustainable growth and efficiency.$q$, $q$تساعد ركويزا الشركات على إعادة تنظيم مواردها المالية والإدارية بشكل استراتيجي، بما يدعم النمو المستدام ويعزز كفاءتها التشغيلية ومركزها المالي وفق المعايير الدولية وأفضل الممارسات.$q$, $q$Riqueza helps companies strategically reorganise their financial and administrative resources to support sustainable growth and strengthen operational efficiency and financial position.$q$, $q$ما هي الهيكلة المالية والإدارية؟$q$, $q$What is financial & administrative restructuring?$q$, $q$إعادة تنظيم الجوانب المالية والإدارية داخل الشركة بهدف تحسين الأداء ورفع الكفاءة وتقليل المخاطر.$q$, $q$Reorganising a company’s financial and administrative side to improve performance, raise efficiency and reduce risk.$q$, $q$أهداف الهيكلة | تحسين الأداء المالي ؛ رفع كفاءة التشغيل ؛ تقليل المخاطر ؛ تعزيز الحوكمة والشفافية
مجالات إعادة التصميم | الهيكل التمويلي (ديون / حقوق ملكية) ؛ النظم المالية ؛ الهيكل الإداري والتنظيمي ؛ السياسات والإجراءات الداخلية$q$, $q$Objectives | Better financial performance ; Operational efficiency ; Lower risk ; Stronger governance and transparency
Areas we redesign | Funding structure (debt / equity) ; Financial systems ; Organisational structure ; Internal policies and procedures$q$, $q$المعايير الدولية | المعايير الدولية للتقارير المالية (IFRS) ؛ أفضل ممارسات الحوكمة وإدارة المخاطر ؛ مبادئ الاستدامة المالية وإعادة الهيكلة
الإطار التنظيمي في مصر | متطلبات الهيئة العامة للرقابة المالية ؛ قوانين سوق المال المصري ؛ معايير المحاسبة المصرية ؛ قواعد الحوكمة والإفصاح$q$, $q$International standards | IFRS ; Governance and risk best practice ; Financial sustainability principles
Egyptian framework | FRA requirements ; Capital market laws ; Egyptian Accounting Standards ; Governance and disclosure rules$q$, $q$التدفقات النقدية | تحسين السيولة وإدارة التدفقات النقدية بكفاءة أعلى
تقليل الديون | تقليل الأعباء المالية وإعادة جدولة الالتزامات
قرارات أفضل | تعزيز كفاءة اتخاذ القرار بمعلومات منظمة وموثوقة
الأداء التشغيلي | رفع كفاءة العمليات وخفض التكاليف التشغيلية
القيمة السوقية | رفع القيمة السوقية للشركة وتعزيز جاذبيتها للاستثمار
الاستعداد للنمو | تجهيز الشركة للاستثمار أو الطرح أو الاستحواذ$q$, $q$Cash flow | Better liquidity and cash management
Lower debt | Reduced financial burden and rescheduled obligations
Better decisions | Organised, reliable information
Operations | Higher efficiency and lower costs
Market value | A more valuable, investable company
Ready to grow | Prepared for investment, listing or acquisition$q$, $q$الهيكلة المالية | إعادة هيكلة الديون والالتزامات ؛ تحسين هيكل رأس المال ؛ إعداد نماذج مالية متقدمة ؛ إدارة التدفقات النقدية ؛ تحسين الربحية وتقليل التكاليف
الهيكلة الإدارية | إعادة تصميم الهيكل التنظيمي ؛ تطوير السياسات والإجراءات ؛ تحسين نظم الرقابة الداخلية ؛ رفع كفاءة الأداء الإداري
إعادة الهيكلة الاستراتيجية | وضع خطط تحول شاملة ؛ تحسين كفاءة العمليات ؛ إعادة توجيه الأنشطة والموارد ؛ دعم القرارات الاستراتيجية$q$, $q$Financial restructuring | Debt and liability restructuring ; Capital structure ; Advanced financial models ; Cash flow management ; Profitability and cost
Administrative restructuring | Organisation design ; Policies and procedures ; Internal control ; Management efficiency
Strategic restructuring | Transformation plans ; Process efficiency ; Redirecting activities and resources ; Strategic decision support$q$, $q$ضغوط مالية | عند وجود ضغوط مالية أو تراجع ملحوظ في الأداء
تراكم الديون | زيادة الديون أو ضعف السيولة
ضعف الكفاءة | تراجع الكفاءة التشغيلية وارتفاع التكاليف
دخول مستثمرين | قبل دخول مستثمرين أو شركاء جدد
الطرح في البورصة | الاستعداد لعمليات الطرح في سوق المال
التوسع والنمو | عند التوسع أو إعادة تنظيم الأنشطة$q$, $q$Financial pressure | Declining performance
Rising debt | Weak liquidity
Low efficiency | Rising costs
New investors | Before new partners join
IPO | Preparing for listing
Expansion | Growing or reorganising activities$q$, $q$تحليل الوضع الحالي | دراسة شاملة للوضع المالي والإداري
تحديد نقاط القوة والضعف | تشخيص دقيق لما يحتاج إلى تطوير
دراسة السوق والبيئة التنافسية | فهم الفرص والمخاطر
تصميم حلول الهيكلة | حلول مخصصة لطبيعة وحجم الشركة
إعداد نماذج وخطط تنفيذية | نماذج مالية وخطط قابلة للتطبيق
متابعة التنفيذ | قياس الأداء بمؤشرات محددة$q$, $q$Current-state analysis | A full financial and administrative review
Strengths & weaknesses | Precise diagnosis
Market study | Opportunities and risks
Design solutions | Tailored to the company
Models & plans | Financial models and executable plans
Follow-through | Measuring results with KPIs$q$, $q$تقرير تحليل شامل للوضع الحالي
خطة هيكلة مالية وإدارية متكاملة
نموذج مالي تفصيلي
توصيات لتحسين الأداء
خطة تنفيذ بجدول زمني
مؤشرات قياس الأداء (KPIs)$q$, $q$A full current-state report
An integrated restructuring plan
A detailed financial model
Performance recommendations
An implementation timeline
KPIs$q$, $q$خبرة متخصصة | فريق متخصص في الاستشارات المالية والإدارية
فهم السوق المصري | إلمام عميق بالسوق والتشريعات
حلول قابلة للتنفيذ | حلول عملية تركز على النتائج
قياس الأداء | مؤشرات واضحة لقياس نجاح الخطة$q$, $q$Specialists | A dedicated financial and management team
Local insight | Deep knowledge of Egypt’s market and rules
Practical solutions | Focused on results
Measurable | Clear KPIs for success$q$, $q$ما الفرق بين الهيكلة المالية والإدارية؟ | المالية تتعامل مع التمويل والديون ورأس المال والتدفقات النقدية، والإدارية مع الهيكل التنظيمي والسياسات والرقابة الداخلية.
هل تساعد الهيكلة في حل الأزمات المالية؟ | نعم، من خلال إعادة جدولة الالتزامات وتحسين السيولة وخفض التكاليف وفق خطة واضحة.
هل تشمل الخدمة متابعة التنفيذ؟ | نعم، نتابع التنفيذ ونقيس النتائج بمؤشرات أداء محددة.$q$, $q$Financial vs. administrative restructuring? | Financial covers funding, debt, capital and cash flow; administrative covers organisation, policies and internal control.
Can restructuring resolve a financial crisis? | Yes—by rescheduling obligations, improving liquidity and cutting costs under a clear plan.
Do you follow implementation? | Yes, with defined KPIs.$q$),
  ($q$corporate-governance$q$, 4, true, $q$/media/pillars.webp$q$, $q$تطبيق سياسات الحوكمة$q$, $q$Corporate Governance$q$, $q$منظومة حوكمة فعّالة تعزز الشفافية وجودة القرار وثقة المستثمرين وفق مبادئ OECD ومتطلبات الهيئة.$q$, $q$An effective governance system that builds transparency, decision quality and investor trust.$q$, $q$تساعد ركويزا الشركات على بناء منظومة حوكمة فعّالة تعزز الشفافية، وتحسّن جودة القرارات، وتدعم ثقة المستثمرين وأصحاب المصلحة وفق مبادئ OECD ومتطلبات الهيئة العامة للرقابة المالية.$q$, $q$Riqueza helps companies build an effective governance system that improves transparency and decision quality and supports investor and stakeholder trust, in line with OECD principles and FRA requirements.$q$, $q$ما هي حوكمة الشركات؟$q$, $q$What is corporate governance?$q$, $q$مجموعة من القواعد والسياسات والإجراءات التي تنظّم العلاقة بين مجلس الإدارة والإدارة التنفيذية والمساهمين وأصحاب المصلحة.$q$, $q$The rules, policies and procedures that govern the relationship between the board, executive management, shareholders and stakeholders.$q$, $q$أطراف الحوكمة | مجلس الإدارة ؛ الإدارة التنفيذية ؛ المساهمون ؛ أصحاب المصلحة
أهداف الحوكمة | الشفافية والإفصاح ؛ المساءلة والرقابة ؛ الإدارة الرشيدة للمخاطر ؛ تحقيق الاستدامة والنمو$q$, $q$Parties | Board of directors ; Executive management ; Shareholders ; Stakeholders
Objectives | Transparency and disclosure ; Accountability and oversight ; Sound risk management ; Sustainability and growth$q$, $q$المعايير الدولية | مبادئ OECD لحوكمة الشركات ؛ أفضل ممارسات الحوكمة العالمية ؛ متطلبات الإفصاح والشفافية
الإطار التنظيمي في مصر | قواعد الحوكمة الصادرة عن الهيئة العامة للرقابة المالية ؛ قوانين سوق المال ؛ معايير المحاسبة المصرية ؛ متطلبات القيد والإفصاح$q$, $q$International standards | OECD principles ; Global best practice ; Disclosure requirements
Egyptian framework | FRA governance rules ; Capital market laws ; EAS ; Listing and disclosure requirements$q$, $q$ثقة المستثمرين | تعزيز ثقة المستثمرين وأصحاب المصلحة
جودة التقارير | تحسين جودة وموثوقية التقارير والإفصاحات
تقليل المخاطر | تقليل المخاطر التشغيلية والمالية ومخاطر الامتثال
كفاءة القرار | رفع كفاءة الإدارة وجودة القرار
الامتثال التنظيمي | الالتزام بمتطلبات الجهات الرقابية
دعم النمو | دعم فرص التمويل والوصول لأسواق رأس المال$q$, $q$Investor trust | Stronger stakeholder confidence
Reporting quality | More reliable reports and disclosures
Lower risk | Operational, financial and compliance risk
Better decisions | More effective management
Compliance | Meeting regulatory requirements
Growth | Access to funding and capital markets$q$, $q$إطار الحوكمة | تصميم هيكل الحوكمة ؛ إعداد دليل الحوكمة (Governance Manual) ؛ تحديد الأدوار والمسؤوليات
السياسات والإجراءات | الإفصاح والشفافية ؛ إدارة المخاطر ؛ تضارب المصالح ؛ الامتثال
دعم مجلس الإدارة | تنظيم أعمال المجلس ؛ إعداد اللوائح الداخلية ؛ تشكيل اللجان (المراجعة، المخاطر، الحوكمة)
تقييم مستوى الحوكمة | تحليل الفجوات (Gap Analysis) ؛ تقييم الالتزام بالمعايير ؛ توصيات للتحسين$q$, $q$Governance framework | Governance structure ; Governance manual ; Roles and responsibilities
Policies & procedures | Disclosure ; Risk management ; Conflicts of interest ; Compliance
Board support | Board operations ; Internal by-laws ; Committees (audit, risk, governance)
Governance assessment | Gap analysis ; Compliance review ; Improvement plan$q$, $q$تأسيس شركة جديدة | وضع أساس قوي للحوكمة منذ البداية
الطرح في البورصة | متطلبات القيد والطرح
دخول مستثمرين | مستثمرون جدد أو شركاء استراتيجيون
التوسع وإعادة الهيكلة | عند التوسع أو إعادة الهيكلة
تحسين الامتثال | متطلبات الجهات التنظيمية
ضعف الرقابة الداخلية | تطوير نظم الرقابة$q$, $q$New company | Governance from day one
Listing | Listing and IPO requirements
New investors | Strategic partners
Expansion | Growth or restructuring
Compliance | Regulatory requirements
Weak controls | Strengthening internal control$q$, $q$تقييم الوضع الحالي | فحص مستوى تطبيق الحوكمة حاليًا
تحديد الفجوات | مقارنة بالمعايير الدولية والمحلية
تصميم الإطار المناسب | إطار مخصص لطبيعة وحجم الشركة
إعداد السياسات والإجراءات | دليل الحوكمة والسياسات التفصيلية
تدريب فرق العمل | تأهيل الإدارة والموظفين
دعم التطبيق والمتابعة | متابعة الالتزام بالسياسات$q$, $q$Assess | Current governance level
Gaps | Against local and international standards
Design | A tailored framework
Policies | Manual and detailed procedures
Train | Management and staff
Support | Ongoing follow-up$q$, $q$دليل حوكمة متكامل
سياسات وإجراءات معتمدة
هيكل تنظيمي واضح
لائحة مجلس الإدارة
تقارير تقييم الحوكمة
خطة تحسين وتطوير$q$, $q$A complete governance manual
Approved policies and procedures
A clear organisation chart
Board charter
Governance assessment reports
An improvement plan$q$, $q$خبرة في المعايير | تطبيق الحوكمة وفق المعايير الدولية وأفضل الممارسات
فهم التشريعات المصرية | قواعد الهيئة العامة للرقابة المالية
حلول قابلة للتنفيذ | حلول واقعية يمكن تطبيقها داخل الشركة
منهجية متكاملة | من التقييم حتى المتابعة بعد التطبيق$q$, $q$Standards expertise | International best practice
Local regulation | FRA rules
Practical | Solutions that work inside the company
End-to-end | From assessment to follow-up$q$, $q$ما الفرق بين الحوكمة والإدارة؟ | الإدارة تدير العمل اليومي، والحوكمة تضع الإطار الذي يراقب ويوجّه الإدارة ويضمن المساءلة.
هل الحوكمة إلزامية؟ | إلزامية للشركات المقيدة وبعض الكيانات الخاضعة لرقابة الهيئة، ومفيدة لكل شركة تسعى للنمو أو جذب المستثمرين.
هل تساعد الحوكمة في جذب المستثمرين؟ | نعم، فهي من أول ما يقيّمه المستثمرون والجهات الممولة.$q$, $q$Governance vs. management? | Management runs daily operations; governance sets the framework that oversees and holds management accountable.
Is governance mandatory? | For listed companies and some FRA-regulated entities, and valuable for any company seeking growth or investors.
Does it attract investors? | Yes—it is one of the first things investors and lenders assess.$q$),
  ($q$research-reports$q$, 5, true, $q$/media/research.webp$q$, $q$إعداد البحوث والتقارير$q$, $q$Research & Reporting$q$, $q$تحليلات مالية واقتصادية دقيقة ورؤى مبنية على بيانات موثوقة لدعم متخذي القرار.$q$, $q$Accurate financial and economic analysis built on reliable data to support decision-makers.$q$, $q$تقدّم ركويزا تحليلات دقيقة ورؤى مبنية على بيانات موثوقة ومعايير مهنية معتمدة، لدعم متخذي القرار في الشركات والمؤسسات وفهم الأسواق وتقييم الفرص الاستثمارية بشكل احترافي.$q$, $q$Riqueza delivers precise analysis and insights grounded in reliable data and professional standards, helping decision-makers understand markets and assess investment opportunities.$q$, $q$ما هي البحوث والتقارير المالية والاقتصادية؟$q$, $q$What is financial & economic research?$q$, $q$دراسات تحليلية متخصصة تُعدّ أداة أساسية في التخطيط الاستراتيجي واتخاذ القرار.$q$, $q$Specialised analytical studies that are a core tool for strategic planning and decision-making.$q$, $q$أهداف البحوث والتقارير | تحليل الأداء المالي للشركات ؛ دراسة الأسواق والقطاعات ؛ تقييم الفرص والمخاطر ؛ رؤى وتوصيات مبنية على بيانات دقيقة
طبيعة المخرجات | تحليلات مالية واقتصادية معمقة ؛ رؤى استراتيجية قابلة للتطبيق ؛ دعم القرار الاستثماري ؛ قراءة احترافية لاتجاهات السوق$q$, $q$Objectives | Company financial performance ; Markets and sectors ; Opportunities and risks ; Data-driven recommendations
Deliverables | In-depth analysis ; Actionable insight ; Investment decision support ; Market trend reading$q$, $q$المعايير المهنية الدولية | أفضل ممارسات التحليل المالي والاستثماري ؛ معايير إعداد التقارير المالية (IFRS) ؛ منهجيات التحليل الاقتصادي والقطاعي
الإطار التنظيمي في مصر | متطلبات الهيئة العامة للرقابة المالية ؛ قواعد الإفصاح والشفافية ؛ التشريعات المنظمة لسوق المال ؛ معايير المحاسبة المصرية$q$, $q$International standards | Financial and investment analysis practice ; IFRS ; Economic and sector methods
Egyptian framework | FRA requirements ; Disclosure rules ; Capital market legislation ; EAS$q$, $q$دعم القرارات الاستثمارية | قاعدة تحليلية صلبة لقرارات مدروسة
فهم الاتجاهات | قراءة دقيقة للاتجاهات الاقتصادية وفرص النمو
تقييم الأداء | تقييم احترافي للشركات والقطاعات والمنافسين
الفرص والمخاطر | كشف الفرص والمخاطر مبكرًا
الشفافية والمصداقية | أمام المستثمرين وأصحاب المصلحة
الامتثال التنظيمي | تلبية متطلبات الجهات الرقابية$q$, $q$Investment decisions | A solid analytical base
Trends | Reading economic direction
Performance | Companies, sectors and competitors
Opportunity & risk | Early detection
Credibility | With investors and stakeholders
Compliance | Regulatory reporting$q$, $q$البحوث المالية | تحليل القوائم المالية ؛ تقييم الأداء المالي ؛ تحليل الربحية والسيولة ؛ تقارير التقييم المالي
البحوث الاقتصادية والقطاعية | تحليل القطاعات ؛ اتجاهات السوق ؛ تحليل المنافسين ؛ تقارير السوق
التقارير الاستثمارية | تقييم الفرص الاستثمارية ؛ تقارير جدوى مبدئية ؛ تحليل المخاطر والعوائد ؛ دعم قرارات الاستثمار
تقارير مخصصة | للإدارة العليا ؛ للمستثمرين ؛ للجهات الرقابية ؛ لأغراض التمويل$q$, $q$Financial research | Statement analysis ; Performance ; Profitability and liquidity ; Valuation reports
Economic & sector research | Sectors ; Market trends ; Competitors ; Market reports
Investment reports | Opportunities ; Preliminary feasibility ; Risk and return ; Decision support
Custom reports | Senior management ; Investors ; Regulators ; Financing$q$, $q$قرارات استثمارية | تحليل معمق للفرص والمخاطر
أسواق وقطاعات جديدة | فهم البيئة والتنافسية
تقييم أداء الشركة | مراجعة دورية للأداء
تقارير للمستثمرين | تقارير دورية أو خاصة
التخطيط الاستراتيجي | دعم الخطط طويلة المدى$q$, $q$Investment decisions | Deep risk/opportunity analysis
New markets | Understanding the landscape
Performance review | Periodic assessment
Investor reporting | Regular or special reports
Strategic planning | Long-term plans$q$, $q$تحديد هدف التقرير | الاتفاق على النطاق والأهداف
جمع البيانات | من مصادر أولية وثانوية معتمدة
تحليل البيانات | بأدوات تحليل مالي واقتصادي حديثة
النماذج التحليلية | نماذج تدعم استخلاص النتائج
النتائج والتوصيات | استنتاجات دقيقة وتوصيات عملية
التقرير النهائي | صياغة احترافية ورسوم بيانية واضحة$q$, $q$Define the goal | Scope and objectives
Collect data | Reliable primary and secondary sources
Analyse | Modern financial and economic tools
Model | Analytical models
Conclude | Findings and recommendations
Deliver | A clear, professional report$q$, $q$تقارير تحليلية شاملة
ملخصات تنفيذية للإدارة العليا
نماذج مالية وتحليلية
رسوم بيانية وتوضيحية
توصيات عملية قابلة للتنفيذ$q$, $q$Comprehensive analytical reports
Executive summaries
Financial and analytical models
Charts and visuals
Actionable recommendations$q$, $q$خبرة تحليلية | خبرة في التحليل المالي والاقتصادي عبر قطاعات متنوعة
بيانات موثوقة | مصادر معتمدة ودقيقة
فهم السوق المصري | والإقليمي وخصوصيات قطاعاته
تقارير مخصصة | حسب احتياجات كل عميل وأهدافه$q$, $q$Analytical depth | Across many sectors
Reliable data | Verified sources
Market insight | Egypt and the region
Tailored | To each client’s goals$q$, $q$هل يمكن تخصيص التقارير حسب احتياجات الشركة؟ | نعم، نحدد النطاق والشكل والمخرجات مع العميل قبل البدء.
هل التقارير مناسبة للعرض على المستثمرين؟ | نعم، نعدّها بصياغة احترافية مع ملخص تنفيذي ورسوم واضحة.$q$, $q$Can reports be customised? | Yes, we agree scope, format and deliverables first.
Are they suitable for investors? | Yes, with an executive summary and clear charts.$q$),
  ($q$capital-increase-reduction$q$, 6, true, $q$/media/coins.webp$q$, $q$زيادة وتخفيض رأس المال$q$, $q$Capital Increase & Reduction$q$, $q$تنفيذ عمليات تعديل رأس المال بكفاءة مع الالتزام الكامل بالإجراءات القانونية ومتطلبات الهيئة.$q$, $q$Executing capital changes efficiently with full legal and FRA compliance.$q$, $q$تقدّم ركويزا خدمات متكاملة لتنفيذ عمليات تعديل رأس المال بكفاءة عالية، مع ضمان الالتزام الكامل بالإجراءات القانونية ومتطلبات الهيئة العامة للرقابة المالية، بما يدعم خطط النمو أو إعادة الهيكلة المالية.$q$, $q$Riqueza delivers end-to-end services to execute capital changes efficiently, with full legal and FRA compliance, supporting growth or financial restructuring plans.$q$, $q$ما هي زيادة وتخفيض رأس المال؟$q$, $q$What are capital increases and reductions?$q$, $q$عمليات تعديل هيكل حقوق الملكية في الشركة لتحقيق أهداف مالية واستراتيجية.$q$, $q$Changes to a company’s equity structure to achieve financial and strategic goals.$q$, $q$زيادة رأس المال | إصدار أسهم جديدة ؛ إدخال مستثمرين جدد ؛ رسملة الأرباح المحتجزة ؛ تحويل الديون إلى حقوق ملكية
تخفيض رأس المال | إطفاء الخسائر المتراكمة ؛ رد جزء من رأس المال للمساهمين ؛ إعادة هيكلة الهيكل المالي ؛ تحسين مؤشرات الأداء المالي$q$, $q$Capital increase | Issuing new shares ; Bringing in investors ; Capitalising retained earnings ; Converting debt to equity
Capital reduction | Writing off accumulated losses ; Returning capital to shareholders ; Restructuring ; Improving financial ratios$q$, $q$قوانين سوق المال | تنظيم إصدار الأسهم ؛ حماية حقوق المساهمين ؛ الشفافية والإفصاح
متطلبات الرقابة المالية | الموافقات اللازمة ؛ دراسات وتقارير داعمة ؛ إجراءات الإفصاح
المعايير المحاسبية | المعالجة المحاسبية لعمليات رأس المال ؛ الإفصاح عن التغيرات في حقوق الملكية ؛ IFRS والمعايير المصرية$q$, $q$Capital market laws | Share issuance ; Shareholder rights ; Disclosure
Regulatory requirements | Approvals ; Supporting studies ; Disclosure procedures
Accounting | Treatment of capital transactions ; Changes in equity ; IFRS and EAS$q$, $q$تمويل التوسع | تمويل خطط النمو والمشروعات الجديدة
تحسين الهيكل التمويلي | توازن صحي بين الديون وحقوق الملكية
معالجة الخسائر | إطفاء الخسائر المتراكمة
جذب مستثمرين | دخول مستثمرين يدعمون الاستراتيجية
تحسين المؤشرات | تحسين النسب المالية أمام السوق
تعزيز الثقة | ثقة المستثمرين والجهات التمويلية$q$, $q$Fund expansion | Growth and new projects
Better funding mix | Healthy debt/equity balance
Address losses | Write off accumulated losses
Attract investors | Strategic partners
Better ratios | Stronger market metrics
Trust | With investors and lenders$q$, $q$دراسات زيادة رأس المال | تحديد احتياجات التمويل ؛ تقييم الشركة وقيمتها العادلة ؛ أفضل هيكل وأسلوب للزيادة
إدارة إجراءات الزيادة | المستندات القانونية ؛ التنسيق مع الجهات الرقابية ؛ دعم إصدار الأسهم والتنفيذ
تخفيض رأس المال | دراسات التخفيض ؛ تحليل الأثر المالي والمحاسبي ؛ دعم الإجراءات القانونية
التقارير المعتمدة | تقارير مالية داعمة ؛ تقارير تقييم عند الحاجة ؛ مستندات متوافقة رقابيًا$q$, $q$Increase studies | Funding needs ; Fair value ; Best structure and method
Increase execution | Legal documents ; Regulator coordination ; Issuance support
Reduction | Studies ; Financial and accounting impact ; Legal procedures
Certified reports | Supporting reports ; Valuations where needed ; Compliant documents$q$, $q$حالات زيادة رأس المال | التوسع وفتح أسواق جديدة ؛ تمويل مشروعات جديدة ؛ دخول مستثمرين استراتيجيين ؛ مشروعات استثمارية كبرى
حالات تخفيض رأس المال | خسائر متراكمة ؛ إعادة الهيكلة ؛ تحسين المركز المالي ؛ رأس مال غير مستخدم$q$, $q$When to increase | Expansion ; New projects ; Strategic investors ; Major investments
When to reduce | Accumulated losses ; Restructuring ; Better financial position ; Unused capital$q$, $q$تحليل الوضع المالي | دراسة القوائم والمركز المالي
تحديد الهدف | غرض الزيادة أو التخفيض ونطاقه
الدراسات المالية | تحليلات تدعم القرار
التنسيق مع الجهات التنظيمية | متابعة الموافقات
الإجراءات القانونية | إنهاء الخطوات التوثيقية
التقارير النهائية | تسليم المستندات المعتمدة$q$, $q$Analyse | Statements and position
Define | Purpose and scope
Study | Supporting analysis
Regulators | Approvals
Legal | Documentation
Close | Final certified documents$q$, $q$دراسة متكاملة لزيادة أو تخفيض رأس المال
نموذج مالي تحليلي يدعم القرار
تقارير تقييم متخصصة (عند الحاجة)
مستندات قانونية وتنظيمية معتمدة
دعم كامل حتى إتمام العملية$q$, $q$A complete increase/reduction study
A supporting financial model
Valuation reports (where needed)
Certified legal and regulatory documents
Support until completion$q$, $q$خبرة متخصصة | في كافة إجراءات رأس المال
التزام تنظيمي | بمتطلبات الهيئة العامة للرقابة المالية
سرعة وكفاءة | دون الإخلال بالدقة
دعم متكامل | من التحليل حتى إتمام التنفيذ$q$, $q$Specialised | Every capital procedure
Compliant | FRA requirements
Fast | Without compromising accuracy
Complete | From analysis to execution$q$, $q$هل تحتاج زيادة رأس المال موافقة الجهات الرقابية؟ | تحتاج موافقات وإجراءات تختلف حسب طبيعة الشركة وطريقة الزيادة، ونتولى التنسيق معها.
ما الفرق بين الزيادة النقدية ورسملة الأرباح؟ | الزيادة النقدية تضخ أموالًا جديدة، بينما رسملة الأرباح تحوّل أرباحًا محتجزة إلى رأس مال دون أموال جديدة.
هل التخفيض يؤثر سلبًا على الشركة؟ | ليس بالضرورة؛ قد يحسّن المركز المالي عند إطفاء الخسائر أو رد رأس مال غير مستخدم.$q$, $q$Do increases need regulatory approval? | Approvals vary by company type and method; we coordinate them.
Cash increase vs. capitalising profits? | Cash brings new funds; capitalisation converts retained earnings without new money.
Is a reduction harmful? | Not necessarily—it can strengthen the balance sheet.$q$),
  ($q$mergers-acquisitions$q$, 7, true, $q$/media/merge.webp$q$, $q$عمليات الاستحواذ والاندماج$q$, $q$Mergers & Acquisitions$q$, $q$صفقات استراتيجية ناجحة من التخطيط والفحص النافي للجهالة والتقييم حتى دعم ما بعد الإغلاق.$q$, $q$Successful strategic deals—from planning, due diligence and valuation to post-closing support.$q$, $q$تقدّم ركويزا خدمات متكاملة في عمليات الاستحواذ والاندماج (M&A) لدعم الشركات والمستثمرين في تنفيذ صفقات استراتيجية ناجحة، بما يتوافق مع المعايير الدولية ومتطلبات الهيئة العامة للرقابة المالية لتحقيق أفضل قيمة ممكنة.$q$, $q$Riqueza supports companies and investors in executing successful strategic M&A deals, in line with international standards and FRA requirements, to achieve the best possible value.$q$, $q$ما هي عمليات الاستحواذ والاندماج؟$q$, $q$What are M&A transactions?$q$, $q$صفقات استراتيجية لإعادة تشكيل ملكية وهياكل الشركات بهدف النمو والتوسع وتحقيق الكفاءة.$q$, $q$Strategic deals that reshape ownership and structure for growth, expansion and efficiency.$q$, $q$الاستحواذ (Acquisition) | شراء شركة أو حصة مؤثرة فيها ؛ التحكم في القرارات الاستراتيجية ؛ الاحتفاظ بالكيان القانوني أو دمجه ؛ التوسع السريع في السوق
الاندماج (Merger) | دمج شركتين أو أكثر في كيان واحد ؛ زيادة الحصة السوقية ؛ تحقيق وفورات الحجم ؛ تنويع الأنشطة والإيرادات$q$, $q$Acquisition | Buying a company or a controlling stake ; Strategic control ; Keeping or merging the entity ; Rapid market expansion
Merger | Combining two or more companies ; Larger market share ; Economies of scale ; Diversified revenue$q$, $q$متطلبات الهيئة العامة للرقابة المالية | عروض الشراء الإجباري والاختياري ؛ قواعد الإفصاح والشفافية ؛ الموافقات التنظيمية
قوانين سوق المال | الاستحواذ على الشركات المقيدة ؛ حماية حقوق المساهمين ؛ عدالة التقييم
المعايير المحاسبية | تقارير القيمة العادلة ؛ المعالجة المحاسبية للاندماج ؛ الإفصاح عن الصفقات$q$, $q$FRA requirements | Mandatory and voluntary tender offers ; Disclosure ; Regulatory approvals
Capital market laws | Acquiring listed companies ; Shareholder protection ; Fair valuation
Accounting | Fair value reports ; Merger accounting ; Deal disclosure$q$, $q$نمو سريع | يفوق معدلات النمو العضوي
أسواق جديدة | جغرافيًا وقطاعيًا
تعزيز التنافسية | ومكانة الشركة في السوق
الكفاءة التشغيلية | ووفورات الحجم
زيادة القيمة السوقية | وتحسين التقييم
التكامل بين الأنشطة | وتنويع مصادر الإيرادات$q$, $q$Fast growth | Beyond organic rates
New markets | Geographic and sector
Competitiveness | Stronger position
Efficiency | Economies of scale
Market value | Better valuation
Integration | Diversified revenue$q$, $q$الاستشارات الاستراتيجية | تحديد الفرص ؛ جدوى الصفقة الاستراتيجية والمالية ؛ استراتيجية التفاوض
الفحص النافي للجهالة | تحليل مالي وقانوني وتشغيلي ؛ المخاطر والالتزامات الخفية ؛ مراجعة البيانات والوثائق
التقييم المالي | تقارير القيمة العادلة ؛ قيمة الشركات المستهدفة ؛ أرقام موثوقة للقرار
تنفيذ الصفقات | هيكلة الصفقة ؛ إدارة المفاوضات ؛ التنسيق مع الجهات الرقابية
ما بعد الاندماج | دمج العمليات ؛ إعادة الهيكلة ؛ التكامل التشغيلي والثقافي$q$, $q$Strategy | Finding targets ; Strategic and financial fit ; Negotiation strategy
Due diligence | Financial, legal, operational ; Hidden liabilities ; Document review
Valuation | Fair value reports ; Target value ; Reliable numbers
Execution | Deal structure ; Negotiations ; Regulators
Post-merger | Integration ; Restructuring ; Operational and cultural fit$q$, $q$التوسع السريع | تجاوز معدلات النمو العضوي
دخول أسواق جديدة | جغرافيًا أو قطاعيًا
بيع الشركة أو جزء منها | التخارج المنظم
جذب مستثمر استراتيجي | يضيف قيمة للشركة
إعادة هيكلة الأعمال | تحسين الكفاءة
تحسين الأداء التنافسي | مواجهة المنافسين$q$, $q$Rapid expansion | Beyond organic growth
New markets | Geographic or sector
Selling | Full or partial exit
Strategic investor | Value-adding partner
Restructuring | Efficiency
Competition | Stronger position$q$, $q$الأهداف الاستراتيجية | الاتفاق على أهداف الصفقة
تحليل السوق والفرص | الشركات المرشحة
تقييم الشركات المستهدفة | بأساليب معتمدة
الفحص النافي للجهالة | كشف المخاطر
الهيكلة والتفاوض | الهيكل الأمثل وإدارة المفاوضات
التنفيذ وما بعد الإغلاق | ضمان نجاح الدمج$q$, $q$Objectives | Deal goals
Market scan | Candidate companies
Valuation | Approved methods
Due diligence | Uncovering risk
Structure & negotiate | Optimal deal design
Close & integrate | Post-closing success$q$, $q$تقارير تحليلية واستراتيجية للصفقة
تقارير تقييم مالي معتمدة
تقارير الفحص النافي للجهالة
هيكل الصفقة وآلية التنفيذ
دعم قانوني وتنظيمي متكامل
خطة دمج ما بعد الصفقة$q$, $q$Strategic deal analysis
Certified valuation reports
Due diligence reports
Deal structure and execution plan
Legal and regulatory support
Post-merger integration plan$q$, $q$خبرة متخصصة | في صفقات مختلف القطاعات
فهم السوق المصري | وديناميكياته وفرصه
أفضل قيمة للعميل | في كل مرحلة من الصفقة
سرية وموثوقية | في إدارة المعلومات الحساسة$q$, $q$Experience | Deals across sectors
Market insight | Egypt’s dynamics
Best value | At every stage
Confidentiality | Sensitive information protected$q$, $q$ما الفرق بين الاندماج والاستحواذ؟ | الاندماج يدمج شركتين أو أكثر في كيان واحد، والاستحواذ يعني سيطرة شركة على أخرى بشراء كل أو حصة حاكمة من أسهمها.
ما هو الفحص النافي للجهالة؟ | مراجعة مالية وقانونية وتشغيلية شاملة للشركة المستهدفة لكشف المخاطر والالتزامات قبل إتمام الصفقة.
هل تحتاج الصفقات إلى موافقة الجهات الرقابية؟ | نعم في حالات كثيرة، خاصة مع الشركات المقيدة، ونتولى التنسيق مع الجهات المختصة.$q$, $q$Merger vs. acquisition? | A merger combines companies into one; an acquisition gives one company control of another by buying all or a controlling stake.
What is due diligence? | A full financial, legal and operational review of the target to uncover risks before closing.
Do deals need approval? | Often, especially with listed companies; we coordinate it.$q$),
  ($q$asset-valuation$q$, 8, true, $q$/media/building.webp$q$, $q$تقييم الأصول$q$, $q$Asset Valuation$q$, $q$تقييم الأصول الملموسة وغير الملموسة والمالية وفق IFRS 13 ومعايير التقييم الدولية (IVS).$q$, $q$Valuing tangible, intangible and financial assets under IFRS 13 and IVS.$q$, $q$تقدّم ركويزا خدمات متكاملة في تقييم الأصول الملموسة وغير الملموسة والمالية، لدعم الشركات والمستثمرين في تحديد القيمة العادلة لأصولهم بدقة واحترافية، بما يتوافق مع معيار IFRS 13 ومعايير التقييم الدولية (IVS) ومتطلبات الهيئة العامة للرقابة المالية.$q$, $q$Riqueza values tangible, intangible and financial assets to help companies and investors determine fair value accurately, in line with IFRS 13, International Valuation Standards (IVS) and FRA requirements.$q$, $q$ما هو تقييم الأصول؟$q$, $q$What is asset valuation?$q$, $q$عملية تحديد القيمة العادلة للأصول باستخدام أساليب ومعايير معتمدة دوليًا.$q$, $q$Determining the fair value of assets using internationally recognised methods and standards.$q$, $q$تحديد القيمة العادلة | قياس القيمة الحقيقية للأصل في السوق ؛ الاعتماد على معيار IFRS 13 ؛ تطبيق معايير التقييم الدولية (IVS) ؛ دعم القرارات المالية والاستثمارية
أغراض التقييم | الاستحواذ والاندماج وإعادة الهيكلة ؛ الإفصاح المحاسبي والقوائم المالية ؛ التمويل والضمانات ؛ تسوية النزاعات وأغراض التأمين$q$, $q$Fair value | True market value ; IFRS 13 ; IVS ; Financial and investment decisions
Purposes | M&A and restructuring ; Accounting disclosure ; Financing and collateral ; Disputes and insurance$q$, $q$الهيئة العامة للرقابة المالية | قواعد قيد خبراء التقييم ؛ معايير اعتماد تقارير التقييم ؛ متطلبات الإفصاح والشفافية
معايير التقييم الدولية (IVS) | الإطار العام لمعايير التقييم ؛ قواعد التقييم لكل نوع من الأصول ؛ ضوابط إعداد التقارير
معيار IFRS 13 | تعريف القيمة العادلة وقياسها ؛ مستويات المدخلات الثلاثة ؛ متطلبات الإفصاح$q$, $q$FRA | Valuer registration rules ; Report approval standards ; Disclosure
IVS | General framework ; Rules per asset type ; Reporting standards
IFRS 13 | Defining and measuring fair value ; Three input levels ; Disclosure$q$, $q$دقة القرارات | قرارات مبنية على أرقام موثوقة
تحديد قيمة الصفقات | في الاستحواذ والاندماج
الإفصاح المحاسبي | وفق IFRS 13
دعم التمويل | بضمانات الأصول المقيّمة
تسوية النزاعات | تقارير معتمدة للقضايا التحكيمية
إدارة المخاطر | تحديد قيم التأمين$q$, $q$Better decisions | Reliable numbers
Deal value | For M&A
Disclosure | Under IFRS 13
Financing | Asset-backed collateral
Disputes | Certified reports for arbitration
Risk | Insurance values$q$, $q$الأصول الملموسة | العقارات والأراضي والمباني ؛ الآلات والمعدات ووسائل النقل ؛ المخزون والأصول التشغيلية
الأصول غير الملموسة | العلامات التجارية والشهرة ؛ براءات الاختراع والملكية الفكرية ؛ البرمجيات وحقوق الامتياز
الأصول المالية | الأسهم والسندات والصكوك ؛ الاستثمارات والمحافظ ؛ الأدوات المالية المشتقة
تقييم الشركات | القيمة العادلة للشركات ؛ لأغراض الاستحواذ والتخارج ؛ تقارير معتمدة رقابيًا
الإفصاح المحاسبي | تقارير القيمة العادلة وفق IFRS 13 ؛ اختبار الانخفاض في القيمة ؛ دعم القوائم المالية$q$, $q$Tangible | Real estate and land ; Machinery and vehicles ; Inventory and operating assets
Intangible | Brands and goodwill ; Patents and IP ; Software and franchises
Financial | Shares, bonds and sukuk ; Portfolios ; Derivatives
Businesses | Company fair value ; For acquisition and exit ; Certified reports
Accounting | IFRS 13 fair value ; Impairment testing ; Financial statement support$q$, $q$الاستحواذ والاندماج | تحديد القيمة العادلة
إعداد القوائم المالية | متطلبات IFRS
الحصول على تمويل | ضمانات الأصول
إعادة الهيكلة | أو تعديل رأس المال
تسوية النزاعات | تقارير معتمدة
التأمين والضرائب | تحديد القيم$q$, $q$M&A | Setting fair value
Financial statements | IFRS needs
Financing | Collateral
Restructuring | Or capital changes
Disputes | Certified reports
Insurance & tax | Setting values$q$, $q$نطاق وأهداف التقييم | الأصول والغرض وتاريخ التقييم
جمع البيانات والمعاينة | المستندات والمعاينة الميدانية
اختيار الأساليب | السوق أو الدخل أو التكلفة
تحليل السوق | المقارنات والمؤشرات
تطبيق النماذج | حساب القيمة العادلة
إصدار التقرير | تقرير شامل ومعتمد$q$, $q$Scope | Assets, purpose and date
Data & inspection | Documents and site visits
Methods | Market, income or cost
Market analysis | Comparables
Models | Computing fair value
Report | A certified final report$q$, $q$تقرير تقييم شامل وفق IVS و IFRS 13
ملخص تنفيذي بالقيمة العادلة
تحليل تفصيلي لأساليب وفرضيات التقييم
دراسة السوق والمقارنات المرجعية
تقرير المعاينة الميدانية
إفصاحات مطابقة لمتطلبات الجهات الرقابية$q$, $q$A full IVS / IFRS 13 report
Executive summary of fair value
Methods and assumptions
Market study and comparables
Site inspection report
Regulatory disclosures$q$, $q$معايير دولية | تطبيق IVS و IFRS 13 بدقة
تنوع الأصول | خبرة في جميع أنواع الأصول
تقارير معتمدة | لدى البنوك والجهات الحكومية والرقابية
سرية وموثوقية | في التعامل مع بيانات العملاء$q$, $q$International standards | IVS and IFRS 13
All asset types | Broad experience
Accepted reports | By banks and regulators
Confidential | Client data protected$q$, $q$ما أساليب تقييم الأصول المعتمدة؟ | أسلوب السوق وأسلوب الدخل وأسلوب التكلفة، ويُختار الأنسب حسب نوع الأصل والغرض.
ما الفرق بين القيمة العادلة والسوقية والدفترية؟ | الدفترية هي قيمة الأصل في الميزانية، والسوقية سعره المتداول، والعادلة سعر معاملة منظمة بين أطراف السوق في تاريخ القياس.$q$, $q$Which methods are used? | Market, income and cost approaches, chosen by asset type and purpose.
Fair vs. market vs. book value? | Book is the balance-sheet value, market is the traded price, fair is the price in an orderly transaction at the measurement date.$q$),
  ($q$feasibility-studies$q$, 9, true, $q$/media/blueprint.webp$q$, $q$إعداد دراسات الجدوى$q$, $q$Feasibility Studies$q$, $q$دراسات جدوى سوقية وفنية ومالية تقيس فرص نجاح المشروع قبل التنفيذ وتحمي رأس المال.$q$, $q$Market, technical and financial studies that test a project before you invest.$q$, $q$تقوم ركويزا بإعداد كافة دراسات الجدوى الاقتصادية لعملائها في مختلف مجالات الاستثمار حتى يتسنى لهم البدء في استثماراتهم على أسس علمية محددة.$q$, $q$Riqueza prepares economic feasibility studies across sectors so clients can start their investments on a sound, scientific basis.$q$, $q$ما هي دراسة الجدوى الاقتصادية؟$q$, $q$What is a feasibility study?$q$, $q$أسلوب علمي لتقدير احتمالات نجاح فكرة استثمارية قبل التنفيذ الفعلي في ضوء قدرة المشروع على تحقيق أهداف المستثمر، وأداة عملية تجنب المشروع المخاطر وتحمل الخسائر.$q$, $q$A scientific way to estimate an investment idea’s chance of success before execution, and a practical tool to avoid risk and losses.$q$, $q$دراسة جدوى سوقية وفنية | تحليل الجوانب السوقية والفنية لتحديد حجم الطلب والإمكانيات التقنية
دراسة جدوى مالية وتمويلية | الجدوى المالية ومصادر التمويل والعائد المتوقع على الاستثمار
دراسة جدوى اقتصادية واجتماعية | الأثر الاقتصادي والاجتماعي للمشروع على المجتمع والبيئة$q$, $q$Market & technical | Demand and technical capability
Financial & funding | Viability, funding sources and expected return
Economic & social | Impact on society and the environment$q$, null, null, $q$حماية رأس المال | تقليل احتمال الخسارة نتيجة تقديرات غير واقعية
نقطة التعادل | معرفة الزمن المتوقع للوصول إلى الربحية
تحليل الحساسية | أثر التغير في الفائدة والتكاليف وحجم الطلب
دعم قرارات التمويل | أمام البنوك والمستثمرين بأرقام موثقة$q$, $q$Protect capital | Avoid unrealistic estimates
Break-even | Time to profitability
Sensitivity | Interest, cost and demand changes
Financing | Documented numbers for banks and investors$q$, $q$دراسة السوق والمنافسين | حجم السوق ؛ شرائح العملاء وسلوكهم ؛ المنافسون ونقاط قوتهم وضعفهم
الجدوى التسويقية | خطة التسويق وقنوات الوصول ؛ ميزانية التسويق ؛ معدلات التحويل المتوقعة
الجدوى المالية والتوقعات | قائمة الدخل المتوقعة ؛ التدفقات النقدية ؛ الميزانية التقديرية لـ 3–5 سنوات بسيناريوهات متعددة
تحليل المخاطر | مخاطر سوقية وتشغيلية وتشريعية وتمويلية ؛ إجراءات التخفيف
التوصية النهائية | ملخص تنفيذي واضح: هل يوصى بالاستثمار أم لا؟$q$, $q$Market & competition | Market size ; Customer segments ; Competitors
Marketing feasibility | Go-to-market ; Budget ; Expected conversion
Financial projections | Income statement ; Cash flows ; 3–5 year balance sheet with scenarios
Risk analysis | Market, operational, regulatory and funding risk ; Mitigation
Recommendation | A clear go / no-go executive summary$q$, $q$رواد الأعمال | تقليل المخاطر قبل بدء مشروع جديد
الشركات القائمة | فرع جديد أو خط إنتاج أو سوق جديد
المستثمرون | الدخول كشركاء أو ممولين
الشركات الناشئة | دراسة احترافية للبنوك والصناديق$q$, $q$Entrepreneurs | Lower risk before launch
Existing companies | New branch, line or market
Investors | Joining as partners or funders
Startups | A professional study for banks and funds$q$, $q$مكالمة استكشافية مجانية | فهم فكرة المشروع والأهداف والميزانية
عرض فني ومالي | نطاق الدراسة والمدة والتكلفة ثم الاتفاق
جمع البيانات | عن المشروع والسوق والمنافسين
إعداد الدراسة | المالية والتسويقية بسيناريوهات متعددة
عرض النتائج ومناقشتها | مع إمكانية تعديل الفرضيات$q$, $q$Free discovery call | Idea, goals and budget
Proposal | Scope, time and cost
Data collection | Project, market and competitors
Build the study | Financial and marketing, with scenarios
Present & discuss | With adjustable assumptions$q$, $q$دراسة سوق وتحليل منافسين
خطة تسويقية مبدئية
نموذج مالي لـ 3–5 سنوات
تحليل مخاطر وحساسية
ملخص تنفيذي وعرض تقديمي$q$, $q$Market and competitor study
Preliminary marketing plan
3–5 year financial model
Risk and sensitivity analysis
Executive summary and presentation$q$, $q$فهم السوق المصري | والبيئة التنظيمية ومتطلبات البنوك
تحليل مالي وتسويقي | خطة واقعية قابلة للتنفيذ
نماذج متقدمة | تحليل حساسية وسيناريوهات متعددة
عرض مناسب للإدارة | ملخص تنفيذي وعرض تقديمي$q$, $q$Local insight | Regulation and bank requirements
Finance + marketing | A realistic plan
Advanced models | Sensitivity and scenarios
Board-ready | Summary and presentation$q$, $q$كم تستغرق دراسة الجدوى؟ | تعتمد على حجم المشروع وتوافر البيانات، ونحدد المدة في العرض الفني.
هل الدراسة مقبولة لدى البنوك؟ | نعدّها بالشكل والتفاصيل التي تطلبها البنوك وجهات التمويل.$q$, $q$How long does a study take? | It depends on size and data; the proposal states the timeline.
Do banks accept it? | We prepare it in the format lenders require.$q$),
  ($q$company-incorporation$q$, 20, false, $q$/media/documents.webp$q$, $q$تأسيس الشركات$q$, $q$Company Incorporation$q$, $q$تأسيس الشركات بالشكل القانوني المناسب وإعداد مستندات التأسيس والتسجيل.$q$, $q$Setting up companies in the right legal form, with incorporation documents and registration.$q$, $q$تأسيس الشركات بالشكل القانوني المناسب وإعداد مستندات التأسيس والتسجيل.$q$, $q$Setting up companies in the right legal form, with incorporation documents and registration.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$financing-files$q$, 21, false, $q$/media/growth.webp$q$, $q$إدارة ملفات التمويل$q$, $q$Financing File Management$q$, $q$إعداد ملفات التمويل ومتابعتها مع البنوك وجهات التمويل.$q$, $q$Preparing financing files and following up with banks and lenders.$q$, $q$إعداد ملفات التمويل ومتابعتها مع البنوك وجهات التمويل.$q$, $q$Preparing financing files and following up with banks and lenders.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$strategic-planning$q$, 22, false, $q$/media/city.webp$q$, $q$إعداد الخطط الاستراتيجية$q$, $q$Strategic Planning$q$, $q$خطط استراتيجية واضحة بأهداف ومؤشرات قابلة للقياس.$q$, $q$Clear strategic plans with measurable goals and KPIs.$q$, $q$خطط استراتيجية واضحة بأهداف ومؤشرات قابلة للقياس.$q$, $q$Clear strategic plans with measurable goals and KPIs.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$mcdr-registration$q$, 23, false, $q$/media/market.webp$q$, $q$القيد بمصر للمقاصة$q$, $q$MCDR Registration$q$, $q$قيد الأوراق المالية لدى شركة مصر للمقاصة والإيداع والقيد المركزي.$q$, $q$Registering securities with Misr for Central Clearing, Depository & Registry.$q$, $q$قيد الأوراق المالية لدى شركة مصر للمقاصة والإيداع والقيد المركزي.$q$, $q$Registering securities with Misr for Central Clearing, Depository & Registry.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$nilex-sponsorship$q$, 24, false, $q$/media/bell.webp$q$, $q$الرعاية الرسمية لبورصة النيل$q$, $q$NILEX Sponsorship$q$, $q$رعاية الشركات الصغيرة والمتوسطة في بورصة النيل بصفتنا راعيًا معتمدًا.$q$, $q$Sponsoring SMEs on NILEX as an approved sponsor.$q$, $q$رعاية الشركات الصغيرة والمتوسطة في بورصة النيل بصفتنا راعيًا معتمدًا.$q$, $q$Sponsoring SMEs on NILEX as an approved sponsor.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$dual-listing$q$, 25, false, $q$/media/market.webp$q$, $q$القيد المزدوج$q$, $q$Dual Listing$q$, $q$قيد أسهم الشركة في أكثر من بورصة وفق القواعد المنظمة.$q$, $q$Listing a company’s shares on more than one exchange.$q$, $q$قيد أسهم الشركة في أكثر من بورصة وفق القواعد المنظمة.$q$, $q$Listing a company’s shares on more than one exchange.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$investment-opportunities$q$, 26, false, $q$/media/waves.webp$q$, $q$دراسة الفرص الاستثمارية$q$, $q$Investment Opportunity Studies$q$, $q$تحليل الفرص الاستثمارية وتقييم عوائدها ومخاطرها.$q$, $q$Analysing investment opportunities and their risk and return.$q$, $q$تحليل الفرص الاستثمارية وتقييم عوائدها ومخاطرها.$q$, $q$Analysing investment opportunities and their risk and return.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$corporate-demergers$q$, 27, false, $q$/media/blocks.webp$q$, $q$عمليات تقسيم الشركات$q$, $q$Corporate De-mergers$q$, $q$تقسيم الشركات إلى كيانات مستقلة مع الدراسات والإجراءات اللازمة.$q$, $q$Splitting companies into independent entities with the required studies.$q$, $q$تقسيم الشركات إلى كيانات مستقلة مع الدراسات والإجراءات اللازمة.$q$, $q$Splitting companies into independent entities with the required studies.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$economic-performance$q$, 28, false, $q$/media/growth.webp$q$, $q$إجراءات الأداء الاقتصادي$q$, $q$Economic Performance$q$, $q$قياس وتحسين الأداء الاقتصادي للشركات بمؤشرات واضحة.$q$, $q$Measuring and improving economic performance with clear indicators.$q$, $q$قياس وتحسين الأداء الاقتصادي للشركات بمؤشرات واضحة.$q$, $q$Measuring and improving economic performance with clear indicators.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ($q$procedural-restructuring$q$, 29, false, $q$/media/documents.webp$q$, $q$الهيكلة الإجرائية$q$, $q$Procedural Restructuring$q$, $q$إعادة تصميم الإجراءات ودورات العمل لرفع الكفاءة.$q$, $q$Redesigning procedures and workflows for efficiency.$q$, $q$إعادة تصميم الإجراءات ودورات العمل لرفع الكفاءة.$q$, $q$Redesigning procedures and workflows for efficiency.$q$, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
) as v(slug, sort_order, featured, image_url, title_ar, title_en, short_ar, short_en, intro_ar, intro_en, def_title_ar, def_title_en, def_lead_ar, def_lead_en, def_cards_ar, def_cards_en, framework_ar, framework_en, importance_ar, importance_en, pillars_ar, pillars_en, usecases_ar, usecases_en, steps_ar, steps_en, outputs_ar, outputs_en, why_ar, why_en, faq_ar, faq_en)
where not exists (select 1 from public.services);

insert into public.board (name_ar, name_en, role_ar, role_en, photo_url, sort_order)
select * from (values
  ($q$أسماء محمد عبد الوهاب$q$, $q$Asmaa Mohamed Abdelwahab$q$, $q$رئيس مجلس الإدارة$q$, $q$Chairperson$q$, $q$/team/asmaa-abdelwahab.jpg$q$, 1),
  ($q$هاجر محمد عبد الوهاب$q$, $q$Hagar Mohamed Abdelwahab$q$, $q$العضو المنتدب$q$, $q$Managing Director$q$, $q$/team/hagar-abdelwahab.jpg$q$, 2),
  ($q$أحمد إبراهيم الحلواني$q$, $q$Ahmed Ibrahim Elhelwany$q$, $q$عضو مجلس إدارة$q$, $q$Board Member$q$, $q$/team/ahmed-elhelwany.jpg$q$, 3),
  ($q$ناصر مباشر$q$, $q$Nasser Mobasher$q$, $q$عضو مجلس إدارة$q$, $q$Board Member$q$, $q$/team/nasser-mobasher.jpg$q$, 4),
  ($q$محمد عيسى$q$, $q$Mohamed Eissa$q$, $q$عضو مجلس إدارة$q$, $q$Board Member$q$, null, 5),
  ($q$عمرو فوزي$q$, $q$Amr Fawzy$q$, $q$عضو مجلس إدارة$q$, $q$Board Member$q$, null, 6),
  ($q$مجدي عبد الكريم$q$, $q$Magdy Abdelkarim$q$, $q$عضو مجلس إدارة$q$, $q$Board Member$q$, null, 7)
) as v(name_ar, name_en, role_ar, role_en, photo_url, sort_order)
where not exists (select 1 from public.board);

insert into public.clients (name_ar, category, sort_order)
select * from (values
  ($q$مجموعة الخرافي · ماك القابضة$q$, $q$holding$q$, 1),
  ($q$مجموعة لكح جروب القابضة$q$, $q$holding$q$, 2),
  ($q$القابضة للصناعات الكيماوية$q$, $q$holding$q$, 3),
  ($q$القابضة للصناعات المعدنية$q$, $q$holding$q$, 4),
  ($q$مستشفى النزهة الدولي$q$, $q$listed$q$, 5),
  ($q$شمال الصعيد (نيو داب)$q$, $q$listed$q$, 6),
  ($q$العربية لإدارة وتطوير الأصول$q$, $q$listed$q$, 7),
  ($q$سيتي لاب للتحاليل الطبية$q$, $q$listed$q$, 8),
  ($q$المصرية لنظم التعليم الحديث$q$, $q$listed$q$, 9),
  ($q$جينيال تورز$q$, $q$listed$q$, 10),
  ($q$تصنيع الأقلام والبلاستيك$q$, $q$listed$q$, 11),
  ($q$المجموعة المتكاملة للأعمال الهندسية$q$, $q$listed$q$, 12),
  ($q$المصريون للاستثمار والتنمية$q$, $q$listed$q$, 13),
  ($q$المشروعات الصناعية والهندسية$q$, $q$listed$q$, 14),
  ($q$الأولى للاستثمار والتنمية العقارية$q$, $q$listed$q$, 15),
  ($q$المؤشر للبرمجيات$q$, $q$listed$q$, 16),
  ($q$العبور للاستثمار العقاري$q$, $q$listed$q$, 17),
  ($q$العامة لمنتجات الخزف · شيني$q$, $q$listed$q$, 18),
  ($q$ابن سينا فارما$q$, $q$listed$q$, 19),
  ($q$الكابلات الكهربائية المصرية$q$, $q$listed$q$, 20),
  ($q$أكرو مصر للشدات والسقالات$q$, $q$listed$q$, 21),
  ($q$البدر للبلاستيك$q$, $q$listed$q$, 22),
  ($q$الرازي للأدوية$q$, $q$prior$q$, 23),
  ($q$الإسكندرية للأسمدة$q$, $q$prior$q$, 24),
  ($q$الشروق الحديثة للطباعة والتغليف$q$, $q$prior$q$, 25),
  ($q$سوهاج القابضة$q$, $q$prior$q$, 26),
  ($q$ليبتس مصر$q$, $q$prior$q$, 27),
  ($q$كايرو سكان$q$, $q$prior$q$, 28),
  ($q$جولدن كوست للسخنة للاستثمار السياحي$q$, $q$prior$q$, 29),
  ($q$النيل للوساطة التأمينية$q$, $q$prior$q$, 30),
  ($q$سكاي لايت$q$, $q$prior$q$, 31),
  ($q$سفيريكو$q$, $q$prior$q$, 32),
  ($q$المجموعة المتحدة للمستلزمات الطبية$q$, $q$prior$q$, 33),
  ($q$يونيفرت للصناعات الغذائية$q$, $q$prior$q$, 34),
  ($q$فاشون بوينت$q$, $q$prior$q$, 35),
  ($q$فليكس برينت$q$, $q$prior$q$, 36),
  ($q$الوطنية لصناعة الميلامين واليوريا فورمالدهيد$q$, $q$prior$q$, 37),
  ($q$هيلكو ميتلز$q$, $q$prior$q$, 38),
  ($q$إيجي سويس فود$q$, $q$prior$q$, 39),
  ($q$المصرية للصناعات الغذائية والتبريد$q$, $q$prior$q$, 40),
  ($q$جنّات للإنتاج الحيواني$q$, $q$prior$q$, 41),
  ($q$توب إنترناشيونال للاستثمار العقاري$q$, $q$prior$q$, 42),
  ($q$ويندسور للتجارة وتصنيع الورق$q$, $q$prior$q$, 43),
  ($q$جنّات للأعلاف الحديثة$q$, $q$prior$q$, 44),
  ($q$يونيبكس للصناعات الغذائية$q$, $q$prior$q$, 45),
  ($q$المصرية للاستثمار والمجازر$q$, $q$prior$q$, 46),
  ($q$في آي بي$q$, $q$prior$q$, 47),
  ($q$المرام لاند مارك$q$, $q$prior$q$, 48),
  ($q$المركز الدولي للمشروعات والتنمية$q$, $q$prior$q$, 49),
  ($q$الإسكندرية للتجارة والصناعة$q$, $q$prior$q$, 50),
  ($q$لوجيكس ستون$q$, $q$prior$q$, 51),
  ($q$دوفيل البحر الأحمر للقرى السياحية$q$, $q$prior$q$, 52),
  ($q$أرت فارما$q$, $q$prior$q$, 53),
  ($q$النيل المصري للنقل الجماعي$q$, $q$prior$q$, 54),
  ($q$الجيزة للأنظمة$q$, $q$prior$q$, 55),
  ($q$لندن كلينك$q$, $q$prior$q$, 56),
  ($q$نيو ألفا$q$, $q$prior$q$, 57),
  ($q$تاج سينا$q$, $q$prior$q$, 58),
  ($q$زيتا للاستثمار والتجارة$q$, $q$prior$q$, 59),
  ($q$بورسعيد للسكر$q$, $q$prior$q$, 60),
  ($q$بيست للتنمية العقارية$q$, $q$prior$q$, 61),
  ($q$إنفست للتنمية العقارية$q$, $q$prior$q$, 62),
  ($q$أيه بي سبورت للاستشارات$q$, $q$prior$q$, 63),
  ($q$جلوبترونكس للإلكترونيات$q$, $q$prior$q$, 64),
  ($q$الهندسية لصناعة الألومنيوم$q$, $q$prior$q$, 65),
  ($q$العالمية للاستثمار والتنمية$q$, $q$prior$q$, 66),
  ($q$أوريون للتجارة والاستشارات$q$, $q$prior$q$, 67),
  ($q$البركة إنترناشيونال$q$, $q$prior$q$, 68),
  ($q$إنتركايرو لصناعة الألومنيوم$q$, $q$prior$q$, 69),
  ($q$زيرفون مصر$q$, $q$prior$q$, 70),
  ($q$المنى للتنمية الزراعية$q$, $q$prior$q$, 71),
  ($q$العرب للأسمدة والكيماويات$q$, $q$prior$q$, 72),
  ($q$ماج للصناعات الغذائية$q$, $q$prior$q$, 73),
  ($q$الرائدة للإنشاءات$q$, $q$prior$q$, 74),
  ($q$مراكز القاهرة التشخيصية$q$, $q$prior$q$, 75),
  ($q$السراج للتشييد والبناء$q$, $q$prior$q$, 76),
  ($q$إدارة المراكز الطبية$q$, $q$prior$q$, 77),
  ($q$الأهرام للوسائط المتعددة$q$, $q$prior$q$, 78),
  ($q$فيرولاند للتنمية السياحية$q$, $q$prior$q$, 79),
  ($q$أميتريد للتجارة والمقاولات$q$, $q$prior$q$, 80),
  ($q$الصناعات الاستهلاكية$q$, $q$prior$q$, 81),
  ($q$كويست كونسلت$q$, $q$prior$q$, 82),
  ($q$مصر للتأمين$q$, $q$prior$q$, 83),
  ($q$بونا للصناعة والتجارة$q$, $q$prior$q$, 84),
  ($q$سوهاج للتنمية والاستثمار$q$, $q$prior$q$, 85),
  ($q$مصر بلتون$q$, $q$prior$q$, 86),
  ($q$النقل المباشر$q$, $q$prior$q$, 87),
  ($q$أعمال النقل$q$, $q$prior$q$, 88),
  ($q$النيل للنقل الثقيل$q$, $q$prior$q$, 89),
  ($q$النيل للنقل البري$q$, $q$prior$q$, 90),
  ($q$نجع حمادي للفايبر بورد$q$, $q$prior$q$, 91),
  ($q$النيل لنقل البضائع$q$, $q$prior$q$, 92),
  ($q$مصر للتبريدات والتخزين$q$, $q$prior$q$, 93),
  ($q$العاشر من رمضان للإنشاءات$q$, $q$prior$q$, 94),
  ($q$فندق طابا الأول$q$, $q$prior$q$, 95),
  ($q$الوطنية لإنتاج البذور$q$, $q$prior$q$, 96),
  ($q$المصرية للتأمين · حياة$q$, $q$prior$q$, 97),
  ($q$العربية لمدينة الإنتاج الإعلامي$q$, $q$prior$q$, 98),
  ($q$المصرية للتأمين · ممتلكات$q$, $q$prior$q$, 99),
  ($q$أكمي لإنتاج سنون الإبر$q$, $q$prior$q$, 100),
  ($q$التشخيص المتميز · مصر$q$, $q$prior$q$, 101),
  ($q$النهضة للصناعات$q$, $q$prior$q$, 102),
  ($q$ماك الأهرام$q$, $q$prior$q$, 103),
  ($q$كونتيننتال للتنمية السياحية$q$, $q$prior$q$, 104),
  ($q$بتروجرافيكس$q$, $q$prior$q$, 105),
  ($q$شمال أفريقيا$q$, $q$prior$q$, 106),
  ($q$المجموعة المتكاملة الهندسية$q$, $q$prior$q$, 107),
  ($q$جنة العنود للتنمية والاستثمار الزراعي$q$, $q$prior$q$, 108),
  ($q$ابن سينا للعلاج والخدمات الطبية$q$, $q$prior$q$, 109),
  ($q$نيوداب الوادي للتجارة والتوريدات$q$, $q$prior$q$, 110),
  ($q$باكت للاستثمار والتطوير العقاري$q$, $q$prior$q$, 111),
  ($q$آي فيجن للتجارة وإدارة المشروعات$q$, $q$prior$q$, 112),
  ($q$بتروتريتمنت للخدمات البترولية$q$, $q$prior$q$, 113),
  ($q$المعمّرون العرب للاستثمار العقاري$q$, $q$prior$q$, 114),
  ($q$بوابة الشرق (شركة كويتية)$q$, $q$prior$q$, 115),
  ($q$سيتي تريد لتداول الأوراق المالية$q$, $q$prior$q$, 116),
  ($q$رؤية بلازا للاستثمار العقاري$q$, $q$prior$q$, 117),
  ($q$العربية للصناعات التكنولوجية تكنوفالي$q$, $q$prior$q$, 118),
  ($q$إم في سي للتوكيلات التجارية$q$, $q$prior$q$, 119),
  ($q$المصرية لبلوكات الأنود الكربونية$q$, $q$prior$q$, 120),
  ($q$مصر أبو ظبي للاستشارات العقارية$q$, $q$prior$q$, 121),
  ($q$المصرية الصينية المشتركة$q$, $q$prior$q$, 122),
  ($q$ماسبيرو للتنمية العمرانية$q$, $q$prior$q$, 123),
  ($q$ركائز هليوبوليس الجديدة العقارية$q$, $q$prior$q$, 124),
  ($q$العرفة للتنمية والاستثمار$q$, $q$prior$q$, 125),
  ($q$المنيا الجديدة$q$, $q$prior$q$, 126),
  ($q$مواصلات مصر$q$, $q$prior$q$, 127),
  ($q$فلوريل للصناعات الغذائية$q$, $q$prior$q$, 128),
  ($q$الهبة للنقل الجماعي$q$, $q$prior$q$, 129),
  ($q$القاهرة للنقل الجماعي$q$, $q$prior$q$, 130),
  ($q$أعمل بزنس$q$, $q$prior$q$, 131),
  ($q$مسار للاستثمارات اللوجستية$q$, $q$prior$q$, 132),
  ($q$ثقة لإدارة الأعمال والتنمية$q$, $q$prior$q$, 133),
  ($q$مستشفى الصفوة الجديدة التخصصي$q$, $q$prior$q$, 134),
  ($q$وادي دجلة للتنمية العقارية$q$, $q$prior$q$, 135),
  ($q$كندا تراست للرعاية$q$, $q$prior$q$, 136),
  ($q$فوري دهب للخدمات الإلكترونية$q$, $q$prior$q$, 137),
  ($q$فاريانس العالمية للتدريب والتطوير$q$, $q$prior$q$, 138),
  ($q$إيماك مرسى علم للتنمية السياحية والاستثمار$q$, $q$emak$q$, 139),
  ($q$إيماك للفنادق والتنمية السياحية · فندق مارينا لودج$q$, $q$emak$q$, 140),
  ($q$مرسى علم للمشروعات السياحية$q$, $q$emak$q$, 141),
  ($q$ماك للطيران$q$, $q$emak$q$, 142),
  ($q$مرسى علم لخدمات الطيران (إيماس)$q$, $q$emak$q$, 143),
  ($q$إيماك للتنمية السياحية والعقارية$q$, $q$emak$q$, 144),
  ($q$إيماك للتنمية العقارية$q$, $q$emak$q$, 145),
  ($q$ماك القابضة للاستثمار$q$, $q$emak$q$, 146),
  ($q$إيماك للمرافق والخدمات$q$, $q$emak$q$, 147),
  ($q$فلورا للتنمية الزراعية$q$, $q$emak$q$, 148),
  ($q$كلوب رأس سوما$q$, $q$emak$q$, 149),
  ($q$بورت غالب للتأجير التمويلي$q$, $q$emak$q$, 150),
  ($q$المصرية للاستثمار$q$, $q$emak$q$, 151),
  ($q$خدمات التسويق المتكاملة$q$, $q$emak$q$, 152),
  ($q$سوما باي$q$, $q$emak$q$, 153),
  ($q$إيماك مرسى علم لتشغيل وإدارة المطارات$q$, $q$emak$q$, 154),
  ($q$بورت غالب ريزورت$q$, $q$emak$q$, 155),
  ($q$الإسكندرية للمنتجات البترولية المتخصصة (ASPEC)$q$, $q$international$q$, 156),
  ($q$كيور إن تور للخدمات والرعاية الطبية$q$, $q$international$q$, 157),
  ($q$مصر للاستثمار والتنمية العمرانية$q$, $q$international$q$, 158),
  ($q$مصر للتأمين التكافلي · ممتلكات ومسؤوليات$q$, $q$international$q$, 159),
  ($q$فيد لاين لتجارة الأدوية البيطرية$q$, $q$international$q$, 160),
  ($q$بروكر فالي للوساطة التجارية والاستشارية$q$, $q$international$q$, 161),
  ($q$أفرولاند لاستصلاح الأراضي والاستثمار الزراعي$q$, $q$international$q$, 162),
  ($q$ميد يوتا فارما (سيو تيكالز)$q$, $q$international$q$, 163),
  ($q$بون فارما للمستحضرات الطبية$q$, $q$international$q$, 164),
  ($q$أفرولاند لاستصلاح الأراضي والإنتاج الحيواني$q$, $q$international$q$, 165),
  ($q$العربية الفندقية لمدينة الإنتاج الإعلامي$q$, $q$international$q$, 166),
  ($q$الديبيكي للصناعات الدوائية (الديبيكي فارما)$q$, $q$international$q$, 167),
  ($q$إنتلجنت واي كابيتال للاستشارات والترويج$q$, $q$international$q$, 168),
  ($q$البركة إنترناشونال لتصنيع وتعبئة المواد الغذائية$q$, $q$international$q$, 169),
  ($q$Premium Diagnostics LLC · الشارقة، الإمارات$q$, $q$international$q$, 170),
  ($q$زاد آند ستريال للأدوية$q$, $q$international$q$, 171),
  ($q$التشخيص المتميز · المملكة العربية السعودية$q$, $q$international$q$, 172),
  ($q$قمة المشرق الطبية · جدة، السعودية$q$, $q$international$q$, 173),
  ($q$سكلفي (مهارتي للتدريب المهني)$q$, $q$international$q$, 174),
  ($q$استشر$q$, $q$international$q$, 175),
  ($q$كي آند بي للخدمات الهندسية$q$, $q$international$q$, 176),
  ($q$فلوريل للمطاعم والكافيهات$q$, $q$international$q$, 177),
  ($q$معامل حساب للتحاليل الطبية$q$, $q$international$q$, 178),
  ($q$معامل تاون لاب للتحاليل الطبية$q$, $q$international$q$, 179),
  ($q$اعمل بيزنس ميديكال$q$, $q$international$q$, 180),
  ($q$اعمل أوردر$q$, $q$international$q$, 181),
  ($q$خبيرات للاستشارات المالية$q$, $q$international$q$, 182),
  ($q$الرائد لتكنولوجيا المعلومات$q$, $q$international$q$, 183),
  ($q$جي بي إس للتدريب$q$, $q$international$q$, 184),
  ($q$العيادة$q$, $q$international$q$, 185),
  ($q$هيلث آند تيستي للأغذية والمشروبات$q$, $q$international$q$, 186),
  ($q$هيلث دايت للأغذية والمشروبات$q$, $q$international$q$, 187),
  ($q$المؤشر للاستثمار والتطوير العقاري$q$, $q$international$q$, 188),
  ($q$كيبون وجوي للأحذية الرياضية$q$, $q$international$q$, 189),
  ($q$كالف كونستركشن للمشروعات الهندسية المتكاملة$q$, $q$international$q$, 190),
  ($q$مستشفى تبارك · القاهرة الجديدة$q$, $q$international$q$, 191)
) as v(name_ar, category, sort_order)
where not exists (select 1 from public.clients);

insert into public.posts (slug, category_ar, category_en, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en, image_url, published_at, sort_order)
select * from (values
  ($q$what-is-fair-value$q$, $q$مقال$q$, $q$Article$q$, $q$ما هي القيمة العادلة ولماذا تحتاجها شركتك؟$q$, $q$What is fair value, and why does your company need it?$q$, $q$شرح مبسط لمعيار IFRS 13 وهرمية القيمة العادلة، ومتى يصبح تقرير القيمة العادلة ضرورة لشركتك.$q$, $q$A simple guide to IFRS 13, the fair value hierarchy, and when a fair value report becomes essential.$q$, $q$يعرّف معيار IFRS 13 القيمة العادلة بأنها السعر الذي يمكن الحصول عليه عند بيع أصل أو دفعه لنقل التزام في معاملة منظمة بين أطراف السوق في تاريخ القياس.

يعتمد القياس على هرمية من ثلاثة مستويات: أسعار معلنة في أسواق نشطة (المستوى الأول)، ومدخلات أخرى قابلة للملاحظة (المستوى الثاني)، ومدخلات غير قابلة للملاحظة تعتمد على افتراضات (المستوى الثالث). وكلما زاد الاعتماد على البيانات السوقية الفعلية زادت موثوقية التقييم.

تحتاج الشركة عادة إلى تقرير قيمة عادلة عند إعداد قوائم مالية تتطلب ذلك، أو عند القيد والطرح في البورصة، أو في صفقات الاستحواذ والاندماج، أو عند إدخال مستثمرين جدد وإعادة الهيكلة.

في ركويزا نعد تقارير القيمة العادلة وفق IFRS 13 ومتطلبات الهيئة العامة للرقابة المالية، ونرافق العميل حتى اعتماد التقرير.$q$, $q$IFRS 13 defines fair value as the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.

Measurement follows a three-level hierarchy: quoted prices in active markets (Level 1), other observable inputs (Level 2) and unobservable inputs based on assumptions (Level 3). The more a valuation relies on actual market data, the more reliable it is.

Companies typically need a fair value report for certain financial statements, listing and IPOs, M&A, bringing in investors and restructuring.

At Riqueza we prepare fair value reports under IFRS 13 and FRA requirements and support the client until approval.$q$, $q$/media/balance.webp$q$, '2026-11-01'::date, 1),
  ($q$main-market-vs-nilex$q$, $q$دليل$q$, $q$Guide$q$, $q$السوق الرئيسي أم النيلكس؟ كيف تختار سوق القيد المناسب$q$, $q$Main market or NILEX? Choosing where to list$q$, $q$مقارنة سريعة بين السوق الرئيسي وسوق النيلكس للشركات الصغيرة والمتوسطة، ومتى يناسب كل منهما شركتك.$q$, $q$A quick comparison of the EGX main market and NILEX for SMEs, and when each fits.$q$, $q$يوفر السوق الرئيسي بالبورصة المصرية بيئة للشركات الكبيرة ذات رأس المال والسيولة الأعلى، مع متطلبات إفصاح وحوكمة أوسع ونسبة أعلى من الأسهم حرة التداول.

أما سوق النيلكس فمخصص للشركات الصغيرة والمتوسطة بمتطلبات رأس مال وإفصاح أخف، وبإشراف راعٍ معتمد طوال فترة القيد، ويمثل مسارًا تدريجيًا للانتقال لاحقًا إلى السوق الرئيسي.

يعتمد الاختيار على حجم الشركة وهيكل ملكيتها وجاهزيتها المحاسبية والحوكمية وأهدافها التمويلية. ولهذا نبدأ مع كل عميل بدراسة جاهزية تحدد الفجوات والسوق الأنسب.

ركويزا راعٍ رسمي معتمد لدى البورصة المصرية ومسجلة بسجل رعاة الشركات الصغيرة والمتوسطة.$q$, $q$The EGX main market serves larger companies with higher capital and liquidity, with broader disclosure and governance requirements and a higher free float.

NILEX is designed for SMEs, with lighter capital and disclosure requirements and supervision by an approved sponsor throughout the listing—a gradual path to the main market.

The right choice depends on size, ownership structure, accounting and governance readiness and funding goals. That is why every engagement starts with a readiness study.

Riqueza is an official EGX sponsor registered for SMEs.$q$, $q$/media/bell.webp$q$, '2026-10-20'::date, 2),
  ($q$governance-for-family-business$q$, $q$مقال$q$, $q$Article$q$, $q$الحوكمة للشركات العائلية: خطوة نحو الاستدامة$q$, $q$Governance for family businesses: a step toward sustainability$q$, $q$لماذا تحتاج الشركات العائلية إلى إطار حوكمة واضح قبل التوسع أو دخول مستثمرين جدد.$q$, $q$Why family businesses need a clear governance framework before expanding or bringing in investors.$q$, $q$تنمو كثير من الشركات العائلية بقرارات سريعة ومركزية، لكن مع التوسع تظهر الحاجة إلى قواعد واضحة تنظم العلاقة بين الملاك ومجلس الإدارة والإدارة التنفيذية.

يساعد إطار الحوكمة على الفصل بين الملكية والإدارة، وتحديد الأدوار والمسؤوليات، وتنظيم تضارب المصالح، وتحسين جودة الإفصاح والتقارير المالية.

وتزداد أهمية الحوكمة عند الاستعداد للقيد في البورصة أو دخول مستثمر استراتيجي، إذ تُعد من أول ما يقيّمه المستثمرون والجهات الممولة.

نبدأ في ركويزا بتقييم مستوى الحوكمة الحالي وتحليل الفجوات، ثم نصمم الإطار والسياسات المناسبة وندعم التطبيق والمتابعة.$q$, $q$Many family businesses grow through fast, centralised decisions. As they expand, they need clear rules for the relationship between owners, the board and management.

A governance framework separates ownership from management, defines roles, manages conflicts of interest and improves disclosure and reporting.

It matters even more before listing or bringing in a strategic investor, as it is one of the first things investors and lenders assess.

At Riqueza we start with a governance assessment and gap analysis, then design the framework and policies and support implementation.$q$, $q$/media/pillars.webp$q$, '2026-10-05'::date, 3)
) as v(slug, category_ar, category_en, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en, image_url, published_at, sort_order)
where not exists (select 1 from public.posts);

-- مكتبة ركويزا: الملف التعريفي كبداية
insert into public.library (title_ar, title_en, description_ar, description_en, category, file_url, cover_url, pages, published_at, sort_order)
select 'الملف التعريفي لركويزا 2026', 'Riqueza Company Profile 2026', 'نبذة شاملة عن ركويزا وخدماتها وتراخيصها وسابقة أعمالها.', 'A complete overview of Riqueza, its services, licenses and track record.', 'profile', '/library/riqueza-company-profile-2026.pdf', '/media/building.webp', null, '2026-01-01', 1
where not exists (select 1 from public.library);

-- ============================================================
--  آخر خطوة: بعد ما تعملي يوزر من Authentication، شغّلي السطر ده بإيميلك
-- ============================================================

-- insert into public.admin_users (user_id) select id from auth.users where lower(email) = lower('YOUR-EMAIL@example.com');
