import { supabase } from "@/integrations/supabase/client";

async function call<T = any>(action: string, payload: Record<string, any> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke("care-coordinator", {
    body: { action, ...payload },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export interface DoctorListItem {
  id: string;
  display_name: string;
  avatar_url: string | null;
  specialty: string;
  style: string | null;
  languages: string | null;
  bio: string | null;
  available: boolean;
  rating: number | null;
  sessions_count: number;
}

export interface SessionRow {
  id: string;
  patient_id: string;
  doctor_id: string;
  session_type: string;
  status: string;
  scheduled_for: string | null;
  concern: string | null;
  channel_name: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  counterpart_name?: string;
}

export const careCoordinator = {
  listDoctors: () => call<{ doctors: DoctorListItem[] }>("listDoctors").then((r) => r.doctors),
  bookSession: (params: { doctor_id: string; session_type?: string; scheduled_for?: string; concern?: string }) =>
    call<{ session: SessionRow }>("bookSession", params).then((r) => r.session),
  listMySessions: () =>
    call<{ sessions: SessionRow[] }>("listMySessions").then((r) => r.sessions),
  updateSessionStatus: (session_id: string, status: string) =>
    call<{ session: SessionRow }>("updateSessionStatus", { session_id, status }).then((r) => r.session),
  saveReport: (params: { session_id: string; report_type?: string; report_data: any; is_finalized?: boolean }) =>
    call<{ report: any }>("saveReport", params).then((r) => r.report),
  getMyDoctorProfile: () => call<{ profile: any }>("getMyDoctorProfile").then((r) => r.profile),
  updateMyDoctorProfile: (params: Record<string, any>) =>
    call<{ profile: any }>("updateMyDoctorProfile", params).then((r) => r.profile),
};
