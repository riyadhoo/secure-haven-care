import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EmotionState {
  label: string;
  value: number;
  trend: "rising" | "stable" | "falling";
}

export interface CrisisFlag {
  phrase: string;
  reason: string;
  severity: "moderate" | "high" | "critical";
}

export interface CrisisResult {
  riskLevel: "none" | "yellow" | "red";
  flags: CrisisFlag[];
  recommendation: string;
}

export interface EmotionResult {
  emotions: EmotionState[];
  dominantEmotion: string;
  overallTone: string;
}

export interface SuggestionResult {
  questions: string[];
  rationale: string;
}

export function useSessionAI() {
  const [emotions, setEmotions] = useState<EmotionState[]>([
    { label: "Stress", value: 0, trend: "stable" },
    { label: "Sadness", value: 0, trend: "stable" },
    { label: "Anxiety", value: 0, trend: "stable" },
  ]);
  const [crisisAlert, setCrisisAlert] = useState<CrisisResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallTone, setOverallTone] = useState("neutral");
  const emotionHistory = useRef<EmotionResult[]>([]);
  const crisisHistory = useRef<CrisisFlag[]>([]);
  const { toast } = useToast();

  const analyze = useCallback(
    async (transcript: string, type: "emotion" | "crisis" | "suggestions") => {
      try {
        setIsAnalyzing(true);
        const { data, error } = await supabase.functions.invoke("session-analyze", {
          body: { transcript, analysisType: type },
        });

        if (error) throw error;

        if (type === "emotion" && data?.result) {
          const r = data.result as EmotionResult;
          setEmotions(r.emotions.slice(0, 5));
          setOverallTone(r.overallTone);
          emotionHistory.current.push(r);
        } else if (type === "crisis" && data?.result) {
          const r = data.result as CrisisResult;
          if (r.riskLevel !== "none") {
            setCrisisAlert(r);
            crisisHistory.current.push(...r.flags);
          }
        } else if (type === "suggestions" && data?.result) {
          const r = data.result as SuggestionResult;
          setSuggestions(r.questions);
        }
      } catch (e: any) {
        console.error(`AI ${type} error:`, e);
        if (e?.message?.includes("429") || e?.context?.status === 429) {
          toast({ title: "AI rate limited", description: "Retrying shortly…", variant: "destructive" });
        }
      } finally {
        setIsAnalyzing(false);
      }
    },
    [toast]
  );

  const generateReport = useCallback(
    async (transcript: string, reportType: "soap" | "dap") => {
      const { data, error } = await supabase.functions.invoke("session-report", {
        body: {
          transcript,
          reportType,
          emotionHistory: emotionHistory.current,
          crisisFlags: crisisHistory.current,
        },
      });
      if (error) throw error;
      return data?.report;
    },
    []
  );

  const dismissCrisis = useCallback(() => setCrisisAlert(null), []);

  return {
    emotions,
    crisisAlert,
    suggestions,
    isAnalyzing,
    overallTone,
    analyze,
    generateReport,
    dismissCrisis,
    emotionHistory: emotionHistory.current,
    crisisHistory: crisisHistory.current,
  };
}
