'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Phone, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // In demo mode or when supabase is null, skip auth check
      if (!supabase) {
        return
      }
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Voicemail Drop</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Professional Voicemail Campaigns for Car Dealerships
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Reach more customers with automated, TCPA-compliant voicemail drops. 
            Increase your sales outreach efficiency and connect with prospects at scale.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Easy Customer Management
            </h3>
            <p className="text-gray-600">
              Upload customer lists via CSV, manage contacts, and segment your audience 
              for targeted voicemail campaigns.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Automated Voicemail Delivery
            </h3>
            <p className="text-gray-600">
              Schedule and send personalized voicemail messages to hundreds of customers 
              with our Twilio-powered delivery system.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Real-Time Analytics
            </h3>
            <p className="text-gray-600">
              Track delivery rates, campaign performance, and customer engagement 
              with detailed analytics and reporting.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
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
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Boost Your Sales Outreach?
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Join hundreds of car dealerships using Voicemail Drop to connect with more customers.
          </p>
          <Link 
            href="/auth"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            100 free voicemails included • No credit card required • Set up in minutes
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900">Voicemail Drop</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 Voicemail Drop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
