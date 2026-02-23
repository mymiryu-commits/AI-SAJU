import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('legal');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('terms.title')}</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm">{t('terms.lastUpdated')}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('terms.section1.title')}</h2>
          <p>{t('terms.section1.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('terms.section2.title')}</h2>
          <p>{t('terms.section2.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('terms.section3.title')}</h2>
          <p>{t('terms.section3.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('terms.section4.title')}</h2>
          <p>{t('terms.section4.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('terms.section5.title')}</h2>
          <p>{t('terms.section5.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">{t('terms.section6.title')}</h2>
          <p>{t('terms.section6.content')}</p>
        </section>
      </div>
    </div>
  );
}
