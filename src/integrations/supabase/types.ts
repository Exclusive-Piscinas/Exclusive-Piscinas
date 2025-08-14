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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accessories: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          changes: Json | null
          created_at: string | null
          id: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipments: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      product_accessories: {
        Row: {
          accessory_id: string
          created_at: string
          id: string
          product_id: string
          required: boolean | null
          sort_order: number | null
        }
        Insert: {
          accessory_id: string
          created_at?: string
          id?: string
          product_id: string
          required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          accessory_id?: string
          created_at?: string
          id?: string
          product_id?: string
          required?: boolean | null
          sort_order?: number | null
        }
        Relationships: []
      }
      product_equipments: {
        Row: {
          created_at: string
          equipment_id: string
          id: string
          product_id: string
          required: boolean | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          equipment_id: string
          id?: string
          product_id: string
          required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          equipment_id?: string
          id?: string
          product_id?: string
          required?: boolean | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_accessories_accessory_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_accessories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          features: string[] | null
          id: string
          images: string[] | null
          main_image: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price: number | null
          sale_price: number | null
          short_description: string | null
          slug: string
          specifications: Json | null
          stock_status: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          main_image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price?: number | null
          sale_price?: number | null
          short_description?: string | null
          slug: string
          specifications?: Json | null
          stock_status?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          main_image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price?: number | null
          sale_price?: number | null
          short_description?: string | null
          slug?: string
          specifications?: Json | null
          stock_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_accessories: {
        Row: {
          accessory_id: string | null
          accessory_name: string
          accessory_price: number
          created_at: string
          id: string
          quantity: number
          quote_id: string
          subtotal: number
        }
        Insert: {
          accessory_id?: string | null
          accessory_name: string
          accessory_price: number
          created_at?: string
          id?: string
          quantity?: number
          quote_id: string
          subtotal: number
        }
        Update: {
          accessory_id?: string | null
          accessory_name?: string
          accessory_price?: number
          created_at?: string
          id?: string
          quantity?: number
          quote_id?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_accessories_accessory_id"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quote_accessories_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_equipments: {
        Row: {
          created_at: string
          equipment_id: string
          equipment_name: string
          equipment_price: number
          id: string
          quantity: number
          quote_id: string
          subtotal: number
        }
        Insert: {
          created_at?: string
          equipment_id: string
          equipment_name: string
          equipment_price: number
          id?: string
          quantity?: number
          quote_id: string
          subtotal: number
        }
        Update: {
          created_at?: string
          equipment_id?: string
          equipment_name?: string
          equipment_price?: number
          id?: string
          quantity?: number
          quote_id?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_equipments_equipment_id"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quote_equipments_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_accessories_accessory_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_accessories_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
          quote_id: string
          subtotal: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          product_price: number
          quantity?: number
          quote_id: string
          subtotal: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          quote_id?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_items_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quote_items_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          customer_address: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          pdf_url: string | null
          quote_number: string
          status: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_address?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          pdf_url?: string | null
          quote_number: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_address?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          pdf_url?: string | null
          quote_number?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          active: boolean | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          key: string
          settings: Json | null
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          key: string
          settings?: Json | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          key?: string
          settings?: Json | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_admin_action: {
        Args: {
          p_action: string
          p_changes?: Json
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
