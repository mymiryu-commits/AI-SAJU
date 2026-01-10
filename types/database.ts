export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          name: string | null
          avatar_url: string | null
          locale: string
          timezone: string | null
          auth_provider: string | null
          auth_provider_id: string | null
          birth_date: string | null
          birth_time: string | null
          birth_place: string | null
          gender: string | null
          lunar_calendar: boolean
          mbti: string | null
          blood_type: string | null
          zodiac_sign: string | null
          membership_tier: string
          membership_expires_at: string | null
          coin_balance: number
          referral_code: string | null
          referred_by: string | null
          referral_level: number
          total_analyses: number
          total_spent: number
          created_at: string
          last_login_at: string | null
          last_active_at: string | null
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          name?: string | null
          avatar_url?: string | null
          locale?: string
          timezone?: string | null
          auth_provider?: string | null
          auth_provider_id?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          gender?: string | null
          lunar_calendar?: boolean
          mbti?: string | null
          blood_type?: string | null
          zodiac_sign?: string | null
          membership_tier?: string
          membership_expires_at?: string | null
          coin_balance?: number
          referral_code?: string | null
          referred_by?: string | null
          referral_level?: number
          total_analyses?: number
          total_spent?: number
          created_at?: string
          last_login_at?: string | null
          last_active_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          name?: string | null
          avatar_url?: string | null
          locale?: string
          timezone?: string | null
          auth_provider?: string | null
          auth_provider_id?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          gender?: string | null
          lunar_calendar?: boolean
          mbti?: string | null
          blood_type?: string | null
          zodiac_sign?: string | null
          membership_tier?: string
          membership_expires_at?: string | null
          coin_balance?: number
          referral_code?: string | null
          referred_by?: string | null
          referral_level?: number
          total_analyses?: number
          total_spent?: number
          created_at?: string
          last_login_at?: string | null
          last_active_at?: string | null
        }
      }
      ai_tools: {
        Row: {
          id: string
          slug: string
          name_ko: string | null
          name_ja: string | null
          name_en: string | null
          category: string | null
          subcategory: string | null
          description_ko: string | null
          description_ja: string | null
          description_en: string | null
          logo_url: string | null
          website_url: string | null
          pricing_type: string | null
          score_quality: number | null
          score_free_value: number | null
          score_ux: number | null
          score_value: number | null
          score_updates: number | null
          total_score: number | null
          affiliate_url: string | null
          affiliate_commission: number | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ko?: string | null
          name_ja?: string | null
          name_en?: string | null
          category?: string | null
          subcategory?: string | null
          description_ko?: string | null
          description_ja?: string | null
          description_en?: string | null
          logo_url?: string | null
          website_url?: string | null
          pricing_type?: string | null
          score_quality?: number | null
          score_free_value?: number | null
          score_ux?: number | null
          score_value?: number | null
          score_updates?: number | null
          affiliate_url?: string | null
          affiliate_commission?: number | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ko?: string | null
          name_ja?: string | null
          name_en?: string | null
          category?: string | null
          subcategory?: string | null
          description_ko?: string | null
          description_ja?: string | null
          description_en?: string | null
          logo_url?: string | null
          website_url?: string | null
          pricing_type?: string | null
          score_quality?: number | null
          score_free_value?: number | null
          score_ux?: number | null
          score_value?: number | null
          score_updates?: number | null
          affiliate_url?: string | null
          affiliate_commission?: number | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fortune_analyses: {
        Row: {
          id: string
          user_id: string | null
          type: string | null
          subtype: string | null
          input_data: Json | null
          result_summary: Json | null
          result_full: Json | null
          keywords: string[] | null
          scores: Json | null
          pdf_url: string | null
          audio_url: string | null
          share_image_url: string | null
          price_paid: number
          currency: string | null
          is_gift: boolean
          gift_id: string | null
          prediction_events: Json | null
          accuracy_score: number | null
          locale: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type?: string | null
          subtype?: string | null
          input_data?: Json | null
          result_summary?: Json | null
          result_full?: Json | null
          keywords?: string[] | null
          scores?: Json | null
          pdf_url?: string | null
          audio_url?: string | null
          share_image_url?: string | null
          price_paid?: number
          currency?: string | null
          is_gift?: boolean
          gift_id?: string | null
          prediction_events?: Json | null
          accuracy_score?: number | null
          locale?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string | null
          subtype?: string | null
          input_data?: Json | null
          result_summary?: Json | null
          result_full?: Json | null
          keywords?: string[] | null
          scores?: Json | null
          pdf_url?: string | null
          audio_url?: string | null
          share_image_url?: string | null
          price_paid?: number
          currency?: string | null
          is_gift?: boolean
          gift_id?: string | null
          prediction_events?: Json | null
          accuracy_score?: number | null
          locale?: string | null
          created_at?: string
        }
      }
      daily_fortunes: {
        Row: {
          id: string
          user_id: string | null
          fortune_date: string
          overall_score: number | null
          wealth_score: number | null
          love_score: number | null
          career_score: number | null
          health_score: number | null
          summary: string | null
          advice: string | null
          lucky_time: string | null
          lucky_color: string | null
          lucky_number: string | null
          caution: string | null
          is_checked: boolean
          checked_at: string | null
          locale: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          fortune_date: string
          overall_score?: number | null
          wealth_score?: number | null
          love_score?: number | null
          career_score?: number | null
          health_score?: number | null
          summary?: string | null
          advice?: string | null
          lucky_time?: string | null
          lucky_color?: string | null
          lucky_number?: string | null
          caution?: string | null
          is_checked?: boolean
          checked_at?: string | null
          locale?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          fortune_date?: string
          overall_score?: number | null
          wealth_score?: number | null
          love_score?: number | null
          career_score?: number | null
          health_score?: number | null
          summary?: string | null
          advice?: string | null
          lucky_time?: string | null
          lucky_color?: string | null
          lucky_number?: string | null
          caution?: string | null
          is_checked?: boolean
          checked_at?: string | null
          locale?: string | null
          created_at?: string
        }
      }
      checkins: {
        Row: {
          id: string
          user_id: string | null
          checked_at: string
          streak_count: number
          reward_type: string | null
          reward_amount: number | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          checked_at: string
          streak_count?: number
          reward_type?: string | null
          reward_amount?: number | null
        }
        Update: {
          id?: string
          user_id?: string | null
          checked_at?: string
          streak_count?: number
          reward_type?: string | null
          reward_amount?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_coins: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
