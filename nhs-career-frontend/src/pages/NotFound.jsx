import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold text-nhs-blue">404</p>
      <h1 className="mt-3 text-xl font-bold text-nhs-dark-blue">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-nhs-dark-grey">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="btn-primary mt-6">
        Back to {isAuthenticated ? 'dashboard' : 'home'}
      </Link>
    </div>
  )
}
