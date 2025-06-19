'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Phone, Plus, Play, Check, Search, Filter,
  Clock, Edit, Eye, Loader2, Users, 
  BarChart3, AlertCircle, X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useCampaigns } from '@/hooks/use-campaigns'
import { FunctionalNavigation } from '@/components/functional-navigation'

const statusConfig = {
  running: { 
    label: 'Running', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Play
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Check
  },
  draft: { 
    label: 'Draft', 
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Edit
  }
}

export default function SimplifiedCampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
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

  const stats = useMemo(() => {
    const total = campaigns.length
    const running = campaigns.filter(c => c.status === 'running').length
    const completed = campaigns.filter(c => c.status === 'completed').length
    const totalSent = campaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0)
    
    return { total, running, completed, totalSent }
  }, [campaigns])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <FunctionalNavigation />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading campaigns...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <FunctionalNavigation />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Error Loading Campaigns
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {error?.message || 'Something went wrong. Please try again.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <FunctionalNavigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Voicemail Campaigns
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Manage and monitor your voicemail drop campaigns
              </p>
            </div>
            <Link href="/campaigns/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Campaigns</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.running}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sent</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalSent.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search campaigns by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Status:</span>
                    {['all', 'running', 'completed', 'draft'].map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                      >
                        {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig]?.label || status}
                      </Button>
                    ))}
                    {statusFilter !== 'all' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaigns List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredAndSortedCampaigns.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <Phone className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No campaigns found' : 'No campaigns yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first voicemail campaign to get started'
                  }
                </p>
                {(!searchTerm && statusFilter === 'all') && (
                  <Link href="/campaigns/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedCampaigns.map((campaign, index) => {
                const status = statusConfig[campaign.status as keyof typeof statusConfig]
                const StatusIcon = status?.icon || Phone
                const progressPercent = campaign.total_recipients > 0 
                  ? (campaign.delivered_count / campaign.total_recipients) * 100 
                  : 0

                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                                  {campaign.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <Badge className={`${status?.color} border`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {status?.label}
                                  </Badge>
                                  <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Created {new Date(campaign.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-400">Recipients:</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {campaign.total_recipients?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <BarChart3 className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-400">Delivered:</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {campaign.delivered_count?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-400">Success Rate:</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {progressPercent.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {campaign.total_recipients > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  <span>Campaign Progress</span>
                                  <span>{progressPercent.toFixed(1)}% Complete</span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                              </div>
                            )}

                            {/* Script preview if available */}
                            {campaign.script && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {campaign.script.substring(0, 100)}...
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <Link href={`/campaigns/${campaign.id}`}>
                              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/campaigns/${campaign.id}/edit`}>
                              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Results Summary */}
        {filteredAndSortedCampaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredAndSortedCampaigns.length} of {campaigns.length} campaigns
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="link"
                  className="ml-2 p-0 h-auto text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
