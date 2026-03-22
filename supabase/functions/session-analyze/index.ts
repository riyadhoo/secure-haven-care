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

    const { transcript, analysisType } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";
    const tools: any[] = [];
    let toolChoice: any = undefined;

    if (analysisType === "emotion") {
      systemPrompt =
        "You are a clinical emotion analysis AI. Analyze therapy session transcript excerpts for emotional indicators. Be precise and clinical.";
      tools.push({
        type: "function",
        function: {
          name: "report_emotions",
          description: "Report detected emotional states from the transcript",
          parameters: {
            type: "object",
            properties: {
              emotions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string", description: "Emotion name (e.g. Stress, Anxiety, Sadness, Anger, Fear, Hope)" },
                    value: { type: "number", description: "Intensity 0-100" },
                    trend: { type: "string", enum: ["rising", "stable", "falling"] },
                  },
                  required: ["label", "value", "trend"],
                  additionalProperties: false,
                },
              },
              dominantEmotion: { type: "string" },
              overallTone: { type: "string", enum: ["distressed", "anxious", "neutral", "hopeful", "positive"] },
            },
            required: ["emotions", "dominantEmotion", "overallTone"],
            additionalProperties: false,
          },
        },
      });
      toolChoice = { type: "function", function: { name: "report_emotions" } };
      userPrompt = `Analyze these therapy session excerpts for emotional indicators:\n\n${transcript}`;
    } else if (analysisType === "crisis") {
      systemPrompt =
        "You are a clinical crisis detection AI. Analyze therapy transcripts for ANY signs of suicide ideation, self-harm signals, severe distress, or danger. Be extremely sensitive — false positives are acceptable, false negatives are not. If there is ANY doubt, flag it.";
      tools.push({
        type: "function",
        function: {
          name: "report_crisis",
          description: "Report crisis assessment from the transcript",
          parameters: {
            type: "object",
            properties: {
              riskLevel: { type: "string", enum: ["none", "yellow", "red"] },
              flags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    phrase: { type: "string", description: "The concerning phrase or pattern" },
                    reason: { type: "string", description: "Why this is concerning" },
                    severity: { type: "string", enum: ["moderate", "high", "critical"] },
                  },
                  required: ["phrase", "reason", "severity"],
                  additionalProperties: false,
                },
              },
              recommendation: { type: "string", description: "Recommended action for the clinician" },
            },
            required: ["riskLevel", "flags", "recommendation"],
            additionalProperties: false,
          },
        },
      });
      toolChoice = { type: "function", function: { name: "report_crisis" } };
      userPrompt = `Analyze this therapy transcript for crisis indicators:\n\n${transcript}`;
    } else if (analysisType === "suggestions") {
      systemPrompt =
        "You are a clinical therapy assistant. Based on what the patient has said, suggest 3 follow-up questions the therapist could ask. Questions should be open-ended, empathetic, and clinically relevant.";
      tools.push({
        type: "function",
        function: {
          name: "suggest_questions",
          description: "Suggest follow-up questions for the therapist",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: { type: "string" },
                description: "3 suggested follow-up questions",
              },
              rationale: { type: "string", description: "Brief clinical rationale" },
            },
            required: ["questions", "rationale"],
            additionalProperties: false,
          },
        },
      });
      toolChoice = { type: "function", function: { name: "suggest_questions" } };
      userPrompt = `Based on this therapy conversation, suggest follow-up questions:\n\n${transcript}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid analysisType" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: toolChoice,
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    const parsed = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify({ analysisType, result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("session-analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
