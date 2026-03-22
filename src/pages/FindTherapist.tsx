import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Search, Star, Globe, Filter } from "lucide-react";
import { useState } from "react";

const therapists = [
  { name: "Dr. Amara Osei", specialty: "Anxiety & Trauma", style: "CBT", lang: "English, French", rating: 4.9, sessions: 847, available: true },
  { name: "Dr. Liam Chen", specialty: "Depression & Grief", style: "Mindfulness", lang: "English, Mandarin", rating: 4.8, sessions: 632, available: true },
  { name: "Dr. Sofia Reyes", specialty: "Relationships & Self-Esteem", style: "Talk Therapy", lang: "English, Spanish", rating: 4.9, sessions: 1203, available: false },
  { name: "Dr. Kai Nakamura", specialty: "Stress & Burnout", style: "CBT", lang: "English, Japanese", rating: 4.7, sessions: 419, available: true },
  { name: "Dr. Priya Sharma", specialty: "PTSD & Anxiety", style: "EMDR", lang: "English, Hindi", rating: 4.9, sessions: 956, available: true },
  { name: "Dr. Marcus Hale", specialty: "Addiction & Recovery", style: "Motivational", lang: "English", rating: 4.6, sessions: 378, available: true },
];

export default function FindTherapist() {
  const [search, setSearch] = useState("");
  const filtered = therapists.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialty.toLowerCase().includes(search.toLowerCase()) ||
      t.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Therapist</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              All clinicians are licensed, verified, and trained in AI-assisted therapy.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100} className="mb-8">
            <div className="flex items-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or style..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {t.name.split(" ").slice(1).map(n => n[0]).join("")}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        t.available
                          ? "bg-green-50 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.available ? "Available" : "Waitlist"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                  <p className="text-sm text-primary font-medium mb-1">{t.specialty}</p>
                  <p className="text-xs text-muted-foreground mb-3">{t.style}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {t.rating}
                    </span>
                    <span>{t.sessions} sessions</span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {t.lang}
                    </span>
                  </div>

                  <Button size="sm" className="w-full" disabled={!t.available}>
                    {t.available ? "Book Session" : "Join Waitlist"}
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
