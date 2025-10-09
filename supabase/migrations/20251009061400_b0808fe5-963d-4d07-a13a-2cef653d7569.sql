-- Fix security definer issue with the profiles_public view
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view with explicit SECURITY INVOKER (safer than SECURITY DEFINER)
CREATE VIEW public.profiles_public 
WITH (security_invoker=true)
AS
SELECT 
  id,
  full_name,
  bio,
  location,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles;

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.profiles_public TO authenticated;

-- Add helpful comment
COMMENT ON VIEW public.profiles_public IS 'Public view of profiles that excludes sensitive data like email addresses. Use this for browsing other users profiles.';