import { Link, useParams } from 'react-router'
import { Reveal } from '../components/Reveal'
import { categoryFa, getProject, projects } from '../data/projects'
import { Latin, Farsi, useLang } from '../i18n'
import { NotFound } from './NotFound'

export function ProjectDetail() {
  const { slug } = useParams()
  const { isFa, t, n, to, arrow, back } = useLang()
  const project = slug ? getProject(slug) : undefined
  if (!project) return <NotFound />

  const idx = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(idx + 1) % projects.length]
  const fa = project.fa

  return (
    <article>
      {/* ── Immersive header ─────────────────────────────── */}
      <header className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={project.cover.src}
            alt={t(project.cover.alt, fa.coverAlt)}
            className="h-full w-full object-cover opacity-55 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 md:px-12 md:pb-24">
          <Link
            to={to('/works')}
            className="eyebrow inline-flex items-center gap-2 text-mist transition-colors hover:text-bone"
          >
            {back} {t('Works', 'آثار')}
          </Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            {/* Mixed-language title: the page language leads, the other answers across the frame */}
            <div>
              <p className="eyebrow text-signal">{t(project.category, categoryFa[project.category])}</p>
              {isFa ? (
                <h1 className="mt-4 font-display text-[clamp(3.5rem,10vw,9rem)] !leading-[1.25] text-bone">
                  {project.titleFa}
                </h1>
              ) : (
                <h1 className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.02em] text-bone">
                  {project.title}
                </h1>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Meta + synopsis ──────────────────────────────── */}
      <section className="border-t hairline">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-12 md:px-12 md:py-28">
          <Reveal className="md:col-span-4">
            <dl className="space-y-5 font-mono text-xs">
              <Row k={t('Year', 'سال')} v={n(project.year)} />
              <Row k={t('Role', 'نقش')} v={t(project.role, fa.role)} />
              <Row k={t('Format', 'قالب')} v={t(project.format, fa.format)} />
              {project.duration && <Row k={t('Duration', 'مدت')} v={t(project.duration, fa.duration ?? project.duration)} />}
            </dl>
          </Reveal>

          <Reveal className="md:col-span-8" delay={120}>
            <p className="font-display text-3xl leading-[1.3] text-bone md:text-4xl">
              {t(project.logline, fa.logline)}
            </p>
            <div className={`mt-8 space-y-5 text-lg text-mist ${isFa ? 'leading-[1.95]' : 'leading-relaxed'}`}>
              {t(project.synopsis, fa.synopsis).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Trailer / media placeholder ──────────────────── */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
          <Reveal>
            <button className="group relative flex aspect-[21/9] w-full items-center justify-center overflow-hidden bg-graphite">
              <img
                src={project.stills[0]?.src ?? project.cover.src}
                alt={t('Trailer preview frame', 'فریم پیش‌نمایش تیزر')}
                className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale transition-opacity duration-700 group-hover:opacity-55"
              />
              <span className="relative flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-bone">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/60 transition-colors group-hover:border-signal group-hover:text-signal">
                  ▶
                </span>
                {t('Play trailer', 'پخش تیزر')}
              </span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Stills gallery ───────────────────────────────── */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <p className="eyebrow mb-10 text-steel">{t('Stills', 'عکس‌ها')}</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {project.stills.map((s, i) => (
              <Reveal
                key={i}
                delay={i * 90}
                className={i % 3 === 0 ? 'md:col-span-2' : ''}
              >
                <div className="overflow-hidden bg-graphite">
                  <img
                    src={s.src}
                    alt={t(s.alt, fa.stillsAlt[i] ?? s.alt)}
                    loading="lazy"
                    className={`w-full object-cover opacity-90 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0 ${
                      i % 3 === 0 ? 'aspect-[21/9]' : 'aspect-[4/3]'
                    }`}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credits ──────────────────────────────────────── */}
      <section className="border-t hairline">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-12 md:px-12 md:py-28">
          <Reveal className="md:col-span-4">
            <p className="eyebrow text-steel">{t('Credits', 'عوامل')}</p>
            <h2 className="mt-4 font-display text-4xl text-bone">{t('Made with', 'ساخته‌شده با')}</h2>
          </Reveal>
          <Reveal className="md:col-span-8" delay={120}>
            <dl>
              {t(project.credits, fa.credits).map((c) => (
                <div
                  key={c.role + c.name}
                  className="flex items-baseline justify-between gap-4 border-t hairline py-4"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.15em] text-steel">{c.role}</dt>
                  <span className="hidden flex-1 border-b border-dotted border-steel/30 sm:block" />
                  <dd className="text-lg text-bone">{c.name}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Next project ─────────────────────────────────── */}
      <section className="border-t hairline">
        <Link to={to(`/works/${next.slug}`)} className="group block">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-16 md:px-12 md:py-24">
            <div>
              <p className="eyebrow text-steel">{t('Next', 'بعدی')}</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-bone transition-colors group-hover:text-mist md:text-7xl">
                {t(next.title, next.titleFa)}
              </h2>
              <span className="mt-2 block text-sm text-mist">{t(next.role, next.fa.role)} — {n(next.year)}</span>
            </div>
            <span className="font-mono text-2xl text-steel transition-all duration-300 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 group-hover:text-signal md:text-4xl">
              {arrow}
            </span>
          </div>
        </Link>
      </section>
    </article>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t hairline pt-4">
      <dt className="uppercase tracking-[0.15em] text-steel">{k}</dt>
      <dd className="text-end text-bone">{v}</dd>
    </div>
  )
}
