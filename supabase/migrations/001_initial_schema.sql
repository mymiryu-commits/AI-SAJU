-- =====================================================
-- AI RANK Platform - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Users & Authentication
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  name VARCHAR(100),
  avatar_url TEXT,
  locale VARCHAR(5) DEFAULT 'ko',
  timezone VARCHAR(50),

  -- Authentication
  auth_provider VARCHAR(20),
  auth_provider_id VARCHAR(255),

  -- Fortune service basic info
  birth_date DATE,
  birth_time TIME,
  birth_place VARCHAR(100),
  gender VARCHAR(10),
  lunar_calendar BOOLEAN DEFAULT FALSE,

  -- Additional info
  mbti VARCHAR(4),
  blood_type VARCHAR(2),
  zodiac_sign VARCHAR(20),

  -- Membership
  membership_tier VARCHAR(20) DEFAULT 'free',
  membership_expires_at TIMESTAMP,

  -- Points/Coins
  coin_balance INT DEFAULT 0,

  -- Referral
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES users(id),
  referral_level INT DEFAULT 1,

  -- Statistics
  total_analyses INT DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  last_active_at TIMESTAMP
);

-- User settings
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Notification settings
  daily_fortune_push BOOLEAN DEFAULT TRUE,
  daily_fortune_time TIME DEFAULT '07:00',
  marketing_email BOOLEAN DEFAULT TRUE,
  marketing_push BOOLEAN DEFAULT TRUE,

  -- Personalization
  preferred_fortune_types TEXT[],
  preferred_expert_categories TEXT[],

  -- Privacy
  profile_public BOOLEAN DEFAULT FALSE,
  show_in_rankings BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- 2. AI Rankings & Content
-- =====================================================

CREATE TABLE ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_ko VARCHAR(100),
  name_ja VARCHAR(100),
  name_en VARCHAR(100),

  category VARCHAR(50),
  subcategory VARCHAR(50),

  description_ko TEXT,
  description_ja TEXT,
  description_en TEXT,

  logo_url TEXT,
  website_url TEXT,
  pricing_type VARCHAR(20),

  -- Scores (out of 100)
  score_quality INT,
  score_free_value INT,
  score_ux INT,
  score_value INT,
  score_updates INT,
  total_score INT GENERATED ALWAYS AS (
    COALESCE(score_quality, 0) * 30 / 100 +
    COALESCE(score_free_value, 0) * 25 / 100 +
    COALESCE(score_ux, 0) * 20 / 100 +
    COALESCE(score_value, 0) * 15 / 100 +
    COALESCE(score_updates, 0) * 10 / 100
  ) STORED,

  -- Meta
  affiliate_url TEXT,
  affiliate_commission DECIMAL(5,2),

  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI tool reviews
CREATE TABLE ai_tool_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  pros TEXT[],
  cons TEXT[],

  locale VARCHAR(5),
  is_verified_purchase BOOLEAN DEFAULT FALSE,

  helpful_count INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Content (guides, news, tutorials)
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) UNIQUE,
  type VARCHAR(20),

  title_ko VARCHAR(300),
  title_ja VARCHAR(300),
  title_en VARCHAR(300),

  content_ko TEXT,
  content_ja TEXT,
  content_en TEXT,

  excerpt_ko VARCHAR(500),
  excerpt_ja VARCHAR(500),
  excerpt_en VARCHAR(500),

  featured_image TEXT,
  category VARCHAR(50),
  tags TEXT[],

  author_id UUID REFERENCES users(id) ON DELETE SET NULL,

  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,

  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,

  seo_title VARCHAR(70),
  seo_description VARCHAR(160),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. Prompt Marketplace
-- =====================================================

CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,

  title_ko VARCHAR(200),
  title_ja VARCHAR(200),
  title_en VARCHAR(200),

  description_ko TEXT,
  description_ja TEXT,
  description_en TEXT,

  prompt_text TEXT,
  preview_text TEXT,

  category VARCHAR(50),
  ai_platform VARCHAR(50),

  price_krw INT,
  price_jpy INT,
  price_usd DECIMAL(6,2),

  preview_images TEXT[],
  example_outputs TEXT[],

  purchase_count INT DEFAULT 0,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,

  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prompt_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,

  price_paid DECIMAL(10,2),
  currency VARCHAR(3),

  payment_id VARCHAR(100),
  payment_provider VARCHAR(20),

  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. Fortune Services (Core Revenue)
-- =====================================================

CREATE TABLE fortune_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  type VARCHAR(30),
  subtype VARCHAR(30),

  input_data JSONB,
  result_summary JSONB,
  result_full JSONB,

  keywords TEXT[],
  scores JSONB,

  pdf_url TEXT,
  audio_url TEXT,
  share_image_url TEXT,

  price_paid DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3),
  is_gift BOOLEAN DEFAULT FALSE,
  gift_id UUID,

  prediction_events JSONB,
  accuracy_score DECIMAL(3,2),

  locale VARCHAR(5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_fortunes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fortune_date DATE NOT NULL,

  overall_score INT,
  wealth_score INT,
  love_score INT,
  career_score INT,
  health_score INT,

  summary TEXT,
  advice TEXT,
  lucky_time VARCHAR(20),
  lucky_color VARCHAR(20),
  lucky_number VARCHAR(10),
  caution TEXT,

  is_checked BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMP,

  locale VARCHAR(5),
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, fortune_date)
);

CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  checked_at DATE NOT NULL,

  streak_count INT DEFAULT 1,
  reward_type VARCHAR(20),
  reward_amount INT,

  UNIQUE(user_id, checked_at)
);

CREATE TABLE fortune_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,

  name VARCHAR(100),
  type VARCHAR(20),

  members JSONB,
  compatibility_matrix JSONB,
  group_insights JSONB,

  share_code VARCHAR(20) UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. Expert System
-- =====================================================

CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  display_name VARCHAR(100),
  bio TEXT,
  profile_image TEXT,

  specialties TEXT[],
  experience_years INT,
  certifications TEXT[],
  languages TEXT[],

  level VARCHAR(20) DEFAULT 'new',

  rate_chat_krw INT,
  rate_chat_jpy INT,
  rate_chat_usd DECIMAL(6,2),
  rate_call_krw INT,
  rate_call_jpy INT,
  rate_call_usd DECIMAL(6,2),
  rate_video_krw INT,
  rate_video_jpy INT,
  rate_video_usd DECIMAL(6,2),

  total_consultations INT DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,
  repeat_rate DECIMAL(3,2) DEFAULT 0,

  commission_rate DECIMAL(3,2) DEFAULT 0.30,
  bank_info JSONB,

  is_available BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES experts(id) ON DELETE SET NULL,
  client_id UUID REFERENCES users(id) ON DELETE SET NULL,

  type VARCHAR(20),
  status VARCHAR(20),

  scheduled_at TIMESTAMP,
  duration_minutes INT,
  actual_start_at TIMESTAMP,
  actual_end_at TIMESTAMP,

  price DECIMAL(10,2),
  currency VARCHAR(3),
  platform_fee DECIMAL(10,2),
  expert_earning DECIMAL(10,2),

  client_question TEXT,
  client_birth_info JSONB,

  notes TEXT,
  summary TEXT,

  rating INT,
  review TEXT,

  payment_id VARCHAR(100),
  payment_status VARCHAR(20),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,

  message_type VARCHAR(20),
  content TEXT,
  media_url TEXT,

  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. Payments & Subscriptions
-- =====================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  tier VARCHAR(20),
  status VARCHAR(20),

  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,

  price DECIMAL(10,2),
  currency VARCHAR(3),
  payment_provider VARCHAR(20),
  payment_subscription_id VARCHAR(100),

  cancelled_at TIMESTAMP,
  cancel_reason TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  type VARCHAR(30),
  reference_id UUID,

  amount DECIMAL(10,2),
  currency VARCHAR(3),

  payment_provider VARCHAR(20),
  payment_id VARCHAR(100),
  payment_status VARCHAR(20),

  refund_amount DECIMAL(10,2),
  refunded_at TIMESTAMP,
  refund_reason TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  type VARCHAR(20),
  amount INT,
  balance_after INT,

  description TEXT,
  reference_type VARCHAR(30),
  reference_id UUID,

  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. Gifts
-- =====================================================

CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,

  product_type VARCHAR(30),
  product_config JSONB,

  recipient_name VARCHAR(100),
  recipient_contact VARCHAR(100),
  recipient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  message TEXT,
  design_template VARCHAR(20),

  status VARCHAR(20),
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  completed_at TIMESTAMP,
  expires_at TIMESTAMP,

  price DECIMAL(10,2),
  currency VARCHAR(3),
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,

  analysis_id UUID REFERENCES fortune_analyses(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 8. Referrals
-- =====================================================

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,

  signup_reward_given BOOLEAN DEFAULT FALSE,
  signup_reward_amount INT,

  purchase_rewards JSONB,
  total_purchase_reward INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. QR Cards (Additional Service)
-- =====================================================

CREATE TABLE qr_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  name VARCHAR(100),
  title VARCHAR(100),
  company VARCHAR(100),
  bio TEXT,

  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),

  social_links JSONB,

  template VARCHAR(20),
  primary_color VARCHAR(7),
  profile_image TEXT,
  logo_image TEXT,

  qr_code_url TEXT,
  short_url VARCHAR(50) UNIQUE,

  scan_count INT DEFAULT 0,

  tier VARCHAR(20),

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES qr_cards(id) ON DELETE CASCADE,

  scanned_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country VARCHAR(2),
  city VARCHAR(100)
);

-- =====================================================
-- 10. Analytics
-- =====================================================

CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),

  path VARCHAR(500),
  referrer TEXT,

  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  event_type VARCHAR(50),
  event_data JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_locale ON users(locale);
CREATE INDEX idx_users_membership ON users(membership_tier);
CREATE INDEX idx_ai_tools_category ON ai_tools(category);
CREATE INDEX idx_ai_tools_score ON ai_tools(total_score DESC);
CREATE INDEX idx_ai_tools_slug ON ai_tools(slug);
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_published ON contents(is_published, published_at DESC);
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_fortune_analyses_user ON fortune_analyses(user_id);
CREATE INDEX idx_fortune_analyses_type ON fortune_analyses(type);
CREATE INDEX idx_daily_fortunes_user_date ON daily_fortunes(user_id, fortune_date);
CREATE INDEX idx_checkins_user_date ON checkins(user_id, checked_at);
CREATE INDEX idx_experts_specialties ON experts USING GIN(specialties);
CREATE INDEX idx_consultations_expert ON consultations(expert_id);
CREATE INDEX idx_consultations_client ON consultations(client_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_events_type ON events(event_type);

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fortunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY users_self ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY user_settings_self ON user_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY fortune_analyses_self ON fortune_analyses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY daily_fortunes_self ON daily_fortunes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY checkins_self ON checkins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY subscriptions_self ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY payments_self ON payments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY coin_transactions_self ON coin_transactions
  FOR ALL USING (auth.uid() = user_id);

-- Experts can access their consultations
CREATE POLICY consultations_access ON consultations
  FOR ALL USING (
    auth.uid() = client_id OR
    auth.uid() IN (SELECT user_id FROM experts WHERE id = expert_id)
  );

-- Public read access for AI tools and contents
CREATE POLICY ai_tools_public_read ON ai_tools
  FOR SELECT USING (is_active = true);

CREATE POLICY contents_public_read ON contents
  FOR SELECT USING (is_published = true);

CREATE POLICY prompts_public_read ON prompts
  FOR SELECT USING (is_active = true);

CREATE POLICY experts_public_read ON experts
  FOR SELECT USING (is_active = true AND is_verified = true);
