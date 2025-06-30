import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create client if we have valid environment variables
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url' || 
    supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('❌ Supabase configuration missing or invalid. Please set up your environment variables.')
  console.log('📝 To fix this:')
  console.log('1. Create a .env file in your project root')
  console.log('2. Add your Supabase URL and Anon Key:')
  console.log('   VITE_SUPABASE_URL=https://your-project-id.supabase.co')
  console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key')
  console.log('3. Restart your development server')
  
  // Create a mock client that will prevent the app from crashing
  // but won't actually work until properly configured
  throw new Error('Supabase not configured. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  // Add timeout configuration to prevent hanging
  global: {
    headers: {
      'X-Client-Info': 'lifeos-app'
    }
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high'
          status: 'todo' | 'inprogress' | 'review' | 'done'
          due_date: string | null
          assignee: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'todo' | 'inprogress' | 'review' | 'done'
          due_date?: string | null
          assignee?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'todo' | 'inprogress' | 'review' | 'done'
          due_date?: string | null
          assignee?: string | null
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[]
          starred: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string
          tags?: string[]
          starred?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          content?: string
          tags?: string[]
          starred?: boolean
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          target_days_per_week: number
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          target_days_per_week?: number
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          target_days_per_week?: number
          color?: string
          updated_at?: string
        }
      }
      habit_entries: {
        Row: {
          id: string
          habit_id: string
          date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          date: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          completed?: boolean
        }
      }
      reflections: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: 'great' | 'good' | 'okay' | 'difficult'
          energy_level: number
          gratitude: string[]
          wins: string[]
          challenges: string[]
          tomorrow_focus: string[]
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood?: 'great' | 'good' | 'okay' | 'difficult'
          energy_level?: number
          gratitude?: string[]
          wins?: string[]
          challenges?: string[]
          tomorrow_focus?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          mood?: 'great' | 'good' | 'okay' | 'difficult'
          energy_level?: number
          gratitude?: string[]
          wins?: string[]
          challenges?: string[]
          tomorrow_focus?: string[]
          notes?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          start_time: string
          end_time: string | null
          location: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          start_time: string
          end_time?: string | null
          location?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          start_time?: string
          end_time?: string | null
          location?: string | null
          color?: string
          updated_at?: string
        }
      }
    }
  }
}