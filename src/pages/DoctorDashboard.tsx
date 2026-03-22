import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const pendingBookings = [
  { patient: "AnonymousFox", time: "Today, 4:00 PM", type: "Audio", concern: "Anxiety" },
  { patient: "QuietRain_22", time: "Tomorrow, 11:00 AM", type: "Video", concern: "Depression" },
  { patient: "SilentWave", time: "Mar 27, 2:00 PM", type: "Avatar", concern: "Stress" },
];

const recentSessions = [
  { patient: "MorningDew", date: "Mar 20", notes: "SOAP generated", flag: false },
  { patient: "AnonymousFox", date: "Mar 18", notes: "DAP generated", flag: true },
  { patient: "QuietRain_22", date: "Mar 15", notes: "SOAP generated", flag: false },
];

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 mb-6">
          <img src={logoIcon} alt="TheraCare" className="h-7 w-7" />
          <span className="font-bold text-lg">Thera<span className="text-primary">Care</span></span>
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
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary">
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
                <p className="text-muted-foreground text-sm mt-1">Manage your practice and sessions</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl relative">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
                </Button>
                <Button size="sm" asChild>
                  <Link to="/session-room">
                    <Video className="h-4 w-4" />
                    Start Session
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Stats row */}
          <ScrollReveal delay={60}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Today's Sessions", value: "3", icon: Video },
                { label: "Pending Bookings", value: "5", icon: Clock },
                { label: "Active Patients", value: "24", icon: Users },
                { label: "Reports This Week", value: "12", icon: FileText },
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

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending bookings */}
            <ScrollReveal delay={100}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Pending Bookings</h2>
                <div className="space-y-3">
                  {pendingBookings.map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div>
                        <p className="text-sm font-medium">{b.patient}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.time} · {b.type} · {b.concern}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-success hover:bg-green-50">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-red-50">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Recent sessions */}
            <ScrollReveal delay={160}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Recent Sessions</h2>
                <div className="space-y-3">
                  {recentSessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        {s.flag && (
                          <span className="w-2 h-2 rounded-full bg-crisis flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{s.patient}</p>
                          <p className="text-xs text-muted-foreground">{s.date} · {s.notes}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">View Report</Button>
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
