import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 flex items-center">
        <div className="container max-w-md mx-auto px-4">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1">
                  {isSignup ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isSignup ? "Start your therapy journey" : "Sign in to continue"}
                </p>
              </div>

              {isSignup && (
                <div className="flex rounded-xl bg-muted p-1 mb-6">
                  {(["patient", "doctor"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        role === r ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {r === "patient" ? "Patient" : "Clinician"}
                    </button>
                  ))}
                </div>
              )}

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {isSignup && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={role === "patient" ? "Nickname (anonymous)" : "Full name"}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Password"
                  />
                </div>
                <Button className="w-full" size="lg">
                  {isSignup ? "Create Account" : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="text-center mt-6">
                <button
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
