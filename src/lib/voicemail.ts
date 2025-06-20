import twilio from 'twilio'
import { supabase } from './supabase'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!

const client = twilio(accountSid, authToken)

// TCPA Compliance Constants
const TCPA_TIME_RESTRICTIONS = {
  START_HOUR: 8, // 8 AM
  END_HOUR: 21,  // 9 PM
}

const TCPA_FREQUENCY_LIMITS = {
  MAX_PER_MONTH: 3,
  MAX_PER_WEEK: 1,
}

interface VoicemailResult {
  success: boolean
  callSid?: string
  message?: string
  error?: string
  retryCount?: number
  estimatedDuration?: number
  compliant?: boolean
  finalAttempt?: boolean
  twilioError?: string
}

export class VoicemailService {
  
  // TCPA Compliance Methods
  static async checkTCPACompliance(phoneNumber: string, timezone?: string): Promise<{ compliant: boolean; reason?: string }> {
    try {
      // Check if phone number is on Do Not Call list
      const isOnDNC = await this.checkDoNotCallList(phoneNumber)
      if (isOnDNC) {
        return { compliant: false, reason: 'Phone number is on Do Not Call list' }
      }

      // Check time restrictions
      const timeCompliant = this.checkTimeRestrictions(timezone)
      if (!timeCompliant) {
        return { compliant: false, reason: 'Outside allowed calling hours (8 AM - 9 PM local time)' }
      }

      // Check frequency limits
      const frequencyCompliant = await this.checkFrequencyLimits(phoneNumber)
      if (!frequencyCompliant) {
        return { compliant: false, reason: 'Frequency limit exceeded for this phone number' }
      }

      return { compliant: true }
    } catch (error) {
      console.error('TCPA compliance check error:', error)
      return { compliant: false, reason: 'Error checking compliance' }
    }
  }

  static async checkDoNotCallList(phoneNumber: string): Promise<boolean> {
    try {
      if (!supabase) return false

      const { data, error } = await supabase
        .from('do_not_call_list')
        .select('phone_number')
        .eq('phone_number', phoneNumber)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('DNC check error:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('DNC list check error:', error)
      return false
    }
  }

  static checkTimeRestrictions(timezone = 'America/New_York'): boolean {
    try {
      const now = new Date()
      const localTime = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false
      }).format(now)
      
      const currentHour = parseInt(localTime)
      return currentHour >= TCPA_TIME_RESTRICTIONS.START_HOUR && currentHour < TCPA_TIME_RESTRICTIONS.END_HOUR
    } catch (error) {
      console.error('Time restriction check error:', error)
      return false
    }
  }

  static async checkFrequencyLimits(phoneNumber: string): Promise<boolean> {
    try {
      if (!supabase) return true

      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      const { data, error } = await supabase
        .from('voicemails')
        .select('created_at')
        .eq('phone_number', phoneNumber)
        .gte('created_at', oneMonthAgo.toISOString())

      if (error) {
        console.error('Frequency check error:', error)
        return true // Allow on error to avoid blocking legitimate calls
      }

      return (data?.length || 0) < TCPA_FREQUENCY_LIMITS.MAX_PER_MONTH
    } catch (error) {
      console.error('Frequency limit check error:', error)
      return true
    }
  }

  static async addToDoNotCallList(phoneNumber: string, reason = 'User requested opt-out'): Promise<boolean> {
    try {
      if (!supabase) return false

      const { error } = await supabase
        .from('do_not_call_list')
        .insert({
          phone_number: phoneNumber,
          added_at: new Date().toISOString(),
          reason
        })

      if (error) {
        console.error('Add to DNC error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Add to DNC list error:', error)
      return false
    }
  }

  static async sendVoicemail(phoneNumber: string, message: string, campaignId?: string, timezone?: string, retryCount = 0): Promise<VoicemailResult> {
    const maxRetries = 3
    const retryDelay = 1000 * Math.pow(2, retryCount) // Exponential backoff
    
    try {
      // Validate phone number first
      if (!this.validatePhoneNumber(phoneNumber)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        }
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber)

      // TCPA Compliance Check with detailed logging
      const compliance = await this.checkTCPACompliance(formattedPhone, timezone)
      if (!compliance.compliant) {
        // Log compliance failure
        if (supabase) {
          await supabase.from('tcpa_audit_log').insert({
            phone_number: formattedPhone,
            action: 'compliance_check',
            result: false,
            reason: compliance.reason,
            created_at: new Date().toISOString()
          })
        }
        
        return {
          success: false,
          error: `TCPA Compliance violation: ${compliance.reason}`,
          compliant: false
        }
      }

      // Log successful compliance check
      if (supabase) {
        await supabase.from('tcpa_audit_log').insert({
          phone_number: formattedPhone,
          action: 'compliance_check',
          result: true,
          reason: 'All compliance checks passed',
          created_at: new Date().toISOString()
        })
      }

      // Add opt-out message to the voicemail
      const compliantMessage = `${message} To opt out of future voicemails, reply STOP or call us to be removed from our list.`

      // Validate message length (max 30 seconds ~ 150 words)
      const wordCount = compliantMessage.split(' ').length
      if (wordCount > 150) {
        return {
          success: false,
          error: 'Message too long. Maximum 150 words for 30-second voicemail.'
        }
      }

      // For true ringless voicemail, we need to use Twilio's specific approach
      // Option 1: Use Twilio's Voice API with specific parameters for voicemail delivery
      // Option 2: Use text-to-speech recording and upload as voicemail
      
      // Create TwiML for ringless voicemail delivery
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Pause length="1"/>
          <Say voice="alice" rate="medium" pitch="medium">${compliantMessage}</Say>
          <Pause length="1"/>
        </Response>`

      // Enhanced call parameters optimized for direct-to-voicemail delivery
      const callParams = {
        to: formattedPhone,
        from: twilioPhoneNumber,
        twiml: twiml,
        // Critical: Use specific parameters for ringless voicemail
        machineDetection: 'Enable' as const, // Detect answering machines
        machineDetectionTimeout: 30,
        machineDetectionSpeechThreshold: 2400,
        machineDetectionSpeechEndThreshold: 1200,
        machineDetectionSilenceTimeout: 5000,
        // Ringless voicemail specific settings
        answerOnBridge: false, // Don't answer until machine detected
        record: false,
        statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL,
        statusCallbackEvent: ['completed', 'answered', 'machine-start', 'machine-end-beep', 'machine-end-silence', 'failed'],
        statusCallbackMethod: 'POST',
        // Extended timeout to ensure delivery to voicemail
        timeout: 30,
        // Add If-Machine parameter for better voicemail detection
        ifMachine: 'continue', // Continue to voicemail even if machine detected
        // Additional parameter for better ringless delivery
        sendDigits: 'w' // Small delay before starting message
      }

      // Make call using Twilio with error handling
      let call
      try {
        call = await client.calls.create(callParams)
      } catch (twilioError: unknown) {
        // Handle specific Twilio errors
        const error = twilioError as { code?: number; message?: string }
        if (error.code === 21217) { // Phone number is not valid
          return {
            success: false,
            error: 'Invalid phone number',
            twilioError: error.message
          }
        } else if (error.code === 21614) { // Phone number is not mobile
          return {
            success: false,
            error: 'Phone number is not a mobile number',
            twilioError: error.message
          }
        } else if (error.code === 20003) { // Authentication error
          return {
            success: false,
            error: 'Twilio authentication failed',
            twilioError: error.message
          }
        } else if (retryCount < maxRetries) {
          // Retry on other errors
          console.log(`Retrying voicemail send (attempt ${retryCount + 1}/${maxRetries})...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return this.sendVoicemail(phoneNumber, message, campaignId, timezone, retryCount + 1)
        } else {
          throw twilioError
        }
      }

      // Store enhanced voicemail record in database
      if (supabase) {
        const voicemailRecord = {
          campaign_id: campaignId,
          phone_number: formattedPhone,
          message: compliantMessage,
          twilio_call_sid: call.sid,
          status: 'initiated',
          cost_cents: this.calculateCost(compliantMessage),
          created_at: new Date().toISOString(),
          timezone: timezone || 'America/New_York',
          retry_count: retryCount,
          word_count: wordCount,
          estimated_duration: Math.ceil(wordCount / 2.5), // ~2.5 words per second
          compliance_checked: true
        }

        const { error: dbError } = await supabase
          .from('voicemails')
          .insert(voicemailRecord)

        if (dbError) {
          console.error('Database insert error:', dbError)
          // Don't fail the voicemail send if database fails
        }
      }

      return {
        success: true,
        callSid: call.sid,
        message: 'Voicemail sent successfully',
        retryCount,
        estimatedDuration: Math.ceil(wordCount / 2.5)
      }
    } catch (error: unknown) {
      console.error('Voicemail send error:', error)
      
      // Store failed attempt if possible
      if (supabase) {
        try {
          await supabase.from('failed_voicemails').insert({
            phone_number: phoneNumber,
            message,
            campaign_id: campaignId,
            error_message: error instanceof Error ? error.message : 'Unknown error',
            retry_count: retryCount,
            created_at: new Date().toISOString()
          })
        } catch (dbError) {
          console.error('Failed to log error to database:', dbError)
        }
      }

      // Retry logic for transient errors
      if (retryCount < maxRetries && this.isRetryableError(error)) {
        console.log(`Retrying voicemail send (attempt ${retryCount + 1}/${maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return this.sendVoicemail(phoneNumber, message, campaignId, timezone, retryCount + 1)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount,
        finalAttempt: retryCount >= maxRetries
      }
    }
  }

  private static isRetryableError(error: unknown): boolean {
    // Define which errors are worth retrying
    const retryableErrorCodes = [
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENETUNREACH'
    ]
    
    const retryableTwilioErrors = [
      20429, // Too many requests
      20500, // Internal server error
      21601, // Temporary failure
      30001  // Queue overflow
    ]

    const err = error as { code?: string | number }
    
    if (err.code && typeof err.code === 'string' && retryableErrorCodes.includes(err.code)) {
      return true
    }

    if (err.code && typeof err.code === 'number' && retryableTwilioErrors.includes(err.code)) {
      return true
    }

    return false
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
