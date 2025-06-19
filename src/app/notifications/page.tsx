'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Bell, Check, AlertCircle, Info, 
  CheckCircle, Clock, Search
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdvancedNavigation } from '@/components/advanced-navigation'

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Campaign "Holiday Sales" completed',
    message: '125 voicemails delivered successfully with 85% delivery rate',
    type: 'success' as const,
    time: '5 minutes ago',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Monthly usage alert',
    message: 'You\'ve used 85% of your monthly voicemail limit. Consider upgrading your plan.',
    type: 'warning' as const,
    time: '2 hours ago',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'New customer added',
    message: 'Sarah Johnson has been added to your customer list via CSV upload',
    type: 'info' as const,
    time: '1 day ago',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    title: 'Campaign delivery started',
    message: 'Your "Weekend Special" campaign has started delivering voicemails',
    type: 'info' as const,
    time: '2 days ago',
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    title: 'System maintenance completed',
    message: 'Scheduled maintenance has been completed. All services are now operational.',
    type: 'success' as const,
    time: '3 days ago',
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length
  
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && !notification.read) ||
      (filterType === 'read' && notification.read) ||
      (filterType === notification.type)
    
    return matchesSearch && matchesFilter
  })

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <AdvancedNavigation />
      
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Notifications
              </h1>
              <p className="text-lg text-slate-600">
                Stay updated with your voicemail campaigns and system alerts
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button 
                onClick={markAllAsRead}
                className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark all as read ({unreadCount})
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white border-2 border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-50 border-2"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'unread', 'read', 'success', 'warning', 'info'].map((filter) => (
                    <Button
                      key={filter}
                      variant={filterType === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(filter)}
                      className="capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white border-2 border-slate-200">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No notifications found
                </h3>
                <p className="text-slate-600">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'All caught up! No new notifications at this time.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`
                    bg-white border-2 transition-all duration-200 hover:shadow-lg
                    ${!notification.read 
                      ? 'border-blue-300 bg-blue-50/50' 
                      : 'border-slate-200'
                    }
                  `}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                              {notification.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${notification.type === 'success' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : ''}
                                  ${notification.type === 'warning' ? 'border-amber-200 text-amber-700 bg-amber-50' : ''}
                                  ${notification.type === 'info' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                                `}
                              >
                                {notification.type}
                              </Badge>
                              <span className="text-sm text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.time}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  Mark as read
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Summary */}
        {filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-600">
              Showing {filteredNotifications.length} of {notifications.length} notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({unreadCount} unread)
                </span>
              )}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
