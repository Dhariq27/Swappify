-- Fix security issue: Prevent email harvesting by restricting profile access
-- Users can only see their own full profile with email
-- Other users' profiles are browsable without email through a secure function

-- Drop the existing policy that exposes all emails
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Create policy: Users can only view their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a secure function to get public profile data (without emails)
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id uuid,
  full_name text,
  bio text,
  location text,
  avatar_url text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    full_name,
    bio,
    location,
    avatar_url,
    created_at,
    updated_at
  FROM public.profiles;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO authenticated;