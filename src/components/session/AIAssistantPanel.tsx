import { Brain, AlertTriangle, Loader2 } from "lucide-react";
import type { EmotionState, CrisisResult } from "@/hooks/useSessionAI";

interface AIAssistantPanelProps {
  emotions: EmotionState[];
  overallTone: string;
  suggestions: string[];
  isAnalyzing: boolean;
  crisisAlert: CrisisResult | null;
  transcript: string[];
}

const emotionColorMap: Record<string, string> = {
  Stress: "bg-amber-400",
  Sadness: "bg-blue-400",
  Anxiety: "bg-[hsl(var(--crisis))]",
  Anger: "bg-red-400",
  Fear: "bg-purple-400",
  Hope: "bg-[hsl(var(--success))]",
};

export default function AIAssistantPanel({
  emotions,
  overallTone,
  suggestions,
  isAnalyzing,
  crisisAlert,
  transcript,
}: AIAssistantPanelProps) {
  return (
    <div className="w-80 border-l border-white/10 bg-white/[0.03] p-4 overflow-y-auto flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary-foreground flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        AI Clinical Assistant
        {isAnalyzing && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-primary/70">
            <Loader2 className="h-3 w-3 animate-spin" /> Analyzing…
          </span>
        )}
      </h3>

      {/* Live transcription */}
      <div>
        <div className="text-xs text-primary-foreground/40 uppercase tracking-wide mb-2">
          Live Transcript
        </div>
        <div className="text-xs text-primary-foreground/60 leading-relaxed space-y-1.5 max-h-32 overflow-y-auto">
          {transcript.length === 0 ? (
            <p className="text-primary-foreground/30 italic">Waiting for conversation…</p>
          ) : (
            transcript.slice(-6).map((line, i) => <p key={i}>{line}</p>)
          )}
        </div>
      </div>

      {/* Emotional state */}
      <div className="p-3 rounded-xl bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-primary-foreground/40 uppercase tracking-wide">Emotional State</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-primary-foreground/50 capitalize">
            {overallTone}
          </span>
        </div>
        <div className="space-y-2">
          {emotions.map((e) => (
            <div key={e.label}>
              <div className="flex justify-between text-xs text-primary-foreground/60 mb-1">
                <span className="flex items-center gap-1">
                  {e.label}
                  <span className="text-[10px] text-primary-foreground/30">
                    {e.trend === "rising" ? "↑" : e.trend === "falling" ? "↓" : "→"}
                  </span>
                </span>
                <span>{e.value}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${emotionColorMap[e.label] || "bg-primary"}`}
                  style={{ width: `${e.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested questions */}
      <div>
        <div className="text-xs text-primary-foreground/40 uppercase tracking-wide mb-2">
          Suggested Follow-ups
        </div>
        <div className="space-y-1.5">
          {suggestions.length === 0 ? (
            <p className="text-xs text-primary-foreground/20 italic">AI will suggest questions as the session progresses…</p>
          ) : (
            suggestions.map((q, i) => (
              <button
                key={i}
                className="w-full text-left text-xs text-primary-foreground/70 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors leading-relaxed active:scale-[0.98]"
              >
                {q}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Risk indicator */}
      {crisisAlert && (
        <div
          className={`p-3 rounded-xl border ${
            crisisAlert.riskLevel === "red"
              ? "bg-red-500/10 border-red-500/30"
              : "bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle
              className={`h-3.5 w-3.5 ${crisisAlert.riskLevel === "red" ? "text-red-400" : "text-amber-400"}`}
            />
            <span
              className={`text-xs font-semibold ${
                crisisAlert.riskLevel === "red" ? "text-red-400" : "text-amber-400"
              }`}
            >
              {crisisAlert.riskLevel === "red" ? "Red Alert" : "Yellow Flag"}
            </span>
          </div>
          <p className="text-xs text-primary-foreground/50">{crisisAlert.recommendation}</p>
        </div>
      )}
    </div>
  );
}
