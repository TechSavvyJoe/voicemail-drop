import { createClient } from '@supabase/supabase-js'

// Check if we're in demo mode (missing or placeholder environment variables)
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co'

// Use placeholder values in demo mode to prevent errors
const supabaseUrl = isDemoMode ? 'https://demo.supabase.co' : process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = isDemoMode ? 'demo-key' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = isDemoMode ? 'demo-service-key' : process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client - only create if not in demo mode
export const supabase = isDemoMode ? null : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
})

// Admin client for server-side operations - only create if not in demo mode
export const supabaseAdmin = isDemoMode ? null : createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Demo mode flag export
export { isDemoMode }

// Database types
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          organization_name: string
          phone?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          organization_name: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          organization_name?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
