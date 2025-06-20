'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, Upload, Search, Download, 
  Edit, Eye, Trash2, Plus, CheckCircle, Phone,
  MoreHorizontal, ChevronDown, ChevronUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { demoCustomers } from '@/lib/demo-data'

type SortField = 'name' | 'phone' | 'email' | 'status' | 'priority' | 'lastContact' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export default function CustomersPage() {
  const [customers] = useState(demoCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortField) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'phone':
          aValue = a.phoneNumber
          bValue = b.phoneNumber
          break
        case 'email':
          aValue = a.email || ''
          bValue = b.email || ''
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'priority':
          aValue = a.priority
          bValue = b.priority
          break
        case 'lastContact':
          aValue = new Date(a.lastContact || a.createdAt)
          bValue = new Date(b.lastContact || b.createdAt)
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = a.firstName
          bValue = b.firstName
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [customers, searchTerm, statusFilter, priorityFilter, sortField, sortDirection])

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'customer').length,
    recent: customers.filter(c => {
      const lastContact = new Date(c.lastContact || c.createdAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return lastContact > weekAgo
    }).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'prospect':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredAndSortedCustomers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId])
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <AdvancedNavigation />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Customer Management
                </h1>
                <p className="text-slate-600">
                  Manage your customer database efficiently
                </p>
              </div>
              
              <div className="flex gap-3">
                <Link href="/customers/upload">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </Link>
                
                <Link href="/customers/new">
                  <Button variant="outline" size="lg" className="px-6 border-2 font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-600">Total Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-600">Active Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.active.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-600">Recent Activity</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.recent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search customers by name, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 bg-white/80 border border-slate-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 border border-slate-300 rounded-md bg-white/80 text-sm"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="h-10 px-3 border border-slate-300 rounded-md bg-white/80 text-sm"
                    aria-label="Filter by priority"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="hot">Hot</option>
                  </select>
                  
                  <Button variant="outline" size="sm" className="border border-slate-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-900 text-lg">Customer Database</CardTitle>
                  <CardDescription>
                    {filteredAndSortedCustomers.length} of {customers.length} customers
                    {selectedCustomers.length > 0 && ` • ${selectedCustomers.length} selected`}
                  </CardDescription>
                </div>
                {selectedCustomers.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/50">
                      <TableHead className="w-10 pl-6">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.length === filteredAndSortedCustomers.length && filteredAndSortedCustomers.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-slate-300"
                          aria-label="Select all customers"
                        />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-900"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-900"
                        onClick={() => handleSort('phone')}
                      >
                        <div className="flex items-center gap-1">
                          Phone
                          {sortField === 'phone' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-900"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {sortField === 'email' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900">Vehicle Interest</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-900"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortField === 'status' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-900"
                        onClick={() => handleSort('priority')}
                      >
                        <div className="flex items-center gap-1">
                          Priority
                          {sortField === 'priority' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-900"
                        onClick={() => handleSort('lastContact')}
                      >
                        <div className="flex items-center gap-1">
                          Last Contact
                          {sortField === 'lastContact' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-20 pr-6 font-semibold text-slate-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCustomers.map((customer) => (
                      <TableRow 
                        key={customer.id} 
                        className={`border-slate-200 hover:bg-slate-50/50 transition-colors ${
                          selectedCustomers.includes(customer.id) ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <TableCell className="pl-6">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                            className="rounded border-slate-300"
                            aria-label={`Select ${customer.firstName} ${customer.lastName}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link 
                            href={`/customers/${customer.id}`}
                            className="text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {customer.firstName} {customer.lastName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-600 font-mono text-sm">
                          {customer.phoneNumber}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {customer.email || '-'}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {customer.vehicleInterest || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(customer.status)} text-xs font-medium border`}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getPriorityColor(customer.priority || 'medium')} text-xs font-medium border`}>
                            {customer.priority || 'medium'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {customer.lastContact ? 
                            new Date(customer.lastContact).toLocaleDateString() : 
                            new Date(customer.createdAt).toLocaleDateString()
                          }
                        </TableCell>
                        <TableCell className="pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.id}`} className="flex items-center">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.id}/edit`} className="flex items-center">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredAndSortedCustomers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No customers found
                  </h3>
                  <p className="text-slate-500 mb-4">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by uploading a customer list.'}
                  </p>
                  <Link href="/customers/upload">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Customer List
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
