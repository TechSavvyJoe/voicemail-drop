'use client'

import { useState, useMemo } from 'react'
import { 
  Play, Pause, RefreshCw, AlertTriangle, 
  CheckCircle, Clock, Users, BarChart3,
  Settings, Download, Share, Copy, Eye,
  Calendar, Target, TrendingUp, Square
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Campaign {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed'
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  failedCount: number
  completionRate: number
  estimatedCost: number
  actualCost: number
  scheduledAt?: string
  startedAt?: string
  completedAt?: string
  script: string
  targetAudience: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  tags: string[]
  createdAt: string
}

interface CampaignWorkflowProps {
  campaign: Campaign
  onStatusChange: (status: Campaign['status']) => void
  onEdit: () => void
  onClone: () => void
  onDelete: () => void
}

const statusConfig = {
  draft: { 
    label: 'Draft', 
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Settings,
    actions: ['edit', 'schedule', 'delete']
  },
  scheduled: { 
    label: 'Scheduled', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock,
    actions: ['edit', 'start', 'cancel']
  },
  running: { 
    label: 'Running', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Play,
    actions: ['pause', 'stop', 'monitor']
  },
  paused: { 
    label: 'Paused', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Pause,
    actions: ['resume', 'stop', 'edit']
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    actions: ['view-results', 'clone', 'export']
  },
  failed: { 
    label: 'Failed', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertTriangle,
    actions: ['retry', 'edit', 'view-logs']
  }
}

const priorityConfig = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200'
}

export function CampaignWorkflow({ 
  campaign, 
  onStatusChange, 
  onEdit, 
  onClone, 
  onDelete 
}: CampaignWorkflowProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const config = statusConfig[campaign.status]
  
  const deliveryRate = campaign.sentCount > 0 
    ? (campaign.deliveredCount / campaign.sentCount) * 100 
    : 0

  const progressPercentage = campaign.totalRecipients > 0 
    ? (campaign.sentCount / campaign.totalRecipients) * 100 
    : 0

  const timeEstimate = useMemo(() => {
    if (campaign.status !== 'running' || campaign.sentCount === 0) return null
    
    const remaining = campaign.totalRecipients - campaign.sentCount
    const rate = campaign.sentCount / (Date.now() - new Date(campaign.startedAt || '').getTime())
    const estimatedMs = remaining / rate
    
    const hours = Math.floor(estimatedMs / (1000 * 60 * 60))
    const minutes = Math.floor((estimatedMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }, [campaign])

  const handleAction = async (action: string) => {
    setIsProcessing(true)
    
    try {
      switch (action) {
        case 'start':
        case 'resume':
          onStatusChange('running')
          break
        case 'pause':
          onStatusChange('paused')
          break
        case 'stop':
        case 'cancel':
          onStatusChange('completed')
          break
        case 'schedule':
          onStatusChange('scheduled')
          break
        case 'retry':
          onStatusChange('running')
          break
        case 'edit':
          onEdit()
          break
        case 'clone':
          onClone()
          break
        case 'delete':
          onDelete()
          break
        default:
          console.log('Action:', action)
      }
    } finally {
      setTimeout(() => setIsProcessing(false), 1000)
    }
  }

  return (
    <Card className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-bold text-slate-900">
                {campaign.name}
              </CardTitle>
              <Badge className={config.color}>
                <config.icon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
              <Badge className={priorityConfig[campaign.priority]}>
                {campaign.priority.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {campaign.totalRecipients.toLocaleString()} recipients
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {campaign.targetAudience}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(campaign.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {config.actions.includes('monitor') && (
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => handleAction('clone')}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        {campaign.status === 'running' || campaign.status === 'paused' || campaign.status === 'completed' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Campaign Progress</span>
              <span className="text-slate-600">
                {campaign.sentCount.toLocaleString()} / {campaign.totalRecipients.toLocaleString()}
              </span>
            </div>
            
            <Progress value={progressPercentage} className="h-3" />
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{campaign.sentCount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{campaign.deliveredCount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{campaign.failedCount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{deliveryRate.toFixed(1)}%</div>
                <div className="text-xs text-slate-500">Success Rate</div>
              </div>
            </div>

            {timeEstimate && campaign.status === 'running' && (
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Estimated completion: {timeEstimate}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Cost and Performance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-lg font-semibold text-slate-900">
              ${campaign.actualCost > 0 ? campaign.actualCost.toFixed(2) : campaign.estimatedCost.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">
              {campaign.actualCost > 0 ? 'Actual Cost' : 'Est. Cost'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-lg font-semibold text-slate-900">
              {campaign.assignedTo.split(' ')[0]}
            </div>
            <div className="text-xs text-slate-500">Assigned To</div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-lg font-semibold text-slate-900">
              {campaign.completionRate.toFixed(0)}%
            </div>
            <div className="text-xs text-slate-500">Completion</div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-lg font-semibold text-slate-900">
              {campaign.tags.length}
            </div>
            <div className="text-xs text-slate-500">Tags</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
          {config.actions.map((action) => {
            const getActionConfig = (actionType: string) => {
              switch (actionType) {
                case 'start':
                case 'resume':
                  return { label: 'Start Campaign', icon: Play, variant: 'default' as const, color: 'bg-emerald-600 hover:bg-emerald-700' }
                case 'pause':
                  return { label: 'Pause', icon: Pause, variant: 'outline' as const, color: '' }
                case 'stop':
                case 'cancel':
                  return { label: 'Stop', icon: Square, variant: 'outline' as const, color: '' }
                case 'edit':
                  return { label: 'Edit', icon: Settings, variant: 'outline' as const, color: '' }
                case 'schedule':
                  return { label: 'Schedule', icon: Calendar, variant: 'default' as const, color: 'bg-blue-600 hover:bg-blue-700' }
                case 'retry':
                  return { label: 'Retry', icon: RefreshCw, variant: 'default' as const, color: 'bg-orange-600 hover:bg-orange-700' }
                case 'clone':
                  return { label: 'Clone', icon: Copy, variant: 'outline' as const, color: '' }
                case 'view-results':
                  return { label: 'View Results', icon: BarChart3, variant: 'outline' as const, color: '' }
                case 'export':
                  return { label: 'Export', icon: Download, variant: 'outline' as const, color: '' }
                case 'monitor':
                  return { label: 'Monitor', icon: TrendingUp, variant: 'outline' as const, color: '' }
                case 'delete':
                  return { label: 'Delete', icon: AlertTriangle, variant: 'destructive' as const, color: '' }
                default:
                  return { label: action, icon: Settings, variant: 'outline' as const, color: '' }
              }
            }

            const actionConfig = getActionConfig(action)
            
            return (
              <Button
                key={action}
                variant={actionConfig.variant}
                size="sm"
                onClick={() => handleAction(action)}
                disabled={isProcessing}
                className={actionConfig.color}
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <actionConfig.icon className="h-4 w-4 mr-2" />
                )}
                {actionConfig.label}
              </Button>
            )
          })}
        </div>

        {/* Tags */}
        {campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {campaign.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
