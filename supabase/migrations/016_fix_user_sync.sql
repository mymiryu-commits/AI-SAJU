-- =====================================================
-- 016: auth.users와 users 테이블 동기화 수정
-- =====================================================
-- 문제: fortune_analyses.user_id가 users(id)를 참조하지만,
--       Supabase Auth 사용자는 auth.users에만 존재함
-- 해결: auth.users에서 users 테이블로 자동 동기화 트리거 추가

-- =====================================================
-- 1. auth.users에서 users 테이블로 동기화하는 함수
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- auth.users에 새 사용자가 생성되면 users 테이블에도 생성
    INSERT INTO public.users (
        id,
        email,
        name,
        avatar_url,
        auth_provider,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_app_meta_data->>'provider',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
        auth_provider = COALESCE(EXCLUDED.auth_provider, public.users.auth_provider),
        last_login_at = NOW();

    -- profiles 테이블에도 생성 (없으면)
    INSERT INTO public.profiles (id, points, total_points_earned)
    VALUES (NEW.id, 500, 500)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. auth.users에 트리거 연결
-- =====================================================

-- 기존 트리거 삭제 (있으면)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 새 트리거 생성
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 3. 기존 auth.users를 users 테이블에 동기화
-- =====================================================

-- 기존 auth.users 중 users 테이블에 없는 사용자 추가
INSERT INTO public.users (id, email, name, avatar_url, auth_provider, created_at)
SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
    au.raw_user_meta_data->>'avatar_url',
    au.raw_app_meta_data->>'provider',
    au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 기존 users 중 profiles 테이블에 없는 사용자 추가
INSERT INTO public.profiles (id, points, total_points_earned)
SELECT u.id, 500, 500
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. 로그인 시 users 테이블 업데이트 함수
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
    -- 로그인 시 last_login_at 업데이트
    UPDATE public.users
    SET
        last_login_at = NOW(),
        last_active_at = NOW(),
        email = COALESCE(NEW.email, email),
        name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url)
    WHERE id = NEW.id;

    -- 사용자가 users 테이블에 없으면 생성
    IF NOT FOUND THEN
        INSERT INTO public.users (id, email, name, avatar_url, auth_provider, created_at, last_login_at)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_app_meta_data->>'provider',
            NEW.created_at,
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET last_login_at = NOW();

        -- profiles도 생성
        INSERT INTO public.profiles (id, points, total_points_earned)
        VALUES (NEW.id, 500, 500)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users 업데이트 시 트리거
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_login();

-- =====================================================
-- 5. fortune_analyses INSERT 시 users 자동 생성 함수
-- =====================================================

CREATE OR REPLACE FUNCTION public.ensure_user_exists()
RETURNS TRIGGER AS $$
BEGIN
    -- fortune_analyses에 INSERT 전에 users 테이블에 사용자 존재 확인
    INSERT INTO public.users (id, created_at)
    SELECT NEW.user_id, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.user_id)
    AND NEW.user_id IS NOT NULL
    ON CONFLICT (id) DO NOTHING;

    -- profiles도 확인
    IF NEW.user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, points, total_points_earned)
        VALUES (NEW.user_id, 500, 500)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- fortune_analyses INSERT 전 트리거
DROP TRIGGER IF EXISTS ensure_user_before_analysis ON fortune_analyses;
CREATE TRIGGER ensure_user_before_analysis
    BEFORE INSERT ON fortune_analyses
    FOR EACH ROW EXECUTE FUNCTION public.ensure_user_exists();

-- =====================================================
-- 코멘트
-- =====================================================

COMMENT ON FUNCTION public.handle_new_user() IS 'auth.users에 새 사용자 생성 시 users 테이블에 동기화';
COMMENT ON FUNCTION public.handle_user_login() IS 'auth.users 업데이트 시 users 테이블 업데이트';
COMMENT ON FUNCTION public.ensure_user_exists() IS 'fortune_analyses INSERT 전 users 테이블에 사용자 존재 보장';
