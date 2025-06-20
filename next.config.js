/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for GitHub Pages only when building for production
  ...(process.env.EXPORT_MODE === 'true' && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  
  // Configure for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' && process.env.EXPORT_MODE === 'true' ? '/voicemail-drop' : '',
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.EXPORT_MODE === 'true' ? '/voicemail-drop/' : '',
  
  // Optimize images for static export
  images: {
    unoptimized: true,
    domains: ['localhost', 'your-domain.com'],
  },
  
  // Environment variables
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  },
}

module.exports = nextConfig
