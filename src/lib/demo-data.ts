// Demo data for the voicemail drop application
// This allows the app to work without real API keys for demonstration purposes

export const demoUser = {
  id: 'demo-user-1',
  email: 'demo@cardealership.com',
  firstName: 'John',
  lastName: 'Dealer',
  company: 'Premier Auto Sales',
  plan: 'professional' as const,
  createdAt: new Date('2024-01-01').toISOString(),
}

export const demoStats = {
  totalCustomers: 1247,
  totalCampaigns: 23,
  voicemailsSent: 8932,
  successRate: 78.5,
  monthlyUsage: 1250,
  monthlyLimit: 2500,
  activeCampaigns: 3,
}

export const demoCampaigns = [
  {
    id: 'camp-1',
    name: 'Holiday Sale Follow-up',
    status: 'running' as const,
    totalRecipients: 150,
    sentCount: 140,
    deliveredCount: 125,
    successCount: 125,
    script: "Hi [Customer Name], this is [Sales Rep] from [Dealership]. I wanted to personally reach out about our amazing holiday sale on [Vehicle Type]. We have some incredible deals that I think you'll love. Please give me a call back at your convenience so we can discuss how we can get you behind the wheel of your dream car today. Thanks and have a great day!",
    estimatedCompletion: '2 hours',
    createdAt: '2024-12-01',
  },
  {
    id: 'camp-2',
    name: 'Service Reminder Campaign',
    status: 'completed' as const,
    totalRecipients: 89,
    sentCount: 89,
    deliveredCount: 82,
    successCount: 82,
    script: "Hello [Customer Name], this is a friendly reminder from [Dealership] that your [Vehicle] is due for its scheduled maintenance. Our certified technicians are ready to keep your vehicle running smoothly. Please call us to schedule your appointment. Thank you for choosing [Dealership]!",
    estimatedCompletion: 'Completed',
    createdAt: '2024-11-20',
  },
  {
    id: 'camp-3',
    name: 'New Vehicle Promotion',
    status: 'draft' as const,
    totalRecipients: 95,
    sentCount: 0,
    deliveredCount: 0,
    successCount: 0,
    script: "Hi [Customer Name], this is [Sales Rep] from [Dealership]. We have some exciting new vehicle promotions that I think you'll love. Our latest models are arriving and I'd like to discuss how we can get you behind the wheel of your dream car. Please give me a call back at your convenience. Thanks!",
    estimatedCompletion: 'Not started',
    createdAt: '2024-12-12',
  },
]

export const demoCustomers = [
  {
    id: 'cust-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phoneNumber: '+1-555-0101',
    email: 'sarah.johnson@email.com',
    vehicleInterest: '2024 Honda Accord',
    lastContact: new Date('2024-11-15').toISOString(),
    status: 'lead' as const,
    priority: 'high' as const,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'cust-2',
    firstName: 'Mike',
    lastName: 'Chen',
    phoneNumber: '+1-555-0102',
    email: 'mike.chen@email.com',
    vehicleInterest: '2024 Toyota Camry',
    lastContact: new Date('2024-12-01').toISOString(),
    status: 'prospect' as const,
    priority: 'medium' as const,
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'cust-3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    phoneNumber: '+1-555-0103',
    email: 'emily.rodriguez@email.com',
    vehicleInterest: '2024 Nissan Altima',
    lastContact: new Date('2024-12-05').toISOString(),
    status: 'customer' as const,
    priority: 'low' as const,
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'cust-4',
    firstName: 'David',
    lastName: 'Thompson',
    phoneNumber: '+1-555-0104',
    email: 'david.thompson@email.com',
    vehicleInterest: '2025 Ford F-150',
    lastContact: new Date('2024-12-08').toISOString(),
    status: 'prospect' as const,
    priority: 'high' as const,
    createdAt: new Date('2024-04-05').toISOString(),
  },
  {
    id: 'cust-5',
    firstName: 'Lisa',
    lastName: 'Wang',
    phoneNumber: '+1-555-0105',
    email: 'lisa.wang@email.com',
    vehicleInterest: '2024 BMW X5',
    lastContact: new Date('2024-11-28').toISOString(),
    status: 'lead' as const,
    priority: 'medium' as const,
    createdAt: new Date('2024-05-12').toISOString(),
  },
  {
    id: 'cust-6',
    firstName: 'Robert',
    lastName: 'Davis',
    phoneNumber: '+1-555-0106',
    email: 'robert.davis@email.com',
    vehicleInterest: '2024 Chevrolet Silverado',
    lastContact: new Date('2024-12-10').toISOString(),
    status: 'customer' as const,
    priority: 'medium' as const,
    createdAt: new Date('2024-06-18').toISOString(),
  },
  {
    id: 'cust-7',
    firstName: 'Amanda',
    lastName: 'Wilson',
    phoneNumber: '+1-555-0107',
    email: 'amanda.wilson@email.com',
    vehicleInterest: '2024 Subaru Outback',
    lastContact: new Date('2024-11-30').toISOString(),
    status: 'lead' as const,
    priority: 'high' as const,
    createdAt: new Date('2024-07-22').toISOString(),
  },
  {
    id: 'cust-8',
    firstName: 'James',
    lastName: 'Miller',
    phoneNumber: '+1-555-0108',
    email: 'james.miller@email.com',
    vehicleInterest: '2024 Jeep Wrangler',
    lastContact: new Date('2024-12-02').toISOString(),
    status: 'prospect' as const,
    priority: 'low' as const,
    createdAt: new Date('2024-08-14').toISOString(),
  },
  {
    id: 'cust-9',
    firstName: 'Jessica',
    lastName: 'Taylor',
    phoneNumber: '+1-555-0109',
    email: 'jessica.taylor@email.com',
    vehicleInterest: '2024 Mazda CX-5',
    lastContact: new Date('2024-12-07').toISOString(),
    status: 'customer' as const,
    priority: 'medium' as const,
    createdAt: new Date('2024-09-08').toISOString(),
  },
  {
    id: 'cust-10',
    firstName: 'Christopher',
    lastName: 'Anderson',
    phoneNumber: '+1-555-0110',
    email: 'chris.anderson@email.com',
    vehicleInterest: '2024 Audi Q7',
    lastContact: new Date('2024-11-25').toISOString(),
    status: 'lead' as const,
    priority: 'high' as const,
    createdAt: new Date('2024-10-03').toISOString(),
  },
]

export const demoPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    credits: 500,
    features: [
      'Up to 500 voicemails per month',
      'Basic campaign templates',
      'Standard analytics',
      'Email support',
      'Mobile app access'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    credits: 1500,
    features: [
      'Up to 1,500 voicemails per month',
      'Custom campaign templates',
      'Advanced analytics & reporting',
      'Priority phone & email support',
      'Mobile app with push notifications',
      'Team collaboration tools'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    credits: 5000,
    features: [
      'Up to 5,000 voicemails per month',
      'Unlimited custom templates',
      'Real-time analytics dashboard',
      'Dedicated account manager',
      'White-label mobile app',
      'Advanced team management',
      'API access & integrations',
      'TCPA compliance tools'
    ],
    popular: false
  }
]

export const demoAnalytics = {
  overview: {
    totalCampaigns: 23,
    totalCalls: 8932,
    deliveryRate: 87.3,
    totalCost: 2684.60,
    avgDuration: 28.5,
    successRate: 78.5
  },
  trends: {
    callsOverTime: [
      { date: '2024-11-01', calls: 289, delivered: 251 },
      { date: '2024-11-02', calls: 312, delivered: 276 },
      { date: '2024-11-03', calls: 267, delivered: 234 },
      { date: '2024-11-04', calls: 298, delivered: 259 },
      { date: '2024-11-05', calls: 334, delivered: 292 },
      { date: '2024-11-06', calls: 301, delivered: 265 },
      { date: '2024-11-07', calls: 287, delivered: 248 }
    ],
    performanceMetrics: [
      { metric: 'Delivery Rate', value: 87.3, change: 2.1 },
      { metric: 'Success Rate', value: 78.5, change: -1.2 },
      { metric: 'Avg Duration', value: 28.5, change: 0.8 },
      { metric: 'Cost per Call', value: 0.30, change: -0.02 }
    ]
  },
  demographics: {
    timeSlots: [
      { time: '9:00 AM', success: 45, total: 67 },
      { time: '10:00 AM', success: 78, total: 95 },
      { time: '11:00 AM', success: 82, total: 102 },
      { time: '12:00 PM', success: 34, total: 58 },
      { time: '1:00 PM', success: 41, total: 69 },
      { time: '2:00 PM', success: 67, total: 84 },
      { time: '3:00 PM', success: 59, total: 78 },
      { time: '4:00 PM', success: 71, total: 91 },
      { time: '5:00 PM', success: 54, total: 73 }
    ],
    regions: [
      { region: 'California', calls: 1247, success: 982 },
      { region: 'Texas', calls: 1089, success: 834 },
      { region: 'Florida', calls: 934, success: 745 },
      { region: 'New York', calls: 867, success: 673 },
      { region: 'Illinois', calls: 756, success: 591 }
    ]
  },
  campaignPerformance: [
    { name: 'Holiday Sale Follow-up', sent: 150, delivered: 125, responded: 125 },
    { name: 'Service Reminder Campaign', sent: 89, delivered: 82, responded: 82 },
    { name: 'New Vehicle Promotion', sent: 0, delivered: 0, responded: 0 },
  ],
  monthlyStats: [
    { month: 'Nov 2024', voicemails: 892, success: 678, rate: 76.0 },
    { month: 'Oct 2024', voicemails: 1024, success: 789, rate: 77.1 },
    { month: 'Sep 2024', voicemails: 956, success: 734, rate: 76.8 },
    { month: 'Aug 2024', voicemails: 1143, success: 867, rate: 75.9 },
    { month: 'Jul 2024', voicemails: 1089, success: 856, rate: 78.6 },
    { month: 'Jun 2024', voicemails: 967, success: 742, rate: 76.7 },
  ],
  bestPerformingTimes: [
    { time: '10:00 AM', successRate: 82.4, calls: 1250 },
    { time: '11:00 AM', successRate: 81.7, calls: 1189 },
    { time: '2:00 PM', successRate: 79.3, calls: 1067 },
    { time: '4:00 PM', successRate: 78.1, calls: 945 },
    { time: '5:00 PM', successRate: 76.8, calls: 823 },
  ],
  deliveryByTimeOfDay: [
    { hour: '9:00', deliveries: 45 },
    { hour: '10:00', deliveries: 78 },
    { hour: '11:00', deliveries: 82 },
    { hour: '12:00', deliveries: 34 },
    { hour: '13:00', deliveries: 41 },
    { hour: '14:00', deliveries: 67 },
    { hour: '15:00', deliveries: 59 },
    { hour: '16:00', deliveries: 71 },
    { hour: '17:00', deliveries: 54 }
  ],
  monthlyTrends: [
    { month: 'Nov 2024', campaigns: 8, delivered: 892, responseRate: 76.0 },
    { month: 'Oct 2024', campaigns: 7, delivered: 1024, responseRate: 77.1 },
    { month: 'Sep 2024', campaigns: 6, delivered: 956, responseRate: 76.8 },
    { month: 'Aug 2024', campaigns: 9, delivered: 1143, responseRate: 75.9 },
    { month: 'Jul 2024', campaigns: 8, delivered: 1089, responseRate: 78.6 },
    { month: 'Jun 2024', campaigns: 5, delivered: 967, responseRate: 76.7 }
  ],
}

// Demo mode flag
export const isDemoMode = true

// Validation function for phone numbers (basic US format)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

// Helper function to format phone numbers
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+1-${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1-${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

// Helper function to generate customer stats
export function getCustomerStats(customers: typeof demoCustomers) {
  return {
    total: customers.length,
    leads: customers.filter(c => c.status === 'lead').length,
    prospects: customers.filter(c => c.status === 'prospect').length,
    customers: customers.filter(c => c.status === 'customer').length,
    highPriority: customers.filter(c => c.priority === 'high').length,
    mediumPriority: customers.filter(c => c.priority === 'medium').length,
    lowPriority: customers.filter(c => c.priority === 'low').length,
  }
}
