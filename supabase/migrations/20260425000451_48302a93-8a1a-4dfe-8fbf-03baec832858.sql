
-- Doctor-specific profile data
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty text NOT NULL DEFAULT 'General',
  style text DEFAULT 'Talk Therapy',
  languages text DEFAULT 'English',
  bio text,
  available boolean NOT NULL DEFAULT true,
  rating numeric(2,1) DEFAULT 5.0,
  sessions_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view doctor profiles"
  ON public.doctor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can insert own profile"
  ON public.doctor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can update own profile"
  ON public.doctor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE TRIGGER update_doctor_profiles_updated_at
  BEFORE UPDATE ON public.doctor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create doctor profile when a user signs up as doctor
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'doctor' THEN
    INSERT INTO public.doctor_profiles (id)
    VALUES (NEW.user_id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_role_doctor ON public.user_roles;
CREATE TRIGGER on_user_role_doctor
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_doctor();

-- Allow patients to view all profiles (so they can see therapist names)
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow patients to book sessions (they are the patient)
CREATE POLICY "Patients can create sessions"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Allow patients to update their own session (e.g. cancel)
CREATE POLICY "Patients can update own sessions"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id);

-- Add scheduled_for column for booking time
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS scheduled_for timestamptz,
  ADD COLUMN IF NOT EXISTS concern text,
  ADD COLUMN IF NOT EXISTS channel_name text;

-- Backfill doctor_profiles for existing doctors
INSERT INTO public.doctor_profiles (id)
SELECT user_id FROM public.user_roles
WHERE role = 'doctor'
ON CONFLICT (id) DO NOTHING;
