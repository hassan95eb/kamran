import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { LangSwitch, Latin, navItems, useLang } from '../i18n'

export function Layout() {
  const { pathname } = useLocation()
  const { lang, dir, rest, to, t } = useLang()
  const nav = navItems.map((i) => ({ to: to(i.to), label: t(i.en, i.fa) }))
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [pathname])

  // Semantic language + direction on the document itself
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.title = lang === 'fa' ? 'کامران حسین‌زاده — فیلم‌ساز' : 'Kamran Hosseinzadeh — Filmmaker'
  }, [lang, dir])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Home carries its own title-sequence navigation and closing frame
  if (rest === '/') {
    return (
      <div lang={lang} dir={dir} className="min-h-screen bg-ink text-bone">
        <Outlet />
      </div>
    )
  }

  return (
    <div lang={lang} dir={dir} className="min-h-screen bg-ink text-bone">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || menuOpen ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
          {/* Logo / name → Home */}
          <Link to={to('/')} className="group flex items-baseline gap-3">
            <span className="font-display text-xl leading-none tracking-tight text-bone transition-colors group-hover:text-mist md:text-2xl">
              {t('Kamran Hosseinzadeh', 'کامران حسین‌زاده')}
            </span>
            <span className="hidden h-1 w-1 translate-y-[-2px] rounded-full bg-signal sm:block" aria-hidden />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 md:flex" aria-label={t('Main', 'اصلی')}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `eyebrow relative py-1 transition-colors ${
                    isActive ? 'text-bone' : 'text-mist hover:text-bone'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute -bottom-0.5 start-0 h-px bg-signal transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <LangSwitch className="ms-2 border-s border-steel/50 ps-6" />
          </nav>

          {/* Mobile toggle + language */}
          <div className="flex items-center gap-5 md:hidden">
          <LangSwitch />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="eyebrow text-mist transition-colors hover:text-bone md:hidden"
            aria-expanded={menuOpen}
          >
            {menuOpen ? t('Close', 'بستن') : t('Menu', 'فهرست')}
          </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="border-t hairline px-6 pb-8 pt-4 md:hidden">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block py-3 font-display text-3xl ${isActive ? 'text-bone' : 'text-mist'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Home closes on its own end frame */}
      {rest !== "/" && rest !== "" && <Footer key={lang} />}
    </div>
  )
}

function Footer() {
  const { to, t, n } = useLang()
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-steel">{t('Collaboration', 'همکاری')}</p>
            <Link
              to={to('/contact')}
              className="mt-4 block max-w-xl font-display text-4xl leading-[1.05] text-bone transition-colors hover:text-mist md:text-6xl"
            >
              {t('Working on something that needs a patient eye?', 'پروژه‌ای دارید که نگاهی صبور می‌خواهد؟')}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-6 md:justify-items-end">
            <FooterCol
              title={t('Index', 'فهرست')}
              links={navItems.map((i) => ({ to: to(i.to), label: t(i.en, i.fa) }))}
            />
            <div>
              <p className="eyebrow text-steel">{t('Elsewhere', 'جای دیگر')}</p>
              <ul className="mt-4 space-y-2">
                {[
                  [t('Instagram', 'اینستاگرام'), 'https://instagram.com'],
                  [t('IMDb', 'آی‌ام‌دی‌بی'), 'https://imdb.com'],
                  [t('TiWall', 'تیوال'), 'https://tiwall.com'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-mist transition-colors hover:text-bone"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-6 text-xs text-steel md:flex-row md:items-center md:justify-between">
          <span className="font-mono">
            {t(`© ${new Date().getFullYear()} Kamran Hosseinzadeh`, `© ${n(new Date().getFullYear())} کامران حسین‌زاده`)}
          </span>
          <span className="font-mono">{t('Tehran — worldwide', 'تهران — همه‌جا')}</span>
          {t(
            <span className="font-display text-sm italic text-mist">Kamran Hosseinzadeh — Filmmaker</span>,
            <span className="text-mist">کامران حسین‌زاده — فیلم‌ساز</span>,
          )}
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-steel">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-mist transition-colors hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
