import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode, demoUser } from '@/lib/demo-data'
import { verifyToken } from '@/lib/auth'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  
  const decoded = verifyToken(token) as { userId: string };
  return decoded.userId;
}

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return demo user
    if (isDemoMode) {
      return NextResponse.json({ user: demoUser })
    }

    const userId = await getUserFromToken(request)
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Get user profile with organization data
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        organizations (
          id,
          name,
          subscription_status,
          subscription_tier,
          monthly_voicemail_limit,
          monthly_voicemails_used
        )
      `)
      .eq('id', userId)
      .single()

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is active
    if (!userProfile.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
    }

    return NextResponse.json({ 
      user: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        phone: userProfile.phone,
        role: userProfile.role,
        organizationId: userProfile.organization_id,
        organizationName: userProfile.organizations?.name,
        subscription: userProfile.organizations,
        lastLogin: userProfile.last_login,
        createdAt: userProfile.created_at
      }
    })
  } catch (err) {
    console.error('User info error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    
    // If token is invalid, return 401
    if (errorMessage.includes('token') || errorMessage.includes('jwt')) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
