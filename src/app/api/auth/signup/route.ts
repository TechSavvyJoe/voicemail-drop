import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, company } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // In demo mode, simulate signup
    if (isDemoMode) {
      return NextResponse.json({ 
        user: { 
          id: 'demo-user-signup', 
          email, 
          firstName, 
          lastName, 
          company: company || 'Demo Company' 
        },
        message: 'Signup successful (Demo Mode)' 
      })
    }

    // For production, would use actual Supabase
    return NextResponse.json({ error: 'Signup not configured' }, { status: 501 })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
