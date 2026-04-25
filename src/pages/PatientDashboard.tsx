import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  MessageSquare,
  BarChart3,
  SmilePlus,
  Clock,
  Video,
  Bell,
  User,
  LogOut,
  Loader2,
  XCircle,
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import { careCoordinator, type SessionRow } from "@/lib/careCoordinator";
import { useToast } from "@/hooks/use-toast";

const moodHistory = [
  { day: "Mon", value: 6 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 7 },
  { day: "Thu", value: 6 },
  { day: "Fri", value: 8 },
  { day: "Sat", value: 7 },
  { day: "Today", value: 7 },
];

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

export default function PatientDashboard() {
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

  const upcoming = sessions.filter((s) => ["pending", "confirmed", "active"].includes(s.status));
  const past = sessions.filter((s) => ["completed", "cancelled"].includes(s.status));

  const handleJoin = (s: SessionRow) => {
    if (!s.channel_name) {
      toast({ title: "Session not ready", description: "Channel not yet assigned." });
      return;
    }
    navigate(`/session-room?channel=${encodeURIComponent(s.channel_name)}&sessionId=${s.id}`);
  };

  const handleCancel = async (s: SessionRow) => {
    try {
      await careCoordinator.updateSessionStatus(s.id, "cancelled");
      toast({ title: "Session cancelled" });
      reload();
    } catch (e: any) {
      toast({ title: "Could not cancel", description: e.message, variant: "destructive" });
    }
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
            { icon: Calendar, label: "Sessions" },
            { icon: MessageSquare, label: "Messages" },
            { icon: SmilePlus, label: "Mood Tracker" },
            { icon: User, label: "Profile" },
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
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
                <h1 className="text-2xl md:text-3xl font-bold">Good afternoon 👋</h1>
                <p className="text-muted-foreground text-sm mt-1">Here's your wellness overview</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/find-therapist">
                    <Calendar className="h-4 w-4 mr-2" /> Book Session
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl relative">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-6">
            <ScrollReveal className="lg:col-span-2" delay={80}>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Upcoming Sessions</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/find-therapist">Book new</Link>
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading…
                  </div>
                ) : upcoming.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No upcoming sessions.{" "}
                    <Link to="/find-therapist" className="text-primary underline">
                      Find a therapist
                    </Link>
                    .
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Video className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {s.counterpart_name || "Therapist"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {s.scheduled_for
                                ? new Date(s.scheduled_for).toLocaleString()
                                : "Time TBD"}{" "}
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
                        </div>
                        <div className="flex gap-2">
                          {(s.status === "confirmed" || s.status === "active") && (
                            <Button size="sm" onClick={() => handleJoin(s)}>
                              Join
                            </Button>
                          )}
                          {s.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancel(s)}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {past.length > 0 && (
                <div className="glass-card rounded-2xl p-6 mt-4">
                  <h2 className="font-semibold mb-4">Past Sessions</h2>
                  <div className="space-y-2">
                    {past.slice(0, 5).map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 text-sm"
                      >
                        <div>
                          <p className="font-medium">{s.counterpart_name || "Therapist"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.created_at).toLocaleDateString()} · {s.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Weekly Mood</h2>
                <div className="flex items-end justify-between gap-1 h-28">
                  {moodHistory.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-lg bg-primary/20 transition-all"
                        style={{ height: `${m.value * 10}%` }}
                      >
                        <div
                          className="w-full rounded-lg bg-primary transition-all"
                          style={{ height: `${m.value * 10}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{m.day}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <SmilePlus className="h-4 w-4" />
                  Log Today's Mood
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-3" delay={200}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    icon: Calendar,
                    label: "Book Session",
                    color: "bg-primary/10 text-primary",
                    to: "/find-therapist",
                  },
                  {
                    icon: MessageSquare,
                    label: "Message Therapist",
                    color: "bg-blue-50 text-blue-600",
                    to: "/patient",
                  },
                  {
                    icon: BarChart3,
                    label: "View Reports",
                    color: "bg-amber-50 text-amber-600",
                    to: "/patient",
                  },
                  {
                    icon: SmilePlus,
                    label: "Track Mood",
                    color: "bg-green-50 text-green-600",
                    to: "/patient",
                  },
                ].map((a, i) => (
                  <Link
                    key={i}
                    to={a.to}
                    className="glass-card rounded-2xl p-5 text-center hover:shadow-md transition-all active:scale-[0.97]"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center mx-auto mb-3`}
                    >
                      <a.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{a.label}</span>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
