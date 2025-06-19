'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Users, Upload, Search, Edit, Eye, 
  Phone, MoreVertical, UserPlus, Target, 
  AlertCircle, CheckCircle, Car, Filter, X, Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FunctionalNavigation } from '@/components/functional-navigation'
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
  createdAt: string
}

const statusConfig = {
  lead: { 
    label: 'Lead', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Target
  },
  prospect: { 
    label: 'Prospect', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Eye
  },
  customer: { 
    label: 'Customer', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle
  }
}

const priorityConfig = {
  low: { 
    label: 'Low', 
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  medium: { 
    label: 'Medium', 
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  high: { 
    label: 'High', 
    color: 'bg-red-100 text-red-700 border-red-200'
  }
}

export default function SimplifiedCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Simulate real-time data updates
  const { data: customers = [], isLoading, isError } = useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Customer[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (isDemoMode) {
        return demoCustomers
      }
      
      // In real app, fetch from API
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      return response.json()
    },
    refetchInterval: isDemoMode ? 30000 : false,
  })

  // Enhanced filtering and sorting
  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.vehicleInterest && customer.vehicleInterest.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })

    return filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [customers, searchTerm, statusFilter, priorityFilter])

  const stats = useMemo(() => {
    const total = customers.length
    const leads = customers.filter(c => c.status === 'lead').length
    const prospects = customers.filter(c => c.status === 'prospect').length
    const customersCount = customers.filter(c => c.status === 'customer').length
    const highPriority = customers.filter(c => c.priority === 'high').length
    
    return { total, leads, prospects, customers: customersCount, highPriority }
  }, [customers])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <FunctionalNavigation />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading customers...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <FunctionalNavigation />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Error Loading Customers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Something went wrong. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <FunctionalNavigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Customer Management
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Manage your customer database and contact information
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/customers/upload">
                <Button variant="outline" className="border-slate-200 dark:border-slate-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </Link>
              <Link href="/customers/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Customer
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Leads</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.leads}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Prospects</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.prospects}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Customers</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.customers}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">High Priority</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.highPriority}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search customers by name, phone, or vehicle interest..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Status:</span>
                    {['all', 'lead', 'prospect', 'customer'].map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                      >
                        {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig]?.label || status}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Priority:</span>
                    {['all', 'low', 'medium', 'high'].map((priority) => (
                      <Button
                        key={priority}
                        variant={priorityFilter === priority ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPriorityFilter(priority)}
                        className="capitalize"
                      >
                        {priority === 'all' ? 'All' : priorityConfig[priority as keyof typeof priorityConfig]?.label || priority}
                      </Button>
                    ))}
                  </div>
                  
                  {(statusFilter !== 'all' || priorityFilter !== 'all') && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStatusFilter('all')
                          setPriorityFilter('all')
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Customers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredAndSortedCustomers.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? 'No customers found' : 'No customers yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Add your first customer to get started'
                  }
                </p>
                {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && (
                  <div className="flex gap-3 justify-center">
                    <Link href="/customers/new">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Customer
                      </Button>
                    </Link>
                    <Link href="/customers/upload">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedCustomers.map((customer, index) => {
                const status = statusConfig[customer.status]
                const priority = priorityConfig[customer.priority]
                const StatusIcon = status?.icon || Users

                return (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                              </span>
                            </div>
                            
                            {/* Customer Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {customer.firstName} {customer.lastName}
                                </h3>
                                <Badge className={`${status?.color} border`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status?.label}
                                </Badge>
                                <Badge className={`${priority?.color} border`}>
                                  {priority?.label} Priority
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600 dark:text-slate-400">{customer.phoneNumber}</span>
                                </div>
                                {customer.vehicleInterest && (
                                  <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">{customer.vehicleInterest}</span>
                                  </div>
                                )}
                                <div className="text-slate-500 dark:text-slate-500">
                                  Added {new Date(customer.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Link href={`/customers/${customer.id}`}>
                              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/customers/${customer.id}/edit`}>
                              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/customers/${customer.id}`}>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                </Link>
                                <Link href={`/customers/${customer.id}/edit`}>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Customer
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Delete Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Results Summary */}
        {filteredAndSortedCustomers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredAndSortedCustomers.length} of {customers.length} customers
              {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                <Button
                  variant="link"
                  className="ml-2 p-0 h-auto text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
