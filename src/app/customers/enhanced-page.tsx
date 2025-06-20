'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, Upload, Search, Download, 
  Edit, Eye, Trash2, Plus, CheckCircle, Phone,
  Mail, Car, Calendar,
  MessageSquare, Star
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { demoCustomers } from '@/lib/demo-data'

// Enhanced customer interface with automotive-specific fields
interface EnhancedCustomer {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  vehicleInterest?: string
  lastContact?: string
  status: 'lead' | 'customer' | 'inactive'
  priority: 'low' | 'medium' | 'high' | 'hot'
  source: 'website' | 'referral' | 'walk-in' | 'phone' | 'trade-in'
  assignedTo?: string
  tags: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  lead: 'bg-blue-100 text-blue-800 border-blue-200',
  customer: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200'
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  hot: 'bg-red-100 text-red-700 border-red-200'
}

export default function EnhancedCustomersPage() {
  const [customers] = useState<EnhancedCustomer[]>(
    demoCustomers.map(customer => ({
      ...customer,
      status: 'lead' as const,
      priority: 'medium' as const,
      source: 'website' as const,
      assignedTo: 'John Smith',
      tags: ['potential-buyer', 'financing'],
      notes: 'Interested in SUV models, prefers automatic transmission',
      updatedAt: 'updatedAt' in customer ? customer.updatedAt as string : customer.createdAt
    }))
  )
  
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.vehicleInterest?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
      const matchesPriority = filterPriority === 'all' || customer.priority === filterPriority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [customers, searchTerm, filterStatus, filterPriority])

  const stats = useMemo(() => {
    const total = customers.length
    const leads = customers.filter(c => c.status === 'lead').length
    const activeCustomers = customers.filter(c => c.status === 'customer').length
    const hotLeads = customers.filter(c => c.priority === 'hot').length
    const recent = customers.filter(c => {
      const lastContact = new Date(c.lastContact || c.createdAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return lastContact > weekAgo
    }).length

    return { total, leads, activeCustomers, hotLeads, recent }
  }, [customers])

  // Enhanced data table columns with automotive focus
  const columns = [
    {
      key: 'name' as keyof EnhancedCustomer,
      header: 'Customer',
      sortable: true,
      render: (value: unknown, customer: EnhancedCustomer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <div className="font-semibold text-slate-900">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-sm text-slate-500">{customer.phoneNumber}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email' as keyof EnhancedCustomer,
      header: 'Contact',
      render: (value: unknown, customer: EnhancedCustomer) => (
        <div className="space-y-1">
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-slate-400" />
              <span className="text-slate-600">{customer.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600">{customer.phoneNumber}</span>
          </div>
        </div>
      )
    },
    {
      key: 'vehicleInterest' as keyof EnhancedCustomer,
      header: 'Vehicle Interest',
      sortable: true,
      render: (value: unknown, customer: EnhancedCustomer) => (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-slate-400" />
          <span className="text-slate-700">{customer.vehicleInterest || 'Not specified'}</span>
        </div>
      )
    },
    {
      key: 'status' as keyof EnhancedCustomer,
      header: 'Status',
      sortable: true,
      render: (value: unknown, customer: EnhancedCustomer) => (
        <Badge className={statusColors[customer.status]}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </Badge>
      )
    },
    {
      key: 'priority' as keyof EnhancedCustomer,
      header: 'Priority',
      sortable: true,
      render: (value: unknown, customer: EnhancedCustomer) => (
        <Badge className={priorityColors[customer.priority]}>
          {customer.priority === 'hot' && <Star className="h-3 w-3 mr-1" />}
          {customer.priority.charAt(0).toUpperCase() + customer.priority.slice(1)}
        </Badge>
      )
    },
    {
      key: 'assignedTo' as keyof EnhancedCustomer,
      header: 'Assigned To',
      render: (value: unknown, customer: EnhancedCustomer) => (
        <span className="text-slate-700">{customer.assignedTo || 'Unassigned'}</span>
      )
    },
    {
      key: 'lastContact' as keyof EnhancedCustomer,
      header: 'Last Contact',
      sortable: true,
      render: (value: unknown, customer: EnhancedCustomer) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-3 w-3 text-slate-400" />
          {customer.lastContact 
            ? new Date(customer.lastContact).toLocaleDateString()
            : 'Never'
          }
        </div>
      )
    },
    {
      key: 'actions' as keyof EnhancedCustomer,
      header: 'Actions',
      render: (value: unknown, customer: EnhancedCustomer) => (
        <div className="flex items-center gap-2">
          <Link href={`/customers/${customer.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/customers/${customer.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const bulkActions = [
    {
      label: 'Assign to Me',
      icon: Users,
      action: (selected: EnhancedCustomer[]) => {
        console.log('Assigning to current user:', selected)
      }
    },
    {
      label: 'Mark as Hot Lead',
      icon: Star,
      action: (selected: EnhancedCustomer[]) => {
        console.log('Marking as hot leads:', selected)
      }
    },
    {
      label: 'Send Message',
      icon: MessageSquare,
      action: (selected: EnhancedCustomer[]) => {
        console.log('Sending message to:', selected)
      }
    },
    {
      label: 'Export',
      icon: Download,
      action: (selected: EnhancedCustomer[]) => {
        console.log('Exporting:', selected)
      }
    },
    {
      label: 'Delete',
      icon: Trash2,
      action: (selected: EnhancedCustomer[]) => {
        console.log('Deleting:', selected)
      },
      variant: 'destructive' as const
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <AdvancedNavigation />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Enhanced Header with Automotive Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border-2 border-slate-200 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">
                  Customer Management
                </h1>
                <p className="text-lg text-slate-600">
                  Comprehensive customer relationship management for automotive sales
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 shadow-lg border-2 border-blue-600">
                  <Upload className="w-5 h-5 mr-2" />
                  Import Leads
                </Button>
                
                <Link href="/customers/new">
                  <Button variant="outline" size="lg" className="px-8 py-3 border-2 font-semibold">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Customer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-xl border border-yellow-200">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600">Hot Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.hotLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600">Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600">Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.leads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl border border-purple-200">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600">Recent</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.recent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search customers, phone, email, or vehicle..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 items-center">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="lead">Leads</option>
                    <option value="customer">Customers</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by priority"
                  >
                    <option value="all">All Priority</option>
                    <option value="hot">Hot</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                    >
                      Table
                    </Button>
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                    >
                      Cards
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            data={filteredCustomers}
            columns={columns}
            searchable={false} // We handle search above
            selectable={true}
            bulkActions={bulkActions}
            onRowClick={(customer) => {
              window.location.href = `/customers/${customer.id}`
            }}
            emptyMessage="No customers found. Try adjusting your filters or add new customers."
          />
        </motion.div>
      </main>
    </div>
  )
}
