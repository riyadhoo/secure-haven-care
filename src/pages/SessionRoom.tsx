import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  Brain,
  Send,
  Loader2,
} from "lucide-react";
import { useSessionAI } from "@/hooks/useSessionAI";
import AIAssistantPanel from "@/components/session/AIAssistantPanel";
import SessionControls from "@/components/session/SessionControls";
import CrisisOverlay from "@/components/session/CrisisOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Simulated transcript lines for demo — in production, this comes from WebRTC + STT
const DEMO_TRANSCRIPT = [
  { speaker: "patient", text: "I've been feeling really overwhelmed at work lately, like nothing I do is enough." },
  { speaker: "doctor", text: "When did you first start noticing these feelings?" },
  { speaker: "patient", text: "Maybe about three months ago, after my manager changed. The new one is very demanding." },
  { speaker: "doctor", text: "How has that affected your sleep and daily routine?" },
  { speaker: "patient", text: "I barely sleep. I lie awake thinking about deadlines. Some mornings I can't get out of bed." },
  { speaker: "doctor", text: "That sounds really exhausting. Have you talked to anyone else about this?" },
  { speaker: "patient", text: "No. I feel like nobody would understand. Sometimes I wonder if things will ever get better." },
  { speaker: "doctor", text: "I hear you. Those feelings of hopelessness can be very heavy. Let's explore that together." },
];

export default function SessionRoom() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [burnerNote, setBurnerNote] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const transcriptIdx = useRef(0);
  const navigate = useNavigate();
  const { role } = useAuth();
  const { toast } = useToast();
  const isDoctor = role === "doctor";

  const {
    emotions,
    crisisAlert,
    suggestions,
    isAnalyzing,
    overallTone,
    analyze,
    generateReport,
    dismissCrisis,
  } = useSessionAI();

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate transcript arriving + trigger AI analysis
  useEffect(() => {
    if (transcriptIdx.current >= DEMO_TRANSCRIPT.length) return;
    const interval = setInterval(() => {
      const idx = transcriptIdx.current;
      if (idx >= DEMO_TRANSCRIPT.length) {
        clearInterval(interval);
        return;
      }
      const line = DEMO_TRANSCRIPT[idx];
      const formatted = `${line.speaker === "patient" ? "Patient" : "Doctor"}: "${line.text}"`;
      setTranscriptLines((prev) => [...prev, formatted]);
      transcriptIdx.current = idx + 1;

      // Every 2 lines, trigger AI analysis
      if ((idx + 1) % 2 === 0) {
        const recent = DEMO_TRANSCRIPT.slice(Math.max(0, idx - 3), idx + 1)
          .map((l) => `${l.speaker}: ${l.text}`)
          .join("\n");
        analyze(recent, "emotion");
        analyze(recent, "crisis");
        analyze(recent, "suggestions");
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [analyze]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleEndSession = useCallback(async () => {
    if (!isDoctor) {
      toast({ title: "Session ended", description: "Thank you for your session." });
      navigate("/patient");
      return;
    }

    setIsGeneratingReport(true);
    try {
      const fullTranscript = DEMO_TRANSCRIPT.map((l) => `${l.speaker}: ${l.text}`).join("\n");
      const report = await generateReport(fullTranscript, "soap");
      toast({ title: "Report generated", description: "Your SOAP report is ready for review." });
      // Navigate to report view with data
      navigate("/session-report", { state: { report, reportType: "soap", transcript: fullTranscript } });
    } catch (e) {
      console.error("Report generation failed:", e);
      toast({ title: "Report failed", description: "Could not generate report. Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingReport(false);
    }
  }, [isDoctor, generateReport, navigate, toast]);

  return (
    <div className="h-screen bg-foreground flex flex-col overflow-hidden">
      {/* Crisis overlay */}
      {crisisAlert && crisisAlert.riskLevel !== "none" && (
        <CrisisOverlay
          crisis={crisisAlert}
          patientLocation={{ city: "Lagos", country: "Nigeria" }}
          emergencyContact={{ name: "Tunde Bakare", phone: "+234 801 234 5678" }}
          onDismiss={dismissCrisis}
        />
      )}

      {/* Generating report overlay */}
      {isGeneratingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-primary-foreground font-medium">Generating clinical report…</p>
            <p className="text-sm text-primary-foreground/50 mt-1">AI is analyzing the full session</p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-foreground/95 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-primary-foreground">TheraCare Session</span>
          <span className="text-xs text-primary-foreground/50 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatTime(elapsedSeconds)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] font-medium">
            🔒 Encrypted
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {isAnalyzing ? "AI Analyzing…" : "AI Active"}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* Doctor video */}
            <div className="bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">AO</span>
                </div>
                <p className="text-sm text-primary-foreground/70">Dr. Amara Osei</p>
              </div>
            </div>
            {/* Patient video */}
            <div className="bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🦊</span>
                </div>
                <p className="text-sm text-primary-foreground/70">AnonymousFox</p>
                <p className="text-xs text-primary-foreground/40 mt-1">Audio Only</p>
              </div>
            </div>
          </div>

          {/* Burner notes (patient panel) */}
          {!isDoctor && (
            <div className="mt-3 bg-white/5 rounded-xl p-3 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">
                  Burner Note — permanently deleted after session
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  value={burnerNote}
                  onChange={(e) => setBurnerNote(e.target.value)}
                  placeholder="Type something you can't say out loud..."
                  className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-amber-400/50"
                />
                <Button size="sm" variant="ghost" className="text-amber-400 hover:bg-amber-400/10 h-9">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <SessionControls
            micOn={micOn}
            camOn={camOn}
            chatOpen={chatOpen}
            aiOpen={aiOpen}
            onToggleMic={() => setMicOn(!micOn)}
            onToggleCam={() => setCamOn(!camOn)}
            onToggleChat={() => setChatOpen(!chatOpen)}
            onToggleAI={() => setAiOpen(!aiOpen)}
            onEndSession={handleEndSession}
          />
        </div>

        {/* AI Panel (doctor only) */}
        {aiOpen && isDoctor && (
          <AIAssistantPanel
            emotions={emotions}
            overallTone={overallTone}
            suggestions={suggestions}
            isAnalyzing={isAnalyzing}
            crisisAlert={crisisAlert}
            transcript={transcriptLines}
          />
        )}
      </div>
    </div>
  );
}
