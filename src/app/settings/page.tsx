'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, User, Bell, Shield, Palette, Database,
  Save, Check, Phone, Mail,
  Download, Upload, Trash2, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { useToast } from '@/components/toast'
import { isDemoMode, demoUser } from '@/lib/demo-data'

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    timezone: string
  }
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    campaignComplete: boolean
    lowBalance: boolean
    weeklyReport: boolean
  }
  preferences: {
    language: string
    dateFormat: string
    voiceSpeed: number
    defaultVoice: 'male' | 'female'
    autoSave: boolean
  }
  security: {
    twoFactor: boolean
    lastPasswordChange: string
    apiAccess: boolean
  }
}

export default function SettingsPage() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: demoUser.firstName,
      lastName: demoUser.lastName,
      email: demoUser.email,
      phone: '+1 (555) 123-4567',
      company: demoUser.company,
      timezone: 'America/New_York'
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      campaignComplete: true,
      lowBalance: true,
      weeklyReport: false
    },
    preferences: {
      language: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      voiceSpeed: 1.0,
      defaultVoice: 'female',
      autoSave: true
    },
    security: {
      twoFactor: false,
      lastPasswordChange: '2024-05-15',
      apiAccess: true
    }
  })

  const handleSettingChange = (section: keyof UserSettings, key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been updated successfully.',
      duration: 3000
    })
    
    setIsLoading(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Export', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AdvancedNavigation />
      
      {/* Demo Banner */}
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-6 bg-white/70 backdrop-blur-md border border-blue-200/50 rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center">
            <Check className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800 font-medium">
              <strong>Demo Mode:</strong> Configure your account settings and preferences. All changes are saved locally for the demo.
            </p>
          </div>
        </motion.div>
      )}

      <div className="p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your account preferences and security settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-700 border-r-2 border-blue-500 font-bold shadow-lg'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 font-medium'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <User className="h-5 w-5 text-blue-500" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input
                          value={settings.profile.firstName}
                          onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={settings.profile.lastName}
                          onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border-white/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          value={settings.profile.phone}
                          onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Company
                        </label>
                        <Input
                          value={settings.profile.company}
                          onChange={(e) => handleSettingChange('profile', 'company', e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border-white/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Select timezone"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Bell className="h-5 w-5 text-yellow-500" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about account activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Notification Channels</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'email', label: 'Email Notifications', icon: Mail, enabled: settings.notifications.email },
                          { key: 'sms', label: 'SMS Notifications', icon: Phone, enabled: settings.notifications.sms },
                          { key: 'push', label: 'Push Notifications', icon: Bell, enabled: settings.notifications.push }
                        ].map((channel) => (
                          <div key={channel.key} className="flex items-center justify-between p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <channel.icon className="h-5 w-5 text-gray-500" />
                              <span className="font-bold text-gray-900">{channel.label}</span>
                            </div>
                            <Button
                              variant={channel.enabled ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSettingChange('notifications', channel.key, !channel.enabled)}
                              className={channel.enabled 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold' 
                                : 'bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold'}
                            >
                              {channel.enabled ? 'Enabled' : 'Disabled'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Event Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'campaignComplete', label: 'Campaign Completion', description: 'When your voicemail campaigns finish' },
                          { key: 'lowBalance', label: 'Low Balance Alert', description: 'When your account balance is running low' },
                          { key: 'weeklyReport', label: 'Weekly Reports', description: 'Summary of your account activity' }
                        ].map((event) => (
                          <div key={event.key} className="flex items-center justify-between p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                            <div>
                              <p className="font-bold text-gray-900">{event.label}</p>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                            <Button
                              variant={settings.notifications[event.key as keyof typeof settings.notifications] ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSettingChange('notifications', event.key, !settings.notifications[event.key as keyof typeof settings.notifications])}
                              className={settings.notifications[event.key as keyof typeof settings.notifications] 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold' 
                                : 'bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold'}
                            >
                              {settings.notifications[event.key as keyof typeof settings.notifications] ? 'On' : 'Off'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Palette className="h-5 w-5 text-purple-500" />
                      Appearance & Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience and default settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Default Voice
                        </label>
                        <select
                          value={settings.preferences.defaultVoice}
                          onChange={(e) => handleSettingChange('preferences', 'defaultVoice', e.target.value)}
                          className="flex h-9 w-full rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Select default voice"
                        >
                          <option value="female">Female Voice</option>
                          <option value="male">Male Voice</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Voice Speed
                        </label>
                        <select
                          value={settings.preferences.voiceSpeed}
                          onChange={(e) => handleSettingChange('preferences', 'voiceSpeed', parseFloat(e.target.value))}
                          className="flex h-9 w-full rounded-md border border-white/20 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Select voice speed"
                        >
                          <option value={0.8}>Slow (0.8x)</option>
                          <option value={1.0}>Normal (1.0x)</option>
                          <option value={1.2}>Fast (1.2x)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                      <div>
                        <p className="font-bold text-gray-900">Auto-save drafts</p>
                        <p className="text-sm text-gray-600">Automatically save campaign drafts while editing</p>
                      </div>
                      <Button
                        variant={settings.preferences.autoSave ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSettingChange('preferences', 'autoSave', !settings.preferences.autoSave)}
                        className={settings.preferences.autoSave 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold' 
                          : 'bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold'}
                      >
                        {settings.preferences.autoSave ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Shield className="h-5 w-5 text-green-500" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and access controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-200/50 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="font-bold text-green-900">Account Security Status</span>
                      </div>
                      <p className="text-sm text-green-700">Your account is secure with current security settings.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                        <div>
                          <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <Button
                          variant={settings.security.twoFactor ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSettingChange('security', 'twoFactor', !settings.security.twoFactor)}
                          className={settings.security.twoFactor 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold' 
                            : 'bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold'}
                        >
                          {settings.security.twoFactor ? 'Enabled' : 'Enable'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                        <div>
                          <p className="font-bold text-gray-900">API Access</p>
                          <p className="text-sm text-gray-600">Allow third-party applications to access your account</p>
                        </div>
                        <Button
                          variant={settings.security.apiAccess ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSettingChange('security', 'apiAccess', !settings.security.apiAccess)}
                          className={settings.security.apiAccess 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold' 
                            : 'bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold'}
                        >
                          {settings.security.apiAccess ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                        <div>
                          <p className="font-bold text-gray-900">Password</p>
                          <p className="text-sm text-gray-600">Last changed: {new Date(settings.security.lastPasswordChange).toLocaleDateString()}</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Data & Export */}
            {activeTab === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Database className="h-5 w-5 text-indigo-500" />
                      Data Management
                    </CardTitle>
                    <CardDescription>
                      Export your data or manage account data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                        <h4 className="font-bold text-gray-900 mb-2">Export Data</h4>
                        <p className="text-sm text-gray-600 mb-4">Download your account data and campaign history</p>
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold">
                          <Download className="h-4 w-4" />
                          Export All Data
                        </Button>
                      </div>

                      <div className="p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-sm">
                        <h4 className="font-bold text-gray-900 mb-2">Import Data</h4>
                        <p className="text-sm text-gray-600 mb-4">Import customer lists and campaign data</p>
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 font-bold">
                          <Upload className="h-4 w-4" />
                          Import Data
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 border border-red-200/50 rounded-xl backdrop-blur-sm">
                      <h4 className="font-bold text-red-900 mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-700 mb-4">
                        These actions cannot be undone. Please proceed with caution.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 bg-white/60 backdrop-blur-sm font-bold">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete All Campaigns
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 bg-white/60 backdrop-blur-sm font-bold">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
