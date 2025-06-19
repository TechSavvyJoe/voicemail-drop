import { NextRequest, NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // In demo mode, return mock successful response
    if (isDemoMode || !supabase) {
      return NextResponse.json({ 
        user: { 
          id: 'demo-user-id',
          email: email,
          user_metadata: { first_name: 'Demo', last_name: 'User' }
        }, 
        session: { 
          access_token: 'demo-token',
          user: { 
            id: 'demo-user-id',
            email: email,
            user_metadata: { first_name: 'Demo', last_name: 'User' }
          }
        }
      })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user, session: data.session })
  } catch (err) {
    console.error('Sign in error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
