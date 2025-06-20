'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart 
} from 'recharts'
import {
  TrendingUp, TrendingDown, Phone, DollarSign, Target,
  AlertTriangle, CheckCircle, Clock, Zap, Activity,
  Brain, Download, Filter, Calendar, MessageSquare
} from 'lucide-react'

// Mock data for demonstration
const mockAnalytics = {
  overview: {
    totalCampaigns: 24,
    totalVoicemails: 12847,
    totalContacts: 8932,
    overallDeliveryRate: 94.2,
    totalCost: 2847.50,
    avgCostPerLead: 0.22,
    conversionRate: 18.7,
    roi: 342.5
  },
  performance: {
    bestPerformingCampaign: 'New Arrival - Honda Accord',
    worstPerformingCampaign: 'Generic Follow-up',
    peakHours: [
      { hour: 10, count: 523 },
      { hour: 11, count: 487 },
      { hour: 14, count: 456 },
      { hour: 15, count: 445 },
      { hour: 16, count: 412 }
    ],
    bestDays: [
      { day: 'Tuesday', deliveryRate: 96.8 },
      { day: 'Wednesday', deliveryRate: 95.4 },
      { day: 'Thursday', deliveryRate: 94.9 },
      { day: 'Monday', deliveryRate: 94.1 },
      { day: 'Friday', deliveryRate: 92.3 }
    ]
  },
  compliance: {
    tcpaViolations: 3,
    dncHits: 12,
    frequencyViolations: 5,
    timeViolations: 8,
    complianceScore: 98.7
  },
  leadManagement: {
    hotLeads: 247,
    warmLeads: 431,
    coldLeads: 298,
    averageLeadScore: 67.3,
    conversionByScore: [
      { scoreRange: '80-100', conversionRate: 45.2 },
      { scoreRange: '60-79', conversionRate: 28.7 },
      { scoreRange: '40-59', conversionRate: 15.3 },
      { scoreRange: '20-39', conversionRate: 8.1 },
      { scoreRange: '0-19', conversionRate: 3.4 }
    ]
  },
  trends: {
    dailyMetrics: [
      { date: '2024-01-01', sent: 245, delivered: 231, cost: 54.12 },
      { date: '2024-01-02', sent: 287, delivered: 271, cost: 63.45 },
      { date: '2024-01-03', sent: 312, delivered: 295, cost: 69.34 },
      { date: '2024-01-04', sent: 298, delivered: 279, cost: 65.78 },
      { date: '2024-01-05', sent: 334, delivered: 318, cost: 73.92 }
    ],
    weeklyTrends: [
      { week: 'Week 1', growth: 12.4 },
      { week: 'Week 2', growth: 8.7 },
      { week: 'Week 3', growth: 15.2 },
      { week: 'Week 4', growth: -2.8 }
    ]
  }
}



interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color: string
  format?: 'currency' | 'percentage' | 'number'
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color, format }) => {
  const formatValue = (val: string | number) => {
    if (format === 'currency') return `$${Number(val).toLocaleString()}`
    if (format === 'percentage') return `${val}%`
    return val.toLocaleString()
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  onClick: () => void
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, color, onClick }) => (
  <motion.button
    className="bg-white rounded-lg shadow-sm border p-4 text-left hover:shadow-md transition-shadow"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center mb-3">
      <div className={`p-2 rounded-lg ${color} mr-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.button>
)

export default function EnhancedDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Advanced insights for your voicemail campaigns</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                title="Select time range for analytics"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Voicemails"
            value={mockAnalytics.overview.totalVoicemails}
            change={12.4}
            icon={Phone}
            color="bg-blue-500"
            format="number"
          />
          <MetricCard
            title="Delivery Rate"
            value={mockAnalytics.overview.overallDeliveryRate}
            change={2.3}
            icon={CheckCircle}
            color="bg-green-500"
            format="percentage"
          />
          <MetricCard
            title="Conversion Rate"
            value={mockAnalytics.overview.conversionRate}
            change={8.7}
            icon={Target}
            color="bg-purple-500"
            format="percentage"
          />
          <MetricCard
            title="ROI"
            value={mockAnalytics.overview.roi}
            change={15.2}
            icon={DollarSign}
            color="bg-green-600"
            format="percentage"
          />
        </div>

        {/* Lead Scoring Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Distribution</h3>
              <Brain className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Hot Leads</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{mockAnalytics.leadManagement.hotLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Warm Leads</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{mockAnalytics.leadManagement.warmLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Cold Leads</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{mockAnalytics.leadManagement.coldLeads}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-lg font-semibold text-gray-900">{mockAnalytics.leadManagement.averageLeadScore}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">TCPA Compliance</h3>
              <AlertTriangle className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance Score</span>
                <span className="text-2xl font-bold text-green-600">{mockAnalytics.compliance.complianceScore}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mockAnalytics.compliance.complianceScore}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">DNC Hits</span>
                  <p className="font-semibold text-gray-900">{mockAnalytics.compliance.dncHits}</p>
                </div>
                <div>
                  <span className="text-gray-600">Time Violations</span>
                  <p className="font-semibold text-gray-900">{mockAnalytics.compliance.timeViolations}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Best Performing</span>
                <p className="font-semibold text-green-600 text-sm">{mockAnalytics.performance.bestPerformingCampaign}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Needs Improvement</span>
                <p className="font-semibold text-red-600 text-sm">{mockAnalytics.performance.worstPerformingCampaign}</p>
              </div>
              <div className="pt-3 border-t">
                <span className="text-sm text-gray-600">Peak Hour</span>
                <p className="font-semibold text-gray-900">10:00 AM - 523 calls</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Performance Chart */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockAnalytics.trends.dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="delivered" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="sent" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Conversion by Lead Score */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion by Lead Score</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.leadManagement.conversionByScore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scoreRange" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversionRate" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Peak Hours Chart */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Peak Calling Hours</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockAnalytics.performance.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
              <YAxis />
              <Tooltip labelFormatter={(hour) => `${hour}:00`} />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              title="Create A/B Test"
              description="Test different messages for better performance"
              icon={Zap}
              color="bg-purple-500"
              onClick={() => console.log('Create A/B test')}
            />
            <QuickAction
              title="Schedule Campaign"
              description="Set up recurring voicemail campaigns"
              icon={Calendar}
              color="bg-blue-500"
              onClick={() => console.log('Schedule campaign')}
            />
            <QuickAction
              title="Segment Contacts"
              description="Create smart contact segments"
              icon={Filter}
              color="bg-green-500"
              onClick={() => console.log('Segment contacts')}
            />
            <QuickAction
              title="Message Templates"
              description="Browse proven message templates"
              icon={MessageSquare}
              color="bg-orange-500"
              onClick={() => console.log('Message templates')}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
