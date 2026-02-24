'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// PDF 페이지 데이터
const pdfPages = [
  { title: "사주팔자 명식표", desc: "년·월·일·시 천간지지 완벽 도해", icon: "命", color: "#d4af37" },
  { title: "십신 관계도", desc: "나를 둘러싼 관계와 운명의 흐름", icon: "神", color: "#c9a227" },
  { title: "12운성 분석", desc: "태·양·관·사 생명력의 순환", icon: "運", color: "#b8960f" },
  { title: "2025 을사년 운세", desc: "월별 길흉화복 상세 예측", icon: "歲", color: "#d4af37" },
  { title: "재물운 심층 분석", desc: "재성의 위치와 시기별 재물 흐름", icon: "財", color: "#c9a227" },
  { title: "인연·궁합 지수", desc: "연애운과 최적의 인연 시기", icon: "緣", color: "#b8960f" },
];

// 후기 데이터
const testimonials = [
  { name: "김○○", age: "32세", text: "엄마 생신선물로 드렸는데 너무 좋아하셨어요. PDF로 바로 보내드릴 수 있어서 편했습니다.", rating: 5, gift: true },
  { name: "이○○", age: "28세", text: "타로앱 5개 써봤는데 이건 진짜 다르네요. 명리학 전공자가 본 것 같은 퀄리티.", rating: 5, gift: false },
  { name: "박○○", age: "45세", text: "12페이지 분량이라 처음엔 많다 했는데, 음성해설 들으면서 보니 시간 가는 줄 몰랐어요.", rating: 5, gift: false },
  { name: "최○○", age: "38세", text: "친구 5명한테 선물했습니다. 다들 소름돋았다고 난리에요.", rating: 5, gift: true },
];

// 비교 데이터
const comparisonData = {
  others: ["단순 텍스트 나열", "일반적인 운세 해석", "저화질 이미지", "음성 해설 없음", "PDF 제공 없음"],
  ours: ["12페이지 프리미엄 리포트", "명리학 기반 심층 분석", "고급 인포그래픽", "8분 전문 성우 음성", "고화질 PDF 즉시 다운로드"]
};

export default function PremiumShowcase() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewCount, setViewCount] = useState(2847);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // 실시간 조회수
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // PDF 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 후기 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="premium-showcase">
      <style jsx>{`
        .premium-showcase {
          --gold: #d4af37;
          --gold-light: #f4d03f;
          --dark-bg: #0a0a12;
        }

        /* ========== HERO SECTION ========== */
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 20px 80px;
          overflow: hidden;
          background: linear-gradient(180deg,
            #fefefe 0%,
            #f8f6ff 30%,
            #f0ebff 60%,
            #ebe4ff 100%
          );
        }

        /* 배경 장식 */
        .hero-bg-orbs {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.5;
          animation: floatOrb 8s ease-in-out infinite;
        }

        .orb-1 {
          top: 10%;
          left: 10%;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #c4b5fd, #a78bfa);
        }

        .orb-2 {
          top: 40%;
          right: 10%;
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #fbcfe8, #f9a8d4);
          animation-delay: 2s;
        }

        .orb-3 {
          bottom: 10%;
          left: 30%;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #fde68a, #fcd34d);
          animation-delay: 4s;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 1000px;
          width: 100%;
        }

        /* 상단 배지 */
        .top-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 50px;
          margin-bottom: 32px;
          animation: floatBadge 5s ease-in-out infinite;
        }

        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .badge-text {
          font-size: 13px;
          letter-spacing: 3px;
          color: #7c3aed;
          font-weight: 600;
        }

        /* 메인 타이틀 */
        .hero-title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 20px;
          color: #1f1f1f;
        }

        .hero-title .highlight {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(15px, 2vw, 18px);
          color: #6b7280;
          max-width: 500px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        /* PDF 스택 */
        .pdf-stack-container {
          position: relative;
          height: 320px;
          margin: 0 auto 50px;
          max-width: 500px;
          perspective: 1500px;
        }

        .pdf-stack-item {
          position: absolute;
          width: 200px;
          height: 280px;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          background: white;
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .pdf-stack-item .pdf-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #faf5ff, #f3e8ff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .pdf-stack-item .pdf-icon-large {
          font-size: 48px;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pdf-stack-item .pdf-title-large {
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          text-align: center;
        }

        .pdf-stack-item .pdf-page-num {
          font-size: 11px;
          color: #9ca3af;
          letter-spacing: 2px;
        }

        .pdf-stack-item:nth-child(1) {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-8deg);
          z-index: 1;
        }

        .pdf-stack-item:nth-child(2) {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          z-index: 2;
        }

        .pdf-stack-item:nth-child(3) {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(8deg);
          z-index: 3;
        }

        .pdf-stack-item:hover {
          transform: translate(-50%, -50%) rotate(0deg) scale(1.05) !important;
          z-index: 10 !important;
          box-shadow: 0 30px 60px rgba(139, 92, 246, 0.2);
        }

        /* CTA 버튼 */
        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .btn-primary-gradient {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
          text-decoration: none;
        }

        .btn-primary-gradient:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
        }

        .btn-secondary-light {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: white;
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          color: #7c3aed;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-secondary-light:hover {
          background: #faf5ff;
          border-color: #8b5cf6;
          transform: translateY(-3px);
        }

        /* 신뢰 지표 */
        .trust-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          padding: 20px 32px;
          background: white;
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 60px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .trust-item strong {
          color: #7c3aed;
          font-weight: 600;
        }

        .trust-divider {
          width: 1px;
          height: 20px;
          background: #e5e7eb;
        }

        @media (max-width: 640px) {
          .trust-divider { display: none; }
          .trust-bar { gap: 16px; padding: 16px 24px; }
        }

        /* ========== 상세 섹션 ========== */
        .detail-section {
          padding: 100px 20px;
          background: white;
        }

        .detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-tag {
          display: inline-block;
          padding: 8px 18px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          border-radius: 30px;
          font-size: 12px;
          color: #7c3aed;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .section-title {
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 700;
          color: #1f1f1f;
          margin-bottom: 12px;
        }

        .section-subtitle {
          font-size: 15px;
          color: #6b7280;
          max-width: 450px;
          margin: 0 auto;
        }

        /* 그리드 */
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* PDF 캐러셀 */
        .carousel-frame {
          position: relative;
          padding: 32px;
          background: linear-gradient(145deg, #faf5ff, #fdf4ff);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .carousel-inner {
          position: relative;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .carousel-card {
          position: absolute;
          width: 240px;
          height: 320px;
          background: white;
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .carousel-card.active {
          transform: translateX(0) scale(1) rotateY(0);
          z-index: 10;
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 25px 60px rgba(139, 92, 246, 0.15);
        }

        .carousel-card.prev {
          transform: translateX(-130px) scale(0.85) rotateY(20deg);
          z-index: 5;
          opacity: 0.6;
        }

        .carousel-card.next {
          transform: translateX(130px) scale(0.85) rotateY(-20deg);
          z-index: 5;
          opacity: 0.6;
        }

        .carousel-card.hidden {
          transform: scale(0.7);
          opacity: 0;
          z-index: 0;
        }

        .card-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px;
          background: linear-gradient(145deg, #faf5ff, white);
        }

        .card-icon {
          font-size: 56px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f1f1f;
          margin-bottom: 10px;
          text-align: center;
        }

        .card-desc {
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          line-height: 1.5;
        }

        .card-page {
          position: absolute;
          bottom: 20px;
          font-size: 11px;
          color: #9ca3af;
          letter-spacing: 2px;
        }

        /* 캐러셀 네비게이션 */
        .carousel-nav {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
        }

        .nav-dot {
          width: 10px;
          height: 10px;
          background: #e5e7eb;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-dot.active {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          transform: scale(1.3);
        }

        /* 정보 카드 */
        .info-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          padding: 24px;
          background: #fafafa;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          background: #faf5ff;
          border-color: rgba(139, 92, 246, 0.2);
          transform: translateX(6px);
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
        }

        .info-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .info-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f1f1f;
        }

        .info-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          padding-left: 58px;
        }

        /* 오디오 플레이어 */
        .audio-card {
          padding: 28px;
          background: linear-gradient(135deg, #faf5ff, #fdf4ff);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 20px;
        }

        .audio-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .audio-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          color: #1f1f1f;
        }

        .audio-badge {
          padding: 4px 10px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 16px;
          font-size: 11px;
          color: #7c3aed;
          font-weight: 600;
        }

        .waveform {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          height: 50px;
          margin-bottom: 20px;
        }

        .wave-bar {
          width: 3px;
          background: linear-gradient(180deg, #8b5cf6, #ec4899);
          border-radius: 3px;
          transition: height 0.15s ease;
        }

        .wave-bar.playing {
          animation: waveAnim 0.6s ease-in-out infinite;
        }

        @keyframes waveAnim {
          0%, 100% { height: 15px; }
          50% { height: 40px; }
        }

        .audio-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .play-button {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

        .play-button:hover {
          transform: scale(1.1);
        }

        .time-display {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* ========== 비교 섹션 ========== */
        .comparison-section {
          padding: 100px 20px;
          background: linear-gradient(180deg, #f9fafb, #f3f4f6);
        }

        .comparison-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 32px;
          align-items: stretch;
        }

        @media (max-width: 800px) {
          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .comparison-card {
          padding: 32px;
          border-radius: 20px;
          position: relative;
        }

        .comparison-card.others {
          background: white;
          border: 1px solid #e5e7eb;
        }

        .comparison-card.ours {
          background: linear-gradient(145deg, #faf5ff, white);
          border: 2px solid rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
        }

        .comparison-card.ours::before {
          content: '추천';
          position: absolute;
          top: -10px;
          right: 20px;
          padding: 5px 14px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
          color: white;
        }

        .comparison-label {
          font-size: 12px;
          color: #9ca3af;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .comparison-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .comparison-card.others .comparison-title {
          color: #6b7280;
        }

        .comparison-card.ours .comparison-title {
          color: #7c3aed;
        }

        .comparison-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .comparison-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.4;
        }

        .comparison-card.others .comparison-list li {
          color: #9ca3af;
        }

        .comparison-card.ours .comparison-list li {
          color: #374151;
        }

        .list-icon {
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 14px;
        }

        .comparison-card.others .list-icon {
          color: #d1d5db;
        }

        .comparison-card.ours .list-icon {
          color: #8b5cf6;
        }

        /* VS */
        .vs-divider {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vs-circle {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          border: 2px solid rgba(139, 92, 246, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #7c3aed;
        }

        @media (max-width: 800px) {
          .vs-divider { display: none; }
        }

        /* ========== 후기 섹션 ========== */
        .testimonials-section {
          padding: 100px 20px;
          background: white;
        }

        .testimonials-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 50px;
        }

        .testimonial-card {
          padding: 28px;
          background: #fafafa;
          border: 1px solid #f3f4f6;
          border-radius: 20px;
          transition: all 0.4s ease;
          opacity: 0.7;
        }

        .testimonial-card.active {
          opacity: 1;
          border-color: rgba(139, 92, 246, 0.3);
          background: #faf5ff;
          transform: translateY(-6px);
        }

        .testimonial-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 16px;
        }

        .star {
          color: #fbbf24;
          font-size: 16px;
        }

        .testimonial-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
          margin-bottom: 20px;
          font-style: italic;
        }

        .testimonial-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .testimonial-author {
          font-size: 13px;
          color: #9ca3af;
        }

        .gift-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          background: rgba(236, 72, 153, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.2);
          border-radius: 16px;
          font-size: 11px;
          color: #ec4899;
          font-weight: 500;
        }

        /* ========== 최종 CTA ========== */
        .final-cta-section {
          padding: 100px 20px 120px;
          background: linear-gradient(180deg, #f9fafb, #faf5ff);
        }

        .final-cta-container {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .final-cta-box {
          padding: 60px 40px;
          background: white;
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .final-cta-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          color: #1f1f1f;
          margin-bottom: 12px;
        }

        .final-cta-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 32px;
        }

        .final-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .btn-analyze {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 50px;
          font-size: 17px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 12px 35px rgba(139, 92, 246, 0.35);
          text-decoration: none;
        }

        .btn-analyze:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 45px rgba(139, 92, 246, 0.45);
        }

        .btn-gift-final {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 36px;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          border: none;
          border-radius: 50px;
          font-size: 17px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 12px 35px rgba(236, 72, 153, 0.3);
          text-decoration: none;
        }

        .btn-gift-final:hover {
          transform: translateY(-3px);
        }

        /* 신뢰 배지 */
        .final-trust-badges {
          display: flex;
          justify-content: center;
          gap: 40px;
          padding-top: 32px;
          border-top: 1px solid #f3f4f6;
          flex-wrap: wrap;
        }

        .final-trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .final-trust-icon {
          font-size: 24px;
        }

        .final-trust-label {
          font-size: 11px;
          color: #9ca3af;
        }

        .final-trust-value {
          font-size: 14px;
          font-weight: 600;
          color: #7c3aed;
        }
      `}</style>

      {/* ========== HERO 섹션 ========== */}
      <section className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="hero-content">
          <div className="top-badge">
            <span>✨</span>
            <span className="badge-text">PREMIUM REPORT</span>
            <span>✨</span>
          </div>

          <h1 className="hero-title">
            당신만을 위한<br />
            <span className="highlight">프리미엄 사주 리포트</span>
          </h1>

          <p className="hero-subtitle">
            AI 명리학 전문가가 분석한 12페이지 심층 리포트와<br />
            전문 성우의 8분 음성 해설을 경험하세요
          </p>

          {/* PDF 스택 */}
          <div className="pdf-stack-container">
            {[0, 1, 2].map((index) => (
              <div key={index} className="pdf-stack-item">
                <div className="pdf-placeholder">
                  <span className="pdf-icon-large">{pdfPages[index].icon}</span>
                  <span className="pdf-title-large">{pdfPages[index].title}</span>
                  <span className="pdf-page-num">PAGE {index + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-cta">
            <Link href="/fortune/saju" className="btn-primary-gradient">
              <span>⚡</span> 내 사주 분석하기
            </Link>
            <Link href="/pricing" className="btn-secondary-light">
              <span>📄</span> 샘플 리포트 보기
            </Link>
          </div>

          <div className="trust-bar">
            <div className="trust-item">
              <span>📊</span>
              <span>누적 분석 <strong>{viewCount.toLocaleString()}건+</strong></span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span>⭐</span>
              <span>평점 <strong>4.9</strong> (3,847 리뷰)</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span>🔒</span>
              <span>개인정보 <strong>100% 암호화</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 상세 섹션 ========== */}
      <section className="detail-section">
        <div className="detail-container">
          <div className="section-header">
            <span className="section-tag">Report Preview</span>
            <h2 className="section-title">12페이지 심층 분석 리포트</h2>
            <p className="section-subtitle">
              명리학 전문가 수준의 상세한 분석 결과를 PDF로 받아보세요
            </p>
          </div>

          <div className="detail-grid">
            {/* PDF 캐러셀 */}
            <div className="pdf-carousel">
              <div className="carousel-frame">
                <div className="carousel-inner">
                  {pdfPages.map((page, index) => {
                    let cardClass = 'carousel-card';
                    if (index === currentPage) cardClass += ' active';
                    else if (index === (currentPage - 1 + pdfPages.length) % pdfPages.length) cardClass += ' prev';
                    else if (index === (currentPage + 1) % pdfPages.length) cardClass += ' next';
                    else cardClass += ' hidden';

                    return (
                      <div
                        key={index}
                        className={cardClass}
                        onClick={() => setCurrentPage(index)}
                      >
                        <div className="card-content">
                          <span className="card-icon">{page.icon}</span>
                          <h3 className="card-title">{page.title}</h3>
                          <p className="card-desc">{page.desc}</p>
                          <span className="card-page">PAGE {index + 1} / 6</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="carousel-nav">
                  {pdfPages.map((_, index) => (
                    <div
                      key={index}
                      className={`nav-dot ${index === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 정보 패널 */}
            <div className="info-panel">
              <div className="info-card">
                <div className="info-card-header">
                  <div className="info-icon">📊</div>
                  <h4 className="info-title">12페이지 심층 리포트</h4>
                </div>
                <p className="info-desc">AI가 분석한 전문가 수준의 사주팔자 해석. 인포그래픽과 도표로 한눈에 파악.</p>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <div className="info-icon">📅</div>
                  <h4 className="info-title">월별 운세 캘린더</h4>
                </div>
                <p className="info-desc">2025년 12개월 길흉일을 한눈에 확인. 중요한 결정의 최적 시기를 알려드립니다.</p>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <div className="info-icon">💝</div>
                  <h4 className="info-title">선물하기 기능</h4>
                </div>
                <p className="info-desc">카카오톡으로 소중한 사람에게 운명의 선물을. 감동의 특별한 선물이 됩니다.</p>
              </div>

              {/* 오디오 플레이어 */}
              <div className="audio-card">
                <div className="audio-header">
                  <div className="audio-title">
                    🎙️ 음성 해설 미리듣기
                    <span className="audio-badge">8분</span>
                  </div>
                </div>
                <div className="waveform">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className={`wave-bar ${isPlaying ? 'playing' : ''}`}
                      style={{
                        height: isPlaying ? undefined : '15px',
                        animationDelay: `${i * 0.03}s`
                      }}
                    />
                  ))}
                </div>
                <div className="audio-controls">
                  <span className="time-display">0:00</span>
                  <button
                    className="play-button"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <span className="time-display">8:24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 비교 섹션 ========== */}
      <section className="comparison-section">
        <div className="comparison-container">
          <div className="section-header">
            <span className="section-tag">Why Different</span>
            <h2 className="section-title">왜 AI-SAJU인가요?</h2>
            <p className="section-subtitle">
              일반 사주앱과는 차원이 다른 프리미엄 경험
            </p>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card others">
              <span className="comparison-label">일반 사주앱</span>
              <h3 className="comparison-title">기존 서비스</h3>
              <ul className="comparison-list">
                {comparisonData.others.map((item, i) => (
                  <li key={i}>
                    <span className="list-icon">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="vs-divider">
              <div className="vs-circle">VS</div>
            </div>

            <div className="comparison-card ours">
              <span className="comparison-label">AI-SAJU</span>
              <h3 className="comparison-title">프리미엄 리포트</h3>
              <ul className="comparison-list">
                {comparisonData.ours.map((item, i) => (
                  <li key={i}>
                    <span className="list-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 후기 섹션 ========== */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <span className="section-tag">Real Reviews</span>
            <h2 className="section-title">실제 이용 후기</h2>
            <p className="section-subtitle">
              ⭐ 4.9 평점 · 3,847개의 진심 어린 리뷰
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((review, index) => (
              <div
                key={index}
                className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
              >
                <div className="testimonial-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{review.text}&rdquo;</p>
                <div className="testimonial-footer">
                  <span className="testimonial-author">{review.name} · {review.age}</span>
                  {review.gift && (
                    <span className="gift-tag">🎁 선물 구매</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 최종 CTA ========== */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <div className="final-cta-box">
            <h2 className="final-cta-title">나의 운명을 알아볼 준비가 되셨나요?</h2>
            <p className="final-cta-subtitle">지금 바로 프리미엄 사주 분석을 시작하세요</p>

            <div className="final-cta-buttons">
              <Link href="/fortune/saju" className="btn-analyze">
                <span>⚡</span> 내 사주 분석하기
              </Link>
              <Link href="/my/vouchers" className="btn-gift-final">
                <span>🎁</span> 선물하기
              </Link>
            </div>

            <div className="final-trust-badges">
              <div className="final-trust-item">
                <span className="final-trust-icon">🔒</span>
                <span className="final-trust-label">개인정보</span>
                <span className="final-trust-value">100% 암호화</span>
              </div>
              <div className="final-trust-item">
                <span className="final-trust-icon">⚡</span>
                <span className="final-trust-label">분석 시간</span>
                <span className="final-trust-value">평균 3분</span>
              </div>
              <div className="final-trust-item">
                <span className="final-trust-icon">💰</span>
                <span className="final-trust-label">만족도</span>
                <span className="final-trust-value">환불률 0.3%</span>
              </div>
              <div className="final-trust-item">
                <span className="final-trust-icon">📊</span>
                <span className="final-trust-label">누적 분석</span>
                <span className="final-trust-value">127,483건</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
