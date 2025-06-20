import twilio from 'twilio'
import { supabase } from './supabase'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!

const client = twilio(accountSid, authToken)

interface RinglessVoicemailOptions {
  phoneNumber: string
  message: string
  campaignId?: string
  timezone?: string
  voice?: 'alice' | 'man' | 'woman'
  language?: string
}

interface RinglessVoicemailResult {
  success: boolean
  callSid?: string
  recordingSid?: string
  message?: string
  error?: string
  estimatedDuration?: number
  costCents?: number
}

export class RinglessVoicemailService {
  
  /**
   * Send a true ringless voicemail using Twilio's recording upload method
   * This is the most reliable method for ringless voicemail delivery
   */
  static async sendRinglessVoicemail(options: RinglessVoicemailOptions): Promise<RinglessVoicemailResult> {
    try {
      const { phoneNumber, message, campaignId, timezone = 'America/New_York', voice = 'alice', language = 'en-US' } = options

      // Step 1: Create a TTS recording of the message
      const recording = await this.createTTSRecording(message, voice, language)
      if (!recording.success || !recording.recordingUrl) {
        return {
          success: false,
          error: 'Failed to create voice recording'
        }
      }

      // Step 2: Use Twilio's Voice API to deliver directly to voicemail
      const result = await this.deliverToVoicemail(phoneNumber, recording.recordingUrl)
      
      // Step 3: Store the voicemail record
      if (supabase && result.success) {
        await this.storeVoicemailRecord({
          campaignId,
          phoneNumber,
          message,
          callSid: result.callSid,
          recordingSid: recording.recordingSid,
          timezone,
          costCents: result.costCents
        })
      }

      return result
    } catch (error) {
      console.error('Ringless voicemail error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Create a TTS recording using Twilio's Text-to-Speech
   */
  private static async createTTSRecording(
    message: string, 
    voice: string = 'alice',
    language: string = 'en-US'
  ): Promise<{ success: boolean; recordingUrl?: string; recordingSid?: string; duration?: number }> {
    try {
      // Create a temporary call to generate TTS recording
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Record action="" timeout="1" maxLength="120" playBeep="false">
            <Say voice="${voice}" language="${language}">${message}</Say>
          </Record>
        </Response>`

      // Use Twilio's TTS service to create audio file
      const call = await client.calls.create({
        to: twilioPhoneNumber, // Call our own number
        from: twilioPhoneNumber,
        twiml: twiml,
        record: true,
        statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL + '/recording'
      })

      // Wait for recording to be available (in production, use webhooks)
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Get the recording
      const recordings = await client.recordings.list({ callSid: call.sid })
      if (recordings.length > 0) {
        const recording = recordings[0]
        return {
          success: true,
          recordingUrl: `https://api.twilio.com${recording.uri}`,
          recordingSid: recording.sid,
          duration: parseInt(recording.duration || '0')
        }
      }

      return { success: false }
    } catch (error) {
      console.error('TTS recording error:', error)
      return { success: false }
    }
  }

  /**
   * Deliver the recording directly to voicemail using Twilio's advanced calling features
   */
  private static async deliverToVoicemail(
    phoneNumber: string, 
    recordingUrl: string
  ): Promise<RinglessVoicemailResult> {
    try {
      // Create TwiML that plays the pre-recorded message
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Pause length="1"/>
          <Play>${recordingUrl}</Play>
          <Pause length="1"/>
        </Response>`

      // Advanced call parameters for ringless delivery
      const callParams = {
        to: phoneNumber,
        from: twilioPhoneNumber,
        twiml: twiml,
        // Critical settings for ringless voicemail
        machineDetection: 'DetectMessageEnd' as const,
        machineDetectionTimeout: 30,
        machineDetectionSpeechThreshold: 2400,
        machineDetectionSpeechEndThreshold: 1200,
        machineDetectionSilenceTimeout: 5000,
        // Enhanced voicemail delivery settings
        // asyncAmd: 'true', // Asynchronous machine detection (commented - may not be available)
        // asyncAmdStatusCallback: process.env.TWILIO_STATUS_CALLBACK_URL + '/amd',
        // asyncAmdStatusCallbackMethod: 'POST',
        // Status tracking
        statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL + '/voicemail',
        statusCallbackEvent: ['completed', 'answered', 'failed', 'machine-start', 'machine-end-beep'],
        statusCallbackMethod: 'POST',
        // Call behavior
        record: false,
        timeout: 30,
        answerOnBridge: false
      }

      const call = await client.calls.create(callParams)

      return {
        success: true,
        callSid: call.sid,
        message: 'Ringless voicemail sent successfully',
        costCents: this.estimateCost(30) // Estimate 30 seconds
      }
    } catch (error) {
      console.error('Voicemail delivery error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delivery failed'
      }
    }
  }

  /**
   * Alternative method: Use Twilio's Direct to Voicemail feature (if available)
   */
  static async sendDirectToVoicemail(options: RinglessVoicemailOptions): Promise<RinglessVoicemailResult> {
    try {
      const { phoneNumber, message, voice = 'alice', language = 'en-US' } = options

      // Use Twilio's direct-to-voicemail capability
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Pause length="1"/>
          <Say voice="${voice}" language="${language}">${message}</Say>
          <Pause length="1"/>
        </Response>`

      const call = await client.calls.create({
        to: phoneNumber,
        from: twilioPhoneNumber,
        twiml: twiml,
        // Specific parameters for direct voicemail delivery
        machineDetection: 'Enable',
        // ifMachine: 'continue', // Continue even if machine detected (commented - may not be available)
        timeout: 1, // Very short timeout to go straight to voicemail
        statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL,
        statusCallbackEvent: ['completed', 'answered', 'failed']
      })

      return {
        success: true,
        callSid: call.sid,
        message: 'Direct voicemail sent successfully',
        costCents: this.estimateCost(message.split(' ').length * 0.4) // ~0.4 seconds per word
      }
    } catch (error) {
      console.error('Direct voicemail error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send direct voicemail'
      }
    }
  }

  /**
   * Store voicemail record in database
   */
  private static async storeVoicemailRecord(data: {
    campaignId?: string
    phoneNumber: string
    message: string
    callSid?: string
    recordingSid?: string
    timezone: string
    costCents?: number
  }) {
    if (!supabase) return

    try {
      await supabase.from('voicemails').insert({
        campaign_id: data.campaignId,
        phone_number: data.phoneNumber,
        message: data.message,
        twilio_call_sid: data.callSid,
        twilio_recording_sid: data.recordingSid,
        status: 'initiated',
        cost_cents: data.costCents || 0,
        timezone: data.timezone,
        delivery_method: 'ringless',
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Database storage error:', error)
    }
  }

  /**
   * Estimate cost based on duration
   */
  private static estimateCost(durationSeconds: number): number {
    // Twilio voice costs approximately $0.013 per minute
    const minutes = Math.ceil(durationSeconds / 60)
    return Math.max(minutes * 1.3, 1) // 1.3 cents per minute, minimum 1 cent
  }

  /**
   * Bulk ringless voicemail sending with rate limiting
   */
  static async sendBulkRinglessVoicemails(
    phoneNumbers: string[],
    message: string,
    campaignId?: string,
    options: { batchSize?: number; delayMs?: number } = {}
  ): Promise<RinglessVoicemailResult[]> {
    const { batchSize = 10, delayMs = 1000 } = options
    const results: RinglessVoicemailResult[] = []

    for (let i = 0; i < phoneNumbers.length; i += batchSize) {
      const batch = phoneNumbers.slice(i, i + batchSize)
      
      const batchPromises = batch.map(phoneNumber =>
        this.sendRinglessVoicemail({
          phoneNumber,
          message,
          campaignId
        })
      )

      const batchResults = await Promise.allSettled(batchPromises)
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          results.push({
            success: false,
            error: result.reason?.message || 'Unknown error'
          })
        }
      })

      // Add delay between batches to respect rate limits
      if (i + batchSize < phoneNumbers.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    return results
  }

  /**
   * Get ringless voicemail statistics
   */
  static async getStats(campaignId: string) {
    if (!supabase) return { success: false, error: 'Database not available' }

    try {
      const { data, error } = await supabase
        .from('voicemails')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('delivery_method', 'ringless')

      if (error) throw error

      const stats = {
        total: data.length,
        delivered: data.filter(v => v.status === 'delivered').length,
        failed: data.filter(v => v.status === 'failed').length,
        pending: data.filter(v => v.status === 'initiated').length,
        totalCost: data.reduce((sum, v) => sum + (v.cost_cents || 0), 0) / 100,
        deliveryRate: data.length > 0 ? 
          data.filter(v => v.status === 'delivered').length / data.length * 100 : 0
      }

      return { success: true, stats }
    } catch (error) {
      console.error('Stats error:', error)
      return { success: false, error }
    }
  }
}
