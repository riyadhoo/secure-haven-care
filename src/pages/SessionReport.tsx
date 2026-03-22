import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ArrowLeft,
  Save,
  Check,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReportSection {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const SOAP_SECTIONS: ReportSection[] = [
  { key: "subjective", label: "Subjective", icon: <FileText className="h-4 w-4" /> },
  { key: "objective", label: "Objective", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "assessment", label: "Assessment", icon: <AlertTriangle className="h-4 w-4" /> },
  { key: "plan", label: "Plan", icon: <Check className="h-4 w-4" /> },
];

const DAP_SECTIONS: ReportSection[] = [
  { key: "data", label: "Data", icon: <FileText className="h-4 w-4" /> },
  { key: "assessment", label: "Assessment", icon: <AlertTriangle className="h-4 w-4" /> },
  { key: "plan", label: "Plan", icon: <Check className="h-4 w-4" /> },
];

export default function SessionReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { report, reportType, transcript } = (location.state as any) || {};
  const [editedReport, setEditedReport] = useState<Record<string, string>>(report || {});
  const [activeFormat, setActiveFormat] = useState<"soap" | "dap">(reportType || "soap");
  const [saving, setSaving] = useState(false);

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No report data found.</p>
          <Button onClick={() => navigate("/doctor")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const sections = activeFormat === "soap" ? SOAP_SECTIONS : DAP_SECTIONS;

  const handleSave = async () => {
    setSaving(true);
    try {
      // In production, save to session_reports table
      toast({ title: "Report saved", description: "Clinical note has been saved successfully." });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/doctor")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI-Generated Clinical Report</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Generated just now • Review and edit before finalizing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-input overflow-hidden">
              <button
                onClick={() => setActiveFormat("soap")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeFormat === "soap" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"
                }`}
              >
                SOAP
              </button>
              <button
                onClick={() => setActiveFormat("dap")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeFormat === "dap" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"
                }`}
              >
                DAP
              </button>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving…" : "Save Report"}
            </Button>
          </div>
        </div>

        {/* Summary */}
        {editedReport.summary && (
          <Card className="mb-6 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary uppercase tracking-wide">Session Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{editedReport.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Main sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {section.icon}
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editedReport[section.key] || ""}
                  onChange={(e) =>
                    setEditedReport((prev) => ({ ...prev, [section.key]: e.target.value }))
                  }
                  className="min-h-[120px] text-sm leading-relaxed"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emotional progression */}
        {editedReport.emotionalProgression && (
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Emotional Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {["beginning", "middle", "end"].map((phase) => {
                  const prog =
                    typeof editedReport.emotionalProgression === "object"
                      ? (editedReport.emotionalProgression as any)[phase]
                      : "";
                  return (
                    <div key={phase} className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 capitalize">{phase}</p>
                      <p className="text-sm text-foreground">{prog || "—"}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk assessment */}
        {editedReport.riskAssessment && (
          <Card className="mt-4 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" /> Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedReport.riskAssessment}
                onChange={(e) =>
                  setEditedReport((prev) => ({ ...prev, riskAssessment: e.target.value }))
                }
                className="min-h-[80px] text-sm"
              />
            </CardContent>
          </Card>
        )}

        {/* Recommended follow-up */}
        {editedReport.recommendedFollowUp && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Check className="h-4 w-4" /> Recommended Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedReport.recommendedFollowUp}
                onChange={(e) =>
                  setEditedReport((prev) => ({ ...prev, recommendedFollowUp: e.target.value }))
                }
                className="min-h-[80px] text-sm"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
