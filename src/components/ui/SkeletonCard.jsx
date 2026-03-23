import React from 'react'

export default function SkeletonCard({ className = 'h-64', count = 1 }) {
  return (
    <div className={`space-y-4 ${count > 1 ? 'space-y-6' : ''}`}>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i}
          className={`glass-card rounded-card p-6 animate-pulse bg-gradient-to-r 
                     from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] 
                     animate-[shimmer_1.5s_ease-in-out_infinite] ${className}`}
        >
          {/* Card Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-400 animate-pulse" />
            <div className="w-16 h-4 bg-gray-400 rounded animate-pulse" />
          </div>
          
          {/* Title Skeleton */}
          <div className="h-8 w-4/5 bg-gray-400 rounded-lg mb-6 animate-pulse" />
          
          {/* Content Skeletons */}
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-400 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-400 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-400 rounded animate-pulse" />
          </div>
          
          {/* Bottom Progress Skeleton */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between h-4 text-sm">
              <div className="w-16 h-3 bg-gray-400 rounded animate-pulse" />
              <div className="w-12 h-3 bg-gray-400 rounded animate-pulse" />
            </div>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-gray-400 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

