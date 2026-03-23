import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ className = 'w-5 h-5', ...props }) {
  return (
    <Loader2 
      className={`animate-spin ${className}`} 
      {...props}
    />
  )
}

