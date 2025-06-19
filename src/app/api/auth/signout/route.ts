import { NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'

export async function POST() {
  try {
    // In demo mode, return mock success response
    if (isDemoMode || !supabase) {
      return NextResponse.json({ message: 'Signed out successfully' })
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Signed out successfully' })
  } catch (err) {
    console.error('Sign out error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
