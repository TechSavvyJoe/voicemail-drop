'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Users, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { isDemoMode, demoPlans } from '@/lib/demo-data'
import { AdvancedNavigation } from '@/components/advanced-navigation'

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  
  // Use demo plans or fallback plans
  const plans = isDemoMode ? demoPlans : [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      features: [
        'Up to 500 voicemails/month',
        'Basic analytics',
        'Email support',
        'CSV upload',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 149,
      popular: true,
      features: [
        'Up to 2,500 voicemails/month',
        'Advanced analytics',
        'Priority support',
        'CSV & Excel upload',
        'Custom scripts',
        'Schedule campaigns',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 349,
      features: [
        'Up to 10,000 voicemails/month',
        'White-label solution',
        'Dedicated support',
        'API access',
        'Custom integrations',
        'Advanced compliance tools',
      ],
    },
  ]

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      if (isDemoMode) {
        // In demo mode, redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        // In real mode, would redirect to Stripe checkout
        setTimeout(() => {
          router.push('/auth')
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to process plan selection', error)
    } finally {
      setIsLoading(null)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="h-6 w-6" />
      case 'pro':
        return <Users className="h-6 w-6" />
      case 'enterprise':
        return <Crown className="h-6 w-6" />
      default:
        return <Zap className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AdvancedNavigation />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            Choose Your VoiceMail Pro Plan
          </h1>
          <p className="text-xl text-gray-700 font-medium max-w-4xl mx-auto leading-relaxed">
            Supercharge your car dealership sales with automated voicemail drops. 
            Start your free trial today and see results immediately.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'border-blue-500/50 scale-105 bg-gradient-to-br from-blue-50/50 to-indigo-50/50' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 font-bold px-4 py-2">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center p-8 pb-6">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-xl shadow-lg ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                      : 'bg-gradient-to-br from-gray-500 to-slate-600 text-white'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                <p className="text-gray-600 font-medium mb-6">
                  Perfect for car dealerships of all sizes
                </p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2 font-medium">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    Professional voicemail campaign features
                  </p>
                </div>
              </div>

              <div className="p-8 pt-0">
                <Button
                  className={`w-full mb-8 py-3 font-bold text-lg ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0' 
                      : 'bg-gradient-to-r from-gray-800 to-slate-900 hover:from-gray-900 hover:to-slate-950 text-white border-0'
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading === plan.id}
                >
                  {isLoading === plan.id ? 'Processing...' : 'Start Free Trial'}
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-4 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose VoiceMail Pro?
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Built specifically for automotive professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Direct to Voicemail</h3>
              <p className="text-gray-700 font-medium">Skip the conversation, deliver your message directly to voicemail</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">TCPA Compliant</h3>
              <p className="text-gray-700 font-medium">Stay compliant with all telecommunications regulations</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-700 font-medium">Track delivery rates, callbacks, and campaign performance</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-700 font-medium">Send hundreds of voicemails in minutes, not hours</p>
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900">How does the free trial work?</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  Start with a 14-day free trial that includes 100 voicemail credits. 
                  No credit card required to get started.
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Can I change plans anytime?</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time 
                  from your account dashboard.
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900">What file formats do you support?</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  We support CSV and Excel files for customer uploads. Our system can 
                  automatically map common field names.
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Is this TCPA compliant?</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  Yes, our platform is designed to help you stay compliant with TCPA 
                  regulations. Always ensure you have proper consent.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="text-center"
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-16 shadow-2xl text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Boost Your Sales?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
              Join thousands of successful car salespeople who trust VoiceMail Pro 
              to connect with their customers efficiently.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-4 font-bold border-0 shadow-lg"
              onClick={() => router.push('/auth')}
            >
              Start Your Free Trial Today
            </Button>
            <p className="text-sm text-blue-200 mt-6 font-medium">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
