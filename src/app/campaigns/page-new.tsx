'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Phone, Plus, Play, Check, Search,
  Clock, Edit, Eye, Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCampaigns } from '@/hooks/use-campaigns'
import { AdvancedNavigation } from '@/components/advanced-navigation'

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const { campaigns, isLoading, isError, error } = useCampaigns()

  // Enhanced filtering and sorting
  const filteredAndSortedCampaigns = useMemo(() => {
    const filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return filtered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [campaigns, searchTerm, statusFilter])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                📞 Voicemail Campaigns
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage and monitor your voicemail drop campaigns
              </p>
            </div>
            <Link href="/campaigns/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-2 border-white/10">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Simple Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 border-2 border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/60 border-2 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/60 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Simplified Campaign Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredAndSortedCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 border-2 border-white/30 shadow-lg hover:scale-[1.02]">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusBadge(campaign.status)}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Recipients</span>
                      <span className="font-bold text-lg text-slate-900 dark:text-white">
                        {campaign.total_recipients.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Delivered</span>
                      <span className="font-bold text-lg text-slate-900 dark:text-white">
                        {campaign.delivered_count.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Progress</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {campaign.total_recipients > 0 ? Math.round((campaign.sent_count / campaign.total_recipients) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 border border-slate-300 dark:border-slate-600">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full h-3 transition-all duration-500"
                          style={{
                            width: `${campaign.total_recipients > 0 ? (campaign.sent_count / campaign.total_recipients) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-700/50 rounded border border-slate-200 dark:border-slate-600">
                      📅 Created {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                    <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-2 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/campaigns/${campaign.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-2 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
            <div className="text-6xl mb-4">📞</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first voicemail campaign to get started'
              }
            </p>
            <Link href="/campaigns/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
