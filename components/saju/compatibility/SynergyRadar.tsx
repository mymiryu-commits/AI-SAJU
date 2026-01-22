'use client';

import { cn } from '@/lib/utils';

interface SynergyRadarProps {
  synergy: {
    communication: number;
    passion: number;
    stability: number;
    growth: number;
    trust: number;
  };
  className?: string;
}

const LABELS = [
  { key: 'communication', label: '소통', angle: -90 },
  { key: 'passion', label: '열정', angle: -18 },
  { key: 'stability', label: '안정', angle: 54 },
  { key: 'growth', label: '성장', angle: 126 },
  { key: 'trust', label: '신뢰', angle: 198 }
];

export function SynergyRadar({ synergy, className }: SynergyRadarProps) {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;

  // 각도를 라디안으로 변환
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // 점 좌표 계산
  const getPoint = (angle: number, value: number) => {
    const radius = (value / 100) * maxRadius;
    const rad = toRadians(angle);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  // 다각형 경로 생성
  const getPolygonPath = (values: number[]) => {
    const points = LABELS.map((label, i) => {
      const point = getPoint(label.angle, values[i]);
      return `${point.x},${point.y}`;
    });
    return points.join(' ');
  };

  // 배경 그리드 생성
  const gridLevels = [20, 40, 60, 80, 100];

  const values = [
    synergy.communication,
    synergy.passion,
    synergy.stability,
    synergy.growth,
    synergy.trust
  ];

  const avgScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width={size} height={size} className="overflow-visible">
        {/* 배경 그리드 */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={getPolygonPath(Array(5).fill(level))}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {/* 축선 */}
        {LABELS.map((label) => {
          const endPoint = getPoint(label.angle, 100);
          return (
            <line
              key={label.key}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-200 dark:text-gray-700"
            />
          );
        })}

        {/* 데이터 영역 */}
        <polygon
          points={getPolygonPath(values)}
          fill="url(#synergy-gradient)"
          fillOpacity="0.5"
          stroke="url(#synergy-stroke)"
          strokeWidth="2"
        />

        {/* 데이터 점 */}
        {LABELS.map((label, i) => {
          const point = getPoint(label.angle, values[i]);
          return (
            <circle
              key={label.key}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke="#8b5cf6"
              strokeWidth="2"
            />
          );
        })}

        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient id="synergy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="synergy-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* 라벨 */}
      <div className="relative w-[260px] h-[260px] -mt-[230px]">
        {LABELS.map((label, i) => {
          const labelPoint = getPoint(label.angle, 130);
          return (
            <div
              key={label.key}
              className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: labelPoint.x + 30,
                top: labelPoint.y + 30
              }}
            >
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label.label}
              </div>
              <div className={cn(
                'text-xs font-bold',
                values[i] >= 70 ? 'text-green-600 dark:text-green-400' :
                values[i] >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              )}>
                {values[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* 평균 점수 */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">시너지 평균</div>
        <div className={cn(
          'text-2xl font-bold',
          avgScore >= 70 ? 'text-green-600 dark:text-green-400' :
          avgScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
          'text-red-600 dark:text-red-400'
        )}>
          {avgScore}점
        </div>
      </div>

      {/* 항목별 바 */}
      <div className="w-full mt-6 space-y-2">
        {LABELS.map((label, i) => (
          <div key={label.key} className="flex items-center gap-2">
            <span className="w-12 text-xs text-gray-500 dark:text-gray-400">
              {label.label}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  values[i] >= 70 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  values[i] >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                  'bg-gradient-to-r from-red-400 to-red-500'
                )}
                style={{ width: `${values[i]}%` }}
              />
            </div>
            <span className={cn(
              'w-8 text-xs font-medium text-right',
              values[i] >= 70 ? 'text-green-600 dark:text-green-400' :
              values[i] >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            )}>
              {values[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
