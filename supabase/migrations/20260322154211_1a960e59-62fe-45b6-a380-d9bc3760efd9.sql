
-- Fix overly permissive insert policy on session_analysis
-- Only the session's doctor should be able to insert analysis
DROP POLICY "System can insert analysis" ON public.session_analysis;

CREATE POLICY "Doctors can insert session analysis"
  ON public.session_analysis FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = session_id AND s.doctor_id = auth.uid()
    )
  );
