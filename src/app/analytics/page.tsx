'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  BarChart3, TrendingUp, Phone, Clock, 
  DollarSign, Activity, Download,
  ArrowUp, ArrowDown, Target, Filter,
  Calendar, Zap, PieChart, LineChart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode, demoAnalytics } from '@/lib/demo-data'

interface AnalyticsData {
  overview: {
    totalCampaigns: number
    totalCalls: number
    deliveryRate: number
    totalCost: number
    avgDuration: number
    successRate: number
  }
  trends: {
    callsOverTime: Array<{ date: string; calls: number; delivered: number }>
    performanceMetrics: Array<{ metric: string; value: number; change: number }>
  }
  demographics: {
    timeSlots: Array<{ time: string; success: number; total: number }>
    regions: Array<{ region: string; calls: number; success: number }>
  }
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')

  // Simulate real-time analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async (): Promise<AnalyticsData> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      return demoAnalytics
    },
    refetchInterval: isDemoMode ? 30000 : false,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600 dark:text-emerald-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-slate-600 dark:text-slate-400'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4" />
    if (change < 0) return <ArrowDown className="h-4 w-4" />
    return null
  }

  const getChangeBadgeClass = (change: number) => {
    if (change > 0) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
    if (change < 0) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900">
        <AdvancedNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full animate-ping border-4 border-blue-400 opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const overviewStats = [
    {
      title: 'Total Campaigns',
      value: analytics?.overview.totalCampaigns || 0,
      icon: Target,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      change: 12,
      format: (val: number) => val.toLocaleString()
    },
    {
      title: 'Total Calls',
      value: analytics?.overview.totalCalls || 0,
      icon: Phone,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      change: 8.5,
      format: (val: number) => val.toLocaleString()
    },
    {
      title: 'Delivery Rate',
      value: analytics?.overview.deliveryRate || 0,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      change: 2.3,
      format: (val: number) => formatPercentage(val)
    },
    {
      title: 'Total Cost',
      value: analytics?.overview.totalCost || 0,
      icon: DollarSign,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      change: -5.2,
      format: (val: number) => formatCurrency(val)
    },
    {
      title: 'Avg Duration',
      value: analytics?.overview.avgDuration || 0,
      icon: Clock,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      change: 15.7,
      format: (val: number) => `${val.toFixed(1)}s`
    },
    {
      title: 'Success Rate',
      value: analytics?.overview.successRate || 0,
      icon: Activity,
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100',
      change: 4.1,
      format: (val: number) => formatPercentage(val)
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Advanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <AdvancedNavigation />
      
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl border-b border-white/20 dark:border-slate-700/50 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="relative container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-3 text-sm">
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-xl">
                <Zap className="w-3.5 h-3.5 text-white" />
                <div className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping"></div>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                Live Analytics Dashboard
              </span>
              <div className="h-1 w-1 bg-slate-400 rounded-full"></div>
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Real-time data simulation
              </span>
              <div className="flex items-center ml-4 px-3 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">LIVE DATA</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Ultra-Modern Header with Advanced Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden bg-white/30 dark:bg-slate-800/30 backdrop-blur-3xl rounded-3xl border border-white/30 dark:border-slate-700/50 shadow-2xl">
            {/* Advanced Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-slate-700/40 dark:via-slate-800/20 dark:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
            
            {/* Floating Orbs */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-lg animate-pulse"></div>
                    </div>
                    <div>
                      <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent leading-tight">
                        Analytics
                      </h1>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Intelligence Hub
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-xl font-medium leading-relaxed mb-6">
                    Advanced performance insights, real-time campaign analytics, and customer engagement intelligence 
                    powered by machine learning algorithms
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
                      <div className="relative w-3 h-3 bg-emerald-500 rounded-full">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live Intelligence</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                      <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Real-time Processing</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-white/50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                      Updates every 30 seconds
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="flex h-14 w-auto min-w-[180px] rounded-2xl border border-white/40 dark:border-slate-600/50 bg-white/60 dark:bg-slate-700/60 backdrop-blur-2xl px-5 py-3 text-sm font-bold shadow-xl transition-all hover:shadow-2xl hover:bg-white/80 dark:hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      aria-label="Select date range"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="12m">Last 12 Months</option>
                    </select>
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  
                  <Button variant="outline" className="gap-3 shadow-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-2xl border-white/40 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 h-14 px-6 rounded-2xl font-bold">
                    <Filter className="w-5 h-5" />
                    Advanced Filters
                  </Button>
                  
                  <Button className="gap-3 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-0 h-14 px-8 rounded-2xl font-bold transition-all duration-300 hover:scale-105">
                    <Download className="w-5 h-5" />
                    Export Intelligence
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ultra-Enhanced Stats Grid with Advanced Glass Morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {overviewStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-[1.02] bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl">
                {/* Enhanced Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent dark:from-slate-700/60 dark:via-slate-800/30 dark:to-transparent"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} dark:from-slate-700/30 dark:to-slate-800/30 opacity-30`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-slate-700/20 dark:to-transparent" />
                
                {/* Floating Orb Effects */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-indigo-400/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                
                <CardContent className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-30 blur-lg group-hover:blur-xl transition-all duration-500`}></div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black border-2 shadow-xl backdrop-blur-sm transition-all duration-300 ${getChangeBadgeClass(stat.change)}`}>
                      {getChangeIcon(stat.change)}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-widest">
                      {stat.title}
                    </p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                      {stat.format(stat.value)}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-200/60 dark:bg-slate-600/60 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full shadow-lg`}
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                        vs period
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/30 dark:border-slate-600/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Trend Analysis</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-slate-600 dark:text-slate-300 font-bold">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Ultra-Advanced Performance Metrics with Glass Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-12"
        >
          {/* Enhanced Trends Chart */}
          <div className="xl:col-span-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
                {/* Advanced Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
                
                <CardHeader className="pb-8 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                          <LineChart className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-lg animate-pulse"></div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Performance Intelligence</CardTitle>
                        <p className="text-base text-slate-600 dark:text-slate-400 font-semibold">
                          Advanced campaign analytics with predictive insights
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-sm bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/40 dark:border-slate-600/50 px-4 py-2 font-bold">
                      {dateRange === '7d' ? 'Weekly View' : dateRange === '30d' ? 'Monthly View' : dateRange === '90d' ? 'Quarterly View' : 'Annual View'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-900/80 rounded-3xl border border-white/30 dark:border-slate-700/30 backdrop-blur-sm relative overflow-hidden">
                    {/* Floating Background Elements */}
                    <div className="absolute top-4 right-8 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-8 left-8 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl"></div>
                    
                    <div className="text-center relative z-10">
                      <div className="relative mb-8">
                        <BarChart3 className="w-28 h-28 text-blue-400 mx-auto" />
                        <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full"></div>
                      </div>
                      <h3 className="text-slate-700 dark:text-slate-300 font-black text-2xl mb-4">
                        Interactive Analytics Engine
                      </h3>
                      <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                        Advanced charting with D3.js, Chart.js, or Recharts would provide comprehensive real-time analytics visualization with interactive drill-down capabilities
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/40 dark:border-slate-600/50 font-bold">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          View Live Charts
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                          <PieChart className="w-5 h-5 mr-2" />
                          Customize View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ultra-Enhanced Key Metrics */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
              {/* Advanced Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl"></div>
              
              <CardHeader className="pb-8 relative">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-lg animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Key Metrics</CardTitle>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-semibold">
                      Critical performance indicators
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 relative">
                {analytics?.trends?.performanceMetrics?.map((metric, index) => (
                  <motion.div 
                    key={metric.metric} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group/metric"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl blur-lg group-hover/metric:blur-xl transition-all duration-300"></div>
                    <div className="relative p-6 rounded-2xl bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-black text-slate-900 dark:text-white capitalize text-lg">
                          {metric.metric.replace('_', ' ')}
                        </span>
                        <div className={`flex items-center gap-2 text-sm font-black px-3 py-1.5 rounded-full ${getChangeColor(metric.change)} bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm`}>
                          {getChangeIcon(metric.change)}
                          {Math.abs(metric.change)}%
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className="h-3 bg-slate-200/60 dark:bg-slate-600/60 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(metric.value, 100)}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/30 dark:border-slate-600/30">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Performance</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">Live</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) || (
                  <div className="text-center py-16">
                    <div className="relative mb-6">
                      <Activity className="w-20 h-20 text-slate-400 mx-auto" />
                      <div className="absolute inset-0 bg-slate-400/20 blur-xl rounded-full"></div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">
                      No metrics data available
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                      Start a campaign to see performance data
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Ultra-Advanced Demographics & Time Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Enhanced Time Slots Analysis */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-violet-400/20 to-indigo-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
              {/* Advanced Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-violet-500/5 to-indigo-500/5 rounded-3xl"></div>
              
              <CardHeader className="pb-8 relative">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center shadow-2xl">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-purple-400/30 blur-lg animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Optimal Call Times</CardTitle>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-semibold">
                      Success rates throughout the day
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {analytics?.demographics?.timeSlots?.map((slot, index) => {
                    const successRate = Math.round((slot.success / slot.total) * 100);
                    return (
                      <motion.div 
                        key={slot.time} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group/slot"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-violet-400/10 rounded-2xl blur-lg group-hover/slot:blur-xl transition-all duration-300"></div>
                        <div className="relative flex items-center justify-between p-6 rounded-2xl bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-100/80 to-violet-100/80 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center backdrop-blur-sm">
                              <Calendar className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-black text-slate-900 dark:text-white text-xl mb-1">
                                {slot.time}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                                {slot.success}/{slot.total} calls delivered
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Active Period</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                              {successRate}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-3">
                              success rate
                            </div>
                            <div className="w-24 h-3 bg-slate-200/60 dark:bg-slate-600/60 rounded-full overflow-hidden backdrop-blur-sm">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full shadow-lg"
                                initial={{ width: 0 }}
                                animate={{ width: `${successRate}%` }}
                                transition={{ delay: index * 0.05 + 0.5, duration: 1.5, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) || (
                    <div className="text-center py-16">
                      <div className="relative mb-6">
                        <Clock className="w-20 h-20 text-slate-400 mx-auto" />
                        <div className="absolute inset-0 bg-slate-400/20 blur-xl rounded-full"></div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">
                        No time slot data available
                      </p>
                      <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                        Run campaigns to analyze optimal call times
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Regional Performance */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
              {/* Advanced Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-red-500/5 rounded-3xl"></div>
              
              <CardHeader className="pb-8 relative">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl">
                      <PieChart className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-lg animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Regional Insights</CardTitle>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-semibold">
                      Performance across geographic regions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {analytics?.demographics?.regions?.map((region, index) => {
                    const successRate = Math.round((region.success / region.calls) * 100);
                    return (
                      <motion.div 
                        key={region.region} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group/region"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-2xl blur-lg group-hover/region:blur-xl transition-all duration-300"></div>
                        <div className="relative flex items-center justify-between p-6 rounded-2xl bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center backdrop-blur-sm">
                              <Target className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="font-black text-slate-900 dark:text-white text-xl mb-1">
                                {region.region}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                                {region.success}/{region.calls} calls successful
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Active Region</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                              {successRate}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-3">
                              success rate
                            </div>
                            <div className="w-24 h-3 bg-slate-200/60 dark:bg-slate-600/60 rounded-full overflow-hidden backdrop-blur-sm">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg"
                                initial={{ width: 0 }}
                                animate={{ width: `${successRate}%` }}
                                transition={{ delay: index * 0.05 + 0.5, duration: 1.5, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) || (
                    <div className="text-center py-16">
                      <div className="relative mb-6">
                        <Target className="w-20 h-20 text-slate-400 mx-auto" />
                        <div className="absolute inset-0 bg-slate-400/20 blur-xl rounded-full"></div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">
                        No regional data available
                      </p>
                      <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                        Expand campaigns to multiple regions
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
