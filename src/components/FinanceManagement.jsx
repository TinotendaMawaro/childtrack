import { useState, useEffect } from 'react'
import {
  DollarSign, TrendingUp, AlertCircle, Download, FileText,
  Plus, Edit, Trash2, CheckCircle, XCircle, Loader2, X, Clock,
  Landmark, Receipt, CreditCard, TrendingDown, PiggyBank, ChevronLeft, ChevronRight, Search
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const TRANSACTION_TYPES = {
  TUITION: { label: 'Tuition', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50' },
  REGISTRATION: { label: 'Registration', icon: Receipt, color: 'text-coral-600', bg: 'bg-coral-50' },
  BUS_FEE: { label: 'Bus Fee', icon: Receipt, color: 'text-purple-600', bg: 'bg-purple-50' },
  SALARY: { label: 'Salary', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  EXPENSE: { label: 'Expense', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
  DEBT: { label: 'Debt', icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
  CREDIT: { label: 'Credit', icon: PiggyBank, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  OTHER: { label: 'Other', icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50' }
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  PARTIAL: { label: 'Partial', color: 'bg-blue-100 text-blue-700', icon: Clock }
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

  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const [childrenList, setChildrenList] = useState([])
  const [parentsList, setParentsList] = useState([])
  const [staffList, setStaffList] = useState([])
  const [feeStructures, setFeeStructures] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    if (!supabase) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
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
        supabase.from('children').select('id, full_name').order('full_name'),
        supabase.from('profiles').select('id, full_name, email').eq('role', 'PARENT').order('full_name'),
        supabase.from('profiles').select('id, full_name').eq('role', 'STAFF').order('full_name'),
        supabase.from('fee_structure').select('*').eq('active', true).order('fee_type'),
        supabase.rpc('get_all_outstanding_balances')
      ])

      if (txRes.error) throw txRes.error

      const txData = txRes.data || []
      setTransactions(txData)
      setFilteredTransactions(txData)
      setChildrenList(childrenRes.data || [])
      setParentsList(parentsRes.data || [])
      setStaffList(staffRes.data || [])
      setFeeStructures(feesRes.data || [])
      setOutstandingBalances(balancesRes.data || [])
      calculateStats(txData)
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

  useEffect(() => {
    let filtered = transactions

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(t => t.transaction_type === typeFilter)
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        (t.description || '').toLowerCase().includes(q) ||
        (t.child?.full_name || '').toLowerCase().includes(q) ||
        (t.payer?.full_name || '').toLowerCase().includes(q) ||
        t.transaction_type.toLowerCase().includes(q)
      )
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [typeFilter, statusFilter, searchQuery, transactions])

  const totalItems = filteredTransactions.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

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

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!supabase) return
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
    } catch (err) {
      console.error('Add error:', err)
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTransaction = async (e) => {
    e.preventDefault()
    if (!supabase) return
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
    } catch (err) {
      console.error('Update error:', err)
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (!supabase) return
    if (!confirm('Delete this transaction?')) return

    try {
      const { error } = await supabase.from('financial_transactions').delete().eq('id', id)
      if (error) throw error
      fetchAllData()
    } catch (err) {
      console.error('Delete error:', err)
      alert(err.message)
    }
  }

  const handleMarkPaid = async (id) => {
    if (!supabase) return
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
      alert(err.message)
    }
  }

  const exportToCSV = () => {
    const headers = ['Type', 'Description', 'Child', 'Payer', 'Amount', 'Status', 'Due Date', 'Paid Date', 'Payment Method']
    const rows = filteredTransactions.map(t => [
      t.transaction_type,
      t.description || '',
      t.child?.full_name || '',
      t.payer?.full_name || '',
      t.amount,
      t.status,
      t.due_date || '',
      t.paid_date || '',
      t.payment_method || ''
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
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
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Financial Report</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <h2>Summary</h2>
          <p><strong>Total Income:</strong> $${stats.totalIncome.toLocaleString()}</p>
          <p><strong>Total Expenses:</strong> $${stats.totalExpense.toLocaleString()}</p>
          <p><strong>Net Balance:</strong> $${stats.netBalance.toLocaleString()}</p>
          <p><strong>Outstanding Payments Due:</strong> $${totalDue.toLocaleString()}</p>
          <p><strong>Overdue Amount:</strong> $${stats.overdueAmount.toLocaleString()}</p>
          <h2>Outstanding Balances</h2>
          <table>
            <thead><tr><th>Child</th><th>Parent</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>${outstandingBalances.map(b => `<tr><td>${b.child_name}</td><td>${b.parent_name || 'N/A'}</td><td>$${Number(b.balance).toLocaleString()}</td><td>${b.status}</td></tr>`).join('')}</tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Stats Row - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Income" value={stats.totalIncome} icon={TrendingUp} color="green" />
        <StatCard label="Expenses" value={stats.totalExpense} icon={TrendingDown} color="red" />
        <StatCard label="Net Balance" value={stats.netBalance} icon={DollarSign} color="blue" />
        <StatCard label="Outstanding" value={stats.outstandingPayments} icon={AlertCircle} color="yellow" />
        <StatCard label="Overdue" value={stats.overdueAmount} icon={AlertCircle} color="red" />
        <StatCard label="Paid This Month" value={stats.paidThisMonth} icon={CheckCircle} color="green" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Transactions Table */}
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg">
          {/* Filters Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30"
            >
              <option value="ALL">All Types</option>
              {Object.entries(TRANSACTION_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            <div className="flex-1"></div>

            <button
              onClick={exportToCSV}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Download size={14} />
              Export
            </button>

            <button
              onClick={() => { resetForm(); setShowAddModal(true) }}
              className="px-4 py-2 rounded-xl bg-primary-coral text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FileText size={48} className="mb-3" />
                <p>No transactions found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50/95 backdrop-blur z-10">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Child / Parent</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Due Date</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx) => {
                    const typeConfig = TRANSACTION_TYPES[tx.transaction_type] || TRANSACTION_TYPES.OTHER
                    const statusConfig = STATUS_CONFIG[tx.status]
                    const StatusIcon = statusConfig?.icon

                    return (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
                              <typeConfig.icon size={14} className={typeConfig.color} />
                            </div>
                            <span className="font-medium text-gray-800">{typeConfig.label}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-800 truncate max-w-[200px]" title={tx.description}>
                            {tx.description || '-'}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          {tx.child ? (
                            <div>
                              <p className="font-medium text-gray-800">{tx.child.full_name}</p>
                              <p className="text-xs text-gray-500">{tx.payer?.full_name || 'No payer'}</p>
                            </div>
                          ) : (
                            <span className="text-gray-500">General</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${tx.direction === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.direction === 'INCOME' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {statusConfig && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                              <StatusIcon size={10} />
                              {statusConfig.label}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {tx.due_date ? (
                            <div>
                              <p className="text-gray-800">{new Date(tx.due_date).toLocaleDateString()}</p>
                              {tx.status === 'PENDING' && (
                                <p className={`text-xs ${new Date(tx.due_date) < new Date() ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                  {new Date(tx.due_date) < new Date() ? 'Overdue' : `${Math.ceil((new Date(tx.due_date) - new Date()) / 86400000)}d left`}
                                </p>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {tx.status === 'PENDING' && (
                              <button
                                onClick={() => handleMarkPaid(tx.id)}
                                className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                title="Mark as Paid"
                              >
                                <CheckCircle size={14} />
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
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  if (pageNum > totalPages) return null
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-primary-blue text-white'
                          : 'hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Outstanding Balances Sidebar */}
        {outstandingBalances.length > 0 && (
          <div className="lg:w-80 flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-amber-50/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-800">Amounts Due</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total: <strong className="text-red-600">${outstandingBalances.reduce((sum, b) => sum + Number(b.balance), 0).toLocaleString()}</strong>
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {outstandingBalances.slice(0, 20).map((balance) => (
                <div key={balance.child_id} className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{balance.child_name}</p>
                      <p className="text-xs text-gray-500">{balance.parent_name || 'No parent'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      balance.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                      balance.status === 'PAID_IN_FULL' ? 'bg-green-100 text-green-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {balance.status === 'OVERDUE' ? 'Overdue' : balance.status === 'PAID_IN_FULL' ? 'Paid' : 'Owes'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="text-gray-500">Due</p>
                      <p className="font-bold text-red-600">${Number(balance.balance).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Paid</p>
                      <p className="font-medium text-green-600">${Number(balance.total_paid).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-4 border-b bg-white/95 backdrop-blur z-10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                  <select name="transaction_type" value={formData.transaction_type} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" required>
                    {Object.entries(TRANSACTION_TYPES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="0.00" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                  <select name="payment_method" value={formData.payment_method} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CARD">Card</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" name="due_date" value={formData.due_date} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Paid Date</label>
                  <input type="date" name="paid_date" value={formData.paid_date} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Brief description" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none" placeholder="Notes..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Child</label>
                  <select name="child_id" value={formData.child_id} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="">None</option>
                    {childrenList.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payer (Parent)</label>
                  <select name="payer_id" value={formData.payer_id} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="">None</option>
                    {parentsList.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-primary-coral text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-4 border-b bg-white/95 backdrop-blur z-10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Edit Transaction</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateTransaction} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                  <select name="transaction_type" value={formData.transaction_type} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" required>
                    {Object.entries(TRANSACTION_TYPES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                  <select name="payment_method" value={formData.payment_method} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CARD">Card</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" name="due_date" value={formData.due_date} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Paid Date</label>
                  <input type="date" name="paid_date" value={formData.paid_date} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Child</label>
                  <select name="child_id" value={formData.child_id} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="">None</option>
                    {childrenList.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payer (Parent)</label>
                  <select name="payer_id" value={formData.payer_id} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                    <option value="">None</option>
                    {parentsList.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-primary-coral text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    green: 'from-green-400 to-emerald-500',
    red: 'from-red-400 to-rose-500',
    blue: 'from-blue-400 to-indigo-500',
    yellow: 'from-amber-400 to-orange-500',
    purple: 'from-purple-400 to-pink-500'
  }
  const textColors = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    yellow: 'text-amber-600',
    purple: 'text-purple-600'
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-white/50 shadow-sm">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-sm mb-2`}>
        <Icon size={16} className="text-white" />
      </div>
      <p className={`text-lg font-bold ${textColors[color]}`}>${Number(value).toLocaleString()}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
