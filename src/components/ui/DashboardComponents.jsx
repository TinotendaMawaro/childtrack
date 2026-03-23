import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'

// Animated Counter Component
export function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime
    let animationFrame
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])
  
  return <span>{count}</span>
}

// StatCard Component
export function StatCard({ icon: Icon, label, value, trend, trendUp, color, delay }) {
  const colorClasses = {
    blue: 'from-primary-blue to-blue-400',
    coral: 'from-primary-coral to-orange-400',
    green: 'from-accent-green to-emerald-400',
    purple: 'from-accent-purple to-violet-400',
    yellow: 'from-accent-yellow to-amber-400',
    pink: 'from-accent-pink to-rose-400',
  }

  return (
    <div className={`glass-card rounded-card p-5 card-hover animate-slide-up stagger-${delay}`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" strokeWidth={2} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendUp ? 'text-accent-green' : 'text-red-500'}`}>
            <TrendingUp size={14} className={!trendUp && 'rotate-180'} />
            <span className="font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="font-heading font-bold text-3xl text-gray-800">
          <AnimatedCounter end={parseInt(value)} />
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}
