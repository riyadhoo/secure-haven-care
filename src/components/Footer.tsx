import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="TheraCare" className="h-7 w-7" />
              <span className="text-lg font-bold tracking-tight">
                Thera<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Safe, private, AI-assisted therapy — on your terms.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link to="/find-therapist" className="hover:text-foreground transition-colors">Find a Therapist</Link></li>
              <li><Link to="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">For Clinicians</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/doctor-apply" className="hover:text-foreground transition-colors">Apply Now</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Doctor Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TheraCare. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            If you're in crisis, call <strong className="text-foreground">988</strong> (Suicide & Crisis Lifeline)
          </p>
        </div>
      </div>
    </footer>
  );
}
