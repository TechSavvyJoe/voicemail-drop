import twilio from 'twilio'
import { supabase } from './supabase'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!

const client = twilio(accountSid, authToken)

export class VoicemailService {
  static async sendVoicemail(phoneNumber: string, message: string, campaignId?: string) {
    try {
      // Create TwiML for voicemail message
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="alice">${message}</Say>
        </Response>`

      // Make call using Twilio
      const call = await client.calls.create({
        to: phoneNumber,
        from: twilioPhoneNumber,
        twiml: twiml,
        machineDetection: 'DetectMessageEnd',
        machineDetectionTimeout: 30,
        machineDetectionSpeechThreshold: 2400,
        machineDetectionSpeechEndThreshold: 1200,
        machineDetectionSilenceTimeout: 5000
      })

      // Store voicemail record in database if we have supabase
      if (supabase) {
        await supabase
          .from('voicemails')
          .insert({
            campaign_id: campaignId,
            phone_number: phoneNumber,
            message,
            twilio_call_sid: call.sid,
            status: 'initiated',
            cost_cents: this.calculateCost(message),
            created_at: new Date().toISOString()
          })
      }

      return {
        success: true,
        callSid: call.sid,
        message: 'Voicemail sent successfully'
      }
    } catch (error) {
      console.error('Voicemail send error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  static async sendBulkVoicemails(phoneNumbers: string[], message: string, campaignId?: string) {
    const batchSize = 10 // Process in batches to avoid rate limits
    const results: Array<{ success: boolean; callSid?: string; message?: string; error?: string }> = []

    for (let i = 0; i < phoneNumbers.length; i += batchSize) {
      const batch = phoneNumbers.slice(i, i + batchSize)
      const batchPromises = batch.map(phoneNumber => 
        this.sendVoicemail(phoneNumber, message, campaignId)
      )

      const batchResults = await Promise.allSettled(batchPromises)
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          results.push({
            success: false,
            error: result.reason?.message || 'Unknown error',
          })
        }
      })

      // Add delay between batches to respect rate limits
      if (i + batchSize < phoneNumbers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  static async handleTwilioWebhook(callSid: string, callStatus: string, callDuration?: string) {
    try {
      // Update voicemail record based on call status
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      switch (callStatus.toLowerCase()) {
        case 'completed':
          updates.status = 'delivered'
          updates.delivered_at = new Date().toISOString()
          if (callDuration) {
            updates.duration_seconds = parseInt(callDuration)
          }
          break
        case 'failed':
        case 'canceled':
        case 'busy':
        case 'no-answer':
          updates.status = 'failed'
          updates.failure_reason = callStatus
          break
        default:
          updates.status = callStatus
      }

      if (supabase) {
        await supabase
          .from('voicemails')
          .update(updates)
          .eq('twilio_call_sid', callSid)
      }

      return { success: true }
    } catch (error) {
      console.error('Webhook handler error:', error)
      return { success: false, error }
    }
  }

  static async getCampaignStats(campaignId: string) {
    try {
      if (!supabase) {
        throw new Error('Database not available')
      }

      const { data, error } = await supabase
        .from('voicemails')
        .select('*')
        .eq('campaign_id', campaignId)

      if (error) throw error

      const stats = {
        total: data.length,
        delivered: data.filter(v => v.status === 'delivered').length,
        failed: data.filter(v => v.status === 'failed').length,
        pending: data.filter(v => v.status === 'initiated').length,
        totalCost: data.reduce((sum, v) => sum + (v.cost_cents || 0), 0) / 100,
        averageDuration: data
          .filter(v => v.duration_seconds)
          .reduce((sum, v, _, arr) => sum + (v.duration_seconds || 0) / arr.length, 0)
      }

      return { success: true, stats }
    } catch (error) {
      console.error('Campaign stats error:', error)
      return { success: false, error }
    }
  }

  static async getVoicemailHistory(organizationId: string, limit = 50) {
    try {
      if (!supabase) {
        throw new Error('Database not available')
      }

      const { data, error } = await supabase
        .from('voicemails')
        .select('*, campaigns(name)')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, voicemails: data }
    } catch (error) {
      console.error('Voicemail history error:', error)
      return { success: false, error }
    }
  }

  static async getAnalytics(organizationId: string, startDate: string, endDate: string) {
    try {
      if (!supabase) {
        throw new Error('Database not available')
      }

      const { data, error } = await supabase
        .from('voicemails')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      if (error) throw error

      const analytics = {
        totalSent: data.length,
        deliveryRate: data.length > 0 ? 
          data.filter(v => v.status === 'delivered').length / data.length * 100 : 0,
        totalCost: data.reduce((sum, v) => sum + (v.cost_cents || 0), 0) / 100,
        dailyBreakdown: this.groupByDay(data),
        statusBreakdown: {
          delivered: data.filter(v => v.status === 'delivered').length,
          failed: data.filter(v => v.status === 'failed').length,
          pending: data.filter(v => v.status === 'initiated').length,
        }
      }

      return { success: true, analytics }
    } catch (error) {
      console.error('Analytics error:', error)
      return { success: false, error }
    }
  }

  private static groupByDay(voicemails: Array<{ created_at: string; cost_cents?: number }>) {
    const grouped: Record<string, { count: number; cost: number }> = {}
    
    voicemails.forEach(voicemail => {
      const date = new Date(voicemail.created_at).toISOString().split('T')[0]
      if (!grouped[date]) {
        grouped[date] = { count: 0, cost: 0 }
      }
      grouped[date].count += 1
      grouped[date].cost += (voicemail.cost_cents || 0) / 100
    })

    return grouped
  }

  private static calculateCost(message: string): number {
    // Estimate cost based on message length (approximately 2 cents per 30 seconds)
    const estimatedDuration = Math.ceil(message.split(' ').length / 2.5) // ~2.5 words per second
    const durationMinutes = Math.ceil(estimatedDuration / 60)
    return Math.max(durationMinutes * 2, 1) // Minimum 1 cent
  }

  static async validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(phoneNumber)) {
      return false
    }

    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    // Check length (US numbers should be 10 or 11 digits)
    return digitsOnly.length === 10 || digitsOnly.length === 11
  }

  static formatPhoneNumber(phoneNumber: string): string {
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return `+${digitsOnly}`
    }
    
    return phoneNumber // Return as-is if we can't format it
  }
}
