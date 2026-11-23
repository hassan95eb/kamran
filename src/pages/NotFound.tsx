import { Link } from 'react-router'
import { useLang } from '../i18n'

export function NotFound() {
  const { t, n, to, back } = useLang()
  return (
    <section className="mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 md:px-12">
      <p className="eyebrow flex items-center gap-3 text-signal">
        <span className="h-px w-8 bg-signal" />
        {n(404)}
      </p>
      <h1 className="mt-6 font-display text-6xl leading-[0.95] text-bone md:text-8xl">
        {t('This frame', 'این قاب')}
        <br />
        <span className="italic text-mist">{t('was cut.', 'حذف شد.')}</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-mist">
        {t('The page you’re looking for isn’t part of the final edit.', 'صفحه‌ای که دنبالش هستید در تدوین نهایی نیامده است.')}
      </p>
      <Link
        to={to('/')}
        className="mt-10 inline-flex items-center gap-3 self-start border-b border-bone pb-1 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-signal hover:text-signal"
      >
        {back} {t('Back to the beginning', 'بازگشت به آغاز')}
      </Link>
    </section>
  )
}
