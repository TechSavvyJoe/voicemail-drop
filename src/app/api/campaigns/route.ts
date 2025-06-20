import { NextRequest, NextResponse } from 'next/server';

// Mock campaigns data for testing
const mockCampaigns = [
  {
    id: 'camp-1',
    organization_id: 'org-1',
    name: 'Holiday Sale Follow-up',
    status: 'running',
    total_recipients: 150,
    sent_count: 140,
    delivered_count: 125,
    success_count: 125,
    script: "Hi [Customer Name], this is [Sales Rep] from [Dealership]. I wanted to personally reach out about our amazing holiday sale on [Vehicle Type]. We have some incredible deals that I think you'll love. Please give me a call back at your convenience so we can discuss how we can get you behind the wheel of your dream car today. Thanks and have a great day!",
    estimated_completion: '2 hours',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    is_active: true,
    voice_id: 'professional_male',
    delivery_time_start: '10:00',
    delivery_time_end: '18:00',
    time_zone: 'America/New_York'
  },
  {
    id: 'camp-2',
    organization_id: 'org-1',
    name: 'Service Reminder Campaign',
    status: 'completed',
    total_recipients: 89,
    sent_count: 89,
    delivered_count: 82,
    success_count: 82,
    script: "Hello [Customer Name], this is a friendly reminder from [Dealership] that your [Vehicle] is due for its scheduled maintenance. Our certified technicians are ready to keep your vehicle running smoothly. Please call us to schedule your appointment. Thank you for choosing [Dealership]!",
    estimated_completion: 'Completed',
    created_at: '2024-11-15T09:00:00Z',
    updated_at: '2024-11-15T15:30:00Z',
    is_active: false,
    voice_id: 'friendly_female',
    delivery_time_start: '09:00',
    delivery_time_end: '17:00',
    time_zone: 'America/New_York'
  },
  {
    id: 'camp-3',
    organization_id: 'org-1',
    name: 'New Arrival Notifications',
    status: 'paused',
    total_recipients: 200,
    sent_count: 75,
    delivered_count: 68,
    success_count: 68,
    script: "Hi [Customer Name], I'm calling from [Dealership] to let you know that we just received some exciting new [Vehicle Type] models that match what you were looking for. I'd love to show you these vehicles before they're gone. Please give me a call when you have a moment. Thanks!",
    estimated_completion: '6 hours',
    created_at: '2024-12-10T14:00:00Z',
    updated_at: '2024-12-10T16:30:00Z',
    is_active: false,
    voice_id: 'enthusiastic_male',
    delivery_time_start: '11:00',
    delivery_time_end: '19:00',
    time_zone: 'America/New_York'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Add small delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filteredCampaigns = mockCampaigns;
    
    if (status) {
      filteredCampaigns = mockCampaigns.filter(campaign => campaign.status === status);
    }
    
    return NextResponse.json({ 
      campaigns: filteredCampaigns,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch campaigns',
      success: false 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'script'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}`,
          success: false 
        }, { status: 400 });
      }
    }
    
    const newCampaign = {
      id: `camp-${Date.now()}`,
      organization_id: 'org-1',
      ...body,
      status: body.status || 'pending',
      total_recipients: 0,
      sent_count: 0,
      delivered_count: 0,
      success_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: body.status === 'running'
    };
    
    // Add delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({ 
      campaign: newCampaign,
      success: true 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ 
      error: 'Failed to create campaign',
      success: false 
    }, { status: 500 });
  }
}
