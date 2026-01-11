-- 로또 당첨 이력 테이블
CREATE TABLE IF NOT EXISTS lotto_history (
  id SERIAL PRIMARY KEY,
  round INT UNIQUE NOT NULL,
  numbers INT[] NOT NULL,
  bonus INT NOT NULL,
  draw_date DATE NOT NULL,
  prize_1st BIGINT,
  winners_1st INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_lotto_history_round ON lotto_history(round DESC);
CREATE INDEX idx_lotto_history_draw_date ON lotto_history(draw_date DESC);

-- 사용자 추천 번호 테이블
CREATE TABLE IF NOT EXISTS lotto_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  round INT NOT NULL,
  numbers INT[] NOT NULL,
  filters JSONB,
  quality_score INT,
  matched_count INT,
  matched_bonus BOOLEAN DEFAULT FALSE,
  prize_rank INT,
  prize_amount BIGINT DEFAULT 0,
  is_checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  checked_at TIMESTAMPTZ
);

-- 인덱스 생성
CREATE INDEX idx_lotto_recommendations_user ON lotto_recommendations(user_id);
CREATE INDEX idx_lotto_recommendations_round ON lotto_recommendations(round);
CREATE INDEX idx_lotto_recommendations_unchecked ON lotto_recommendations(round) WHERE is_checked = FALSE;
CREATE INDEX idx_lotto_recommendations_winners ON lotto_recommendations(prize_rank) WHERE prize_rank IS NOT NULL;

-- 당첨 통계 테이블 (집계용)
CREATE TABLE IF NOT EXISTS lotto_winning_stats (
  id SERIAL PRIMARY KEY,
  round INT NOT NULL REFERENCES lotto_history(round),
  total_recommendations INT DEFAULT 0,
  winners_rank1 INT DEFAULT 0,
  winners_rank2 INT DEFAULT 0,
  winners_rank3 INT DEFAULT 0,
  winners_rank4 INT DEFAULT 0,
  winners_rank5 INT DEFAULT 0,
  total_prize_amount BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_lotto_winning_stats_round ON lotto_winning_stats(round);

-- 당첨 매칭 함수
CREATE OR REPLACE FUNCTION match_lotto_recommendations(
  p_round INT,
  p_winning_numbers INT[],
  p_bonus INT
) RETURNS INT AS $$
DECLARE
  v_matched_count INT := 0;
  rec RECORD;
  v_matched INT;
  v_matched_bonus BOOLEAN;
  v_rank INT;
BEGIN
  -- 해당 회차의 미체크 추천번호들 매칭
  FOR rec IN
    SELECT id, numbers
    FROM lotto_recommendations
    WHERE round = p_round AND is_checked = FALSE
  LOOP
    -- 일치 개수 계산
    SELECT COUNT(*) INTO v_matched
    FROM unnest(rec.numbers) AS n
    WHERE n = ANY(p_winning_numbers);

    -- 보너스 일치 여부
    v_matched_bonus := p_bonus = ANY(rec.numbers);

    -- 등수 계산
    v_rank := CASE
      WHEN v_matched = 6 THEN 1
      WHEN v_matched = 5 AND v_matched_bonus THEN 2
      WHEN v_matched = 5 THEN 3
      WHEN v_matched = 4 THEN 4
      WHEN v_matched = 3 THEN 5
      ELSE NULL
    END;

    -- 업데이트
    UPDATE lotto_recommendations
    SET
      matched_count = v_matched,
      matched_bonus = v_matched_bonus,
      prize_rank = v_rank,
      prize_amount = CASE v_rank
        WHEN 1 THEN 2000000000
        WHEN 2 THEN 50000000
        WHEN 3 THEN 1500000
        WHEN 4 THEN 50000
        WHEN 5 THEN 5000
        ELSE 0
      END,
      is_checked = TRUE,
      checked_at = NOW()
    WHERE id = rec.id;

    v_matched_count := v_matched_count + 1;
  END LOOP;

  -- 통계 업데이트
  INSERT INTO lotto_winning_stats (round, total_recommendations, winners_rank1, winners_rank2, winners_rank3, winners_rank4, winners_rank5, total_prize_amount)
  SELECT
    p_round,
    COUNT(*),
    COUNT(*) FILTER (WHERE prize_rank = 1),
    COUNT(*) FILTER (WHERE prize_rank = 2),
    COUNT(*) FILTER (WHERE prize_rank = 3),
    COUNT(*) FILTER (WHERE prize_rank = 4),
    COUNT(*) FILTER (WHERE prize_rank = 5),
    COALESCE(SUM(prize_amount), 0)
  FROM lotto_recommendations
  WHERE round = p_round
  ON CONFLICT (round) DO UPDATE SET
    total_recommendations = EXCLUDED.total_recommendations,
    winners_rank1 = EXCLUDED.winners_rank1,
    winners_rank2 = EXCLUDED.winners_rank2,
    winners_rank3 = EXCLUDED.winners_rank3,
    winners_rank4 = EXCLUDED.winners_rank4,
    winners_rank5 = EXCLUDED.winners_rank5,
    total_prize_amount = EXCLUDED.total_prize_amount,
    updated_at = NOW();

  RETURN v_matched_count;
END;
$$ LANGUAGE plpgsql;

-- 전체 당첨 통계 조회 뷰
CREATE OR REPLACE VIEW lotto_total_stats AS
SELECT
  COUNT(*) AS total_recommendations,
  COUNT(*) FILTER (WHERE prize_rank IS NOT NULL) AS total_winners,
  COUNT(*) FILTER (WHERE prize_rank = 1) AS winners_rank1,
  COUNT(*) FILTER (WHERE prize_rank = 2) AS winners_rank2,
  COUNT(*) FILTER (WHERE prize_rank = 3) AS winners_rank3,
  COUNT(*) FILTER (WHERE prize_rank = 4) AS winners_rank4,
  COUNT(*) FILTER (WHERE prize_rank = 5) AS winners_rank5,
  COALESCE(SUM(prize_amount), 0) AS total_prize_amount,
  ROUND(COUNT(*) FILTER (WHERE prize_rank IS NOT NULL)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 2) AS hit_rate
FROM lotto_recommendations
WHERE is_checked = TRUE;

-- 최근 당첨 현황 뷰
CREATE OR REPLACE VIEW lotto_recent_winners AS
SELECT
  lr.id,
  lr.round,
  lr.numbers,
  lr.matched_count,
  lr.matched_bonus,
  lr.prize_rank,
  lr.prize_amount,
  lr.checked_at,
  lh.numbers AS winning_numbers,
  lh.bonus AS winning_bonus
FROM lotto_recommendations lr
JOIN lotto_history lh ON lr.round = lh.round
WHERE lr.prize_rank IS NOT NULL
ORDER BY lr.checked_at DESC
LIMIT 100;

-- RLS 정책 설정
ALTER TABLE lotto_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotto_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotto_winning_stats ENABLE ROW LEVEL SECURITY;

-- 로또 이력은 모두 읽기 가능
CREATE POLICY "lotto_history_read_all" ON lotto_history
  FOR SELECT USING (true);

-- 추천번호는 본인 것만 조회/생성
CREATE POLICY "lotto_recommendations_select_own" ON lotto_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "lotto_recommendations_insert_own" ON lotto_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 통계는 모두 읽기 가능
CREATE POLICY "lotto_winning_stats_read_all" ON lotto_winning_stats
  FOR SELECT USING (true);

-- 서비스 역할용 정책 (Cron job 등)
CREATE POLICY "service_role_all" ON lotto_history
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "service_role_recommendations" ON lotto_recommendations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "service_role_stats" ON lotto_winning_stats
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
