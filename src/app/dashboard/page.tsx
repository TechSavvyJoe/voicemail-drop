'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Phone, Users, TrendingUp,
  ArrowUp, ArrowDown, Plus, Eye, 
  BarChart3, Target, Zap, Calendar,
  Sparkles, ChevronRight, Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode, demoStats, demoCampaigns, demoCustomers } from '@/lib/demo-data'
import Link from 'next/link'

export default function ImprovedDashboardPage() {
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
      color: 'blue',
      href: '/customers'
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns?.toString() || '0',
      icon: Target,
      change: '+2',
      trend: 'up' as const,
      color: 'emerald',
      href: '/campaigns'
    },
    {
      title: 'Voicemails Sent',
      value: stats?.voicemailsSent?.toLocaleString() || '0',
      icon: Phone,
      change: '+8.3%',
      trend: 'up' as const,
      color: 'purple',
      href: '/analytics'
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate?.toFixed(1) || '0'}%`,
      icon: TrendingUp,
      change: '+2.1%',
      trend: 'up' as const,
      color: 'amber',
      href: '/analytics'
    },
  ], [stats])

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section with Better Contrast */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      Welcome back, {isDemoMode ? 'John' : 'User'}!
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                      Command Center Dashboard
                    </p>
                  </div>
                </div>
                
                {isDemoMode && (
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Zap className="w-4 h-4 mr-2" />
                      Demo Mode Active
                    </Badge>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-emerald-800">LIVE DATA</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                  aria-label="Select time range"
                  title="Select time range"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <Link href="/campaigns/new">
                  <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-semibold">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid with Better Contrast and Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 border border-${stat.color}-200 dark:border-${stat.color}-800 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        stat.trend === 'up' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {stat.change}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Monthly Usage Progress with Better Visibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Monthly Usage Analytics</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {stats?.monthlyUsage || 0} of {stats?.monthlyLimit || 0} voicemails sent this month
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  {Math.round(((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100)}% utilized
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100} 
                  className="h-4 bg-slate-200 dark:bg-slate-700"
                />
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span>{stats?.monthlyUsage || 0} used</span>
                  <span>{(stats?.monthlyLimit || 0) - (stats?.monthlyUsage || 0)} remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid with Better Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Campaigns Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="xl:col-span-2"
          >
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">Active Campaigns</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">Your latest voicemail campaigns</CardDescription>
                    </div>
                  </div>
                  <Link href="/campaigns">
                    <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-600">
                      <Eye className="h-4 w-4" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {campaignsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg p-6">
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns?.map((campaign, index) => (
                      <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                                  {campaign.name}
                                </h4>
                                <Badge 
                                  variant={campaign.status === 'running' ? 'default' : 
                                          campaign.status === 'completed' ? 'secondary' : 'outline'}
                                  className="text-xs"
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                <span className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {campaign.deliveredCount}/{campaign.totalRecipients} delivered
                                </span>
                                <span className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(campaign.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                                  <span>Progress</span>
                                  <span>{Math.round((campaign.deliveredCount / campaign.totalRecipients) * 100)}%</span>
                                </div>
                                <Progress 
                                  value={(campaign.deliveredCount / campaign.totalRecipients) * 100}
                                  className="h-2"
                                />
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 ml-4" />
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Customers Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="xl:col-span-1"
          >
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">Recent Customers</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">Latest additions</CardDescription>
                    </div>
                  </div>
                  <Link href="/customers">
                    <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-600">
                      <Eye className="h-4 w-4" />
                      All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customers?.slice(0, 4).map((customer, index) => (
                      <Link key={customer.id} href={`/customers/${customer.id}`}>
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-white">
                                {customer.firstName} {customer.lastName}
                              </h4>
                              <div className="flex items-center gap-2 my-2">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {customer.phoneNumber}
                                </span>
                                <Badge variant="outline" className="text-xs h-5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                                  {customer.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {customer.vehicleInterest || 'No preference'}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions with Better Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Streamline your workflow</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { href: '/campaigns/new', icon: Plus, title: 'New Campaign', desc: 'Create voicemail campaign', color: 'blue' },
                  { href: '/customers/upload', icon: Users, title: 'Import Customers', desc: 'Upload CSV/Excel files', color: 'emerald' },
                  { href: '/analytics', icon: BarChart3, title: 'Analytics Hub', desc: 'View detailed insights', color: 'purple' },
                  { href: '/profile', icon: Settings, title: 'Settings', desc: 'Manage account settings', color: 'amber' }
                ].map((action, index) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer group text-center"
                    >
                      <div className={`w-16 h-16 rounded-xl bg-${action.color}-100 dark:bg-${action.color}-900/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400`} />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {action.desc}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
