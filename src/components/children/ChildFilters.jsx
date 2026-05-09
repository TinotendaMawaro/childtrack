import { FilterDropdown } from '../ui/shared/FilterDropdown'

function ChildFilters({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange }) {
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ARCHIVED', label: 'Archived' }
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <FilterDropdown
          placeholder="Filter by status"
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusFilterChange}
        />
      </div>
      <div className="text-sm text-gray-500 self-center hidden sm:block">
        {searchQuery && `Found results for "${searchQuery}"`}
      </div>
    </div>
  )
}

export { ChildFilters }