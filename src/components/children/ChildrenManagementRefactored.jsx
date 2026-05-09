import { useState } from 'react'
import { SearchBar } from '../ui/shared/SearchBar'
import { ChildFilters } from './children/ChildFilters'
import { ChildList } from './children/ChildList'
import { Modal } from '../ui/shared/Modal'
import { useChildrenData } from '../../hooks/useChildrenData'

// Import the existing ChildDrawer (we'll keep it for now)
import ChildDrawer from '../ChildDrawer'

export default function ChildrenManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedChild, setSelectedChild] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)

  const { children, loading, error, refetch } = useChildrenData(searchQuery, statusFilter)

  const handleChildClick = (child) => {
    setSelectedChild(child)
    setShowDrawer(true)
  }

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setSelectedChild(null)
  }

  const handleChildUpdate = () => {
    refetch()
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading children</h3>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Children Management</h2>
          <p className="text-gray-600 mt-1">Manage student profiles and information</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search children by name or class..."
          />
        </div>
        <ChildFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {/* Children Grid */}
      <ChildList
        children={children}
        loading={loading}
        onChildClick={handleChildClick}
      />

      {/* Child Drawer Modal */}
      <Modal
        isOpen={showDrawer}
        onClose={handleCloseDrawer}
        size="lg"
        className="p-0"
      >
        {selectedChild && (
          <ChildDrawer
            child={selectedChild}
            onClose={handleCloseDrawer}
            onEdit={() => {/* Handle edit */}}
            onDeactivate={() => {/* Handle deactivate */}}
            onReactivate={() => {/* Handle reactivate */}}
            onArchive={() => {/* Handle archive */}}
            activeTab="children"
            onUpdate={handleChildUpdate}
          />
        )}
      </Modal>
    </div>
  )
}