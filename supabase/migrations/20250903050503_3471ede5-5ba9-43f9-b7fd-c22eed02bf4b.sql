-- Harden quotes data access by removing email-based SELECT policy
-- Reason: Email-matching policy could allow unauthorized access if email verification is bypassed

-- 1) Drop risky policy
DROP POLICY IF EXISTS "Customers can view their own quotes" ON public.quotes;

-- 2) Ensure existing admin policies remain (no-op if they already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='Admins can view all quotes'
  ) THEN
    CREATE POLICY "Admins can view all quotes"
    ON public.quotes
    FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='Admins can update quotes'
  ) THEN
    CREATE POLICY "Admins can update quotes"
    ON public.quotes
    FOR UPDATE
    USING (EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='Anyone can create quotes'
  ) THEN
    CREATE POLICY "Anyone can create quotes"
    ON public.quotes
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;