import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Search, Star, Globe, Filter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { careCoordinator, type DoctorListItem } from "@/lib/careCoordinator";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FindTherapist() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoc, setBookingDoc] = useState<DoctorListItem | null>(null);
  const [bookingType, setBookingType] = useState("video");
  const [bookingWhen, setBookingWhen] = useState("");
  const [bookingConcern, setBookingConcern] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const docs = await careCoordinator.listDoctors();
        if (active) setDoctors(docs);
      } catch (e: any) {
        toast({ title: "Couldn't load therapists", description: e.message, variant: "destructive" });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, toast]);

  const filtered = doctors.filter(
    (t) =>
      (t.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.specialty ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.style ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleBookClick = (doc: DoctorListItem) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (role !== "patient") {
      toast({ title: "Patients only", description: "Sign in as a patient to book a session." });
      return;
    }
    setBookingDoc(doc);
    setBookingType("video");
    setBookingWhen("");
    setBookingConcern("");
  };

  const submitBooking = async () => {
    if (!bookingDoc) return;
    setSubmitting(true);
    try {
      await careCoordinator.bookSession({
        doctor_id: bookingDoc.id,
        session_type: bookingType,
        scheduled_for: bookingWhen ? new Date(bookingWhen).toISOString() : undefined,
        concern: bookingConcern || undefined,
      });
      toast({ title: "Booking requested", description: "The therapist will confirm shortly." });
      setBookingDoc(null);
      navigate("/patient");
    } catch (e: any) {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

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

          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading therapists…
            </div>
          ) : !user ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="mb-4">Please sign in to view available therapists.</p>
              <Button onClick={() => navigate("/login")}>Sign in</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No therapists found yet. Sign up doctors via the “For Doctors” page to populate this list.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 60}>
                  <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {(t.display_name || "T")
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
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
                    <h3 className="font-semibold text-lg">{t.display_name || "Therapist"}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{t.specialty}</p>
                    <p className="text-xs text-muted-foreground mb-3">{t.style}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{" "}
                        {t.rating ?? "—"}
                      </span>
                      <span>{t.sessions_count} sessions</span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" /> {t.languages ?? "English"}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!t.available}
                      onClick={() => handleBookClick(t)}
                    >
                      {t.available ? "Book Session" : "Join Waitlist"}
                    </Button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={!!bookingDoc} onOpenChange={(o) => !o && setBookingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book session with {bookingDoc?.display_name}</DialogTitle>
            <DialogDescription>
              Your booking will be sent to the therapist for confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Session type</Label>
              <Select value={bookingType} onValueChange={setBookingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio only</SelectItem>
                  <SelectItem value="avatar">Avatar (anonymous)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="when">Preferred date & time</Label>
              <Input
                id="when"
                type="datetime-local"
                value={bookingWhen}
                onChange={(e) => setBookingWhen(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concern">What would you like to work on? (optional)</Label>
              <Textarea
                id="concern"
                value={bookingConcern}
                onChange={(e) => setBookingConcern(e.target.value)}
                placeholder="A brief note for your therapist…"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBookingDoc(null)}>
              Cancel
            </Button>
            <Button onClick={submitBooking} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Request booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
