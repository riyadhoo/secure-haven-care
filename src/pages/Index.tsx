import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImg from "@/assets/hero-abstract.jpg";
import {
  Shield,
  Brain,
  Eye,
  Lock,
  MessageSquare,
  Video,
  UserCheck,
  BarChart3,
  ArrowRight,
  Heart,
  Sparkles,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Crisis Detection",
    desc: "Real-time AI monitors sessions for distress signals and activates emergency protocols instantly.",
  },
  {
    icon: Brain,
    title: "Clinical AI Reports",
    desc: "Auto-generated SOAP/DAP notes with emotional progression timelines and treatment recommendations.",
  },
  {
    icon: Eye,
    title: "Full Anonymity",
    desc: "Audio-only, nickname sessions, and avatar mode — therapy without ever revealing your identity.",
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Privacy",
    desc: "End-to-end encryption. Even our admins can't access your sessions or transcripts.",
  },
  {
    icon: MessageSquare,
    title: "Burner Notes",
    desc: "Type what you can't say out loud. Permanently deleted after every session. No trace.",
  },
  {
    icon: BarChart3,
    title: "Sentiment Tracking",
    desc: "Longitudinal emotional analytics help doctors see patterns across sessions.",
  },
];

const steps = [
  {
    num: "01",
    icon: UserCheck,
    title: "Tell us how you feel",
    desc: "A gentle guided questionnaire matches you with verified therapists suited to your needs.",
  },
  {
    num: "02",
    icon: Video,
    title: "Choose your comfort level",
    desc: "Video, audio-only, or avatar mode — you control how visible you want to be.",
  },
  {
    num: "03",
    icon: Heart,
    title: "Start healing",
    desc: "Begin secure sessions with AI-assisted clinical support, on your schedule.",
  },
];

const stats = [
  { value: "256-bit", label: "End-to-end encryption" },
  { value: "< 48h", label: "Average time to first session" },
  { value: "4.8★", label: "Patient satisfaction rating" },
  { value: "100%", label: "Verified licensed clinicians" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container max-w-6xl mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="animate-reveal-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6 tracking-wide uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Assisted Teletherapy
            </div>

            <h1
              className="animate-reveal-up text-4xl md:text-6xl font-bold leading-[1.08] mb-6"
              style={{ animationDelay: "80ms" }}
            >
              Therapy that meets you
              <br />
              <span className="text-gradient">where you are</span>
            </h1>

            <p
              className="animate-reveal-up text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto"
              style={{ animationDelay: "160ms" }}
            >
              Secure, anonymous, clinically intelligent sessions with licensed
              psychologists. Your identity stays yours.
            </p>

            <div
              className="animate-reveal-up flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ animationDelay: "240ms" }}
            >
              <Button size="xl" asChild>
                <Link to="/signup">
                  Begin Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for safety, privacy, and real clinical outcomes
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every feature is designed around what matters most — your wellbeing and your clinician's effectiveness.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 surface-warm">
        <div className="container max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three steps to feeling better
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We removed the friction so you can focus on what matters.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="relative text-center">
                  <div className="text-6xl font-black text-primary/10 mb-4 leading-none">{s.num}</div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* For Clinicians CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="hero-gradient rounded-3xl p-10 md:p-16 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary-foreground/70" />
                <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wide">
                  Now accepting applications
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Licensed therapist? Join TheraCare.
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                AI-powered clinical tools, flexible scheduling, and a platform built
                to support your practice — not complicate it.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/doctor-apply">Apply as a Clinician</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 surface-cool">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              You deserve support on your terms
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
              No judgement. No exposure. Just professional, private, AI-assisted therapy
              — whenever you're ready.
            </p>
            <Button size="xl" asChild>
              <Link to="/signup">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
