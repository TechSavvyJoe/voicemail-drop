'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { isDemoMode } from '@/lib/demo-data'
import Link from 'next/link'
import { Phone, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      if (isDemoMode) {
        // In demo mode, allow access without authentication
        return
      }
      
      try {
        const { supabase } = await import('@/lib/supabase')
        
        // In demo mode or when supabase is null, skip auth check
        if (!supabase) {
          return
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // User is logged in, redirect to dashboard
          router.push('/dashboard')
        }
      } catch {
        console.log('Running in demo mode due to missing Supabase configuration')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-sm bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-yellow-200/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-yellow-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    <strong>Demo Mode:</strong> This is a fully functional demo. All features are available for testing.
                    <Link href="/dashboard" className="ml-2 underline font-bold hover:text-yellow-900">
                      Try the Dashboard →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 border-b border-white/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg mr-3">
                <Phone className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Voicemail Drop
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isDemoMode ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                    Demo Dashboard
                  </Link>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 font-bold">
                    <Link href="/dashboard">Try Demo</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                    Sign In
                  </Link>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 font-bold">
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">
            Professional Voicemail Campaigns for Car Dealerships
          </h2>
          <p className="text-xl text-gray-700 font-medium mb-10 max-w-4xl mx-auto leading-relaxed">
            Reach more customers with automated, TCPA-compliant voicemail drops. 
            Increase your sales outreach efficiency and connect with prospects at scale.
          </p>
          <div className="flex justify-center space-x-6">
            {isDemoMode ? (
              <>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-bold border-0 shadow-xl">
                  <Link href="/dashboard" className="flex items-center">
                    Try Full Demo
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 px-10 py-4 text-lg font-bold bg-white/70 hover:bg-white/90 backdrop-blur-sm">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-bold border-0 shadow-xl">
                  <Link href="/auth" className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 px-10 py-4 text-lg font-bold bg-white/70 hover:bg-white/90 backdrop-blur-sm">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <div className="backdrop-blur-md bg-white/70 border border-white/50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Easy Customer Management
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Upload customer lists via CSV, manage contacts, and segment your audience 
              for targeted voicemail campaigns.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/70 border border-white/50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Automated Voicemail Delivery
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Schedule and send personalized voicemail messages to hundreds of customers 
              with our Twilio-powered delivery system.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/70 border border-white/50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Real-Time Analytics
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Track delivery rates, campaign performance, and customer engagement 
              with detailed analytics and reporting.
            </p>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl p-10 mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Everything You Need for Successful Voicemail Campaigns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'TCPA Compliant Delivery',
              'CSV Customer Upload',
              'Campaign Scheduling',
              'Real-time Delivery Tracking',
              'Multi-user Organization Support',
              'Professional Voice Scripts',
              'Detailed Analytics Dashboard',
              'Stripe Billing Integration',
              'Export Campaign Results',
              'Mobile-Responsive Interface'
            ].map((feature, index) => (
              <div key={index} className="flex items-center py-2">
                <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                <span className="text-gray-800 font-medium text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-md bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white shadow-2xl"
        >
          <h3 className="text-3xl font-bold mb-6">
            Ready to Boost Your Sales Outreach?
          </h3>
          <p className="text-blue-100 mb-8 text-xl font-medium max-w-2xl mx-auto">
            Join hundreds of car dealerships using Voicemail Drop to connect with more customers.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold border-0 shadow-lg">
            <Link href="/auth" className="flex items-center">
              Start Your Free Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-blue-200 text-sm mt-6 font-medium">
            100 free voicemails included • No credit card required • Set up in minutes
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/70 border-t border-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg mr-3">
                <Phone className="h-5 w-5" />
              </div>
              <span className="font-bold text-gray-900 text-lg">Voicemail Drop</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              © 2024 Voicemail Drop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
