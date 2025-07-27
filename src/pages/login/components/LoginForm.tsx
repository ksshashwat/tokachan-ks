import { useState } from 'react'
import { toast } from 'sonner'

import { InputWithFeedback } from '@/components/InputWithFeedback'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/supabaseService'

type FormState = {
  status: 'idle' | 'loading' | 'error'
  errors: {
    email?: string
    password?: string
  }
}

export function LoginForm() {
  const [state, setState] = useState<FormState>({
    status: 'idle',
    errors: {},
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState({ status: 'loading', errors: {} })

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setState({
        status: 'error',
        errors: {
          email: 'Please fill in all fields',
        },
      })
      return
    }

    try {
      const { error } = await authService.signIn(email, password)

      if (error) {
        setState({
          status: 'error',
          errors: {
            email: error.message,
          },
        })
        return
      }

      toast.success('Signed in successfully!')
      // Redirect or update app state as needed
    } catch (error) {
      setState({
        status: 'error',
        errors: {
          email: 'An unexpected error occurred',
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-9">
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="email">Email</Label>
        <InputWithFeedback
          name="email"
          id="email"
          placeholder="naruto@konoha.com"
          type="email"
          errorMessage={state.errors.email}
          isError={state.status === 'error' && !!state.errors.email}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="password">Password</Label>
        <InputWithFeedback
          name="password"
          id="password"
          isError={state.status === 'error' && !!state.errors.email}
          type="password"
          helperText="Password must be at least 6 characters long"
          placeholder="********"
        />
      </div>
      <Button 
        type="submit" 
        isLoading={state.status === 'loading'} 
        disabled={state.status === 'loading'} 
        className="mt-2"
      >
        Login
      </Button>
    </form>
  )
}
