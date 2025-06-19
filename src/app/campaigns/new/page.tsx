'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Save, Calendar, Users, Mic, 
  CheckCircle, Clock, Target, FileText, Volume2,
  Send, AlertCircle,
  Upload, Copy, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'
import { useCampaigns } from '@/hooks/use-campaigns'
import { isDemoMode } from '@/lib/demo-data'
import { toast } from 'sonner'
import Link from 'next/link'

import { VoiceRecorder } from '@/components/voice-recorder'

interface CampaignFormData {
  name: string
  voicemailScript: string
  scheduledDate: string
  scheduledTime: string
  customerList: 'all' | 'uploaded' | 'custom'
  customCustomers: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  voiceSettings: {
    speed: number
    tone: 'professional' | 'friendly' | 'casual'
    voice: 'male' | 'female'
  }
  messageType: 'text-to-speech' | 'voice-recording'
  voiceRecording?: {
    blob: Blob
    duration: number
  }
}

export default function NewCampaignPage() {
  const router = useRouter()
  const { createCampaign } = useCampaigns()
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    voicemailScript: '',
    scheduledDate: '',
    scheduledTime: '',
    customerList: 'uploaded',
    customCustomers: '',
    priority: 'medium',
    tags: [],
    voiceSettings: {
      speed: 1.0,
      tone: 'professional',
      voice: 'female'
    },
    messageType: 'text-to-speech'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [previewMode, setPreviewMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVoiceSettingChange = (setting: keyof CampaignFormData['voiceSettings'], value: string | number) => {
    setFormData(prev => ({
      ...prev,
      voiceSettings: {
        ...prev.voiceSettings,
        [setting]: value
      }
    }))
  }

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    setFormData(prev => ({
      ...prev,
      voiceRecording: {
        blob: audioBlob,
        duration
      }
    }))
  }

  const handleRecordingDelete = () => {
    setFormData(prev => ({
      ...prev,
      voiceRecording: undefined
    }))
  }

  const handleSubmit = async (action: 'save' | 'launch') => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Campaign name is required')
        return
      }
      
      if (!formData.voicemailScript.trim()) {
        toast.error('Voicemail script is required')
        return
      }
      
      // Create campaign data
      const campaignData = {
        name: formData.name,
        script: formData.voicemailScript,
        voice_id: `professional_${formData.voiceSettings.voice}`,
        delivery_time_start: formData.scheduledTime || '10:00',
        delivery_time_end: '18:00',
        time_zone: 'America/New_York'
      }
      
      // Create the campaign
      await createCampaign(campaignData)
      
      // Show success message
      toast.success(`Campaign "${formData.name}" ${action === 'save' ? 'saved' : 'launched'} successfully!`)
      
      // Navigate back to campaigns list
      router.push('/campaigns')
      
    } catch (error) {
      console.error('Error submitting campaign:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sampleScripts = [
    {
      title: 'New Vehicle Promotion',
      category: 'Sales',
      script: 'Hi, this is [Your Name] from [Dealership Name]. We have exciting new 2024 models with special financing options starting at 0.9% APR. Call us back at [Phone Number] to schedule a test drive and learn about our current incentives. Limited time offer - do not miss out!',
      duration: '25 seconds'
    },
    {
      title: 'Service Reminder',
      category: 'Service',
      script: 'Hello, this is [Your Name] from [Dealership Name]. Your vehicle is due for its scheduled maintenance. We have convenient appointment times available this week with our certified technicians. Please call us at [Phone Number] to schedule your service. We appreciate your business!',
      duration: '28 seconds'
    },
    {
      title: 'Trade-in Opportunity',
      category: 'Trade-in',
      script: 'Hi, this is [Your Name] from [Dealership Name]. We are currently offering exceptional trade-in values for your current vehicle - up to $5,000 above market value! Call us at [Phone Number] to get a free evaluation and learn about upgrading to a newer model with the latest features.',
      duration: '30 seconds'
    },
    {
      title: 'Follow-up After Visit',
      category: 'Follow-up',
      script: 'Hello, this is [Your Name] from [Dealership Name]. Thank you for visiting us recently. I wanted to follow up on the vehicle you were interested in. We have additional options and financing programs that might interest you. Please call me back at [Phone Number] at your convenience.',
      duration: '26 seconds'
    }
  ]

  const insertSampleScript = (script: string) => {
    setFormData(prev => ({
      ...prev,
      voicemailScript: script
    }))
  }

  const steps = [
    { id: 1, name: 'Campaign Details', icon: FileText },
    { id: 2, name: 'Voicemail Script', icon: Mic },
    { id: 3, name: 'Customer Selection', icon: Users },
    { id: 4, name: 'Scheduling & Launch', icon: Calendar }
  ]

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return formData.name.length > 0
      case 2: return (
        formData.messageType === 'text-to-speech' 
          ? formData.voicemailScript.length > 0
          : formData.voiceRecording !== undefined
      )
      case 3: return formData.customerList === 'all' || formData.customerList === 'uploaded' || (formData.customerList === 'custom' && formData.customCustomers.length > 0)
      case 4: return true
      default: return false
    }
  }

  const customerCounts = {
    uploaded: 250,
    all: 1250,
    custom: formData.customCustomers ? formData.customCustomers.split(',').filter(p => p.trim()).length : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AdvancedNavigation />
      
      {/* Demo Banner */}
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 mx-6 mt-6 rounded-xl"
        >
          <div className="flex items-center p-4">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800 font-medium">
              <strong>Demo Mode:</strong> Create and test campaigns with full functionality. All features are available for demonstration.
            </p>
          </div>
        </motion.div>
      )}

      <div className="p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/campaigns">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Campaigns
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                  Create New Campaign
                </h1>
                <p className="text-gray-600 font-medium">Design and launch your voicemail drop campaign</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 bg-white/80 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all shadow-lg ${
                        currentStep === step.id
                          ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25'
                          : isStepComplete(step.id)
                          ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/25'
                          : 'border-gray-300 bg-white/80 text-gray-500 shadow-gray-200/50'
                      }`}
                    >
                      {isStepComplete(step.id) && currentStep !== step.id ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-4 hidden sm:block">
                      <p className={`text-sm font-bold ${
                        currentStep === step.id ? 'text-blue-700' : 
                        isStepComplete(step.id) ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-6 rounded-full ${
                      isStepComplete(step.id) ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-white/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Campaign Details</h3>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Set up your campaign name and basic settings
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Campaign Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., New Year Sales Campaign"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Priority Level
                        </label>
                        <div className="flex gap-3">
                          {[
                            { value: 'low', label: 'Low', gradient: 'from-gray-500 to-slate-600' },
                            { value: 'medium', label: 'Medium', gradient: 'from-yellow-500 to-orange-600' },
                            { value: 'high', label: 'High', gradient: 'from-red-500 to-pink-600' }
                          ].map((priority) => (
                            <Button
                              key={priority.value}
                              type="button"
                              variant={formData.priority === priority.value ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as 'low' | 'medium' | 'high' }))}
                              className={formData.priority === priority.value 
                                ? `bg-gradient-to-r ${priority.gradient} text-white border-0 font-bold` 
                                : 'bg-white/70 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm'
                              }
                            >
                              {priority.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Campaign Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Promotion', 'Follow-up', 'Service', 'New Inventory', 'Holiday Sale'].map((tag, index) => {
                            const gradients = [
                              'from-blue-500 to-indigo-600',
                              'from-green-500 to-emerald-600', 
                              'from-purple-500 to-pink-600',
                              'from-orange-500 to-red-600',
                              'from-teal-500 to-cyan-600'
                            ];
                            return (
                              <Button
                                key={tag}
                                type="button"
                                variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    tags: prev.tags.includes(tag)
                                      ? prev.tags.filter(t => t !== tag)
                                      : [...prev.tags, tag]
                                  }))
                                }}
                                className={formData.tags.includes(tag) 
                                  ? `bg-gradient-to-r ${gradients[index]} text-white border-0 font-bold` 
                                  : 'bg-white/70 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm'
                                }
                              >
                                {tag}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-white/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                          <Mic className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Voicemail Message</h3>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Choose how to create your voicemail message
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Message Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Message Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              formData.messageType === 'text-to-speech' 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, messageType: 'text-to-speech' }))}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="messageType"
                                value="text-to-speech"
                                checked={formData.messageType === 'text-to-speech'}
                                onChange={handleInputChange}
                                className="text-blue-600"
                                aria-label="Text-to-Speech"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">Text-to-Speech</h4>
                                <p className="text-sm text-gray-600">Write your message and let AI generate the voice</p>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              formData.messageType === 'voice-recording' 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, messageType: 'voice-recording' }))}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="messageType"
                                value="voice-recording"
                                checked={formData.messageType === 'voice-recording'}
                                onChange={handleInputChange}
                                className="text-blue-600"
                                aria-label="Voice Recording"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">Voice Recording</h4>
                                <p className="text-sm text-gray-600">Record your own voice message</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Text-to-Speech Section */}
                      {formData.messageType === 'text-to-speech' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6"
                        >
                          <div>
                            <label htmlFor="voicemailScript" className="block text-sm font-bold text-gray-700 mb-3">
                              Message Content *
                            </label>
                            <textarea
                              id="voicemailScript"
                              name="voicemailScript"
                              value={formData.voicemailScript}
                              onChange={handleInputChange}
                              rows={6}
                              className="flex min-h-[120px] w-full rounded-xl border border-gray-200/50 backdrop-blur-sm bg-white/70 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                              placeholder="Enter your voicemail message here..."
                            />
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm text-gray-500 font-medium">
                                Keep under 30 seconds. Use [Your Name], [Dealership Name], [Phone Number] as placeholders.
                              </p>
                              <Badge variant="outline" className="text-xs bg-white/70 border-gray-200/50 font-medium">
                                {formData.voicemailScript.length} chars
                              </Badge>
                            </div>
                          </div>

                          {/* Voice Settings */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border border-gray-200/50 rounded-xl backdrop-blur-sm bg-gradient-to-r from-gray-50 to-blue-50">
                            <div>
                              <label htmlFor="voice-select" className="block text-sm font-bold text-gray-700 mb-2">Voice</label>
                              <select
                                id="voice-select"
                                value={formData.voiceSettings.voice}
                                onChange={(e) => handleVoiceSettingChange('voice', e.target.value)}
                                className="flex h-10 w-full rounded-lg border border-gray-200/50 backdrop-blur-sm bg-white/70 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="tone-select" className="block text-sm font-bold text-gray-700 mb-2">Tone</label>
                              <select
                                id="tone-select"
                                value={formData.voiceSettings.tone}
                                onChange={(e) => handleVoiceSettingChange('tone', e.target.value)}
                                className="flex h-10 w-full rounded-lg border border-gray-200/50 backdrop-blur-sm bg-white/70 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="professional">Professional</option>
                                <option value="friendly">Friendly</option>
                                <option value="casual">Casual</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="speed-select" className="block text-sm font-bold text-gray-700 mb-2">Speed</label>
                              <select
                                id="speed-select"
                                value={formData.voiceSettings.speed}
                                onChange={(e) => handleVoiceSettingChange('speed', parseFloat(e.target.value))}
                                className="flex h-10 w-full rounded-lg border border-gray-200/50 backdrop-blur-sm bg-white/70 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value={0.8}>Slow</option>
                                <option value={1.0}>Normal</option>
                                <option value={1.2}>Fast</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/70 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm">
                              <Volume2 className="h-4 w-4" />
                              Preview Voice
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/70 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm">
                              <Upload className="h-4 w-4" />
                              Upload Audio
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Voice Recording Section */}
                      {formData.messageType === 'voice-recording' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <VoiceRecorder
                            onRecordingComplete={handleRecordingComplete}
                            onRecordingDelete={handleRecordingDelete}
                            existingRecording={formData.voiceRecording?.blob}
                            maxDuration={30}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Sample Scripts */}
                  <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Sample Scripts</h3>
                      <p className="text-gray-600 font-medium">Choose from proven templates to get started quickly</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sampleScripts.map((sample, index) => {
                          const categoryColors = {
                            'Sales': 'from-blue-500 to-indigo-600',
                            'Service': 'from-green-500 to-emerald-600',
                            'Trade-in': 'from-purple-500 to-pink-600',
                            'Follow-up': 'from-orange-500 to-red-600'
                          };
                          return (
                            <div key={index} className="backdrop-blur-sm bg-white/50 border border-gray-200/50 rounded-xl p-4 hover:shadow-lg hover:bg-white/70 transition-all">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-sm text-gray-900">{sample.title}</h4>
                                <div className="flex gap-2">
                                  <Badge className={`text-xs bg-gradient-to-r ${categoryColors[sample.category as keyof typeof categoryColors] || 'from-gray-500 to-slate-600'} text-white border-0 font-bold`}>
                                    {sample.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-white/70 border-gray-200/50 font-medium">
                                    {sample.duration}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 font-medium mb-4 line-clamp-3">{sample.script}</p>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => insertSampleScript(sample.script)}
                                  className="text-xs flex items-center gap-1 bg-white/70 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm"
                                >
                                  <Copy className="h-3 w-3" />
                                  Use Script
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-xs bg-white/50 hover:bg-white/70"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-white/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                          <Users className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Customer Selection</h3>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Choose which customers will receive your voicemail
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        {[
                          { value: 'uploaded', label: 'Recently uploaded customer list', count: customerCounts.uploaded, recommended: true },
                          { value: 'all', label: 'All customers in database', count: customerCounts.all, recommended: false },
                          { value: 'custom', label: 'Custom phone number list', count: customerCounts.custom, recommended: false }
                        ].map((option) => (
                          <div key={option.value} className={`border border-gray-200/50 backdrop-blur-sm bg-white/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                            formData.customerList === option.value 
                              ? 'border-blue-500/50 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg' 
                              : 'hover:border-gray-300/50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, customerList: option.value as 'all' | 'uploaded' | 'custom' }))}
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="customerList"
                                value={option.value}
                                checked={formData.customerList === option.value}
                                onChange={handleInputChange}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900">{option.label}</span>
                                  {option.recommended && <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">Recommended</Badge>}
                                </div>
                                <p className="text-sm text-gray-600 font-medium mt-1">
                                  {option.count.toLocaleString()} customers
                                </p>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      {formData.customerList === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <textarea
                            name="customCustomers"
                            value={formData.customCustomers}
                            onChange={handleInputChange}
                            rows={4}
                            className="flex min-h-[80px] w-full rounded-xl border border-gray-200/50 backdrop-blur-sm bg-white/70 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter phone numbers separated by commas: +1234567890, +1987654321, ..."
                          />
                          <p className="text-sm text-gray-500 font-medium mt-2">
                            Format: Include country code for best results
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-white/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Scheduling & Launch</h3>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Choose when to send your campaign
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule Date
                          </label>
                          <Input
                            type="date"
                            id="scheduledDate"
                            name="scheduledDate"
                            value={formData.scheduledDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <p className="text-sm text-gray-500 mt-1">Leave empty to send immediately</p>
                        </div>
                        
                        <div>
                          <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule Time
                          </label>
                          <Input
                            type="time"
                            id="scheduledTime"
                            name="scheduledTime"
                            value={formData.scheduledTime}
                            onChange={handleInputChange}
                          />
                          <p className="text-sm text-gray-500 mt-1">Best times: 10 AM - 2 PM or 4 PM - 6 PM</p>
                        </div>
                      </div>

                      <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-blue-900 text-sm">Optimal Delivery Times</h4>
                            <p className="text-blue-800 text-sm font-medium mt-1">
                              For best results, schedule campaigns during business hours (10 AM - 6 PM) on weekdays. 
                              Avoid early mornings, late evenings, and weekends.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={() => handleSubmit('save')}
                          disabled={isSubmitting || !formData.name || !isStepComplete(2)}
                          variant="outline"
                          className="flex-1 flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isSubmitting ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        
                        <Button
                          onClick={() => handleSubmit('launch')}
                          disabled={isSubmitting || !formData.name || !isStepComplete(2)}
                          className="flex-1 flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Launching...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Launch Campaign
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-white/80 hover:bg-white/90 border-gray-200/50 backdrop-blur-sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={currentStep === 4 || !isStepComplete(currentStep)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Sidebar - Campaign Preview */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="backdrop-blur-md bg-white/70 border border-white/50 rounded-2xl shadow-xl sticky top-6">
                <div className="p-6 border-b border-white/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Campaign Preview</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Campaign Name</p>
                    <p className="font-bold text-gray-900">{formData.name || 'Untitled Campaign'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Target Audience</p>
                    <p className="font-bold text-gray-900">
                      {customerCounts[formData.customerList].toLocaleString()} customers
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Priority</p>
                    <Badge className={`font-bold text-white border-0 ${
                      formData.priority === 'high' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                        : formData.priority === 'medium' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                        : 'bg-gradient-to-r from-gray-500 to-slate-600'
                    }`}>
                      {formData.priority}
                    </Badge>
                  </div>

                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag, index) => {
                          const gradients = [
                            'from-blue-500 to-indigo-600',
                            'from-green-500 to-emerald-600', 
                            'from-purple-500 to-pink-600',
                            'from-orange-500 to-red-600',
                            'from-teal-500 to-cyan-600'
                          ];
                          return (
                            <Badge 
                              key={tag} 
                              className={`text-xs bg-gradient-to-r ${gradients[index % gradients.length]} text-white border-0 font-bold`}
                            >
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Delivery</p>
                    <p className="font-bold text-gray-900">
                      {formData.scheduledDate && formData.scheduledTime 
                        ? `${new Date(formData.scheduledDate).toLocaleDateString()} at ${formData.scheduledTime}`
                        : 'Immediate'
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Message Type</p>
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 font-bold">
                      {formData.messageType === 'text-to-speech' ? 'Text-to-Speech' : 'Voice Recording'}
                    </Badge>
                  </div>

                  {formData.messageType === 'text-to-speech' && formData.voicemailScript && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Script Preview</p>
                      <div className="backdrop-blur-sm bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50 p-4 rounded-xl text-sm text-gray-700 max-h-32 overflow-y-auto">
                        {formData.voicemailScript}
                      </div>
                    </div>
                  )}

                  {formData.messageType === 'voice-recording' && formData.voiceRecording && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Voice Recording</p>
                      <div className="backdrop-blur-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 p-4 rounded-xl text-sm text-gray-700 flex items-center gap-2">
                        <Mic className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Recording duration: {Math.round(formData.voiceRecording.duration)}s</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Estimated delivery: ~30 seconds per customer</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
