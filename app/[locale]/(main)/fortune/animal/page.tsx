'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Sparkles, Heart, HeartCrack, Minus } from 'lucide-react';
import { getAnimalByYear, getAnimalCompatibility, ZODIAC_ANIMALS, type AnimalInfo } from '@/lib/fortune/animal';
import { Disclaimer } from '@/components/fortune/common/Disclaimer';
import { NativeAd } from '@/components/ads/NativeAd';

type Locale = 'ko' | 'ja' | 'en';

export default function AnimalFortunePage() {
  const t = useTranslations('fortune.animal');
  const locale = useLocale() as Locale;
  const [birthYear, setBirthYear] = useState('');
  const [result, setResult] = useState<AnimalInfo | null>(null);
  const [compareYear, setCompareYear] = useState('');
  const [compatibility, setCompatibility] = useState<{
    animal2: AnimalInfo;
    score: number;
    level: string;
  } | null>(null);

  const handleSubmit = () => {
    const year = parseInt(birthYear, 10);
    if (isNaN(year) || year < 1900 || year > 2100) return;
    const animal = getAnimalByYear(year);
    setResult(animal);
    setCompatibility(null);
    setCompareYear('');
  };

  const handleCompare = () => {
    if (!result) return;
    const year2 = parseInt(compareYear, 10);
    if (isNaN(year2) || year2 < 1900 || year2 > 2100) return;
    const animal2 = getAnimalByYear(year2);
    const compat = getAnimalCompatibility(result.id, animal2.id);
    setCompatibility({ animal2, score: compat.score, level: compat.level });
  };

  const handleReset = () => {
    setBirthYear('');
    setResult(null);
    setCompareYear('');
    setCompatibility(null);
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, Record<Locale, string>> = {
      great: { ko: '최고의 궁합', ja: '最高の相性', en: 'Great Match' },
      good: { ko: '좋은 궁합', ja: '良い相性', en: 'Good Match' },
      neutral: { ko: '보통', ja: '普通', en: 'Neutral' },
      challenging: { ko: '주의 필요', ja: '注意が必要', en: 'Challenging' },
    };
    return labels[level]?.[locale] || level;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'great': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'neutral': return 'text-gray-500';
      case 'challenging': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'great': return <Heart className="h-5 w-5 text-green-500 fill-green-500" />;
      case 'good': return <Heart className="h-5 w-5 text-blue-500" />;
      case 'neutral': return <Minus className="h-5 w-5 text-gray-500" />;
      case 'challenging': return <HeartCrack className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Sparkles className="mr-1 h-3 w-3" />
          {t('badge')}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {!result ? (
          /* Input Form */
          <Card>
            <CardHeader>
              <CardTitle>{t('form.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthYear">{t('form.birthYear')}</Label>
                <Input
                  id="birthYear"
                  type="number"
                  placeholder={t('form.placeholder')}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  min={1900}
                  max={2100}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full" size="lg">
                {t('form.submit')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Result */
          <div className="space-y-6">
            {/* Animal Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center">
                <div className="text-7xl mb-4">{result.emoji}</div>
                <h2 className="text-3xl font-bold">{result.name[locale]}</h2>
                <p className="text-white/80 mt-1">{birthYear}{t('result.yearBorn')}</p>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Personality */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('result.personality')}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.personality[locale]}
                  </p>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">{t('result.strengths')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.strengths[locale].map((strength, i) => (
                      <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Compatible / Incompatible */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-1">
                      <Heart className="h-4 w-4 text-green-500" />
                      {t('result.compatible')}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.compatible.map((id) => {
                        const animal = ZODIAC_ANIMALS[id];
                        return (
                          <span key={id} className="text-sm bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">
                            {animal.emoji} {animal.name[locale]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-1">
                      <HeartCrack className="h-4 w-4 text-orange-500" />
                      {t('result.incompatible')}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.incompatible.map((id) => {
                        const animal = ZODIAC_ANIMALS[id];
                        return (
                          <span key={id} className="text-sm bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-md">
                            {animal.emoji} {animal.name[locale]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad placement */}
            <NativeAd context="general" />

            {/* Compatibility Check */}
            <Card>
              <CardHeader>
                <CardTitle>{t('compatibility.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="compareYear">{t('compatibility.otherYear')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="compareYear"
                      type="number"
                      placeholder={t('form.placeholder')}
                      value={compareYear}
                      onChange={(e) => setCompareYear(e.target.value)}
                      min={1900}
                      max={2100}
                      onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                    />
                    <Button onClick={handleCompare}>
                      {t('compatibility.check')}
                    </Button>
                  </div>
                </div>

                {compatibility && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 text-center space-y-3">
                    <div className="flex items-center justify-center gap-4 text-4xl">
                      <span>{result.emoji}</span>
                      {getLevelIcon(compatibility.level)}
                      <span>{compatibility.animal2.emoji}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">{result.name[locale]}</span>
                      <span className="text-muted-foreground">&</span>
                      <span className="font-semibold">{compatibility.animal2.name[locale]}</span>
                    </div>
                    <div className={`text-2xl font-bold ${getLevelColor(compatibility.level)}`}>
                      {compatibility.score}{t('compatibility.points')}
                    </div>
                    <Badge className={
                      compatibility.level === 'great' ? 'bg-green-500' :
                      compatibility.level === 'good' ? 'bg-blue-500' :
                      compatibility.level === 'challenging' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }>
                      {getLevelLabel(compatibility.level)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                {t('result.retry')}
              </Button>
              <Link href="/fortune/saju" className="flex-1">
                <Button className="w-full">
                  {t('result.trySaju')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Disclaimer />
          </div>
        )}

        {/* All 12 Animals Grid */}
        {!result && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{t('allAnimals')}</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {Object.values(ZODIAC_ANIMALS).map((animal) => (
                <Card
                  key={animal.id}
                  className="text-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setResult(animal);
                    setBirthYear('');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="text-3xl mb-1">{animal.emoji}</div>
                    <div className="text-sm font-medium">{animal.name[locale]}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
