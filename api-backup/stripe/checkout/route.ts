import { NextRequest, NextResponse } from 'next/server'
import { PRICING_PLANS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()

    // Get current user session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get plan details
    const plan = PRICING_PLANS.find(p => p.id === planId)
    if (!plan || plan.price === 0) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // For demo purposes, create a mock checkout session
    const mockSessionId = `cs_test_${Date.now()}`
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pricing?session=${mockSessionId}&plan=${planId}`

    return NextResponse.json({ 
      sessionId: mockSessionId,
      url: checkoutUrl,
      message: 'Demo mode: Stripe integration would handle real payments'
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
