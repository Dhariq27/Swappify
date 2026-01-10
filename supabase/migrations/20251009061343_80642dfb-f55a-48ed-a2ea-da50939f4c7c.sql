-- Add column-level security for email addresses

-- Create a view that exposes only public profile fields (without email)
CREATE OR REPLACE VIEW public.profiles_public AS
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