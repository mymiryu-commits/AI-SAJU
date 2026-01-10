-- =====================================================
-- AI Tools Seed Data
-- =====================================================

INSERT INTO ai_tools (slug, name_ko, name_ja, name_en, category, subcategory, description_ko, description_ja, description_en, logo_url, website_url, pricing_type, score_quality, score_free_value, score_ux, score_value, score_updates, is_featured) VALUES

-- Chat AI
('chatgpt', 'ChatGPT', 'ChatGPT', 'ChatGPT', 'chat', 'general',
'OpenAI의 대화형 AI. GPT-4o 기반으로 자연스러운 대화와 다양한 작업 수행이 가능합니다.',
'OpenAIの対話型AI。GPT-4oベースで自然な会話と多様なタスクが可能です。',
'Conversational AI by OpenAI. Based on GPT-4o, capable of natural conversations and various tasks.',
'/logos/chatgpt.svg', 'https://chat.openai.com', 'freemium', 95, 80, 95, 85, 95, true),

('claude', 'Claude', 'Claude', 'Claude', 'chat', 'general',
'Anthropic의 AI 어시스턴트. 긴 문맥 처리와 분석적 사고에 강점이 있습니다.',
'AnthropicのAIアシスタント。長文脈処理と分析的思考に優れています。',
'AI assistant by Anthropic. Excels at long context processing and analytical thinking.',
'/logos/claude.svg', 'https://claude.ai', 'freemium', 95, 75, 90, 85, 90, true),

('gemini', 'Gemini', 'Gemini', 'Gemini', 'chat', 'general',
'Google의 멀티모달 AI. 텍스트, 이미지, 코드를 함께 처리할 수 있습니다.',
'Googleのマルチモーダル AI。テキスト、画像、コードを一緒に処理できます。',
'Google''s multimodal AI. Can process text, images, and code together.',
'/logos/gemini.svg', 'https://gemini.google.com', 'freemium', 90, 85, 85, 90, 85, true),

('perplexity', 'Perplexity', 'Perplexity', 'Perplexity', 'chat', 'search',
'AI 기반 검색 엔진. 실시간 웹 검색과 출처 인용이 가능합니다.',
'AIベースの検索エンジン。リアルタイムWeb検索とソース引用が可能です。',
'AI-powered search engine. Capable of real-time web search with source citations.',
'/logos/perplexity.svg', 'https://perplexity.ai', 'freemium', 85, 80, 90, 85, 85, false),

-- Image Generation
('midjourney', 'Midjourney', 'Midjourney', 'Midjourney', 'image', 'art',
'최고 품질의 AI 이미지 생성. 예술적이고 창의적인 이미지 제작에 특화되어 있습니다.',
'最高品質のAI画像生成。芸術的で創造的な画像作成に特化しています。',
'Highest quality AI image generation. Specialized in artistic and creative image creation.',
'/logos/midjourney.svg', 'https://midjourney.com', 'paid', 98, 0, 75, 70, 90, true),

('dall-e', 'DALL-E 3', 'DALL-E 3', 'DALL-E 3', 'image', 'art',
'OpenAI의 이미지 생성 AI. 프롬프트 이해도가 높고 ChatGPT와 통합되어 있습니다.',
'OpenAIの画像生成AI。プロンプト理解度が高く、ChatGPTと統合されています。',
'Image generation AI by OpenAI. High prompt understanding and integrated with ChatGPT.',
'/logos/dalle.svg', 'https://openai.com/dall-e-3', 'paid', 90, 40, 90, 80, 85, false),

('stable-diffusion', 'Stable Diffusion', 'Stable Diffusion', 'Stable Diffusion', 'image', 'art',
'오픈소스 이미지 생성 AI. 로컬 실행 가능하며 커스터마이징이 자유롭습니다.',
'オープンソース画像生成AI。ローカル実行可能でカスタマイズが自由です。',
'Open-source image generation AI. Can run locally with free customization.',
'/logos/sd.svg', 'https://stability.ai', 'free', 85, 95, 60, 95, 80, true),

('leonardo', 'Leonardo.ai', 'Leonardo.ai', 'Leonardo.ai', 'image', 'art',
'게임 에셋과 캐릭터 디자인에 특화된 AI 이미지 생성 도구입니다.',
'ゲームアセットとキャラクターデザインに特化したAI画像生成ツールです。',
'AI image generation tool specialized for game assets and character design.',
'/logos/leonardo.svg', 'https://leonardo.ai', 'freemium', 85, 75, 85, 80, 80, false),

-- Video Generation
('runway', 'Runway', 'Runway', 'Runway', 'video', 'general',
'영상 생성 및 편집 AI. Gen-3로 고품질 AI 영상을 만들 수 있습니다.',
'動画生成・編集AI。Gen-3で高品質AI動画が作成できます。',
'Video generation and editing AI. Create high-quality AI videos with Gen-3.',
'/logos/runway.svg', 'https://runway.ml', 'freemium', 90, 60, 85, 75, 90, true),

('pika', 'Pika', 'Pika', 'Pika', 'video', 'general',
'텍스트와 이미지로 영상을 생성하는 AI. 간편한 사용성이 장점입니다.',
'テキストと画像から動画を生成するAI。簡単な操作性が特徴です。',
'AI that generates videos from text and images. Easy to use.',
'/logos/pika.svg', 'https://pika.art', 'freemium', 80, 70, 90, 80, 85, false),

('sora', 'Sora', 'Sora', 'Sora', 'video', 'general',
'OpenAI의 텍스트-비디오 AI. 현실적인 영상 생성이 가능합니다.',
'OpenAIのテキスト-ビデオAI。リアルな動画生成が可能です。',
'OpenAI''s text-to-video AI. Capable of generating realistic videos.',
'/logos/sora.svg', 'https://openai.com/sora', 'paid', 95, 30, 80, 60, 95, true),

-- Coding AI
('github-copilot', 'GitHub Copilot', 'GitHub Copilot', 'GitHub Copilot', 'code', 'assistant',
'AI 코딩 어시스턴트. 코드 자동완성과 제안 기능을 제공합니다.',
'AIコーディングアシスタント。コード自動補完と提案機能を提供します。',
'AI coding assistant. Provides code autocompletion and suggestions.',
'/logos/copilot.svg', 'https://github.com/features/copilot', 'paid', 90, 50, 95, 80, 90, true),

('cursor', 'Cursor', 'Cursor', 'Cursor', 'code', 'ide',
'AI 기반 코드 에디터. GPT-4 통합으로 강력한 코딩 지원을 제공합니다.',
'AIベースのコードエディター。GPT-4統合で強力なコーディングサポートを提供します。',
'AI-based code editor. Provides powerful coding support with GPT-4 integration.',
'/logos/cursor.svg', 'https://cursor.so', 'freemium', 85, 70, 90, 85, 85, false),

('replit', 'Replit', 'Replit', 'Replit', 'code', 'ide',
'AI가 탑재된 온라인 IDE. 브라우저에서 바로 코딩이 가능합니다.',
'AI搭載のオンラインIDE。ブラウザですぐにコーディングが可能です。',
'Online IDE with AI. Code directly in your browser.',
'/logos/replit.svg', 'https://replit.com', 'freemium', 80, 80, 85, 85, 80, false),

-- Voice AI
('elevenlabs', 'ElevenLabs', 'ElevenLabs', 'ElevenLabs', 'voice', 'tts',
'고품질 AI 음성 합성. 자연스러운 음성 생성과 음성 복제가 가능합니다.',
'高品質AI音声合成。自然な音声生成と音声クローンが可能です。',
'High-quality AI voice synthesis. Natural voice generation and voice cloning.',
'/logos/elevenlabs.svg', 'https://elevenlabs.io', 'freemium', 95, 60, 90, 75, 90, true),

('murf', 'Murf', 'Murf', 'Murf', 'voice', 'tts',
'비즈니스용 AI 음성 생성. 다양한 언어와 목소리를 지원합니다.',
'ビジネス向けAI音声生成。多様な言語と声をサポートします。',
'AI voice generation for business. Supports various languages and voices.',
'/logos/murf.svg', 'https://murf.ai', 'freemium', 80, 65, 85, 80, 75, false),

-- Writing AI
('jasper', 'Jasper', 'Jasper', 'Jasper', 'writing', 'marketing',
'마케팅 콘텐츠 작성 AI. 브랜드 보이스 유지와 대량 콘텐츠 생성에 특화되어 있습니다.',
'マーケティングコンテンツ作成AI。ブランドボイス維持と大量コンテンツ生成に特化しています。',
'Marketing content writing AI. Specialized in maintaining brand voice and bulk content generation.',
'/logos/jasper.svg', 'https://jasper.ai', 'paid', 85, 30, 85, 70, 80, false),

('copy-ai', 'Copy.ai', 'Copy.ai', 'Copy.ai', 'writing', 'marketing',
'카피라이팅 AI 도구. 광고 문구, 이메일, 소셜 미디어 콘텐츠 생성에 유용합니다.',
'コピーライティングAIツール。広告コピー、メール、SNSコンテンツ作成に便利です。',
'Copywriting AI tool. Useful for ads, emails, and social media content.',
'/logos/copyai.svg', 'https://copy.ai', 'freemium', 80, 70, 85, 80, 75, false),

('notion-ai', 'Notion AI', 'Notion AI', 'Notion AI', 'writing', 'productivity',
'Notion에 통합된 AI. 문서 작성, 요약, 번역 등 다양한 기능을 제공합니다.',
'Notionに統合されたAI。文書作成、要約、翻訳など多様な機能を提供します。',
'AI integrated into Notion. Provides writing, summarization, translation and more.',
'/logos/notion.svg', 'https://notion.so', 'freemium', 80, 60, 95, 85, 80, false),

-- Productivity
('otter', 'Otter.ai', 'Otter.ai', 'Otter.ai', 'productivity', 'transcription',
'AI 회의록 작성 도구. 실시간 음성 인식과 자동 요약을 제공합니다.',
'AI議事録作成ツール。リアルタイム音声認識と自動要約を提供します。',
'AI meeting notes tool. Provides real-time transcription and auto-summary.',
'/logos/otter.svg', 'https://otter.ai', 'freemium', 85, 70, 85, 80, 80, false),

('mem', 'Mem', 'Mem', 'Mem', 'productivity', 'notes',
'AI 기반 노트 앱. 자동 정리와 연결된 아이디어 관리가 가능합니다.',
'AIベースのノートアプリ。自動整理と連携したアイデア管理が可能です。',
'AI-based note app. Auto-organization and connected idea management.',
'/logos/mem.svg', 'https://mem.ai', 'freemium', 80, 65, 85, 80, 75, false);
