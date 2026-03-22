import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Find a Therapist", href: "/find-therapist" },
  { label: "For Clinicians", href: "/doctor-apply" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = role === "admin" ? "/admin" : role === "doctor" ? "/doctor" : "/patient";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16 max-w-6xl mx-auto px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logoIcon} alt="TheraCare" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground tracking-tight">
            Thera<span className="text-primary">Care</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-reveal">
          <div className="container px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
