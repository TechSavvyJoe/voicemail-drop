'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Save, X, User, Car, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isDemoMode, demoCustomers } from '@/lib/demo-data'
import { AdvancedNavigation } from '@/components/advanced-navigation'

export default function EditCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  
  const [customer, setCustomer] = useState<typeof demoCustomers[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [vehicleInterest, setVehicleInterest] = useState('')
  const [status, setStatus] = useState('lead')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    // In demo mode, find the customer by ID
    if (isDemoMode) {
      const foundCustomer = demoCustomers.find(c => c.id === customerId)
      if (foundCustomer) {
        setCustomer(foundCustomer)
        setFirstName(foundCustomer.firstName)
        setLastName(foundCustomer.lastName)
        setPhoneNumber(foundCustomer.phoneNumber)
        setEmail(foundCustomer.email || '')
        setVehicleInterest(foundCustomer.vehicleInterest || '')
        setStatus(foundCustomer.status)
        setPriority(foundCustomer.priority || 'medium')
      }
    }
    setLoading(false)
  }, [customerId])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    router.push(`/customers/${customerId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/60 rounded-2xl w-1/3 mb-8 backdrop-blur-sm"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-white/60 rounded-3xl backdrop-blur-sm"></div>
              <div className="h-96 bg-white/60 rounded-3xl backdrop-blur-sm"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <AdvancedNavigation />
      
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-6 backdrop-blur-md bg-blue-50/80 border border-blue-200/50 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100/80 rounded-xl mr-4">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-blue-700">
              <strong>Demo Mode:</strong> Edit customer information with full functionality. All changes are simulated for demonstration.
            </p>
          </div>
        </motion.div>
      )}

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
                <Link href={`/customers/${customer.id}`}>
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-2 bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text">Edit Customer</h1>
                  <p className="text-slate-600 font-medium">Modify customer information and preferences</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/customers/${customer.id}`}>
                  <Button variant="outline" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                  <div className="p-2 bg-blue-100/60 rounded-xl">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-bold text-slate-700 uppercase tracking-wide">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@email.com"
                    className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label htmlFor="vehicleInterest" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Vehicle Interest</Label>
                  <Input
                    id="vehicleInterest"
                    value={vehicleInterest}
                    onChange={(e) => setVehicleInterest(e.target.value)}
                    placeholder="e.g., 2024 Toyota Camry"
                    className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status & Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                  <div className="p-2 bg-green-100/60 rounded-xl">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                  Status & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="status" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Customer Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    aria-label="Customer status"
                    className="mt-2 flex h-10 w-full rounded-xl border border-white/30 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Priority Level</Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    aria-label="Priority level"
                    className="mt-2 flex h-10 w-full rounded-xl border border-white/30 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-white/30">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-6">Communication Preferences</h4>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30 cursor-pointer hover:bg-blue-50/50 transition-all duration-300">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded-lg border-2 border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2 w-5 h-5"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-700">Email notifications</span>
                    </label>
                    <label className="flex items-center p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30 cursor-pointer hover:bg-blue-50/50 transition-all duration-300">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded-lg border-2 border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2 w-5 h-5"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-700">SMS notifications</span>
                    </label>
                    <label className="flex items-center p-4 bg-gradient-to-br from-slate-50/60 to-blue-50/30 rounded-xl border border-white/30 cursor-pointer hover:bg-blue-50/50 transition-all duration-300">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded-lg border-2 border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2 w-5 h-5"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-700">Voicemail campaigns</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
