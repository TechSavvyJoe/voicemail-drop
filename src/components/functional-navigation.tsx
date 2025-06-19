'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Phone, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  CreditCard,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Building2,
  Activity,
  FileText,
  Zap,
  User,
  Shield,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { isDemoMode, demoUser, demoStats } from '@/lib/demo-data'

interface AdvancedNavigationProps {
  className?: string
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    badge: null,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
    badge: demoStats.totalCustomers.toString(),
  },
  {
    name: 'Campaigns', 
    href: '/campaigns',
    icon: Phone,
    badge: demoStats.activeCampaigns > 0 ? demoStats.activeCampaigns.toString() : null,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: Activity,
    badge: null,
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
    badge: null,
  },
]

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Campaign "Holiday Sales" completed',
    message: '125 voicemails delivered successfully',
    type: 'success' as const,
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    title: 'Monthly usage alert',
    message: 'You\'ve used 85% of your monthly voicemail limit',
    type: 'warning' as const,
    time: '2 hours ago',
    read: false
  },
  {
    id: '3',
    title: 'New customer added',
    message: 'Sarah Johnson has been added to your customer list',
    type: 'info' as const,
    time: '1 day ago',
    read: true
  },
  {
    id: '4',
    title: 'System maintenance',
    message: 'Scheduled maintenance will occur this weekend',
    type: 'info' as const,
    time: '2 days ago',
    read: true
  }
]

export function FunctionalNavigation({ className }: AdvancedNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const pathname = usePathname()

  const unreadCount = notifications.filter(n => !n.read).length

  // Simulated real-time notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification
      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        const newNotification = {
          id: Date.now().toString(),
          title: 'New voicemail campaign ready',
          message: 'Your scheduled campaign is ready to launch',
          type: 'info' as const,
          time: 'Just now',
          read: false
        }
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep latest 10
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search
      console.log('Searching for:', searchQuery)
      // For demo, show search results in a toast or redirect
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">VoiceDrop Pro</span>
            {isDemoMode && (
              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                DEMO
              </Badge>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="hidden md:block"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search customers, campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      autoFocus
                      onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    />
                  </div>
                </motion.form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 p-0"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors",
                          !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                        )}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                  <Link
                    href="/notifications"
                    className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {demoUser.firstName.charAt(0)}{demoUser.lastName.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{demoUser.firstName}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <DropdownMenuLabel className="pb-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{demoUser.firstName} {demoUser.lastName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{demoUser.email}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{demoUser.company}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/organization">
                  <DropdownMenuItem className="cursor-pointer">
                    <Building2 className="mr-3 h-4 w-4" />
                    <span>Organization</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/security">
                  <DropdownMenuItem className="cursor-pointer">
                    <Shield className="mr-3 h-4 w-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <Link href="/billing">
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-3 h-4 w-4" />
                    <span>Billing & Usage</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/upgrade">
                  <DropdownMenuItem className="cursor-pointer">
                    <Zap className="mr-3 h-4 w-4" />
                    <span>Upgrade Plan</span>
                    <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">Pro</Badge>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <Link href="/help">
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-3 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/docs">
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="mr-3 h-4 w-4" />
                    <span>Documentation</span>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="py-4 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-4 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
