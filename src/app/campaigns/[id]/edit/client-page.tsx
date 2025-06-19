'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Save, X, MessageSquare, Users, 
  Clock, Target, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { isDemoMode, demoCampaigns } from '@/lib/demo-data'
import { AdvancedNavigation } from '@/components/advanced-navigation'

interface EditCampaignClientProps {
  id: string
}

export default function EditCampaignClient({ id }: EditCampaignClientProps) {
  const router = useRouter()
  const campaignId = id
  
  const [campaign, setCampaign] = useState<typeof demoCampaigns[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [script, setScript] = useState('')
  const [status, setStatus] = useState('draft')
  const [totalRecipients, setTotalRecipients] = useState(0)

  useEffect(() => {
    // In demo mode, find the campaign by ID
    if (isDemoMode) {
      const foundCampaign = demoCampaigns.find(c => c.id === campaignId)
      if (foundCampaign) {
        setCampaign(foundCampaign)
        setName(foundCampaign.name)
        setScript(foundCampaign.script)
        setStatus(foundCampaign.status)
        setTotalRecipients(foundCampaign.totalRecipients)
      }
    }
    setLoading(false)
  }, [campaignId])

  const handleSave = async () => {
    setSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, you would make an API call here to update the campaign
    console.log('Saving campaign:', {
      id: campaignId,
      name,
      script,
      status,
      totalRecipients
    })
    
    setSaving(false)
    router.push(`/campaigns/${campaignId}`)
  }

  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      script.trim() !== '' &&
      totalRecipients > 0
    )
  }

  const getScriptDuration = () => {
    // Rough estimation: 8 characters per second
    return Math.ceil(script.length / 8)
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

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
        <AdvancedNavigation />
        <div className="p-6 lg:p-8">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <MessageSquare className="mx-auto h-16 w-16" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
              <p className="text-gray-600 mb-6">The campaign you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/campaigns">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaigns
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
            <Link href={`/campaigns/${campaign.id}`}>
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaign
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Campaign
              </h1>
              <p className="text-gray-600 mt-1">Update campaign details and voicemail script</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/campaigns/${campaign.id}`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <Target className="h-6 w-6 text-blue-600" />
                  <span>Campaign Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Campaign Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Campaign Name *
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter campaign name"
                    />
                    {name.trim() === '' && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Campaign name is required
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <select
                      id="status"
                      title="Campaign Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="running">Running</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Total Recipients */}
                  <div className="space-y-2">
                    <Label htmlFor="totalRecipients" className="text-sm font-medium text-gray-700">
                      Total Recipients *
                    </Label>
                    <Input
                      id="totalRecipients"
                      type="number"
                      value={totalRecipients}
                      onChange={(e) => setTotalRecipients(parseInt(e.target.value) || 0)}
                      className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter number of recipients"
                      min="1"
                    />
                    {totalRecipients <= 0 && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Must have at least 1 recipient
                      </p>
                    )}
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Recipients</p>
                          <p className="text-lg font-bold text-gray-900">{totalRecipients}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-lg font-bold text-gray-900">~{getScriptDuration()}s</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voicemail Script */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span>Voicemail Script</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="script" className="text-sm font-medium text-gray-700">
                      Script Content *
                    </Label>
                    <Textarea
                      id="script"
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[200px]"
                      placeholder="Enter your voicemail script here..."
                    />
                    {script.trim() === '' && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Script content is required
                      </p>
                    )}
                  </div>

                  {/* Script Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Character Count:</span> {script.length}
                    </div>
                    <div>
                      <span className="font-medium">Estimated Duration:</span> ~{getScriptDuration()} seconds
                    </div>
                  </div>

                  {/* Script Guidelines */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Script Guidelines:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Keep it under 30 seconds (~150 characters)</li>
                      <li>• Include your name and dealership</li>
                      <li>• Mention the specific vehicle or promotion</li>
                      <li>• Provide a clear call-to-action</li>
                      <li>• Use [Customer Name] and [Vehicle Type] for personalization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Form Validation Summary */}
        {!isFormValid() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800 font-medium">Please fix the following issues:</p>
              </div>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {name.trim() === '' && <li>Campaign name is required</li>}
                {script.trim() === '' && <li>Script content is required</li>}
                {totalRecipients <= 0 && <li>Must have at least 1 recipient</li>}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
