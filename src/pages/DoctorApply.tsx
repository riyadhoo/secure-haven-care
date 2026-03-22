import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";

export default function DoctorApply() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-xl mx-auto px-4">
          <ScrollReveal className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Join TheraCare as a Clinician</h1>
            <p className="text-muted-foreground">
              Complete your application in a few steps. We'll verify your credentials within 48 hours.
            </p>
          </ScrollReveal>

          {/* Steps indicator */}
          <ScrollReveal delay={80} className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="glass-card rounded-2xl p-6 md:p-8">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg mb-4">Professional Information</h2>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <input className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Dr. Jane Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">License Number</label>
                    <input className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="PSY-XXXXXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Specialty</label>
                    <select className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Anxiety & Depression</option>
                      <option>Trauma & PTSD</option>
                      <option>Relationships</option>
                      <option>Addiction & Recovery</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Years of Experience</label>
                    <input type="number" className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="5" />
                  </div>
                  <Button className="w-full mt-2" onClick={() => setStep(2)}>Continue</Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg mb-4">Credentials & Documents</h2>
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">Upload your license & credentials</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG — max 10MB each</p>
                    <Button variant="outline" size="sm" className="mt-4">Choose Files</Button>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">Government-issued ID</p>
                    <p className="text-xs text-muted-foreground">For identity verification</p>
                    <Button variant="outline" size="sm" className="mt-4">Choose File</Button>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>Continue</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <h2 className="font-semibold text-xl mb-2">Application Submitted</h2>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    We'll review your credentials and get back to you within 48 hours. You'll receive an email with your verification status.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/">Return Home</Link>
                  </Button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
