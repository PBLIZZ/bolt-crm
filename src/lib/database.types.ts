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
      profiles: {
        Row: {
          id: string
          business_name: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          bio: string | null
          avatar_url: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          business_name?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          health_conditions: string | null
          medications: string | null
          goals: string | null
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_conditions?: string | null
          medications?: string | null
          goals?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_conditions?: string | null
          medications?: string | null
          goals?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          duration_minutes: number | null
          price: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          duration_minutes?: number | null
          price?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          duration_minutes?: number | null
          price?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          price: number
          session_count: number
          validity_days: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          price: number
          session_count: number
          validity_days?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          price?: number
          session_count?: number
          validity_days?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          client_id: string
          service_id: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: string
          location: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          service_id?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status?: string
          location?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          service_id?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: string
          location?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_notes: {
        Row: {
          id: string
          user_id: string
          client_id: string
          appointment_id: string | null
          service_id: string | null
          session_date: string
          duration_minutes: number | null
          notes: string
          goals: string | null
          progress_notes: string | null
          next_steps: string | null
          mood_rating: number | null
          energy_level: number | null
          pain_level: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          appointment_id?: string | null
          service_id?: string | null
          session_date: string
          duration_minutes?: number | null
          notes: string
          goals?: string | null
          progress_notes?: string | null
          next_steps?: string | null
          mood_rating?: number | null
          energy_level?: number | null
          pain_level?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          appointment_id?: string | null
          service_id?: string | null
          session_date?: string
          duration_minutes?: number | null
          notes?: string
          goals?: string | null
          progress_notes?: string | null
          next_steps?: string | null
          mood_rating?: number | null
          energy_level?: number | null
          pain_level?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          client_id: string
          package_id: string | null
          service_id: string | null
          amount: number
          currency: string | null
          payment_method: string | null
          status: string
          transaction_id: string | null
          payment_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          package_id?: string | null
          service_id?: string | null
          amount: number
          currency?: string | null
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          payment_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          package_id?: string | null
          service_id?: string | null
          amount?: number
          currency?: string | null
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          payment_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_packages: {
        Row: {
          id: string
          user_id: string
          client_id: string
          package_id: string
          payment_id: string | null
          sessions_total: number
          sessions_used: number
          sessions_remaining: number
          purchase_date: string
          expiry_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          package_id: string
          payment_id?: string | null
          sessions_total: number
          sessions_used?: number
          sessions_remaining: number
          purchase_date?: string
          expiry_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          package_id?: string
          payment_id?: string | null
          sessions_total?: number
          sessions_used?: number
          sessions_remaining?: number
          purchase_date?: string
          expiry_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
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