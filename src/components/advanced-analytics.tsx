'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Phone, 
  DollarSign, Download,
  ArrowUp, ArrowDown, Target, Filter,
  Zap, LineChart,
  Car, Star, Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart,
  Cell, Area, AreaChart
} from 'recharts'

interface AnalyticsData {
  overview: {
    totalCampaigns: number
    totalCalls: number
    deliveryRate: number
    totalCost: number
    avgDuration: number
    successRate: number
    roiPercentage: number
    customerConversions: number
  }
  trends: {
    callsOverTime: Array<{ date: string; calls: number; delivered: number; cost: number }>
    performanceMetrics: Array<{ metric: string; value: number; change: number }>
    hourlyPerformance: Array<{ hour: string; success: number; total: number }>
  }
  demographics: {
    vehicleTypes: Array<{ type: string; calls: number; conversions: number }>
    regions: Array<{ region: string; calls: number; success: number }>
    leadSources: Array<{ source: string; count: number; conversion: number }>
  }
  campaigns: {
    topPerforming: Array<{ name: string; deliveryRate: number; cost: number; conversions: number }>
    recentActivity: Array<{ campaign: string; status: string; timestamp: string }>
  }
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData
  timeRange: string
  onTimeRangeChange: (range: string) => void
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export function AdvancedAnalytics({ data, timeRange, onTimeRangeChange }: AdvancedAnalyticsProps) {
  const [activeChart, setActiveChart] = useState<'calls' | 'performance' | 'demographics'>('calls')

  // Calculate key metrics
  const metrics = useMemo(() => {
    const { overview } = data
    const conversionRate = overview.totalCalls > 0 ? (overview.customerConversions / overview.totalCalls) * 100 : 0
    const costPerCall = overview.totalCalls > 0 ? overview.totalCost / overview.totalCalls : 0
    const costPerConversion = overview.customerConversions > 0 ? overview.totalCost / overview.customerConversions : 0
    
    return {
      conversionRate,
      costPerCall,
      costPerConversion,
      avgCostPerMinute: overview.avgDuration > 0 ? costPerCall / (overview.avgDuration / 60) : 0
    }
  }, [data])

  const statCards = [
    {
      title: 'Total Campaigns',
      value: data.overview.totalCampaigns.toLocaleString(),
      icon: Target,
      change: '+12%',
      trend: 'up' as const,
      color: 'blue'
    },
    {
      title: 'Voicemails Sent',
      value: data.overview.totalCalls.toLocaleString(),
      icon: Phone,
      change: '+8.3%',
      trend: 'up' as const,
      color: 'emerald'
    },
    {
      title: 'Delivery Rate',
      value: `${data.overview.deliveryRate.toFixed(1)}%`,
      icon: TrendingUp,
      change: '+2.1%',
      trend: 'up' as const,
      color: 'purple'
    },
    {
      title: 'Customer Conversions',
      value: data.overview.customerConversions.toLocaleString(),
      icon: Award,
      change: '+15.7%',
      trend: 'up' as const,
      color: 'amber'
    },
    {
      title: 'Total Investment',
      value: `$${data.overview.totalCost.toLocaleString()}`,
      icon: DollarSign,
      change: '+5.2%',
      trend: 'up' as const,
      color: 'green'
    },
    {
      title: 'ROI',
      value: `${data.overview.roiPercentage.toFixed(1)}%`,
      icon: Star,
      change: '+22.3%',
      trend: 'up' as const,
      color: 'indigo'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Comprehensive performance insights for your voicemail campaigns
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select time range"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Last Year</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-2 border-slate-200 hover:border-blue-300 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 border border-${stat.color}-200 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Chart Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2"
      >
        <Button
          variant={activeChart === 'calls' ? 'default' : 'outline'}
          onClick={() => setActiveChart('calls')}
          className="flex items-center gap-2"
        >
          <LineChart className="h-4 w-4" />
          Campaign Trends
        </Button>
        <Button
          variant={activeChart === 'performance' ? 'default' : 'outline'}
          onClick={() => setActiveChart('performance')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Performance Analysis
        </Button>
        <Button
          variant={activeChart === 'demographics' ? 'default' : 'outline'}
          onClick={() => setActiveChart('demographics')}
          className="flex items-center gap-2"
        >
          <PieChart className="h-4 w-4" />
          Customer Insights
        </Button>
      </motion.div>

      {/* Main Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Primary Chart */}
        <Card className="col-span-1 lg:col-span-2 border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {activeChart === 'calls' && 'Campaign Performance Over Time'}
                {activeChart === 'performance' && 'Hourly Performance Analysis'}
                {activeChart === 'demographics' && 'Vehicle Type Distribution'}
              </span>
              <Badge variant="outline" className="ml-2">
                {timeRange.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'calls' ? (
                  <AreaChart data={data.trends.callsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="calls" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      name="Total Calls"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="delivered" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Delivered"
                    />
                  </AreaChart>
                ) : activeChart === 'performance' ? (
                  <BarChart data={data.trends.hourlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="success" fill="#10B981" name="Success Rate" />
                    <Bar dataKey="total" fill="#3B82F6" name="Total Calls" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <PieChart
                      data={data.demographics.vehicleTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="calls"
                    >
                      {data.demographics.vehicleTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </PieChart>
                    <Tooltip />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Top Performing Campaigns */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Top Performing Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.campaigns.topPerforming.map((campaign, index) => (
              <div key={campaign.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{campaign.name}</div>
                    <div className="text-sm text-slate-500">
                      {campaign.conversions} conversions • ${campaign.cost}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {campaign.deliveryRate.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.demographics.regions.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{region.region}</span>
                  <span className="text-sm text-slate-500">
                    {region.success} / {region.calls} calls
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((region.success / region.calls) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Zap className="h-5 w-5" />
              Automotive Industry Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">${metrics.costPerCall.toFixed(2)}</div>
                <div className="text-sm text-blue-700">Cost per Call</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">${metrics.costPerConversion.toFixed(2)}</div>
                <div className="text-sm text-blue-700">Cost per Conversion</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">{metrics.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-blue-700">Conversion Rate</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">{data.overview.avgDuration.toFixed(1)}s</div>
                <div className="text-sm text-blue-700">Avg. Duration</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Optimization Recommendations</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Peak performance occurs between 10 AM - 2 PM for automotive leads</li>
                <li>• SUV and truck campaigns show 23% higher conversion rates</li>
                <li>• Consider reducing script length - optimal duration is 25-30 seconds</li>
                <li>• Tuesday and Wednesday generate the highest response rates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
