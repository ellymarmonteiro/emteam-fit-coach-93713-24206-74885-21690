export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      anamnese: {
        Row: {
          activity_level: string | null
          allergies: string | null
          availability: string | null
          birth_date: string | null
          cardiovascular: boolean | null
          created_at: string | null
          current_weight: number | null
          diabetes: boolean | null
          diet_preference: string | null
          gender: string | null
          has_injuries: string | null
          height: number | null
          hypertension: boolean | null
          id: string
          injuries: string | null
          intolerances: string | null
          is_active: string | null
          kidney: boolean | null
          main_goal: string | null
          meals_per_day: string | null
          measurements: Json | null
          medications: string | null
          motivation: string | null
          notifications_consent: boolean | null
          photo_consent: boolean | null
          profession: string | null
          sleep_hours: number | null
          stress_level: string | null
          supplements: string | null
          target_timeline: string | null
          target_weight: number | null
          terms_accepted: boolean | null
          training_duration: string | null
          updated_at: string | null
          user_id: string
          water_intake: number | null
        }
        Insert: {
          activity_level?: string | null
          allergies?: string | null
          availability?: string | null
          birth_date?: string | null
          cardiovascular?: boolean | null
          created_at?: string | null
          current_weight?: number | null
          diabetes?: boolean | null
          diet_preference?: string | null
          gender?: string | null
          has_injuries?: string | null
          height?: number | null
          hypertension?: boolean | null
          id?: string
          injuries?: string | null
          intolerances?: string | null
          is_active?: string | null
          kidney?: boolean | null
          main_goal?: string | null
          meals_per_day?: string | null
          measurements?: Json | null
          medications?: string | null
          motivation?: string | null
          notifications_consent?: boolean | null
          photo_consent?: boolean | null
          profession?: string | null
          sleep_hours?: number | null
          stress_level?: string | null
          supplements?: string | null
          target_timeline?: string | null
          target_weight?: number | null
          terms_accepted?: boolean | null
          training_duration?: string | null
          updated_at?: string | null
          user_id: string
          water_intake?: number | null
        }
        Update: {
          activity_level?: string | null
          allergies?: string | null
          availability?: string | null
          birth_date?: string | null
          cardiovascular?: boolean | null
          created_at?: string | null
          current_weight?: number | null
          diabetes?: boolean | null
          diet_preference?: string | null
          gender?: string | null
          has_injuries?: string | null
          height?: number | null
          hypertension?: boolean | null
          id?: string
          injuries?: string | null
          intolerances?: string | null
          is_active?: string | null
          kidney?: boolean | null
          main_goal?: string | null
          meals_per_day?: string | null
          measurements?: Json | null
          medications?: string | null
          motivation?: string | null
          notifications_consent?: boolean | null
          photo_consent?: boolean | null
          profession?: string | null
          sleep_hours?: number | null
          stress_level?: string | null
          supplements?: string | null
          target_timeline?: string | null
          target_weight?: number | null
          terms_accepted?: boolean | null
          training_duration?: string | null
          updated_at?: string | null
          user_id?: string
          water_intake?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          reason: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      checkout_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          arm_circumference: number | null
          blood_pressure: string | null
          bmi: number | null
          body_fat_percentage: number | null
          calf_circumference: number | null
          chest_circumference: number | null
          created_at: string | null
          goal: string | null
          heart_rate: number | null
          height: number | null
          hip_circumference: number | null
          id: string
          leg_circumference: number | null
          neck_circumference: number | null
          notes: string | null
          photos: Json | null
          updated_at: string | null
          user_id: string
          waist_circumference: number | null
          weight: number | null
        }
        Insert: {
          arm_circumference?: number | null
          blood_pressure?: string | null
          bmi?: number | null
          body_fat_percentage?: number | null
          calf_circumference?: number | null
          chest_circumference?: number | null
          created_at?: string | null
          goal?: string | null
          heart_rate?: number | null
          height?: number | null
          hip_circumference?: number | null
          id?: string
          leg_circumference?: number | null
          neck_circumference?: number | null
          notes?: string | null
          photos?: Json | null
          updated_at?: string | null
          user_id: string
          waist_circumference?: number | null
          weight?: number | null
        }
        Update: {
          arm_circumference?: number | null
          blood_pressure?: string | null
          bmi?: number | null
          body_fat_percentage?: number | null
          calf_circumference?: number | null
          chest_circumference?: number | null
          created_at?: string | null
          goal?: string | null
          heart_rate?: number | null
          height?: number | null
          hip_circumference?: number | null
          id?: string
          leg_circumference?: number | null
          neck_circumference?: number | null
          notes?: string | null
          photos?: Json | null
          updated_at?: string | null
          user_id?: string
          waist_circumference?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          equipment: string[] | null
          id: string
          level: string | null
          muscle_groups: string[] | null
          name: string
          thumbnail_path: string | null
          updated_at: string | null
          video_path: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment?: string[] | null
          id?: string
          level?: string | null
          muscle_groups?: string[] | null
          name: string
          thumbnail_path?: string | null
          updated_at?: string | null
          video_path?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment?: string[] | null
          id?: string
          level?: string | null
          muscle_groups?: string[] | null
          name?: string
          thumbnail_path?: string | null
          updated_at?: string | null
          video_path?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          error_message: string | null
          id: string
          message: string
          sent_at: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          message: string
          sent_at?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          error_message?: string | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string | null
          daily_motivation: boolean | null
          daily_motivation_time: string | null
          device_tokens: Json | null
          enable_all: boolean | null
          goal_celebration: boolean | null
          id: string
          missed_workout: boolean | null
          monthly_weigh_in: boolean | null
          silence_days: number | null
          updated_at: string | null
          user_id: string
          workout_reminder: boolean | null
          workout_reminder_minutes: number | null
        }
        Insert: {
          created_at?: string | null
          daily_motivation?: boolean | null
          daily_motivation_time?: string | null
          device_tokens?: Json | null
          enable_all?: boolean | null
          goal_celebration?: boolean | null
          id?: string
          missed_workout?: boolean | null
          monthly_weigh_in?: boolean | null
          silence_days?: number | null
          updated_at?: string | null
          user_id: string
          workout_reminder?: boolean | null
          workout_reminder_minutes?: number | null
        }
        Update: {
          created_at?: string | null
          daily_motivation?: boolean | null
          daily_motivation_time?: string | null
          device_tokens?: Json | null
          enable_all?: boolean | null
          goal_celebration?: boolean | null
          id?: string
          missed_workout?: boolean | null
          monthly_weigh_in?: boolean | null
          silence_days?: number | null
          updated_at?: string | null
          user_id?: string
          workout_reminder?: boolean | null
          workout_reminder_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          schedule_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          schedule_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          schedule_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_exercises: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          exercise_id: string | null
          exercise_name: string
          id: string
          notes: string | null
          order_index: number | null
          plan_id: string
          reps: string | null
          rest_seconds: number | null
          sets: number | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          exercise_id?: string | null
          exercise_name: string
          id?: string
          notes?: string | null
          order_index?: number | null
          plan_id: string
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          exercise_id?: string | null
          exercise_name?: string
          id?: string
          notes?: string | null
          order_index?: number | null
          plan_id?: string
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_exercises_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: Json
          created_at: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["plan_status"] | null
          type: Database["public"]["Enums"]["plan_type"]
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content: Json
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["plan_status"] | null
          type: Database["public"]["Enums"]["plan_type"]
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["plan_status"] | null
          type?: Database["public"]["Enums"]["plan_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_period_end: string | null
          discount_remaining: number | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          plan_status: Database["public"]["Enums"]["plan_status"] | null
          referral_code: string | null
          referred_by: string | null
          role: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_period_end?: string | null
          discount_remaining?: number | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          plan_status?: Database["public"]["Enums"]["plan_status"] | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_period_end?: string | null
          discount_remaining?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          plan_status?: Database["public"]["Enums"]["plan_status"] | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          discount_applied: boolean | null
          id: string
          referred_id: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          discount_applied?: boolean | null
          id?: string
          referred_id: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          discount_applied?: boolean | null
          id?: string
          referred_id?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: { p_message: string; p_type: string; p_user_id: string }
        Returns: string
      }
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      schedule_workout_reminder: {
        Args: {
          p_reminder_minutes: number
          p_user_id: string
          p_workout_time: string
        }
        Returns: string
      }
      setup_coach_role: {
        Args: { coach_email: string; coach_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "student"
      plan_status: "pending" | "approved" | "rejected"
      plan_type: "workout" | "nutrition"
      subscription_status: "pending" | "active" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coach", "student"],
      plan_status: ["pending", "approved", "rejected"],
      plan_type: ["workout", "nutrition"],
      subscription_status: ["pending", "active", "cancelled", "expired"],
    },
  },
} as const
