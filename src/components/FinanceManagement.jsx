import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Users, AlertCircle, Download, Send, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import SkeletonCard from './ui/SkeletonCard'
import SkeletonTable from './ui/SkeletonTable'
import FullScreenLoader from './ui/FullScreenLoader'

// Finance Data (mock API response)
const financeData = {
  monthlyRevenue: 45250,
  outstandingFees: 8450,
  paidToday: 2450,
  totalParents: 186,
}

const invoicesData = [
  { id: 1, parent: 'John Johnson', child: 'Emma Johnson', amount: 450, status: 'overdue', dueDate: '2024-01-15' },
  { id: 2, parent: 'Mike Smith', child: 'Liam Smith', amount: 450, status: 'pending', dueDate: '2024-01-20' },
  { id: 3, parent: 'David Brown', child: 'Olivia Brown', amount: 380, status: 'pending', dueDate: '2024-01-22' },
  { id: 4, parent: 'Carlos Martinez', child: 'Ava Martinez', amount: 450, status: 'overdue', dueDate: '2024-01-18' },
  { id: 5, parent: 'Robert Wilson', child: 'Noah Wilson', amount: 450, status: 'paid', dueDate: '2024-01-10' },
]

const revenueData = [
  { month: 'Aug', revenue: 38000 },
  { month: 'Sep', revenue: 42000 },
  { month: 'Oct', revenue: 39500 },
  { month: 'Nov', revenue: 44500 },
  { month: 'Dec', revenue: 41000 },
  { month: 'Jan', revenue: 45250 },
]

const paymentBreakdown = [
  { category: 'Tuition', amount: 35000, percentage: 77, color: 'bg-primary-blue' },
  { category: 'Transport', amount: 6500, percentage: 14, color: 'bg-accent-purple' },
  { category: 'Meals', amount: 2500, percentage: 5, color: 'bg-accent-green' },
  { category: 'Activities', amount: 1250, percentage: 3, color: 'bg-accent-yellow' },
]

// Stat Card Component
function StatCard({ icon: Icon, label, value, trend, trendUp, color, delay }) {
  const colorClasses = {
    blue: 'from-primary-blue to-blue-400',
    coral: 'from-primary-coral to-orange-400',
    green: 'from-accent-green to-emerald-400',
    purple: 'from-accent-purple to-violet-400',
    yellow: 'from-accent-yellow to-amber-400',
    pink: 'from-accent-pink to-rose-400',
  }

  return (
    <div className={`glass-card rounded-card p-5 card-hover animate-slide-up stagger-${delay}`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" strokeWidth={2} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendUp ? 'text-accent-green' : 'text-red-500'}`}>
            <TrendingUp size={14} className={!trendUp && 'rotate-180'} />
            <span className="font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="font-heading font-bold text-2xl text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

// Invoice Row Component
function InvoiceRow({ invoice }) {
  const statusConfig = {
    paid: { label: 'Paid', color: 'bg-accent-green/10 text-accent-green', icon: CheckCircle },
    pending: { label: 'Pending', color: 'bg-accent-yellow/10 text-amber-600', icon: Clock },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-600', icon: XCircle },
  }

  const status = statusConfig[invoice.status]
  const StatusIcon = status.icon

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4">
        <p className="font-medium text-gray-800">{invoice.parent}</p>
        <p className="text-xs text-gray-500">{invoice.child}</p>
      </td>
      <td className="py-4 px-4">
        <span className="font-medium text-gray-800">${invoice.amount}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`text-xs px-3 py-1 rounded-full ${status.color} flex items-center gap-1 w-fit`}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-gray-500">{invoice.dueDate}</span>
      </td>
      <td className="py-4 px-4">
        {invoice.status !== 'paid' && (
          <button className="text-xs px-3 py-1.5 rounded-lg bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 transition-colors flex items-center gap-1">
            <Send size={12} />
            Remind
          </button>
        )}
      </td>
    </tr>
  )
}

// Finance Management Screen
export default function FinanceScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [financeStats, setFinanceStats] = useState(null)
  const [invoicesList, setInvoicesList] = useState([])
  const [revenueList, setRevenueList] = useState([])
  const [paymentBreakdownList, setPaymentBreakdownList] = useState([])
  const maxRevenue = 50000 // For chart scaling

  // Live Supabase queries for finance data
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const fetchData = async () => {
      try {
        // Monthly revenue aggregate
        const { data: revenueData } = await supabase
          .rpc('monthly_revenue')
        
        // Outstanding invoices
        const { data: outstanding, count: outstandingCount } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'pending')
          .or('status.eq.pending,overdue')

        // Paid today
        const today = new Date().toISOString().split('T')[0]
        const { data: paidToday } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .eq('paid_date', today)
        
        // Parent count
        const { count: parentCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'PARENT')

        setFinanceStats({
          monthlyRevenue: revenueData || 0,
          outstandingFees: outstanding?.reduce((sum, p) => sum + p.amount, 0) || 0,
          paidToday: paidToday?.reduce((sum, p) => sum + p.amount, 0) || 0,
          totalParents: parentCount || 0,
        })

        // Invoices list
        const { data: invoices } = await supabase
          .from('payments')
          .select('*, child:children(full_name), parent:profiles(full_name)')
          .eq('status', 'in.(pending,overdue)')
          .order('due_date')
        
        setInvoicesList(invoices || [])

        // Revenue chart data
        const { data: revenueChart } = await supabase
          .rpc('revenue_last_6_months')
        setRevenueList(revenueChart || [])

        // Payment breakdown
        const { data: breakdown } = await supabase
          .rpc('payment_breakdown')
        setPaymentBreakdownList(breakdown || [])

      } catch (err) {
        setError('Failed to load financial data: ' + err.message)
        console.error('Finance fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <>
        <FullScreenLoader message="Loading financial dashboard..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 opacity-0">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center max-w-2xl mx-auto animate-fade-in">
        <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">Financial Data Unavailable</h3>
        <p className="text-gray-600 mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          Reload Data
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top - Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 [&>*]:animate-fade-in">
        <StatCard 
          icon={DollarSign} 
          label="Monthly Revenue" 
          value={`$${financeStats?.monthlyRevenue?.toLocaleString() || '0'}`} 
          trend="+8%" 
          trendUp={true} 
          color="green"
        />
        <StatCard 
          icon={AlertCircle} 
          label="Outstanding Fees" 
          value={`$${financeStats?.outstandingFees?.toLocaleString() || '0'}`} 
          trend="-12%" 
          trendUp={true} 
          color="coral"
        />
        <StatCard 
          icon={CheckCircle} 
          label="Paid Today" 
          value={`$${financeStats?.paidToday?.toLocaleString() || '0'}`} 
          trend="+15%" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          icon={Users} 
          label="Total Parents" 
          value={financeStats?.totalParents || 0} 
          trend="+5" 
          trendUp={true} 
          color="purple"
        />
      </div>

      {/* Middle - Revenue Graph + Invoices Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Line Graph */}
        <div className="lg:col-span-2 glass-card rounded-card p-6 animate-slide-up stagger-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-gray-800">Revenue Overview</h3>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          
          <div className="flex items-end justify-between gap-3 h-48">
            {revenueData.map((item, index) => {
              const height = (item.revenue / maxRevenue) * 100
              const gradients = [
                'from-primary-blue to-blue-300',
                'from-accent-purple to-violet-300',
                'from-primary-coral to-orange-300',
                'from-accent-green to-emerald-300',
                'from-accent-yellow to-amber-300',
                'from-accent-pink to-rose-300',
              ]
              
              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center justify-end h-36">
                    <div 
                      className={`w-full max-w-10 rounded-t-lg bg-gradient-to-t ${gradients[index]} shadow-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group`}
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${item.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-green" />
              <span className="text-sm text-gray-500">Total: $250,250</span>
            </div>
            <span className="text-sm font-medium text-accent-green">+12% vs last period</span>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="glass-card rounded-card p-6 animate-slide-up stagger-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-gray-800">Outstanding Invoices</h3>
            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">{invoicesData.filter(i => i.status === 'overdue').length} overdue</span>
          </div>
          
          {invoicesList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No outstanding invoices
            </div>
          ) : (
            <div className="space-y-1 overflow-y-auto max-h-80">
              {invoicesList.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Outstanding</span>
              <span className="font-bold text-gray-800">${invoicesData.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Payment Analytics + Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Breakdown */}
        <div className="glass-card rounded-card p-6 animate-slide-up">
          <h3 className="font-heading font-bold text-lg text-gray-800 mb-6">Payment Analytics</h3>
          
          <div className="space-y-4">
            {paymentBreakdown.map((item, index) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">${item.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-bold text-lg text-gray-800">${paymentBreakdown.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Export Report */}
        <div className="glass-card rounded-card p-6 animate-slide-up">
          <h3 className="font-heading font-bold text-lg text-gray-800 mb-6">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full p-4 rounded-xl bg-gradient-to-r from-primary-blue to-blue-400 text-white hover:shadow-lg transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Download size={20} />
                <span className="font-medium">Export Monthly Report</span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            
            <button className="w-full p-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-primary-blue hover:text-primary-blue transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Send size={20} />
                <span className="font-medium">Send Payment Reminders</span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            
            <button className="w-full p-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-accent-purple hover:text-accent-purple transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <DollarSign size={20} />
                <span className="font-medium">Record Payment</span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            
            <button className="w-full p-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-accent-green hover:text-accent-green transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} />
                <span className="font-medium">View Financial Summary</span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

