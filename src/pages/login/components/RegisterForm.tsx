import { useState } from 'react'
import { toast } from 'sonner'

import { InputWithFeedback } from '@/components/InputWithFeedback'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/supabaseService'

const PASSWORD_MIN_LENGTH = 6

type FormState = {
  status: 'idle' | 'loading' | 'error'
  errors: {
    email?: string
    password?: string
  }
}

export function RegisterForm() {
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
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password || !confirmPassword) {
      setState({
        status: 'error',
        errors: {
          email: 'Please fill in all fields',
        },
      })
      return
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setState({
        status: 'error',
        errors: {
          password: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        },
      })
      return
    }

    if (password !== confirmPassword) {
      setState({
        status: 'error',
        errors: {
          password: 'Passwords do not match',
        },
      })
      return
    }

    try {
      // Register the user (Supabase will handle duplicate email validation)
      const { error } = await authService.signUp(email, password)

      if (error) {
        setState({
          status: 'error',
          errors: {
            email: error.message,
          },
        })
        return
      }

      toast.success('Registration successful! Please check your email to verify your account.')
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
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="password">Password</Label>
        <InputWithFeedback
          name="password"
          id="password"
          errorMessage={state.errors.password}
          isError={state.status === 'error' && !!state.errors.password}
          required
          type="password"
          helperText="Password must be at least 6 characters long"
          placeholder="********"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <InputWithFeedback
          name="confirmPassword"
          id="confirmPassword"
          required
          // just show error border if any password errors
          isError={state.status === 'error' && !!state.errors.password}
          type="password"
          placeholder="********"
        />
      </div>
      <Button 
        type="submit" 
        isLoading={state.status === 'loading'} 
        disabled={state.status === 'loading'} 
        className="mt-2"
      >
        Register
      </Button>
    </form>
  )
}
