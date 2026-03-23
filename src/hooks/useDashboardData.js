import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useDashboardData() {
  const [data, setData] = useState({
    childrenCount: 0,
    childrenTrend: '0%',
    childrenTrendUp: false,
    staffCount: 0,
    staffTrend: '0%',
    staffTrendUp: false,
    attendanceToday: 0,
    attendanceTrend: '0%',
    attendanceTrendUp: false,
    pendingPayments: 0,
    paymentsTrend: '0%',
    paymentsTrendUp: false,
    recentActivities: [],
    revenueData: [],
    applicants: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Parallel queries
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const today = new Date().toISOString().split('T')[0]
      const [childrenRes, childrenPreviousRes, currentStaffRes, previousStaffRes, attendanceRes, paymentsRes, paymentsPreviousRes] = await Promise.all([
        supabase.from('children').select('*', { count: 'exact', head: false }),
        supabase.from('children').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'STAFF'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'STAFF').gte('created_at', thirtyDaysAgo),
        supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'PENDING').gte('created_at', thirtyDaysAgo)
      ])

      // Children growth
      const currentChildren = childrenRes.count || 0
      const previousChildren = childrenPreviousRes.count || 0
      let childrenTrend = '0%'
      let childrenTrendUp = false
      if (previousChildren === 0) {
        childrenTrend = currentChildren > 0 ? '+∞%' : '0%'
        childrenTrendUp = true
      } else {
        const change = ((currentChildren - previousChildren) / previousChildren) * 100
        childrenTrend = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
        childrenTrendUp = change >= 0
      }

      // Staff growth (existing)
      const currentStaff = currentStaffRes.count || 0
      const previousStaff = previousStaffRes.count || 0
      let staffTrend = '0%'
      let staffTrendUp = false
      if (previousStaff === 0) {
        staffTrend = currentStaff > 0 ? '+∞%' : '0%'
        staffTrendUp = true
      } else {
        const change = ((currentStaff - previousStaff) / previousStaff) * 100
        staffTrend = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
        staffTrendUp = change >= 0
      }

      // Attendance today
      const attendanceToday = attendanceRes.count || 0

      // Pending payments growth
      const currentPayments = paymentsRes.count || 0
      const previousPayments = paymentsPreviousRes.count || 0
      let paymentsTrend = '$0'
      let paymentsTrendUp = false
      if (previousPayments === 0) {
        paymentsTrend = currentPayments > 0 ? '+∞' : '$0'
        paymentsTrendUp = true
      } else {
        const change = currentPayments - previousPayments
        paymentsTrend = `$${Math.abs(change).toLocaleString()}`
        paymentsTrendUp = change <= 0  // Down is good for pending
      }

      setData({
        childrenCount: currentChildren,
        childrenTrend,
        childrenTrendUp,
        staffCount: currentStaff,
        staffTrend,
        staffTrendUp,
        attendanceToday,
      attendanceTrend: attendanceToday > 0 ? `${Math.round((attendanceToday / data.childrenCount || 1) * 100)}%` : '0%',
        attendanceTrendUp: true,
        pendingPayments: currentPayments,
        paymentsTrend,
        paymentsTrendUp,
        recentActivities: [],
        revenueData: [],
        applicants: []
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchDashboardData }
}
