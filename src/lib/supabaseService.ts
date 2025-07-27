import { supabase, type Colors, type Note, type User } from './supabase'

// Re-export types for convenience
export type { Colors, Note, User }

// Notes service
export const notesService = {
  // Get all notes for the current user
  async getAllUserNotes(): Promise<Note[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Ensure user exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    // If user doesn't exist in our users table, create them
    if (!existingUser) {
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
        })

      if (createUserError) {
        throw new Error(`Failed to create user profile: ${createUserError.message}`)
      }
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`)
    }

    return data || []
  },

  // Create a new note
  async createNote(): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // First, let's verify the user exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    // If user doesn't exist in our users table, create them
    if (!existingUser) {
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
        })

      if (createUserError) {
        throw new Error(`Failed to create user profile: ${createUserError.message}`)
      }
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: 'Untitled',
        content: '',
        user_id: user.id,
        color: 'Ocean' as Colors,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create note: ${error.message}`)
    }

    return data
  },

  // Update a note
  async updateNote(noteId: string, data: {
    title?: string
    content?: string
    color?: Colors
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('notes')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .eq('user_id', user.id) // Ensure user owns the note

    if (error) {
      throw new Error(`Failed to update note: ${error.message}`)
    }
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id) // Ensure user owns the note

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`)
    }
  }
}

// Users service
export const usersService = {
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Failed to fetch user:', error)
      return null
    }

    return data
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Failed to fetch user by email:', error)
      return null
    }

    return data
  },

  // Create or update user
  async createOrUpdateUser(email: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        email,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create/update user: ${error.message}`)
    }

    return data
  }
}

// Auth service
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string): Promise<{ user: any; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (!error && data.user?.id) {
      try {
        // Create user record in our users table using the auth user's ID
        await supabase
          .from('users')
          .insert({
            id: data.user.id, // Use the auth user's ID
            email: data.user.email || email,
          })
      } catch (userError) {
        console.error('Failed to create user profile:', userError)
        // Don't throw here as auth user was created successfully
      }
    }

    return { user: data.user, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: any; error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { user: data.user, error }
  },

  // Sign out
  async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
} 