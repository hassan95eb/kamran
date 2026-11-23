import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'

/* ── Bilingual system ────────────────────────────────────────
   English lives at /…, Persian at /fa/…  The path after the
   prefix is identical, so switching keeps the reader in place. */

export type Lang = 'en' | 'fa'

export const dirOf = (lang: Lang) => (lang === 'fa' ? 'rtl' : 'ltr')

export function splitPath(pathname: string): { lang: Lang; rest: string } {
  if (pathname === '/fa' || pathname.startsWith('/fa/')) {
    return { lang: 'fa', rest: pathname.slice(3) || '/' }
  }
  return { lang: 'en', rest: pathname || '/' }
}

export const withLang = (lang: Lang, path: string) =>
  lang === 'fa' ? (path === '/' ? '/fa' : `/fa${path}`) : path

export function useLang() {
  const { pathname } = useLocation()
  const { lang, rest } = splitPath(pathname)
  return {
    lang,
    rest,
    isFa: lang === 'fa',
    dir: dirOf(lang),
    /** Localise an internal path */
    to: (path: string) => withLang(lang, path),
    /** Pick the string for the current language */
    t: <T,>(en: T, fa: T) => (lang === 'fa' ? fa : en),
    /** Numerals: Persian digits in the Persian interface (years stay Gregorian) */
    n: (v: string | number) => (lang === 'fa' ? toFaDigits(String(v)) : String(v)),
    /** Reading-direction arrow; non-directional arrows (↓) are left alone */
    arrow: lang === 'fa' ? '←' : '→',
    back: lang === 'fa' ? '→' : '←',
    out: lang === 'fa' ? '↖' : '↗',
  }
}

export const toFaDigits = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

/** Isolate Latin runs (titles, emails, timecodes) inside Persian text, and vice versa. */
export function Latin({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi lang="en" dir="ltr" className={className}>
      {children}
    </bdi>
  )
}
export function Farsi({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi lang="fa" dir="rtl" className={className}>
      {children}
    </bdi>
  )
}

/** EN / FA — typographic, inline, no chrome. Active = full-strength + red underline. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, rest } = useLang()
  const { search, hash } = useLocation()
  const item = (l: Lang, label: string, name: string) => {
    const active = l === lang
    return (
      <Link
        to={withLang(l, rest) + search + hash}
        lang={l}
        hrefLang={l}
        aria-label={name}
        aria-current={active ? 'true' : undefined}
        onClick={() => {
          try {
            localStorage.setItem('kh-lang', l)
          } catch {}
        }}
        className={`lang-switch__item relative py-1 transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-signal ${
          active ? 'is-active text-bone' : 'text-mist/60 hover:text-bone'
        }`}
      >
        {label}
      </Link>
    )
  }
  return (
    <nav
      aria-label={lang === 'fa' ? 'زبان' : 'Language'}
      dir="ltr"
      className={`lang-switch meta home-meta inline-flex items-baseline gap-2 ${className}`}
    >
      {item('en', 'EN', 'English')}
      <span aria-hidden className="text-steel">/</span>
      {item('fa', 'FA', 'فارسی')}
    </nav>
  )
}

/* ── Shared vocabulary — one term per role, used everywhere ── */
export const roles = {
  Filmmaker: 'فیلم‌ساز',
  Director: 'کارگردان',
  Writer: 'نویسنده',
  Producer: 'تهیه‌کننده',
  Actor: 'بازیگر',
  'Director / Producer': 'کارگردان / تهیه‌کننده',
  'Trainee Assistant Director': 'کارآموز دستیار کارگردان',
  'Second Assistant Director': 'دستیار دوم کارگردان',
  'Selected Collaborations': 'همکاری‌های منتخب',
} as const

export const navItems = [
  { to: '/works', en: 'Works', fa: 'آثار' },
  { to: '/about', en: 'About', fa: 'درباره' },
  { to: '/credits', en: 'Credits', fa: 'سوابق' },
  { to: '/contact', en: 'Contact', fa: 'تماس' },
]
