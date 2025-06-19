'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { isDemoMode, demoStats, demoCampaigns, demoAnalytics } from '@/lib/demo-data'

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
  
  if (isDemoMode) {
    return demoStats
  }
  
  // In real app, this would be an API call
  const response = await fetch('/api/dashboard/stats')
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

async function fetchRecentCampaigns(): Promise<Campaign[]> {
  await delay(300)
  
  if (isDemoMode) {
    return demoCampaigns.slice(0, 5).map(campaign => ({
      ...campaign,
      script: 'Sample voicemail script content...'
    }))
  }
  
  const response = await fetch('/api/campaigns?recent=true')
  if (!response.ok) throw new Error('Failed to fetch campaigns')
  return response.json()
}

async function fetchAnalytics(): Promise<Analytics> {
  await delay(400)
  
  if (isDemoMode) {
    return demoAnalytics
  }
  
  const response = await fetch('/api/analytics/dashboard')
  if (!response.ok) throw new Error('Failed to fetch analytics')
  return response.json()
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
