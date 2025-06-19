import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode, demoUser } from '@/lib/demo-data'

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return demo user
    if (isDemoMode) {
      return NextResponse.json({ user: demoUser })
    }

    // For production, would verify JWT token and get user from Supabase
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Would validate token and return user
    return NextResponse.json({ error: 'Authentication not configured' }, { status: 501 })
  } catch (err) {
    console.error('User info error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
