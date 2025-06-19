import Stripe from 'stripe';
import { supabase } from './supabase'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  voicemailCredits: number
  features: string[]
  stripePriceId: string
  isPopular?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small dealerships',
    price: 49,
    voicemailCredits: 1000,
    stripePriceId: process.env.STRIPE_PRICE_ID_BASIC || 'price_basic',
    features: [
      '1,000 voicemail drops per month',
      'Customer list upload (CSV/Excel)',
      'Basic analytics',
      'Pre-built script templates',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing dealership sales teams',
    price: 99,
    voicemailCredits: 3000,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro',
    isPopular: true,
    features: [
      '3,000 voicemail drops per month',
      'Advanced campaign scheduling',
      'Custom script creation',
      'Advanced analytics & reporting',
      'Team collaboration',
      'Phone support',
      'CRM integration (coming soon)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large dealership groups',
    price: 199,
    voicemailCredits: 10000,
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise',
    features: [
      '10,000 voicemail drops per month',
      'Unlimited team members',
      'White-label options',
      'Custom integrations',
      'Dedicated account manager',
      'Priority support',
      'Custom reporting',
      'API access',
    ],
  },
]

// Legacy support
export const PRICE_TIERS = {
  STARTER: {
    priceId: 'price_starter',
    name: 'Starter',
    price: 29,
    voicemails: 500,
    features: ['Basic Analytics', 'CSV Import', 'Email Support']
  },
  PROFESSIONAL: {
    priceId: 'price_professional',
    name: 'Professional',
    price: 79,
    voicemails: 2000,
    features: ['Advanced Analytics', 'CRM Integration', 'Priority Support', 'Custom Scripts']
  },
  ENTERPRISE: {
    priceId: 'price_enterprise',
    name: 'Enterprise',
    price: 199,
    voicemails: 10000,
    features: ['White Label', 'API Access', 'Dedicated Support', 'Custom Integrations']
  }
};

export class StripeService {
  static async createCustomer(email: string, name: string, organizationId: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          organizationId,
        },
      })

      return customer
    } catch (error) {
      console.error('Create Stripe customer error:', error)
      throw error
    }
  }

  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    organizationId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          organizationId,
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        subscription_data: {
          metadata: {
            organizationId,
          },
        },
      })

      return session
    } catch (error) {
      console.error('Create checkout session error:', error)
      throw error
    }
  }

  static async handleWebhook(body: string, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return { received: true }
    } catch (error) {
      console.error('Webhook error:', error)
      throw error
    }
  }

  private static async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    try {
      const organizationId = session.metadata?.organizationId
      if (!organizationId || !supabase) return

      // Update organization subscription status
      await supabase
        .from('organizations')
        .update({
          subscription_status: 'active',
          subscription_tier: this.getPlanFromPriceId(session.mode === 'subscription' ? 
            session.metadata?.priceId || '' : ''),
        })
        .eq('id', organizationId)

    } catch (error) {
      console.error('Handle checkout completed error:', error)
    }
  }

  private static async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
      const subscriptionId = (invoice as unknown as { subscription: string }).subscription
      if (!subscriptionId) return
      
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const organizationId = subscription.metadata?.organizationId
      if (!organizationId || !supabase) return

      // Reset monthly usage
      await supabase
        .from('organizations')
        .update({
          monthly_voicemails_used: 0,
          subscription_status: 'active',
        })
        .eq('id', organizationId)

    } catch (error) {
      console.error('Handle payment succeeded error:', error)
    }
  }

  private static async handlePaymentFailed(invoice: Stripe.Invoice) {
    try {
      const subscriptionId = (invoice as unknown as { subscription: string }).subscription
      if (!subscriptionId) return
      
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const organizationId = subscription.metadata?.organizationId
      if (!organizationId || !supabase) return

      await supabase
        .from('organizations')
        .update({
          subscription_status: 'past_due',
        })
        .eq('id', organizationId)

    } catch (error) {
      console.error('Handle payment failed error:', error)
    }
  }

  private static getPlanFromPriceId(priceId: string): string {
    const plan = PRICING_PLANS.find(p => p.stripePriceId === priceId)
    return plan?.id || 'basic'
  }

  static getPlanById(planId: string): PricingPlan | undefined {
    return PRICING_PLANS.find(plan => plan.id === planId)
  }

  static getAllPlans(): PricingPlan[] {
    return PRICING_PLANS
  }
}
