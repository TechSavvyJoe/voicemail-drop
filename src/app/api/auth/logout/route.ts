import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo-data'

export async function POST() {
  try {
    // In demo mode, simulate logout
    if (isDemoMode) {
      const response = NextResponse.json({ message: 'Logout successful (Demo Mode)' })
      
      // Clear auth cookie
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0 // Expire immediately
      })
      
      return response
    }

    const supabase = await createClient()

    if (supabase) {
      // Sign out from Supabase
      await supabase.auth.signOut()
    }

    const response = NextResponse.json({ message: 'Logout successful' })
    
    // Clear auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (err) {
    console.error('Logout error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
