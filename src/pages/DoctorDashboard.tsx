import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  Video,
  Bell,
  BarChart3,
  CheckCircle2,
  XCircle,
  LogOut,
  Settings,
  Loader2,
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import { careCoordinator, type SessionRow } from "@/lib/careCoordinator";
import { useToast } from "@/hooks/use-toast";

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "confirmed":
      return "bg-blue-50 text-blue-700";
    case "active":
      return "bg-green-50 text-green-700";
    case "completed":
      return "bg-muted text-muted-foreground";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-secondary text-foreground";
  }
}

export default function DoctorDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try {
      const list = await careCoordinator.listMySessions();
      setSessions(list);
    } catch (e: any) {
      toast({ title: "Could not load sessions", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) reload();
  }, [user]);

  const pending = sessions.filter((s) => s.status === "pending");
  const upcoming = sessions.filter((s) => s.status === "confirmed" || s.status === "active");
  const recent = sessions.filter((s) => s.status === "completed").slice(0, 5);

  const todayCount = sessions.filter((s) => {
    if (!s.scheduled_for) return false;
    const d = new Date(s.scheduled_for);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  }).length;
  const uniquePatients = new Set(sessions.map((s) => s.patient_id)).size;

  const updateStatus = async (s: SessionRow, status: string) => {
    try {
      await careCoordinator.updateSessionStatus(s.id, status);
      toast({ title: `Session ${status}` });
      reload();
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    }
  };

  const handleJoin = (s: SessionRow) => {
    if (!s.channel_name) {
      toast({ title: "Channel missing" });
      return;
    }
    navigate(`/session-room?channel=${encodeURIComponent(s.channel_name)}&sessionId=${s.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 mb-6">
          <img src={logoIcon} alt="TheraCare" className="h-7 w-7" />
          <span className="font-bold text-lg">
            Thera<span className="text-primary">Care</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-1">
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Calendar, label: "Schedule" },
            { icon: Users, label: "Patients" },
            { icon: FileText, label: "Reports" },
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
        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your practice and sessions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl relative">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Today's Sessions", value: String(todayCount), icon: Video },
                { label: "Pending Bookings", value: String(pending.length), icon: Clock },
                { label: "Active Patients", value: String(uniquePatients), icon: Users },
                { label: "Completed", value: String(recent.length), icon: FileText },
              ].map((s, i) => (
                <div key={i} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <ScrollReveal delay={100}>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Pending Bookings</h2>
                  {pending.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No pending bookings.</p>
                  ) : (
                    <div className="space-y-3">
                      {pending.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {b.counterpart_name || "Patient"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {b.scheduled_for
                                ? new Date(b.scheduled_for).toLocaleString()
                                : "Time TBD"}{" "}
                              · {b.session_type} · {b.concern || "—"}
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-success hover:bg-green-50"
                              onClick={() => updateStatus(b, "confirmed")}
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:bg-red-50"
                              onClick={() => updateStatus(b, "cancelled")}
                              title="Decline"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-card rounded-2xl p-6 mt-4">
                  <h2 className="font-semibold mb-4">Upcoming Sessions</h2>
                  {upcoming.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No upcoming confirmed sessions.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {s.counterpart_name || "Patient"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.scheduled_for
                                ? new Date(s.scheduled_for).toLocaleString()
                                : "Now"}{" "}
                              · {s.session_type}
                            </p>
                            <span
                              className={`inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${statusBadge(
                                s.status
                              )}`}
                            >
                              {s.status}
                            </span>
                          </div>
                          <Button size="sm" onClick={() => handleJoin(s)}>
                            <Video className="h-4 w-4 mr-1" /> Start
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Recent Sessions</h2>
                  {recent.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No completed sessions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {recent.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {s.counterpart_name || "Patient"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(s.created_at).toLocaleDateString()} · {s.session_type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
