'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Play, Pause, Phone, Clock, Users, 
  TrendingUp, Download, Edit, BarChart3,
  MessageSquare, Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { isDemoMode, demoCampaigns } from '@/lib/demo-data'
import { AdvancedNavigation } from '@/components/advanced-navigation'

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  
  const [campaign, setCampaign] = useState<typeof demoCampaigns[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In demo mode, find the campaign by ID
    if (isDemoMode) {
      const foundCampaign = demoCampaigns.find(c => c.id === campaignId)
      setCampaign(foundCampaign || null)
    }
    setLoading(false)
  }, [campaignId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AdvancedNavigation />
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AdvancedNavigation />
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
            <p className="text-gray-600 mb-6">The campaign you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/campaigns">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      running: { label: 'Active', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' },
      paused: { label: 'Paused', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' },
      completed: { label: 'Completed', color: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' },
      draft: { label: 'Draft', color: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <Badge className={`${config.color} px-4 py-2 font-bold text-sm rounded-full border-0`}>
        {config.label}
      </Badge>
    )
  }

  const deliveryRate = campaign.totalRecipients > 0 ? (campaign.sentCount / campaign.totalRecipients) * 100 : 0
  const successRate = campaign.sentCount > 0 ? (campaign.successCount / campaign.sentCount) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <AdvancedNavigation />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <Link href="/campaigns">
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-3 bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text">{campaign.name}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    {getStatusBadge(campaign.status)}
                    <span className="text-sm text-slate-600 font-medium">
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Link href={`/campaigns/${campaign.id}/edit`}>
                  <Button variant="outline" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Campaign
                  </Button>
                </Link>
                {campaign.status === 'running' ? (
                  <Button variant="outline" className="backdrop-blur-sm bg-red-50/70 border-red-200/50 hover:bg-red-100/70 text-red-700 transition-all duration-300">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Campaign
                  </Button>
                ) : (
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300">
                    <Play className="h-4 w-4 mr-2" />
                    Resume Campaign
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Total Recipients</CardTitle>
              <div className="p-2 bg-blue-100/60 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{campaign.totalRecipients.toLocaleString()}</div>
              <div className="text-sm text-slate-600 font-medium mt-1">people targeted</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Delivered</CardTitle>
              <div className="p-2 bg-green-100/60 rounded-xl">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{campaign.sentCount.toLocaleString()}</div>
              <div className="text-sm text-slate-600 font-medium mt-1">
                {deliveryRate.toFixed(1)}% delivery rate
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Success Rate</CardTitle>
              <div className="p-2 bg-purple-100/60 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-slate-600 font-medium mt-1">
                {campaign.successCount} successful deliveries
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Est. Completion</CardTitle>
              <div className="p-2 bg-orange-100/60 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">
                {campaign.estimatedCompletion || '2 days'}
              </div>
              <div className="text-sm text-slate-600 font-medium mt-1">remaining</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-blue-100/60 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                Campaign Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-slate-800">Overall Progress</span>
                  <span className="text-2xl font-black text-blue-600">{deliveryRate.toFixed(1)}%</span>
                </div>
                <Progress value={deliveryRate} className="h-4 bg-slate-100 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-slate-700 mb-2">{campaign.totalRecipients - campaign.sentCount}</div>
                  <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Pending</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-green-700 mb-2">{campaign.successCount}</div>
                  <div className="text-sm font-bold text-green-600 uppercase tracking-wide">Delivered</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center p-6 bg-gradient-to-br from-red-50/80 to-rose-50/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-red-700 mb-2">{campaign.sentCount - campaign.successCount}</div>
                  <div className="text-sm font-bold text-red-600 uppercase tracking-wide">Failed</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-green-100/60 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                Voicemail Script
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/40 rounded-2xl border border-white/50">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {campaign.script}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Clock className="h-4 w-4" />
                <span>Estimated duration: 25-30 seconds</span>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-purple-100/60 rounded-xl">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                Campaign Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Delivery Schedule</label>
                  <p className="text-sm text-slate-600 font-medium mt-1">Monday - Friday, 10 AM - 6 PM</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Target Audience</label>
                  <p className="text-sm text-slate-600 font-medium mt-1">All active leads and prospects</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Frequency</label>
                  <p className="text-sm text-slate-600 font-medium mt-1">One-time campaign</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Created By</label>
                  <p className="text-sm text-slate-600 font-medium mt-1">Demo User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
