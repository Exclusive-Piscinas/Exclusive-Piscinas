-- CRITICAL SECURITY FIX 1: Fix privilege escalation bug
-- Update handle_new_user function to assign 'user' role by default instead of 'admin'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        'user'  -- FIXED: Changed from 'admin' to 'user'
    );
    RETURN NEW;
END;
$function$;

-- CRITICAL SECURITY FIX 2: Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- SECURITY FIX 3: Add customer data protection - customers can view their own quotes
-- First, add customer_email index for performance
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON public.quotes(customer_email);

-- Add policy for customers to view their own quotes (if they're authenticated with same email)
CREATE POLICY "Customers can view their own quotes" 
ON public.quotes 
FOR SELECT 
USING (
  CASE 
    -- If user is admin, allow access to all quotes
    WHEN EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    ) THEN true
    -- If user is authenticated and email matches, allow access
    WHEN auth.jwt() ->> 'email' = customer_email THEN true
    -- Otherwise deny access
    ELSE false
  END
);

-- Update existing admin policy to be more specific
DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;
CREATE POLICY "Admins can view all quotes" 
ON public.quotes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- SECURITY FIX 4: Add validation trigger for email format
CREATE OR REPLACE FUNCTION public.validate_quote_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Validate email format
    IF NEW.customer_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate phone format (basic validation)
    IF LENGTH(NEW.customer_phone) < 10 THEN
        RAISE EXCEPTION 'Phone number must be at least 10 digits';
    END IF;
    
    -- Validate total amount is positive
    IF NEW.total_amount < 0 THEN
        RAISE EXCEPTION 'Total amount cannot be negative';
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Add validation trigger to quotes table
DROP TRIGGER IF EXISTS validate_quote_data_trigger ON public.quotes;
CREATE TRIGGER validate_quote_data_trigger
    BEFORE INSERT OR UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_quote_data();

-- SECURITY FIX 5: Add audit logging for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    changes jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_action text,
    p_table_name text,
    p_record_id uuid DEFAULT NULL,
    p_changes jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.admin_audit_log (admin_user_id, action, table_name, record_id, changes)
    VALUES (auth.uid(), p_action, p_table_name, p_record_id, p_changes);
END;
$function$;