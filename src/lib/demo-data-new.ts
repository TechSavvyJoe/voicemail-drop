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

export const demoAnalytics = {
  campaignPerformance: [
    { name: 'Holiday Sale Follow-up', sent: 150, delivered: 125, success: 125, rate: 83.3 },
    { name: 'Service Reminder Campaign', sent: 89, delivered: 82, success: 82, rate: 92.1 },
    { name: 'New Vehicle Promotion', sent: 0, delivered: 0, success: 0, rate: 0 },
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
