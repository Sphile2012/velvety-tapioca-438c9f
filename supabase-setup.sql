-- Supabase Database Setup for Aegis Health
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  personal_info JSONB NOT NULL,
  fitness_goals JSONB NOT NULL,
  health_conditions JSONB DEFAULT '[]'::jsonb,
  medications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding Progress Table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 6,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connected Devices Table
CREATE TABLE IF NOT EXISTS connected_devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  connection_method TEXT NOT NULL,
  battery_level INTEGER,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Data Table
CREATE TABLE IF NOT EXISTS health_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vitals JSONB NOT NULL,
  activity JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_devices_user_id ON connected_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_health_data_user_id ON health_data(user_id);
CREATE INDEX IF NOT EXISTS idx_health_data_timestamp ON health_data(timestamp);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your security requirements)
CREATE POLICY "Public read access for user_profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Public insert access for user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for user_profiles" ON user_profiles FOR UPDATE USING (true);

CREATE POLICY "Public read access for onboarding_progress" ON onboarding_progress FOR SELECT USING (true);
CREATE POLICY "Public insert access for onboarding_progress" ON onboarding_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for onboarding_progress" ON onboarding_progress FOR UPDATE USING (true);

CREATE POLICY "Public read access for connected_devices" ON connected_devices FOR SELECT USING (true);
CREATE POLICY "Public insert access for connected_devices" ON connected_devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for connected_devices" ON connected_devices FOR UPDATE USING (true);

CREATE POLICY "Public read access for health_data" ON health_data FOR SELECT USING (true);
CREATE POLICY "Public insert access for health_data" ON health_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for health_data" ON health_data FOR UPDATE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
