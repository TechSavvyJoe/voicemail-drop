'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string
  
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
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-md bg-white/70 rounded-3xl p-12 shadow-xl border border-white/20 max-w-lg mx-auto"
            >
              <h1 className="text-3xl font-black text-slate-900 mb-4">Customer Not Found</h1>
              <p className="text-slate-600 mb-8 font-medium">The customer you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/customers">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Customers
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      lead: { label: 'Lead', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' },
      prospect: { label: 'Prospect', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' },
      customer: { label: 'Customer', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.lead
    return (
      <Badge className={`${config.color} px-4 py-2 font-bold text-sm rounded-full border-0`}>
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: 'High Priority', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' },
      medium: { label: 'Medium Priority', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' },
      low: { label: 'Low Priority', color: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg' }
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
    return (
      <Badge className={`${config.color} px-4 py-2 font-bold text-sm rounded-full border-0`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <AdvancedNavigation />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <Link href="/customers">
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-3 bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    {getStatusBadge(customer.status)}
                    {getPriorityBadge(customer.priority || 'medium')}
                    <span className="text-sm text-slate-600 font-medium">
                      Customer since {new Date(customer.createdAt || new Date()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
                <Link href={`/customers/${customer.id}/edit`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Phone Number</CardTitle>
              <div className="p-2 bg-blue-100/60 rounded-xl">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-black text-slate-900">{customer.phoneNumber}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Vehicle Interest</CardTitle>
              <div className="p-2 bg-purple-100/60 rounded-xl">
                <Car className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-black text-slate-900">{customer.vehicleInterest || 'Not specified'}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">Contact Method</CardTitle>
              <div className="p-2 bg-orange-100/60 rounded-xl">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-black text-slate-900">Voicemail</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-blue-100/60 rounded-xl">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{customer.firstName} {customer.lastName}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{customer.phoneNumber}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{customer.email || 'Not provided'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Status</label>
                  <div className="mt-2">{getStatusBadge(customer.status)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Priority</label>
                  <div className="mt-2">{getPriorityBadge(customer.priority || 'medium')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-green-100/60 rounded-xl">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-green-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Vehicle Interest</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{customer.vehicleInterest || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-green-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Budget Range</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">$25,000 - $35,000</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-green-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Trade-in Vehicle</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">2018 Honda Civic</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50/60 to-green-50/30 rounded-xl border border-white/30">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Financing</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">Pre-approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-orange-100/60 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/60 rounded-2xl border border-white/50"
                >
                  <div className="p-2 bg-blue-100/80 rounded-xl">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Voicemail sent</p>
                    <p className="text-xs font-medium text-slate-600">Holiday Sale Follow-up campaign</p>
                    <p className="text-xs text-slate-500 font-medium">2 hours ago</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4 p-6 bg-gradient-to-br from-green-50/80 to-green-100/60 rounded-2xl border border-white/50"
                >
                  <div className="p-2 bg-green-100/80 rounded-xl">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Voicemail delivered</p>
                    <p className="text-xs font-medium text-slate-600">New arrival notification campaign</p>
                    <p className="text-xs text-slate-500 font-medium">1 day ago</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50/80 to-purple-100/60 rounded-2xl border border-white/50"
                >
                  <div className="p-2 bg-purple-100/80 rounded-xl">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Note added</p>
                    <p className="text-xs font-medium text-slate-600">Customer interested in SUV models</p>
                    <p className="text-xs text-slate-500 font-medium">3 days ago</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-purple-100/60 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                Engagement Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between items-center p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/60 rounded-2xl border border-white/50"
                >
                  <div>
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">Voicemails Received</p>
                    <p className="text-3xl font-black text-blue-900">12</p>
                  </div>
                  <div className="p-3 bg-blue-100/80 rounded-xl">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-between items-center p-6 bg-gradient-to-br from-green-50/80 to-green-100/60 rounded-2xl border border-white/50"
                >
                  <div>
                    <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Response Rate</p>
                    <p className="text-3xl font-black text-green-900">25%</p>
                  </div>
                  <div className="p-3 bg-green-100/80 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-between items-center p-6 bg-gradient-to-br from-purple-50/80 to-purple-100/60 rounded-2xl border border-white/50"
                >
                  <div>
                    <p className="text-sm font-bold text-purple-800 uppercase tracking-wide">Last Contact</p>
                    <p className="text-sm font-black text-purple-900">
                      {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString() : 'No contact'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100/80 rounded-xl">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
