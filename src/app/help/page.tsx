'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Phone, MessageCircle, Book, Video, 
  Mail, ChevronDown, ChevronRight, HelpCircle,
  ExternalLink, Download, Users, Settings,
  Target, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode } from '@/lib/demo-data'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    question: "How do I create my first voicemail campaign?",
    answer: "Navigate to the Campaigns page and click 'New Campaign'. Follow the step-by-step wizard to upload your customer list, record or write your voicemail script, and schedule delivery.",
    category: "Getting Started"
  },
  {
    question: "What file formats can I upload for customer lists?",
    answer: "We support CSV and Excel (.xlsx) files. Your file should include columns for phone numbers, names, and any other customer data you want to use for personalization.",
    category: "Customer Management"
  },
  {
    question: "How much does each voicemail cost?",
    answer: "Pricing varies by plan and volume. Typically costs range from $0.02 to $0.05 per delivered voicemail. Check the Billing page for your current rates.",
    category: "Billing"
  },
  {
    question: "What's the best time to send voicemails?",
    answer: "Our analytics show the highest success rates between 10 AM - 2 PM and 4 PM - 6 PM on weekdays. Avoid early mornings, late evenings, and weekends.",
    category: "Best Practices"
  },
  {
    question: "How can I track campaign performance?",
    answer: "Visit the Analytics page to see detailed metrics including delivery rates, optimal timing, and regional performance data.",
    category: "Analytics"
  },
  {
    question: "Is voicemail dropping legal?",
    answer: "Yes, when done correctly. We help ensure TCPA compliance by providing opt-out mechanisms and respecting Do Not Call lists. Always follow local regulations.",
    category: "Legal & Compliance"
  }
]

const quickGuides = [
  {
    title: "Setting Up Your First Campaign",
    description: "Step-by-step guide to create and launch your first voicemail campaign",
    icon: Target,
    steps: ["Upload customer list", "Create voicemail script", "Schedule delivery", "Monitor results"]
  },
  {
    title: "Managing Customer Lists",
    description: "Best practices for organizing and segmenting your customer database",
    icon: Users,
    steps: ["Import from CSV/Excel", "Segment by criteria", "Update contact info", "Manage opt-outs"]
  },
  {
    title: "Analyzing Performance",
    description: "Understanding your campaign metrics and optimizing for better results",
    icon: BarChart3,
    steps: ["Review delivery rates", "Analyze response data", "Identify best times", "Optimize messaging"]
  },
  {
    title: "Account Settings",
    description: "Configuring your account preferences and notification settings",
    icon: Settings,
    steps: ["Set up profile", "Configure notifications", "Manage billing", "Update preferences"]
  }
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const categories = ['all', ...Array.from(new Set(faqData.map(faq => faq.category)))]

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            <HelpCircle className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800 font-medium">
              <strong>Demo Mode:</strong> Explore our comprehensive help center with sample FAQ and guides.
            </p>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of your voicemail campaigns.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search help articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-white/20"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-9 w-auto rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Need Immediate Help?</CardTitle>
              <CardDescription>Contact our support team directly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-bold">Live Chat</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg">
                  <Mail className="h-5 w-5" />
                  <span className="font-bold">Email Support</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg">
                  <Phone className="h-5 w-5" />
                  <span className="font-bold">Call Us</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    {filteredFAQs.length} questions found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <div key={index} className="border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm shadow-lg">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/60 rounded-xl transition-all duration-200"
                        >
                          <div>
                            <h3 className="font-bold text-gray-900">{faq.question}</h3>
                            <Badge variant="outline" className="mt-1 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-800 font-medium">
                              {faq.category}
                            </Badge>
                          </div>
                          {expandedFAQ === index ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        {expandedFAQ === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 pb-3 text-gray-700 border-t border-white/20"
                          >
                            <p className="pt-3 leading-relaxed">{faq.answer}</p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Guides */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Guides</CardTitle>
                  <CardDescription>Step-by-step tutorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quickGuides.map((guide, index) => (
                      <div key={index} className="border border-white/20 rounded-xl p-4 hover:shadow-lg hover:bg-white/60 transition-all duration-300 cursor-pointer bg-white/40 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                            <guide.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{guide.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                            <div className="space-y-1">
                              {guide.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Additional Resources</CardTitle>
                  <CardDescription>Documentation and downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg font-bold">
                      <Book className="h-4 w-4 mr-2" />
                      User Manual
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg font-bold">
                      <Video className="h-4 w-4 mr-2" />
                      Video Tutorials
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg font-bold">
                      <Download className="h-4 w-4 mr-2" />
                      Sample CSV Template
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg font-bold">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      API Documentation
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Still need help?
              </h2>
              <p className="text-gray-600 mb-4">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
