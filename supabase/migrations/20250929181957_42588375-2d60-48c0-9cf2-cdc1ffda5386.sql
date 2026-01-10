-- Fix security issue: Restrict profile viewing to authenticated users only
-- This prevents public access to user email addresses

-- Drop the existing public policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);