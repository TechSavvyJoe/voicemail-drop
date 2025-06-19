'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, Lock, Key, Smartphone, Eye, EyeOff,
  AlertTriangle, CheckCircle, Clock,
  Save, RefreshCw, Download, History
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { isDemoMode } from '@/lib/demo-data'

interface SecurityEvent {
  id: string
  type: 'login' | 'password_change' | 'session_start' | 'failed_login'
  description: string
  timestamp: string
  location: string
  device: string
  status: 'success' | 'warning' | 'error'
}

const demoSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    description: 'Successful login',
    timestamp: '2024-01-20T10:30:00Z',
    location: 'San Francisco, CA',
    device: 'Chrome on macOS',
    status: 'success'
  },
  {
    id: '2',
    type: 'password_change',
    description: 'Password changed',
    timestamp: '2024-01-18T15:45:00Z',
    location: 'San Francisco, CA',
    device: 'Chrome on macOS',
    status: 'success'
  },
  {
    id: '3',
    type: 'failed_login',
    description: 'Failed login attempt',
    timestamp: '2024-01-17T09:15:00Z',
    location: 'Unknown',
    device: 'Unknown browser',
    status: 'error'
  },
  {
    id: '4',
    type: 'session_start',
    description: 'New session started',
    timestamp: '2024-01-16T14:20:00Z',
    location: 'San Francisco, CA',
    device: 'Safari on iPhone',
    status: 'success'
  }
]

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordSave = () => {
    console.log('Changing password:', passwordData)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const getEventIcon = (type: string, status: string) => {
    if (status === 'error') return <AlertTriangle className="w-4 h-4 text-red-500" />
    if (status === 'warning') return <Clock className="w-4 h-4 text-amber-500" />
    
    switch (type) {
      case 'login':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'password_change':
        return <Key className="w-4 h-4 text-blue-500" />
      case 'session_start':
        return <Smartphone className="w-4 h-4 text-purple-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
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
                Security Settings
              </h1>
              <p className="text-slate-600">
                Manage your account security and privacy settings
              </p>
            </div>
            
            {isDemoMode && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Demo Mode
              </Badge>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue="password" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="two-factor" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Two-Factor
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Password Tab */}
          <TabsContent value="password">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="pr-10 bg-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="pr-10 bg-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="pr-10 bg-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button onClick={handlePasswordSave} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Password Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Include uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Include lowercase letter</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Include number</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Include special character</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Two-Factor Authentication Tab */}
          <TabsContent value="two-factor">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Require a verification code in addition to your password
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>

                  {twoFactorEnabled && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">
                          Two-Factor Authentication is enabled
                        </span>
                      </div>
                      <p className="text-sm text-emerald-700">
                        Your account is protected with authenticator app verification.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Backup Codes
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Recovery Kit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about security events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Receive security alerts via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-notifications">Login Notifications</Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch
                      id="login-notifications"
                      checked={loginNotifications}
                      onCheckedChange={setLoginNotifications}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Active Sessions
                      </CardTitle>
                      <CardDescription>
                        Manage your active login sessions across devices
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-lg bg-emerald-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">Current Session</h4>
                            <p className="text-sm text-slate-600">Chrome on macOS</p>
                            <p className="text-xs text-slate-500">San Francisco, CA • Active now</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">Current</Badge>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">Safari on iPhone</h4>
                            <p className="text-sm text-slate-600">Mobile Session</p>
                            <p className="text-xs text-slate-500">San Francisco, CA • 2 hours ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">Firefox on Windows</h4>
                            <p className="text-sm text-slate-600">Desktop Session</p>
                            <p className="text-xs text-slate-500">San Francisco, CA • 1 day ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <Button variant="destructive" className="w-full">
                      Revoke All Other Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Security Activity
                      </CardTitle>
                      <CardDescription>
                        Recent security events and account activity
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Log
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoSecurityEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
                      >
                        {getEventIcon(event.type, event.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-slate-900">{event.description}</h4>
                            <span className="text-sm text-slate-500">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>{event.device}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      Load More Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
