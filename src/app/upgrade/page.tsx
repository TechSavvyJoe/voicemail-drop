'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Check, Phone, BarChart3, 
  Headphones, Clock, Star, ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'

const plans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for small businesses getting started',
    features: [
      '500 voicemails per month',
      '2 campaign templates',
      'Basic analytics',
      'Email support',
      '30-day call history'
    ],
    limitations: [
      'No custom scripts',
      'Standard delivery times only'
    ],
    popular: false,
    current: true
  },
  {
    name: 'Professional',
    price: 149,
    description: 'Ideal for growing sales teams',
    features: [
      '2,500 voicemails per month',
      'Unlimited campaign templates',
      'Advanced analytics & reporting',
      'Priority email support',
      '90-day call history',
      'Custom script editor',
      'Scheduled delivery',
      'Team collaboration tools'
    ],
    limitations: [],
    popular: true,
    current: false
  },
  {
    name: 'Enterprise',
    price: 399,
    description: 'For large organizations with high volume needs',
    features: [
      '10,000 voicemails per month',
      'Unlimited everything',
      'Real-time analytics dashboard',
      '24/7 phone & email support',
      'Unlimited call history',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security features'
    ],
    limitations: [],
    popular: false,
    current: false
  }
]

const faqs = [
  {
    question: 'Can I change my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.'
  },
  {
    question: 'What happens if I exceed my monthly voicemail limit?',
    answer: 'You can purchase additional voicemails at $0.15 per message, or upgrade to a higher plan to get better rates and more included messages.'
  },
  {
    question: 'Do you offer annual discounts?',
    answer: 'Yes! Pay annually and save 20% on any plan. The annual discount is automatically applied at checkout.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer a 14-day free trial on our Professional plan so you can test all features before committing.'
  }
]

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const getPrice = (basePrice: number) => {
    return billingCycle === 'annual' ? Math.round(basePrice * 0.8) : basePrice
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Scale your voicemail campaigns with the right plan for your business. 
            Upgrade or downgrade at any time with no long-term commitments.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Save 20%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative bg-white dark:bg-slate-800 border-2 transition-all duration-200 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-105' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-emerald-600 text-white px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${getPrice(plan.price)}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  {billingCycle === 'annual' && plan.price !== getPrice(plan.price) && (
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      Save ${(plan.price - getPrice(plan.price)) * 12}/year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-2">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-slate-600 hover:bg-slate-700' 
                      : plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  } text-white ${plan.current ? 'cursor-default' : ''}`}
                  disabled={plan.current}
                >
                  {plan.current ? (
                    'Current Plan'
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                
                {plan.name === 'Professional' && !plan.current && (
                  <Button variant="outline" className="w-full mt-2 border-2">
                    Start Free Trial
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Why Upgrade?
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Unlock powerful features to scale your voicemail campaigns
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Higher Volume
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Send more voicemails per month with better pricing per message
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Advanced Analytics
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Detailed insights and reporting to optimize your campaigns
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Scheduled Delivery
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Schedule campaigns for optimal delivery times
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Priority Support
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Get faster responses and dedicated assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <ArrowRight 
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedFaq === index ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                    {expandedFaq === index && (
                      <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Card className="bg-blue-600 border-2 border-blue-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Scale Your Voicemail Campaigns?
              </h2>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                Join thousands of sales teams who trust VoiceDrop Pro to deliver 
                their message effectively and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
