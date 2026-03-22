import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Phone,
  MessageSquare,
  Brain,
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function SessionRoom() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [burnerNote, setBurnerNote] = useState("");

  return (
    <div className="h-screen bg-foreground flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-foreground/95 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-primary-foreground">TheraCare Session</span>
          <span className="text-xs text-primary-foreground/50 flex items-center gap-1">
            <Clock className="h-3 w-3" /> 24:32
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
            🔒 Encrypted
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium flex items-center gap-1">
            <Brain className="h-3 w-3" /> AI Active
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                micOn ? "bg-white/10 hover:bg-white/15 text-primary-foreground" : "bg-crisis text-white"
              }`}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setCamOn(!camOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                camOn ? "bg-white/10 hover:bg-white/15 text-primary-foreground" : "bg-crisis text-white"
              }`}
            >
              {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                chatOpen ? "bg-primary text-primary-foreground" : "bg-white/10 hover:bg-white/15 text-primary-foreground"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                aiOpen ? "bg-primary text-primary-foreground" : "bg-white/10 hover:bg-white/15 text-primary-foreground"
              }`}
            >
              <Brain className="h-5 w-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-crisis hover:bg-crisis/90 text-white flex items-center justify-center transition-colors">
              <Phone className="h-5 w-5 rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* AI Panel (doctor only) */}
        {aiOpen && (
          <div className="w-80 border-l border-white/10 bg-white/[0.03] p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-primary-foreground mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Clinical Assistant
            </h3>

            {/* Live transcription */}
            <div className="mb-4">
              <div className="text-xs text-primary-foreground/40 uppercase tracking-wide mb-2">Live Transcript</div>
              <div className="text-xs text-primary-foreground/60 leading-relaxed space-y-2">
                <p><span className="text-primary">Patient:</span> "...I've been feeling really overwhelmed at work lately, like nothing I do is enough."</p>
                <p><span className="text-accent">Doctor:</span> "When did you first start noticing these feelings?"</p>
                <p><span className="text-primary">Patient:</span> "Maybe about three months ago, after my manager changed..."</p>
              </div>
            </div>

            {/* Emotional state */}
            <div className="mb-4 p-3 rounded-xl bg-white/5">
              <div className="text-xs text-primary-foreground/40 uppercase tracking-wide mb-2">Emotional State</div>
              <div className="space-y-2">
                {[
                  { label: "Stress", value: 72, color: "bg-amber-400" },
                  { label: "Sadness", value: 45, color: "bg-blue-400" },
                  { label: "Anxiety", value: 68, color: "bg-crisis" },
                ].map((e) => (
                  <div key={e.label}>
                    <div className="flex justify-between text-xs text-primary-foreground/60 mb-1">
                      <span>{e.label}</span>
                      <span>{e.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${e.color}`} style={{ width: `${e.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested questions */}
            <div className="mb-4">
              <div className="text-xs text-primary-foreground/40 uppercase tracking-wide mb-2">Suggested Follow-ups</div>
              <div className="space-y-1.5">
                {[
                  "How has the change in management affected your daily routine?",
                  "Can you describe a specific moment when you felt 'not enough'?",
                  "Have you talked to anyone else about these feelings?",
                ].map((q, i) => (
                  <button
                    key={i}
                    className="w-full text-left text-xs text-primary-foreground/70 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors leading-relaxed"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk indicator */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">Yellow Flag</span>
              </div>
              <p className="text-xs text-primary-foreground/50">
                Elevated stress markers detected. Work-related distress patterns match burnout indicators.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
