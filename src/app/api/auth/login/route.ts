import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // In demo mode, simulate login
    if (isDemoMode) {
      if (email === 'demo@cardealership.com' && password === 'demo123') {
        return NextResponse.json({ 
          user: { id: 'demo-user', email },
          session: { access_token: 'demo-token' },
          message: 'Login successful (Demo Mode)' 
        })
      } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
    }

    // For production, would use actual Supabase
    return NextResponse.json({ error: 'Authentication not configured' }, { status: 501 })
  } catch (err) {
    console.error('Login error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
