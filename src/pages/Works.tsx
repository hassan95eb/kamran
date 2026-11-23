import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { categories, categoryFa, projects, type Category } from '../data/projects'
import { Latin, Farsi, useLang } from '../i18n'

type Filter = 'All' | Category

export function Works() {
  const { isFa, t, n, to } = useLang()
  const [filter, setFilter] = useState<Filter>('All')
  const label = (f: Filter) => (f === 'All' ? t('All', 'همه') : t(f, categoryFa[f]))
  const filters: Filter[] = ['All', ...categories]

  const shown = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-32 pt-36 md:px-12 md:pt-48">
      {/* Header */}
      <header className="border-b hairline pb-12">
        <p className="eyebrow flex items-center gap-3 text-mist">
          <span className="h-px w-8 bg-signal" />
          {t('Archive', 'آرشیو')}
        </p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-6xl leading-[0.95] text-bone md:text-8xl">{t('Works', 'آثار')}</h1>
          <p className="max-w-md text-mist md:text-end">
            {t(
              `A catalogue of films, stage work and collaborations — ${projects.length} selected entries, ordered by recency.`,
              `فهرستی از فیلم‌ها، کارهای صحنه‌ای و همکاری‌ها — ${n(projects.length)} عنوان منتخب، به ترتیب تازگی.`,
            )}
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-[68px] z-30 -mx-6 mb-2 bg-ink/85 px-6 py-5 backdrop-blur-md md:top-[76px] md:mx-0 md:px-0">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {filters.map((f) => {
            const active = filter === f
            const count = f === 'All' ? projects.length : projects.filter((p) => p.category === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  active ? 'text-bone' : 'text-steel hover:text-mist'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    active ? 'bg-signal' : 'bg-transparent group-hover:bg-steel'
                  }`}
                />
                {label(f)}
                <sup className="text-[9px] text-steel">{n(count)}</sup>
              </button>
            )
          })}
        </div>
      </div>

      {/* Archive rows */}
      <ul className="mt-4">
        {shown.map((p, i) => (
          <li key={p.slug}>
            <Link
              to={to(`/works/${p.slug}`)}
              className="group grid grid-cols-12 items-center gap-4 border-t hairline py-6 transition-colors"
            >
              <span className="col-span-2 font-mono text-xs text-steel md:col-span-1">
                {n(String(i + 1).padStart(2, '0'))}
              </span>

              <div className="col-span-10 md:col-span-5">
                {/* Page language leads; the other title follows, isolated */}
                <h2 className="font-display text-3xl text-bone transition-colors group-hover:text-mist md:text-4xl">
                  {t(p.title, p.titleFa)}
                </h2>
              </div>

              {/* Thumbnail reveals on hover (desktop) */}
              <div className="col-span-6 hidden md:col-span-3 md:block">
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-graphite opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <img
                    src={p.cover.src}
                    alt={t(p.cover.alt, p.fa.coverAlt)}
                    loading="lazy"
                    className="h-full w-full scale-105 object-cover grayscale transition-transform duration-700 group-hover:scale-100"
                  />
                </div>
              </div>

              <span className="col-span-6 text-sm text-mist md:col-span-2">{t(p.role, p.fa.role)}</span>
              <div className="col-span-6 flex items-center justify-end gap-4 md:col-span-1">
                <span className="eyebrow hidden text-steel lg:block">{t(p.category, categoryFa[p.category])}</span>
                <span className="font-mono text-xs text-steel">{n(p.year)}</span>
              </div>
            </Link>
          </li>
        ))}
        <li className="border-t hairline" />
      </ul>
    </section>
  )
}
