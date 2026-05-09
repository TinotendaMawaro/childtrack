import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export function useChildrenData(searchQuery = '', statusFilter = 'ALL') {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChildren()
  }, [searchQuery, statusFilter])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('children')
        .select(`
          *,
          classes (
            name,
            curriculum
          ),
          profiles!parent_id (
            full_name,
            phone,
            email
          )
        `)
        .order('full_name')

      // Apply status filter
      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter)
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,classes.name.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error

      setChildren(data || [])
    } catch (err) {
      console.error('Error fetching children:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => fetchChildren()

  return { children, loading, error, refetch }
}