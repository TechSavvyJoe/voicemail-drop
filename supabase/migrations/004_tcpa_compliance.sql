-- TCPA Compliance Tables for Voicemail Drop SaaS

-- Do Not Call (DNC) list table
CREATE TABLE IF NOT EXISTS do_not_call_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT DEFAULT 'User requested opt-out',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast phone number lookups
CREATE INDEX IF NOT EXISTS idx_dnc_phone_number ON do_not_call_list(phone_number);

-- Customer consent tracking table
CREATE TABLE IF NOT EXISTS customer_consent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP WITH TIME ZONE,
  consent_method TEXT, -- 'website', 'phone', 'email', etc.
  ip_address INET,
  user_agent TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(phone_number, organization_id)
);

-- Index for consent lookups
CREATE INDEX IF NOT EXISTS idx_consent_phone_org ON customer_consent(phone_number, organization_id);
CREATE INDEX IF NOT EXISTS idx_consent_org ON customer_consent(organization_id);

-- Add timezone field to voicemails table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'voicemails' AND column_name = 'timezone') 
  THEN
    ALTER TABLE voicemails ADD COLUMN timezone TEXT DEFAULT 'America/New_York';
  END IF;
END $$;

-- Add TCPA compliance fields to voicemails table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'voicemails' AND column_name = 'tcpa_compliant') 
  THEN
    ALTER TABLE voicemails ADD COLUMN tcpa_compliant BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'voicemails' AND column_name = 'compliance_notes') 
  THEN
    ALTER TABLE voicemails ADD COLUMN compliance_notes TEXT;
  END IF;
END $$;

-- TCPA compliance audit log
CREATE TABLE IF NOT EXISTS tcpa_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  action TEXT NOT NULL, -- 'opt_out', 'consent_given', 'compliance_check', etc.
  result BOOLEAN,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_phone ON tcpa_audit_log(phone_number);
CREATE INDEX IF NOT EXISTS idx_audit_org_date ON tcpa_audit_log(organization_id, created_at);

-- RLS Policies for TCPA tables
ALTER TABLE do_not_call_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcpa_audit_log ENABLE ROW LEVEL SECURITY;

-- DNC list is global - only service role can access
CREATE POLICY "Service role can manage DNC list" ON do_not_call_list
  USING (auth.role() = 'service_role');

-- Customer consent is organization-specific
CREATE POLICY "Users can view their org consent records" ON customer_consent
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert consent for their org" ON customer_consent
  FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update consent for their org" ON customer_consent
  FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

-- Audit log is organization-specific
CREATE POLICY "Users can view their org audit log" ON tcpa_audit_log
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can insert audit records" ON tcpa_audit_log
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Function to automatically add opt-out requests to DNC list
CREATE OR REPLACE FUNCTION handle_opt_out_request(phone_number_param TEXT, reason_param TEXT DEFAULT 'User requested opt-out')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add to DNC list
  INSERT INTO do_not_call_list (phone_number, reason)
  VALUES (phone_number_param, reason_param)
  ON CONFLICT (phone_number) DO NOTHING;
  
  -- Log the opt-out
  INSERT INTO tcpa_audit_log (phone_number, action, result, reason)
  VALUES (phone_number_param, 'opt_out', TRUE, reason_param);
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Function to check if phone number is on DNC list
CREATE OR REPLACE FUNCTION is_on_dnc_list(phone_number_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  found_record BOOLEAN DEFAULT FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM do_not_call_list 
    WHERE phone_number = phone_number_param
  ) INTO found_record;
  
  RETURN found_record;
END;
$$;

-- Function to log TCPA compliance checks
CREATE OR REPLACE FUNCTION log_tcpa_check(
  phone_number_param TEXT,
  compliant_param BOOLEAN,
  reason_param TEXT DEFAULT NULL,
  org_id_param UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO tcpa_audit_log (
    phone_number, 
    action, 
    result, 
    reason, 
    organization_id
  )
  VALUES (
    phone_number_param, 
    'compliance_check', 
    compliant_param, 
    reason_param, 
    org_id_param
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_do_not_call_list_updated_at ON do_not_call_list;
CREATE TRIGGER update_do_not_call_list_updated_at
  BEFORE UPDATE ON do_not_call_list
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_consent_updated_at ON customer_consent;
CREATE TRIGGER update_customer_consent_updated_at
  BEFORE UPDATE ON customer_consent
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
