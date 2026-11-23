import { Reveal } from '../components/Reveal'
import { useLang } from '../i18n'

const channels = [
  { label: 'Email', fa: 'ایمیل', value: 'studio@kamranhosseinzadeh.com', href: 'mailto:studio@kamranhosseinzadeh.com' },
  { label: 'Instagram', fa: 'اینستاگرام', value: '@k.hosseinzadeh', href: 'https://instagram.com' },
  { label: 'IMDb', fa: 'آی‌ام‌دی‌بی', value: 'Kamran Hosseinzadeh', valueFa: 'کامران حسین‌زاده', href: 'https://imdb.com' },
  { label: 'TiWall', fa: 'تیوال', value: 'Kamran Hosseinzadeh', valueFa: 'کامران حسین‌زاده', href: 'https://tiwall.com' },
]

export function Contact() {
  const { isFa, t, out } = useLang()
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <header className="border-b hairline pb-12">
        <p className="eyebrow flex items-center gap-3 text-mist">
          <span className="h-px w-8 bg-signal" />
          {t('Contact', 'تماس')}
        </p>
        <h1 className="mt-6 font-display text-6xl leading-[0.95] text-bone rtl:text-5xl md:text-8xl rtl:md:text-8xl">
          {t('Let’s make', 'بیایید چیزی')}
          <br />
          <span className="italic text-mist">{t('something quiet.', 'آرام بسازیم.')}</span>
        </h1>
      </header>

      <div className="grid gap-16 py-16 md:grid-cols-12 md:py-24">
        <Reveal className="min-w-0 md:col-span-6">
          {isFa ? (
            <>
              <p className="max-w-lg text-xl leading-[1.95] text-mist">
                برای برنامه‌ریزی جشنواره، پخش، انتخاب بازیگر یا همکاری در سینما و تئاتر، مستقیم پیام بدهید. به درخواست‌های جدی همیشه پاسخ داده می‌شود.
              </p>
            </>
          ) : (
            <>
              <p className="max-w-lg text-xl leading-relaxed text-mist">
                For festival programming, distribution, casting, or collaboration on film and stage work,
                reach out directly. Serious enquiries are always answered.
              </p>
            </>
          )}
        </Reveal>

        <Reveal className="min-w-0 md:col-span-6" delay={120}>
          <dl>
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-baseline justify-between gap-4 border-t hairline py-6"
              >
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-steel">
                  {t(c.label, c.fa)}
                </dt>
                <span className="hidden flex-1 border-b border-dotted border-steel/30 sm:block" />
                <dd className="flex min-w-0 items-center gap-3 break-all text-base text-bone transition-colors group-hover:text-signal sm:text-lg">
                  {/* Handles and addresses always read left-to-right */}
                  <bdi dir={isFa && c.valueFa ? 'rtl' : 'ltr'}>
                    {isFa ? c.valueFa ?? c.value : c.value}
                  </bdi>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{out}</span>
                </dd>
              </a>
            ))}
            <div className="border-t hairline" />
          </dl>

          <p className="mt-12 font-mono text-xs uppercase tracking-[0.18em] text-steel">
            {t('Studio — Tehran, Iran · ', 'استودیو — تهران، ایران · ')}
            <bdi dir="ltr">{t('GMT+3:30', 'گرینویچ ۳:۳۰+')}</bdi>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
