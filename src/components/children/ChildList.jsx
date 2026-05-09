import { ChildCard } from './ChildCard'
import LoadingSpinner from '../ui/LoadingSpinner'

function ChildList({ children, loading, onChildClick }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    )
  }

  if (!children || children.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👶</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No children found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children.map((child) => (
        <ChildCard
          key={child.id}
          child={child}
          onClick={() => onChildClick(child)}
          isDeactivated={child.status === 'INACTIVE' || child.status === 'ARCHIVED'}
        />
      ))}
    </div>
  )
}

export { ChildList }