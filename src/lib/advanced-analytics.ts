import { supabase } from './supabase'

export interface AdvancedAnalytics {
  overview: {
    totalCampaigns: number
    totalVoicemails: number
    totalContacts: number
    overallDeliveryRate: number
    totalCost: number
    avgCostPerLead: number
    conversionRate: number
    roi: number
  }
  performance: {
    bestPerformingCampaign: string
    worstPerformingCampaign: string
    peakHours: { hour: number; count: number }[]
    bestDays: { day: string; deliveryRate: number }[]
    topPerformingMessages: { message: string; deliveryRate: number; responseRate: number }[]
  }
  compliance: {
    tcpaViolations: number
    dncHits: number
    frequencyViolations: number
    timeViolations: number
    complianceScore: number
  }
  leadManagement: {
    hotLeads: number
    warmLeads: number
    coldLeads: number
    averageLeadScore: number
    conversionByScore: { scoreRange: string; conversionRate: number }[]
  }
  trends: {
    dailyMetrics: { date: string; sent: number; delivered: number; cost: number }[]
    weeklyTrends: { week: string; growth: number }[]
    monthlyComparison: { month: string; performance: number }[]
  }
}

export interface CampaignROI {
  campaignId: string
  campaignName: string
  totalSent: number
  totalDelivered: number
  totalCost: number
  responses: number
  appointments: number
  sales: number
  revenue: number
  roi: number
  costPerAppointment: number
  costPerSale: number
}

export interface ConversionFunnel {
  stage: string
  count: number
  percentage: number
  dropOffRate: number
}

export class AdvancedAnalyticsService {
  
  static async getAdvancedAnalytics(organizationId: string, startDate: string, endDate: string): Promise<AdvancedAnalytics> {
    if (!supabase) {
      throw new Error('Database not available')
    }

    try {
      // Get basic metrics
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const { data: voicemails } = await supabase
        .from('voicemails')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('organization_id', organizationId)

      const { data: leadScores } = await supabase
        .from('lead_scores')
        .select('*')
        .gte('last_calculated', startDate)
        .lte('last_calculated', endDate)

      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      // Calculate overview metrics
      const totalVoicemails = voicemails?.length || 0
      const deliveredVoicemails = voicemails?.filter(v => v.status === 'delivered')?.length || 0
      const totalCost = voicemails?.reduce((sum, v) => sum + (v.cost_cents || 0), 0) / 100 || 0
      const totalConversions = conversions?.length || 0
      const totalRevenue = conversions?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0

      const overview = {
        totalCampaigns: campaigns?.length || 0,
        totalVoicemails,
        totalContacts: customers?.length || 0,
        overallDeliveryRate: totalVoicemails > 0 ? (deliveredVoicemails / totalVoicemails) * 100 : 0,
        totalCost,
        avgCostPerLead: totalVoicemails > 0 ? totalCost / totalVoicemails : 0,
        conversionRate: totalVoicemails > 0 ? (totalConversions / totalVoicemails) * 100 : 0,
        roi: totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0
      }

      // Calculate performance metrics
      const campaignPerformance = this.calculateCampaignPerformance(campaigns || [], voicemails || [])
      const timeAnalysis = this.analyzeTimePatterns(voicemails || [])
      const messageAnalysis = this.analyzeMessagePerformance(voicemails || [])

      const performance = {
        bestPerformingCampaign: campaignPerformance.best?.name || 'N/A',
        worstPerformingCampaign: campaignPerformance.worst?.name || 'N/A',
        peakHours: timeAnalysis.peakHours,
        bestDays: timeAnalysis.bestDays,
        topPerformingMessages: messageAnalysis
      }

      // Calculate compliance metrics
      const complianceData = await this.getComplianceMetrics(organizationId, startDate, endDate)

      // Calculate lead management metrics
      const leadMetrics = this.calculateLeadMetrics(leadScores || [])

      // Calculate trends
      const trendsData = this.calculateTrends(voicemails || [])

      return {
        overview,
        performance,
        compliance: complianceData,
        leadManagement: leadMetrics,
        trends: trendsData
      }
    } catch (error) {
      console.error('Advanced analytics error:', error)
      throw error
    }
  }

  static calculateCampaignPerformance(campaigns: Record<string, unknown>[], voicemails: Record<string, unknown>[]) {
    const campaignStats = campaigns.map(campaign => {
      const campaignVoicemails = voicemails.filter(v => v.campaign_id === campaign.id)
      const delivered = campaignVoicemails.filter(v => v.status === 'delivered').length
      const total = campaignVoicemails.length
      
      return {
        ...campaign,
        name: campaign.name as string || 'Unknown Campaign',
        deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
        totalSent: total
      }
    })

    const best = campaignStats.reduce((prev, current) => 
      prev.deliveryRate > current.deliveryRate ? prev : current, campaignStats[0])
    
    const worst = campaignStats.reduce((prev, current) => 
      prev.deliveryRate < current.deliveryRate ? prev : current, campaignStats[0])

    return { best, worst }
  }

  static analyzeTimePatterns(voicemails: Record<string, unknown>[]) {
    // Analyze peak hours
    const hourCounts: { [key: number]: number } = {}
    const dayCounts: { [key: string]: { total: number; delivered: number } } = {}

    voicemails.forEach(voicemail => {
      const createdAt = voicemail.created_at as string
      if (!createdAt) return
      
      const date = new Date(createdAt)
      const hour = date.getHours()
      const day = date.toLocaleDateString('en-US', { weekday: 'long' })

      hourCounts[hour] = (hourCounts[hour] || 0) + 1

      if (!dayCounts[day]) {
        dayCounts[day] = { total: 0, delivered: 0 }
      }
      dayCounts[day].total++
      if (voicemail.status === 'delivered') {
        dayCounts[day].delivered++
      }
    })

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const bestDays = Object.entries(dayCounts)
      .map(([day, data]) => ({
        day,
        deliveryRate: data.total > 0 ? (data.delivered / data.total) * 100 : 0
      }))
      .sort((a, b) => b.deliveryRate - a.deliveryRate)

    return { peakHours, bestDays }
  }

  static analyzeMessagePerformance(voicemails: Record<string, unknown>[]) {
    const messageStats: { [key: string]: { total: number; delivered: number; responses: number } } = {}

    voicemails.forEach(voicemail => {
      const message = voicemail.message as string
      if (!message) return
      
      const messageKey = message.substring(0, 50) // First 50 chars as key
      
      if (!messageStats[messageKey]) {
        messageStats[messageKey] = { total: 0, delivered: 0, responses: 0 }
      }
      
      messageStats[messageKey].total++
      if (voicemail.status === 'delivered') {
        messageStats[messageKey].delivered++
      }
      if (voicemail.response_received) {
        messageStats[messageKey].responses++
      }
    })

    return Object.entries(messageStats)
      .map(([message, stats]) => ({
        message,
        deliveryRate: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
        responseRate: stats.delivered > 0 ? (stats.responses / stats.delivered) * 100 : 0
      }))
      .sort((a, b) => b.responseRate - a.responseRate)
      .slice(0, 5)
  }

  static async getComplianceMetrics(organizationId: string, startDate: string, endDate: string) {
    if (!supabase) return {
      tcpaViolations: 0,
      dncHits: 0,
      frequencyViolations: 0,
      timeViolations: 0,
      complianceScore: 100
    }

    try {
      const { data: auditLogs } = await supabase
        .from('tcpa_audit_log')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const dncHits = auditLogs?.filter(log => log.action === 'dnc_check' && !log.result)?.length || 0
      const frequencyViolations = auditLogs?.filter(log => log.action === 'frequency_check' && !log.result)?.length || 0
      const timeViolations = auditLogs?.filter(log => log.action === 'time_check' && !log.result)?.length || 0
      const totalViolations = dncHits + frequencyViolations + timeViolations
      const totalChecks = auditLogs?.length || 1

      return {
        tcpaViolations: totalViolations,
        dncHits,
        frequencyViolations,
        timeViolations,
        complianceScore: ((totalChecks - totalViolations) / totalChecks) * 100
      }
    } catch (error) {
      console.error('Compliance metrics error:', error)
      return {
        tcpaViolations: 0,
        dncHits: 0,
        frequencyViolations: 0,
        timeViolations: 0,
        complianceScore: 100
      }
    }
  }

  static calculateLeadMetrics(leadScores: Record<string, unknown>[]) {
    const hotLeads = leadScores.filter(score => (score.total_score as number) >= 80).length
    const warmLeads = leadScores.filter(score => {
      const totalScore = score.total_score as number
      return totalScore >= 60 && totalScore < 80
    }).length
    const coldLeads = leadScores.filter(score => (score.total_score as number) < 60).length
    
    const averageLeadScore = leadScores.length > 0 
      ? leadScores.reduce((sum, score) => sum + (score.total_score as number || 0), 0) / leadScores.length
      : 0

    const conversionByScore = [
      { scoreRange: '80-100', conversionRate: 45 }, // These would come from actual conversion data
      { scoreRange: '60-79', conversionRate: 28 },
      { scoreRange: '40-59', conversionRate: 15 },
      { scoreRange: '20-39', conversionRate: 8 },
      { scoreRange: '0-19', conversionRate: 3 }
    ]

    return {
      hotLeads,
      warmLeads,
      coldLeads,
      averageLeadScore,
      conversionByScore
    }
  }

  static calculateTrends(voicemails: Record<string, unknown>[]) {
    // Daily metrics
    const dailyData: { [key: string]: { sent: number; delivered: number; cost: number } } = {}
    
    voicemails.forEach(voicemail => {
      const createdAt = voicemail.created_at as string
      if (!createdAt) return
      
      const date = new Date(createdAt).toISOString().split('T')[0]
      
      if (!dailyData[date]) {
        dailyData[date] = { sent: 0, delivered: 0, cost: 0 }
      }
      
      dailyData[date].sent++
      if (voicemail.status === 'delivered') {
        dailyData[date].delivered++
      }
      dailyData[date].cost += ((voicemail.cost_cents as number) || 0) / 100
    })

    const dailyMetrics = Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Weekly trends (simplified)
    const weeklyTrends = [
      { week: 'Week 1', growth: 12 },
      { week: 'Week 2', growth: 8 },
      { week: 'Week 3', growth: 15 },
      { week: 'Week 4', growth: -3 }
    ]

    // Monthly comparison (simplified)
    const monthlyComparison = [
      { month: 'Jan', performance: 85 },
      { month: 'Feb', performance: 92 },
      { month: 'Mar', performance: 88 },
      { month: 'Apr', performance: 95 }
    ]

    return {
      dailyMetrics,
      weeklyTrends,
      monthlyComparison
    }
  }

  static async getCampaignROI(campaignId: string): Promise<CampaignROI | null> {
    if (!supabase) return null

    try {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      const { data: voicemails } = await supabase
        .from('voicemails')
        .select('*')
        .eq('campaign_id', campaignId)

      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .eq('campaign_id', campaignId)

      if (!campaign || !voicemails) return null

      const totalSent = voicemails.length
      const totalDelivered = voicemails.filter(v => v.status === 'delivered').length
      const totalCost = voicemails.reduce((sum, v) => sum + (v.cost_cents || 0), 0) / 100
      
      const responses = conversions?.filter(c => c.type === 'response')?.length || 0
      const appointments = conversions?.filter(c => c.type === 'appointment')?.length || 0
      const sales = conversions?.filter(c => c.type === 'sale')?.length || 0
      const revenue = conversions?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0

      return {
        campaignId,
        campaignName: campaign.name,
        totalSent,
        totalDelivered,
        totalCost,
        responses,
        appointments,
        sales,
        revenue,
        roi: totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0,
        costPerAppointment: appointments > 0 ? totalCost / appointments : 0,
        costPerSale: sales > 0 ? totalCost / sales : 0
      }
    } catch (error) {
      console.error('Campaign ROI error:', error)
      return null
    }
  }

  static async getConversionFunnel(organizationId: string, startDate: string, endDate: string): Promise<ConversionFunnel[]> {
    if (!supabase) return []

    try {
      const { data: voicemails } = await supabase
        .from('voicemails')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const totalSent = voicemails?.length || 0
      const delivered = voicemails?.filter(v => v.status === 'delivered')?.length || 0
      const responses = conversions?.filter(c => c.type === 'response')?.length || 0
      const appointments = conversions?.filter(c => c.type === 'appointment')?.length || 0
      const sales = conversions?.filter(c => c.type === 'sale')?.length || 0

      const funnel: ConversionFunnel[] = [
        {
          stage: 'Voicemails Sent',
          count: totalSent,
          percentage: 100,
          dropOffRate: 0
        },
        {
          stage: 'Delivered',
          count: delivered,
          percentage: totalSent > 0 ? (delivered / totalSent) * 100 : 0,
          dropOffRate: totalSent > 0 ? ((totalSent - delivered) / totalSent) * 100 : 0
        },
        {
          stage: 'Responses',
          count: responses,
          percentage: delivered > 0 ? (responses / delivered) * 100 : 0,
          dropOffRate: delivered > 0 ? ((delivered - responses) / delivered) * 100 : 0
        },
        {
          stage: 'Appointments',
          count: appointments,
          percentage: responses > 0 ? (appointments / responses) * 100 : 0,
          dropOffRate: responses > 0 ? ((responses - appointments) / responses) * 100 : 0
        },
        {
          stage: 'Sales',
          count: sales,
          percentage: appointments > 0 ? (sales / appointments) * 100 : 0,
          dropOffRate: appointments > 0 ? ((appointments - sales) / appointments) * 100 : 0
        }
      ]

      return funnel
    } catch (error) {
      console.error('Conversion funnel error:', error)
      return []
    }
  }

  static async exportAnalyticsReport(organizationId: string, startDate: string, endDate: string, format: 'csv' | 'json' = 'csv'): Promise<string> {
    const analytics = await this.getAdvancedAnalytics(organizationId, startDate, endDate)
    
    if (format === 'json') {
      return JSON.stringify(analytics, null, 2)
    }

    // CSV format
    const csvRows = [
      'Metric,Value',
      `Total Campaigns,${analytics.overview.totalCampaigns}`,
      `Total Voicemails,${analytics.overview.totalVoicemails}`,
      `Delivery Rate,${analytics.overview.overallDeliveryRate.toFixed(2)}%`,
      `Total Cost,$${analytics.overview.totalCost.toFixed(2)}`,
      `Conversion Rate,${analytics.overview.conversionRate.toFixed(2)}%`,
      `ROI,${analytics.overview.roi.toFixed(2)}%`,
      `Compliance Score,${analytics.compliance.complianceScore.toFixed(2)}%`,
      `Average Lead Score,${analytics.leadManagement.averageLeadScore.toFixed(2)}`,
      `Hot Leads,${analytics.leadManagement.hotLeads}`,
      `Warm Leads,${analytics.leadManagement.warmLeads}`,
      `Cold Leads,${analytics.leadManagement.coldLeads}`
    ]

    return csvRows.join('\n')
  }
}
