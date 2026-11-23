import { Reveal } from '../components/Reveal'
import { Latin, useLang } from '../i18n'

const portrait =
  'https://images.unsplash.com/photo-1618566105831-d604c45a7316?w=1200&h=1500&fit=crop&auto=format&sat=-80'

const timeline = [
  {
    year: 2012,
    text: 'Enters the industry on the crew of Like Someone in Love, as Trainee Assistant Director.',
    fa: <>ورود به سینما با گروه فیلم «مثل یک عاشق»، در نقش کارآموز دستیار کارگردان.</>,
  },
  { year: 2015, text: 'First editing credit; begins directing for the stage in Tehran.', fa: <>نخستین تجربهٔ تدوین؛ آغاز کارگردانی تئاتر در تهران.</> },
  { year: 2019, text: 'Directs A House of Doors — first original theatre work.', fa: <>کارگردانی «خانهٔ درها» — نخستین اثر تئاتری مستقل.</> },
  { year: 2021, text: 'The Glass Room premieres at Tehran’s City Theatre.', fa: <>نخستین اجرای «اتاق شیشه‌ای» در تئاتر شهر تهران.</> },
  { year: 2023, text: 'Latent (for her) completed, as director and producer.', fa: <>ساخت «مکنون»، در مقام کارگردان و تهیه‌کننده.</> },
]

export function About() {
  const { isFa, t, n } = useLang()
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <header className="border-b hairline pb-12">
        <p className="eyebrow flex items-center gap-3 text-mist">
          <span className="h-px w-8 bg-signal" />
          {t('Portrait', 'چهره')}
        </p>
        <h1 className="mt-6 font-display text-6xl leading-[0.95] text-bone md:text-8xl">{t('About', 'درباره')}</h1>
      </header>

      <div className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
        {/* Portrait */}
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
            <img
              src={portrait}
              alt={t('Portrait of Kamran Hosseinzadeh in low light', 'چهرهٔ کامران حسین‌زاده در نور کم')}
              className="h-full w-full object-cover opacity-90 grayscale"
            />
            <span className="absolute bottom-4 start-4 font-mono text-[11px] text-mist/80">
              {t('Tehran, 2024', `تهران، ${n(2024)}`)}
            </span>
          </div>
        </Reveal>

        {/* Bio */}
        <Reveal className="md:col-span-7" delay={120}>
          {isFa ? (
            /* Persian is set to its own measure — line breaks are not matched to English */
            <>
              <p className="max-w-[26ch] font-display text-3xl text-bone md:text-[2.4rem] md:!leading-[1.6]">
                کامران حسین‌زاده فیلم‌ساز و کارگردان تئاتر است؛ میان تهران و جشنواره‌ها کار می‌کند و به حساب‌وکتاب آرام زندگی‌های معمولی دل بسته است.
              </p>
              <div className="mt-8 max-w-[62ch] space-y-5 text-lg leading-[1.95] text-mist">
                <p>
                  کارش را از نزدیکِ قاب شروع کرد — در گروه کارگردانی و تولید، سپس تدوین و گاه بازیگری — و بعد به کارگردانی رسید. این شاگردی در کارهایش پیداست: حوصلهٔ یک تدوینگر، اعتماد یک کارگردان تئاتر به بازیگر، و پرهیز از شتاب‌دادن به صحنه برای رسیدن به حرفش.
                </p>
                <p>
                  فیلم‌هایش نور موجود، برداشت‌های بلند و اتاق‌هایی را ترجیح می‌دهند که تاریخ‌شان را نگه داشته‌اند. در صحنه و پرده، موضوعی که بارها بازمی‌گردد میراث است — آنچه یک مکان، یک خانواده یا یک سکوت، بی‌آنکه بپرسد، به ما می‌سپارد.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="font-display text-3xl leading-[1.25] text-bone md:text-[2.5rem] md:leading-[1.2]">
                Kamran Hosseinzadeh is a filmmaker and theatre director working between Tehran and the
                festival circuit, drawn to the quiet arithmetic of ordinary lives.
              </p>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-mist">
                <p>
                  He began close to the frame — within directing teams and production, then editing and
                  occasional acting — before turning to direction. That apprenticeship shows in the work: an
                  editor’s patience, a stage director’s trust in performers, and a refusal to hurry a scene
                  toward its point.
                </p>
                <p>
                  His films favour available light, long takes and rooms that hold their history. Across
                  stage and screen, the recurring subject is inheritance — what a place, a family, or a
                  silence hands down without asking.
                </p>
              </div>
            </>
          )}

          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t hairline pt-8">
            <Stat k={t('Based in', 'محل زندگی')} v={t('Tehran, Iran', 'تهران، ایران')} />
            <Stat k={t('Working since', 'فعالیت از')} v={n(2012)} />
            <Stat k={t('Disciplines', 'حوزه‌ها')} v={t('Film · Theatre', 'سینما · تئاتر')} />
          </div>
        </Reveal>
      </div>

      {/* Timeline */}
      <div className="grid gap-12 border-t hairline py-16 md:grid-cols-12 md:py-24">
        <Reveal className="md:col-span-3">
          <p className="eyebrow text-steel">{t('Trajectory', 'مسیر')}</p>
          <h2 className="mt-4 font-display text-4xl text-bone">{t('Milestones', 'نقطه‌های عطف')}</h2>
        </Reveal>
        <div className="md:col-span-9">
          {timeline.map((m, i) => (
            <Reveal key={m.year} delay={i * 80}>
              <div className="group flex gap-8 border-t hairline py-6">
                <span className="w-16 shrink-0 font-mono text-sm text-signal">{n(m.year)}</span>
                <p className="text-lg leading-relaxed text-mist transition-colors group-hover:text-bone">
                  {isFa ? m.fa : m.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="eyebrow text-steel">{k}</p>
      <p className="mt-2 text-lg text-bone">{v}</p>
    </div>
  )
}
