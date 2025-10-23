-- Enable RLS and secure policies using user_roles + has_role()
-- PROFILES: users can view/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- PLANS: owner or coach/admin can access
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS plans_owner_or_staff ON public.plans;
CREATE POLICY plans_owner_or_staff ON public.plans
  FOR ALL USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'coach')
    OR public.has_role(auth.uid(), 'admin')
  );

-- EVALUATIONS: owner or coach/admin can access
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS evaluations_owner_or_staff ON public.evaluations;
CREATE POLICY evaluations_owner_or_staff ON public.evaluations
  FOR ALL USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'coach')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Ensure notifications also protected to owner
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notifications_owner ON public.notifications;
CREATE POLICY notifications_owner ON public.notifications
  FOR ALL USING (user_id = auth.uid());