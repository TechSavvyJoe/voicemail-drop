/**
 * Environment Configuration Validation
 * Ensures all required environment variables are present and valid
 */

interface EnvironmentConfig {
  // Core Application
  NEXT_PUBLIC_APP_URL: string
  NEXTAUTH_SECRET: string
  NODE_ENV: string

  // Database & Auth
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
  SUPABASE_SERVICE_ROLE_KEY?: string

  // Payments
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string

  // Voicemail Delivery
  TWILIO_ACCOUNT_SID?: string
  TWILIO_AUTH_TOKEN?: string
  TWILIO_PHONE_NUMBER?: string

  // Email
  SMTP_HOST?: string
  SMTP_PORT?: string
  SMTP_USER?: string
  SMTP_PASSWORD?: string
  FROM_EMAIL?: string

  // Security
  JWT_SECRET?: string
  ENCRYPTION_KEY?: string

  // Monitoring
  SENTRY_DSN?: string

  // Feature Flags
  DEMO_MODE?: string
  TCPA_COMPLIANCE_ENABLED?: string
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private config: EnvironmentConfig
  private validationErrors: string[] = []

  private constructor() {
    this.config = this.loadEnvironmentVariables()
    this.validate()
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  private loadEnvironmentVariables(): EnvironmentConfig {
    return {
      // Core (Required)
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
      NODE_ENV: process.env.NODE_ENV || 'development',

      // Database (Optional in demo mode)
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

      // Payments (Optional in demo mode)
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

      // Voicemail (Optional in demo mode)
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

      // Email (Optional)
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD,
      FROM_EMAIL: process.env.FROM_EMAIL,

      // Security
      JWT_SECRET: process.env.JWT_SECRET,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

      // Monitoring
      SENTRY_DSN: process.env.SENTRY_DSN,

      // Feature Flags
      DEMO_MODE: process.env.DEMO_MODE || 'true',
      TCPA_COMPLIANCE_ENABLED: process.env.TCPA_COMPLIANCE_ENABLED || 'true',
    }
  }

  private validate(): void {
    this.validationErrors = []
    const isProduction = this.config.NODE_ENV === 'production'
    const isDemoMode = this.config.DEMO_MODE === 'true'

    // Always required
    this.validateRequired('NEXTAUTH_SECRET', this.config.NEXTAUTH_SECRET, 32)

    // Production-only requirements
    if (isProduction && !isDemoMode) {
      this.validateProductionRequirements()
    }

    // Security validations
    this.validateSecurity()

    if (this.validationErrors.length > 0) {
      console.error('❌ Environment Configuration Errors:')
      this.validationErrors.forEach(error => console.error(`  - ${error}`))
      
      if (isProduction) {
        throw new Error('Invalid environment configuration for production')
      } else {
        console.warn('⚠️  Running with missing configuration (demo mode enabled)')
      }
    }
  }

  private validateRequired(name: string, value: string | undefined, minLength?: number): void {
    if (!value || value.trim() === '') {
      this.validationErrors.push(`${name} is required`)
      return
    }

    if (minLength && value.length < minLength) {
      this.validationErrors.push(`${name} must be at least ${minLength} characters`)
    }
  }

  private validateProductionRequirements(): void {
    // Database
    this.validateRequired('NEXT_PUBLIC_SUPABASE_URL', this.config.NEXT_PUBLIC_SUPABASE_URL)
    this.validateRequired('NEXT_PUBLIC_SUPABASE_ANON_KEY', this.config.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    this.validateRequired('SUPABASE_SERVICE_ROLE_KEY', this.config.SUPABASE_SERVICE_ROLE_KEY)

    // Payments
    this.validateRequired('STRIPE_SECRET_KEY', this.config.STRIPE_SECRET_KEY)
    this.validateRequired('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    // Voicemail
    this.validateRequired('TWILIO_ACCOUNT_SID', this.config.TWILIO_ACCOUNT_SID)
    this.validateRequired('TWILIO_AUTH_TOKEN', this.config.TWILIO_AUTH_TOKEN)
    this.validateRequired('TWILIO_PHONE_NUMBER', this.config.TWILIO_PHONE_NUMBER)

    // Security
    this.validateRequired('JWT_SECRET', this.config.JWT_SECRET, 32)
    this.validateRequired('ENCRYPTION_KEY', this.config.ENCRYPTION_KEY, 32)
  }

  private validateSecurity(): void {
    // URL validation
    if (this.config.NEXT_PUBLIC_APP_URL) {
      try {
        new URL(this.config.NEXT_PUBLIC_APP_URL)
      } catch {
        this.validationErrors.push('NEXT_PUBLIC_APP_URL must be a valid URL')
      }
    }

    // Email validation
    if (this.config.FROM_EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.config.FROM_EMAIL)) {
      this.validationErrors.push('FROM_EMAIL must be a valid email address')
    }

    // Phone number validation
    if (this.config.TWILIO_PHONE_NUMBER && !/^\+\d{10,15}$/.test(this.config.TWILIO_PHONE_NUMBER)) {
      this.validationErrors.push('TWILIO_PHONE_NUMBER must be in format +1234567890')
    }
  }

  public getConfig(): EnvironmentConfig {
    return { ...this.config }
  }

  public isDemoMode(): boolean {
    return this.config.DEMO_MODE === 'true'
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production'
  }

  public isTcpaEnabled(): boolean {
    return this.config.TCPA_COMPLIANCE_ENABLED === 'true'
  }

  public getValidationErrors(): string[] {
    return [...this.validationErrors]
  }

  public isValid(): boolean {
    return this.validationErrors.length === 0
  }

  public logConfiguration(): void {
    const isDemo = this.isDemoMode()
    const isProd = this.isProduction()

    console.log('🔧 Environment Configuration:')
    console.log(`  Mode: ${isProd ? '🚀 Production' : '🛠️  Development'}`)
    console.log(`  Demo: ${isDemo ? '✅ Enabled' : '❌ Disabled'}`)
    console.log(`  TCPA: ${this.isTcpaEnabled() ? '✅ Enabled' : '❌ Disabled'}`)
    console.log(`  App URL: ${this.config.NEXT_PUBLIC_APP_URL}`)
    
    if (!isDemo) {
      console.log(`  Database: ${this.config.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}`)
      console.log(`  Payments: ${this.config.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`)
      console.log(`  Voicemail: ${this.config.TWILIO_ACCOUNT_SID ? '✅ Configured' : '❌ Missing'}`)
      console.log(`  Email: ${this.config.SMTP_HOST ? '✅ Configured' : '❌ Missing'}`)
      console.log(`  Monitoring: ${this.config.SENTRY_DSN ? '✅ Configured' : '❌ Missing'}`)
    }
  }
}

// Export singleton instance
export const envConfig = EnvironmentValidator.getInstance()

// Export individual getters for convenience
export const getConfig = () => envConfig.getConfig()
export const isDemoMode = () => envConfig.isDemoMode()
export const isProduction = () => envConfig.isProduction()
export const isTcpaEnabled = () => envConfig.isTcpaEnabled()

// Initialize on import
if (typeof window === 'undefined') {
  // Server-side only
  envConfig.logConfiguration()
}
