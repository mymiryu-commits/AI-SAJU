import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // AI 순위 페이지로 리다이렉트
  redirect(`/${locale}/ranking`);
}
