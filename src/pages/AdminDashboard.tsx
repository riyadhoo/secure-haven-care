import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  UserCheck,
  FileText,
  BarChart3,
  AlertTriangle,
  Shield,
  LogOut,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const pendingDoctors = [
  { name: "Dr. Sarah Kim", license: "PSY-892341", specialty: "Trauma & PTSD", submitted: "Mar 20", status: "pending" },
  { name: "Dr. James Okonkwo", license: "PSY-110254", specialty: "Addiction", submitted: "Mar 19", status: "review" },
];

const crisisLogs = [
  { session: "S-4821", time: "Mar 20, 3:42 PM", type: "Yellow Flag", detail: "Elevated distress — burnout signals" },
  { session: "S-4790", time: "Mar 18, 11:15 AM", type: "Red Flag", detail: "Self-harm language detected — crisis protocol activated" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 mb-6">
          <img src={logoIcon} alt="TheraCare" className="h-7 w-7" />
          <span className="font-bold text-lg">Thera<span className="text-primary">Care</span></span>
        </Link>
        <nav className="flex-1 space-y-1">
          {[
            { icon: BarChart3, label: "Overview", active: true },
            { icon: UserCheck, label: "Verifications" },
            { icon: Users, label: "Users" },
            { icon: AlertTriangle, label: "Crisis Logs" },
            { icon: FileText, label: "Session Logs" },
            { icon: Shield, label: "Security" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary">
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mb-8">Platform management & monitoring</p>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={60}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Active Patients", value: "1,247" },
                { label: "Verified Doctors", value: "89" },
                { label: "Sessions Today", value: "34" },
                { label: "Pending Reviews", value: "7" },
              ].map((s, i) => (
                <div key={i} className="glass-card rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending verifications */}
            <ScrollReveal delay={100}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Pending Verifications</h2>
                <div className="space-y-3">
                  {pendingDoctors.map((d, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.license} · {d.specialty}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          d.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        }`}>
                          {d.status === "pending" ? "Pending" : "Under Review"}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="ghost" className="flex-1 h-8 gap-1">
                          <Eye className="h-3.5 w-3.5" /> Review Docs
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-success gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-destructive gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Crisis logs */}
            <ScrollReveal delay={160}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Crisis Incident Log</h2>
                <div className="space-y-3">
                  {crisisLogs.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          c.type === "Red Flag" ? "bg-crisis" : "bg-warning"
                        }`} />
                        <span className={`text-xs font-semibold ${
                          c.type === "Red Flag" ? "text-crisis" : "text-amber-600"
                        }`}>
                          {c.type}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">{c.time}</span>
                      </div>
                      <p className="text-sm">{c.detail}</p>
                      <p className="text-xs text-muted-foreground mt-1">Session {c.session}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
