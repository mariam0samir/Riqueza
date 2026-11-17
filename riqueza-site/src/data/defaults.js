// المحتوى الافتراضي للموقع — نفس اللي بيتحط في قاعدة البيانات أول مرة.
// لو Supabase مش متوصل أو الجدول فاضي، الموقع بيعرض المحتوى ده.
import { SERVICES } from './services';

export const BLOCKS = {
  hero: {
    video_url: '/media/hero.mp4', poster_url: '/media/hero-poster.jpg', videos: '',
    slides_ar: 'نضيء لك الطريق | شريكك في القرار المالي منذ 2009 — مرخّصة من الهيئة العامة للرقابة المالية وراعٍ معتمد لدى البورصة المصرية.\nمن الفكرة إلى البورصة | نرافق شركتك من دراسة الجدوى والتقييم والهيكلة حتى القيد والطرح وبدء التداول.\nأرقام تصنع الثقة | تقارير قيمة عادلة وتقييمات معتمدة وفق IFRS 13 ومعايير التقييم الدولية.',
    slides_en: 'Lighting your way | Your partner in financial decisions since 2009 — FRA-licensed and an approved EGX sponsor.\nFrom idea to the exchange | We guide your company from feasibility, valuation and restructuring to listing and first trade.\nNumbers that build trust | Certified fair value reports and valuations under IFRS 13 and international standards.',
    cta_ar: 'احجز استشارة مجانية', cta_en: 'Book a free consultation',
  },
  intro: {
    eyebrow_ar: 'عن ركويزا', eyebrow_en: 'About Riqueza',
    title_ar: 'خبرة تمتد لأكثر من 18 عامًا في الأسواق المالية المصرية', title_en: 'More than 18 years in Egypt’s financial markets',
    text_ar: 'ركويزا للاستشارات المالية عن الأوراق المالية شركة رائدة ومتخصصة في تقديم الخدمات الاستشارية المالية، تعمل بموجب ترخيص رقم (521) بتاريخ 30/04/2009 من الهيئة العامة للرقابة المالية، ومقيدة بسجل المستشارين الماليين المستقلين تحت رقم (1732).\n\nنتعامل مع كافة الشركات التي ترغب في الاستشارات المالية بكافة أنواعها، ونعمل بصفة رئيسية مع الهيئة العامة للرقابة المالية والبورصة المصرية والهيئة العامة للاستثمار وشركة مصر للمقاصة والإيداع والقيد المركزي.',
    text_en: 'Riqueza for Financial Consultancy on Securities is a specialised advisory firm operating under FRA licence no. 521 (30/04/2009) and registered as an independent financial advisor under no. 1732.\n\nWe work with companies of every kind, and deal mainly with the Financial Regulatory Authority, the Egyptian Exchange, the General Authority for Investment and Misr for Central Clearing, Depository & Registry.',
    image_url: '/media/city.webp', image2_url: '/media/people.webp',
    statement_ar: 'منذ 2009 نرافق الشركات المصرية من دراسة الجدوى والتقييم حتى القيد في البورصة، بخبرة تمنح كل قرار مالي وضوحًا وثقة.',
    statement_en: 'Since 2009 we have guided Egyptian companies from feasibility and valuation all the way to the stock exchange, bringing clarity and confidence to every financial decision.',
  },
  stats: {
    items_ar: '18 | + | سنة من الخبرة\n200 | + | شركة محلية ودولية\n750 | + | استشارة مالية\n192 | | عميل في سابقة أعمالنا',
    items_en: '18 | + | Years of experience\n200 | + | Local & international clients\n750 | + | Financial consultations\n192 | | Clients in our track record',
  },
  chairman: {
    name_ar: 'أسماء محمد عبد الوهاب', name_en: 'Asmaa Mohamed Abdelwahab',
    role_ar: 'رئيس مجلس الإدارة', role_en: 'Chairperson',
    photo_url: '/team/asmaa-abdelwahab.jpg',
    quote_ar: 'نتطلع ليس إلى التوسع محليًا وإقليميًا فحسب، بل إلى العالمية بكل المستويات نظامًا وإدارة وانتشارًا.',
    quote_en: 'We look beyond local and regional growth—to a global presence in systems, management and reach.',
    text_ar: 'يسعدني أن أرحب بكم في شركتكم ركويزا للاستشارات المالية عن الأوراق المالية، وأن أشكركم عملاء وزملاء على الدعم والمساندة والمشاركة التي أوصلتنا إلى ما حققناه من نجاحات على مدار أكثر من 15 عامًا.\n\nنحن على يقين تام بأن العالم يشهد تغيرًا سريعًا في مختلف المجالات، ولتطوير حاضرنا لا بد من أن نضع رؤية واضحة لمستقبلنا قائمة على أسس صلبة تطبق أحدث النظم المالية والإدارية، متطلعين ليس إلى التوسع محليًا وإقليميًا فحسب، بل نتطلع إلى العالمية بكل المستويات نظامًا وإدارة وانتشارًا، واضعين نصب أعيننا القيم والمبادئ التي نشأنا عليها ونشأت أسرة ركويزا عليها.\n\nونعد عملاءنا من هذا المنطلق بتوظيف كافة إمكانياتنا، وتوفير فريق العمل المناسب للتنفيذ، واستثمار معرفتنا وخبراتنا وتجاربنا وعلاقاتنا، والتعامل بشفافية ومهنية واحترام؛ لنكون الاختيار الأول لعملائنا، ولنشكل معًا شراكات على أساس من الثقة المتبادلة والنزاهة وعلاقات وطيدة طويلة الأمد.',
    text_en: 'It is my pleasure to welcome you to Riqueza for Financial Consultancy on Securities, and to thank our clients and colleagues for the support and partnership that brought us the successes of more than 15 years.\n\nThe world is changing fast in every field. To develop our present we need a clear vision for the future, built on solid foundations and the latest financial and administrative systems—looking not only to local and regional expansion, but to a global presence in systems, management and reach, while holding on to the values on which the Riqueza family was built.\n\nWe promise our clients to put all our capabilities to work, to provide the right team, and to invest our knowledge, experience and relationships with transparency, professionalism and respect—so that we remain our clients’ first choice and build partnerships founded on mutual trust, integrity and long-term relationships.',
  },
  values: {
    items_ar: 'المصداقية | نقل الصورة بوضوح بعد فحص ودراسة ملف العميل بدقة لمساعدته على اتخاذ القرارات السليمة.\nجدية العمل | تنفيذ نطاق الأعمال المتفق عليها باهتمام ورعاية مع الالتزام بالمواعيد.\nالحرفية | اتباع المعايير والأساليب الفنية والمهنية وبذل عناية الرجل الحريص في تنفيذ كافة الأعمال.\nالخصوصية | الالتزام بسياسة الخصوصية فيما يتعلق بتعاملات عملائنا والخدمات التي نقدمها لهم والمستندات الخاصة بهم.',
    items_en: 'Credibility | Presenting a clear picture after carefully studying each client’s file, to support sound decisions.\nDiligence | Delivering the agreed scope with care and on time.\nProfessionalism | Following technical and professional standards with the care of a prudent person.\nConfidentiality | Protecting our clients’ dealings, services and documents.',
  },
  goals: {
    items_ar: 'أن نكون دائمًا الاختيار الأول في تقديم الاستشارات المالية للعملاء.\nأن نحقق نجاحات متتالية مع عملائنا ونصبح شريك نجاح فعّال بعلاقة قوية وطيدة الأمد.\nتقديم خدماتنا لكافة قطاعات الاستثمار المتنوعة.\nأن نضيء الطريق لأكبر قدر من العملاء حتى يتسنى لهم الانطلاق وتحقيق أهدافهم، ومن ثَمَّ ينمو الاقتصاد الوطني.\nزيادة وعي العملاء بأدوات سوق المال وكيفية تسخيرها لصالح استثماراتهم.\nزيادة عدد الشركات المقيدة بالبورصة لتوسيع هيكل الملكية وتوفير رأس المال المطلوب للتوسع وزيادة الإنتاج، ومن ثَمَّ زيادة فرص العمل وانخفاض الاستيراد وزيادة التصدير.',
    items_en: 'To always be the first choice for financial advisory.\nTo achieve continuous success with our clients and be an effective, long-term partner.\nTo serve every investment sector.\nTo light the way for as many clients as possible to reach their goals—and grow the national economy.\nTo raise clients’ awareness of capital market tools and how to use them.\nTo increase the number of listed companies—broadening ownership, funding expansion and production, creating jobs, reducing imports and boosting exports.',
  },
  why: {
    items_ar: 'خبرة عميقة | خبرة تمتد لأكثر من 15 سنة في السوق المصري.\nنخبة من المستشارين | مستشارون من ذوي الخبرات العالمية والعلمية والعملية.\nقيادة متمرّسة | مجلس إدارة من رجال وسيدات أعمال شغلوا وظائف مرموقة في القطاع الخاص ولديهم خبرة استشارية متميزة.\nقاعدة عملاء راسخة | قاعدة مختارة ومتميزة من العملاء تربطها بنا علاقات طويلة الأمد مبنية على المهنية والثقة المتبادلة.\nمرونة وأفق واسع | المرونة والأفق الواسع لمواكبة المتغيرات المحلية والدولية في إنجاز الأعمال والتواصل مع العملاء.',
    items_en: 'Deep experience | More than 15 years in the Egyptian market.\nExpert advisors | Consultants with international, academic and practical experience.\nSeasoned leadership | A board of business leaders with senior private-sector and advisory backgrounds.\nTrusted clientele | Long-term relationships built on professionalism and mutual trust.\nAgility | The flexibility to keep pace with local and global change.',
    image_url: '/media/growth.webp',
  },
  licenses: {
    items_ar: '521 | ترخيص مزاولة النشاط | ترخيص رقم (521) بتاريخ 30/04/2009 لمزاولة نشاط الاستشارات المالية عن الأوراق المالية من الهيئة العامة للرقابة المالية.\n1732 | سجل المستشارين الماليين المستقلين | قُيّدت الشركة بسجل المستشارين الماليين المستقلين بالهيئة العامة للرقابة المالية تحت رقم (1732) بتاريخ 31/08/2009.\nG50004 | مركز تحديث الصناعة | قُيّدت الشركة بمركز تحديث الصناعة في يوليو 2009 كمقدم خدمات بكود رقم G50004.\n26 | راعٍ رسمي معتمد بالبورصة | راعٍ رسمي معتمد بقرار مجلس إدارة البورصة المصرية بجلسته رقم (1) لسنة 2014، ومسجلة بسجل الرعاة المعتمدين للشركات الصغيرة والمتوسطة تحت رقم (26).',
    items_en: '521 | FRA licence | Licence no. 521 dated 30/04/2009 to practise financial consultancy on securities, issued by the Financial Regulatory Authority.\n1732 | Independent financial advisors | Registered with the FRA’s register of independent financial advisors under no. 1732 on 31/08/2009.\nG50004 | Industrial Modernisation Centre | Registered with the IMC as a service provider in July 2009, code G50004.\n26 | Official EGX sponsor | Approved by the EGX board (session 1 of 2014) and registered as an approved SME sponsor under no. 26.',
  },
  structure: {
    top_ar: 'رئيس مجلس الإدارة', top_en: 'Chairperson',
    items_ar: 'العضو المنتدب للشؤون الفنية | إدارة الاستشارات ؛ إدارة القيد والرعاية ؛ إدارة هيكلة المشروعات\nلجنة المراجعة والحوكمة | إدارة الرقابة والمراجعة ؛ المراجع الداخلي ؛ المراقب الداخلي ؛ مكافحة غسل الأموال وتمويل الإرهاب\nالعضو المنتدب للشؤون الإدارية والمالية | الإدارة المالية ؛ الموارد البشرية ؛ العقود والشؤون القانونية ؛ التسويق وخدمة العملاء',
    items_en: 'MD — Technical | Advisory ; Listing & sponsorship ; Project structuring\nAudit & Governance Committee | Control & audit ; Internal auditor ; Internal controller ; AML / CFT\nMD — Admin & Finance | Finance ; Human resources ; Contracts & legal ; Marketing & client service',
  },
  approach: {
    title_ar: 'كيف نعمل معك', title_en: 'How we work with you',
    items_ar: 'نستمع | مكالمة استكشافية مجانية نفهم فيها وضع شركتك وأهدافك.\nنشخّص | دراسة دقيقة لملفك المالي والقانوني والتشغيلي وتحديد الفجوات.\nننفّذ | فريق متخصص ينفّذ الحل وفق المعايير الدولية ومتطلبات الجهات الرقابية.\nنرافقك | متابعة مستمرة حتى الاعتماد والتنفيذ وما بعده.',
    items_en: 'Listen | A free discovery call to understand your company and goals.\nDiagnose | A careful review of your financial, legal and operational position.\nDeliver | A specialised team executes to international and regulatory standards.\nStay with you | Ongoing support through approval, execution and beyond.',
    images: '/media/people.webp\n/media/research.webp\n/media/documents.webp\n/media/growth.webp',
  },
  cta: {
    title_ar: 'جاهز تبدأ رحلة شركتك؟', title_en: 'Ready to start your company’s journey?',
    text_ar: 'احصل على استشارة مجانية لتقييم وضع شركتك وتحديد الخدمة الأنسب لها.', text_en: 'Get a free consultation to assess your company and find the right service.',
    button_ar: 'احجز استشارة مجانية', button_en: 'Book a free consultation', image_url: '/media/city.webp',
  },
  popup: {
    enabled: true, delay: 14,
    title_ar: 'استشارة مجانية مع خبير ركويزا', title_en: 'A free consultation with a Riqueza expert',
    text_ar: 'اترك بياناتك وسيتواصل معك أحد مستشارينا خلال يوم عمل لمناقشة احتياجات شركتك.', text_en: 'Leave your details and one of our advisors will contact you within one business day.',
    image_url: '/media/bell.webp',
  },
  invest: {
    title_ar: 'استثمر في مصر', title_en: 'Invest in Egypt',
    lead_ar: 'تتمتع مصر بموقع استراتيجي يربط بين قارات العالم، وبشبكة من الاتفاقيات التجارية التي تفتح أمام المستثمرين أسواقًا واسعة.',
    lead_en: 'Egypt sits at a strategic crossroads between continents, with trade agreements that open wide markets to investors.',
    items_ar: 'موقع استراتيجي | ملتقى أفريقيا وآسيا وأوروبا، وتمر عبرها قناة السويس أحد أهم الممرات الملاحية في العالم.\nسوق كبير | سوق محلي واسع يتجاوز تعداده 100 مليون نسمة، وقاعدة شبابية من القوى العاملة.\nاتفاقيات تجارية | اتفاقيات تجارة حرة وتفضيلية تتيح الوصول إلى أسواق أفريقيا والدول العربية وأوروبا.\nسوق مال منظم | بورصة مصرية تضم سوقًا رئيسيًا وسوقًا للشركات الصغيرة والمتوسطة (النيلكس) تحت رقابة الهيئة العامة للرقابة المالية.\nبنية تحتية متطورة | مشروعات كبرى في الطرق والموانئ والطاقة والمدن الجديدة.\nكيف نساعدك | ندرس معك الفرصة الاستثمارية والجدوى والهيكل القانوني والمالي الأنسب لبدء استثمارك.',
    items_en: 'Strategic location | Where Africa, Asia and Europe meet, home to the Suez Canal.\nLarge market | A domestic market of more than 100 million people and a young workforce.\nTrade agreements | Free and preferential trade access to African, Arab and European markets.\nRegulated capital market | The EGX main market and NILEX for SMEs, supervised by the FRA.\nModern infrastructure | Major projects in roads, ports, energy and new cities.\nHow we help | We study the opportunity, feasibility and the right legal and financial structure with you.',
    image_url: '/media/pyramids.webp',
  },
  contact: {
    address_ar: 'برج الياسمين، القطعة رقم 17 بلوك 86، الشطر الثالث عشر، زهراء المعادي، القاهرة', address_en: 'Yasmin Tower, Plot 17, Block 86, Sector 13, Zahraa El-Maadi, Cairo, Egypt',
    phones: '02 2755 6602\n0101 121 6514\n0100 072 1718', email: 'info@riqueza-eg.com', whatsapp: '201011216514',
    hours_ar: 'متاحون على مدار 24 ساعة، 7 أيام في الأسبوع', hours_en: 'Available 24/7',
    map_url: 'https://www.google.com/maps?q=Zahraa+El+Maadi+Cairo&output=embed',
  },
  social: { facebook: '', linkedin: '', instagram: '', x: '', threads: '', youtube: '' },
};

export const BOARD = [
  ['أسماء محمد عبد الوهاب','Asmaa Mohamed Abdelwahab','رئيس مجلس الإدارة','Chairperson','/team/asmaa-abdelwahab.jpg'],
  ['هاجر محمد عبد الوهاب','Hagar Mohamed Abdelwahab','العضو المنتدب','Managing Director','/team/hagar-abdelwahab.jpg'],
  ['أحمد إبراهيم الحلواني','Ahmed Ibrahim Elhelwany','عضو مجلس إدارة','Board Member','/team/ahmed-elhelwany.jpg'],
  ['ناصر مباشر','Nasser Mobasher','عضو مجلس إدارة','Board Member','/team/nasser-mobasher.jpg'],
  ['محمد عيسى','Mohamed Eissa','عضو مجلس إدارة','Board Member',''],
  ['عمرو فوزي','Amr Fawzy','عضو مجلس إدارة','Board Member',''],
  ['مجدي عبد الكريم','Magdy Abdelkarim','عضو مجلس إدارة','Board Member',''],
].map(([name_ar,name_en,role_ar,role_en,photo_url],i)=>({ id:'b'+i, name_ar,name_en,role_ar,role_en,photo_url, sort_order:i+1, active:true }));

const CL = {
  holding: 'مجموعة الخرافي · ماك القابضة|مجموعة لكح جروب القابضة|القابضة للصناعات الكيماوية|القابضة للصناعات المعدنية',
  listed: 'مستشفى النزهة الدولي|شمال الصعيد (نيو داب)|العربية لإدارة وتطوير الأصول|سيتي لاب للتحاليل الطبية|المصرية لنظم التعليم الحديث|جينيال تورز|تصنيع الأقلام والبلاستيك|المجموعة المتكاملة للأعمال الهندسية|المصريون للاستثمار والتنمية|المشروعات الصناعية والهندسية|الأولى للاستثمار والتنمية العقارية|المؤشر للبرمجيات|العبور للاستثمار العقاري|العامة لمنتجات الخزف · شيني|ابن سينا فارما|الكابلات الكهربائية المصرية|أكرو مصر للشدات والسقالات|البدر للبلاستيك',
  prior: 'الرازي للأدوية|الإسكندرية للأسمدة|الشروق الحديثة للطباعة والتغليف|سوهاج القابضة|ليبتس مصر|كايرو سكان|جولدن كوست للسخنة للاستثمار السياحي|النيل للوساطة التأمينية|سكاي لايت|سفيريكو|المجموعة المتحدة للمستلزمات الطبية|يونيفرت للصناعات الغذائية|فاشون بوينت|فليكس برينت|الوطنية لصناعة الميلامين واليوريا فورمالدهيد|هيلكو ميتلز|إيجي سويس فود|المصرية للصناعات الغذائية والتبريد|جنّات للإنتاج الحيواني|توب إنترناشيونال للاستثمار العقاري|ويندسور للتجارة وتصنيع الورق|جنّات للأعلاف الحديثة|يونيبكس للصناعات الغذائية|المصرية للاستثمار والمجازر|في آي بي|المرام لاند مارك|المركز الدولي للمشروعات والتنمية|الإسكندرية للتجارة والصناعة|لوجيكس ستون|دوفيل البحر الأحمر للقرى السياحية|أرت فارما|النيل المصري للنقل الجماعي|الجيزة للأنظمة|لندن كلينك|نيو ألفا|تاج سينا|زيتا للاستثمار والتجارة|بورسعيد للسكر|بيست للتنمية العقارية|إنفست للتنمية العقارية|أيه بي سبورت للاستشارات|جلوبترونكس للإلكترونيات|الهندسية لصناعة الألومنيوم|العالمية للاستثمار والتنمية|أوريون للتجارة والاستشارات|البركة إنترناشيونال|إنتركايرو لصناعة الألومنيوم|زيرفون مصر|المنى للتنمية الزراعية|العرب للأسمدة والكيماويات|ماج للصناعات الغذائية|الرائدة للإنشاءات|مراكز القاهرة التشخيصية|السراج للتشييد والبناء|إدارة المراكز الطبية|الأهرام للوسائط المتعددة|فيرولاند للتنمية السياحية|أميتريد للتجارة والمقاولات|الصناعات الاستهلاكية|كويست كونسلت|مصر للتأمين|بونا للصناعة والتجارة|سوهاج للتنمية والاستثمار|مصر بلتون|النقل المباشر|أعمال النقل|النيل للنقل الثقيل|النيل للنقل البري|نجع حمادي للفايبر بورد|النيل لنقل البضائع|مصر للتبريدات والتخزين|العاشر من رمضان للإنشاءات|فندق طابا الأول|الوطنية لإنتاج البذور|المصرية للتأمين · حياة|العربية لمدينة الإنتاج الإعلامي|المصرية للتأمين · ممتلكات|أكمي لإنتاج سنون الإبر|التشخيص المتميز · مصر|النهضة للصناعات|ماك الأهرام|كونتيننتال للتنمية السياحية|بتروجرافيكس|شمال أفريقيا|المجموعة المتكاملة الهندسية|جنة العنود للتنمية والاستثمار الزراعي|ابن سينا للعلاج والخدمات الطبية|نيوداب الوادي للتجارة والتوريدات|باكت للاستثمار والتطوير العقاري|آي فيجن للتجارة وإدارة المشروعات|بتروتريتمنت للخدمات البترولية|المعمّرون العرب للاستثمار العقاري|بوابة الشرق (شركة كويتية)|سيتي تريد لتداول الأوراق المالية|رؤية بلازا للاستثمار العقاري|العربية للصناعات التكنولوجية تكنوفالي|إم في سي للتوكيلات التجارية|المصرية لبلوكات الأنود الكربونية|مصر أبو ظبي للاستشارات العقارية|المصرية الصينية المشتركة|ماسبيرو للتنمية العمرانية|ركائز هليوبوليس الجديدة العقارية|العرفة للتنمية والاستثمار|المنيا الجديدة|مواصلات مصر|فلوريل للصناعات الغذائية|الهبة للنقل الجماعي|القاهرة للنقل الجماعي|أعمل بزنس|مسار للاستثمارات اللوجستية|ثقة لإدارة الأعمال والتنمية|مستشفى الصفوة الجديدة التخصصي|وادي دجلة للتنمية العقارية|كندا تراست للرعاية|فوري دهب للخدمات الإلكترونية|فاريانس العالمية للتدريب والتطوير',
  emak: 'إيماك مرسى علم للتنمية السياحية والاستثمار|إيماك للفنادق والتنمية السياحية · فندق مارينا لودج|مرسى علم للمشروعات السياحية|ماك للطيران|مرسى علم لخدمات الطيران (إيماس)|إيماك للتنمية السياحية والعقارية|إيماك للتنمية العقارية|ماك القابضة للاستثمار|إيماك للمرافق والخدمات|فلورا للتنمية الزراعية|كلوب رأس سوما|بورت غالب للتأجير التمويلي|المصرية للاستثمار|خدمات التسويق المتكاملة|سوما باي|إيماك مرسى علم لتشغيل وإدارة المطارات|بورت غالب ريزورت',
  international: 'الإسكندرية للمنتجات البترولية المتخصصة (ASPEC)|كيور إن تور للخدمات والرعاية الطبية|مصر للاستثمار والتنمية العمرانية|مصر للتأمين التكافلي · ممتلكات ومسؤوليات|فيد لاين لتجارة الأدوية البيطرية|بروكر فالي للوساطة التجارية والاستشارية|أفرولاند لاستصلاح الأراضي والاستثمار الزراعي|ميد يوتا فارما (سيو تيكالز)|بون فارما للمستحضرات الطبية|أفرولاند لاستصلاح الأراضي والإنتاج الحيواني|العربية الفندقية لمدينة الإنتاج الإعلامي|الديبيكي للصناعات الدوائية (الديبيكي فارما)|إنتلجنت واي كابيتال للاستشارات والترويج|البركة إنترناشونال لتصنيع وتعبئة المواد الغذائية|Premium Diagnostics LLC · الشارقة، الإمارات|زاد آند ستريال للأدوية|التشخيص المتميز · المملكة العربية السعودية|قمة المشرق الطبية · جدة، السعودية|سكلفي (مهارتي للتدريب المهني)|استشر|كي آند بي للخدمات الهندسية|فلوريل للمطاعم والكافيهات|معامل حساب للتحاليل الطبية|معامل تاون لاب للتحاليل الطبية|اعمل بيزنس ميديكال|اعمل أوردر|خبيرات للاستشارات المالية|الرائد لتكنولوجيا المعلومات|جي بي إس للتدريب|العيادة|هيلث آند تيستي للأغذية والمشروبات|هيلث دايت للأغذية والمشروبات|المؤشر للاستثمار والتطوير العقاري|كيبون وجوي للأحذية الرياضية|كالف كونستركشن للمشروعات الهندسية المتكاملة|مستشفى تبارك · القاهرة الجديدة',
};
let n = 0;
export const CLIENTS = Object.entries(CL).flatMap(([category, s]) => s.split('|').map((name_ar) => ({ id: 'c' + (++n), name_ar, name_en: '', category, logo_url: '', sort_order: n, active: true })));

export const POSTS = [
  { slug: 'what-is-fair-value', image_url: '/media/balance.webp', published_at: '2026-11-01', category_ar: 'مقال', category_en: 'Article',
    title_ar: 'ما هي القيمة العادلة ولماذا تحتاجها شركتك؟', title_en: 'What is fair value, and why does your company need it?',
    excerpt_ar: 'شرح مبسط لمعيار IFRS 13 وهرمية القيمة العادلة، ومتى يصبح تقرير القيمة العادلة ضرورة لشركتك.', excerpt_en: 'A simple guide to IFRS 13, the fair value hierarchy, and when a fair value report becomes essential.',
    body_ar: 'يعرّف معيار IFRS 13 القيمة العادلة بأنها السعر الذي يمكن الحصول عليه عند بيع أصل أو دفعه لنقل التزام في معاملة منظمة بين أطراف السوق في تاريخ القياس.\n\nيعتمد القياس على هرمية من ثلاثة مستويات: أسعار معلنة في أسواق نشطة (المستوى الأول)، ومدخلات أخرى قابلة للملاحظة (المستوى الثاني)، ومدخلات غير قابلة للملاحظة تعتمد على افتراضات (المستوى الثالث). وكلما زاد الاعتماد على البيانات السوقية الفعلية زادت موثوقية التقييم.\n\nتحتاج الشركة عادة إلى تقرير قيمة عادلة عند إعداد قوائم مالية تتطلب ذلك، أو عند القيد والطرح في البورصة، أو في صفقات الاستحواذ والاندماج، أو عند إدخال مستثمرين جدد وإعادة الهيكلة.\n\nفي ركويزا نعد تقارير القيمة العادلة وفق IFRS 13 ومتطلبات الهيئة العامة للرقابة المالية، ونرافق العميل حتى اعتماد التقرير.',
    body_en: 'IFRS 13 defines fair value as the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.\n\nMeasurement follows a three-level hierarchy: quoted prices in active markets (Level 1), other observable inputs (Level 2) and unobservable inputs based on assumptions (Level 3). The more a valuation relies on actual market data, the more reliable it is.\n\nCompanies typically need a fair value report for certain financial statements, listing and IPOs, M&A, bringing in investors and restructuring.\n\nAt Riqueza we prepare fair value reports under IFRS 13 and FRA requirements and support the client until approval.' },
  { slug: 'main-market-vs-nilex', image_url: '/media/bell.webp', published_at: '2026-10-20', category_ar: 'دليل', category_en: 'Guide',
    title_ar: 'السوق الرئيسي أم النيلكس؟ كيف تختار سوق القيد المناسب', title_en: 'Main market or NILEX? Choosing where to list',
    excerpt_ar: 'مقارنة سريعة بين السوق الرئيسي وسوق النيلكس للشركات الصغيرة والمتوسطة، ومتى يناسب كل منهما شركتك.', excerpt_en: 'A quick comparison of the EGX main market and NILEX for SMEs, and when each fits.',
    body_ar: 'يوفر السوق الرئيسي بالبورصة المصرية بيئة للشركات الكبيرة ذات رأس المال والسيولة الأعلى، مع متطلبات إفصاح وحوكمة أوسع ونسبة أعلى من الأسهم حرة التداول.\n\nأما سوق النيلكس فمخصص للشركات الصغيرة والمتوسطة بمتطلبات رأس مال وإفصاح أخف، وبإشراف راعٍ معتمد طوال فترة القيد، ويمثل مسارًا تدريجيًا للانتقال لاحقًا إلى السوق الرئيسي.\n\nيعتمد الاختيار على حجم الشركة وهيكل ملكيتها وجاهزيتها المحاسبية والحوكمية وأهدافها التمويلية. ولهذا نبدأ مع كل عميل بدراسة جاهزية تحدد الفجوات والسوق الأنسب.\n\nركويزا راعٍ رسمي معتمد لدى البورصة المصرية ومسجلة بسجل رعاة الشركات الصغيرة والمتوسطة.',
    body_en: 'The EGX main market serves larger companies with higher capital and liquidity, with broader disclosure and governance requirements and a higher free float.\n\nNILEX is designed for SMEs, with lighter capital and disclosure requirements and supervision by an approved sponsor throughout the listing—a gradual path to the main market.\n\nThe right choice depends on size, ownership structure, accounting and governance readiness and funding goals. That is why every engagement starts with a readiness study.\n\nRiqueza is an official EGX sponsor registered for SMEs.' },
  { slug: 'governance-for-family-business', image_url: '/media/pillars.webp', published_at: '2026-10-05', category_ar: 'مقال', category_en: 'Article',
    title_ar: 'الحوكمة للشركات العائلية: خطوة نحو الاستدامة', title_en: 'Governance for family businesses: a step toward sustainability',
    excerpt_ar: 'لماذا تحتاج الشركات العائلية إلى إطار حوكمة واضح قبل التوسع أو دخول مستثمرين جدد.', excerpt_en: 'Why family businesses need a clear governance framework before expanding or bringing in investors.',
    body_ar: 'تنمو كثير من الشركات العائلية بقرارات سريعة ومركزية، لكن مع التوسع تظهر الحاجة إلى قواعد واضحة تنظم العلاقة بين الملاك ومجلس الإدارة والإدارة التنفيذية.\n\nيساعد إطار الحوكمة على الفصل بين الملكية والإدارة، وتحديد الأدوار والمسؤوليات، وتنظيم تضارب المصالح، وتحسين جودة الإفصاح والتقارير المالية.\n\nوتزداد أهمية الحوكمة عند الاستعداد للقيد في البورصة أو دخول مستثمر استراتيجي، إذ تُعد من أول ما يقيّمه المستثمرون والجهات الممولة.\n\nنبدأ في ركويزا بتقييم مستوى الحوكمة الحالي وتحليل الفجوات، ثم نصمم الإطار والسياسات المناسبة وندعم التطبيق والمتابعة.',
    body_en: 'Many family businesses grow through fast, centralised decisions. As they expand, they need clear rules for the relationship between owners, the board and management.\n\nA governance framework separates ownership from management, defines roles, manages conflicts of interest and improves disclosure and reporting.\n\nIt matters even more before listing or bringing in a strategic investor, as it is one of the first things investors and lenders assess.\n\nAt Riqueza we start with a governance assessment and gap analysis, then design the framework and policies and support implementation.' },
].map((p, i) => ({ id: 'p' + i, active: true, sort_order: i + 1, ...p }));

export const DEFAULT_DATA = {
  blocks: BLOCKS,
  services: SERVICES.map((s, i) => ({ id: 's' + i, active: true, ...s })),
  board: BOARD,
  clients: CLIENTS,
  posts: POSTS,
  gallery: [],
  videos: [],
  jobs: [],
};
