import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { stripe, PRICE_TIERS } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  
  const decoded = verifyToken(token) as { userId: string };
  return decoded.userId;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const { plan } = await request.json();
    
    if (!plan || !PRICE_TIERS[plan as keyof typeof PRICE_TIERS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Check if we're in demo mode
    if (!supabase) {
      return NextResponse.json(
        { error: 'Demo mode: Billing operations not available' },
        { status: 400 }
      );
    }
    
    // Get user data
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const selectedPlan = PRICE_TIERS[plan as keyof typeof PRICE_TIERS];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const supabase = await createClient();
    
    // Check if we're in demo mode
    if (!supabase) {
      return NextResponse.json(
        { error: 'Demo mode: Billing operations not available' },
        { status: 400 }
      );
    }
    
    // Get user subscription data
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_plan, subscription_status, current_period_end, voicemails_used, voicemails_limit')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      subscription: user,
      plans: PRICE_TIERS
    });
  } catch (error) {
    console.error('Billing GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}