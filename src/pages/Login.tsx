import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signUp, signIn, user, role } = useAuth();
  const { toast } = useToast();

  const [isSignup, setIsSignup] = useState(location.pathname === "/signup");
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      const dest = { patient: "/patient", doctor: "/doctor", admin: "/admin" };
      navigate(dest[role] || "/", { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSignup) {
      const { error } = await signUp(email, password, selectedRole, displayName);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created", description: "Check your email to verify your account." });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
      // Redirect handled by useEffect
    }

    setSubmitting(false);
  };

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
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedRole === r ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {r === "patient" ? "Patient" : "Clinician"}
                    </button>
                  ))}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignup && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={selectedRole === "patient" ? "Nickname (anonymous)" : "Full name"}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button className="w-full" size="lg" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isSignup ? "Create Account" : "Sign In"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
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
