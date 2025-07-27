import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePath, Outlet, useNavigate } from 'react-router'

import { authService } from '@/lib/supabaseService'

import { ROUTES } from '@/lib/constants'

export function AuthenticatedLayout() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { session } = await authService.getSession()
        if (!session?.user) {
          navigate(generatePath(ROUTES.login))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        navigate(generatePath(ROUTES.login))
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        navigate(generatePath(ROUTES.login))
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="text-primary flex flex-1 items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return <Outlet />
}
