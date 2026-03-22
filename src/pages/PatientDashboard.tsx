import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const upcomingSessions = [
  { doctor: "Dr. Amara Osei", date: "Today, 3:00 PM", type: "Video" },
  { doctor: "Dr. Liam Chen", date: "Thu, Mar 26 · 10:00 AM", type: "Audio" },
];

const moodHistory = [
  { day: "Mon", value: 6 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 7 },
  { day: "Thu", value: 6 },
  { day: "Fri", value: 8 },
  { day: "Sat", value: 7 },
  { day: "Today", value: 7 },
];

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 mb-6">
          <img src={logoIcon} alt="TheraCare" className="h-7 w-7" />
          <span className="font-bold text-lg">Thera<span className="text-primary">Care</span></span>
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
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Good afternoon 👋</h1>
                <p className="text-muted-foreground text-sm mt-1">Here's your wellness overview</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-xl relative">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upcoming sessions */}
            <ScrollReveal className="lg:col-span-2" delay={80}>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Upcoming Sessions</h2>
                  <Button variant="ghost" size="sm">View all</Button>
                </div>
                <div className="space-y-3">
                  {upcomingSessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Video className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{s.doctor}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {s.date} · {s.type}
                          </p>
                        </div>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Mood widget */}
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

            {/* Quick actions */}
            <ScrollReveal className="lg:col-span-3" delay={200}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Calendar, label: "Book Session", color: "bg-primary/10 text-primary" },
                  { icon: MessageSquare, label: "Message Therapist", color: "bg-blue-50 text-blue-600" },
                  { icon: BarChart3, label: "View Reports", color: "bg-amber-50 text-amber-600" },
                  { icon: SmilePlus, label: "Track Mood", color: "bg-green-50 text-green-600" },
                ].map((a, i) => (
                  <button
                    key={i}
                    className="glass-card rounded-2xl p-5 text-center hover:shadow-md transition-all active:scale-[0.97]"
                  >
                    <div className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center mx-auto mb-3`}>
                      <a.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
