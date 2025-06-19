'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { isDemoMode, demoCampaigns } from '@/lib/demo-data'

// Types
interface Campaign {
  id: string
  organization_id: string
  name: string
  status: 'draft' | 'running' | 'completed'
  total_recipients: number
  sent_count: number
  delivered_count: number
  success_count: number
  script: string
  estimated_completion: string
  created_at: string
  updated_at: string
  is_active: boolean
  voice_id: string
  delivery_time_start: string
  delivery_time_end: string
  time_zone: string
}

interface CreateCampaignData {
  name: string
  script: string
  total_recipients?: number
  voice_id?: string
  delivery_time_start?: string
  delivery_time_end?: string
  time_zone?: string
}

interface UpdateCampaignData {
  id: string
  name?: string
  script?: string
  status?: 'draft' | 'running' | 'completed'
  total_recipients?: number
  voice_id?: string
  delivery_time_start?: string
  delivery_time_end?: string
  time_zone?: string
}

// Helper function to add delay for demo purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
async function fetchCampaigns(): Promise<Campaign[]> {
  await delay(300) // Simulate network delay
  
  if (isDemoMode) {
    // Transform demo data to match API structure
    return demoCampaigns.map(campaign => ({
      id: campaign.id,
      organization_id: 'demo-org',
      name: campaign.name,
      status: campaign.status,
      total_recipients: campaign.totalRecipients,
      sent_count: campaign.sentCount,
      delivered_count: campaign.deliveredCount,
      success_count: campaign.successCount,
      script: campaign.script,
      estimated_completion: campaign.estimatedCompletion,
      created_at: campaign.createdAt,
      updated_at: campaign.createdAt,
      is_active: campaign.status === 'running',
      voice_id: 'professional_male',
      delivery_time_start: '10:00',
      delivery_time_end: '18:00',
      time_zone: 'America/New_York'
    }))
  }
  
  const response = await fetch('/api/campaigns', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns')
  }
  
  const data = await response.json()
  return data.campaigns || []
}

async function createCampaign(campaignData: CreateCampaignData): Promise<Campaign> {
  await delay(500)
  
  if (isDemoMode) {
    // Return mock created campaign
    return {
      id: `demo-campaign-${Date.now()}`,
      organization_id: 'demo-org',
      name: campaignData.name,
      status: 'draft',
      total_recipients: campaignData.total_recipients || 0,
      sent_count: 0,
      delivered_count: 0,
      success_count: 0,
      script: campaignData.script,
      estimated_completion: 'Not started',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: false,
      voice_id: campaignData.voice_id || 'professional_male',
      delivery_time_start: campaignData.delivery_time_start || '10:00',
      delivery_time_end: campaignData.delivery_time_end || '18:00',
      time_zone: campaignData.time_zone || 'America/New_York'
    }
  }
  
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create campaign')
  }
  
  const data = await response.json()
  return data.campaign
}

async function updateCampaign(updateData: UpdateCampaignData): Promise<Campaign> {
  await delay(400)
  
  if (isDemoMode) {
    // Return mock updated campaign
    return {
      id: updateData.id,
      organization_id: 'demo-org',
      name: updateData.name || 'Updated Campaign',
      status: updateData.status || 'draft',
      total_recipients: updateData.total_recipients || 0,
      sent_count: 0,
      delivered_count: 0,
      success_count: 0,
      script: updateData.script || 'Updated script',
      estimated_completion: 'Not started',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: updateData.status === 'running',
      voice_id: updateData.voice_id || 'professional_male',
      delivery_time_start: updateData.delivery_time_start || '10:00',
      delivery_time_end: updateData.delivery_time_end || '18:00',
      time_zone: updateData.time_zone || 'America/New_York'
    }
  }
  
  const response = await fetch('/api/campaigns', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update campaign')
  }
  
  const data = await response.json()
  return data.campaign
}

async function deleteCampaign(campaignId: string): Promise<void> {
  await delay(300)
  
  if (isDemoMode) {
    return // Mock deletion
  }
  
  const response = await fetch(`/api/campaigns?id=${campaignId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete campaign')
  }
}

interface ProcessResult {
  success: boolean
  processed: number
  successful: number
  failed: number
  results: Array<{
    customerId: string
    phoneNumber: string
    status: 'delivered' | 'failed'
  }>
}

async function processCampaign(campaignId: string): Promise<ProcessResult> {
  await delay(1000)
  
  if (isDemoMode) {
    // Return mock processing results
    return {
      success: true,
      processed: 50,
      successful: 45,
      failed: 5,
      results: Array.from({ length: 50 }, (_, i) => ({
        customerId: `demo-customer-${i + 1}`,
        phoneNumber: `555-000-${String(i + 1).padStart(4, '0')}`,
        status: Math.random() > 0.1 ? 'delivered' : 'failed'
      }))
    }
  }
  
  const response = await fetch('/api/campaigns/process', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ campaignId }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to process campaign')
  }
  
  return response.json()
}

// Hook
export function useCampaigns() {
  const [refreshKey, setRefreshKey] = useState(0)
  const queryClient = useQueryClient()
  
  const campaignsQuery = useQuery({
    queryKey: ['campaigns', refreshKey],
    queryFn: fetchCampaigns,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const processMutation = useMutation({
    mutationFn: processCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return {
    // Data
    campaigns: campaignsQuery.data || [],
    
    // Loading states
    isLoading: campaignsQuery.isLoading,
    isError: campaignsQuery.isError,
    error: campaignsQuery.error,
    
    // Mutations
    createCampaign: createMutation.mutateAsync,
    updateCampaign: updateMutation.mutateAsync,
    deleteCampaign: deleteMutation.mutateAsync,
    processCampaign: processMutation.mutateAsync,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isProcessing: processMutation.isPending,
    
    // Utils
    refresh,
  }
}

export type { Campaign, CreateCampaignData, UpdateCampaignData }
