-- Pariverse - Auth Migration
-- Run this in Supabase SQL Editor AFTER setup.sql

-- Add auth columns to parivaar_users
ALTER TABLE parivaar_users ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;
ALTER TABLE parivaar_users ADD COLUMN IF NOT EXISTS email TEXT;

-- Add invited_email to family_members (for invite tracking)
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS invited_email TEXT;

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_parivaar_users_auth_id ON parivaar_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_parivaar_users_email ON parivaar_users(email);
CREATE INDEX IF NOT EXISTS idx_family_members_invited_email ON family_members(invited_email);
