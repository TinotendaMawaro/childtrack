import { useState, useEffect } from 'react'
import {
  DollarSign, TrendingUp, Users, AlertCircle, Download, Send, Clock,
  CheckCircle, XCircle, Loader2, Plus, Edit, Trash2, Eye, Filter, UserPlus, X,
  Calendar, CreditCard, Landmark, Receipt, PiggyBank, Scale, FileText, TrendingDown
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import LoadingSpinner from './ui/LoadingSpinner'

// Initialize Supabase client directly for Finance module
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[FinanceManagement] Missing Supabase environment variables.')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Transaction type configuration
const TRANSACTION_TYPES = {
  TUITION: { label: 'Tuition', icon: Landmark, color: 'text-primary-blue', direction: 'INCOME' },
  REGISTRATION: { label: 'Registration', icon: UserPlus, color: 'text-primary-coral', direction: 'INCOME' },
  BUS_FEE: { label: 'Bus Fee', icon: Receipt, color: 'text-accent-purple', direction: 'INCOME' },
  SALARY: { label: 'Salary', icon: CreditCard, color: 'text-accent-green', direction: 'EXPENSE' },
  EXPENSE: { label: 'Expense', icon: TrendingDown, color: 'text-red-600', direction: 'EXPENSE' },
  DEBT: { label: 'Debt', icon: Scale, color: 'text-amber-600', direction: 'EXPENSE' },
  CREDIT: { label: 'Credit', icon: PiggyBank, color: 'text-emerald-600', direction: 'INCOME' },
  OTHER: { label: 'Other', icon: FileText, color: 'text-gray-500', direction: 'BOTH' }
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-accent-yellow/10 text-amber-600', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-accent-green/10 text-accent-green', icon: CheckCircle },
  OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-600', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-600', icon: XCircle },
  PARTIAL: { label: 'Partial', color: 'bg-blue-100 text-blue-600', icon: Clock }
}

export default function FinanceManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [outstandingBalances, setOutstandingBalances] = useState([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    outstandingPayments: 0,
    overdueAmount: 0,
    paidThisMonth: 0
  })

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateRange, setDateRange] = useState('ALL')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    transaction_type: 'TUITION',
    direction: 'INCOME',
    child_id: '',
    payer_id: '',
    payee_id: '',
    fee_structure_id: '',
    amount: '',
    status: 'PENDING',
    due_date: '',
    paid_date: '',
    payment_method: 'CASH',
    description: '',
    notes: ''
  })

  // Dropdown data
  const [childrenList, setChildrenList] = useState([])
  const [parentsList, setParentsList] = useState([])
  const [staffList, setStaffList] = useState([])
  const [feeStructures, setFeeStructures] = useState([])

  // Load all data
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    if (!supabase) {
      console.error('[FinanceManagement] Supabase client not initialized')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Fetch all data in parallel
      const [txRes, childrenRes, parentsRes, staffRes, feesRes, balancesRes] = await Promise.all([
        supabase.from('financial_transactions')
          .select(`
            *,
            child:children(id, full_name),
            payer:profiles!payer_id(id, full_name, email),
            payee:profiles!payee_id(id, full_name),
            fee:fee_structure(id, name, fee_type)
          `)
          .order('transaction_date', { ascending: false }),
        supabase.from('children').select('id, full_name, class_id').order('full_name'),
        supabase.from('profiles').select('id, full_name, email').eq('role', 'PARENT').order('full_name'),
        supabase.from('profiles').select('id, full_name').eq('role', 'STAFF').order('full_name'),
        supabase.from('fee_structure').select('*').eq('active', true).order('fee_type'),
        supabase.rpc('get_all_outstanding_balances')
      ])

      if (txRes.error) throw txRes.error

      setTransactions(txRes.data || [])
      setFilteredTransactions(txRes.data || [])
      setChildrenList(childrenRes.data || [])
      setParentsList(parentsRes.data || [])
      setStaffList(staffRes.data || [])
      setFeeStructures(feesRes.data || [])
      setOutstandingBalances(balancesRes.data || [])

      // Calculate stats
      calculateStats(txRes.data || [])
    } catch (err) {
      console.error('Finance fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (txns) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalIncome = 0
    let totalExpense = 0
    let outstandingPayments = 0
    let overdueAmount = 0
    let paidThisMonth = 0

    txns.forEach(t => {
      const txnDate = new Date(t.paid_date || t.transaction_date)
      const isCurrentMonth = txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear

      if (t.direction === 'INCOME' && t.status === 'PAID') {
        totalIncome += Number(t.amount)
        if (isCurrentMonth) paidThisMonth += Number(t.amount)
      } else if (t.direction === 'EXPENSE') {
        totalExpense += Number(t.amount)
      }

      if (t.status === 'PENDING' && t.direction === 'INCOME') {
        outstandingPayments += Number(t.amount)
      }

      if (t.status === 'OVERDUE') {
        overdueAmount += Number(t.amount)
      }
    })

    setStats({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      outstandingPayments,
      overdueAmount,
      paidThisMonth
    })
  }

  // Filtering logic
  useEffect(() => {
    let filtered = transactions

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(t => t.transaction_type === typeFilter)
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    if (dateRange === 'PENDING') {
      filtered = filtered.filter(t => t.status === 'PENDING')
    } else if (dateRange === 'PAID') {
      filtered = filtered.filter(t => t.status === 'PAID')
    } else if (dateRange === 'OVERDUE') {
      filtered = filtered.filter(t => t.status === 'OVERDUE')
    } else if (dateRange === 'DUE_SOON') {
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      const dueSoon = threeDaysFromNow.toISOString().split('T')[0]
      filtered = filtered.filter(t => t.status === 'PENDING' && t.due_date <= dueSoon)
    }

    setFilteredTransactions(filtered)
  }, [typeFilter, statusFilter, dateRange, transactions])

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      transaction_type: 'TUITION',
      direction: 'INCOME',
      child_id: '',
      payer_id: '',
      payee_id: '',
      fee_structure_id: '',
      amount: '',
      status: 'PENDING',
      due_date: '',
      paid_date: '',
      payment_method: 'CASH',
      description: '',
      notes: ''
    })
  }

  // Add transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!supabase) {
      alert('Supabase client not initialized.')
      return
    }
    setIsSubmitting(true)

    try {
      const txData = {
        transaction_type: formData.transaction_type,
        direction: formData.direction,
        child_id: formData.child_id || null,
        payer_id: formData.payer_id || null,
        payee_id: formData.payee_id || null,
        fee_structure_id: formData.fee_structure_id || null,
        amount: parseFloat(formData.amount),
        status: formData.status,
        due_date: formData.due_date || null,
        paid_date: formData.paid_date || null,
        payment_method: formData.payment_method,
        description: formData.description,
        notes: formData.notes,
        recorded_by: (await supabase.auth.getSession()).data.session?.user?.id
      }

      const { error } = await supabase.from('financial_transactions').insert(txData)
      if (error) throw error

      setShowAddModal(false)
      resetForm()
      fetchAllData()
      alert('Transaction added successfully!')
    } catch (err) {
      console.error('Add transaction error:', err)
      alert('Error adding transaction: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update transaction
  const handleUpdateTransaction = async (e) => {
    e.preventDefault()
    if (!supabase) {
      alert('Supabase client not initialized.')
      return
    }
    setIsSubmitting(true)

    try {
      const txData = {
        transaction_type: formData.transaction_type,
        direction: formData.direction,
        child_id: formData.child_id || null,
        payer_id: formData.payer_id || null,
        payee_id: formData.payee_id || null,
        fee_structure_id: formData.fee_structure_id || null,
        amount: parseFloat(formData.amount),
        status: formData.status,
        due_date: formData.due_date || null,
        paid_date: formData.paid_date || null,
        payment_method: formData.payment_method,
        description: formData.description,
        notes: formData.notes
      }

      const { error } = await supabase
        .from('financial_transactions')
        .update(txData)
        .eq('id', editingTransaction.id)

      if (error) throw error

      setShowEditModal(false)
      setEditingTransaction(null)
      resetForm()
      fetchAllData()
      alert('Transaction updated successfully!')
    } catch (err) {
      console.error('Update error:', err)
      alert('Error updating transaction: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    if (!supabase) {
      alert('Supabase client not initialized.')
      return
    }
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchAllData()
      alert('Transaction deleted successfully!')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error deleting transaction: ' + err.message)
    }
  }

  // Mark as paid
  const handleMarkPaid = async (id) => {
    if (!supabase) {
      alert('Supabase client not initialized.')
      return
    }
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({
          status: 'PAID',
          paid_date: new Date().toISOString().split('T')[0],
          payment_method: 'CASH'
        })
        .eq('id', id)

      if (error) throw error

      fetchAllData()
    } catch (err) {
      console.error('Mark paid error:', err)
      alert('Error updating status: ' + err.message)
    }
  }

  // Export transactions to CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Description', 'Child', 'Payer', 'Payee', 'Amount', 'Status', 'Due Date', 'Paid Date', 'Payment Method']
    const rows = filteredTransactions.map(t => [
      t.transaction_type,
      t.description || '',
      t.child?.full_name || '',
      t.payer?.full_name || '',
      t.payee?.full_name || '',
      t.amount,
      t.status,
      t.due_date || '',
      t.paid_date || '',
      t.payment_method || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Print report
  const printReport = () => {
    const printWindow = window.open('', '_blank')
    const totalDue = outstandingBalances.reduce((sum, b) => sum + Number(b.balance), 0)

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .summary { margin-bottom: 20px; }
            .summary p { margin: 5px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Financial Report</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

          <div class="summary">
            <h2>Summary</h2>
            <p><strong>Total Income:</strong> $${stats.totalIncome.toLocaleString()}</p>
            <p><strong>Total Expenses:</strong> $${stats.totalExpense.toLocaleString()}</p>
            <p><strong>Net Balance:</strong> $${stats.netBalance.toLocaleString()}</p>
            <p><strong>Outstanding Payments Due:</strong> $${totalDue.toLocaleString()}</p>
            <p><strong>Overdue Amount:</strong> $${stats.overdueAmount.toLocaleString()}</p>
          </div>

          <h2>Outstanding Balances by Child</h2>
          <table>
            <thead>
              <tr>
                <th>Child</th>
                <th>Parent</th>
                <th>Amount Due</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${outstandingBalances.map(b => `
                <tr>
                  <td>${b.child_name}</td>
                  <td>${b.parent_name || 'N/A'}</td>
                  <td>$${Number(b.total_due).toLocaleString()}</td>
                  <td>$${Number(b.total_paid).toLocaleString()}</td>
                  <td>$${Number(b.balance).toLocaleString()}</td>
                  <td>${b.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>All Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Child</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${t.transaction_type}</td>
                  <td>${t.description || ''}</td>
                  <td>${t.child?.full_name || ''}</td>
                  <td>$${Number(t.amount).toLocaleString()}</td>
                  <td>${t.status}</td>
                  <td>${t.due_date || ''}</td>
                  <td>${t.paid_date || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <p style="margin-top: 30px; font-size: 10px; color: #999;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  // Render empty state
  const renderEmptyState = () => (
    <div className="glass-card rounded-3xl p-16 text-center animate-fade-in">
      <Receipt className="w-24 h-24 text-gray-300 mx-auto mb-6" />
      <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">No Financial Transactions</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        No transactions match your current filters. Try adjusting filters or add a new transaction.
      </p>
      <button
        onClick={() => setShowAddModal(true)}
        className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add First Transaction
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading financial data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-card p-5 animate-slide-up stagger-1">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-400 flex items-center justify-center shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-heading font-bold text-2xl text-gray-800">${stats.totalIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Income</p>
          </div>
        </div>

        <div className="glass-card rounded-card p-5 animate-slide-up stagger-2">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center shadow-lg">
              <Receipt size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-heading font-bold text-2xl text-gray-800">${stats.totalExpense.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Expenses</p>
          </div>
        </div>

        <div className="glass-card rounded-card p-5 animate-slide-up stagger-3">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-blue to-blue-400 flex items-center justify-center shadow-lg">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-heading font-bold text-2xl text-gray-800">${stats.netBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Net Balance</p>
          </div>
        </div>

        <div className="glass-card rounded-card p-5 animate-slide-up stagger-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-yellow to-amber-400 flex items-center justify-center shadow-lg">
              <AlertCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-heading font-bold text-2xl text-gray-800">${stats.outstandingPayments.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Outstanding</p>
          </div>
        </div>
      </div>

      {/* Outstanding Amounts Due Section */}
      {outstandingBalances.length > 0 && (
        <div className="glass-card rounded-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-accent-yellow" />
              <h3 className="font-heading font-bold text-xl text-gray-800">Amounts Due</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Total Outstanding: <strong className="text-red-600">
                  ${outstandingBalances.reduce((sum, b) => sum + Number(b.balance), 0).toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outstandingBalances.slice(0, 9).map((balance) => (
              <div key={`${balance.child_id}-${balance.parent_id}`} className="glass-card-inner rounded-xl p-4 border-l-4 border-accent-yellow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{balance.child_name}</p>
                    <p className="text-xs text-gray-500">{balance.parent_name || 'No parent assigned'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    balance.status === 'OVERDUE' ? 'bg-red-100 text-red-600' :
                    balance.status === 'PAID_IN_FULL' ? 'bg-accent-green/10 text-accent-green' :
                    'bg-accent-yellow/10 text-amber-600'
                  }`}>
                    {balance.status === 'OVERDUE' ? 'Overdue' : balance.status === 'PAID_IN_FULL' ? 'Paid' : 'Owes'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Due</p>
                    <p className="font-bold text-red-600">${Number(balance.balance).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Paid</p>
                    <p className="font-medium text-accent-green">${Number(balance.total_paid).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {outstandingBalances.length > 9 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing 9 of {outstandingBalances.length} balances
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transactions Table */}
      <div className="glass-card rounded-card p-6 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="font-heading font-bold text-xl text-gray-800">Financial Transactions</h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none text-sm"
            >
              <option value="ALL">All Types</option>
              {Object.entries(TRANSACTION_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            {/* Date range filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none text-sm"
            >
              <option value="ALL">All Dates</option>
              <option value="PENDING">Pending Only</option>
              <option value="PAID">Paid Only</option>
              <option value="OVERDUE">Overdue</option>
              <option value="DUE_SOON">Due in 3 Days</option>
            </select>

            {/* Export & Print buttons */}
            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={printReport}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <FileText size={16} />
              Print Report
            </button>

            {/* Add button */}
            <button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="btn-gradient-coral px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm flex items-center gap-2 hover:shadow-xl transition-all"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Child / Linked</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const typeConfig = TRANSACTION_TYPES[tx.transaction_type] || TRANSACTION_TYPES.OTHER
                  const statusConfig = STATUS_CONFIG[tx.status]
                  const StatusIcon = statusConfig.icon

                  return (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-${typeConfig.color}-100 flex items-center justify-center`}>
                            <typeConfig.icon size={16} className={`${typeConfig.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{typeConfig.label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-800 max-w-xs truncate" title={tx.description}>
                          {tx.description || `${typeConfig.label} transaction`}
                        </p>
                        {tx.notes && (
                          <p className="text-xs text-gray-500 truncate" title={tx.notes}>{tx.notes}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {tx.child ? (
                          <div>
                            <p className="text-sm font-medium text-gray-800">{tx.child.full_name}</p>
                            <p className="text-xs text-gray-500">
                              {tx.payer?.full_name || 'No payer'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">General</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold text-lg ${tx.direction === 'INCOME' ? 'text-accent-green' : 'text-red-500'}`}>
                          {tx.direction === 'INCOME' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-3 py-1.5 rounded-full ${statusConfig.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {tx.due_date ? (
                          <div>
                            <p className="text-sm text-gray-800">{new Date(tx.due_date).toLocaleDateString()}</p>
                            {tx.status === 'PENDING' && (
                              <p className={`text-xs ${new Date(tx.due_date) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                                {new Date(tx.due_date) < new Date() ? 'Overdue!' : `${Math.ceil((new Date(tx.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {tx.status === 'PENDING' && (
                            <button
                              onClick={() => handleMarkPaid(tx.id)}
                              className="p-2 rounded-lg bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingTransaction(tx)
                              setFormData({
                                transaction_type: tx.transaction_type,
                                direction: tx.direction,
                                child_id: tx.child_id || '',
                                payer_id: tx.payer_id || '',
                                payee_id: tx.payee_id || '',
                                fee_structure_id: tx.fee_structure_id || '',
                                amount: tx.amount,
                                status: tx.status,
                                due_date: tx.due_date || '',
                                paid_date: tx.paid_date || '',
                                payment_method: tx.payment_method || 'CASH',
                                description: tx.description || '',
                                notes: tx.notes || ''
                              })
                              setShowEditModal(true)
                            }}
                            className="p-2 rounded-lg bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary row */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
            <div className="flex gap-8 text-sm">
              <div>
                <span className="text-gray-500">Total Count:</span>
                <span className="font-bold ml-2">{filteredTransactions.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Value:</span>
                <span className="font-bold ml-2">
                  ${filteredTransactions
                    .filter(t => t.direction === 'INCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-gray-800">Transaction Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="transaction_type"
                      value={formData.transaction_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      required
                    >
                      {Object.entries(TRANSACTION_TYPES).map(([key, val]) => (
                        <option key={key} value={key}>{val.label} ({val.direction})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      required
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="CASH">Cash</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CARD">Card</option>
                      <option value="ONLINE">Online</option>
                      <option value="MOBILE_MONEY">Mobile Money</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid Date</label>
                    <input
                      type="date"
                      name="paid_date"
                      value={formData.paid_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-none"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Linked Entities */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="font-heading font-semibold text-gray-800">Linked Entities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
                    <select
                      name="child_id"
                      value={formData.child_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select child (optional)</option>
                      {childrenList.map(child => (
                        <option key={child.id} value={child.id}>{child.full_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payer (Parent)</label>
                    <select
                      name="payer_id"
                      value={formData.payer_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select payer (optional)</option>
                      {parentsList.map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.full_name} ({parent.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payee (Staff/Vendor)</label>
                    <select
                      name="payee_id"
                      value={formData.payee_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select payee (optional)</option>
                      {staffList.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.full_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Structure</label>
                    <select
                      name="fee_structure_id"
                      value={formData.fee_structure_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select fee (optional)</option>
                      {feeStructures.map(fee => (
                        <option key={fee.id} value={fee.id}>
                          {fee.name} - ${fee.amount} ({fee.fee_type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Transaction'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Edit Transaction</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateTransaction} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-gray-800">Transaction Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="transaction_type"
                      value={formData.transaction_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      required
                    >
                      {Object.entries(TRANSACTION_TYPES).map(([key, val]) => (
                        <option key={key} value={key}>{val.label} ({val.direction})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      required
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="CASH">Cash</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CARD">Card</option>
                      <option value="ONLINE">Online</option>
                      <option value="MOBILE_MONEY">Mobile Money</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid Date</label>
                    <input
                      type="date"
                      name="paid_date"
                      value={formData.paid_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-none"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Linked Entities */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="font-heading font-semibold text-gray-800">Linked Entities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
                    <select
                      name="child_id"
                      value={formData.child_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select child (optional)</option>
                      {childrenList.map(child => (
                        <option key={child.id} value={child.id}>{child.full_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payer (Parent)</label>
                    <select
                      name="payer_id"
                      value={formData.payer_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select payer (optional)</option>
                      {parentsList.map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.full_name} ({parent.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payee (Staff/Vendor)</label>
                    <select
                      name="payee_id"
                      value={formData.payee_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select payee (optional)</option>
                      {staffList.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.full_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Structure</label>
                    <select
                      name="fee_structure_id"
                      value={formData.fee_structure_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="">Select fee (optional)</option>
                      {feeStructures.map(fee => (
                        <option key={fee.id} value={fee.id}>
                          {fee.name} - ${fee.amount} ({fee.fee_type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Transaction'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
