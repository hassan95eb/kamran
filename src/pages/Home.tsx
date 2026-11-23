import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { LangSwitch, navItems, roles, useLang } from '../i18n'

// Local copies so stills load reliably in the preview (swap for real frames later)
const img = {
  hero: '/images/home/hero.gif',
  latent: '/images/home/latent.jpg',
  latentB: '/images/home/latent-b.jpg',
  love: '/images/home/love.jpg',
  frames: '/images/home/frames.jpg',
  hussein: '/images/home/hussein.jpg',
  portrait: '/images/home/portrait.jpg',
}

function useNav() {
  const { to, t, n } = useLang()
  return navItems.map((item, i) => ({ n: n(`0${i + 1}`), to: to(item.to), label: t(item.en, item.fa) }))
}

type Role = keyof typeof roles

const credits: { year: number; title: string; fa: string; role: Role; still: string }[] = [
  { year: 2023, title: 'Latent (for her)', fa: 'مکنون', role: 'Director / Producer', still: img.latent },
  { year: 2017, title: '24 Frames', fa: '۲۴ فریم', role: 'Second Assistant Director', still: img.frames },
  { year: 2012, title: 'Like Someone in Love', fa: 'مثل یک عاشق', role: 'Trainee Assistant Director', still: img.love },
  { year: 2014, title: 'Hussein, Who Said No', fa: 'رستاخیز', role: 'Actor', still: img.hussein },
]

export function Home() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return (
    <Fragment key={String(reduced)}>
      <Hero />
      <SelectedWorks />
      <Featured />
      <AboutFragment />
      <CreditRoll />
      <Closing />
    </Fragment>
  )
}

/* ── 00 · Opening frame ─────────────────────────────────────── */
/** Writes the opening shot's camera state as CSS vars: --exit (0→1 as the hero leaves)
 *  and --px/--py (eased pointer, fine pointers only). Reduced motion leaves all at 0. */
function useOpeningShot() {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let tx = 0, ty = 0, px = 0, py = 0, raf = 0
    const onMove = (e: PointerEvent) => {
      if (window.scrollY >= el.offsetHeight) return
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      kick()
    }
    const tick = () => {
      raf = 0
      const h = el.offsetHeight || 1
      const exit = Math.min(1, Math.max(0, window.scrollY / h))
      if (exit > 0) { tx = 0; ty = 0 }
      px += (tx - px) * 0.04
      py += (ty - py) * 0.04
      el.style.setProperty('--exit', exit.toFixed(4))
      el.style.setProperty('--px', px.toFixed(4))
      el.style.setProperty('--py', py.toFixed(4))
      el.style.setProperty('--life', exit >= 1 ? 'paused' : 'running')
      if (Math.abs(tx - px) + Math.abs(ty - py) > 0.001) raf = requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const reset = () => { tx = 0; ty = 0; kick() }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', reset)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    kick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', reset)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [])
  return ref
}

/** Writes --enter (0→1) on the first collaboration's frame as it rises from the bottom
 *  of the viewport to its resting line — drives the letterbox opening of the handoff. */
function useHandoff() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const tick = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.62)))
      el.style.setProperty('--enter', (p * p * (3 - 2 * p)).toFixed(4))
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    kick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [])
  return ref
}

/** Writes each collaboration's montage state as CSS vars on its [data-shot] frame:
 *  --s  signed passage (+1 entering below … 0 centred … −1 gone above), eased with light inertia
 *  --arrive 0→1 as the shot opens, --leave 0→1 as it hands off, --on 1→0 as it stops being dominant. */
function useMontage(dep: unknown) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const shots = Array.from(root.querySelectorAll<HTMLElement>('[data-shot]'))
    const cur = shots.map(() => NaN)
    const ss = (x: number) => {
      const c = Math.min(1, Math.max(0, x))
      return c * c * (3 - 2 * c)
    }
    let raf = 0
    const frame = () => {
      const vh = window.innerHeight
      let busy = false
      shots.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const target = ((r.top + r.bottom) / 2 - vh / 2) / (vh / 2 + r.height / 2)
        const c = Number.isNaN(cur[i]) ? target : cur[i] + (target - cur[i]) * 0.14
        if (Math.abs(target - c) > 0.0004) busy = true
        cur[i] = c
        const s = Math.max(-1.2, Math.min(1.2, c))
        el.style.setProperty('--s', s.toFixed(4))
        el.style.setProperty('--arrive', (1 - ss((s - 0.05) / 0.7)).toFixed(4))
        el.style.setProperty('--leave', ss((-s - 0.12) / 0.78).toFixed(4))
        el.style.setProperty('--on', (1 - ss(Math.abs(s) / 0.85)).toFixed(4))
      })
      raf = busy ? requestAnimationFrame(frame) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    kick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [dep])
  return ref
}

function Hero() {
  const { isFa, t, n, to } = useLang()
  const nav = useNav()
  const shot = useOpeningShot()
  return (
    <section ref={shot} className="opening relative h-[100svh] min-h-[720px] overflow-hidden">
      <div className="opening__camera absolute inset-0">
      {/* Image: letterboxed, pushed to the reading end, bleeding off the edge. The still itself is never flipped. */}
      <div className="iris absolute inset-x-0 top-[15%] bottom-[24%] bg-graphite md:start-[21%]">
        {/* Back plane. The breathing wrapper is the drop-in slot for the future portrait loop:
            swap <img> for <video autoPlay muted loop playsInline> with the same classes. */}
        <div className="opening__plate h-full w-full overflow-hidden">
        <div className="opening__breath h-full w-full">
        <img
          src={img.hero}
          alt={t('A silhouetted figure against a window in an emptied apartment', 'پیکری در ضدنور، کنار پنجرهٔ آپارتمانی خالی')}
          className="opening__still still h-full w-full object-cover object-[50%_40%]"
        />
        </div>
        </div>
        <span className="absolute start-0 top-0 h-3 w-3 bg-signal" aria-hidden />
        <span className="opening__front meta home-meta absolute bottom-[clamp(4rem,8vw,8rem)] end-4 text-bone/90">
          <span className="text-signal">■</span>{' '}
          {t(
            <>Latent (for her) — 2023 · frame 00:41:07</>,
            <>مکنون — {n(2023)} · فریم {n('00:41:07')}</>,
          )}
        </span>
      </div>

      {/* Identity mark + index, a narrow start column like a title card */}
      <header className="absolute start-6 top-6 z-20 flex items-baseline gap-6 md:start-10 md:top-8">
        <Link to={to('/')} className="meta block text-bone" aria-label={t('Kamran Hosseinzadeh — home', 'کامران حسین‌زاده — خانه')}>
          {t('K—H', 'ک—ح')}
        </Link>
        <LangSwitch className="md:hidden" />
      </header>

      <nav className="absolute start-6 top-[15%] z-20 hidden md:start-10 md:block" aria-label={t('Main', 'اصلی')}>
        <ul className="space-y-1.5">
          {nav.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="group flex items-baseline gap-4">
                <span className="meta home-meta text-mist/75 transition-colors group-hover:text-signal">{item.n}</span>
                <span
                  className={`condensed font-medium uppercase leading-none text-bone/90 transition-[color,letter-spacing] duration-500 group-hover:tracking-[0.04em] group-hover:text-bone ${
                    isFa ? 'text-[1.5rem]' : 'text-[1.45rem]'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <LangSwitch className="mt-6" />
      </nav>

      <nav className="absolute end-6 top-6 z-20 flex gap-5 md:hidden" aria-label={t('Main', 'اصلی')}>
        {nav.map((item) => (
          <Link key={item.to} to={item.to} className="meta home-meta uppercase text-bone/90">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* The full name as a quiet credit at the far reading end */}
      {t(
        <p className="opening__front absolute end-6 top-[6%] z-20 hidden font-display text-[2rem] italic leading-none text-mist md:end-10 md:block">
          Kamran Hosseinzadeh
        </p>,
        <p className="opening__front fa-display absolute end-6 top-[5.5%] z-20 hidden text-3xl !leading-none text-mist md:end-10 md:block">
          کامران حسین‌زاده
        </p>,
      )}

      {/* Name: given name crosses the image top edge, surname sits across the bottom */}
      {isFa ? (
        <h1 className="opening__mid pointer-events-none relative z-10 h-full">
          <span className="opening__given rise fa-display absolute start-[19%] top-[calc(15%-0.78em)] text-[clamp(3.5rem,9vw,9rem)] !leading-[1.2] text-bone mix-blend-difference">
            کامران
          </span>
          <span
            className="opening__surname rise fa-display absolute bottom-[calc(24%-0.62em)] inset-x-0 block whitespace-nowrap px-4 text-center text-[clamp(5rem,19vw,18rem)] !leading-[1.15] text-bone mix-blend-difference"
            style={{ animationDelay: '250ms' }}
          >
            حسین‌زاده
          </span>
        </h1>
      ) : (
        <h1 className="opening__mid pointer-events-none relative z-10 h-full">
          <span className="opening__given rise absolute start-[19%] top-[calc(15%-0.55em)] font-display text-[clamp(4rem,10.5vw,10rem)] italic leading-none text-bone mix-blend-difference">
            Kamran
          </span>
          <span
            className="opening__surname rise condensed absolute bottom-[calc(24%-0.42em)] inset-x-0 block whitespace-nowrap px-4 text-center text-[clamp(4.5rem,16.4vw,15.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.02em] text-bone mix-blend-difference"
            style={{ animationDelay: '250ms' }}
          >
            Hosseinzadeh
          </span>
        </h1>
      )}

      {/* Bottom strip: roles + location, quiet */}
      <div className="opening__front absolute inset-x-6 bottom-7 z-20 grid grid-cols-12 items-end gap-4 md:inset-x-10">
        <p className="meta home-meta col-span-6 text-mist md:col-span-3">
          <span className="text-signal">{t('Filmmaker', roles.Filmmaker)}</span>
          <br />
          <span className="text-mist/80">{t('Director · Writer · Producer', `${roles.Director} · ${roles.Writer} · ${roles.Producer}`)}</span>
        </p>
        <p className="meta home-meta col-span-3 hidden text-mist/75 md:block">
          {t('Cinema and theatre', 'سینما و تئاتر')}
          <br />
          {t('Tehran, since 2012', `تهران، از ${n(2012)}`)}
        </p>
        <p className="meta home-meta col-span-6 text-end text-mist/75 md:col-span-6">
          {t('Scroll — selected works', 'ادامه — همکاری‌های منتخب')} ↓
        </p>
      </div>
      </div>
    </section>
  )
}

/* ── Selected works: each title is staged differently ───────── */
function SelectedWorks() {
  const { isFa, t, n, to } = useLang()
  const kiarostami = t('Feature · dir. Abbas Kiarostami', 'بلند · کارگردان: عباس کیارستمی')
  const handoff = useHandoff()
  const montage = useMontage(isFa)
  return (
    <section
      ref={montage}
      className="act-one montage relative z-10 bg-ink px-6 pb-40 pt-32 md:px-10"
      style={{ ['--dir' as string]: isFa ? -1 : 1, ['--tk' as string]: isFa ? 0.75 : 1 }}
    >
      <div className="mb-24 grid grid-cols-12 gap-4">
        <p className="meta home-meta col-span-12 text-mist/80 md:col-span-3">
          {t(`Selected collaborations, 2012 — 2017`, `${roles['Selected Collaborations']}، ${n(2012)} — ${n(2017)}`)}
        </p>
        {isFa ? (
          <p className="col-span-12 max-w-lg font-display text-[1.9rem] text-mist md:col-span-6 md:col-start-5">
            سه فیلم، سه نقش متفاوت. <em className="text-bone">کارنامه‌ای که سر صحنهٔ فیلم‌های <span className="text-signal">دیگران</span> شکل گرفت.</em>
          </p>
        ) : (
          <p className="col-span-12 max-w-md font-display text-3xl leading-[1.1] text-mist md:col-span-5 md:col-start-5">
            Three films, three different roles. <em className="text-bone">A career shaped on <span className="text-signal">other people’s</span> sets.</em>
          </p>
        )}
      </div>

      {/* 01 · Like Someone in Love — image-dominant, ultra-wide crop */}
      <WorkChapter n="01" title="Like Someone in Love" fa="مثل یک عاشق" year={2012} className="-top-14" />
      <div>
        <Link to={to('/credits')} data-shot className="group relative block">
          <div className="love-plate grid grid-cols-12 gap-4">
            <div ref={handoff} className="handoff col-span-12 overflow-hidden bg-graphite md:col-span-10 md:col-start-3">
              <img
                src={img.love}
                alt={t('A figure seated in a dim interior, lit from the side', 'پیکری نشسته در فضایی نیمه‌تاریک، با نوری از کنار')}
                className="still aspect-[2.76/1] w-full object-cover group-hover:[transform:scale(1.03)] group-hover:brightness-100"
              />
            </div>
          </div>
          <div className={`relative grid grid-cols-12 gap-4 ${isFa ? '-mt-[0.6em]' : '-mt-[0.5em] md:-mt-[0.55em]'}`}>
            {isFa ? (
              <h3 className="love-type col-span-12 font-display text-[clamp(3rem,7.5vw,7.25rem)] !leading-[1.25] text-bone md:col-span-9">
                مثل یک
                <br />
                <span className="ps-[1.6em]">عاشق</span>
              </h3>
            ) : (
              <h3 className="love-type col-span-12 font-display text-[clamp(3rem,7.5vw,7.25rem)] leading-[0.9] text-bone md:col-span-9">
                Like Someone
                <br />
                <span className="ps-[1.6em] italic">in Love</span>
              </h3>
            )}
            <WorkMeta n="01" year={2012} role="Trainee Assistant Director" format={kiarostami} className="md:col-span-3 md:self-end" />
          </div>
        </Link>
      </div>

      {/* 02 · 24 Frames — typography dominates; tiny frame */}
      <WorkChapter n="02" title="24 Frames" fa="۲۴ فریم" year={2017} className="top-20" />
      <div className="mt-48">
        <Link to={to('/credits')} data-shot className="group relative grid grid-cols-12 items-center gap-4">
          <WorkMeta n="02" title={t('24 Frames', '۲۴ فریم')} year={2017} role="Second Assistant Director" format={kiarostami} className="order-2 md:order-1 md:col-span-2" />
          <div className="relative order-1 col-span-12 md:order-2 md:col-span-10">
            {isFa ? (
              <h3 aria-hidden="true" className="fr-type condensed text-[clamp(5.5rem,23vw,22rem)] font-extrabold leading-[1.05] text-graphite transition-colors duration-700 group-hover:text-steel">
                ۲۴ فریم
              </h3>
            ) : (
              <h3 aria-hidden="true" className="fr-type condensed text-[clamp(6rem,26vw,25rem)] font-semibold uppercase leading-[0.78] tracking-[-0.03em] text-graphite transition-colors duration-700 group-hover:text-steel">
                24 Frames
              </h3>
            )}
            <div className="fr-plate absolute start-[38%] top-1/2 w-[22%] -translate-y-1/2 overflow-hidden bg-graphite transition-[width] duration-1000 group-hover:w-[30%] outline outline-0 outline-signal group-hover:outline-2">
              <div className="fr-open">
                <img
                  src={img.frames}
                  alt={t('Trees dissolving into winter fog', 'درختانی که در مه زمستانی محو می‌شوند')}
                  className="still aspect-[7/5] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 03 · Hussein, Who Said No — tall crop offset, vertical title */}
      <WorkChapter n="03" title="Hussein, Who Said No" fa="رستاخیز" year={2014} className="top-20" />
      <div className="mt-48">
        <Link to={to('/credits')} data-shot className="group grid grid-cols-12 gap-4">
          <div className="col-span-7 md:col-span-3 md:col-start-6">
            <div className="hus-plate overflow-hidden bg-graphite">
              <img
                src={img.hussein}
                alt={t('Figures moving through a dim colonnade', 'پیکرهایی در حال گذر از رواقی نیمه‌تاریک')}
                className="still aspect-[9/13] w-full object-cover [clip-path:inset(0_18%_0_18%)] group-hover:[clip-path:inset(0_0_0_0)]"
              />
            </div>
          </div>
          <div className="col-span-5 flex flex-col justify-between md:col-span-4">
            {isFa ? (
              <h3 className="hus-type font-display text-[clamp(2.75rem,5.4vw,5.25rem)] !leading-[1.3] text-bone">
                رستاخیز
              </h3>
            ) : (
              <h3 className="hus-type font-display text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[0.95] text-bone">
                Hussein,
                <br />
                <em className="text-mist">Who Said</em>
                <br />
                No
              </h3>
            )}
            <WorkMeta n="03" year={2014} role="Actor" format={t('Feature · dir. Ahmad Reza Darvish', 'بلند · کارگردان: احمدرضا درویش')} className="hus-meta" />
          </div>
        </Link>
      </div>
    </section>
  )
}

function WorkChapter({ n, title, fa, year, className }: { n: string; title: string; fa: string; year: number; className: string }) {
  const { isFa, n: num, t } = useLang()
  return (
    <div className="pointer-events-none relative h-0" aria-hidden="true">
      <div className={`absolute inset-x-0 grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 border-t border-mist/30 pt-4 md:grid-cols-[minmax(0,1fr)_minmax(0,4fr)_auto] ${className}`}>
        <span className="meta home-meta text-signal">{num(n)}<span className="ms-3 hidden text-mist/80 md:inline">{t('/ FILM CREDIT', '/ همکاری سینمایی')}</span></span>
        {isFa ? (
          <p className="flex flex-wrap items-baseline gap-x-3 text-base font-medium text-bone md:text-lg">
            {fa}
          </p>
        ) : (
          <p className="font-sans text-sm font-medium tracking-[-0.01em] text-bone md:text-lg">{title}</p>
        )}
        <span className="meta home-meta text-mist">{num(year)}</span>
      </div>
    </div>
  )
}

function WorkMeta({
  n,
  title,

  year,
  role,
  format,
  className = '',
}: {
  n: string
  title?: string

  year: number
  role: Role
  format: string
  className?: string
}) {
  const { t, n: num } = useLang()
  return (
    <dl className={`meta home-meta col-span-12 grid grid-cols-[2.5rem_1fr] gap-y-1 border-t border-steel/45 pt-3 ${className}`}>
      {title && (
        <>
          <dt className="sr-only">{t('Project title', 'عنوان پروژه')}</dt>
          <dd className="col-span-2 mb-3">
            <h3 className="font-sans text-xl font-medium tracking-[-0.02em] text-bone">{title}</h3>
          </dd>
        </>
      )}
      <dt className="work-index text-signal transition-colors group-hover:text-bone">{num(n)}</dt>
      <dd className="text-bone"><span className="sr-only">{t('Year ', 'سال ')}</span>{num(year)}</dd>
      <dt className="home-role-label col-span-2 mt-3 text-[0.5625rem] uppercase tracking-[0.14em] text-mist/85">{t('Kamran’s role', 'نقش کامران')}</dt>
      <dd className="col-span-2 font-sans text-sm font-medium leading-[1.5] tracking-normal text-bone">{t(role, roles[role])}</dd>
      <dt className="sr-only">{t('Format', 'قالب')}</dt>
      <dd className="col-span-2 mt-1 text-mist/80">{format}</dd>
    </dl>
  )
}

/* ── 01 · Featured: presented like a screening, on a bone ground ── */
/** Act II · the authored film. Writes chapter progress on the Maknoun section:
 *  --enter (light frame opens over the dark field), --title, --open (the still's crop widens),
 *  --meta (role settles last), --release (energy lets go toward About). Values saturate early,
 *  so the middle of the section is still. Reduced motion keeps every var at its settled 1/0. */
function useChapter(dep: unknown) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const still = root.querySelector<HTMLElement>('[data-film]')
    const info = root.querySelector<HTMLElement>('[data-info]')
    const ss = (x: number) => {
      const c = Math.min(1, Math.max(0, x))
      return c * c * (3 - 2 * c)
    }
    const keys = ['--enter', '--title', '--title2', '--open', '--meta', '--release']
    const cur = keys.map(() => NaN)
    let raf = 0
    const frame = () => {
      const vh = window.innerHeight
      const r = root.getBoundingClientRect()
      const st = still ? still.getBoundingClientRect().top : r.top
      const it = info ? info.getBoundingClientRect().top : r.bottom
      const target = [
        ss((vh - r.top) / (vh * 0.65)),
        ss((vh * 0.8 - r.top) / (vh * 0.55)),
        ss((vh * 0.68 - r.top) / (vh * 0.55)),
        ss((vh * 0.95 - st) / (vh * 0.6)),
        ss((vh * 0.95 - it) / (vh * 0.3)),
        ss((vh * 0.75 - r.bottom) / (vh * 0.6)),
      ]
      let busy = false
      target.forEach((t, i) => {
        const c = Number.isNaN(cur[i]) ? t : cur[i] + (t - cur[i]) * 0.12
        if (Math.abs(t - c) > 0.0005) busy = true
        cur[i] = c
        root.style.setProperty(keys[i], c.toFixed(4))
      })
      raf = busy ? requestAnimationFrame(frame) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    kick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [dep])
  return ref
}

function Featured() {
  const { isFa, t, n, to, arrow } = useLang()
  const chapter = useChapter(isFa)
  return (
    <section ref={chapter} className="chapter relative bg-ink text-ink" style={{ ['--dir' as string]: isFa ? -1 : 1 }}>
      {/* back plane: the light field enters as a new frame inside the remaining dark */}
      <div aria-hidden className="ch-field absolute inset-0 bg-bone" />
      <div className="ch-cue relative grid grid-cols-12 gap-4 px-6 pt-10 md:px-10">
        <p className="meta col-span-6 md:col-span-3">
          <span className="me-2 inline-block h-2 w-2 bg-signal align-middle" aria-hidden />{t('Authored work', 'اثر شخصی')}
        </p>
        <p className="meta col-span-6 text-steel md:col-span-4 md:col-start-9 md:text-end">
          {t('A film by Kamran Hosseinzadeh', 'فیلمی از کامران حسین‌زاده')}
        </p>
      </div>

      {/* Bilingual title: both names are display type; the page language takes the lead */}
      {isFa ? (
        <div className="relative top-6 mt-10 grid grid-cols-12 items-end gap-4 px-6 md:px-10">
          <h2 className="ch-title col-span-12 font-display text-[clamp(5rem,13vw,13rem)] !leading-[1.05] md:col-span-8">
            مکنون
          </h2>
          <p className="ch-title2 col-span-12 pb-[0.4em] font-display text-[clamp(2.75rem,5.6vw,5.5rem)] !leading-[1.2] text-steel md:col-span-4 md:text-end">
            (برای او)
          </p>
        </div>
      ) : (
        <div className="relative top-6 mt-10 grid grid-cols-12 gap-4 px-6 md:px-10">
          <h2 className="ch-title col-span-12 font-display text-[clamp(4rem,11vw,11rem)] leading-[0.82] tracking-[-0.02em] md:col-span-10 md:col-start-3">
            Latent <em className="ch-title2 inline-block text-steel">(for her)</em>
          </h2>
        </div>
      )}

      {/* Full-bleed still; hovering opens it to its full frame */}
      <div
        data-film
        className="ch-film relative mt-8 overflow-hidden"
      >
        <img
          src={img.latent}
          alt={t('A woman standing in silhouette before a window', 'زنی در ضدنور، ایستاده مقابل پنجره')}
          className="ch-still still h-[78vh] w-full object-cover"
        />
        <div className="ch-inset absolute bottom-[12%] end-6 hidden w-[19%] overflow-hidden bg-graphite md:end-10 md:block">
          <img src={img.latentB} alt={t('A long shadow across a wall', 'سایه‌ای بلند روی دیوار')} className="still aspect-[9/11] w-full object-cover" />
        </div>
      </div>

      <div data-info className="ch-info relative grid grid-cols-12 gap-4 px-6 pb-40 pt-12 md:px-10 md:pb-48">
        <dl className={`meta col-span-12 grid gap-y-1.5 md:col-span-3 ${isFa ? 'grid-cols-[7rem_1fr]' : 'grid-cols-[6rem_1fr]'}`}>
          <dt className="text-steel">{t('Year', 'سال')}</dt>
          <dd>{n(2023)}</dd>
          <dt className="text-steel">{t('Kamran’s role', 'نقش کامران')}</dt>
          <dd className="font-medium text-signal">{t('Director / Producer', roles['Director / Producer'])}</dd>
          <dt className="text-steel">{t('Format', 'قالب')}</dt>
          <dd>{t('Feature, available light', 'بلند، با نور موجود')}</dd>
          <dt className="text-steel">{t('Shot in', 'لوکیشن')}</dt>
          <dd>{t('Tehran, northern edge', 'حاشیهٔ شمالی تهران')}</dd>
        </dl>
        {isFa ? (
          <p className="col-span-12 mt-8 max-w-[30ch] font-display text-[1.6rem] md:col-span-4 md:col-start-5 md:mt-0">
            زنی به خانه‌ای برمی‌گردد که روزی از آن گریخته بود. در سه روز، اتاق‌ها بیش از خودش به یاد می‌آورند.
          </p>
        ) : (
          <p className="col-span-12 mt-8 max-w-[34ch] font-display text-[1.75rem] leading-[1.15] md:col-span-4 md:col-start-5 md:mt-0">
            A woman returns to the house she once fled. Over three days, the rooms remember more than she does.
          </p>
        )}
        <div className="col-span-12 mt-8 flex items-end md:col-span-3 md:col-start-10 md:mt-0 md:justify-end">
          <Link
            to={to('/works/latent-for-her')}
            className="group condensed inline-flex items-baseline gap-3 text-2xl font-medium uppercase"
          >
            <span className="border-b-2 border-ink pb-0.5 transition-colors group-hover:border-signal">{t('Enter the film', 'ورود به فیلم')}</span>
            <span className="text-signal transition-transform duration-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2">{arrow}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Shared scroll helpers for the descent ───────────────────── */
function useSeen<T extends HTMLElement>(margin = '0px 0px -12% 0px', threshold = 0) {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: margin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin, threshold])
  return [ref, seen] as const
}

/** About yields slightly to the first credit; the portrait and text stay still. */
function useGlide(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const run = () => {
      raf = 0
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      const x = Math.min(1, Math.max(0, (vh * 0.75 - r.bottom) / (vh * 0.75)))
      el.style.setProperty('--leave', (x * x * (3 - 2 * x)).toFixed(4))
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    run()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [ref])
}

/* ── About: reflection. A sentence with a portrait set inside it ── */
function AboutFragment() {
  const { isFa, t, to, arrow } = useLang()
  const [ref, seen] = useSeen<HTMLElement>('0px 0px -15% 0px')
  useGlide(ref)
  const portrait = (
    <span className="mx-[0.25em] inline-block h-[0.9em] w-[1.6em] translate-y-[0.12em] overflow-hidden bg-graphite align-baseline">
      <img src={img.portrait} alt={t('Kamran Hosseinzadeh, eyes closed, in low light', 'کامران حسین‌زاده با چشمان بسته، در نور کم')} className="still about-portrait h-full w-full object-cover" />
    </span>
  )
  return (
    <section ref={ref} className={`about relative px-6 py-40 md:px-10 ${seen ? 'is-in' : ''}`}>
      <div className="about-hold">
        <div className="grid grid-cols-12 gap-4">
          <p className="calm meta col-span-12 text-steel md:col-span-2">
            {t('On Kamran', 'دربارهٔ کامران')}
            <br />
            {t('Cinema & theatre', 'سینما و تئاتر')}
          </p>
          <div className="calm col-span-12 md:col-span-9" style={{ ['--d' as string]: '180ms' }}>
            {isFa ? (
              // Persian is set for its own measure: slightly smaller, open leading, its own line breaks
              <p className="font-display text-[clamp(2rem,4.1vw,3.9rem)] !leading-[1.7] text-mist">
                کار او میان سینما و تئاتر در حرکت است —
                {portrait}
                از نقش‌هایی در گروه کارگردانی، تولید و بازیگری تا <span className="text-bone">کارگردانی و تهیه‌کنندگی</span> فیلم‌های <span className="about-accent">خودش</span>.
              </p>
            ) : (
              <p className="font-display text-[clamp(2.25rem,4.8vw,4.6rem)] leading-[1.04] text-mist">
                His work moves across cinema and theatre —
                {portrait}
                from roles within directing teams, production, and performance to <span className="text-bone">directing and producing</span>
                {' '}films of his <em className="about-accent">own</em>.
              </p>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-12 gap-4">
          {/* The second language answers in a quieter voice */}
          {t(
            <p className="calm col-span-12 font-display text-xl italic leading-[1.4] text-steel md:col-span-4 md:col-start-3" style={{ ['--d' as string]: '400ms' }}>
              Director, writer, producer and actor — in cinema and theatre.
            </p>,
            <p className="calm col-span-12 text-lg leading-[1.9] text-steel md:col-span-4 md:col-start-3" style={{ ['--d' as string]: '400ms' }}>
              کارگردان، نویسنده، تهیه‌کننده و بازیگر — در سینما و تئاتر.
            </p>,
          )}
          <Link
            to={to('/about')}
            style={{ ['--d' as string]: '520ms' }}
            className="calm meta col-span-12 self-end uppercase text-mist hover:text-bone md:col-span-3 md:col-start-10 md:text-end"
          >
            {t('Read the longer version', 'روایت کامل‌تر')} {arrow}
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Credits: an end-roll, centred on the gutter ─────────────── */
function CreditRoll() {
  const [active, setActive] = useState<number | null>(null)
  const { isFa, t, n, to, arrow } = useLang()
  const [ref, seen] = useSeen<HTMLElement>('0px 0px -10% 0px')
  const sorted = [...credits].sort((a, b) => b.year - a.year)

  return (
    <section ref={ref} className={`relative border-t border-graphite bg-ink px-6 pb-48 pt-32 md:px-10 md:pb-64 ${seen ? 'is-in' : ''}`}>
      <p className="calm condensed mb-20 text-center text-2xl font-medium uppercase tracking-[0.08em] text-mist">{t('Selected credits', 'سوابق منتخب')}</p>
      <ul className="mx-auto max-w-6xl">
        {sorted.map((c, i) => {
          const dim = active !== null && active !== i ? 'opacity-75' : ''
          const yearTone = active === i || c.role.startsWith('Director') ? 'text-signal' : 'text-mist/75'
          const still = (
            <span aria-hidden className="memory" data-on={active === i}>
              <img src={c.still} alt="" loading="lazy" />
            </span>
          )
          const rowProps = {
            onPointerEnter: (e: React.PointerEvent<HTMLLIElement>) => {
              if (e.pointerType === 'mouse' && window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)').matches) setActive(i)
            },
            onPointerLeave: () => setActive(null),
            style: { ['--d' as string]: `${300 + i * 130}ms` },
          }
          return isFa ? (
            /* Persian end-roll reads title → year → role from the right; both sides still hug the year gutter */
            <li
              key={c.title}
              {...rowProps}
              className={`credit-row grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-7 md:grid-cols-[minmax(0,7fr)_4rem_minmax(0,3fr)] md:gap-x-10 ${dim}`}
            >
              <span className="credit-title order-2 col-start-2 row-start-1 flex flex-wrap items-baseline gap-x-4 gap-y-1 md:order-1 md:col-start-auto md:row-start-auto md:justify-end">
                <span className="fa-display text-[clamp(2rem,3.8vw,3.5rem)] !leading-[1.6] text-bone">{c.fa}</span>
              </span>
              <span className={`meta home-meta order-1 row-start-1 md:order-2 md:row-start-auto md:text-center ${yearTone}`}>{n(c.year)}</span>
              <span className="meta home-meta order-3 col-start-2 text-mist md:col-start-auto">{roles[c.role]}</span>
              {still}
            </li>
          ) : (
            <li
              key={c.title}
              {...rowProps}
              className={`credit-row grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-7 md:grid-cols-[minmax(0,3fr)_4rem_minmax(0,7fr)] md:gap-x-10 ${dim}`}
            >
              <span className="meta home-meta order-3 col-start-2 text-mist md:order-1 md:col-start-auto md:text-right">{c.role}</span>
              <span className={`meta home-meta order-1 row-start-1 md:order-2 md:row-start-auto ${yearTone}`}>{c.year}</span>
              <span className="credit-title order-2 col-start-2 row-start-1 flex flex-wrap items-baseline gap-x-4 gap-y-2 md:order-3 md:col-start-auto md:row-start-auto">
                <span className="condensed text-[clamp(1.85rem,3.6vw,3.25rem)] font-medium uppercase leading-[1.05] tracking-[-0.015em] text-bone">
                  {c.title}
                </span>
              </span>
              {still}
            </li>
          )
        })}
      </ul>
      <p className="calm mt-16 text-center" style={{ ['--d' as string]: '1000ms' }}>
        <Link to={to('/credits')} className="meta uppercase text-mist transition-colors hover:text-bone">
          {t('Full filmography, cinema and stage', 'فیلم‌شناسی کامل، سینما و صحنه')} {arrow}
        </Link>
      </p>
    </section>
  )
}

/* ── Closing frame: the last shot — words, address, credits, name ── */
const elsewhere = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'IMDb', href: 'https://imdb.com' },
  { label: 'TiWall', href: 'https://tiwall.com' },
]

function Closing() {
  const { isFa, t, n } = useLang()
  const nav = useNav()
  const [ref, seen] = useSeen<HTMLElement>('0px 0px -18% 0px')
  const [nameRef, final] = useSeen<HTMLDivElement>('0px', 0.3)

  const email = (
    <a href="mailto:studio@kamranhosseinzadeh.com" lang="en" dir="ltr" className="end-email group">
      <span className="end-email__text">studio@kamranhosseinzadeh.com</span>
      <span aria-hidden className="end-email__arrow">↗</span>
    </a>
  )

  const credits = (
    <div className={`end-credits meta grid gap-x-10 gap-y-6 text-mist ${isFa ? 'sm:grid-cols-[auto_auto] sm:justify-start' : 'sm:grid-cols-[auto_auto_1fr]'}`}>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {nav.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="end-link">
              <span className="text-steel">{item.n}</span> {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-x-6 gap-y-2" lang="en" dir="ltr">
        {elsewhere.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer" className="end-link">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      {!isFa && <p className="text-steel sm:text-end">© {n(new Date().getFullYear())}</p>}
    </div>
  )

  return (
    <footer ref={ref} className={`end-frame relative overflow-hidden border-t hairline bg-ink ${seen ? 'is-seen' : ''} ${final ? 'is-final' : ''}`}>
      {isFa ? (
        /* FA — the sentence holds the right edge in two calm nastaliq lines;
           the Latin address answers from the left, where Latin reads from. */
        <div className="grid grid-cols-12 gap-x-4 px-6 pt-24 md:px-10 md:pt-36">
          <p className="end-step eyebrow col-span-12 flex items-center gap-3 text-mist">
            <span aria-hidden className="h-px w-6 bg-signal" />
            تماس
          </p>
          <h2 className="end-step end-mask font-display col-span-12 mt-6 text-[clamp(2.6rem,6.6vw,6.25rem)] !leading-[1.55] text-bone md:col-span-10 lg:col-span-8" style={{ ['--d' as string]: '250ms' }}>
            برای فیلم‌ها، ایده‌ها
            <br />
            و همکاری‌های <span className="text-mist">تازه</span>
            <span className="text-signal">.</span>
          </h2>
          <div className="end-step col-span-12 mt-14 flex md:mt-10 md:justify-end" style={{ ['--d' as string]: '450ms' }}>
            {email}
          </div>
          <div className="end-step end-secondary col-span-12 mt-20 flex flex-col gap-6 border-t hairline pt-6 md:flex-row md:items-start md:justify-between" style={{ ['--d' as string]: '650ms' }}>
            {credits}
            <p className="meta text-steel">© {n(new Date().getFullYear())}</p>
          </div>
        </div>
      ) : (
        /* EN — label in the gutter, sentence set off-axis, address hung under its last line */
        <div className="grid grid-cols-12 gap-x-4 px-6 pt-24 md:px-10 md:pt-36">
          <p className="end-step eyebrow col-span-12 flex items-center gap-3 text-mist md:col-span-2 md:pt-5">
            <span aria-hidden className="h-px w-6 bg-signal" />
            Contact
          </p>
          <h2 className="end-step end-mask font-display col-span-12 mt-6 text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-[-0.015em] text-bone md:col-span-10 md:mt-0 lg:col-span-9" style={{ ['--d' as string]: '250ms' }}>
            For films, ideas
            <br />
            and collaborations
            <br />
            <em className="text-mist">worth exploring</em>
            <span className="text-signal">.</span>
          </h2>
          <div className="end-step col-span-12 mt-14 md:col-start-3 md:col-span-10" style={{ ['--d' as string]: '450ms' }}>
            {email}
          </div>
          <div className="end-step end-secondary col-span-12 mt-20 border-t hairline pt-6 md:col-start-3 md:col-span-10" style={{ ['--d' as string]: '650ms' }}>
            {credits}
          </div>
        </div>
      )}

      {/* the name — the final frame, cropped by the bottom edge. One slow settle from below the crop. */}
      <div ref={nameRef} className="relative">
        <span aria-hidden className="end-mark" style={isFa ? { ['--mark-top' as string]: '18%' } : undefined} />
        {isFa ? (
          <div aria-hidden className="end-name mt-16 select-none overflow-hidden px-4 md:mt-20 md:px-8">
            <div className="end-name__plate" style={{ ['--name-from' as string]: '92%' }}>
              <p className="fa-display -mb-[0.38em] whitespace-nowrap text-start text-[clamp(4.5rem,15.5vw,15rem)] !leading-[1.7] text-bone">
                کامران حسین‌زاده
              </p>
            </div>
          </div>
        ) : (
          <div aria-hidden className="end-name mt-20 select-none overflow-hidden md:mt-24">
            <div className="end-name__plate">
              <p className="font-display mb-[-0.15em] px-6 text-[clamp(1.75rem,3.4vw,3.25rem)] italic leading-none text-mist md:px-10">
                Kamran
              </p>
              <p className="condensed -mb-[0.2em] whitespace-nowrap px-3 text-[16.6vw] font-semibold uppercase leading-[0.82] tracking-[-0.025em] text-bone md:px-6">
                Hosseinzadeh
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
