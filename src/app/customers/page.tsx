'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Users, Upload, Download, Search, Calendar, Edit, Eye, 
  Phone, MoreVertical, Trash2, 
  UserPlus, Target, AlertCircle, CheckCircle, Car
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { isDemoMode, demoCustomers } from '@/lib/demo-data'

interface Customer {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  vehicleInterest?: string
  lastContact?: string
  status: 'lead' | 'prospect' | 'customer'
  priority: 'low' | 'medium' | 'high'
  source: string
  tags: string[]
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority'>('name')

  // Simulate real-time data updates
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Customer[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return isDemoMode ? demoCustomers.map(customer => ({
        ...customer,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        source: ['Website', 'Referral', 'Social Media', 'Advertisement'][Math.floor(Math.random() * 4)],
        tags: ['Hot Lead', 'Repeat Customer', 'VIP', 'New'].slice(0, Math.floor(Math.random() * 3) + 1)
      })) : []
    },
    refetchInterval: 30000, // Refetch every 30 seconds for demo
  })

  // Calculate real-time stats for voicemail campaigns (no customer value tracking)
  const stats = {
    total: customers.length,
    customers: customers.filter((c: Customer) => c.status === 'customer').length,
    prospects: customers.filter((c: Customer) => c.status === 'prospect').length,
    leads: customers.filter((c: Customer) => c.status === 'lead').length,
    highPriority: customers.filter((c: Customer) => c.priority === 'high').length,
    recentContacts: customers.filter((c: Customer) => c.lastContact && 
      new Date(c.lastContact) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  }

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer: Customer) => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        (customer.vehicleInterest && customer.vehicleInterest.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.source && customer.source.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a: Customer, b: Customer) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case 'date':
          return new Date(b.lastContact || 0).getTime() - new Date(a.lastContact || 0).getTime()
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
        default:
          return 0
      }
    })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      lead: { label: 'Lead', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold' },
      prospect: { label: 'Prospect', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold' },
      customer: { label: 'Customer', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.lead
    return <Badge className={`${config.color} border-0 shadow-lg`}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Low', color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold' },
      medium: { label: 'Medium', color: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold' },
      high: { label: 'High', color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold' },
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low
    return <Badge className={`${config.color} border-0 shadow-lg`}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <AdvancedNavigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/60 backdrop-blur-sm rounded-xl w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm border border-white/20 p-6 rounded-xl h-32 shadow-lg"></div>
              ))}
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 p-6 rounded-xl h-64 shadow-lg"></div>
          </div>
        </div>
      </div>
    )
  }

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
              <strong>Demo Mode:</strong> Manage customer contacts for voicemail drop campaigns with sample data.
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
              Customer Management
            </h1>
            <p className="text-gray-600 text-lg">Manage your voicemail drop campaign contacts and target lists.</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 shadow-lg">
              <Download className="h-4 w-4" />
              Export Contacts
            </Button>
            <Link href="/customers/upload">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg">
                <Upload className="h-4 w-4" />
                Import Contacts
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards - No customer value tracking */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Contacts',
              value: stats.total.toLocaleString(),
              icon: Users,
              gradient: 'from-blue-500 to-blue-600',
              change: '+12%'
            },
            {
              title: 'Active Customers',
              value: stats.customers.toLocaleString(),
              icon: Target,
              gradient: 'from-emerald-500 to-emerald-600',
              change: '+8%'
            },
            {
              title: 'High Priority',
              value: stats.highPriority.toLocaleString(),
              icon: AlertCircle,
              gradient: 'from-red-500 to-red-600',
              change: '+5%'
            },
            {
              title: 'Recent Contacts',
              value: stats.recentContacts.toLocaleString(),
              icon: Calendar,
              gradient: 'from-blue-500 to-blue-600',
              change: '+15%'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-12 -mt-12`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 font-bold mt-1">{stat.change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name, phone, or vehicle interest..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-white/20"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-9 rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="lead">Leads</option>
                    <option value="prospect">Prospects</option>
                    <option value="customer">Customers</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="flex h-9 rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="Filter by priority"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'priority')}
                    className="flex h-9 rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="Sort by"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Customer Contacts ({filteredCustomers.length})
                </div>
                <div className="flex gap-2">
                  <Link href="/customers/upload">
                    <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </Link>
                </div>
              </CardTitle>
              <CardDescription>
                Manage contacts for your voicemail drop campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No customers found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Start by importing your first customer list.'}
                  </p>
                  <Link href="/customers/upload">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Customer List
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCustomers.map((customer, index) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border border-white/20 rounded-xl p-4 hover:shadow-lg hover:bg-white/80 transition-all duration-300 bg-white/60 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {customer.firstName} {customer.lastName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600 font-medium">{customer.phoneNumber}</span>
                            </div>
                            {customer.vehicleInterest && (
                              <div className="flex items-center gap-2 mt-1">
                                <Car className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">{customer.vehicleInterest}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                              {getStatusBadge(customer.status)}
                              {getPriorityBadge(customer.priority)}
                            </div>
                            {customer.lastContact && (
                              <span className="text-sm text-gray-500">
                                Last contact: {new Date(customer.lastContact).toLocaleDateString()}
                              </span>
                            )}
                            <div className="flex gap-1">
                              {customer.tags.map((tag, tagIndex) => (
                                <Badge 
                                  key={tagIndex} 
                                  variant="outline" 
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border-white/20 shadow-xl">
                              <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.id}`} className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.id}/edit`} className="flex items-center">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Contact
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Contact
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
