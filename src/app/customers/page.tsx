'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, Upload, Search, Filter, Download, 
  Edit, Eye, Trash2, Plus, CheckCircle, Phone
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { demoCustomers } from '@/lib/demo-data'

export default function CustomersPage() {
  const [customers] = useState(demoCustomers)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'customer').length,
    recent: customers.filter(c => {
      const lastContact = new Date(c.lastContact || c.createdAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return lastContact > weekAgo
    }).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdvancedNavigation />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Improved Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                  Customer Management
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Manage your customer database and import new contacts
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 shadow-lg border-2 border-blue-600">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload CSV
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

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Active Customers
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.active.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
                  <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Recent Activity
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.recent.toLocaleString()}
                  </p>
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
          className="mb-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      placeholder="Search customers by name, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-base bg-white/50 dark:bg-slate-700/50 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <Button variant="outline" size="lg" className="shrink-0 border-2">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                <Button variant="outline" size="lg" className="shrink-0 border-2">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-xl">
                Customer Database
              </CardTitle>
              <CardDescription className="text-base">
                {filteredCustomers.length} of {customers.length} customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredCustomers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg cursor-pointer">
                      <Link href={`/customers/${customer.id}`} className="block">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {customer.firstName} {customer.lastName}
                                </h3>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                                  📞 {customer.phoneNumber}
                                </p>
                                {customer.email && (
                                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                    ✉️ {customer.email}
                                  </p>
                                )}
                              </div>
                              
                              <div className="text-right">
                                <div className="flex flex-wrap gap-2 justify-end mb-2">
                                  {customer.vehicleInterest && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                      🚗 {customer.vehicleInterest}
                                    </Badge>
                                  )}
                                  {customer.status && (
                                    <Badge variant="outline" className="border-slate-300 dark:border-slate-600 capitalize">
                                      {customer.status}
                                    </Badge>
                                  )}
                                </div>
                                {customer.lastContact && (
                                  <p className="text-xs text-slate-500 dark:text-slate-500">
                                    Last contact: {new Date(customer.lastContact).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Link href={`/customers/${customer.id}`}>
                          <Button variant="outline" size="sm" className="border-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/customers/${customer.id}/edit`}>
                          <Button variant="outline" size="sm" className="border-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Info
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 border-2">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-16">
                  <Users className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No customers found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by uploading a customer list.'}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Customer List
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
