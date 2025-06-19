'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Phone, Plus, Play, Check, Search,
  Clock, Edit, Eye, Download, Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCampaigns } from '@/hooks/use-campaigns'
import { AdvancedNavigation } from '@/components/advanced-navigation'

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  
  const { campaigns, isLoading, isError, error } = useCampaigns()

  // Enhanced filtering and sorting
  const filteredAndSortedCampaigns = useMemo(() => {
    const filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return filtered.sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'created':
          compareValue = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'recipients':
          compareValue = a.total_recipients - b.total_recipients
          break
        case 'progress':
          const aProgress = a.total_recipients > 0 ? (a.sent_count / a.total_recipients) : 0
          const bProgress = b.total_recipients > 0 ? (b.sent_count / b.total_recipients) : 0
          compareValue = aProgress - bProgress
          break
        default:
          compareValue = 0
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue
    })
  }, [campaigns, searchTerm, statusFilter, sortBy, sortOrder])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdvancedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading campaigns...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdvancedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 dark:text-red-400 mb-2">
                Error loading campaigns
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {error?.message || 'Something went wrong'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      running: { 
        variant: 'default' as const, 
        label: 'Running', 
        icon: Play, 
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        dotColor: 'bg-emerald-500'
      },
      completed: { 
        variant: 'secondary' as const, 
        label: 'Completed', 
        icon: Check, 
        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        dotColor: 'bg-blue-500'
      },
      draft: { 
        variant: 'outline' as const, 
        label: 'Draft', 
        icon: Clock, 
        className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dotColor: 'bg-slate-400'
      }
    }
    
    return configs[status as keyof typeof configs] || configs.draft
  }

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status)
    const Icon = config.icon
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
    )
  }

  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }

  const totalStats = {
    total: campaigns.length,
    running: campaigns.filter(c => c.status === 'running').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Voice Campaigns</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your automated voicemail campaigns</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-10">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href="/campaigns/new">
                  <Button className="h-10">
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 mb-8 grid-cols-2 lg:grid-cols-4"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalStats.total}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{totalStats.running}</div>
              <div className="text-sm text-emerald-600 dark:text-emerald-400">Running</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalStats.completed}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-400">{totalStats.draft}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Draft</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clean Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Status</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                  >
                    <option value="created">Date Created</option>
                    <option value="name">Name</option>
                    <option value="recipients">Recipients</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Simplified Campaign Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
        >
          {filteredAndSortedCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                        {getStatusBadge(campaign.status)}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {campaign.total_recipients.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Recipients</div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                        {campaign.sent_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Sent</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                      <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        {campaign.delivered_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400">Delivered</div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                        {campaign.total_recipients > 0 ? Math.round((campaign.sent_count / campaign.total_recipients) * 100) : 0}%
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Progress</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {campaign.sent_count} / {campaign.total_recipients}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${campaign.total_recipients > 0 ? (campaign.sent_count / campaign.total_recipients) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/campaigns/${campaign.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAndSortedCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Phone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first campaign to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/campaigns/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
        default:
          compareValue = 0
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue
    })
  }, [campaigns, searchTerm, statusFilter, sortBy, sortOrder])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdvancedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading campaigns...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdvancedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 dark:text-red-400 mb-2">
                Error loading campaigns
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {error?.message || 'Something went wrong'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      running: { 
        variant: 'default' as const, 
        label: 'Running', 
        icon: Play, 
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        dotColor: 'bg-emerald-500'
      },
      completed: { 
        variant: 'secondary' as const, 
        label: 'Completed', 
        icon: Check, 
        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        dotColor: 'bg-blue-500'
      },
      draft: { 
        variant: 'outline' as const, 
        label: 'Draft', 
        icon: Clock, 
        className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dotColor: 'bg-slate-400'
      }
    }
    
    return configs[status as keyof typeof configs] || configs.draft
  }

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status)
    const Icon = config.icon
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
    )
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (rate >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }

  const totalStats = {
    total: campaigns.length,
    running: campaigns.filter(c => c.status === 'running').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <AdvancedNavigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Ultra-Modern Header with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-blue-100/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 rounded-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Live System</span>
                </div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                  Voice Campaigns
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                  Orchestrate powerful automated voicemail campaigns that convert prospects into customers
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="h-12 px-6 bg-white/50 border-white/20 hover:bg-white/80 backdrop-blur-sm shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Analytics
                </Button>
                <Link href="/campaigns/new">
                  <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Redesigned Stats Cards with Glass Morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-8 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
        >
          <Card className="relative overflow-hidden border-0 shadow-xl bg-white/60 backdrop-blur-xl hover:bg-white/80 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 to-transparent" />
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-4xl font-black text-slate-900 tracking-tight">{totalStats.total}</p>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Total Campaigns</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-400/10 via-white/60 to-emerald-300/10 backdrop-blur-xl hover:from-emerald-400/20 hover:to-emerald-300/20 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-4xl font-black text-emerald-700 tracking-tight">{totalStats.running}</p>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Active Now</p>
                </div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full animate-ping" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-400/10 via-white/60 to-blue-300/10 backdrop-blur-xl hover:from-blue-400/20 hover:to-blue-300/20 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-4xl font-black text-blue-700 tracking-tight">{totalStats.completed}</p>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Completed</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-400/10 via-white/60 to-purple-300/10 backdrop-blur-xl hover:from-purple-400/20 hover:to-purple-300/20 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-4xl font-black text-purple-700 tracking-tight">{totalStats.draft}</p>
                  <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">In Draft</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revolutionary Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500 h-6 w-6 z-10" />
                    <Input
                      placeholder="Search by campaign name, keywords, or status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-16 pr-6 h-16 text-lg font-medium border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl placeholder:text-slate-400 focus:bg-white focus:shadow-2xl transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      aria-label="Filter campaigns by status"
                      className="appearance-none flex h-16 w-48 rounded-2xl border-0 bg-white/80 backdrop-blur-sm px-6 py-4 text-base font-bold shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white cursor-pointer hover:shadow-2xl"
                    >
                      <option value="all">🎯 All Status</option>
                      <option value="running">▶️ Running</option>
                      <option value="completed">✅ Completed</option>
                      <option value="paused">⏸️ Paused</option>
                      <option value="draft">📝 Draft</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Sort campaigns"
                      className="appearance-none flex h-16 w-52 rounded-2xl border-0 bg-white/80 backdrop-blur-sm px-6 py-4 text-base font-bold shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white cursor-pointer hover:shadow-2xl"
                    >
                      <option value="created">📅 Sort by Date</option>
                      <option value="name">🔤 Sort by Name</option>
                      <option value="recipients">👥 Sort by Size</option>
                      <option value="progress">📈 Sort by Progress</option>
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="h-16 w-16 p-0 border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:bg-white rounded-2xl transition-all duration-300 group"
                  >
                    <span className={`text-2xl font-black transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''} group-hover:scale-110`}>
                      ↓
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next-Generation Campaign Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3"
        >
          {filteredAndSortedCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white/80 backdrop-blur-2xl group-hover:-translate-y-2 group-hover:scale-[1.02]">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-0 relative">
                  {/* Premium Campaign Header */}
                  <div className="p-8 border-b border-slate-100/50">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.includes(campaign.id)}
                            onChange={() => toggleCampaignSelection(campaign.id)}
                            className="w-6 h-6 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                            aria-label={`Select ${campaign.name}`}
                          />
                          <h3 className="text-2xl font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-900 transition-colors duration-300">
                            {campaign.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            🗓️ {new Date(campaign.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                          {getStatusBadge(campaign.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Stats Grid */}
                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-inner border border-slate-200/50 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-500">
                        <div className="absolute top-3 right-3">
                          <div className="w-2 h-2 bg-slate-400 rounded-full" />
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                          {campaign.total_recipients.toLocaleString()}
                        </p>
                        <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Reach</p>
                      </div>
                      
                      <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-inner border border-blue-200/50 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-500">
                        <div className="absolute top-3 right-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                        <p className="text-3xl font-black text-blue-700 mb-2 tracking-tight">
                          {campaign.sent_count.toLocaleString()}
                        </p>
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Messages Sent</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-inner border border-emerald-200/50 group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-500">
                        <div className="absolute top-3 right-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        </div>
                        <p className="text-3xl font-black text-emerald-700 mb-2 tracking-tight">
                          {campaign.delivered_count.toLocaleString()}
                        </p>
                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Delivered</p>
                      </div>
                      
                      <div className="relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-inner border border-purple-200/50 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-500">
                        <div className="absolute top-3 right-3">
                          <div className={`w-2 h-2 rounded-full ${                            campaign.sent_count > 0 ?
                              (campaign.delivered_count / campaign.sent_count) * 100 >= 80 ? 'bg-emerald-500' :
                              (campaign.delivered_count / campaign.sent_count) * 100 >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            : 'bg-slate-400'
                          }`} />
                        </div>
                        <p className={`text-3xl font-black mb-2 tracking-tight ${getPerformanceColor(
                          campaign.sent_count > 0 ? (campaign.delivered_count / campaign.sent_count) * 100 : 0
                        )}`}>
                          {campaign.sent_count > 0 ? Math.round((campaign.delivered_count / campaign.sent_count) * 100) : 0}%
                        </p>
                        <p className="text-sm font-bold text-purple-600 uppercase tracking-wider">Success Rate</p>
                      </div>
                    </div>

                    {/* Advanced Progress Visualization */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-700">Campaign Progress</span>
                        <span className="text-2xl font-black text-slate-900 bg-slate-100 px-4 py-2 rounded-xl">
                          {campaign.total_recipients > 0 ? Math.round((campaign.sent_count / campaign.total_recipients) * 100) : 0}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${campaign.total_recipients > 0 ? (campaign.sent_count / campaign.total_recipients) * 100 : 0}%` 
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                          </motion.div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-lg text-center">
                        📊 {campaign.sent_count.toLocaleString()} of {campaign.total_recipients.toLocaleString()} recipients contacted
                      </p>
                    </div>
                  </div>

                  {/* Premium Action Buttons */}
                  <div className="p-8 pt-0 flex gap-3">
                    <Button asChild variant="outline" className="flex-1 h-12 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 font-bold">
                      <Link href={`/campaigns/${campaign.id}`}>
                        <Eye className="w-5 h-5 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 h-12 border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 font-bold">
                      <Link href={`/campaigns/${campaign.id}/edit`}>
                        <Edit className="w-5 h-5 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredAndSortedCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {searchTerm || statusFilter !== 'all' ? 'No campaigns found' : 'No campaigns yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters to find the campaigns you\'re looking for.'
                  : 'Get started by creating your first voicemail campaign. Reach your customers efficiently with automated voice messages.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link href="/campaigns/new">
                  <Button className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
