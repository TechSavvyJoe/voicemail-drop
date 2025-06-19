'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ElementType
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  isLoading?: boolean
}

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
  green: 'bg-green-500/10 text-green-600 border-green-200',
  orange: 'bg-orange-500/10 text-orange-600 border-orange-200',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  red: 'bg-red-500/10 text-red-600 border-red-200',
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  isLoading = false 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn(
            'p-2 rounded-lg border',
            colorClasses[color]
          )}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
            )}
            
            {change && !isLoading && (
              <div className="flex items-center space-x-1">
                {change.type === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] pointer-events-none" />
      </Card>
    </motion.div>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ElementType
  onClick: () => void
  variant?: 'default' | 'primary' | 'secondary'
  disabled?: boolean
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  variant = 'default',
  disabled = false
}: QuickActionProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          disabled && "opacity-50 cursor-not-allowed",
          variant === 'primary' && "border-blue-200 bg-blue-50/50",
          variant === 'secondary' && "border-purple-200 bg-purple-50/50"
        )}
        onClick={disabled ? undefined : onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              variant === 'primary' ? "bg-blue-500/10 text-blue-600" :
              variant === 'secondary' ? "bg-purple-500/10 text-purple-600" :
              "bg-gray-500/10 text-gray-600"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

interface UsageIndicatorProps {
  current: number
  limit: number
  label: string
  isLoading?: boolean
}

export function UsageIndicator({ current, limit, label, isLoading = false }: UsageIndicatorProps) {
  const percentage = (current / limit) * 100
  const isNearLimit = percentage > 80
  const isOverLimit = percentage > 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <Badge variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "default"}>
              {isLoading ? "..." : `${current.toLocaleString()} / ${limit.toLocaleString()}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <div className="space-y-2">
              <Progress 
                value={Math.min(percentage, 100)} 
                className={cn(
                  "h-2",
                  isOverLimit && "bg-red-100",
                  isNearLimit && "bg-yellow-100"
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percentage.toFixed(1)}% used</span>
                <span>
                  {limit - current > 0 
                    ? `${(limit - current).toLocaleString()} remaining`
                    : 'Limit exceeded'
                  }
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface RealtimeIndicatorProps {
  isConnected: boolean
  lastUpdate?: Date
}

export function RealtimeIndicator({ isConnected, lastUpdate }: RealtimeIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-2 text-xs text-muted-foreground"
    >
      <div className={cn(
        "w-2 h-2 rounded-full",
        isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
      )} />
      <span>
        {isConnected ? "Live" : "Disconnected"}
        {lastUpdate && ` • Updated ${lastUpdate.toLocaleTimeString()}`}
      </span>
    </motion.div>
  )
}
