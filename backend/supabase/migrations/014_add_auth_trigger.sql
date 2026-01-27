-- Migration 014
-- Date: January 20, 2026
-- Purpose: Add PostgreSQL trigger to automatically create public.users record when auth.users is created
-- Applied by: Austin
-- Status: Applied

-- Create function to handle new user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();