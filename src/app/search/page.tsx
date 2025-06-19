'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Search, Clock, Phone, Users, 
  FileText, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'

interface Campaign {
  id: string
  name: string
  type: 'campaign'
  description: string
  status: string
  created_at: string
  delivered_count: number
}

interface Customer {
  id: string
  firstName: string
  lastName: string
  type: 'customer'
  phoneNumber: string
  email: string
  status: string
}

interface Doc {
  id: string
  title: string
  type: 'documentation'
  description: string
  section: string
  readTime: string
}

interface SearchResults {
  campaigns: Campaign[]
  customers: Customer[]
  docs: Doc[]
}

// Mock search results
const mockResults: SearchResults = {
  campaigns: [
    {
      id: '1',
      name: 'Holiday Sales Push',
      type: 'campaign' as const,
      description: 'End-of-year promotion targeting existing customers',
      status: 'completed',
      created_at: '2024-01-15',
      delivered_count: 234
    },
    {
      id: '2', 
      name: 'New Product Launch',
      type: 'campaign' as const,
      description: 'Introducing our latest service offering',
      status: 'running',
      created_at: '2024-01-20',
      delivered_count: 156
    }
  ],
  customers: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      type: 'customer' as const,
      phoneNumber: '+1 (555) 123-4567',
      email: 'john.smith@example.com',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson', 
      type: 'customer' as const,
      phoneNumber: '+1 (555) 987-6543',
      email: 'sarah.j@example.com',
      status: 'active'
    }
  ],
  docs: [
    {
      id: '1',
      title: 'Getting Started with Campaigns',
      type: 'documentation' as const,
      description: 'Learn how to create your first voicemail campaign',
      section: 'Getting Started',
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'Customer Import Guidelines',
      type: 'documentation' as const, 
      description: 'Best practices for importing customer data',
      section: 'Customer Management',
      readTime: '8 min read'
    }
  ]
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdvancedNavigation />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [results, setResults] = useState<SearchResults>({ campaigns: [], customers: [], docs: [] })
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter mock results based on query
    const filteredResults = {
      campaigns: mockResults.campaigns.filter(campaign => 
        campaign.name.toLowerCase().includes(query.toLowerCase()) ||
        campaign.description.toLowerCase().includes(query.toLowerCase())
      ),
      customers: mockResults.customers.filter(customer =>
        customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      ),
      docs: mockResults.docs.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.description.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    setResults(filteredResults)
    setIsSearching(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
    }
  }

  const getTotalResults = () => {
    if (!results.campaigns) return 0
    return results.campaigns.length + results.customers.length + results.docs.length
  }

  const getFilteredResults = () => {
    if (selectedType === 'all') return results
    
    const key = selectedType as keyof SearchResults
    return { [selectedType]: results[key] || [] }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'campaign': return Phone
      case 'customer': return Users
      case 'documentation': return FileText
      default: return Search
    }
  }

  const getItemTitle = (item: Campaign | Customer | Doc) => {
    if ('name' in item) return item.name
    if ('title' in item) return item.title
    if ('firstName' in item && 'lastName' in item) return `${item.firstName} ${item.lastName}`
    return 'Unknown'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search campaigns, customers, or documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>

          {/* Results Summary */}
          {getTotalResults() > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">
                Found {getTotalResults()} results for &quot;{searchQuery}&quot;
              </p>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {['all', 'campaigns', 'customers', 'docs'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="capitalize"
                  >
                    {type === 'docs' ? 'Documentation' : type}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Searching...</p>
          </motion.div>
        )}

        {/* No Results */}
        {!isSearching && searchQuery && getTotalResults() === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
              <CardContent className="p-12">
                <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try:
                </p>
                <ul className="text-slate-600 dark:text-slate-400 text-left max-w-md mx-auto space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using different keywords</li>
                  <li>• Searching for broader terms</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {!isSearching && getTotalResults() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {Object.entries(getFilteredResults()).map(([category, items]) => {
              if (!items || items.length === 0) return null
              
              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 capitalize flex items-center gap-3">
                    {category === 'docs' ? (
                      <>
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Documentation
                      </>
                    ) : (
                      <>
                        {category === 'campaigns' && <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        {category === 'customers' && <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        {category}
                      </>
                    )}
                    <Badge variant="outline" className="ml-auto">
                      {items.length} {items.length === 1 ? 'result' : 'results'}
                    </Badge>
                  </h2>
                  
                  <div className="space-y-4">
                    {items.map((item: Campaign | Customer | Doc) => {
                      const Icon = getIcon(item.type)
                      
                      return (
                        <Card 
                          key={item.id}
                          className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg group"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {getItemTitle(item)}
                                    </h3>
                                    
                                    {'description' in item && item.description && (
                                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                                        {item.description}
                                      </p>
                                    )}
                                    
                                    {'email' in item && item.email && (
                                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                                        {item.email}
                                      </p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mt-3">
                                      {'status' in item && item.status && (
                                        <Badge 
                                          variant="outline"
                                          className={`
                                            ${item.status === 'running' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : ''}
                                            ${item.status === 'completed' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                                            ${item.status === 'active' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : ''}
                                          `}
                                        >
                                          {item.status}
                                        </Badge>
                                      )}
                                      
                                      {'section' in item && item.section && (
                                        <Badge variant="outline">
                                          {item.section}
                                        </Badge>
                                      )}
                                      
                                      {'readTime' in item && item.readTime && (
                                        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {item.readTime}
                                        </span>
                                      )}
                                      
                                      {'delivered_count' in item && item.delivered_count && (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                          {item.delivered_count} delivered
                                        </span>
                                      )}
                                      
                                      {'phoneNumber' in item && item.phoneNumber && (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                          {item.phoneNumber}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-4" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* Search Tips */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Search Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Campaigns</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Search by campaign name, status, or description to find specific voicemail campaigns
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Customers</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Find customers by name, email, or phone number across your contact lists
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Documentation</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Search help articles, guides, and API documentation by topic or keyword
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
