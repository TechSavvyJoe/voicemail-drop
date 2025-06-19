import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  
  const decoded = verifyToken(token) as { userId: string, organizationId: string };
  return { userId: decoded.userId, organizationId: decoded.organizationId };
}

export async function GET(request: NextRequest) {
  try {
    const { organizationId } = await getUserFromToken(request);
    const supabase = await createClient();

    // In demo mode, return mock campaigns
    if (!supabase) {
      const mockCampaigns = [
        {
          id: 'camp-1',
          organization_id: organizationId,
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
          organization_id: organizationId,
          name: 'Service Reminder Campaign',
          status: 'completed',
          total_recipients: 89,
          sent_count: 89,
          delivered_count: 82,
          success_count: 82,
          script: "Hello [Customer Name], this is a friendly reminder from [Dealership] that your [Vehicle] is due for its scheduled maintenance. Our certified technicians are ready to keep your vehicle running smoothly. Please call us to schedule your appointment. Thank you for choosing [Dealership]!",
          estimated_completion: 'Completed',
          created_at: '2024-11-20T14:30:00Z',
          updated_at: '2024-11-25T16:45:00Z',
          is_active: false,
          voice_id: 'professional_female',
          delivery_time_start: '09:00',
          delivery_time_end: '17:00',
          time_zone: 'America/New_York'
        },
        {
          id: 'camp-3',
          organization_id: organizationId,
          name: 'New Vehicle Promotion',
          status: 'draft',
          total_recipients: 95,
          sent_count: 0,
          delivered_count: 0,
          success_count: 0,
          script: "Hi [Customer Name], this is [Sales Rep] from [Dealership]. We have some exciting new vehicle promotions that I think you'll love. Our latest models are arriving and I'd like to discuss how we can get you behind the wheel of your dream car. Please give me a call back at your convenience. Thanks!",
          estimated_completion: 'Not started',
          created_at: '2024-12-12T09:15:00Z',
          updated_at: '2024-12-12T09:15:00Z',
          is_active: false,
          voice_id: 'professional_male',
          delivery_time_start: '10:00',
          delivery_time_end: '16:00',
          time_zone: 'America/New_York'
        }
      ];
      return NextResponse.json({ campaigns: mockCampaigns });
    }

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Campaigns fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Campaigns GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, organizationId } = await getUserFromToken(request);
    const body = await request.json();
    
    const supabase = await createClient();
    
    // In demo mode, return mock response
    if (!supabase) {
      const mockCampaign = {
        id: `demo-campaign-${Date.now()}`,
        organization_id: organizationId,
        user_id: userId,
        name: body.name,
        status: 'draft',
        total_recipients: body.total_recipients || 0,
        sent_count: 0,
        delivered_count: 0,
        success_count: 0,
        script: body.script,
        estimated_completion: 'Not started',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: false,
        voice_id: body.voice_id || 'professional_male',
        delivery_time_start: body.delivery_time_start || '10:00',
        delivery_time_end: body.delivery_time_end || '18:00',
        time_zone: body.time_zone || 'America/New_York'
      };
      
      return NextResponse.json({ 
        success: true, 
        campaign: mockCampaign,
        message: 'Campaign created successfully (demo mode)'
      });
    }

    // Validate required fields
    if (!body.name || !body.script) {
      return NextResponse.json(
        { error: 'Campaign name and script are required' },
        { status: 400 }
      );
    }

    const campaignData = {
      organization_id: organizationId,
      user_id: userId,
      name: body.name,
      script: body.script,
      status: 'draft',
      total_recipients: body.total_recipients || 0,
      sent_count: 0,
      delivered_count: 0,
      success_count: 0,
      is_active: false,
      voice_id: body.voice_id || 'professional_male',
      delivery_time_start: body.delivery_time_start || '10:00',
      delivery_time_end: body.delivery_time_end || '18:00',
      time_zone: body.time_zone || 'America/New_York'
    };

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single();

    if (error) {
      console.error('Campaign creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      campaign,
      message: 'Campaign created successfully'
    });
  } catch (error) {
    console.error('Campaigns POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { organizationId } = await getUserFromToken(request);
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // In demo mode, return mock response
    if (!supabase) {
      return NextResponse.json({ 
        success: true, 
        message: 'Campaign updated successfully (demo mode)',
        campaign: { id, ...updateData, updated_at: new Date().toISOString() }
      });
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) {
      console.error('Campaign update error:', error);
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      campaign,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    console.error('Campaigns PUT error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { organizationId } = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // In demo mode, return mock response
    if (!supabase) {
      return NextResponse.json({ 
        success: true, 
        message: 'Campaign deleted successfully (demo mode)'
      });
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Campaign deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Campaigns DELETE error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}
