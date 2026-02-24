# 로컬 AI 대체제 검토 및 추천

## 현재 AI 사용 현황

### 1. 현재 사용 중인 AI 서비스
| 서비스 | 용도 | 모델 | 예상 비용 |
|--------|------|------|-----------|
| OpenAI | 사주 분석 생성, TTS | gpt-4o, gpt-4o-mini, tts-1 | $0.005-0.015/1K tokens |
| Anthropic | AI 분석 (대체) | claude-3-5-haiku, claude-sonnet-4 | $0.001-0.015/1K tokens |

### 2. AI 사용 위치
- `lib/ai/client.ts`: 통합 AI 클라이언트
- `lib/fortune/saju/ai/openaiAnalysis.ts`: 사주 분석 AI
- `app/api/fortune/saju/analyze/route.ts`: API 엔드포인트
- `lib/fortune/saju/export/audioGenerator.ts`: TTS (이미 edge-tts로 대체 완료)

---

## Ollama 소개 및 평가

### Ollama란?
- **오픈소스** 로컬 LLM 실행 환경
- macOS, Linux, Windows 지원
- Docker 컨테이너로 쉽게 배포 가능
- REST API 제공 (OpenAI 호환)

### 장점
1. **완전 무료**: API 비용 없음
2. **데이터 프라이버시**: 외부 서버로 데이터 전송 없음
3. **오프라인 사용**: 인터넷 없이 작동
4. **OpenAI API 호환**: 기존 코드 최소 수정
5. **다양한 모델 지원**: Llama, Mistral, Qwen, Gemma 등

### 단점
1. **하드웨어 요구사항**: GPU 또는 고성능 CPU 필요
2. **품질 차이**: GPT-4/Claude 대비 품질 저하 가능
3. **한국어 성능**: 영어 대비 한국어 성능 제한적
4. **서버 관리**: 자체 서버 운영 필요

---

## 추천 로컬 AI 모델

### 1. Ollama + Qwen2.5 (추천)
```
한국어 성능: ★★★★☆ (우수)
품질: ★★★★☆
속도: ★★★★☆
메모리: 8GB+ RAM 필요 (14B 모델 기준)
```

**장점:**
- 한국어 성능 우수 (중국 Alibaba 개발)
- 다양한 크기 모델 (7B, 14B, 72B)
- 상업적 사용 가능 (Apache 2.0)

**설치 및 실행:**
```bash
# Ollama 설치 (macOS)
brew install ollama

# Qwen2.5 모델 다운로드
ollama pull qwen2.5:14b

# 서버 시작
ollama serve
```

### 2. LM Studio
```
한국어 성능: ★★★★☆
사용 편의성: ★★★★★
GUI 제공: O
```

**장점:**
- GUI 기반 쉬운 사용
- 모델 다운로드/관리 편리
- OpenAI 호환 API 제공

### 3. LocalAI
```
Docker 지원: O
API 호환성: ★★★★★
확장성: ★★★★★
```

**장점:**
- OpenAI API 100% 호환
- Docker로 쉬운 배포
- 다양한 모델 형식 지원

---

## 구현 가이드: Ollama 연동

### Step 1: Ollama 서버 설정

```bash
# Docker로 Ollama 실행
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# 모델 다운로드
docker exec -it ollama ollama pull qwen2.5:14b
```

### Step 2: AI 클라이언트 수정

`lib/ai/client.ts`에 Ollama 지원 추가:

```typescript
// Ollama 지원 추가
export type AIModel = 'haiku' | 'sonnet' | 'gpt-4o' | 'gpt-4o-mini' | 'ollama-qwen';

async function callOllamaAPI(options: AIRequestOptions): Promise<AIResponse> {
  const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'qwen2.5:14b';

  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: options.userPrompt }
      ],
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        num_predict: options.maxTokens || 1024
      }
    })
  });

  if (!response.ok) {
    throw new Error('Ollama API call failed');
  }

  const data = await response.json();
  return {
    content: data.message?.content || '',
    tokensUsed: (data.prompt_eval_count || 0) + (data.eval_count || 0),
    model: modelName
  };
}
```

### Step 3: 환경변수 설정

`.env.local`:
```
# Ollama 설정 (로컬 AI 사용 시)
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:14b

# 외부 API 대체 (선택적)
# OPENAI_API_KEY=... (제거 가능)
```

---

## 추천 전략

### 개발/테스트 환경
- **Ollama + Qwen2.5** 사용
- 비용 없이 무제한 테스트 가능

### 프로덕션 환경

#### 옵션 A: 하이브리드 방식 (추천)
```
무료 사용자: Ollama (Qwen2.5)
프리미엄 사용자: OpenAI/Claude
```

장점:
- 무료 티어 비용 최소화
- 프리미엄 사용자에게 최상 품질 제공

#### 옵션 B: 완전 자체 호스팅
```
모든 사용자: Ollama
```

장점:
- API 비용 완전 제거
- 데이터 프라이버시 최대화

단점:
- 서버 비용 발생
- 품질 차이 있을 수 있음

---

## 하드웨어 요구사항

### 최소 사양 (7B 모델)
- CPU: 8코어 이상
- RAM: 16GB
- Storage: 20GB SSD

### 권장 사양 (14B+ 모델)
- GPU: NVIDIA RTX 3080 이상 (VRAM 10GB+)
- RAM: 32GB
- Storage: 50GB SSD

### 클라우드 옵션
- **RunPod**: GPU 서버 시간당 $0.2~0.5
- **Vast.ai**: GPU 임대 저렴
- **Hugging Face Spaces**: 제한적 무료 호스팅

---

## 한국어 특화 모델 추천

### 1. KULLM (Korean Llama)
- 한국어 특화 fine-tuned 모델
- 고려대학교 NLP 연구실 개발

### 2. KoAlpaca
- 한국어 Alpaca 모델
- 자연스러운 한국어 대화

### 3. Qwen2.5-Korean (추천)
- 기본 한국어 성능 우수
- 추가 fine-tuning 없이 사용 가능

---

## 결론 및 추천

### 즉시 적용 가능 (이미 완료)
- **TTS**: edge-tts로 OpenAI TTS 대체 완료

### 권장 다음 단계

1. **Ollama 환경 구축**
   - Docker로 Ollama 설정
   - Qwen2.5:14b 모델 테스트

2. **하이브리드 API 구현**
   - 무료 티어: Ollama
   - 프리미엄 티어: 기존 OpenAI/Claude

3. **품질 비교 테스트**
   - 동일 프롬프트로 품질 비교
   - 사용자 피드백 수집

### 예상 비용 절감
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| TTS | OpenAI TTS $0.015/1K chars | edge-tts (무료) |
| AI 분석 (무료 티어) | ~$0.01/요청 | Ollama (무료) |
| AI 분석 (프리미엄) | ~$0.02/요청 | 유지 |

**월간 예상 절감액**: 무료 사용자 1000명 기준 약 $100-200
