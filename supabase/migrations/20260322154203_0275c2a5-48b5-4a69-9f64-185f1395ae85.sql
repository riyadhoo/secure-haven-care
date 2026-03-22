
-- Sessions table
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  session_type TEXT NOT NULL DEFAULT 'video' CHECK (session_type IN ('video', 'audio', 'avatar')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Only participants can see their own sessions
CREATE POLICY "Participants can view own sessions"
  ON public.sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

CREATE POLICY "Doctors can create sessions"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own sessions"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id);

-- Session reports table (SOAP/DAP)
CREATE TABLE public.session_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'soap' CHECK (report_type IN ('soap', 'dap')),
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  emotional_timeline JSONB DEFAULT '[]'::jsonb,
  flagged_moments JSONB DEFAULT '[]'::jsonb,
  topics JSONB DEFAULT '[]'::jsonb,
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.session_reports ENABLE ROW LEVEL SECURITY;

-- Zero-knowledge: only doctor and patient can access
CREATE POLICY "Participants can view own reports"
  ON public.session_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

CREATE POLICY "Doctors can create reports"
  ON public.session_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own reports"
  ON public.session_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id);

-- Session transcripts (live analysis chunks)
CREATE TABLE public.session_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('emotion', 'crisis', 'topic', 'suggestion')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.session_analysis ENABLE ROW LEVEL SECURITY;

-- Only the session doctor can see analysis
CREATE POLICY "Doctors can view session analysis"
  ON public.session_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = session_id AND s.doctor_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analysis"
  ON public.session_analysis FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable realtime for session_analysis so doctor gets live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_analysis;
