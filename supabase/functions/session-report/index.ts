import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { transcript, reportType, emotionHistory, crisisFlags } = await req.json();

    const format = reportType === "dap" ? "DAP" : "SOAP";
    const formatInstructions =
      format === "SOAP"
        ? `SOAP format:
- Subjective: Patient's own words, feelings, and concerns
- Objective: Observable behavioral data, emotional markers, speech patterns
- Assessment: Clinical interpretation, diagnostic impressions, risk assessment
- Plan: Treatment recommendations, follow-up, homework assignments`
        : `DAP format:
- Data: All relevant information gathered during the session (patient statements, observations)
- Assessment: Clinical interpretation, progress evaluation, risk factors
- Plan: Next steps, treatment modifications, referrals`;

    const systemPrompt = `You are a clinical documentation AI assistant for licensed therapists. Generate a structured ${format} clinical note from the session transcript. Be thorough, precise, and use appropriate clinical language. Include emotional progression and any risk indicators.`;

    const userPrompt = `Generate a ${format} report for this therapy session.

${formatInstructions}

Session transcript:
${transcript}

Emotion data observed during session:
${JSON.stringify(emotionHistory || [])}

Crisis flags during session:
${JSON.stringify(crisisFlags || [])}`;

    const soapSchema = {
      type: "object",
      properties: {
        subjective: { type: "string" },
        objective: { type: "string" },
        assessment: { type: "string" },
        plan: { type: "string" },
        summary: { type: "string", description: "Brief 2-3 sentence session summary" },
        emotionalProgression: {
          type: "object",
          properties: {
            beginning: { type: "string" },
            middle: { type: "string" },
            end: { type: "string" },
          },
          required: ["beginning", "middle", "end"],
          additionalProperties: false,
        },
        riskAssessment: { type: "string" },
        recommendedFollowUp: { type: "string" },
      },
      required: ["subjective", "objective", "assessment", "plan", "summary", "emotionalProgression", "riskAssessment", "recommendedFollowUp"],
      additionalProperties: false,
    };

    const dapSchema = {
      type: "object",
      properties: {
        data: { type: "string" },
        assessment: { type: "string" },
        plan: { type: "string" },
        summary: { type: "string" },
        emotionalProgression: {
          type: "object",
          properties: {
            beginning: { type: "string" },
            middle: { type: "string" },
            end: { type: "string" },
          },
          required: ["beginning", "middle", "end"],
          additionalProperties: false,
        },
        riskAssessment: { type: "string" },
        recommendedFollowUp: { type: "string" },
      },
      required: ["data", "assessment", "plan", "summary", "emotionalProgression", "riskAssessment", "recommendedFollowUp"],
      additionalProperties: false,
    };

    const tools = [
      {
        type: "function",
        function: {
          name: "generate_report",
          description: `Generate a ${format} clinical report`,
          parameters: reportType === "dap" ? dapSchema : soapSchema,
        },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "generate_report" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    const report = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify({ reportType: format.toLowerCase(), report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("session-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
