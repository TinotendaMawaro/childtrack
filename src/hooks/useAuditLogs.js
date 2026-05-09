import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useAuditLogs({
  searchQuery = '',
  childFilter = '',
  adminFilter = '',
  dateRange = '30',
  statusFilter = 'ALL'
}) {
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAuditLogs()
  }, [searchQuery, childFilter, adminFilter, dateRange, statusFilter])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('child_status_history')
        .select(`
          *,
          children (
            full_name,
            classes (
              name
            )
          ),
          profiles!changed_by (
            full_name
          )
        `)
        .order('changed_at', { ascending: false })

      // Apply date range filter
      if (dateRange && dateRange !== 'all') {
        const days = parseInt(dateRange)
        const date = new Date()
        date.setDate(date.getDate() - days)
        query = query.gte('changed_at', date.toISOString())
      }

      // Apply child filter
      if (childFilter) {
        query = query.eq('child_id', childFilter)
      }

      // Apply admin filter
      if (adminFilter) {
        query = query.eq('changed_by', adminFilter)
      }

      // Apply status filter
      if (statusFilter !== 'ALL') {
        query = query.eq('new_status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error

      // Apply search filter on client side
      let filteredData = data || []
      if (searchQuery) {
        filteredData = filteredData.filter(log =>
          log.children?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setAuditLogs(filteredData)
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => fetchAuditLogs()

  return { auditLogs, loading, error, refetch }
}