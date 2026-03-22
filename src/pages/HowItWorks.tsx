import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { UserCheck, Video, Heart, Shield, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: UserCheck,
    title: "Create your anonymous profile",
    desc: "Choose a nickname, set your preferences, and tell us what you're looking for. No real name required.",
  },
  {
    icon: Brain,
    title: "Get matched with a therapist",
    desc: "Our smart matching system finds verified clinicians based on your needs, language, and therapy style.",
  },
  {
    icon: Video,
    title: "Choose your session format",
    desc: "Full video, audio-only, or avatar mode — you decide how much you reveal.",
  },
  {
    icon: Shield,
    title: "AI monitors your safety",
    desc: "Real-time crisis detection ensures your doctor is alerted instantly if you're in distress.",
  },
  {
    icon: Lock,
    title: "Zero-knowledge privacy",
    desc: "Every session is end-to-end encrypted. Even admins cannot access your data.",
  },
  {
    icon: Heart,
    title: "Track your progress",
    desc: "View AI-generated session summaries, mood trends, and emotional analytics over time.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How TheraCare Works</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              From your first click to ongoing care — here's what to expect.
            </p>
          </ScrollReveal>

          <div className="space-y-8">
            {steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex gap-6 items-start glass-card rounded-2xl p-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Step {i + 1}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-14">
            <Button size="xl" asChild>
              <Link to="/signup">Get Started Now</Link>
            </Button>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
