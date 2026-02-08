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
      lotto_history: {
        Row: {
          id: number
          round: number
          numbers: number[]
          bonus: number
          draw_date: string
          prize_1st: number | null
          winners_1st: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          round: number
          numbers: number[]
          bonus: number
          draw_date: string
          prize_1st?: number | null
          winners_1st?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          round?: number
          numbers?: number[]
          bonus?: number
          draw_date?: string
          prize_1st?: number | null
          winners_1st?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      lotto_recommendations: {
        Row: {
          id: string
          user_id: string | null
          round: number
          numbers: number[]
          filters: Json | null
          quality_score: number | null
          matched_count: number | null
          matched_bonus: boolean
          prize_rank: number | null
          prize_amount: number
          is_checked: boolean
          created_at: string
          checked_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          round: number
          numbers: number[]
          filters?: Json | null
          quality_score?: number | null
          matched_count?: number | null
          matched_bonus?: boolean
          prize_rank?: number | null
          prize_amount?: number
          is_checked?: boolean
          created_at?: string
          checked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          round?: number
          numbers?: number[]
          filters?: Json | null
          quality_score?: number | null
          matched_count?: number | null
          matched_bonus?: boolean
          prize_rank?: number | null
          prize_amount?: number
          is_checked?: boolean
          created_at?: string
          checked_at?: string | null
        }
      }
      lotto_winning_stats: {
        Row: {
          id: number
          round: number
          total_recommendations: number
          winners_rank1: number
          winners_rank2: number
          winners_rank3: number
          winners_rank4: number
          winners_rank5: number
          total_prize_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          round: number
          total_recommendations?: number
          winners_rank1?: number
          winners_rank2?: number
          winners_rank3?: number
          winners_rank4?: number
          winners_rank5?: number
          total_prize_amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          round?: number
          total_recommendations?: number
          winners_rank1?: number
          winners_rank2?: number
          winners_rank3?: number
          winners_rank4?: number
          winners_rank5?: number
          total_prize_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
      voucher_packages: {
        Row: {
          id: string
          service_type: string
          name: string
          description: string | null
          quantity: number
          regular_price: number
          sale_price: number
          unit_price: number
          discount_rate: number
          discount_label: string | null
          is_active: boolean
          is_promotion: boolean
          promotion_limit: number | null
          promotion_sold: number
          validity_days: number
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_type: string
          name: string
          description?: string | null
          quantity: number
          regular_price: number
          sale_price: number
          unit_price: number
          discount_rate?: number
          discount_label?: string | null
          is_active?: boolean
          is_promotion?: boolean
          promotion_limit?: number | null
          promotion_sold?: number
          validity_days?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_type?: string
          name?: string
          description?: string | null
          quantity?: number
          regular_price?: number
          sale_price?: number
          unit_price?: number
          discount_rate?: number
          discount_label?: string | null
          is_active?: boolean
          is_promotion?: boolean
          promotion_limit?: number | null
          promotion_sold?: number
          validity_days?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_vouchers: {
        Row: {
          id: string
          user_id: string
          package_id: string | null
          service_type: string
          total_quantity: number
          used_quantity: number
          remaining_quantity: number
          purchase_price: number
          unit_price: number
          payment_id: string | null
          order_id: string | null
          status: string
          source: string
          source_user_id: string | null
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_id?: string | null
          service_type: string
          total_quantity: number
          used_quantity?: number
          remaining_quantity: number
          purchase_price: number
          unit_price: number
          payment_id?: string | null
          order_id?: string | null
          status?: string
          source?: string
          source_user_id?: string | null
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          package_id?: string | null
          service_type?: string
          total_quantity?: number
          used_quantity?: number
          remaining_quantity?: number
          purchase_price?: number
          unit_price?: number
          payment_id?: string | null
          order_id?: string | null
          status?: string
          source?: string
          source_user_id?: string | null
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      voucher_usage_log: {
        Row: {
          id: string
          voucher_id: string
          user_id: string
          service_type: string
          quantity_used: number
          related_id: string | null
          related_type: string | null
          metadata: Json | null
          used_at: string
        }
        Insert: {
          id?: string
          voucher_id: string
          user_id: string
          service_type: string
          quantity_used?: number
          related_id?: string | null
          related_type?: string | null
          metadata?: Json | null
          used_at?: string
        }
        Update: {
          id?: string
          voucher_id?: string
          user_id?: string
          service_type?: string
          quantity_used?: number
          related_id?: string | null
          related_type?: string | null
          metadata?: Json | null
          used_at?: string
        }
      }
      voucher_gifts: {
        Row: {
          id: string
          sender_id: string
          sender_voucher_id: string
          service_type: string
          quantity: number
          recipient_id: string | null
          recipient_phone: string | null
          recipient_email: string | null
          gift_code: string | null
          gift_url: string | null
          message: string | null
          status: string
          expires_at: string
          claimed_at: string | null
          claimed_voucher_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          sender_voucher_id: string
          service_type: string
          quantity: number
          recipient_id?: string | null
          recipient_phone?: string | null
          recipient_email?: string | null
          gift_code?: string | null
          gift_url?: string | null
          message?: string | null
          status?: string
          expires_at: string
          claimed_at?: string | null
          claimed_voucher_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          sender_voucher_id?: string
          service_type?: string
          quantity?: number
          recipient_id?: string | null
          recipient_phone?: string | null
          recipient_email?: string | null
          gift_code?: string | null
          gift_url?: string | null
          message?: string | null
          status?: string
          expires_at?: string
          claimed_at?: string | null
          claimed_voucher_id?: string | null
          created_at?: string
        }
      }
      voucher_payments: {
        Row: {
          id: string
          user_id: string
          payment_key: string | null
          order_id: string
          order_name: string | null
          amount: number
          method: string | null
          status: string
          refund_amount: number
          refund_reason: string | null
          refunded_at: string | null
          voucher_id: string | null
          package_id: string | null
          response_data: Json | null
          created_at: string
          approved_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          payment_key?: string | null
          order_id: string
          order_name?: string | null
          amount: number
          method?: string | null
          status?: string
          refund_amount?: number
          refund_reason?: string | null
          refunded_at?: string | null
          voucher_id?: string | null
          package_id?: string | null
          response_data?: Json | null
          created_at?: string
          approved_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          payment_key?: string | null
          order_id?: string
          order_name?: string | null
          amount?: number
          method?: string | null
          status?: string
          refund_amount?: number
          refund_reason?: string | null
          refunded_at?: string | null
          voucher_id?: string | null
          package_id?: string | null
          response_data?: Json | null
          created_at?: string
          approved_at?: string | null
          updated_at?: string
        }
      }
      admin_schedules: {
        Row: {
          id: string
          title: string
          description: string | null
          link_url: string | null
          link_label: string | null
          is_completed: boolean
          priority: number
          due_date: string | null
          created_by: string
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          link_url?: string | null
          link_label?: string | null
          is_completed?: boolean
          priority?: number
          due_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          link_url?: string | null
          link_label?: string | null
          is_completed?: boolean
          priority?: number
          due_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      lotto_total_stats: {
        Row: {
          total_recommendations: number
          total_winners: number
          winners_rank1: number
          winners_rank2: number
          winners_rank3: number
          winners_rank4: number
          winners_rank5: number
          total_prize_amount: number
          hit_rate: number
        }
      }
      lotto_recent_winners: {
        Row: {
          id: string
          round: number
          numbers: number[]
          matched_count: number
          matched_bonus: boolean
          prize_rank: number
          prize_amount: number
          checked_at: string
          winning_numbers: number[]
          winning_bonus: number
        }
      }
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
