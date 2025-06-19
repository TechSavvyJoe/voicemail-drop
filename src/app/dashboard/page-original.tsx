'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Phone, Users, TrendingUp, Activity,
  ArrowUp, ArrowDown, Plus, Eye, 
  BarChart3, Target, Zap, Calendar,
  Sparkles, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode, demoStats, demoCampaigns, demoCustomers } from '@/lib/demo-data'
import Link from 'next/link'

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d')

  // Simulate real-time data updates
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', timeRange],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return demoStats
    },
    refetchInterval: isDemoMode ? 30000 : false,
  })

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['dashboard-campaigns'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return demoCampaigns.slice(0, 3) // Show top 3 campaigns
    },
    refetchInterval: isDemoMode ? 30000 : false,
  })

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['dashboard-customers'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return demoCustomers.slice(0, 5) // Show recent 5 customers
    },
    refetchInterval: isDemoMode ? 30000 : false,
  })

  const statCards = useMemo(() => [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers?.toLocaleString() || '0',
      icon: Users,
      change: '+12%',
      trend: 'up' as const,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns?.toString() || '0',
      icon: Target,
      change: '+2',
      trend: 'up' as const,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-500'
    },
    {
      title: 'Voicemails Sent',
      value: stats?.voicemailsSent?.toLocaleString() || '0',
      icon: Phone,
      change: '+8.3%',
      trend: 'up' as const,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate?.toFixed(1) || '0'}%`,
      icon: TrendingUp,
      change: '+2.1%',
      trend: 'up' as const,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      iconBg: 'bg-amber-500'
    },
  ], [stats])

  if (statsLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Ultra-Advanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl"></div>
      </div>
      
      <AdvancedNavigation />
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Ultra-Modern Header with Advanced Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 shadow-3xl">
            {/* Enhanced Glass Background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            
            {/* Ultra-Enhanced Floating Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-300/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-blue-300/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-8 lg:mb-0">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-3xl bg-white/10 blur-lg animate-pulse"></div>
                    </div>
                    <div>
                      <h1 className="text-5xl font-black text-white mb-2">
                        Welcome back, {isDemoMode ? 'John' : 'User'}!
                      </h1>
                      <div className="text-xl font-bold text-blue-100 mb-4">
                        Command Center Dashboard
                      </div>
                      {isDemoMode && (
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 font-bold">
                            <Zap className="w-4 h-4 mr-2" />
                            Demo Mode Active
                          </Badge>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold text-emerald-100 uppercase tracking-wider">LIVE DATA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-100 text-xl font-semibold leading-relaxed max-w-2xl">
                    Monitor your voicemail campaign performance with real-time analytics and advanced insights
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="relative">
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="flex h-14 w-auto min-w-[180px] rounded-2xl border border-white/40 bg-white/15 backdrop-blur-2xl px-5 py-3 text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 font-bold appearance-none shadow-xl"
                      aria-label="Select time range"
                    >
                      <option value="24h" className="text-slate-900 bg-white">Last 24 Hours</option>
                      <option value="7d" className="text-slate-900 bg-white">Last 7 Days</option>
                      <option value="30d" className="text-slate-900 bg-white">Last 30 Days</option>
                    </select>
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                  </div>
                  <Link href="/campaigns/new">
                    <Button className="h-14 px-8 bg-white text-blue-700 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 font-black text-base rounded-2xl hover:scale-105">
                      <Plus className="h-6 w-6 mr-3" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ultra-Enhanced Stats Grid with Advanced Glass Morphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-[1.02] bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl">
                {/* Ultra-Enhanced Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent dark:from-slate-700/60 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} dark:from-slate-700/30 dark:to-slate-800/30 opacity-30 rounded-3xl`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-slate-700/20 dark:to-transparent rounded-3xl" />
                
                {/* Advanced Floating Orbs */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-indigo-400/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                
                <CardContent className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-widest">
                        {stat.title}
                      </p>
                      <p className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-black backdrop-blur-sm ${
                          stat.trend === 'up' 
                            ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/50' 
                            : 'bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200/50 dark:border-red-700/50'
                        }`}>
                          {stat.trend === 'up' ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          vs period
                        </span>
                      </div>
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
                          trending
                        </span>
                      </div>
                    </div>
                    <div className="relative ml-6">
                      <div className={`w-18 h-18 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <stat.icon className="w-9 h-9 text-white" />
                      </div>
                      <div className={`absolute inset-0 rounded-2xl ${stat.iconBg} opacity-30 blur-lg group-hover:blur-xl transition-all duration-500`}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/30 dark:border-slate-600/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Performance Index</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 dark:text-slate-300 font-bold">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Ultra-Enhanced Usage Progress with Advanced Glass Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
              {/* Advanced Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
              
              <CardHeader className="pb-8 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-lg animate-pulse"></div>
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Monthly Usage Analytics</CardTitle>
                      <CardDescription className="text-base font-semibold text-slate-600 dark:text-slate-400">
                        {stats?.monthlyUsage || 0} of {stats?.monthlyLimit || 0} voicemails sent this month
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-base bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/40 dark:border-slate-600/50 font-black px-6 py-3">
                    {Math.round(((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100)}% utilized
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 relative">
                <div className="space-y-6">
                  <div className="relative">
                    <Progress 
                      value={((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100} 
                      className="h-6 bg-slate-200/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-full shadow-inner"
                    />
                  </div>
                  <div className="flex justify-between text-base font-black">
                    <span className="text-slate-700 dark:text-slate-300">
                      {stats?.monthlyUsage || 0} used
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {(stats?.monthlyLimit || 0) - (stats?.monthlyUsage || 0)} remaining
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/30 dark:border-slate-600/30">
                    <div className="text-center">
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {Math.round(((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100)}%
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Usage Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {stats?.monthlyLimit ? Math.round(((stats.monthlyLimit - stats.monthlyUsage) / stats.monthlyLimit) * 100) : 0}%
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        30
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Days Left</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Ultra-Enhanced Main Content Grid with Advanced Glass Design */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-12">
          {/* Ultra-Enhanced Recent Campaigns - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="xl:col-span-2"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
                {/* Advanced Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl"></div>
                
                <CardHeader className="pb-8 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-lg animate-pulse"></div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Active Campaigns</CardTitle>
                        <CardDescription className="font-semibold text-slate-600 dark:text-slate-400 text-base">Your latest voicemail campaigns performance</CardDescription>
                      </div>
                    </div>
                    <Link href="/campaigns">
                      <Button variant="outline" size="sm" className="gap-3 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/40 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 px-6 py-3 font-bold">
                        <Eye className="h-5 w-5" />
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative">
                  {campaignsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-slate-600/30">
                          <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-4"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {campaigns?.map((campaign, index) => (
                        <motion.div 
                          key={campaign.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group/campaign relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl blur-lg group-hover/campaign:blur-xl transition-all duration-300"></div>
                          <div className="relative p-8 rounded-2xl bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  <h4 className="font-black text-slate-900 dark:text-white text-xl">
                                    {campaign.name}
                                  </h4>
                                  <Badge 
                                    variant={campaign.status === 'running' ? 'default' : 
                                            campaign.status === 'completed' ? 'secondary' : 'outline'}
                                    className="text-sm font-bold px-3 py-1"
                                  >
                                    {campaign.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-8 text-base text-slate-600 dark:text-slate-400 font-semibold mb-6">
                                  <span className="flex items-center gap-3">
                                    <Users className="w-5 h-5" />
                                    {campaign.deliveredCount}/{campaign.totalRecipients} delivered
                                  </span>
                                  <span className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5" />
                                    {new Date(campaign.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-3 font-bold">
                                    <span>Campaign Progress</span>
                                    <span>{Math.round((campaign.deliveredCount / campaign.totalRecipients) * 100)}% Complete</span>
                                  </div>
                                  <Progress 
                                    value={(campaign.deliveredCount / campaign.totalRecipients) * 100}
                                    className="h-3 bg-slate-200/60 dark:bg-slate-600/60 backdrop-blur-sm"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-8">
                                <Button variant="outline" size="sm" className="opacity-0 group-hover/campaign:opacity-100 transition-opacity bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm">
                                  <Eye className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="sm" className="opacity-0 group-hover/campaign:opacity-100 transition-opacity bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm">
                                  <BarChart3 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Ultra-Enhanced Recent Customers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="xl:col-span-1"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-violet-400/20 to-indigo-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative border-0 shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
                {/* Advanced Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent dark:from-slate-700/50 dark:via-slate-800/30 dark:to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-violet-500/5 to-indigo-500/5 rounded-3xl"></div>
                
                <CardHeader className="pb-8 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center shadow-2xl">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-purple-400/30 blur-lg animate-pulse"></div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Recent Customers</CardTitle>
                        <CardDescription className="font-semibold text-slate-600 dark:text-slate-400 text-base">Latest customer additions</CardDescription>
                      </div>
                    </div>
                    <Link href="/customers">
                      <Button variant="outline" size="sm" className="gap-2 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/40 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 px-4 py-2 font-bold">
                        <Eye className="h-4 w-4" />
                        All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative">
                  {customersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-slate-600/30">
                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-3"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customers?.slice(0, 4).map((customer, index) => (
                        <motion.div 
                          key={customer.id} 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group/customer relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-violet-400/10 rounded-2xl blur-lg group-hover/customer:blur-xl transition-all duration-300"></div>
                          <div className="relative p-6 rounded-2xl bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-black text-slate-900 dark:text-white text-lg mb-2">
                                  {customer.firstName} {customer.lastName}
                                </h4>
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                    {customer.phoneNumber}
                                  </span>
                                  <Badge variant="outline" className="text-xs h-6 bg-white/60 dark:bg-slate-600/60 backdrop-blur-sm font-bold">
                                    {customer.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                  {customer.vehicleInterest || 'No preference'}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Lead</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Ultra-Advanced Quick Actions with Enhanced Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
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
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-lg animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-2">Quick Actions</CardTitle>
                    <CardDescription className="font-semibold text-slate-600 dark:text-slate-400 text-base">Streamline your workflow with one-click shortcuts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { href: '/campaigns/new', icon: Plus, title: 'New Campaign', desc: 'Create voicemail campaign', gradient: 'from-blue-500 to-blue-600' },
                    { href: '/customers/upload', icon: Users, title: 'Import Customers', desc: 'Upload CSV/Excel files', gradient: 'from-emerald-500 to-emerald-600' },
                    { href: '/analytics', icon: BarChart3, title: 'Analytics Hub', desc: 'View detailed insights', gradient: 'from-purple-500 to-purple-600' },
                    { href: '/settings', icon: Activity, title: 'Settings', desc: 'Manage account settings', gradient: 'from-amber-500 to-amber-600' }
                  ].map((action, index) => (
                    <Link key={action.href} href={action.href}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group/action relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-2xl blur-lg group-hover/action:blur-xl transition-all duration-300"></div>
                        <Card className="relative border-0 shadow-xl hover:shadow-3xl transition-all duration-500 cursor-pointer overflow-hidden bg-white/60 dark:bg-slate-700/60 backdrop-blur-2xl border border-white/30 dark:border-slate-600/30 group-hover/action:-translate-y-2">
                          <div className={`h-2 bg-gradient-to-r ${action.gradient} shadow-lg`} />
                          <CardContent className="p-8 text-center relative">
                            <div className="relative mb-6">
                              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto group-hover/action:scale-110 group-hover/action:rotate-3 transition-all duration-500 shadow-2xl`}>
                                <action.icon className="w-10 h-10 text-white" />
                              </div>
                              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${action.gradient} opacity-30 blur-lg group-hover/action:blur-xl transition-all duration-500`}></div>
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white mb-3 text-xl">
                              {action.title}
                            </h3>
                            <p className="text-base text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                              {action.desc}
                            </p>
                            <div className="mt-6 h-2 bg-slate-200/60 dark:bg-slate-600/60 rounded-full overflow-hidden backdrop-blur-sm">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${action.gradient} rounded-full shadow-lg`}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: index * 0.05 + 1, duration: 1.2, ease: "easeOut" }}
                              />
                            </div>
                            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-400/20 rounded-full blur-sm group-hover/action:bg-emerald-400/40 transition-all duration-300"></div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
