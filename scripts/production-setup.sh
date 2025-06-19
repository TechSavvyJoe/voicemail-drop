#!/bin/bash
# Production Setup Script for Voicemail Drop App

echo "🚀 Starting Production Setup..."

# 1. Environment Variables Check
echo "Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not set"
    exit 1
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY not set"
    exit 1
fi

if [ -z "$TWILIO_ACCOUNT_SID" ]; then
    echo "❌ TWILIO_ACCOUNT_SID not set"
    exit 1
fi

echo "✅ Environment variables configured"

# 2. Build the application
echo "Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# 3. Test critical paths
echo "Testing application..."
npm run start &
APP_PID=$!
sleep 5

# Test health endpoint
curl -f http://localhost:3000/api/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Application health check passed"
else
    echo "❌ Application health check failed"
fi

kill $APP_PID

echo "🎉 Production setup complete!"
echo "Next steps:"
echo "1. Set up monitoring"
echo "2. Configure email service"
echo "3. Implement TCPA compliance"
echo "4. Set up backups"
