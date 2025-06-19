import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  
  const decoded = verifyToken(token) as { userId: string, organizationId: string };
  return { userId: decoded.userId, organizationId: decoded.organizationId };
}

export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await getUserFromToken(request);
    const { campaignId } = await request.json()
    
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();

    // In demo mode, return mock processing results
    if (!supabase) {
      const mockResults = Array.from({ length: 5 }, (_, i) => ({
        customerId: `demo-customer-${i + 1}`,
        phoneNumber: `555-000-${String(i + 1).padStart(4, '0')}`,
        status: Math.random() > 0.1 ? 'delivered' : 'failed'
      }))
      
      const successful = mockResults.filter(r => r.status === 'delivered').length
      const failed = mockResults.filter(r => r.status === 'failed').length

      return NextResponse.json({
        success: true,
        processed: mockResults.length,
        successful,
        failed,
        results: mockResults
      })
    }

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('organization_id', organizationId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Get customers for this campaign
    const { data: drops, error: dropsError } = await supabase
      .from('voicemail_drops')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')

    if (dropsError) {
      return NextResponse.json({ error: 'Failed to load campaign contacts' }, { status: 500 })
    }

    if (!drops || drops.length === 0) {
      return NextResponse.json({ error: 'No pending contacts found' }, { status: 400 })
    }

    // Process voicemails (in demo mode, we'll simulate this)
    const results = []
    let successful = 0
    let failed = 0

    for (const drop of drops) {
      try {
        // Simulate voicemail delivery
        const success = Math.random() > 0.1 // 90% success rate for demo
        
        if (success) {
          // Update drop status to delivered
          await supabase
            .from('voicemail_drops')
            .update({
              status: 'delivered',
              twilio_sid: `VM${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
              delivered_at: new Date().toISOString()
            })
            .eq('id', drop.id)
          
          successful++
        } else {
          // Update drop status to failed
          await supabase
            .from('voicemail_drops')
            .update({
              status: 'failed',
              error_message: 'Number not reachable'
            })
            .eq('id', drop.id)
          
          failed++
        }

        results.push({
          customerId: drop.customer_id,
          phoneNumber: drop.phone_number,
          status: success ? 'delivered' : 'failed'
        })

        // Add small delay to simulate real processing
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error('Error processing drop:', error)
        failed++
      }
    }

    // Update campaign statistics
    await supabase
      .from('campaigns')
      .update({
        successful_drops: campaign.successful_drops + successful,
        failed_drops: campaign.failed_drops + failed,
        status: 'completed'
      })
      .eq('id', campaignId)

    return NextResponse.json({
      success: true,
      processed: results.length,
      successful,
      failed,
      results
    })
  } catch (error) {
    console.error('Campaign processing error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Unauthorized',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 401 })
  }
}
