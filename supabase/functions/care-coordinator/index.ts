import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Authenticate caller
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return json({ error: "Unauthorized" }, 401);

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
  const user = userData.user;

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Determine role
  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  const role = roleRow?.role ?? "patient";

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const action = body.action as string;

  try {
    switch (action) {
      case "listDoctors": {
        const { data: docs, error } = await admin
          .from("doctor_profiles")
          .select("id, specialty, style, languages, bio, available, rating, sessions_count")
          .order("rating", { ascending: false });
        if (error) throw error;
        const ids = (docs ?? []).map((d) => d.id);
        const { data: profs } = await admin
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
        const profMap = new Map((profs ?? []).map((p) => [p.id, p]));
        const merged = (docs ?? []).map((d) => ({
          ...d,
          display_name: profMap.get(d.id)?.display_name ?? "Therapist",
          avatar_url: profMap.get(d.id)?.avatar_url ?? null,
        }));
        return json({ doctors: merged });
      }

      case "bookSession": {
        if (role !== "patient") return json({ error: "Only patients can book" }, 403);
        const { doctor_id, session_type = "video", scheduled_for, concern } = body;
        if (!doctor_id) return json({ error: "doctor_id required" }, 400);

        // Verify doctor exists
        const { data: doc } = await admin
          .from("user_roles")
          .select("user_id")
          .eq("user_id", doctor_id)
          .eq("role", "doctor")
          .maybeSingle();
        if (!doc) return json({ error: "Doctor not found" }, 404);

        const channel_name = `session-${crypto.randomUUID()}`;
        const { data: session, error } = await admin
          .from("sessions")
          .insert({
            patient_id: user.id,
            doctor_id,
            session_type,
            status: "pending",
            scheduled_for: scheduled_for ?? null,
            concern: concern ?? null,
            channel_name,
          })
          .select()
          .single();
        if (error) throw error;
        return json({ session });
      }

      case "listMySessions": {
        const column = role === "doctor" ? "doctor_id" : "patient_id";
        const { data: sessions, error } = await admin
          .from("sessions")
          .select("*")
          .eq(column, user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;

        // Attach counterpart display name
        const ids = Array.from(
          new Set((sessions ?? []).map((s) => (role === "doctor" ? s.patient_id : s.doctor_id)))
        );
        const { data: profs } = await admin
          .from("profiles")
          .select("id, display_name")
          .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
        const map = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
        const enriched = (sessions ?? []).map((s) => ({
          ...s,
          counterpart_name:
            map.get(role === "doctor" ? s.patient_id : s.doctor_id) ?? "User",
        }));
        return json({ sessions: enriched });
      }

      case "updateSessionStatus": {
        const { session_id, status } = body;
        if (!session_id || !status) return json({ error: "session_id and status required" }, 400);
        const { data: s } = await admin
          .from("sessions")
          .select("*")
          .eq("id", session_id)
          .maybeSingle();
        if (!s) return json({ error: "Session not found" }, 404);
        if (s.doctor_id !== user.id && s.patient_id !== user.id) {
          return json({ error: "Not authorized" }, 403);
        }
        const patch: any = { status };
        if (status === "completed" || status === "cancelled") {
          patch.ended_at = new Date().toISOString();
        }
        const { data: updated, error } = await admin
          .from("sessions")
          .update(patch)
          .eq("id", session_id)
          .select()
          .single();
        if (error) throw error;
        return json({ session: updated });
      }

      case "saveReport": {
        if (role !== "doctor") return json({ error: "Only doctors can save reports" }, 403);
        const { session_id, report_type = "soap", report_data, is_finalized = false } = body;
        if (!session_id || !report_data) return json({ error: "missing fields" }, 400);
        const { data: s } = await admin
          .from("sessions")
          .select("patient_id, doctor_id")
          .eq("id", session_id)
          .maybeSingle();
        if (!s || s.doctor_id !== user.id) return json({ error: "Not authorized" }, 403);

        // Upsert
        const { data: existing } = await admin
          .from("session_reports")
          .select("id")
          .eq("session_id", session_id)
          .maybeSingle();

        if (existing) {
          const { data, error } = await admin
            .from("session_reports")
            .update({ report_type, report_data, is_finalized })
            .eq("id", existing.id)
            .select()
            .single();
          if (error) throw error;
          return json({ report: data });
        } else {
          const { data, error } = await admin
            .from("session_reports")
            .insert({
              session_id,
              doctor_id: user.id,
              patient_id: s.patient_id,
              report_type,
              report_data,
              is_finalized,
            })
            .select()
            .single();
          if (error) throw error;
          return json({ report: data });
        }
      }

      case "getMyDoctorProfile": {
        if (role !== "doctor") return json({ error: "Doctor only" }, 403);
        const { data, error } = await admin
          .from("doctor_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (error) throw error;
        return json({ profile: data });
      }

      case "updateMyDoctorProfile": {
        if (role !== "doctor") return json({ error: "Doctor only" }, 403);
        const { specialty, style, languages, bio, available } = body;
        const patch: any = {};
        if (specialty !== undefined) patch.specialty = specialty;
        if (style !== undefined) patch.style = style;
        if (languages !== undefined) patch.languages = languages;
        if (bio !== undefined) patch.bio = bio;
        if (available !== undefined) patch.available = available;
        const { data, error } = await admin
          .from("doctor_profiles")
          .update(patch)
          .eq("id", user.id)
          .select()
          .single();
        if (error) throw error;
        return json({ profile: data });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    console.error("care-coordinator error:", err);
    return json({ error: err.message ?? "Internal error" }, 500);
  }
});
