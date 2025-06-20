-- Enhanced Database Schema for Advanced Features
-- This migration adds tables for lead scoring, analytics, campaign management, and contact enrichment

-- Lead Scoring Tables
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL DEFAULT 0,
    demographics_score INTEGER NOT NULL DEFAULT 0,
    behavioral_score INTEGER NOT NULL DEFAULT 0,
    engagement_score INTEGER NOT NULL DEFAULT 0,
    intent_score INTEGER NOT NULL DEFAULT 0,
    score_factors JSONB DEFAULT '[]'::jsonb,
    last_calculated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Enrichment Tables
CREATE TABLE IF NOT EXISTS contact_enrichment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL UNIQUE,
    carrier_info JSONB,
    demographic_data JSONB,
    vehicle_data JSONB,
    social_data JSONB,
    confidence INTEGER DEFAULT 0,
    enrichment_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Templates
CREATE TABLE IF NOT EXISTS campaign_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    industry TEXT DEFAULT 'Automotive',
    target_audience TEXT,
    estimated_duration INTEGER DEFAULT 30,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    tags TEXT[] DEFAULT '{}',
    variables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Test Campaigns
CREATE TABLE IF NOT EXISTS ab_test_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variant_a JSONB NOT NULL,
    variant_b JSONB NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed')),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    winning_variant TEXT CHECK (winning_variant IN ('A', 'B')),
    confidence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Campaigns
CREATE TABLE IF NOT EXISTS scheduled_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    target_list TEXT[] DEFAULT '{}',
    scheduled_for TIMESTAMPTZ NOT NULL,
    timezone TEXT DEFAULT 'America/New_York',
    recurring_pattern JSONB,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'running', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Segments
CREATE TABLE IF NOT EXISTS contact_segments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Merge Log
CREATE TABLE IF NOT EXISTS contact_merge_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    original_id UUID NOT NULL,
    duplicate_id UUID NOT NULL,
    merged_data JSONB,
    merged_at TIMESTAMPTZ DEFAULT NOW(),
    merged_by UUID REFERENCES users(id)
);

-- Conversions Table (for ROI tracking)
CREATE TABLE IF NOT EXISTS conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    voicemail_id UUID REFERENCES voicemails(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('response', 'appointment', 'sale', 'callback')),
    revenue DECIMAL(10,2) DEFAULT 0.00,
    conversion_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Failed Voicemails Log
CREATE TABLE IF NOT EXISTS failed_voicemails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Voicemails table (add new columns)
ALTER TABLE voicemails 
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS compliance_checked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;

-- Enhanced Customers table (add new columns for lead scoring)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS credit_score INTEGER,
ADD COLUMN IF NOT EXISTS annual_income INTEGER,
ADD COLUMN IF NOT EXISTS previous_customer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS website_activity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_engagement DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS call_response DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS appointment_history INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_category TEXT,
ADD COLUMN IF NOT EXISTS last_scored TIMESTAMPTZ;

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_lead_scores_customer_id ON lead_scores(customer_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_total_score ON lead_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_contact_enrichment_phone ON contact_enrichment(phone_number);
CREATE INDEX IF NOT EXISTS idx_ab_test_campaigns_org_status ON ab_test_campaigns(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_campaigns_org_status ON scheduled_campaigns(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_campaigns_scheduled_for ON scheduled_campaigns(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_contact_segments_org ON contact_segments(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversions_campaign_type ON conversions(campaign_id, type);
CREATE INDEX IF NOT EXISTS idx_conversions_customer ON conversions(customer_id);
CREATE INDEX IF NOT EXISTS idx_failed_voicemails_phone ON failed_voicemails(phone_number);
CREATE INDEX IF NOT EXISTS idx_voicemails_customer_id ON voicemails(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_lead_score ON customers(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_customers_org_score ON customers(organization_id, lead_score DESC);

-- Row Level Security Policies
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enrichment ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_merge_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_voicemails ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Lead Scores
CREATE POLICY lead_scores_organization_policy ON lead_scores
    USING (
        EXISTS (
            SELECT 1 FROM customers c 
            WHERE c.id = lead_scores.customer_id 
            AND c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
        )
    );

-- RLS Policies for Contact Enrichment
CREATE POLICY contact_enrichment_organization_policy ON contact_enrichment
    USING (
        EXISTS (
            SELECT 1 FROM customers c 
            WHERE c.phone_number = contact_enrichment.phone_number 
            AND c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
        )
    );

-- RLS Policies for Campaign Templates
CREATE POLICY campaign_templates_organization_policy ON campaign_templates
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

-- RLS Policies for A/B Test Campaigns
CREATE POLICY ab_test_campaigns_organization_policy ON ab_test_campaigns
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

-- RLS Policies for Scheduled Campaigns
CREATE POLICY scheduled_campaigns_organization_policy ON scheduled_campaigns
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

-- RLS Policies for Contact Segments
CREATE POLICY contact_segments_organization_policy ON contact_segments
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

-- RLS Policies for Contact Merge Log
CREATE POLICY contact_merge_log_organization_policy ON contact_merge_log
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

-- RLS Policies for Conversions
CREATE POLICY conversions_organization_policy ON conversions
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

-- Functions for Lead Scoring
CREATE OR REPLACE FUNCTION calculate_lead_score(customer_row customers)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Demographics scoring (0-25 points)
    IF customer_row.credit_score IS NOT NULL THEN
        IF customer_row.credit_score >= 750 THEN
            score := score + 10;
        ELSIF customer_row.credit_score >= 650 THEN
            score := score + 7;
        ELSIF customer_row.credit_score >= 600 THEN
            score := score + 4;
        END IF;
    END IF;
    
    IF customer_row.annual_income IS NOT NULL THEN
        IF customer_row.annual_income >= 80000 THEN
            score := score + 8;
        ELSIF customer_row.annual_income >= 50000 THEN
            score := score + 5;
        ELSIF customer_row.annual_income >= 30000 THEN
            score := score + 2;
        END IF;
    END IF;
    
    IF customer_row.previous_customer THEN
        score := score + 7;
    END IF;
    
    -- Behavioral scoring (0-25 points)
    IF customer_row.website_activity IS NOT NULL THEN
        IF customer_row.website_activity >= 10 THEN
            score := score + 8;
        ELSIF customer_row.website_activity >= 5 THEN
            score := score + 5;
        ELSIF customer_row.website_activity >= 2 THEN
            score := score + 2;
        END IF;
    END IF;
    
    IF customer_row.email_engagement IS NOT NULL THEN
        IF customer_row.email_engagement >= 0.8 THEN
            score := score + 6;
        ELSIF customer_row.email_engagement >= 0.5 THEN
            score := score + 4;
        ELSIF customer_row.email_engagement >= 0.2 THEN
            score := score + 2;
        END IF;
    END IF;
    
    -- Engagement scoring (0-25 points)
    IF customer_row.call_response IS NOT NULL THEN
        IF customer_row.call_response >= 0.7 THEN
            score := score + 10;
        ELSIF customer_row.call_response >= 0.4 THEN
            score := score + 6;
        ELSIF customer_row.call_response >= 0.2 THEN
            score := score + 3;
        END IF;
    END IF;
    
    IF customer_row.appointment_history IS NOT NULL THEN
        IF customer_row.appointment_history >= 3 THEN
            score := score + 8;
        ELSIF customer_row.appointment_history >= 1 THEN
            score := score + 5;
        END IF;
    END IF;
    
    -- Recent contact boost (0-25 points)
    IF customer_row.last_contact IS NOT NULL THEN
        IF customer_row.last_contact > NOW() - INTERVAL '7 days' THEN
            score := score + 7;
        ELSIF customer_row.last_contact > NOW() - INTERVAL '30 days' THEN
            score := score + 4;
        ELSIF customer_row.last_contact > NOW() - INTERVAL '90 days' THEN
            score := score + 2;
        END IF;
    END IF;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- Function to update lead scores
CREATE OR REPLACE FUNCTION update_customer_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    new_score INTEGER;
    score_category TEXT;
BEGIN
    -- Calculate new lead score
    new_score := calculate_lead_score(NEW);
    
    -- Determine category
    IF new_score >= 80 THEN
        score_category := 'Hot Lead';
    ELSIF new_score >= 60 THEN
        score_category := 'Warm Lead';
    ELSIF new_score >= 40 THEN
        score_category := 'Qualified Lead';
    ELSIF new_score >= 20 THEN
        score_category := 'Cold Lead';
    ELSE
        score_category := 'Unqualified';
    END IF;
    
    -- Update customer record
    NEW.lead_score := new_score;
    NEW.lead_category := score_category;
    NEW.last_scored := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update lead scores
DROP TRIGGER IF EXISTS update_lead_score_trigger ON customers;
CREATE TRIGGER update_lead_score_trigger
    BEFORE UPDATE OF credit_score, annual_income, previous_customer, website_activity, 
                     email_engagement, call_response, appointment_history, last_contact
    ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_lead_score();

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up old failed voicemails (older than 30 days)
    DELETE FROM failed_voicemails WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old enrichment data (older than 6 months)
    DELETE FROM contact_enrichment WHERE enrichment_date < NOW() - INTERVAL '6 months';
    
    -- Clean up old lead scores (keep only latest 10 per customer)
    DELETE FROM lead_scores 
    WHERE id NOT IN (
        SELECT id FROM (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY last_calculated DESC) as rn
            FROM lead_scores
        ) ranked 
        WHERE ranked.rn <= 10
    );
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job for cleanup (if pg_cron is available)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');

COMMENT ON TABLE lead_scores IS 'Stores calculated lead scores for customers';
COMMENT ON TABLE contact_enrichment IS 'Enriched contact data from external sources';
COMMENT ON TABLE campaign_templates IS 'Reusable campaign message templates';
COMMENT ON TABLE ab_test_campaigns IS 'A/B testing campaigns for message optimization';
COMMENT ON TABLE scheduled_campaigns IS 'Scheduled and recurring voicemail campaigns';
COMMENT ON TABLE contact_segments IS 'Dynamic customer segments based on criteria';
COMMENT ON TABLE conversions IS 'Tracks conversions and ROI from campaigns';
COMMENT ON TABLE failed_voicemails IS 'Log of failed voicemail attempts for debugging';
