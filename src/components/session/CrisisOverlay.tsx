import { AlertTriangle, Phone, MapPin, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CrisisResult } from "@/hooks/useSessionAI";

interface CrisisOverlayProps {
  crisis: CrisisResult;
  patientLocation?: { city?: string; country?: string };
  emergencyContact?: { name?: string; phone?: string };
  onDismiss: () => void;
}

export default function CrisisOverlay({ crisis, patientLocation, emergencyContact, onDismiss }: CrisisOverlayProps) {
  const isRed = crisis.riskLevel === "red";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl border-2 p-6 shadow-2xl ${
          isRed ? "bg-red-950 border-red-500" : "bg-amber-950 border-amber-500"
        }`}
      >
        <button onClick={onDismiss} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${isRed ? "bg-red-500/20" : "bg-amber-500/20"}`}>
            <AlertTriangle className={`h-6 w-6 ${isRed ? "text-red-400" : "text-amber-400"}`} />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${isRed ? "text-red-300" : "text-amber-300"}`}>
              {isRed ? "🚨 CRISIS PROTOCOL — IMMEDIATE ACTION" : "⚠️ Yellow Flag — Elevated Risk"}
            </h2>
            <p className="text-xs text-white/50">AI-detected risk indicators during session</p>
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-2 mb-4">
          {crisis.flags.map((flag, i) => (
            <div key={i} className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-sm text-white/90 font-medium">"{flag.phrase}"</p>
              <p className="text-xs text-white/50 mt-1">{flag.reason}</p>
              <span
                className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  flag.severity === "critical"
                    ? "bg-red-500/20 text-red-300"
                    : flag.severity === "high"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {flag.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="rounded-lg bg-white/5 p-3 mb-4 border border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">AI Recommendation</p>
          <p className="text-sm text-white/80">{crisis.recommendation}</p>
        </div>

        {/* De-escalation guide */}
        {isRed && (
          <div className="rounded-lg bg-white/5 p-3 mb-4 border border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2">De-escalation Steps</p>
            <ol className="text-xs text-white/70 space-y-1.5 list-decimal list-inside">
              <li>Remain calm and use a steady, warm tone</li>
              <li>Acknowledge the patient's pain without judgment</li>
              <li>Ask directly: "Are you thinking about hurting yourself?"</li>
              <li>If yes, assess immediacy and means</li>
              <li>Contact emergency services if imminent danger</li>
              <li>Do not leave the patient alone during the call</li>
            </ol>
          </div>
        )}

        {/* Emergency info */}
        <div className="grid grid-cols-2 gap-3">
          {patientLocation && (patientLocation.city || patientLocation.country) && (
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs text-white/40">Patient Location</span>
              </div>
              <p className="text-sm text-white/80">
                {[patientLocation.city, patientLocation.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          {emergencyContact && emergencyContact.name && (
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs text-white/40">Emergency Contact</span>
              </div>
              <p className="text-sm text-white/80">{emergencyContact.name}</p>
              {emergencyContact.phone && (
                <a href={`tel:${emergencyContact.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" /> {emergencyContact.phone}
                </a>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={onDismiss}
          className="w-full mt-4"
          variant={isRed ? "destructive" : "default"}
        >
          Acknowledge & Continue Session
        </Button>
      </div>
    </div>
  );
}
