'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, Building2, MapPin, 
  Calendar, Save, Camera, Edit3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode, demoUser } from '@/lib/demo-data'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: demoUser.firstName,
    lastName: demoUser.lastName,
    email: demoUser.email,
    phone: demoUser.phone || '+1 (555) 123-4567',
    company: demoUser.company,
    role: demoUser.role || 'Sales Manager',
    bio: 'Experienced sales professional specializing in automotive sales and customer relationship management.',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles'
  })

  const handleSave = () => {
    // In a real app, this would save to the API
    console.log('Saving profile:', formData)
    setIsEditing(false)
    // Show success toast
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <AdvancedNavigation />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Profile Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage your personal information and account preferences
              </p>
            </div>
            
            {isDemoMode && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Demo Mode
              </Badge>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-white shadow-lg hover:bg-slate-50"
                      onClick={() => console.log('Change photo')}
                    >
                      <Camera className="w-3 h-3 text-slate-600" />
                    </Button>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">{formData.role}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{formData.company}</p>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since 2023</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full"
                    variant={isEditing ? "outline" : "default"}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-white dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-white dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Title</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="bg-white dark:bg-slate-700"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      disabled={!isEditing}
                      title="Select your timezone"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-50"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
