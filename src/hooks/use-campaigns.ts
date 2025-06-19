'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { isDemoMode, demoCampaigns } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'

// Types
interface Campaign {
  id: string
  organization_id: string
  name: string
  status: 'draft' | 'running' | 'completed'
  total_recipients: number
  sent_count: number
  delivered_count: number
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
  
  if (isDemoMode || !supabase) {
    // Transform demo data to match API structure
    return demoCampaigns.map(campaign => ({
      id: campaign.id,
      organization_id: 'demo-org',
      name: campaign.name,
      status: campaign.status,
      total_recipients: campaign.totalRecipients,
      sent_count: campaign.sentCount,
      delivered_count: campaign.deliveredCount,
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
  
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    throw new Error('Failed to fetch campaigns')
  }
}

async function createCampaign(campaignData: CreateCampaignData): Promise<Campaign> {
  await delay(500)
  
  if (isDemoMode || !supabase) {
    // Return mock created campaign
    return {
      id: `demo-campaign-${Date.now()}`,
      organization_id: 'demo-org',
      name: campaignData.name,
      status: 'draft',
      total_recipients: campaignData.total_recipients || 0,
      sent_count: 0,
      delivered_count: 0,
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

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        name: campaignData.name,
        script: campaignData.script,
        total_recipients: campaignData.total_recipients || 0,
        sent_count: 0,
        delivered_count: 0,
        status: 'draft',
        voice_id: campaignData.voice_id || 'professional_male',
        delivery_time_start: campaignData.delivery_time_start || '10:00',
        delivery_time_end: campaignData.delivery_time_end || '18:00',
        time_zone: campaignData.time_zone || 'America/New_York',
        estimated_completion: 'Not started',
        is_active: false
      }])
      .select()
      .single()

    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating campaign:', error)
    throw new Error('Failed to create campaign')
  }
}

async function updateCampaign(updateData: UpdateCampaignData): Promise<Campaign> {
  await delay(400)
  
  if (isDemoMode || !supabase) {
    // Return mock updated campaign
    return {
      id: updateData.id,
      organization_id: 'demo-org',
      name: updateData.name || 'Updated Campaign',
      status: updateData.status || 'draft',
      total_recipients: updateData.total_recipients || 0,
      sent_count: 0,
      delivered_count: 0,
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

  try {
    const { id, ...updates } = updateData
    
    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        is_active: updates.status === 'running'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error updating campaign:', error)
    throw new Error('Failed to update campaign')
  }
}

async function deleteCampaign(campaignId: string): Promise<void> {
  await delay(300)
  
  if (isDemoMode || !supabase) {
    return // Mock deletion
  }
  
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting campaign:', error)
    throw new Error('Failed to delete campaign')
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
  
  if (isDemoMode || !supabase) {
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

  // For production, this would integrate with Twilio or similar service
  // For now, return mock data but update campaign status
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ 
        status: 'running',
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    if (error) throw error

    // Mock results for demo
    return {
      success: true,
      processed: 50,
      successful: 45,
      failed: 5,
      results: Array.from({ length: 50 }, (_, i) => ({
        customerId: `customer-${i + 1}`,
        phoneNumber: `555-000-${String(i + 1).padStart(4, '0')}`,
        status: Math.random() > 0.1 ? 'delivered' : 'failed'
      }))
    }
  } catch (error) {
    console.error('Error processing campaign:', error)
    throw new Error('Failed to process campaign')
  }
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
