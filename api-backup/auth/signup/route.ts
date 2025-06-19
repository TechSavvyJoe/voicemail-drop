import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo-data'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, company } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // In demo mode, simulate signup
    if (isDemoMode) {
      const token = generateToken({ 
        userId: 'demo-user-signup',
        email,
        organizationId: 'demo-org'
      })

      const response = NextResponse.json({ 
        user: { 
          id: 'demo-user-signup', 
          email, 
          firstName, 
          lastName, 
          company: company || 'Demo Company' 
        },
        message: 'Signup successful (Demo Mode)' 
      })

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })

      return response
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 })
    }

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json({ 
        error: authError.message || 'Failed to create account' 
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Create organization
    const orgSlug = (company || `${firstName}-${lastName}`)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: company || `${firstName} ${lastName}'s Organization`,
        slug: `${orgSlug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        subscription_status: 'trial',
        subscription_tier: 'basic',
        monthly_voicemail_limit: 1000,
        monthly_voicemails_used: 0
      })
      .select()
      .single()

    if (orgError) {
      console.error('Organization creation error:', orgError)
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        organization_id: orgData.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'admin', // First user in org is admin
        is_active: true
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    // Generate JWT token for session
    const token = generateToken({ 
      userId: authData.user.id,
      email,
      organizationId: orgData.id
    })

    const response = NextResponse.json({ 
      user: { 
        id: authData.user.id,
        email,
        firstName,
        lastName,
        organizationId: orgData.id,
        organizationName: orgData.name
      },
      message: 'Signup successful! Please check your email to verify your account.' 
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
    console.error('Signup error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
