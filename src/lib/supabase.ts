import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Colors = 'Sunset' | 'Ocean' | 'Sky' | 'Mint' | 'Lavender' | 'Peach' | 'Cream' | 'Steel'

export interface User {
  id: string
  email: string
  updated_at: string
  created_at: string
}

export interface Note {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  color: Colors
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      notes: {
        Row: Note
        Insert: Omit<Note, 'id' | 'created_at'>
        Update: Partial<Omit<Note, 'id' | 'created_at'>>
      }
    }
  }
} 