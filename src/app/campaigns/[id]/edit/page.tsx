'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function EditCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  
  const [campaign, setCampaign] = useState<typeof demoCampaigns[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [script, setScript] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [deliverySchedule, setDeliverySchedule] = useState('')

  useEffect(() => {
    // In demo mode, find the campaign by ID
    if (isDemoMode) {
      const foundCampaign = demoCampaigns.find(c => c.id === campaignId)
      if (foundCampaign) {
        setCampaign(foundCampaign)
        setName(foundCampaign.name)
        setScript(foundCampaign.script || '')
        setTargetAudience('All active leads and prospects')
        setDeliverySchedule('Monday - Friday, 10 AM - 6 PM')
      }
    }
    setLoading(false)
  }, [campaignId])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    router.push(`/campaigns/${campaignId}`)
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

  if (!campaign) {
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
              <h1 className="text-3xl font-black text-slate-900 mb-4">Campaign Not Found</h1>
              <p className="text-slate-600 mb-8 font-medium">The campaign you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/campaigns">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaigns
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
                <Link href={`/campaigns/${campaign.id}`}>
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-2 bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text">Edit Campaign</h1>
                  <p className="text-slate-600 font-medium">Modify campaign settings and content</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/campaigns/${campaign.id}`}>
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
          {/* Campaign Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                  <div className="p-2 bg-blue-100/60 rounded-xl">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Campaign Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter campaign name"
                    className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label htmlFor="audience" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Target Audience</Label>
                  <Input
                    id="audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Define your target audience"
                    className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label htmlFor="schedule" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Delivery Schedule</Label>
                  <Input
                    id="schedule"
                    value={deliverySchedule}
                    onChange={(e) => setDeliverySchedule(e.target.value)}
                    placeholder="Set delivery times"
                    className="mt-2 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/60 rounded-2xl border border-white/50">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100/80 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide">Campaign Status</h4>
                      <p className="text-sm text-blue-700 font-medium mt-2">
                        This campaign is currently <span className="font-bold">{campaign.status}</span>. Changes will take effect immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voicemail Script */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                  <div className="p-2 bg-green-100/60 rounded-xl">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  Voicemail Script
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="script" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Script Content</Label>
                  <Textarea
                    id="script"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Enter your voicemail script..."
                    className="mt-2 min-h-[200px] backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300 resize-none"
                  />
                  <div className="flex justify-between text-sm text-slate-600 font-medium mt-3">
                    <span>{script.length} characters</span>
                    <span>~{Math.ceil(script.length / 5)} words</span>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 rounded-2xl border border-white/50">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100/80 rounded-xl">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide">Script Guidelines</h4>
                      <ul className="text-sm text-green-700 font-medium mt-2 space-y-1">
                        <li>• Keep it under 30 seconds (≈150 words)</li>
                        <li>• Use [Customer Name] for personalization</li>
                        <li>• Include a clear call-to-action</li>
                        <li>• End with contact information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/40 rounded-2xl border border-white/50">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Available Variables</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm font-medium text-slate-600">
                    <div className="p-3 bg-white/60 rounded-xl border border-white/30">[Customer Name]</div>
                    <div className="p-3 bg-white/60 rounded-xl border border-white/30">[Sales Rep]</div>
                    <div className="p-3 bg-white/60 rounded-xl border border-white/30">[Dealership]</div>
                    <div className="p-3 bg-white/60 rounded-xl border border-white/30">[Vehicle]</div>
                    <div className="p-3 bg-white/60 rounded-xl border border-white/30">[Phone Number]</div>
                    <div className="p-3 bg-white/60 rounded-xl border border-white/30">[Location]</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Campaign Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-8"
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-white/80 to-white/40 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">
                <div className="p-2 bg-purple-100/60 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                Campaign Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-blue-700 mb-2">{campaign.totalRecipients}</div>
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wide">Total Recipients</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center p-6 bg-gradient-to-br from-green-50/80 to-green-100/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-green-700 mb-2">{campaign.sentCount}</div>
                  <div className="text-sm font-bold text-green-600 uppercase tracking-wide">Sent</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center p-6 bg-gradient-to-br from-purple-50/80 to-purple-100/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-purple-700 mb-2">{campaign.successCount}</div>
                  <div className="text-sm font-bold text-purple-600 uppercase tracking-wide">Delivered</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center p-6 bg-gradient-to-br from-slate-50/80 to-slate-100/60 rounded-2xl border border-white/50"
                >
                  <div className="text-3xl font-black text-slate-700 mb-2">
                    {campaign.sentCount > 0 ? ((campaign.successCount / campaign.sentCount) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Success Rate</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
