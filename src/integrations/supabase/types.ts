export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      backgrounds: {
        Row: {
          background_config: Json
          created_at: string
          description: string | null
          id: number
          is_featured: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          background_config: Json
          created_at?: string
          description?: string | null
          id?: number
          is_featured?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          background_config?: Json
          created_at?: string
          description?: string | null
          id?: number
          is_featured?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      default_geometries: {
        Row: {
          color_day: string | null
          color_night: string | null
          created_at: string
          description: string | null
          geometry_type: string
          id: number
          is_featured: boolean | null
          material_config: Json | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color_day?: string | null
          color_night?: string | null
          created_at?: string
          description?: string | null
          geometry_type: string
          id?: number
          is_featured?: boolean | null
          material_config?: Json | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color_day?: string | null
          color_night?: string | null
          created_at?: string
          description?: string | null
          geometry_type?: string
          id?: number
          is_featured?: boolean | null
          material_config?: Json | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string
          event_source: string | null
          event_type: string
          id: number
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          event_source?: string | null
          event_type: string
          id?: number
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          event_source?: string | null
          event_type?: string
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      worlds: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_featured: boolean | null
          name: string
          scene_config: Json | null
          slug: string | null
          ui_day_color: string | null
          ui_night_color: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_featured?: boolean | null
          name: string
          scene_config?: Json | null
          slug?: string | null
          ui_day_color?: string | null
          ui_night_color?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_featured?: boolean | null
          name?: string
          scene_config?: Json | null
          slug?: string | null
          ui_day_color?: string | null
          ui_night_color?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
