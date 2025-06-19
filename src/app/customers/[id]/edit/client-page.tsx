'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Save, X, User, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isDemoMode, demoCustomers } from '@/lib/demo-data'
import { AdvancedNavigation } from '@/components/advanced-navigation'

interface EditCustomerClientProps {
  id: string
}

export default function EditCustomerClient({ id }: EditCustomerClientProps) {
  const router = useRouter()
  const customerId = id
  
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
    
    // In a real app, you would make an API call here to update the customer
    console.log('Saving customer:', {
      id: customerId,
      firstName,
      lastName,
      phoneNumber,
      email,
      vehicleInterest,
      status,
      priority
    })
    
    setSaving(false)
    router.push(`/customers/${customerId}`)
  }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)\.]+$/
    return phoneRegex.test(phone)
  }

  const isFormValid = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      validatePhoneNumber(phoneNumber)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/60 rounded-2xl w-1/3 mb-8 backdrop-blur-sm"></div>
            <div className="h-96 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
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
            <Link href={`/customers/${customer.id}`}>
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customer
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Customer
              </h1>
              <p className="text-gray-600 mt-1">Update customer information</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/customers/${customer.id}`}>
              <Button 
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={handleSave}
              disabled={!isFormValid() || saving}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                <User className="h-6 w-6 text-blue-600" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                  {firstName.trim() === '' && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      First name is required
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                  {lastName.trim() === '' && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Last name is required
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+1-555-0123"
                  />
                  {phoneNumber.trim() === '' ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Phone number is required
                    </p>
                  ) : !validatePhoneNumber(phoneNumber) && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Please enter a valid phone number
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="customer@email.com"
                  />
                </div>

                {/* Vehicle Interest */}
                <div className="space-y-2">
                  <Label htmlFor="vehicleInterest" className="text-sm font-medium text-gray-700">
                    Vehicle Interest
                  </Label>
                  <Input
                    id="vehicleInterest"
                    value={vehicleInterest}
                    onChange={(e) => setVehicleInterest(e.target.value)}
                    className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="2024 Honda Accord"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="lead">Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                    Priority
                  </Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Form Validation Summary */}
              {!isFormValid() && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800 font-medium">Please fix the following issues:</p>
                  </div>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {firstName.trim() === '' && <li>First name is required</li>}
                    {lastName.trim() === '' && <li>Last name is required</li>}
                    {phoneNumber.trim() === '' && <li>Phone number is required</li>}
                    {phoneNumber.trim() !== '' && !validatePhoneNumber(phoneNumber) && <li>Phone number format is invalid</li>}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
