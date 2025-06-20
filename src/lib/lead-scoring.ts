import { supabase } from './supabase'

export interface LeadScore {
  id: string
  customer_id: string
  total_score: number
  demographics_score: number
  behavioral_score: number
  engagement_score: number
  intent_score: number
  last_calculated: string
  score_factors: {
    factor: string
    points: number
    reason: string
  }[]
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  vehicleInterest?: string
  lastContact?: string
  dealership?: string
  source?: string
  creditScore?: number
  annualIncome?: number
  previousCustomer?: boolean
  referralSource?: string
  websiteActivity?: number
  emailEngagement?: number
  callResponse?: number
  appointmentHistory?: number
}

export class LeadScoringService {
  
  // Lead scoring algorithm based on automotive industry best practices
  static async calculateLeadScore(customer: Customer): Promise<LeadScore> {
    const scoringFactors: { factor: string; points: number; reason: string }[] = []
    
    // Demographics scoring (0-25 points)
    let demographicsScore = 0
    
    // Credit score factor
    if (customer.creditScore) {
      if (customer.creditScore >= 750) {
        demographicsScore += 10
        scoringFactors.push({ factor: 'Credit Score', points: 10, reason: 'Excellent credit (750+)' })
      } else if (customer.creditScore >= 650) {
        demographicsScore += 7
        scoringFactors.push({ factor: 'Credit Score', points: 7, reason: 'Good credit (650-749)' })
      } else if (customer.creditScore >= 600) {
        demographicsScore += 4
        scoringFactors.push({ factor: 'Credit Score', points: 4, reason: 'Fair credit (600-649)' })
      }
    }
    
    // Income factor
    if (customer.annualIncome) {
      if (customer.annualIncome >= 80000) {
        demographicsScore += 8
        scoringFactors.push({ factor: 'Income', points: 8, reason: 'High income ($80k+)' })
      } else if (customer.annualIncome >= 50000) {
        demographicsScore += 5
        scoringFactors.push({ factor: 'Income', points: 5, reason: 'Moderate income ($50k-$79k)' })
      } else if (customer.annualIncome >= 30000) {
        demographicsScore += 2
        scoringFactors.push({ factor: 'Income', points: 2, reason: 'Lower income ($30k-$49k)' })
      }
    }
    
    // Previous customer bonus
    if (customer.previousCustomer) {
      demographicsScore += 7
      scoringFactors.push({ factor: 'Previous Customer', points: 7, reason: 'Returning customer loyalty' })
    }
    
    // Behavioral scoring (0-25 points)
    let behavioralScore = 0
    
    // Website activity
    if (customer.websiteActivity) {
      if (customer.websiteActivity >= 10) {
        behavioralScore += 8
        scoringFactors.push({ factor: 'Website Activity', points: 8, reason: 'High engagement (10+ sessions)' })
      } else if (customer.websiteActivity >= 5) {
        behavioralScore += 5
        scoringFactors.push({ factor: 'Website Activity', points: 5, reason: 'Moderate engagement (5-9 sessions)' })
      } else if (customer.websiteActivity >= 2) {
        behavioralScore += 2
        scoringFactors.push({ factor: 'Website Activity', points: 2, reason: 'Some engagement (2-4 sessions)' })
      }
    }
    
    // Email engagement
    if (customer.emailEngagement) {
      if (customer.emailEngagement >= 0.8) {
        behavioralScore += 6
        scoringFactors.push({ factor: 'Email Engagement', points: 6, reason: 'High open rate (80%+)' })
      } else if (customer.emailEngagement >= 0.5) {
        behavioralScore += 4
        scoringFactors.push({ factor: 'Email Engagement', points: 4, reason: 'Good open rate (50-79%)' })
      } else if (customer.emailEngagement >= 0.2) {
        behavioralScore += 2
        scoringFactors.push({ factor: 'Email Engagement', points: 2, reason: 'Some engagement (20-49%)' })
      }
    }
    
    // Vehicle interest specificity
    if (customer.vehicleInterest) {
      const specificModels = ['Toyota Camry', 'Honda Accord', 'BMW X3', 'Mercedes C-Class']
      if (specificModels.some(model => customer.vehicleInterest?.includes(model))) {
        behavioralScore += 7
        scoringFactors.push({ factor: 'Vehicle Interest', points: 7, reason: 'Specific model interest' })
      } else if (customer.vehicleInterest.length > 10) {
        behavioralScore += 4
        scoringFactors.push({ factor: 'Vehicle Interest', points: 4, reason: 'Detailed interest description' })
      } else {
        behavioralScore += 2
        scoringFactors.push({ factor: 'Vehicle Interest', points: 2, reason: 'General interest noted' })
      }
    }
    
    // Engagement scoring (0-25 points)
    let engagementScore = 0
    
    // Call response rate
    if (customer.callResponse) {
      if (customer.callResponse >= 0.7) {
        engagementScore += 10
        scoringFactors.push({ factor: 'Call Response', points: 10, reason: 'High response rate (70%+)' })
      } else if (customer.callResponse >= 0.4) {
        engagementScore += 6
        scoringFactors.push({ factor: 'Call Response', points: 6, reason: 'Good response rate (40-69%)' })
      } else if (customer.callResponse >= 0.2) {
        engagementScore += 3
        scoringFactors.push({ factor: 'Call Response', points: 3, reason: 'Some response (20-39%)' })
      }
    }
    
    // Appointment history
    if (customer.appointmentHistory) {
      if (customer.appointmentHistory >= 3) {
        engagementScore += 8
        scoringFactors.push({ factor: 'Appointments', points: 8, reason: 'Multiple appointments (3+)' })
      } else if (customer.appointmentHistory >= 1) {
        engagementScore += 5
        scoringFactors.push({ factor: 'Appointments', points: 5, reason: 'Previous appointments' })
      }
    }
    
    // Recent contact boost
    if (customer.lastContact) {
      const daysSinceContact = Math.floor((Date.now() - new Date(customer.lastContact).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceContact <= 7) {
        engagementScore += 7
        scoringFactors.push({ factor: 'Recent Contact', points: 7, reason: 'Contact within 7 days' })
      } else if (daysSinceContact <= 30) {
        engagementScore += 4
        scoringFactors.push({ factor: 'Recent Contact', points: 4, reason: 'Contact within 30 days' })
      } else if (daysSinceContact <= 90) {
        engagementScore += 2
        scoringFactors.push({ factor: 'Recent Contact', points: 2, reason: 'Contact within 90 days' })
      }
    }
    
    // Intent scoring (0-25 points)
    let intentScore = 0
    
    // Referral source quality
    if (customer.referralSource) {
      const highQualitySources = ['Employee Referral', 'Customer Referral', 'Service Department']
      const mediumQualitySources = ['Google Ads', 'Facebook Ads', 'Website Contact']
      
      if (highQualitySources.includes(customer.referralSource)) {
        intentScore += 10
        scoringFactors.push({ factor: 'Referral Source', points: 10, reason: 'High-quality referral source' })
      } else if (mediumQualitySources.includes(customer.referralSource)) {
        intentScore += 6
        scoringFactors.push({ factor: 'Referral Source', points: 6, reason: 'Medium-quality referral source' })
      } else {
        intentScore += 3
        scoringFactors.push({ factor: 'Referral Source', points: 3, reason: 'Standard referral source' })
      }
    }
    
    // Source quality
    if (customer.source) {
      if (customer.source === 'Website Form' || customer.source === 'Phone Inquiry') {
        intentScore += 8
        scoringFactors.push({ factor: 'Lead Source', points: 8, reason: 'Direct inquiry source' })
      } else if (customer.source === 'Trade-in Appraisal') {
        intentScore += 7
        scoringFactors.push({ factor: 'Lead Source', points: 7, reason: 'Trade-in interest' })
      }
    }
    
    const totalScore = demographicsScore + behavioralScore + engagementScore + intentScore
    
    const leadScore: LeadScore = {
      id: `score_${customer.id}_${Date.now()}`,
      customer_id: customer.id,
      total_score: totalScore,
      demographics_score: demographicsScore,
      behavioral_score: behavioralScore,
      engagement_score: engagementScore,
      intent_score: intentScore,
      last_calculated: new Date().toISOString(),
      score_factors: scoringFactors
    }
    
    // Store in database if available
    if (supabase) {
      try {
        await supabase
          .from('lead_scores')
          .upsert(leadScore)
      } catch (error) {
        console.error('Failed to store lead score:', error)
      }
    }
    
    return leadScore
  }
  
  static getScoreCategory(score: number): { category: string; priority: string; color: string } {
    if (score >= 80) {
      return { category: 'Hot Lead', priority: 'Immediate', color: 'red' }
    } else if (score >= 60) {
      return { category: 'Warm Lead', priority: 'High', color: 'orange' }
    } else if (score >= 40) {
      return { category: 'Qualified Lead', priority: 'Medium', color: 'yellow' }
    } else if (score >= 20) {
      return { category: 'Cold Lead', priority: 'Low', color: 'blue' }
    } else {
      return { category: 'Unqualified', priority: 'Very Low', color: 'gray' }
    }
  }
  
  static async getLeadScoreHistory(customerId: string, limit = 10): Promise<LeadScore[]> {
    if (!supabase) return []
    
    try {
      const { data, error } = await supabase
        .from('lead_scores')
        .select('*')
        .eq('customer_id', customerId)
        .order('last_calculated', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get lead score history:', error)
      return []
    }
  }
  
  static async bulkCalculateScores(customers: Customer[]): Promise<LeadScore[]> {
    const scores: LeadScore[] = []
    
    for (const customer of customers) {
      try {
        const score = await this.calculateLeadScore(customer)
        scores.push(score)
      } catch (error) {
        console.error(`Failed to calculate score for customer ${customer.id}:`, error)
      }
    }
    
    return scores
  }
  
  static async getTopLeads(organizationId: string, limit = 50): Promise<(Customer & { leadScore?: LeadScore })[]> {
    if (!supabase) return []
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          lead_scores (*)
        `)
        .eq('organization_id', organizationId)
        .order('lead_scores.total_score', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      
      return data?.map(customer => ({
        ...customer,
        leadScore: customer.lead_scores?.[0]
      })) || []
    } catch (error) {
      console.error('Failed to get top leads:', error)
      return []
    }
  }
}
