import SajuLandingPage from '@/components/home/SajuLandingPage';
import { createClient } from '@/lib/supabase/server';
import type { ServiceCardImages } from '@/types/settings';
import type { Database } from '@/types/database';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

export default async function SajuPage() {
  let cardImages: ServiceCardImages = {};

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'service_card_images')
      .single<SiteSettingsRow>();

    if (data?.value) {
      cardImages = data.value as ServiceCardImages;
    }
  } catch {
    // 이미지 로드 실패 시 그라데이션 배경 유지
  }

  return <SajuLandingPage initialCardImages={cardImages} />;
}
