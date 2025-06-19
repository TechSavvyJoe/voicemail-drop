'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Edit, Phone, Calendar, 
  User, Car, Clock, FileText,
  MessageSquare, TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isDemoMode, demoCustomers } from '@/lib/demo-data'
import { AdvancedNavigation } from '@/components/advanced-navigation'

interface CustomerDetailClientProps {
  id: string
}

export default function CustomerDetailClient({ id }: CustomerDetailClientProps) {
  const customerId = id
  
  const [customer, setCustomer] = useState<typeof demoCustomers[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In demo mode, find the customer by ID
    if (isDemoMode) {
      const foundCustomer = demoCustomers.find(c => c.id === customerId)
      setCustomer(foundCustomer || null)
    }
    setLoading(false)
  }, [customerId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/60 rounded-2xl w-1/3 mb-8 backdrop-blur-sm"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              <div className="h-32 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <User className="mx-auto h-16 w-16" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
              <p className="text-gray-600 mb-6">The customer you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/customers">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Customers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'lead':
        return { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', label: 'Lead' }
      case 'contacted':
        return { color: 'bg-blue-100 text-blue-800 border border-blue-200', label: 'Contacted' }
      case 'qualified':
        return { color: 'bg-green-100 text-green-800 border border-green-200', label: 'Qualified' }
      case 'customer':
        return { color: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'Customer' }
      default:
        return { color: 'bg-gray-100 text-gray-800 border border-gray-200', label: 'Unknown' }
    }
  }

  // Priority configuration
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'bg-red-100 text-red-800 border border-red-200', label: 'High Priority' }
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', label: 'Medium Priority' }
      case 'low':
        return { color: 'bg-green-100 text-green-800 border border-green-200', label: 'Low Priority' }
      default:
        return { color: 'bg-gray-100 text-gray-800 border border-gray-200', label: 'No Priority' }
    }
  }

  const statusConfig = getStatusConfig(customer.status)
  const priorityConfig = getPriorityConfig(customer.priority || 'medium')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <AdvancedNavigation />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/customers">
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customers
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-gray-600 mt-1">Customer Details</p>
            </div>
          </div>
          
          <Link href={`/customers/${customer.id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </Link>
        </motion.div>

        {/* Status Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={`${statusConfig.color} px-4 py-2 font-bold text-sm rounded-full border-0`}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority</p>
                  <Badge className={`${priorityConfig.color} px-4 py-2 font-bold text-sm rounded-full border-0`}>
                    {priorityConfig.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-lg font-bold text-gray-900">{customer.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Contact</p>
                  <p className="text-lg font-bold text-gray-900">
                    {customer.lastContact || 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <User className="h-6 w-6 text-blue-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">{customer.phoneNumber}</p>
                    </div>
                  </div>

                  {customer.email && (
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{customer.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vehicle Interest & Notes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <Car className="h-6 w-6 text-green-600" />
                  <span>Vehicle Interest & Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {customer.vehicleInterest && (
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Car className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vehicle Interest</p>
                        <p className="text-lg font-semibold text-gray-900">{customer.vehicleInterest}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer ID</p>
                      <p className="text-lg font-semibold text-gray-900 font-mono">{customer.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Campaign History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                <MessageSquare className="h-6 w-6 text-purple-600" />
                <span>Campaign History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Campaign History</h3>
                <p className="text-gray-500">This customer hasn&apos;t been included in any campaigns yet.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
