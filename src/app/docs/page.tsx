'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, BookOpen, Search, FileText, Code, 
  Phone, Users, BarChart3, Settings, Zap, Shield,
  ChevronRight, ExternalLink, Download, Play
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'

const documentationSections = [
  {
    title: 'Getting Started',
    icon: Play,
    description: 'Quick setup and first campaign',
    articles: [
      { title: 'Account Setup', time: '5 min read', href: '#setup' },
      { title: 'Creating Your First Campaign', time: '10 min read', href: '#first-campaign' },
      { title: 'Uploading Customer Lists', time: '7 min read', href: '#upload-customers' },
      { title: 'Understanding Analytics', time: '8 min read', href: '#analytics' }
    ]
  },
  {
    title: 'Campaign Management',
    icon: Phone,
    description: 'Create and manage voicemail campaigns',
    articles: [
      { title: 'Campaign Types & Templates', time: '12 min read', href: '#campaign-types' },
      { title: 'Script Writing Best Practices', time: '15 min read', href: '#scripts' },
      { title: 'Scheduling & Delivery Options', time: '10 min read', href: '#scheduling' },
      { title: 'Campaign Performance Tracking', time: '8 min read', href: '#performance' }
    ]
  },
  {
    title: 'Customer Management',
    icon: Users,
    description: 'Organize and manage your contact lists',
    articles: [
      { title: 'Import Formats (CSV, Excel)', time: '6 min read', href: '#import-formats' },
      { title: 'Data Validation & Cleanup', time: '9 min read', href: '#data-validation' },
      { title: 'Segmentation & Targeting', time: '11 min read', href: '#segmentation' },
      { title: 'Privacy & Compliance', time: '13 min read', href: '#compliance' }
    ]
  },
  {
    title: 'Analytics & Reporting',
    icon: BarChart3,
    description: 'Track performance and optimize campaigns',
    articles: [
      { title: 'Understanding Delivery Metrics', time: '10 min read', href: '#metrics' },
      { title: 'Custom Reports & Exports', time: '8 min read', href: '#reports' },
      { title: 'ROI Calculation Methods', time: '12 min read', href: '#roi' },
      { title: 'A/B Testing Campaigns', time: '14 min read', href: '#ab-testing' }
    ]
  },
  {
    title: 'API Reference',
    icon: Code,
    description: 'Integrate with your existing systems',
    articles: [
      { title: 'Authentication & API Keys', time: '5 min read', href: '#api-auth' },
      { title: 'Campaign API Endpoints', time: '20 min read', href: '#api-campaigns' },
      { title: 'Customer API Endpoints', time: '15 min read', href: '#api-customers' },
      { title: 'Webhooks & Real-time Updates', time: '18 min read', href: '#webhooks' }
    ]
  },
  {
    title: 'Account & Billing',
    icon: Settings,
    description: 'Manage your account and subscription',
    articles: [
      { title: 'Plan Comparison & Upgrades', time: '7 min read', href: '#plans' },
      { title: 'Usage Monitoring & Limits', time: '6 min read', href: '#usage' },
      { title: 'Billing & Payment Methods', time: '5 min read', href: '#billing' },
      { title: 'Team Management & Permissions', time: '10 min read', href: '#team' }
    ]
  }
]

const quickLinks = [
  { title: 'API Reference', icon: Code, href: '#api', external: false },
  { title: 'Video Tutorials', icon: Play, href: '#videos', external: false },
  { title: 'Community Forum', icon: Users, href: 'https://community.voicedrop.com', external: true },
  { title: 'Status Page', icon: Shield, href: 'https://status.voicedrop.com', external: true },
  { title: 'Feature Requests', icon: Zap, href: '#feature-requests', external: false },
  { title: 'Download SDK', icon: Download, href: '#sdk', external: false }
]

const popularArticles = [
  { title: 'TCPA Compliance Guidelines', views: '12.3k', category: 'Compliance' },
  { title: 'Optimizing Delivery Times', views: '8.7k', category: 'Best Practices' },
  { title: 'Script Templates Library', views: '7.2k', category: 'Templates' },
  { title: 'Troubleshooting Failed Deliveries', views: '6.1k', category: 'Troubleshooting' },
  { title: 'Integration with Salesforce', views: '5.8k', category: 'Integrations' }
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would trigger documentation search
      console.log('Searching docs for:', searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Everything you need to know about VoiceDrop Pro. From getting started 
              to advanced integrations and best practices.
            </p>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <Card 
                key={index}
                className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg group cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <link.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.title}
                  </h3>
                  {link.external && (
                    <ExternalLink className="w-3 h-3 text-slate-400 mx-auto mt-1" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Main Documentation Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {documentationSections.map((section, index) => (
            <Card 
              key={index}
              className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                      {section.title}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link 
                        href={article.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                            {article.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {article.time}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Popular Articles
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Most viewed documentation articles this month
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Link 
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {article.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Card className="bg-blue-600 border-2 border-blue-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                Our support team is here to help. Contact us for personalized assistance 
                with your voicemail campaigns and platform setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Contact Support
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
