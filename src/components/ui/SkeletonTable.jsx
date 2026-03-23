import React from 'react'

export default function SkeletonTable({ rows = 5, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 animate-pulse bg-white/50 ${className}`}>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur p-4 border-b border-gray-100">
        <div className="flex items-center gap-8">
          {['Applicant', 'Position', 'Experience', 'Status', 'Actions'].map((header, i) => (
            <div key={i} className="h-5 w-20 bg-gray-400 rounded animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex items-center gap-4 h-12">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 w-48">
                <div className="w-10 h-10 bg-gray-400 rounded-xl" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-gray-400 rounded" />
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                </div>
              </div>
              
              {/* Position */}
              <div className="w-24 h-4 bg-gray-400 rounded" />
              
              {/* Experience */}
              <div className="w-20 h-4 bg-gray-400 rounded" />
              
              {/* Status Badge */}
              <div className="w-28 h-6 bg-gray-400 rounded-full" />
              
              {/* Actions Button */}
              <div className="w-20 h-8 bg-gray-400 rounded-lg ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

