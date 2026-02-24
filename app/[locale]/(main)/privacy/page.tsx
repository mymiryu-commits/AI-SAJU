import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('legal');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('privacy.title')}</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm">{t('privacy.lastUpdated')}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('privacy.section1.title')}</h2>
          <p>{t('privacy.section1.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('privacy.section2.title')}</h2>
          <p>{t('privacy.section2.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('privacy.section3.title')}</h2>
          <p>{t('privacy.section3.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('privacy.section4.title')}</h2>
          <p>{t('privacy.section4.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('privacy.section5.title')}</h2>
          <p>{t('privacy.section5.content')}</p>
        </section>
      </div>
    </div>
  );
}
