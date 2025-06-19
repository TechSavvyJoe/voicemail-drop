import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  
  const decoded = verifyToken(token) as { userId: string };
  return decoded.userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const supabase = await createClient();

    // In demo mode, return mock campaigns
    if (!supabase) {
      const mockCampaigns = [
        {
          id: 'demo-campaign-1',
          name: 'Summer Sales Push',
          voicemail_script: 'Hi, this is John from ABC Motors. We have amazing summer deals...',
          status: 'completed',
          created_at: '2024-06-15T10:00:00Z',
          successful_drops: 45,
          failed_drops: 5,
          total_customers: 50,
          campaign_customers: [{ count: 50 }]
        },
        {
          id: 'demo-campaign-2',
          name: 'New Inventory Alert',
          voicemail_script: 'Hello! We just received new inventory that matches your interests...',
          status: 'scheduled',
          created_at: '2024-06-18T14:30:00Z',
          successful_drops: 0,
          failed_drops: 0,
          total_customers: 25,
          campaign_customers: [{ count: 25 }]
        }
      ];
      return NextResponse.json({ campaigns: mockCampaigns });
    }

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_customers (
          count
        )
      `)
      .eq('user_id', userId)
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
    const userId = await getUserFromToken(request);
    const body = await request.json();
    
    const supabase = await createClient();

    // In demo mode, return mock campaign creation
    if (!supabase) {
      const mockCampaign = {
        id: `demo-campaign-${Date.now()}`,
        user_id: userId,
        name: body.name,
        voicemail_script: body.voicemailScript,
        status: body.scheduledDate ? 'scheduled' : 'draft',
        scheduled_at: body.scheduledDate ? 
          new Date(`${body.scheduledDate}T${body.scheduledTime || '09:00'}`).toISOString() : 
          null,
        voice_id: body.voiceId,
        caller_id: body.callerId,
        created_at: new Date().toISOString(),
        successful_drops: 0,
        failed_drops: 0,
        total_customers: 0
      };
      
      return NextResponse.json({
        campaign: mockCampaign,
        message: 'Campaign created successfully',
      });
    }

    // Create campaign
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert([
        {
          user_id: userId,
          name: body.name,
          voicemail_script: body.voicemailScript,
          status: body.scheduledDate ? 'scheduled' : 'draft',
          scheduled_at: body.scheduledDate ? 
            new Date(`${body.scheduledDate}T${body.scheduledTime || '09:00'}`).toISOString() : 
            null,
          voice_id: body.voiceId,
          caller_id: body.callerId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Campaign creation error:', error);
      const errorMessage = error.message || 'Unknown database error'
      return NextResponse.json(
        { 
          error: 'Failed to create campaign',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      campaign,
      message: 'Campaign created successfully',
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
