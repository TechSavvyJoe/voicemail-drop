'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play,
  Pause,
  MoreHorizontal,
  Calendar,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Campaign {
  id: string
  name: string
  status: 'running' | 'paused' | 'completed' | 'draft'
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  createdAt: string
  scheduledAt?: string
  script?: string
}

interface CampaignCardProps {
  campaign: Campaign
  onTogglePause?: (campaignId: string) => void
  onView?: (campaignId: string) => void
}

const statusConfig = {
  running: {
    label: 'Running',
    color: 'bg-green-500',
    badgeVariant: 'default' as const,
    icon: Play
  },
  paused: {
    label: 'Paused',
    color: 'bg-yellow-500',
    badgeVariant: 'secondary' as const,
    icon: Pause
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-500',
    badgeVariant: 'outline' as const,
    icon: TrendingUp
  },
  draft: {
    label: 'Draft',
    color: 'bg-gray-500',
    badgeVariant: 'outline' as const,
    icon: Clock
  }
}

export function CampaignCard({ campaign, onTogglePause, onView }: CampaignCardProps) {
  const config = statusConfig[campaign.status]
  const completionRate = campaign.totalRecipients > 0 
    ? (campaign.sentCount / campaign.totalRecipients) * 100 
    : 0
  const deliveryRate = campaign.sentCount > 0 
    ? (campaign.deliveredCount / campaign.sentCount) * 100 
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={config.badgeVariant} className="flex items-center space-x-1">
                <div className={cn("w-2 h-2 rounded-full", config.color)} />
                <span>{config.label}</span>
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onView?.(campaign.id)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{campaign.totalRecipients}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{campaign.sentCount}</div>
                <div className="text-muted-foreground">Sent</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">{campaign.deliveredCount}</div>
                <div className="text-muted-foreground">Delivered</div>
              </div>
            </div>
          </div>

          {/* Delivery Rate */}
          {campaign.sentCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Delivery Rate</span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {deliveryRate.toFixed(1)}%
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            {campaign.status === 'running' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onTogglePause?.(campaign.id)}
                className="flex-1"
              >
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
            )}
            {campaign.status === 'paused' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onTogglePause?.(campaign.id)}
                className="flex-1"
              >
                <Play className="h-3 w-3 mr-1" />
                Resume
              </Button>
            )}
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link href={`/campaigns/${campaign.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>

        {/* Status indicator bar */}
        <div className={cn("absolute bottom-0 left-0 right-0 h-1", config.color)} />
      </Card>
    </motion.div>
  )
}

interface CampaignListProps {
  campaigns: Campaign[]
  isLoading?: boolean
  onTogglePause?: (campaignId: string) => void
  onView?: (campaignId: string) => void
}

export function CampaignList({ campaigns, isLoading, onTogglePause, onView }: CampaignListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No campaigns yet</CardTitle>
          <CardDescription>
            Get started by creating your first voicemail campaign
          </CardDescription>
          <Button asChild className="mt-4">
            <Link href="/campaigns/new">
              Create Campaign
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <CampaignCard 
            campaign={campaign} 
            onTogglePause={onTogglePause}
            onView={onView}
          />
        </motion.div>
      ))}
    </div>
  )
}
