import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Skip middleware if in static export mode to avoid conflicts
const isExportMode = process.env.EXPORT_MODE === 'true'

// Security headers for production
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.twilio.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
]

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map()

function rateLimit(identifier: string, limit = 60, window = 60000) {
  const now = Date.now()
  const windowStart = now - window
  
  const requests = rateLimitMap.get(identifier) || []
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  
  return true
}

export function middleware(request: NextRequest) {
  // Skip middleware processing if in export mode
  if (isExportMode) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // Add security headers
  securityHeaders.forEach((header) => {
    response.headers.set(header.key, header.value)
  })

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const identifier = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    // Different limits for different endpoints
    let limit = 60 // Default: 60 requests per minute
    let window = 60000 // 1 minute
    
    if (request.nextUrl.pathname.includes('/api/voicemails/')) {
      limit = 10 // Voicemail endpoints: 10 per minute
      window = 60000
    } else if (request.nextUrl.pathname.includes('/api/auth/')) {
      limit = 5 // Auth endpoints: 5 per minute
      window = 60000
    } else if (request.nextUrl.pathname.includes('/api/webhooks/')) {
      limit = 100 // Webhook endpoints: 100 per minute (for Twilio)
      window = 60000
    }
    
    if (!rateLimit(identifier, limit, window)) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      )
    }
  }

  // TCPA compliance: Block requests outside allowed hours for voicemail sending
  if (request.nextUrl.pathname.includes('/api/voicemails/send')) {
    const now = new Date()
    const hour = now.getHours()
    
    // Block voicemail sending outside 8 AM - 9 PM (adjust for timezone in production)
    if (hour < 8 || hour >= 21) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Voicemail sending is not allowed outside 8 AM - 9 PM local time (TCPA compliance)' 
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: isExportMode ? [] : [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
