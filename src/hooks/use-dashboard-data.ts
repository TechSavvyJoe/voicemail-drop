'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { isDemoMode, demoStats, demoCampaigns, demoAnalytics } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalCustomers: number
  totalCampaigns: number
  voicemailsSent: number
  successRate: number
  monthlyUsage: number
  monthlyLimit: number
  activeCampaigns: number
}

interface Campaign {
  id: string
  name: string
  status: 'running' | 'completed' | 'draft'
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  createdAt: string
  scheduledAt?: string
  script?: string
}

interface Analytics {
  campaignPerformance: Array<{
  name: string
  sent: number
  delivered: number
  }>
  deliveryByTimeOfDay: Array<{
    hour: string
    deliveries: number
  }>
  monthlyTrends: Array<{
    month: string
    campaigns: number
    delivered: number
    successRate: number
  }>
}

// Simulate API calls with realistic delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(500) // Simulate network delay
  
  if (isDemoMode || !supabase) {
    return demoStats
  }
  
  try {
    // Fetch stats from Supabase
    const [campaignsResult, customersResult] = await Promise.all([
      supabase.from('campaigns').select('id, status, sent_count, delivered_count'),
      supabase.from('customers').select('id')
    ])

    if (campaignsResult.error) throw campaignsResult.error
    if (customersResult.error) throw customersResult.error

    const campaigns = campaignsResult.data || []
    const customers = customersResult.data || []

    const totalVoicemails = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0)
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0)
    const activeCampaigns = campaigns.filter(c => c.status === 'running').length

    return {
      totalCustomers: customers.length,
      totalCampaigns: campaigns.length,
      voicemailsSent: totalVoicemails,
      successRate: totalVoicemails > 0 ? Math.round((totalDelivered / totalVoicemails) * 100) : 0,
      monthlyUsage: totalVoicemails,
      monthlyLimit: 10000, // Default limit
      activeCampaigns
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return demoStats // Fallback to demo data
  }
}

async function fetchRecentCampaigns(): Promise<Campaign[]> {
  await delay(300)
  
  if (isDemoMode || !supabase) {
    return demoCampaigns.slice(0, 5).map(campaign => ({
      ...campaign,
      script: 'Sample voicemail script content...'
    }))
  }
  
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    return (data || []).map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      totalRecipients: campaign.total_recipients,
      sentCount: campaign.sent_count,
      deliveredCount: campaign.delivered_count,
      createdAt: campaign.created_at,
      script: campaign.script
    }))
  } catch (error) {
    console.error('Error fetching recent campaigns:', error)
    return demoCampaigns.slice(0, 5) // Fallback to demo data
  }
}

async function fetchAnalytics(): Promise<Analytics> {
  await delay(400)
  
  if (isDemoMode || !supabase) {
    return demoAnalytics
  }
  
  try {
    // For now, return demo analytics as the analytics would require more complex queries
    // In production, this would involve aggregation queries on campaign data
    return demoAnalytics
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return demoAnalytics // Fallback to demo data
  }
}

export function useDashboardData() {
  const [refreshKey, setRefreshKey] = useState(0)
  
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats', refreshKey],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  const campaignsQuery = useQuery({
    queryKey: ['dashboard', 'campaigns', refreshKey],
    queryFn: fetchRecentCampaigns,
    staleTime: 1000 * 60 * 1, // 1 minute
  })

  const analyticsQuery = useQuery({
    queryKey: ['dashboard', 'analytics', refreshKey],
    queryFn: fetchAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return {
    stats: statsQuery.data,
    campaigns: campaignsQuery.data,
    analytics: analyticsQuery.data,
    isLoading: statsQuery.isLoading || campaignsQuery.isLoading || analyticsQuery.isLoading,
    isError: statsQuery.isError || campaignsQuery.isError || analyticsQuery.isError,
    error: statsQuery.error || campaignsQuery.error || analyticsQuery.error,
    refresh,
  }
}

export function useRealTimeUpdates() {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!isDemoMode) return

    // Simulate real-time updates in demo mode
    const interval = setInterval(() => {
      // Randomly update some stats
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [queryClient])
}
