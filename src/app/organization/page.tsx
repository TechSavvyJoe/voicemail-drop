'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, Users, Mail, Phone, MapPin, 
  Save, Edit3, Shield, Crown,
  Settings, Plus, Trash2, Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode, demoUser } from '@/lib/demo-data'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
}

const demoTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@premiumautodealer.com',
    role: 'Owner',
    status: 'active',
    joinedAt: '2023-01-15',
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@premiumautodealer.com',
    role: 'Sales Manager',
    status: 'active',
    joinedAt: '2023-02-20',
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@premiumautodealer.com',
    role: 'Sales Representative',
    status: 'active',
    joinedAt: '2023-03-10',
    lastActive: '3 hours ago'
  },
  {
    id: '4',
    name: 'Lisa Davis',
    email: 'lisa@premiumautodealer.com',
    role: 'Sales Representative',
    status: 'pending',
    joinedAt: '2024-01-20',
    lastActive: 'Never'
  }
]

export default function OrganizationPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [teamMembers] = useState(demoTeamMembers)
  const [orgData, setOrgData] = useState({
    name: demoUser.company,
    description: 'Leading automotive dealership specializing in premium vehicles and exceptional customer service.',
    industry: 'Automotive Sales',
    size: '11-50 employees',
    website: 'https://premiumautodealer.com',
    address: '123 Auto Drive, San Francisco, CA 94105',
    phone: '+1 (555) 987-6543',
    email: 'contact@premiumautodealer.com'
  })

  const handleSave = () => {
    console.log('Saving organization:', orgData)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      case 'inactive':
        return <Badge className="bg-slate-100 text-slate-600">Inactive</Badge>
      default:
        return null
    }
  }

  const getRoleIcon = (role: string) => {
    if (role === 'Owner') return <Crown className="w-4 h-4 text-amber-500" />
    if (role.includes('Manager')) return <Shield className="w-4 h-4 text-blue-500" />
    return <Users className="w-4 h-4 text-slate-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      <AdvancedNavigation />
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Organization Settings
              </h1>
              <p className="text-slate-600">
                Manage your organization details and team members
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
          {/* Organization Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Organization Details</CardTitle>
                      <CardDescription>Update your organization information</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={orgData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={orgData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <select
                      id="size"
                      value={orgData.size}
                      onChange={(e) => handleChange('size', e.target.value)}
                      disabled={!isEditing}
                      title="Select company size"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 disabled:opacity-50"
                    >
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-200 employees">51-200 employees</option>
                      <option value="201-500 employees">201-500 employees</option>
                      <option value="500+ employees">500+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={orgData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="address"
                      value={orgData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgPhone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="orgPhone"
                        value={orgData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="orgEmail"
                        type="email"
                        value={orgData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-white"
                      />
                    </div>
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

          {/* Organization Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Team Members</span>
                  <Badge variant="outline">{teamMembers.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Users</span>
                  <Badge variant="outline">{teamMembers.filter(m => m.status === 'active').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Pending Invites</span>
                  <Badge variant="outline">{teamMembers.filter(m => m.status === 'pending').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Member Since</span>
                  <span className="text-sm font-medium">Jan 2023</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Plan & Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Current Plan</span>
                  <Badge className="bg-blue-100 text-blue-800">Professional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Next Billing</span>
                  <span className="text-sm font-medium">Feb 15, 2024</span>
                </div>
                <Button className="w-full" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Team Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Manage your team and their permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{member.name}</h4>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-sm text-slate-600">{member.email}</p>
                        <p className="text-xs text-slate-500">
                          Last active: {member.lastActive}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{member.role}</span>
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-xs text-slate-500">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        {member.role !== 'Owner' && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
