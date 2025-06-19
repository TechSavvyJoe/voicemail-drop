import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  const supabase = await createClient();
  
  // In demo mode, webhooks don't need to process
  if (!supabase) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await supabase
            .from('users')
            .update({
              subscription_plan: plan,
              subscription_status: 'active',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            })
            .eq('id', userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as unknown as { subscription: string; period_end: number };
        const subscriptionId = invoice.subscription;
        
        // Update subscription status
        if (subscriptionId) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'active',
              current_period_end: new Date(invoice.period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as { subscription: string };
        const subscriptionId = invoice.subscription;
        
        if (subscriptionId) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await supabase
          .from('users')
          .update({
            subscription_status: 'canceled',
            subscription_plan: 'starter',
            voicemails_limit: 0,
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}
