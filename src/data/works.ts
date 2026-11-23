export type Category = 'Film' | 'Theatre' | 'Acting' | 'Production'

export interface Work {
  slug: string
  title: string
  titleFa?: string
  year: string
  role: string
  category: Category
  format: string
  duration?: string
  logline: string
  synopsis: string[]
  image: string
  gallery: string[]
  featured?: boolean
  credits: { role: string; name: string }[]
}

const img = (id: string, w = 1600, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export const works: Work[] = [
  {
    slug: 'latent-for-her',
    title: 'Latent (for her)',
    titleFa: 'نهفته',
    year: '2023',
    role: 'Director · Writer',
    category: 'Film',
    format: 'Short Film · 16mm',
    duration: '22 min',
    logline:
      'A woman returns to an emptied apartment and finds the rooms still keeping her shape.',
    synopsis: [
      'Shot across three nights in a house scheduled for demolition, Latent (for her) traces the last hours a place remembers a person. The film moves without dialogue for its first act, letting light and the grain of 16mm carry the weight of a departure.',
      'It premiered in the national short competition and travelled to festivals across the region, where it was noted for its restraint and its refusal of resolution.',
    ],
    image: img('1577916239209-c2cab58b4e0d'),
    gallery: [
      img('1577916239209-c2cab58b4e0d', 1400, 1750),
      img('1597088246857-4f05c6d8a9eb', 1400, 900),
      img('1544501652-c92e7f9ff497', 1400, 1750),
    ],
    featured: true,
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Screenplay', name: 'Kamran Hosseinzadeh' },
      { role: 'Cinematography', name: 'Sara Emami' },
      { role: 'Editor', name: 'Nima Farahani' },
      { role: 'Sound', name: 'Bahar Rezaei' },
      { role: 'Producer', name: 'Atlas Film House' },
    ],
  },
  {
    slug: 'maknoon',
    title: 'Maknoon',
    titleFa: 'مکنون',
    year: '2021',
    role: 'Director',
    category: 'Film',
    format: 'Feature Film',
    duration: '98 min',
    logline:
      'Two estranged brothers cross a winter province to bury a father neither of them mourned.',
    synopsis: [
      'Maknoon — “the concealed” — is a road film held together by silence. Across a landscape of salt flats and shuttered towns, a debt older than either man surfaces one mile at a time.',
      'The film was Hosseinzadeh’s first feature and established the spare, patient grammar that runs through his later work.',
    ],
    image: img('1719255474372-e693ed1a5d1e'),
    gallery: [
      img('1719255474372-e693ed1a5d1e', 1400, 1750),
      img('1490971774356-7fac993cc438', 1400, 900),
      img('1628988191808-b6b86384e559', 1400, 1750),
    ],
    featured: true,
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Screenplay', name: 'Kamran Hosseinzadeh · Leila Kordbacheh' },
      { role: 'Cinematography', name: 'Sara Emami' },
      { role: 'Cast', name: 'Reza Behboodi · Hasan Pourshirazi' },
      { role: 'Producer', name: 'Atlas Film House' },
    ],
  },
  {
    slug: 'the-room-that-listens',
    title: 'The Room That Listens',
    titleFa: 'اتاقی که می‌شنود',
    year: '2022',
    role: 'Director',
    category: 'Theatre',
    format: 'Stage · Two Acts',
    duration: '85 min',
    logline: 'A chamber play for three voices and one door that never opens.',
    synopsis: [
      'Staged in a black-box theatre with a single moving light, the production stripped the stage to breath and timing. Audiences sat on three sides, close enough to hear the actors think.',
    ],
    image: img('1503095396549-807759245b35'),
    gallery: [
      img('1503095396549-807759245b35', 1400, 900),
      img('1579539760267-b2e78d9d735e', 1400, 900),
      img('1571173069043-82a7a13cee9f', 1400, 900),
    ],
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Playwright', name: 'Kamran Hosseinzadeh' },
      { role: 'Lighting', name: 'Omid Kaveh' },
      { role: 'Company', name: 'City Theatre, Tehran' },
    ],
  },
  {
    slug: 'salt-and-paper',
    title: 'Salt & Paper',
    titleFa: 'نمک و کاغذ',
    year: '2020',
    role: 'Director · Producer',
    category: 'Production',
    format: 'Documentary Short',
    duration: '31 min',
    logline: 'A portrait of the last hand-press printers of the bazaar.',
    synopsis: [
      'A quiet observational documentary following three printers over a single working week, framed as a study of vanishing craft and the patience of ink.',
    ],
    image: img('1637124396916-4f85d4bf9fdd'),
    gallery: [
      img('1637124396916-4f85d4bf9fdd', 1400, 1750),
      img('1612544409025-e1f6a56c1152', 1400, 900),
    ],
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Producer', name: 'Kamran Hosseinzadeh' },
      { role: 'Editor', name: 'Nima Farahani' },
    ],
  },
  {
    slug: 'in-passing',
    title: 'In Passing',
    titleFa: 'گذر',
    year: '2019',
    role: 'Actor',
    category: 'Acting',
    format: 'Feature Film',
    duration: '104 min',
    logline: 'A supporting turn as a night-shift clerk who sees everyone and is seen by none.',
    synopsis: [
      'Hosseinzadeh appeared in a supporting role, drawing on his directing instincts to build a character almost entirely from stillness and glance.',
    ],
    image: img('1628988191808-b6b86384e559'),
    gallery: [img('1628988191808-b6b86384e559', 1400, 1750), img('1763510386202-0a18d30642f8', 1400, 900)],
    credits: [
      { role: 'Directed by', name: 'M. Ahmadi' },
      { role: 'Role', name: 'Clerk' },
    ],
  },
  {
    slug: 'the-blue-hour',
    title: 'The Blue Hour',
    titleFa: 'ساعت آبی',
    year: '2018',
    role: 'Director',
    category: 'Theatre',
    format: 'Stage · One Act',
    duration: '60 min',
    logline: 'Two strangers share a bench between the last train and the first.',
    synopsis: [
      'A one-act built around real time — sixty minutes, one bench, the slow arrival of dawn projected across the back wall.',
    ],
    image: img('1558970439-add78fc68990'),
    gallery: [img('1558970439-add78fc68990', 1400, 900), img('1571173069043-82a7a13cee9f', 1400, 900)],
    credits: [
      { role: 'Director', name: 'Kamran Hosseinzadeh' },
      { role: 'Company', name: 'Independent' },
    ],
  },
]

export const featured = works.filter((w) => w.featured)
export const categories: Category[] = ['Film', 'Theatre', 'Acting', 'Production']

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug)
}

export function nextWork(slug: string) {
  const i = works.findIndex((w) => w.slug === slug)
  return works[(i + 1) % works.length]
}

export interface CreditLine {
  title: string
  titleFa?: string
  year: string
  role: string
  note?: string
}

export const filmography: { group: string; items: CreditLine[] }[] = [
  {
    group: 'Film — Direction & Writing',
    items: [
      { title: 'Latent (for her)', titleFa: 'نهفته', year: '2023', role: 'Director, Writer' },
      { title: 'Maknoon', titleFa: 'مکنون', year: '2021', role: 'Director' },
      { title: 'Salt & Paper', titleFa: 'نمک و کاغذ', year: '2020', role: 'Director, Producer' },
      { title: '24 Frames', year: '2017', role: 'Assistant Director', note: 'post-production unit' },
    ],
  },
  {
    group: 'Film — Acting',
    items: [
      { title: 'In Passing', titleFa: 'گذر', year: '2019', role: 'Supporting — Clerk' },
      { title: 'Like Someone in Love', year: '2012', role: 'Background player' },
      { title: 'Hussein, Who Said No', year: '2014', role: 'Ensemble' },
    ],
  },
  {
    group: 'Theatre',
    items: [
      { title: 'The Room That Listens', titleFa: 'اتاقی که می‌شنود', year: '2022', role: 'Director, Playwright' },
      { title: 'The Blue Hour', titleFa: 'ساعت آبی', year: '2018', role: 'Director' },
      { title: 'Notes on Leaving', year: '2016', role: 'Assistant Director' },
    ],
  },
  {
    group: 'Selected Recognition',
    items: [
      { title: 'National Short Competition', year: '2023', role: 'Official Selection — Latent (for her)' },
      { title: 'Regional Film Week', year: '2021', role: 'Special Mention — Maknoon' },
    ],
  },
]
