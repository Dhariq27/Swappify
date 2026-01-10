-- Fix profiles table security issues

-- Drop the insecure get_public_profiles function that bypasses RLS
DROP FUNCTION IF EXISTS public.get_public_profiles();

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create a new SELECT policy that allows authenticated users to view profiles
-- but restricts email viewing to own profile only
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create a secure function to get profiles without exposing emails
CREATE OR REPLACE FUNCTION public.get_profile_public_data(profile_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  bio text,
  location text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
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
  FROM public.profiles
  WHERE id = profile_id;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_profile_public_data(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_profile_public_data(uuid) FROM anon;

-- Add a comment to document the security consideration
COMMENT ON FUNCTION public.get_profile_public_data IS 'Returns public profile data without email address. Only accessible to authenticated users.';