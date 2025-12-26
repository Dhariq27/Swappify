-- Drop and recreate the profiles_public view with SECURITY DEFINER
DROP VIEW IF EXISTS profiles_public;

-- Create view with security definer to bypass RLS for public profile data
CREATE OR REPLACE VIEW profiles_public 
WITH (security_invoker = false)
AS
SELECT 
    id,
    full_name,
    bio,
    location,
    avatar_url,
    created_at,
    updated_at
FROM profiles;

-- Grant select on the view to authenticated users
GRANT SELECT ON profiles_public TO authenticated;
GRANT SELECT ON profiles_public TO anon;

-- Also add a policy to allow authenticated users to view basic profile info
-- This is needed for the chat feature to fetch other user's profiles
CREATE POLICY "Authenticated users can view other profiles for chat" 
ON profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Make sure realtime is enabled for messages table
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Make sure messages table is in the realtime publication
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    END IF;
END $$;

-- Enable realtime for barter_requests
ALTER TABLE barter_requests REPLICA IDENTITY FULL;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'barter_requests'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE barter_requests;
    END IF;
END $$;