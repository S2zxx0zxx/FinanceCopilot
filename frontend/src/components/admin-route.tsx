import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!token || !user?.is_superuser) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
