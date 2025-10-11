-- Fix profiles table email exposure
-- Drop the overly permissive policy and replace with restricted access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Users can only view their own complete profile (including email)
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- For viewing other users' profiles, they should use the profiles_public view
-- Grant SELECT on profiles_public view to authenticated users
GRANT SELECT ON public.profiles_public TO authenticated;

-- Fix notifications table - prevent direct client inserts
-- Drop the dangerous policy that allows anyone to create notifications
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Only allow service role to insert notifications (backend only)
-- Users cannot create notifications directly from the client
CREATE POLICY "Only service role can create notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Keep the existing policies for users to read and update their own notifications
-- (These are already correctly configured)