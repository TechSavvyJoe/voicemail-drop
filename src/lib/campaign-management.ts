import { supabase } from './supabase'

export interface CampaignTemplate {
  id: string
  name: string
  category: string
  message: string
  industry: string
  targetAudience: string
  estimatedDuration: number
  successRate: number
  tags: string[]
  createdAt: string
  variables: {
    name: string
    type: 'text' | 'number' | 'boolean'
    defaultValue?: string
    description: string
  }[]
}

export interface ABTestCampaign {
  id: string
  name: string
  organizationId: string
  variantA: {
    name: string
    message: string
    percentage: number
    sent: number
    delivered: number
    responses: number
  }
  variantB: {
    name: string
    message: string
    percentage: number
    sent: number
    delivered: number
    responses: number
  }
  status: 'draft' | 'running' | 'completed'
  startDate: string
  endDate?: string
  winningVariant?: 'A' | 'B'
  confidence: number
  createdAt: string
}

export interface ScheduledCampaign {
  id: string
  name: string
  organizationId: string
  message: string
  targetList: string[]
  scheduledFor: string
  timezone: string
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: string
  }
  status: 'scheduled' | 'running' | 'completed' | 'cancelled'
  createdAt: string
}

export class CampaignManagementService {
  
  // Predefined message templates for automotive industry
  static getDefaultTemplates(): CampaignTemplate[] {
    return [
      {
        id: 'auto-trade-in',
        name: 'Trade-In Opportunity',
        category: 'Sales',
        message: 'Hi {firstName}, this is {salesRep} from {dealership}. Your {currentVehicle} may qualify for our new trade-in program. We\'re offering top dollar for vehicles like yours. Give me a call at {phoneNumber} to get your instant quote.',
        industry: 'Automotive',
        targetAudience: 'Existing customers with trade-in potential',
        estimatedDuration: 25,
        successRate: 18.5,
        tags: ['trade-in', 'sales', 'existing-customer'],
        createdAt: new Date().toISOString(),
        variables: [
          { name: 'firstName', type: 'text', description: 'Customer first name' },
          { name: 'salesRep', type: 'text', description: 'Sales representative name' },
          { name: 'dealership', type: 'text', description: 'Dealership name' },
          { name: 'currentVehicle', type: 'text', description: 'Customer current vehicle' },
          { name: 'phoneNumber', type: 'text', description: 'Dealership phone number' }
        ]
      },
      {
        id: 'service-reminder',
        name: 'Service Reminder',
        category: 'Service',
        message: 'Hi {firstName}, it\'s time for your {vehicleYear} {vehicleMake} {vehicleModel}\'s {serviceType} service. We have special pricing this month. Call {serviceNumber} to schedule your appointment at {dealership}.',
        industry: 'Automotive',
        targetAudience: 'Service customers',
        estimatedDuration: 20,
        successRate: 22.3,
        tags: ['service', 'maintenance', 'reminder'],
        createdAt: new Date().toISOString(),
        variables: [
          { name: 'firstName', type: 'text', description: 'Customer first name' },
          { name: 'vehicleYear', type: 'number', description: 'Vehicle year' },
          { name: 'vehicleMake', type: 'text', description: 'Vehicle make' },
          { name: 'vehicleModel', type: 'text', description: 'Vehicle model' },
          { name: 'serviceType', type: 'text', description: 'Type of service needed' },
          { name: 'serviceNumber', type: 'text', description: 'Service department phone' },
          { name: 'dealership', type: 'text', description: 'Dealership name' }
        ]
      },
      {
        id: 'new-arrival',
        name: 'New Vehicle Arrival',
        category: 'Sales',
        message: 'Hi {firstName}, great news! The {vehicleYear} {vehicleMake} {vehicleModel} you inquired about has arrived at {dealership}. This exact model in {color} is available for a test drive. Call {salesNumber} to schedule your appointment.',
        industry: 'Automotive',
        targetAudience: 'Prospective buyers with specific vehicle interest',
        estimatedDuration: 23,
        successRate: 24.7,
        tags: ['new-arrival', 'sales', 'inventory'],
        createdAt: new Date().toISOString(),
        variables: [
          { name: 'firstName', type: 'text', description: 'Customer first name' },
          { name: 'vehicleYear', type: 'number', description: 'Vehicle year' },
          { name: 'vehicleMake', type: 'text', description: 'Vehicle make' },
          { name: 'vehicleModel', type: 'text', description: 'Vehicle model' },
          { name: 'color', type: 'text', description: 'Vehicle color' },
          { name: 'dealership', type: 'text', description: 'Dealership name' },
          { name: 'salesNumber', type: 'text', description: 'Sales department phone' }
        ]
      },
      {
        id: 'financing-approval',
        name: 'Financing Pre-Approval',
        category: 'Finance',
        message: 'Hi {firstName}, you\'ve been pre-approved for financing up to ${approvalAmount} at {dealership}. Your rate starts at {apr}% APR. This pre-approval expires in {validDays} days. Call {financeNumber} to secure your vehicle today.',
        industry: 'Automotive',
        targetAudience: 'Credit-approved prospects',
        estimatedDuration: 26,
        successRate: 31.2,
        tags: ['financing', 'pre-approval', 'credit'],
        createdAt: new Date().toISOString(),
        variables: [
          { name: 'firstName', type: 'text', description: 'Customer first name' },
          { name: 'approvalAmount', type: 'number', description: 'Approved financing amount' },
          { name: 'dealership', type: 'text', description: 'Dealership name' },
          { name: 'apr', type: 'number', description: 'Annual percentage rate' },
          { name: 'validDays', type: 'number', description: 'Days until approval expires' },
          { name: 'financeNumber', type: 'text', description: 'Finance department phone' }
        ]
      },
      {
        id: 'recall-notification',
        name: 'Recall Notification',
        category: 'Service',
        message: 'Important notice for {firstName}: Your {vehicleYear} {vehicleMake} {vehicleModel} has an open safety recall. We\'ll fix this at no charge. Call {serviceNumber} to schedule your free recall service at {dealership}.',
        industry: 'Automotive',
        targetAudience: 'Owners of recalled vehicles',
        estimatedDuration: 22,
        successRate: 45.8,
        tags: ['recall', 'safety', 'service'],
        createdAt: new Date().toISOString(),
        variables: [
          { name: 'firstName', type: 'text', description: 'Customer first name' },
          { name: 'vehicleYear', type: 'number', description: 'Vehicle year' },
          { name: 'vehicleMake', type: 'text', description: 'Vehicle make' },
          { name: 'vehicleModel', type: 'text', description: 'Vehicle model' },
          { name: 'serviceNumber', type: 'text', description: 'Service department phone' },
          { name: 'dealership', type: 'text', description: 'Dealership name' }
        ]
      },
      {
        id: 'loyalty-rewards',
        name: 'Loyalty Rewards',
        category: 'Customer Retention',
        message: 'Hi {firstName}, thank you for being a valued customer at {dealership}. You\'ve earned {rewardPoints} loyalty points worth ${rewardValue} toward your next service or purchase. Call {loyaltyNumber} to redeem your rewards.',
        industry: 'Automotive',
        targetAudience: 'Loyalty program members',
        estimatedDuration: 24,
        successRate: 19.4,
        tags: ['loyalty', 'rewards', 'retention'],
        createdAt: new Date().toISOString(),
        variables: [
          { name: 'firstName', type: 'text', description: 'Customer first name' },
          { name: 'dealership', type: 'text', description: 'Dealership name' },
          { name: 'rewardPoints', type: 'number', description: 'Number of reward points' },
          { name: 'rewardValue', type: 'number', description: 'Dollar value of rewards' },
          { name: 'loyaltyNumber', type: 'text', description: 'Loyalty department phone' }
        ]
      }
    ]
  }

  static async getTemplates(organizationId?: string): Promise<CampaignTemplate[]> {
    const defaultTemplates = this.getDefaultTemplates()
    
    if (!supabase || !organizationId) {
      return defaultTemplates
    }

    try {
      const { data: customTemplates, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('organization_id', organizationId)

      if (error) {
        console.error('Error fetching custom templates:', error)
        return defaultTemplates
      }

      return [...defaultTemplates, ...(customTemplates || [])]
    } catch (error) {
      console.error('Template fetch error:', error)
      return defaultTemplates
    }
  }

  static async createCustomTemplate(organizationId: string, template: Omit<CampaignTemplate, 'id' | 'createdAt'>): Promise<CampaignTemplate | null> {
    if (!supabase) return null

    try {
      const newTemplate = {
        ...template,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        organization_id: organizationId,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('campaign_templates')
        .insert(newTemplate)
        .select()
        .single()

      if (error) throw error

      return {
        ...data,
        createdAt: data.created_at
      } as CampaignTemplate
    } catch (error) {
      console.error('Create template error:', error)
      return null
    }
  }

  static populateTemplate(template: CampaignTemplate, variables: Record<string, string | number | boolean>): string {
    let populatedMessage = template.message

    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || ''
      const placeholder = `{${variable.name}}`
      populatedMessage = populatedMessage.replace(new RegExp(placeholder, 'g'), String(value))
    })

    return populatedMessage
  }

  static async createABTest(organizationId: string, testConfig: {
    name: string
    variantA: { name: string; message: string }
    variantB: { name: string; message: string }
    splitPercentage?: number
  }): Promise<ABTestCampaign | null> {
    if (!supabase) return null

    try {
      const splitPercentage = testConfig.splitPercentage || 50

      const abTest: ABTestCampaign = {
        id: `ab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: testConfig.name,
        organizationId,
        variantA: {
          ...testConfig.variantA,
          percentage: splitPercentage,
          sent: 0,
          delivered: 0,
          responses: 0
        },
        variantB: {
          ...testConfig.variantB,
          percentage: 100 - splitPercentage,
          sent: 0,
          delivered: 0,
          responses: 0
        },
        status: 'draft',
        startDate: new Date().toISOString(),
        confidence: 0,
        createdAt: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('ab_test_campaigns')
        .insert(abTest)
        .select()
        .single()

      if (error) throw error

      return data as ABTestCampaign
    } catch (error) {
      console.error('Create A/B test error:', error)
      return null
    }
  }

  static async updateABTestResults(testId: string, variant: 'A' | 'B', metrics: {
    sent?: number
    delivered?: number
    responses?: number
  }): Promise<boolean> {
    if (!supabase) return false

    try {
      const variantField = variant === 'A' ? 'variant_a' : 'variant_b'
      
      const { data: currentTest } = await supabase
        .from('ab_test_campaigns')
        .select(variantField)
        .eq('id', testId)
        .single()

      if (!currentTest) return false

      const currentVariant = currentTest[variantField as keyof typeof currentTest] as Record<string, unknown> || {}
      const updatedVariant = {
        ...currentVariant,
        ...metrics
      }

      const { error } = await supabase
        .from('ab_test_campaigns')
        .update({ [variantField]: updatedVariant })
        .eq('id', testId)

      if (error) throw error

      // Calculate statistical significance
      await this.calculateABTestSignificance(testId)

      return true
    } catch (error) {
      console.error('Update A/B test error:', error)
      return false
    }
  }

  static async calculateABTestSignificance(testId: string): Promise<void> {
    if (!supabase) return

    try {
      const { data: test } = await supabase
        .from('ab_test_campaigns')
        .select('*')
        .eq('id', testId)
        .single()

      if (!test) return

      const { variant_a: variantA, variant_b: variantB } = test

      // Calculate conversion rates
      const conversionA = variantA.delivered > 0 ? variantA.responses / variantA.delivered : 0
      const conversionB = variantB.delivered > 0 ? variantB.responses / variantB.delivered : 0

      // Simple statistical significance calculation (Chi-square test approximation)
      const totalA = variantA.delivered
      const totalB = variantB.delivered
      const successA = variantA.responses
      const successB = variantB.responses

      if (totalA < 30 || totalB < 30) {
        // Not enough data for significance
        return
      }

      const pooledConversion = (successA + successB) / (totalA + totalB)
      const standardError = Math.sqrt(pooledConversion * (1 - pooledConversion) * (1/totalA + 1/totalB))
      const zScore = Math.abs(conversionA - conversionB) / standardError
      
      // Calculate confidence level (simplified)
      let confidence = 0
      if (zScore >= 1.96) confidence = 95
      else if (zScore >= 1.645) confidence = 90
      else if (zScore >= 1.282) confidence = 80

      // Determine winning variant
      let winningVariant: 'A' | 'B' | undefined
      if (confidence >= 95) {
        winningVariant = conversionA > conversionB ? 'A' : 'B'
      }

      // Update test with results
      await supabase
        .from('ab_test_campaigns')
        .update({
          confidence,
          winning_variant: winningVariant,
          status: confidence >= 95 ? 'completed' : 'running'
        })
        .eq('id', testId)

    } catch (error) {
      console.error('Calculate A/B significance error:', error)
    }
  }

  static async scheduleRecurringCampaign(organizationId: string, campaign: {
    name: string
    message: string
    targetList: string[]
    scheduledFor: string
    timezone: string
    recurringPattern?: {
      type: 'daily' | 'weekly' | 'monthly'
      interval: number
      endDate?: string
    }
  }): Promise<ScheduledCampaign | null> {
    if (!supabase) return null

    try {
      const scheduledCampaign: ScheduledCampaign = {
        id: `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        organizationId,
        ...campaign,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('scheduled_campaigns')
        .insert(scheduledCampaign)
        .select()
        .single()

      if (error) throw error

      return data as ScheduledCampaign
    } catch (error) {
      console.error('Schedule campaign error:', error)
      return null
    }
  }

  static async getScheduledCampaigns(organizationId: string): Promise<ScheduledCampaign[]> {
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('scheduled_campaigns')
        .select('*')
        .eq('organization_id', organizationId)
        .order('scheduled_for', { ascending: true })

      if (error) throw error

      return data as ScheduledCampaign[]
    } catch (error) {
      console.error('Get scheduled campaigns error:', error)
      return []
    }
  }

  static async getABTests(organizationId: string): Promise<ABTestCampaign[]> {
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('ab_test_campaigns')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data as ABTestCampaign[]
    } catch (error) {
      console.error('Get A/B tests error:', error)
      return []
    }
  }

  static async processScheduledCampaigns(): Promise<void> {
    if (!supabase) return

    try {
      const now = new Date().toISOString()
      
      const { data: dueCampaigns, error } = await supabase
        .from('scheduled_campaigns')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_for', now)

      if (error) throw error

      for (const campaign of dueCampaigns || []) {
        try {
          // Mark as running
          await supabase
            .from('scheduled_campaigns')
            .update({ status: 'running' })
            .eq('id', campaign.id)

          // Execute campaign (this would integrate with your voicemail sending logic)
          // await VoicemailService.sendBulkVoicemails(campaign.target_list, campaign.message, campaign.id)

          // Schedule next occurrence if recurring
          if (campaign.recurring_pattern) {
            await this.scheduleNextRecurrence(campaign)
          }

          // Mark as completed
          await supabase
            .from('scheduled_campaigns')
            .update({ status: 'completed' })
            .eq('id', campaign.id)

        } catch (campaignError) {
          console.error(`Error processing campaign ${campaign.id}:`, campaignError)
          
          await supabase
            .from('scheduled_campaigns')
            .update({ status: 'cancelled' })
            .eq('id', campaign.id)
        }
      }
    } catch (error) {
      console.error('Process scheduled campaigns error:', error)
    }
  }

  private static async scheduleNextRecurrence(campaign: ScheduledCampaign): Promise<void> {
    if (!campaign.recurringPattern || !supabase) return

    const { type, interval, endDate } = campaign.recurringPattern
    const nextDate = new Date(campaign.scheduledFor)

    switch (type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + interval)
        break
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (interval * 7))
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + interval)
        break
    }

    // Check if we've reached the end date
    if (endDate && nextDate > new Date(endDate)) {
      return
    }

    // Create next occurrence
    const nextCampaign = {
      ...campaign,
      id: `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scheduledFor: nextDate.toISOString(),
      status: 'scheduled' as const,
      createdAt: new Date().toISOString()
    }

    await supabase
      .from('scheduled_campaigns')
      .insert(nextCampaign)
  }
}
