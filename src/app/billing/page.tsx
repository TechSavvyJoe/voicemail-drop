'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  CreditCard, Crown, Star, Check, AlertCircle, TrendingUp, 
  Calendar, DollarSign, Receipt, Download, Settings, 
  Shield, Zap, Users, Phone, BarChart3, CheckCircle,
  Clock, ArrowRight, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode } from '@/lib/demo-data'

interface BillingData {
  subscription: {
    subscription_plan: string
    subscription_status: string
    current_period_end: string
    voicemails_used: number
    voicemails_limit: number
    monthly_spend: number
    savings: number
  }
  usage_history: Array<{
    date: string
    voicemails: number
    cost: number
  }>
  invoices: Array<{
    id: string
    date: string
    amount: number
    status: string
    download_url?: string
  }>
}

const PRICE_TIERS = {
  STARTER: {
    name: 'Starter',
    price: 29,
    voicemails: 500,
    features: [
      'Up to 500 voicemails/month',
      'Basic analytics',
      'Email support',
      'Standard templates',
      'CSV import/export'
    ]
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 79,
    voicemails: 2000,
    features: [
      'Up to 2,000 voicemails/month',
      'Advanced analytics & reporting',
      'Priority support',
      'Custom voicemail scripts',
      'Advanced filtering',
      'Team collaboration',
      'API access'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 199,
    voicemails: 10000,
    features: [
      'Up to 10,000 voicemails/month',
      'Enterprise analytics',
      'Dedicated support manager',
      'White-label options',
      'Advanced integrations',
      'Multi-location support',
      'Custom reporting',
      'SLA guarantee'
    ]
  }
}

export default function BillingPage() {
  const [upgrading, setUpgrading] = useState<string | null>(null)

  // Simulate billing data
  const { data: billingData, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: async (): Promise<BillingData> => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        subscription: {
          subscription_plan: 'professional',
          subscription_status: isDemoMode ? 'trial' : 'active',
          current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          voicemails_used: 1247,
          voicemails_limit: 2000,
          monthly_spend: 79,
          savings: 156
        },
        usage_history: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          voicemails: Math.floor(Math.random() * 100) + 20,
          cost: Math.floor(Math.random() * 10) + 2
        })),
        invoices: [
          { id: 'INV-001', date: '2024-01-01', amount: 79, status: 'paid' },
          { id: 'INV-002', date: '2024-02-01', amount: 79, status: 'paid' },
          { id: 'INV-003', date: '2024-03-01', amount: 79, status: 'pending' }
        ]
      }
    },
    refetchInterval: 30000
  })

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan)
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUpgrading(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading || !billingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <AdvancedNavigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/60 backdrop-blur-sm rounded-xl w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm border border-white/20 p-6 rounded-xl h-32 shadow-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm border border-white/20 p-6 rounded-xl h-64 shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlan = billingData.subscription.subscription_plan
  const usagePercentage = (billingData.subscription.voicemails_used / billingData.subscription.voicemails_limit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AdvancedNavigation />
      
      {/* Demo Banner */}
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-6 bg-white/70 backdrop-blur-md border border-blue-200/50 rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800 font-medium">
              <strong>Demo Mode:</strong> This is a simulated billing dashboard with sample subscription and usage data.
            </p>
          </div>
        </motion.div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Billing & Subscription
            </h1>
            <p className="text-gray-600 text-lg">Manage your subscription, view usage analytics, and download invoices.</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg">
              <Settings className="h-4 w-4" />
              Billing Settings
            </Button>
          </div>
        </motion.div>

        {/* Current Plan & Usage Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold capitalize text-gray-900">
                      {currentPlan} Plan
                    </span>
                    <Badge className={
                      billingData.subscription.subscription_status === 'active'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium'
                        : billingData.subscription.subscription_status === 'trial'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium'
                    }>
                      {billingData.subscription.subscription_status === 'trial' ? 'Free Trial' : 
                       billingData.subscription.subscription_status}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(billingData.subscription.monthly_spend)}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {billingData.subscription.subscription_status === 'trial' ? 'Trial ends' : 'Next billing'} on{' '}
                    {new Date(billingData.subscription.current_period_end).toLocaleDateString()}
                  </div>
                  {billingData.subscription.savings > 0 && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-200">
                      <TrendingUp className="h-4 w-4" />
                      You&apos;re saving {formatCurrency(billingData.subscription.savings)} annually
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage This Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Usage This Month
                </CardTitle>
                <CardDescription>Track your voicemail usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Voicemails sent</span>
                    <span className="font-bold text-gray-900">
                      {billingData.subscription.voicemails_used.toLocaleString()} / {billingData.subscription.voicemails_limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-3 rounded-full shadow-sm ${
                        usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        usagePercentage >= 75 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                        'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                    ></motion.div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {usagePercentage >= 90 ? (
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Running low! Consider upgrading.
                      </span>
                    ) : (
                      `${Math.round(100 - usagePercentage)}% remaining this month`
                    )}
                  </p>
                  <div className="text-3xl font-bold text-gray-900">
                    {(billingData.subscription.voicemails_limit - billingData.subscription.voicemails_used).toLocaleString()}
                    <span className="text-lg font-normal text-gray-600"> left</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Account Summary
                </CardTitle>
                <CardDescription>Your billing overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly cost</span>
                    <span className="font-bold text-gray-900">{formatCurrency(billingData.subscription.monthly_spend)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost per voicemail</span>
                    <span className="font-bold text-gray-900">${(billingData.subscription.monthly_spend / billingData.subscription.voicemails_limit).toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total invoices</span>
                    <span className="font-bold text-gray-900">{billingData.invoices.length}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">Next payment</span>
                      <span className="font-bold text-xl text-gray-900">{formatCurrency(billingData.subscription.monthly_spend)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Due {new Date(billingData.subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Available Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Choose Your Plan</CardTitle>
              <CardDescription>
                Upgrade or downgrade your subscription at any time. Changes take effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(PRICE_TIERS).map(([key, plan]) => {
                  const isCurrentPlan = currentPlan.toUpperCase() === key
                  const isPopular = key === 'PROFESSIONAL'

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * Object.keys(PRICE_TIERS).indexOf(key) }}
                      className={`relative border rounded-xl p-6 backdrop-blur-md shadow-xl ${
                        isCurrentPlan
                          ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200'
                          : isPopular
                          ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50/80 to-pink-50/80 border-purple-200'
                          : 'bg-white/70 border-white/20 hover:shadow-2xl hover:bg-white/80 transition-all duration-300'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Most Popular
                          </span>
                        </div>
                      )}

                      {isCurrentPlan && (
                        <div className="absolute -top-3 right-4">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Current Plan
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                          {formatCurrency(plan.price)}
                          <span className="text-lg font-normal text-gray-600">/month</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{plan.voicemails.toLocaleString()} voicemails per month</p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full font-bold ${
                          isCurrentPlan 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : isPopular 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg' 
                              : 'bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/90 text-gray-900 shadow-lg'
                        }`}
                        variant={isCurrentPlan ? 'secondary' : isPopular ? 'default' : 'outline'}
                        disabled={isCurrentPlan || upgrading === key}
                        onClick={() => !isCurrentPlan && handleUpgrade(key.toLowerCase())}
                      >
                        {upgrading === key ? (
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing...
                          </div>
                        ) : isCurrentPlan ? (
                          'Current Plan'
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            {currentPlan === 'starter' ? 'Upgrade to ' + plan.name : 'Switch to ' + plan.name}
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing History & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Receipt className="h-5 w-5 text-gray-500" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>View and download your billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingData.invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white/80 border border-gray-200/50 rounded-xl backdrop-blur-sm">
                      <div>
                        <p className="font-bold text-gray-900">{invoice.id}</p>
                        <p className="text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'} 
                               className={invoice.status === 'paid' 
                                 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold' 
                                 : 'bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold'}>
                          {invoice.status}
                        </Badge>
                        <span className="font-bold text-gray-900">{formatCurrency(invoice.amount)}</span>
                        <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Why Upgrade?
                </CardTitle>
                <CardDescription>Unlock powerful features for your growing business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: Zap,
                      title: 'Advanced Analytics',
                      description: 'Deep insights into campaign performance and customer engagement'
                    },
                    {
                      icon: Users,
                      title: 'Team Collaboration',
                      description: 'Share campaigns and data with your entire sales team'
                    },
                    {
                      icon: Phone,
                      title: 'Premium Voice Quality',
                      description: 'Crystal-clear voicemails that sound professional'
                    },
                    {
                      icon: Clock,
                      title: 'Priority Support',
                      description: '24/7 dedicated support for business-critical needs'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm border border-blue-100/50">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                        <feature.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
