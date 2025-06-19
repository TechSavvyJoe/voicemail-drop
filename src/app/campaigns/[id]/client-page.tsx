'use client'

import { useState, useEffect } from 'react'
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

interface CampaignDetailClientProps {
  id: string
}

export default function CampaignDetailClient({ id }: CampaignDetailClientProps) {
  const campaignId = id
  
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/60 rounded-2xl w-1/3 mb-8 backdrop-blur-sm"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <MessageSquare className="mx-auto h-16 w-16" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
              <p className="text-gray-600 mb-6">The campaign you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/campaigns">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaigns
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'running':
        return { color: 'bg-green-100 text-green-800 border border-green-200', label: 'Running' }
      case 'completed':
        return { color: 'bg-blue-100 text-blue-800 border border-blue-200', label: 'Completed' }
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800 border border-gray-200', label: 'Draft' }
      default:
        return { color: 'bg-gray-100 text-gray-800 border border-gray-200', label: 'Unknown' }
    }
  }

  const statusConfig = getStatusConfig(campaign.status)
  const progress = (campaign.sentCount / campaign.totalRecipients) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <AdvancedNavigation />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/campaigns">
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <p className="text-gray-600 mt-1">Campaign Details</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/campaigns/${campaign.id}/edit`}>
              <Button 
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button 
              className={`text-white shadow-lg ${
                campaign.status === 'running' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {campaign.status === 'running' ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Campaign
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Campaign
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Status Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={`${statusConfig.color} px-4 py-2 font-bold text-sm rounded-full border-0`}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Recipients</p>
                  <p className="text-lg font-bold text-gray-900">{campaign.totalRecipients.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Sent</p>
                  <p className="text-lg font-bold text-gray-900">{campaign.sentCount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <span>Campaign Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-sm font-medium text-gray-600">Sent</p>
                      <p className="text-2xl font-bold text-green-600">{campaign.sentCount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-sm font-medium text-gray-600">Remaining</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {(campaign.totalRecipients - campaign.sentCount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-slate-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">Estimated Completion</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.status === 'running' ? '2-3 hours' : campaign.estimatedCompletion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voicemail Script */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span>Voicemail Script</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-gray-800 leading-relaxed">
                      {campaign.script || 'No script provided for this campaign.'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Script Length: ~{campaign.script ? Math.ceil(campaign.script.length / 8) : 0} seconds</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Script
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Campaign Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span>Campaign Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Phone className="mx-auto h-12 w-12 text-blue-600 mb-3" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-1">
                    {campaign.sentCount.toLocaleString()}
                  </h3>
                  <p className="text-blue-700 font-medium">Voicemails Delivered</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <TrendingUp className="mx-auto h-12 w-12 text-green-600 mb-3" />
                  <h3 className="text-2xl font-bold text-green-900 mb-1">
                    {Math.round(progress)}%
                  </h3>
                  <p className="text-green-700 font-medium">Completion Rate</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <Clock className="mx-auto h-12 w-12 text-purple-600 mb-3" />
                  <h3 className="text-2xl font-bold text-purple-900 mb-1">
                    {campaign.status === 'running' ? 'Running' : campaign.status === 'completed' ? 'Completed' : 'Draft'}
                  </h3>
                  <p className="text-purple-700 font-medium">Current Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
