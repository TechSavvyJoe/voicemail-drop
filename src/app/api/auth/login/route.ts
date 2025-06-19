import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo-data'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // In demo mode, simulate login
    if (isDemoMode) {
      if (email === 'demo@cardealership.com' && password === 'demo123') {
        const token = generateToken({ 
          userId: 'demo-user',
          email,
          organizationId: 'demo-org'
        })

        const response = NextResponse.json({ 
          user: { 
            id: 'demo-user', 
            email,
            firstName: 'Demo',
            lastName: 'User',
            organizationId: 'demo-org',
            organizationName: 'Demo Car Dealership'
          },
          message: 'Login successful (Demo Mode)' 
        })

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 // 30 days
        })

        return response
      } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      console.error('Authentication error:', authError)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Get user profile
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
      .eq('id', authData.user.id)
      .single()

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check if user is active
    if (!userProfile.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id)

    // Generate JWT token for session
    const token = generateToken({ 
      userId: authData.user.id,
      email: authData.user.email,
      organizationId: userProfile.organization_id
    })

    const response = NextResponse.json({ 
      user: { 
        id: authData.user.id,
        email: authData.user.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        organizationId: userProfile.organization_id,
        organizationName: userProfile.organizations?.name,
        role: userProfile.role,
        subscription: userProfile.organizations
      },
      message: 'Login successful' 
    })

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
