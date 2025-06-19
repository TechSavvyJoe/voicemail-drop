import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, company } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // In demo mode, simulate registration
    if (isDemoMode) {
      return NextResponse.json({ 
        user: { 
          id: 'demo-user-new', 
          email, 
          firstName, 
          lastName, 
          company: company || 'Demo Company' 
        },
        message: 'Registration successful (Demo Mode)' 
      })
    }

    // For production, would use actual Supabase
    return NextResponse.json({ error: 'Registration not configured' }, { status: 501 })
  } catch (err) {
    console.error('Registration error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
