-- Site Settings Table for Hero Images and other configurable settings
-- Created: 2026-01-19

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read site settings
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Only admins can insert/update/delete
-- Note: This requires a user role field or admin check in the application layer
CREATE POLICY "Admins can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.membership_tier = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.membership_tier = 'admin'
    )
  );

-- Insert default hero settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_settings', '{
    "background_image_url": null,
    "content_image_url": null,
    "use_gradient": true,
    "gradient_from": "#9333ea",
    "gradient_via": "#7e22ce",
    "gradient_to": "#db2777"
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create storage bucket for hero images (if not exists)
-- Note: This needs to be done via Supabase Dashboard or API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Comment on table
COMMENT ON TABLE site_settings IS 'Stores configurable site settings like hero images';
COMMENT ON COLUMN site_settings.key IS 'Unique identifier for the setting (e.g., hero_settings)';
COMMENT ON COLUMN site_settings.value IS 'JSON value containing the setting data';
