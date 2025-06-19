import { NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/demo-data'

export async function POST() {
  try {
    // In demo mode, simulate logout
    if (isDemoMode) {
      return NextResponse.json({ message: 'Logout successful (Demo Mode)' })
    }

    // For production, would use actual Supabase
    return NextResponse.json({ message: 'Logout successful' })
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
