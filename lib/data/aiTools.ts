/**
 * AI Tools Database
 * Contains all AI tools with their details including referral URLs
 */

export interface AITool {
  id: string;
  name: string;
  company: string;
  rating: number;
  price: string;
  description: string;
  detailedDescription: string;
  logo: string;
  category: string;
  website: string;
  features: string[];
  pros: string[];
  cons: string[];
}

// Default website URLs (can be overridden by admin settings)
export const defaultWebsites: Record<string, string> = {
  'ChatGPT': 'https://chat.openai.com',
  'Claude': 'https://claude.ai',
  'GEMINI': 'https://gemini.google.com',
  'Midjourney': 'https://midjourney.com',
  'DALL-E 3': 'https://openai.com/dall-e-3',
  'Runway': 'https://runway.ml',
  'GitHub Copilot': 'https://github.com/features/copilot',
  'Cursor': 'https://cursor.com',
  'ElevenLabs': 'https://elevenlabs.io',
  'Suno': 'https://suno.com',
  'Framer': 'https://framer.com',
  'Zapier AI': 'https://zapier.com',
  'Jasper': 'https://jasper.ai',
  'Copy.ai': 'https://copy.ai',
  'Perplexity': 'https://perplexity.ai',
  'Writesonic': 'https://writesonic.com',
  'Rytr': 'https://rytr.me',
  'QuillBot': 'https://quillbot.com',
  'Wordtune': 'https://wordtune.com',
  'Grammarly': 'https://grammarly.com',
  'Stable Diffusion': 'https://stability.ai',
  'Leonardo AI': 'https://leonardo.ai',
  'Canva AI': 'https://canva.com',
  'Adobe Firefly': 'https://firefly.adobe.com',
  'Pika Labs': 'https://pika.art',
  'Ideogram': 'https://ideogram.ai',
  'Udio': 'https://udio.com',
  'Mubert': 'https://mubert.com',
  'AIVA': 'https://aiva.ai',
  'Soundraw': 'https://soundraw.io',
  'Boomy': 'https://boomy.com',
  'Descript': 'https://descript.com',
  'Webflow': 'https://webflow.com',
  '10Web': 'https://10web.io',
  'Wix ADI': 'https://wix.com',
  'Durable': 'https://durable.co',
  'Hostinger AI': 'https://hostinger.com',
  'Squarespace': 'https://squarespace.com',
  'Tabnine': 'https://tabnine.com',
  'Replit AI': 'https://replit.com',
  'Codeium': 'https://codeium.com',
  'Amazon Q': 'https://aws.amazon.com/q',
  'Sourcegraph Cody': 'https://sourcegraph.com/cody',
  'Make': 'https://make.com',
  'n8n': 'https://n8n.io',
  'Bardeen': 'https://bardeen.ai',
  'Axiom': 'https://axiom.ai',
  'Magical': 'https://getmagical.com',
  'Duolingo Max': 'https://duolingo.com',
  'Khanmigo': 'https://khanacademy.org/khan-labs',
  'Quizlet': 'https://quizlet.com',
  'Photomath': 'https://photomath.com',
  'Socratic': 'https://socratic.org',
  'HubSpot AI': 'https://hubspot.com',
  'Surfer SEO': 'https://surferseo.com',
  'AdCreative.ai': 'https://adcreative.ai',
  'Frase': 'https://frase.io',
  'MarketMuse': 'https://marketmuse.com',
  'OpenAI API': 'https://platform.openai.com',
  'Google AI Studio': 'https://aistudio.google.com',
  'Anthropic API': 'https://console.anthropic.com',
  'Hugging Face': 'https://huggingface.co',
  'Replicate': 'https://replicate.com',
};

// Detailed descriptions for hover tooltips
export const detailedDescriptions: Record<string, { detailed: string; features: string[]; pros: string[]; cons: string[] }> = {
  'ChatGPT': {
    detailed: 'OpenAI가 개발한 세계 최고의 대화형 AI. GPT-4 모델을 기반으로 자연스러운 대화, 코드 작성, 문서 작성, 분석 등 다양한 작업을 수행합니다.',
    features: ['자연어 대화', '코드 생성', '이미지 분석', '플러그인 지원', '파일 업로드'],
    pros: ['직관적인 인터페이스', '다양한 활용 가능', '빠른 응답 속도'],
    cons: ['월 $20 유료', '최신 정보 제한', '가끔 부정확한 정보'],
  },
  'Claude': {
    detailed: 'Anthropic이 개발한 안전하고 도움이 되는 AI 어시스턴트. 긴 문서 분석, 코드 작성, 창의적 글쓰기에 뛰어납니다.',
    features: ['200K 토큰 컨텍스트', 'PDF 분석', '코드 작성', '다국어 지원', '아티팩트 생성'],
    pros: ['긴 문서 처리 가능', '정확한 분석력', '안전한 응답'],
    cons: ['이미지 생성 불가', '일부 기능 제한', 'API 비용'],
  },
  'GEMINI': {
    detailed: 'Google의 최신 멀티모달 AI 모델. 텍스트, 이미지, 코드를 동시에 이해하고 생성할 수 있습니다.',
    features: ['멀티모달 처리', 'Google 연동', '실시간 검색', '코드 실행', '이미지 분석'],
    pros: ['무료 버전 제공', 'Google 생태계 연동', '빠른 속도'],
    cons: ['ChatGPT 대비 기능 제한', '한국어 품질', '일부 국가 제한'],
  },
  'Midjourney': {
    detailed: '최고 품질의 AI 이미지 생성 도구. 예술적이고 창의적인 이미지를 생성하는 데 특화되어 있습니다.',
    features: ['고품질 이미지', '스타일 변환', 'Vary/Zoom 기능', '파라미터 조정', 'Discord 기반'],
    pros: ['업계 최고 품질', '다양한 스타일', '활발한 커뮤니티'],
    cons: ['Discord 필수', '학습 곡선', '상업용 라이선스 필요'],
  },
  'GitHub Copilot': {
    detailed: 'GitHub과 OpenAI가 협력해 만든 AI 코딩 어시스턴트. VS Code 등 IDE에서 실시간 코드 제안을 제공합니다.',
    features: ['실시간 코드 제안', '다양한 언어 지원', 'IDE 통합', '테스트 생성', '문서 생성'],
    pros: ['높은 정확도', '빠른 개발 속도', '학습 효과'],
    cons: ['월 $10 유료', '인터넷 필요', '코드 보안 우려'],
  },
  'Cursor': {
    detailed: 'AI 기반 코드 에디터. VS Code를 기반으로 하며 ChatGPT/Claude를 통합하여 더 스마트한 코딩 경험을 제공합니다.',
    features: ['AI 채팅', '코드베이스 이해', '자동 완성', '리팩토링', 'Git 통합'],
    pros: ['강력한 AI 통합', 'VS Code 호환', '빠른 개발'],
    cons: ['월 $20 유료', '높은 메모리 사용', '학습 필요'],
  },
  'ElevenLabs': {
    detailed: '최첨단 AI 음성 합성 기술. 자연스러운 음성 생성과 음성 복제 기능을 제공합니다.',
    features: ['음성 복제', '다국어 지원', '감정 조절', 'API 제공', '실시간 변환'],
    pros: ['자연스러운 음성', '빠른 생성', '다양한 음성'],
    cons: ['음성 복제 윤리 이슈', '긴 텍스트 비용', '일부 언어 제한'],
  },
  'Suno': {
    detailed: 'AI로 음악을 생성하는 혁신적인 플랫폼. 가사와 멜로디를 동시에 생성할 수 있습니다.',
    features: ['전체 곡 생성', '가사 생성', '다양한 장르', '리믹스', '확장 기능'],
    pros: ['완성도 높은 음악', '쉬운 사용법', '무료 크레딧'],
    cons: ['저작권 불명확', '세부 조절 제한', '상업용 라이선스'],
  },
};

// AI Tools data organized by category
export const aiToolsData: Record<string, AITool[]> = {
  all: [
    { id: '1', name: 'ChatGPT', company: 'OpenAI', rating: 4.8, price: '월 $20', description: 'OpenAI의 대화형 AI 어시스턴트', detailedDescription: detailedDescriptions['ChatGPT']?.detailed || '', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', category: 'writing', website: defaultWebsites['ChatGPT'], features: detailedDescriptions['ChatGPT']?.features || [], pros: detailedDescriptions['ChatGPT']?.pros || [], cons: detailedDescriptions['ChatGPT']?.cons || [] },
    { id: '2', name: 'Claude', company: 'Anthropic', rating: 4.7, price: '월 $20', description: 'Anthropic의 안전한 AI 어시스턴트', detailedDescription: detailedDescriptions['Claude']?.detailed || '', logo: 'https://www.anthropic.com/images/icons/apple-touch-icon.png', category: 'writing', website: defaultWebsites['Claude'], features: detailedDescriptions['Claude']?.features || [], pros: detailedDescriptions['Claude']?.pros || [], cons: detailedDescriptions['Claude']?.cons || [] },
    { id: '3', name: 'GEMINI', company: 'Google', rating: 4.6, price: '무료/월 $20', description: 'Google의 멀티모달 AI', detailedDescription: detailedDescriptions['GEMINI']?.detailed || '', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg', category: 'writing', website: defaultWebsites['GEMINI'], features: detailedDescriptions['GEMINI']?.features || [], pros: detailedDescriptions['GEMINI']?.pros || [], cons: detailedDescriptions['GEMINI']?.cons || [] },
    { id: '4', name: 'Midjourney', company: 'Midjourney', rating: 4.9, price: '월 $10', description: '최고 품질의 AI 이미지 생성', detailedDescription: detailedDescriptions['Midjourney']?.detailed || '', logo: 'https://cdn.worldvectorlogo.com/logos/midjourney-1.svg', category: 'image', website: defaultWebsites['Midjourney'], features: detailedDescriptions['Midjourney']?.features || [], pros: detailedDescriptions['Midjourney']?.pros || [], cons: detailedDescriptions['Midjourney']?.cons || [] },
    { id: '5', name: 'DALL-E 3', company: 'OpenAI', rating: 4.6, price: '월 $20', description: 'OpenAI의 이미지 생성 AI', detailedDescription: '', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', category: 'image', website: defaultWebsites['DALL-E 3'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Runway', company: 'Runway', rating: 4.4, price: '월 $15', description: 'AI 비디오 생성 플랫폼', detailedDescription: '', logo: 'https://asset.brandfetch.io/idSFZwYhgE/idNVL6UQbQ.png', category: 'image', website: defaultWebsites['Runway'], features: [], pros: [], cons: [] },
    { id: '7', name: 'GitHub Copilot', company: 'GitHub', rating: 4.8, price: '월 $10', description: 'AI 코드 어시스턴트', detailedDescription: detailedDescriptions['GitHub Copilot']?.detailed || '', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', category: 'coding', website: defaultWebsites['GitHub Copilot'], features: detailedDescriptions['GitHub Copilot']?.features || [], pros: detailedDescriptions['GitHub Copilot']?.pros || [], cons: detailedDescriptions['GitHub Copilot']?.cons || [] },
    { id: '8', name: 'Cursor', company: 'Cursor', rating: 4.7, price: '월 $20', description: 'AI 기반 코드 에디터', detailedDescription: detailedDescriptions['Cursor']?.detailed || '', logo: 'https://www.cursor.com/apple-touch-icon.png', category: 'coding', website: defaultWebsites['Cursor'], features: detailedDescriptions['Cursor']?.features || [], pros: detailedDescriptions['Cursor']?.pros || [], cons: detailedDescriptions['Cursor']?.cons || [] },
    { id: '9', name: 'ElevenLabs', company: 'ElevenLabs', rating: 4.7, price: '월 $5', description: 'AI 음성 합성 도구', detailedDescription: detailedDescriptions['ElevenLabs']?.detailed || '', logo: 'https://elevenlabs.io/favicon.ico', category: 'audio', website: defaultWebsites['ElevenLabs'], features: detailedDescriptions['ElevenLabs']?.features || [], pros: detailedDescriptions['ElevenLabs']?.pros || [], cons: detailedDescriptions['ElevenLabs']?.cons || [] },
    { id: '10', name: 'Suno', company: 'Suno AI', rating: 4.5, price: '월 $10', description: 'AI 음악 생성 플랫폼', detailedDescription: detailedDescriptions['Suno']?.detailed || '', logo: 'https://suno.com/favicon.ico', category: 'audio', website: defaultWebsites['Suno'], features: detailedDescriptions['Suno']?.features || [], pros: detailedDescriptions['Suno']?.pros || [], cons: detailedDescriptions['Suno']?.cons || [] },
    { id: '11', name: 'Framer', company: 'Framer', rating: 4.7, price: '월 $20', description: 'AI 기반 웹사이트 빌더', detailedDescription: '', logo: 'https://www.framer.com/images/favicons/apple-touch-icon.png', category: 'website', website: defaultWebsites['Framer'], features: [], pros: [], cons: [] },
    { id: '12', name: 'Zapier AI', company: 'Zapier', rating: 4.5, price: '월 $20', description: 'AI 워크플로우 자동화', detailedDescription: '', logo: 'https://zapier.com/apple-touch-icon.png', category: 'automation', website: defaultWebsites['Zapier AI'], features: [], pros: [], cons: [] },
  ],
  writing: [
    { id: '1', name: 'ChatGPT', company: 'OpenAI', rating: 4.8, price: '월 $20', description: 'OpenAI의 대화형 AI 어시스턴트', detailedDescription: detailedDescriptions['ChatGPT']?.detailed || '', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', category: 'writing', website: defaultWebsites['ChatGPT'], features: detailedDescriptions['ChatGPT']?.features || [], pros: detailedDescriptions['ChatGPT']?.pros || [], cons: detailedDescriptions['ChatGPT']?.cons || [] },
    { id: '2', name: 'Claude', company: 'Anthropic', rating: 4.7, price: '월 $20', description: 'Anthropic의 안전한 AI 어시스턴트', detailedDescription: detailedDescriptions['Claude']?.detailed || '', logo: 'https://www.anthropic.com/images/icons/apple-touch-icon.png', category: 'writing', website: defaultWebsites['Claude'], features: detailedDescriptions['Claude']?.features || [], pros: detailedDescriptions['Claude']?.pros || [], cons: detailedDescriptions['Claude']?.cons || [] },
    { id: '3', name: 'GEMINI', company: 'Google', rating: 4.6, price: '무료/월 $20', description: 'Google의 멀티모달 AI', detailedDescription: detailedDescriptions['GEMINI']?.detailed || '', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg', category: 'writing', website: defaultWebsites['GEMINI'], features: detailedDescriptions['GEMINI']?.features || [], pros: detailedDescriptions['GEMINI']?.pros || [], cons: detailedDescriptions['GEMINI']?.cons || [] },
    { id: '4', name: 'Jasper', company: 'Jasper AI', rating: 4.5, price: '월 $39', description: '마케팅 콘텐츠 전문 AI', detailedDescription: '', logo: 'https://www.jasper.ai/favicon.ico', category: 'writing', website: defaultWebsites['Jasper'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Copy.ai', company: 'Copy.ai', rating: 4.2, price: '월 $36', description: 'AI 카피라이팅 전문 도구', detailedDescription: '', logo: 'https://www.copy.ai/favicon.ico', category: 'writing', website: defaultWebsites['Copy.ai'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Perplexity', company: 'Perplexity AI', rating: 4.4, price: '무료/월 $20', description: '검색 기반 AI 답변 생성', detailedDescription: '', logo: 'https://www.perplexity.ai/favicon.ico', category: 'writing', website: defaultWebsites['Perplexity'], features: [], pros: [], cons: [] },
    { id: '7', name: 'Writesonic', company: 'Writesonic', rating: 4.1, price: '월 $13', description: 'AI 콘텐츠 생성 플랫폼', detailedDescription: '', logo: 'https://writesonic.com/favicon.ico', category: 'writing', website: defaultWebsites['Writesonic'], features: [], pros: [], cons: [] },
    { id: '8', name: 'Rytr', company: 'Rytr', rating: 4.0, price: '월 $9', description: 'AI 라이팅 어시스턴트', detailedDescription: '', logo: 'https://rytr.me/favicon.ico', category: 'writing', website: defaultWebsites['Rytr'], features: [], pros: [], cons: [] },
    { id: '9', name: 'QuillBot', company: 'QuillBot', rating: 4.2, price: '월 $5', description: 'AI 패러프레이징 도구', detailedDescription: '', logo: 'https://quillbot.com/favicon.ico', category: 'writing', website: defaultWebsites['QuillBot'], features: [], pros: [], cons: [] },
    { id: '10', name: 'Wordtune', company: 'AI21 Labs', rating: 4.0, price: '월 $10', description: 'AI 글쓰기 개선 도구', detailedDescription: '', logo: 'https://www.wordtune.com/favicon.ico', category: 'writing', website: defaultWebsites['Wordtune'], features: [], pros: [], cons: [] },
    { id: '11', name: 'Grammarly', company: 'Grammarly', rating: 4.1, price: '월 $15', description: '팀용 AI 글쓰기 도구', detailedDescription: '', logo: 'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/favicon.ico', category: 'writing', website: defaultWebsites['Grammarly'], features: [], pros: [], cons: [] },
  ],
  image: [
    { id: '1', name: 'Midjourney', company: 'Midjourney', rating: 4.9, price: '월 $10', description: '최고 품질의 AI 이미지 생성', detailedDescription: detailedDescriptions['Midjourney']?.detailed || '', logo: 'https://cdn.worldvectorlogo.com/logos/midjourney-1.svg', category: 'image', website: defaultWebsites['Midjourney'], features: detailedDescriptions['Midjourney']?.features || [], pros: detailedDescriptions['Midjourney']?.pros || [], cons: detailedDescriptions['Midjourney']?.cons || [] },
    { id: '2', name: 'DALL-E 3', company: 'OpenAI', rating: 4.6, price: '월 $20', description: 'OpenAI의 이미지 생성 AI', detailedDescription: '', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', category: 'image', website: defaultWebsites['DALL-E 3'], features: [], pros: [], cons: [] },
    { id: '3', name: 'Runway', company: 'Runway', rating: 4.4, price: '월 $15', description: 'AI 비디오 생성 플랫폼', detailedDescription: '', logo: 'https://asset.brandfetch.io/idSFZwYhgE/idNVL6UQbQ.png', category: 'image', website: defaultWebsites['Runway'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Stable Diffusion', company: 'Stability AI', rating: 4.3, price: '무료', description: '오픈소스 이미지 생성 AI', detailedDescription: '', logo: 'https://stability.ai/favicon.ico', category: 'image', website: defaultWebsites['Stable Diffusion'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Leonardo AI', company: 'Leonardo.ai', rating: 4.2, price: '월 $12', description: '게임 에셋 특화 AI', detailedDescription: '', logo: 'https://leonardo.ai/favicon.ico', category: 'image', website: defaultWebsites['Leonardo AI'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Canva AI', company: 'Canva', rating: 4.3, price: '월 $15', description: '디자인 자동화 플랫폼', detailedDescription: '', logo: 'https://static.canva.com/static/images/favicon.ico', category: 'image', website: defaultWebsites['Canva AI'], features: [], pros: [], cons: [] },
    { id: '7', name: 'Adobe Firefly', company: 'Adobe', rating: 4.4, price: '월 $23', description: 'Adobe의 생성형 AI', detailedDescription: '', logo: 'https://www.adobe.com/favicon.ico', category: 'image', website: defaultWebsites['Adobe Firefly'], features: [], pros: [], cons: [] },
    { id: '8', name: 'Pika Labs', company: 'Pika', rating: 4.1, price: '월 $10', description: 'AI 비디오 생성', detailedDescription: '', logo: 'https://pika.art/favicon.ico', category: 'image', website: defaultWebsites['Pika Labs'], features: [], pros: [], cons: [] },
    { id: '9', name: 'Ideogram', company: 'Ideogram', rating: 4.0, price: '무료/월 $8', description: '텍스트 렌더링 특화 AI', detailedDescription: '', logo: 'https://ideogram.ai/favicon.ico', category: 'image', website: defaultWebsites['Ideogram'], features: [], pros: [], cons: [] },
  ],
  audio: [
    { id: '1', name: 'Suno', company: 'Suno AI', rating: 4.5, price: '월 $10', description: 'AI 음악 생성 플랫폼', detailedDescription: detailedDescriptions['Suno']?.detailed || '', logo: 'https://suno.com/favicon.ico', category: 'audio', website: defaultWebsites['Suno'], features: detailedDescriptions['Suno']?.features || [], pros: detailedDescriptions['Suno']?.pros || [], cons: detailedDescriptions['Suno']?.cons || [] },
    { id: '2', name: 'Udio', company: 'Udio', rating: 4.3, price: '월 $12', description: '고품질 AI 음악 제작', detailedDescription: '', logo: 'https://www.udio.com/favicon.ico', category: 'audio', website: defaultWebsites['Udio'], features: [], pros: [], cons: [] },
    { id: '3', name: 'ElevenLabs', company: 'ElevenLabs', rating: 4.7, price: '월 $5', description: 'AI 음성 합성 도구', detailedDescription: detailedDescriptions['ElevenLabs']?.detailed || '', logo: 'https://elevenlabs.io/favicon.ico', category: 'audio', website: defaultWebsites['ElevenLabs'], features: detailedDescriptions['ElevenLabs']?.features || [], pros: detailedDescriptions['ElevenLabs']?.pros || [], cons: detailedDescriptions['ElevenLabs']?.cons || [] },
    { id: '4', name: 'Mubert', company: 'Mubert', rating: 4.1, price: '월 $14', description: 'AI 배경음악 생성', detailedDescription: '', logo: 'https://mubert.com/favicon.ico', category: 'audio', website: defaultWebsites['Mubert'], features: [], pros: [], cons: [] },
    { id: '5', name: 'AIVA', company: 'AIVA', rating: 4.0, price: '월 $11', description: 'AI 작곡가', detailedDescription: '', logo: 'https://www.aiva.ai/favicon.ico', category: 'audio', website: defaultWebsites['AIVA'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Soundraw', company: 'Soundraw', rating: 3.9, price: '월 $17', description: '로열티 프리 AI 음악', detailedDescription: '', logo: 'https://soundraw.io/favicon.ico', category: 'audio', website: defaultWebsites['Soundraw'], features: [], pros: [], cons: [] },
    { id: '7', name: 'Boomy', company: 'Boomy', rating: 3.7, price: '월 $3', description: '즉석 음악 생성', detailedDescription: '', logo: 'https://boomy.com/favicon.ico', category: 'audio', website: defaultWebsites['Boomy'], features: [], pros: [], cons: [] },
    { id: '8', name: 'Descript', company: 'Descript', rating: 4.2, price: '월 $12', description: 'AI 오디오/비디오 편집', detailedDescription: '', logo: 'https://www.descript.com/favicon.ico', category: 'audio', website: defaultWebsites['Descript'], features: [], pros: [], cons: [] },
  ],
  website: [
    { id: '1', name: 'Framer', company: 'Framer', rating: 4.7, price: '월 $20', description: 'AI 기반 웹사이트 빌더', detailedDescription: '', logo: 'https://www.framer.com/images/favicons/apple-touch-icon.png', category: 'website', website: defaultWebsites['Framer'], features: [], pros: [], cons: [] },
    { id: '2', name: 'Webflow', company: 'Webflow', rating: 4.6, price: '월 $14', description: '노코드 웹사이트 제작', detailedDescription: '', logo: 'https://webflow.com/favicon.ico', category: 'website', website: defaultWebsites['Webflow'], features: [], pros: [], cons: [] },
    { id: '3', name: '10Web', company: '10Web', rating: 4.3, price: '월 $10', description: 'AI 웹사이트 생성기', detailedDescription: '', logo: 'https://10web.io/favicon.ico', category: 'website', website: defaultWebsites['10Web'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Wix ADI', company: 'Wix', rating: 4.1, price: '월 $16', description: 'AI 웹사이트 디자인', detailedDescription: '', logo: 'https://www.wix.com/favicon.ico', category: 'website', website: defaultWebsites['Wix ADI'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Durable', company: 'Durable', rating: 4.0, price: '월 $12', description: '30초 웹사이트 생성', detailedDescription: '', logo: 'https://durable.co/favicon.ico', category: 'website', website: defaultWebsites['Durable'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Hostinger AI', company: 'Hostinger', rating: 3.9, price: '월 $3', description: 'AI 웹사이트 빌더', detailedDescription: '', logo: 'https://www.hostinger.com/favicon.ico', category: 'website', website: defaultWebsites['Hostinger AI'], features: [], pros: [], cons: [] },
    { id: '7', name: 'Squarespace', company: 'Squarespace', rating: 4.2, price: '월 $18', description: '디자인 중심 웹빌더', detailedDescription: '', logo: 'https://www.squarespace.com/favicon.ico', category: 'website', website: defaultWebsites['Squarespace'], features: [], pros: [], cons: [] },
  ],
  coding: [
    { id: '1', name: 'GitHub Copilot', company: 'GitHub', rating: 4.8, price: '월 $10', description: 'AI 코드 어시스턴트', detailedDescription: detailedDescriptions['GitHub Copilot']?.detailed || '', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', category: 'coding', website: defaultWebsites['GitHub Copilot'], features: detailedDescriptions['GitHub Copilot']?.features || [], pros: detailedDescriptions['GitHub Copilot']?.pros || [], cons: detailedDescriptions['GitHub Copilot']?.cons || [] },
    { id: '2', name: 'Cursor', company: 'Cursor', rating: 4.7, price: '월 $20', description: 'AI 기반 코드 에디터', detailedDescription: detailedDescriptions['Cursor']?.detailed || '', logo: 'https://www.cursor.com/apple-touch-icon.png', category: 'coding', website: defaultWebsites['Cursor'], features: detailedDescriptions['Cursor']?.features || [], pros: detailedDescriptions['Cursor']?.pros || [], cons: detailedDescriptions['Cursor']?.cons || [] },
    { id: '3', name: 'Tabnine', company: 'Tabnine', rating: 4.3, price: '월 $12', description: 'AI 코드 자동완성', detailedDescription: '', logo: 'https://www.tabnine.com/favicon.ico', category: 'coding', website: defaultWebsites['Tabnine'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Replit AI', company: 'Replit', rating: 4.4, price: '월 $7', description: 'AI 기반 개발 환경', detailedDescription: '', logo: 'https://replit.com/public/icons/favicon.ico', category: 'coding', website: defaultWebsites['Replit AI'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Codeium', company: 'Codeium', rating: 4.2, price: '무료', description: '무료 AI 코딩 도구', detailedDescription: '', logo: 'https://codeium.com/favicon.ico', category: 'coding', website: defaultWebsites['Codeium'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Amazon Q', company: 'AWS', rating: 4.1, price: '무료/월 $19', description: 'AWS AI 코드 생성', detailedDescription: '', logo: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico', category: 'coding', website: defaultWebsites['Amazon Q'], features: [], pros: [], cons: [] },
    { id: '7', name: 'Sourcegraph Cody', company: 'Sourcegraph', rating: 4.0, price: '무료/월 $9', description: 'AI 코드 검색 & 생성', detailedDescription: '', logo: 'https://sourcegraph.com/favicon.ico', category: 'coding', website: defaultWebsites['Sourcegraph Cody'], features: [], pros: [], cons: [] },
  ],
  automation: [
    { id: '1', name: 'Zapier AI', company: 'Zapier', rating: 4.5, price: '월 $20', description: 'AI 워크플로우 자동화', detailedDescription: '', logo: 'https://zapier.com/apple-touch-icon.png', category: 'automation', website: defaultWebsites['Zapier AI'], features: [], pros: [], cons: [] },
    { id: '2', name: 'Make', company: 'Make', rating: 4.4, price: '월 $9', description: '시각적 자동화 플랫폼', detailedDescription: '', logo: 'https://www.make.com/favicon.ico', category: 'automation', website: defaultWebsites['Make'], features: [], pros: [], cons: [] },
    { id: '3', name: 'n8n', company: 'n8n', rating: 4.3, price: '무료/월 $20', description: '오픈소스 자동화 도구', detailedDescription: '', logo: 'https://n8n.io/favicon.ico', category: 'automation', website: defaultWebsites['n8n'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Bardeen', company: 'Bardeen', rating: 4.2, price: '무료/월 $10', description: 'AI 브라우저 자동화', detailedDescription: '', logo: 'https://www.bardeen.ai/favicon.ico', category: 'automation', website: defaultWebsites['Bardeen'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Axiom', company: 'Axiom', rating: 4.0, price: '월 $15', description: '노코드 브라우저 봇', detailedDescription: '', logo: 'https://axiom.ai/favicon.ico', category: 'automation', website: defaultWebsites['Axiom'], features: [], pros: [], cons: [] },
    { id: '6', name: 'Magical', company: 'Magical', rating: 4.1, price: '무료/월 $10', description: 'AI 텍스트 확장', detailedDescription: '', logo: 'https://www.getmagical.com/favicon.ico', category: 'automation', website: defaultWebsites['Magical'], features: [], pros: [], cons: [] },
  ],
  education: [
    { id: '1', name: 'Duolingo Max', company: 'Duolingo', rating: 4.6, price: '월 $30', description: 'AI 언어 학습', detailedDescription: '', logo: 'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico', category: 'education', website: defaultWebsites['Duolingo Max'], features: [], pros: [], cons: [] },
    { id: '2', name: 'Khanmigo', company: 'Khan Academy', rating: 4.5, price: '월 $4', description: 'AI 튜터', detailedDescription: '', logo: 'https://cdn.kastatic.org/images/favicon.ico', category: 'education', website: defaultWebsites['Khanmigo'], features: [], pros: [], cons: [] },
    { id: '3', name: 'Quizlet', company: 'Quizlet', rating: 4.3, price: '월 $8', description: 'AI 학습 도우미', detailedDescription: '', logo: 'https://quizlet.com/favicon.ico', category: 'education', website: defaultWebsites['Quizlet'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Photomath', company: 'Photomath', rating: 4.4, price: '무료/월 $10', description: 'AI 수학 문제 풀이', detailedDescription: '', logo: 'https://photomath.com/favicon.ico', category: 'education', website: defaultWebsites['Photomath'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Socratic', company: 'Google', rating: 4.2, price: '무료', description: 'AI 숙제 도우미', detailedDescription: '', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg', category: 'education', website: defaultWebsites['Socratic'], features: [], pros: [], cons: [] },
  ],
  marketing: [
    { id: '1', name: 'HubSpot AI', company: 'HubSpot', rating: 4.5, price: '월 $45', description: 'AI 마케팅 자동화', detailedDescription: '', logo: 'https://www.hubspot.com/favicon.ico', category: 'marketing', website: defaultWebsites['HubSpot AI'], features: [], pros: [], cons: [] },
    { id: '2', name: 'Surfer SEO', company: 'Surfer', rating: 4.4, price: '월 $59', description: 'AI SEO 최적화', detailedDescription: '', logo: 'https://surferseo.com/favicon.ico', category: 'marketing', website: defaultWebsites['Surfer SEO'], features: [], pros: [], cons: [] },
    { id: '3', name: 'AdCreative.ai', company: 'AdCreative', rating: 4.3, price: '월 $29', description: 'AI 광고 크리에이티브', detailedDescription: '', logo: 'https://www.adcreative.ai/favicon.ico', category: 'marketing', website: defaultWebsites['AdCreative.ai'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Frase', company: 'Frase', rating: 4.2, price: '월 $15', description: 'AI 콘텐츠 전략', detailedDescription: '', logo: 'https://www.frase.io/favicon.ico', category: 'marketing', website: defaultWebsites['Frase'], features: [], pros: [], cons: [] },
    { id: '5', name: 'MarketMuse', company: 'MarketMuse', rating: 4.1, price: '월 $149', description: 'AI 콘텐츠 인텔리전스', detailedDescription: '', logo: 'https://www.marketmuse.com/favicon.ico', category: 'marketing', website: defaultWebsites['MarketMuse'], features: [], pros: [], cons: [] },
  ],
  platform: [
    { id: '1', name: 'OpenAI API', company: 'OpenAI', rating: 4.9, price: '사용량 기반', description: 'GPT API 플랫폼', detailedDescription: '', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', category: 'platform', website: defaultWebsites['OpenAI API'], features: [], pros: [], cons: [] },
    { id: '2', name: 'Google AI Studio', company: 'Google', rating: 4.6, price: '무료/사용량', description: 'Gemini API 플랫폼', detailedDescription: '', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg', category: 'platform', website: defaultWebsites['Google AI Studio'], features: [], pros: [], cons: [] },
    { id: '3', name: 'Anthropic API', company: 'Anthropic', rating: 4.7, price: '사용량 기반', description: 'Claude API 플랫폼', detailedDescription: '', logo: 'https://www.anthropic.com/images/icons/apple-touch-icon.png', category: 'platform', website: defaultWebsites['Anthropic API'], features: [], pros: [], cons: [] },
    { id: '4', name: 'Hugging Face', company: 'Hugging Face', rating: 4.5, price: '무료/Pro', description: 'AI 모델 허브', detailedDescription: '', logo: 'https://huggingface.co/favicon.ico', category: 'platform', website: defaultWebsites['Hugging Face'], features: [], pros: [], cons: [] },
    { id: '5', name: 'Replicate', company: 'Replicate', rating: 4.3, price: '사용량 기반', description: 'AI 모델 호스팅', detailedDescription: '', logo: 'https://replicate.com/favicon.ico', category: 'platform', website: defaultWebsites['Replicate'], features: [], pros: [], cons: [] },
  ],
};

export const categoryLabels: Record<string, string> = {
  all: '전체 AI 도구 랭킹',
  writing: '글쓰기 AI 도구',
  image: '이미지/영상 AI 도구',
  audio: '음원 AI 도구',
  website: '홈페이지 AI 도구',
  coding: 'AI 코딩 도구',
  automation: '업무/자동화 AI 도구',
  education: '교육 AI 도구',
  marketing: '마케팅/광고 AI 도구',
  platform: 'AI 플랫폼',
};

export const categorySubtitles: Record<string, string> = {
  all: '1위부터 3위까지 특별 표시된 최고의 AI 도구들을 확인하세요',
  writing: '최고의 글쓰기 AI 도구들을 랭킹순으로 확인하세요',
  image: '최고의 이미지/영상 AI 도구들을 랭킹순으로 확인하세요',
  audio: '최고의 음원 AI 도구들을 랭킹순으로 확인하세요',
  website: '최고의 홈페이지 AI 도구들을 랭킹순으로 확인하세요',
  coding: '최고의 AI 코딩 도구들을 랭킹순으로 확인하세요',
  automation: '최고의 업무/자동화 AI 도구들을 랭킹순으로 확인하세요',
  education: '최고의 교육 AI 도구들을 랭킹순으로 확인하세요',
  marketing: '최고의 마케팅/광고 AI 도구들을 랭킹순으로 확인하세요',
  platform: '최고의 AI 플랫폼들을 랭킹순으로 확인하세요',
};
