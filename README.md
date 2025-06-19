# VoiceMail Pro - Professional Voicemail Drop Platform

A high-quality, sellable SaaS application designed specifically for car dealership sales teams to manage automated voicemail drop campaigns. Built with Next.js 15, TypeScript, and modern development practices.

## 🚀 Key Features

### 💼 Business Features
- **Multi-tenant Architecture** - Supports multiple dealership organizations
- **Subscription Management** - Integrated Stripe billing with multiple pricing tiers
- **User Authentication** - Secure authentication with role-based access control
- **Customer Management** - Upload and manage customer lists (CSV/Excel support)
- **Campaign Management** - Create, schedule, and monitor voicemail campaigns
- **Advanced Analytics** - Real-time performance tracking and reporting
- **Compliance Tools** - TCPA-compliant voicemail delivery

### 🛠 Technical Features
- **Next.js 15** with App Router and Server Components
- **TypeScript** for type safety and better development experience
- **Supabase** for database, authentication, and real-time features
- **Stripe** for payment processing and subscription management
- **Twilio** for voicemail delivery infrastructure
- **Tailwind CSS** for modern, responsive UI design
- **Recharts** for advanced data visualization
- **Row Level Security** for data isolation between organizations

### 📊 Professional Dashboard
- Real-time campaign monitoring
- Usage tracking and billing
- Success rate analytics
- Weekly performance charts
- Campaign status management

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Auth Routes   │    │ • Supabase      │
│ • Auth Pages    │    │ • Campaign API  │    │ • Stripe        │
│ • Campaign Mgmt │    │ • Billing API   │    │ • Twilio        │
│ • Analytics     │    │ • Webhook API   │    │ • Email Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase account and project
- Stripe account (for payments)
- Twilio account (for voicemail delivery)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd voicemail-drop
npm install
```

### 2. Environment Setup

Copy the environment file and configure your services:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Application URLs
NEXTAUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the Supabase migration to create the database schema:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Run migrations
supabase db push
```

Or manually run the SQL migration file in your Supabase dashboard:
- Navigate to your Supabase project
- Go to SQL Editor
- Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
- Execute the migration

### 4. Stripe Setup

1. Create pricing plans in your Stripe dashboard
2. Update the price IDs in your environment variables:
   ```env
   STRIPE_PRICE_ID_BASIC=price_your_basic_plan_id
   STRIPE_PRICE_ID_PRO=price_your_pro_plan_id
   STRIPE_PRICE_ID_ENTERPRISE=price_your_enterprise_plan_id
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏢 Pricing Tiers

### Basic Plan - $49/month
- 1,000 voicemail drops per month
- Customer list upload (CSV/Excel)
- Basic analytics
- Pre-built script templates
- Email support

### Professional Plan - $99/month ⭐ Most Popular
- 3,000 voicemail drops per month
- Advanced campaign scheduling
- Custom script creation
- Advanced analytics & reporting
- Team collaboration
- Phone support

### Enterprise Plan - $199/month
- 10,000 voicemail drops per month
- Unlimited team members
- White-label options
- Custom integrations
- Dedicated account manager
- Priority support
- Custom reporting
- API access

## 📱 Key Pages & Features

### Authentication (`/auth`)
- Secure sign-up and sign-in
- Organization creation
- Email verification
- Password reset functionality

### Dashboard (`/dashboard`)
- Real-time campaign metrics
- Usage monitoring
- Quick action buttons
- Performance charts
- Recent campaign overview

### Customer Management (`/customers`)
- CSV/Excel file upload
- Customer list management
- Data validation and cleaning
- Phone number verification

### Campaign Management (`/campaigns`)
- Campaign creation wizard
- Script template library
- Scheduling options
- Real-time progress tracking
- Performance analytics

### Billing (`/billing`)
- Subscription management
- Usage tracking
- Payment history
- Plan upgrades/downgrades

### Analytics (`/analytics`)
- Advanced reporting
- Campaign performance metrics
- ROI tracking
- Export capabilities

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level data isolation
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, manager, and user roles
- **API Rate Limiting** - Prevents abuse and ensures stability
- **Input Validation** - Server-side validation for all inputs
- **CSRF Protection** - Built-in Next.js security features

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `PUT /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign

### Customers
- `POST /api/customers/upload` - Upload customer list
- `GET /api/customers` - List customers
- `PUT /api/customers/[id]` - Update customer

### Billing
- `POST /api/billing/checkout` - Create Stripe checkout session
- `POST /api/billing/portal` - Create customer portal session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Voicemails
- `POST /api/voicemails/send` - Send individual voicemail
- `POST /api/voicemails/bulk` - Send bulk voicemails
- `POST /api/webhooks/twilio` - Twilio webhook handler

## 🎨 Design System

The application uses a professional design system with:
- **Consistent spacing** - 4px grid system
- **Color palette** - Professional blue and gray tones
- **Typography** - Inter font for readability
- **Component library** - Reusable UI components
- **Responsive design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant

## 📊 Database Schema

### Core Tables
- `organizations` - Multi-tenant organization data
- `user_profiles` - Extended user information
- `customer_lists` - Customer list metadata
- `customers` - Individual customer records
- `voicemail_scripts` - Reusable message templates
- `campaigns` - Campaign configurations
- `voicemails` - Individual voicemail records
- `billing_records` - Payment and usage tracking

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set up environment variables in Vercel dashboard
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Optimizations

- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic route-based code splitting
- **Static Generation** - ISG for improved performance
- **Database Indexing** - Optimized database queries
- **CDN Integration** - Static asset delivery
- **Caching Strategy** - Redis for session and data caching

## 🔧 Development

### Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates

## 📞 Support & Maintenance

### Monitoring
- **Error Tracking** - Sentry integration
- **Performance Monitoring** - Core Web Vitals tracking
- **Uptime Monitoring** - Service availability tracking
- **Usage Analytics** - User behavior insights

### Maintenance
- **Automated Backups** - Daily database backups
- **Security Updates** - Regular dependency updates
- **Performance Monitoring** - Continuous optimization
- **Customer Support** - Help desk integration

## 💰 Revenue Model

This is a B2B SaaS application with:
- **Monthly Recurring Revenue (MRR)** - Subscription-based pricing
- **Tiered Pricing** - Multiple plans for different business sizes
- **Usage-Based Billing** - Pay-per-voicemail options available
- **Annual Discounts** - Incentives for longer commitments
- **Enterprise Contracts** - Custom pricing for large dealerships

## 🎯 Target Market

- **Car Dealerships** - Primary target market
- **Auto Sales Teams** - Individual salespeople
- **Dealership Groups** - Multi-location organizations
- **Automotive Service Centers** - Service appointment reminders
- **Vehicle Financing Companies** - Payment reminders and offers

## 📋 Compliance & Legal

- **TCPA Compliance** - Telephone Consumer Protection Act adherence
- **Data Privacy** - GDPR and CCPA compliant data handling
- **Terms of Service** - Clear usage terms and limitations
- **Privacy Policy** - Transparent data usage policies
- **Security Standards** - Industry-standard security practices

## 🤝 Contributing

This is a proprietary commercial application. For development team contributions:

1. Follow the established code style
2. Write comprehensive tests
3. Update documentation
4. Submit pull requests for review

## 📄 License

This is proprietary software. All rights reserved.

---

**VoiceMail Pro** - Transforming automotive sales through intelligent voicemail automation.

For support: support@voicemailpro.com
For sales: sales@voicemailpro.com
