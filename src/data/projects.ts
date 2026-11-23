export type Category = 'Film' | 'Theatre' | 'Acting' | 'Production'

export interface Still {
  src: string
  alt: string
}

export interface Project {
  slug: string
  title: string
  titleFa: string
  year: number
  role: string
  category: Category
  format: string
  duration?: string
  logline: string
  synopsis: string[]
  cover: Still
  stills: Still[]
  credits: { role: string; name: string }[]
  featured?: boolean
  /** Persian expression of the same facts — no added claims */
  fa: {
    role: string
    format: string
    duration?: string
    logline: string
    synopsis: string[]
    coverAlt: string
    stillsAlt: string[]
    credits: { role: string; name: string }[]
  }
}



const u = (id: string, w = 1600, h = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&sat=-70`

export const projects: Project[] = [
  {
    slug: 'latent-for-her',
    title: 'Latent (for her)',
    titleFa: 'مکنون',
    year: 2023,
    role: 'Director / Producer',
    category: 'Film',
    format: 'Feature · 4K · Colour',
    duration: '96 min',
    logline:
      'A woman returns to a house she once fled, and the rooms remember more than she does.',
    synopsis: [
      'Latent (for her) traces three days in an emptying apartment on the northern edge of Tehran, where inherited silence carries more weight than speech. The film moves between what is said and what is withheld, letting light do the work of confession.',
      'Shot almost entirely in available light, the film builds its argument through duration and stillness — a study of a woman assembling a self out of the objects the dead leave behind.',
    ],
    cover: { src: u('photo-1457732815361-daa98277e9c8'), alt: 'Silhouette of a figure against a bright window' },
    stills: [
      { src: u('photo-1470635824525-7f1f1e5a4ebc'), alt: 'Person standing in silhouette before a window' },
      { src: u('photo-1580920790557-43158492adb5'), alt: 'A figure framed by hard window light' },
      { src: u('photo-1495581600346-93f223866d0a'), alt: 'A long shadow cast across a wall' },
    ],
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Screenplay', name: 'Kamran Hosseinzadeh' },
      { role: 'Cinematography', name: 'Sara Movahed' },
      { role: 'Editing', name: 'Behrang Dezfouli' },
      { role: 'Sound', name: 'Ali Reza Alavian' },
      { role: 'Producer', name: 'Kamran Hosseinzadeh' },
    ],
    featured: true,
    fa: {
      role: 'کارگردان / تهیه‌کننده',
      format: 'بلند · 4K · رنگی',
      duration: '۹۶ دقیقه',
      logline: 'زنی به خانه‌ای برمی‌گردد که روزی از آن گریخته بود، و اتاق‌ها بیش از خودش به یاد می‌آورند.',
      synopsis: [
        'مکنون سه روز را در آپارتمانی رو به خالی‌شدن، در حاشیهٔ شمالی تهران، دنبال می‌کند؛ جایی که سکوتِ به‌ارث‌رسیده از هر حرفی سنگین‌تر است. فیلم میان گفته و ناگفته حرکت می‌کند و اعتراف را به نور می‌سپارد.',
        'فیلم تقریباً تمام با نور موجود فیلم‌برداری شده و استدلالش را با زمان و سکون می‌سازد — مطالعه‌ای دربارهٔ زنی که از اشیای به‌جامانده از مردگان، خودی تازه سرهم می‌کند.',
      ],
      coverAlt: 'پیکری در ضدنور، مقابل پنجره‌ای روشن',
      stillsAlt: ['کسی در ضدنور، ایستاده مقابل پنجره', 'پیکری در قاب نور تند پنجره', 'سایه‌ای بلند روی دیوار'],
      credits: [
        { role: 'کارگردان', name: 'کامران حسین‌زاده' },
        { role: 'فیلم‌نامه', name: 'کامران حسین‌زاده' },
        { role: 'مدیر فیلم‌برداری', name: 'سارا موحد' },
        { role: 'تدوین', name: 'بهرنگ دزفولی' },
        { role: 'صدا', name: 'علیرضا علویان' },
        { role: 'تهیه‌کننده', name: 'کامران حسین‌زاده' },
      ],
    },
  },
  {
    slug: 'the-long-take',
    title: 'The Long Take',
    titleFa: 'برداشت بلند',
    year: 2022,
    role: 'Director',
    category: 'Film',
    format: 'Short · 16mm',
    duration: '18 min',
    logline: 'A single unbroken walk through a city at the hour before it wakes.',
    synopsis: [
      'A single-shot short following a night-shift nurse walking home through a city that has not yet decided whether it is asleep or awake. The camera never cuts; the world reorganises around her.',
    ],
    cover: { src: u('photo-1652465998157-aecdbbcebfc6'), alt: 'A person seated in a dim interior' },
    stills: [
      { src: u('photo-1530037327011-979a1109a5dc'), alt: 'Muted mountain landscape at dawn' },
      { src: u('photo-1529333110658-26b4cf759641'), alt: 'Trees dissolving into fog' },
    ],
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Cinematography', name: 'Sara Movahed' },
      { role: 'Producer', name: 'Nima Farahani' },
    ],
    fa: {
      role: 'کارگردان',
      format: 'کوتاه · ۱۶ میلی‌متری',
      duration: '۱۸ دقیقه',
      logline: 'یک پیاده‌روی بی‌وقفه در شهر، ساعتی پیش از بیدار شدنش.',
      synopsis: [
        'فیلم کوتاهی در یک برداشت، همراه پرستاری که پس از شیفت شب به خانه می‌رود، در شهری که هنوز تصمیم نگرفته خواب است یا بیدار. دوربین هرگز کات نمی‌دهد؛ جهان دور او از نو چیده می‌شود.',
      ],
      coverAlt: 'کسی نشسته در فضایی کم‌نور',
      stillsAlt: ['منظرهٔ کوهستان در سپیده‌دم', 'درختانی که در مه محو می‌شوند'],
      credits: [
        { role: 'کارگردان', name: 'کامران حسین‌زاده' },
        { role: 'مدیر فیلم‌برداری', name: 'سارا موحد' },
        { role: 'تهیه‌کننده', name: 'نیما فراهانی' },
      ],
    },
  },
  {
    slug: 'the-glass-room',
    title: 'The Glass Room',
    titleFa: 'اتاق شیشه‌ای',
    year: 2021,
    role: 'Director / Adaptation',
    category: 'Theatre',
    format: 'Stage · Black box',
    duration: '75 min',
    logline: 'Four strangers, one transparent wall, and a negotiation that cannot end well.',
    synopsis: [
      'A chamber play staged inside a glass enclosure at Tehran’s City Theatre, where the audience watches the performers watch each other. An adaptation that turns surveillance into intimacy.',
    ],
    cover: { src: u('photo-1549497538-303791108f95'), alt: 'A single empty chair on a dim stage' },
    stills: [
      { src: u('photo-1583482183620-f692113aafc3'), alt: 'Figures moving through a dim hall' },
      { src: u('photo-1514306191717-452ec28c7814'), alt: 'A theatre curtain in low light' },
    ],
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Set Design', name: 'Leila Naghdi' },
      { role: 'Lighting', name: 'Reza Mehdizadeh' },
    ],
    fa: {
      role: 'کارگردان / اقتباس',
      format: 'صحنه · بلک‌باکس',
      duration: '۷۵ دقیقه',
      logline: 'چهار غریبه، یک دیوار شفاف، و مذاکره‌ای که پایان خوشی ندارد.',
      synopsis: [
        'نمایشی مجلسی که درون محفظه‌ای شیشه‌ای در تئاتر شهر تهران اجرا شد؛ تماشاگر بازیگرانی را تماشا می‌کند که یکدیگر را تماشا می‌کنند. اقتباسی که نظارت را به صمیمیت بدل می‌کند.',
      ],
      coverAlt: 'یک صندلی خالی روی صحنه‌ای کم‌نور',
      stillsAlt: ['پیکرهایی در حال گذر از تالاری کم‌نور', 'پردهٔ تئاتر در نور کم'],
      credits: [
        { role: 'کارگردان', name: 'کامران حسین‌زاده' },
        { role: 'طراح صحنه', name: 'لیلا نقدی' },
        { role: 'نور', name: 'رضا مهدی‌زاده' },
      ],
    },
  },
  {
    slug: 'quiet-inventory',
    title: 'Quiet Inventory',
    titleFa: 'صورت‌برداری',
    year: 2020,
    role: 'Writer / Producer',
    category: 'Production',
    format: 'Documentary · Digital',
    duration: '52 min',
    logline: 'A shuttered cinema is catalogued, object by object, before demolition.',
    synopsis: [
      'A quiet documentary record of a beloved single-screen cinema in the weeks before it is torn down — each seat, reel and ticket stub logged as an act of resistance against forgetting.',
    ],
    cover: { src: u('photo-1503354531728-dedfa6cb4e8d'), alt: 'Half a face in shadow' },
    stills: [{ src: u('photo-1506452305024-9d3f02d1c9b5'), alt: 'A muted stand of pines' }],
    credits: [
      { role: 'Writer', name: 'Kamran Hosseinzadeh' },
      { role: 'Producer', name: 'Kamran Hosseinzadeh' },
    ],
    fa: {
      role: 'نویسنده / تهیه‌کننده',
      format: 'مستند · دیجیتال',
      duration: '۵۲ دقیقه',
      logline: 'سینمایی تعطیل‌شده، شیء به شیء، پیش از تخریب فهرست می‌شود.',
      synopsis: [
        'ثبتی آرام از یک سینمای تک‌سالنهٔ محبوب در هفته‌های پیش از تخریب — هر صندلی، هر حلقه فیلم و هر ته‌بلیت، به‌عنوان مقاومتی در برابر فراموشی، ثبت می‌شود.',
      ],
      coverAlt: 'نیمی از یک چهره در سایه',
      stillsAlt: ['ردیفی آرام از درختان کاج'],
      credits: [
        { role: 'نویسنده', name: 'کامران حسین‌زاده' },
        { role: 'تهیه‌کننده', name: 'کامران حسین‌زاده' },
      ],
    },
  },
  {
    slug: 'against-the-current',
    title: 'Against the Current',
    titleFa: 'خلاف جهت',
    year: 2018,
    role: 'Actor',
    category: 'Acting',
    format: 'Feature · Colour',
    duration: '104 min',
    logline: 'A supporting turn as a ferryman who never quite reaches the far bank.',
    synopsis: [
      'A featured supporting role in a widely-travelled festival drama — a ferryman whose small refusals accumulate into a life.',
    ],
    cover: { src: u('photo-1718606446645-d7169dd0789e'), alt: 'A man in low light with eyes closed' },
    stills: [{ src: u('photo-1719255474372-e693ed1a5d1e'), alt: 'A man standing in a dark room' }],
    credits: [{ role: 'Cast', name: 'Kamran Hosseinzadeh' }],
    fa: {
      role: 'بازیگر',
      format: 'بلند · رنگی',
      duration: '۱۰۴ دقیقه',
      logline: 'نقشی مکمل: قایقرانی که هیچ‌وقت کاملاً به ساحل آن‌سو نمی‌رسد.',
      synopsis: ['نقشی مکمل در درامی جشنواره‌ای — قایقرانی که امتناع‌های کوچکش، رفته‌رفته به یک زندگی بدل می‌شود.'],
      coverAlt: 'مردی در نور کم، با چشمان بسته',
      stillsAlt: ['مردی ایستاده در اتاقی تاریک'],
      credits: [{ role: 'بازیگر', name: 'کامران حسین‌زاده' }],
    },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const featuredProject = projects.find((p) => p.featured) ?? projects[0]

export const categories: Category[] = ['Film', 'Theatre', 'Acting', 'Production']

export const categoryFa: Record<Category | 'All', string> = {
  All: 'همه',
  Film: 'فیلم',
  Theatre: 'تئاتر',
  Acting: 'بازیگری',
  Production: 'تولید',
}

/* Broader professional record for the Credits / Filmography page */
export interface CreditEntry {
  title: string
  titleFa?: string
  year: number
  role: string
  roleFa: string
  note?: string
  noteFa?: string
}

export const filmographyGroupsFa: Record<string, string> = {
  Film: 'سینما',
  Theatre: 'تئاتر',
  'Television & Related': 'تلویزیون و تولیدات مرتبط',
}

export const filmography: Record<string, CreditEntry[]> = {
  Film: [
    { title: 'Latent (for her)', titleFa: 'مکنون', year: 2023, role: 'Director / Producer', roleFa: 'کارگردان / تهیه‌کننده' },
    { title: 'The Long Take', titleFa: 'برداشت بلند', year: 2022, role: 'Director', roleFa: 'کارگردان' },
    { title: '24 Frames', titleFa: '۲۴ فریم', year: 2017, role: 'Second Assistant Director', roleFa: 'دستیار دوم کارگردان' },
    { title: 'Hussein, Who Said No', titleFa: 'رستاخیز', year: 2014, role: 'Actor', roleFa: 'بازیگر' },
    { title: 'Like Someone in Love', titleFa: 'مثل یک عاشق', year: 2012, role: 'Trainee Assistant Director', roleFa: 'کارآموز دستیار کارگردان' },
  ],
  Theatre: [
    { title: 'The Glass Room', titleFa: 'اتاق شیشه‌ای', year: 2021, role: 'Director, Adaptation', roleFa: 'کارگردان، اقتباس' },
    { title: 'A House of Doors', titleFa: 'خانهٔ درها', year: 2019, role: 'Director', roleFa: 'کارگردان' },
    { title: 'The Chairs', titleFa: 'صندلی‌ها', year: 2016, role: 'Actor', roleFa: 'بازیگر', note: 'after Ionesco', noteFa: 'برگرفته از یونسکو' },
  ],
  'Television & Related': [
    { title: 'Quiet Inventory', titleFa: 'صورت‌برداری', year: 2020, role: 'Writer, Producer', roleFa: 'نویسنده، تهیه‌کننده' },
    { title: 'Against the Current', titleFa: 'خلاف جهت', year: 2018, role: 'Actor', roleFa: 'بازیگر' },
    { title: 'Nocturne', titleFa: 'نوکتورن', year: 2015, role: 'Editor', roleFa: 'تدوینگر' },
  ],
}
