import { Reveal } from '../components/Reveal'
import { filmography, filmographyGroupsFa } from '../data/projects'
import { Latin, Farsi, useLang } from '../i18n'

export function Credits() {
  const { isFa, t, n } = useLang()
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <header className="border-b hairline pb-12">
        <p className="eyebrow flex items-center gap-3 text-mist">
          <span className="h-px w-8 bg-signal" />
          {t('Filmography', 'فیلم‌شناسی')}
        </p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-6xl leading-[0.95] text-bone md:text-8xl">{t('Credits', 'سوابق')}</h1>
          <p className="max-w-md text-mist md:text-end">
            {t(
              'A fuller professional record across film, theatre, and related production — selected entries.',
              'کارنامه‌ای کامل‌تر در سینما، تئاتر و تولیدات مرتبط — عنوان‌های منتخب.',
            )}
          </p>
        </div>
      </header>

      <div className="divide-y divide-transparent">
        {Object.entries(filmography).map(([group, entries], gi) => (
          <div key={group} className="grid gap-8 border-b hairline py-16 md:grid-cols-12 md:py-20">
            <Reveal className="md:col-span-3">
              <p className="font-mono text-xs text-steel">{n(String(gi + 1).padStart(2, '0'))} / </p>
              <h2 className="mt-2 font-display text-3xl text-bone md:text-4xl">{t(group, filmographyGroupsFa[group])}</h2>
            </Reveal>

            <div className="md:col-span-9">
              {entries.map((e, i) => (
                <Reveal key={e.title} delay={i * 70}>
                  <div className="group grid grid-cols-12 items-baseline gap-4 border-t hairline py-5">
                    <span className="col-span-2 font-mono text-xs text-signal md:col-span-1">
                      {n(e.year)}
                    </span>
                    <h3 className="col-span-10 font-display text-2xl text-bone transition-colors group-hover:text-mist md:col-span-6 md:text-3xl">
                      {isFa ? e.titleFa ?? e.title : e.title}
                      {e.note && (
                        <span className="ms-3 align-middle font-sans text-xs italic text-steel">
                          {t(e.note, e.noteFa ?? e.note)}
                        </span>
                      )}
                    </h3>
                    <span className="col-span-12 text-sm text-mist md:col-span-5 md:text-end">
                      {t(e.role, e.roleFa)}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
