import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitRequest } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Circle,
  Clock,
  Fuel,
  MessageCircle,
  Phone,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SERVICES = [
  {
    id: "jump-start",
    name: "Jump Start",
    icon: Zap,
    desc: "Dead battery? We'll get you going fast.",
  },
  {
    id: "fuel-delivery",
    name: "Fuel Delivery",
    icon: Fuel,
    desc: "Ran out of fuel? We'll bring it to you.",
  },
  {
    id: "flat-tyre",
    name: "Flat Tyre",
    icon: Circle,
    desc: "Tyre change or inflation on the spot.",
  },
  {
    id: "towing",
    name: "Towing Service",
    icon: Truck,
    desc: "Safe towing to your chosen destination.",
  },
];

const REVIEWS = [
  {
    name: "Sarah M.",
    text: "Arrived in 20 minutes! Changed my tyre in the rain. Absolutely brilliant service.",
    stars: 5,
  },
  {
    name: "James T.",
    text: "Dead battery on the motorway at midnight. RS Breakdown saved the day. Highly recommend!",
    stars: 5,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choose Service",
    desc: "Select the service you need and fill in your details.",
  },
  {
    step: "02",
    title: "We Dispatch",
    desc: "Our nearest technician is dispatched to your location immediately.",
  },
  {
    step: "03",
    title: "Problem Solved",
    desc: "We arrive within 30 minutes and get you back on the road.",
  },
];

const PHONE = "8377047123";
const WHATSAPP_URL = "https://wa.me/918377047123";

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const submitRequest = useSubmitRequest();

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!selectedService) newErrors.service = "Please select a service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const service = SERVICES.find((s) => s.id === selectedService);
    if (!service) return;
    try {
      await submitRequest.mutateAsync({
        name: form.name,
        phone: form.phone,
        location: form.location,
        service: service.name,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", location: "" });
      setSelectedService(null);
      setErrors({});
      // Notify admin on WhatsApp with request details
      const adminWhatsApp = `https://wa.me/918377047123?text=${encodeURIComponent(`🚨 New Breakdown Request!\n\nName: ${form.name}\nPhone: ${form.phone}\nService: ${service.name}\nLocation: ${form.location}`)}`;
      window.open(adminWhatsApp, "_blank");
    } catch {
      toast.error("Failed to submit request. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-black text-sm sm:text-base uppercase tracking-wide text-foreground">
              RS <span className="text-primary">Breakdown</span> Service
            </span>
          </div>
          <a
            href={`tel:${PHONE}`}
            data-ocid="header.call_button"
            className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm uppercase px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Now</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.005 260) 0%, oklch(0.15 0.01 260) 50%, oklch(0.12 0.008 280) 100%)",
          minHeight: "420px",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.83 0.175 89 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.83 0.175 89 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-40" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 mb-4">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-wide">
                24/7 Emergency Service
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-foreground leading-tight mb-3">
              Immediate
              <br />
              <span className="text-primary">Roadside</span> Assistance
            </h1>
            <p className="text-lg sm:text-xl font-bold text-foreground mb-2">
              🏆 <span className="text-primary">30 Minutes Service</span> or
              Free Visit — Guaranteed
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mb-8">
              Professional breakdown recovery across{" "}
              <span className="text-primary font-bold">Delhi NCR</span>. Fast,
              reliable, affordable.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${PHONE}`}
                data-ocid="hero.call_button"
                className="flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black uppercase text-base px-8 py-4 rounded-lg hover:opacity-90 transition-all hover:shadow-glow min-h-[56px]"
              >
                <Phone className="h-5 w-5" />
                Call Now — {PHONE}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="hero.whatsapp_button"
                className="flex items-center justify-center gap-3 bg-whatsapp text-white font-black uppercase text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity min-h-[56px]"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Services */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground text-center mb-2">
              Our Emergency <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              Select a service to book your request
            </p>
            {errors.service && (
              <p
                className="text-destructive text-center text-sm mb-4"
                data-ocid="service.error_state"
              >
                {errors.service}
              </p>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES.map((service, i) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    onClick={() => {
                      setSelectedService(service.id);
                      setErrors((prev) => ({ ...prev, service: "" }));
                    }}
                    data-ocid={`service.item.${i + 1}`}
                    className={`relative flex flex-col items-center text-center p-5 rounded-xl border-2 transition-all min-h-[140px] hover:border-primary/70 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                    )}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        isSelected ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />
                    </div>
                    <p className="font-black uppercase text-xs sm:text-sm text-foreground mb-1">
                      {service.name}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 hidden sm:block">
                      {service.desc}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Request Form */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground text-center mb-2">
              Request <span className="text-primary">Assistance</span>
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              Fill in your details and we&apos;ll be with you shortly
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  data-ocid="form.success_state"
                  className="bg-card border border-primary/40 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-foreground mb-2">
                    Request Submitted!
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    We&apos;ve received your request and notified our team on
                    WhatsApp. We&apos;ll be with you within 30 minutes.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    data-ocid="form.secondary_button"
                    className="bg-primary text-primary-foreground font-bold uppercase min-h-[56px] w-full"
                  >
                    Submit Another Request
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-card border border-border rounded-xl p-6 space-y-4"
                >
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-bold uppercase text-muted-foreground mb-1.5 block"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      data-ocid="form.input"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground h-14 text-base"
                    />
                    {errors.name && (
                      <p
                        className="text-destructive text-xs mt-1"
                        data-ocid="form.error_state"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-bold uppercase text-muted-foreground mb-1.5 block"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      data-ocid="form.input"
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground h-14 text-base"
                    />
                    {errors.phone && (
                      <p
                        className="text-destructive text-xs mt-1"
                        data-ocid="form.error_state"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="location"
                      className="text-sm font-bold uppercase text-muted-foreground mb-1.5 block"
                    >
                      Your Location
                    </Label>
                    <Input
                      id="location"
                      data-ocid="form.input"
                      placeholder="e.g. Connaught Place, New Delhi"
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground h-14 text-base"
                    />
                    {errors.location && (
                      <p
                        className="text-destructive text-xs mt-1"
                        data-ocid="form.error_state"
                      >
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {selectedService && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center justify-center">
                      <span className="text-sm font-bold text-foreground uppercase">
                        {SERVICES.find((s) => s.id === selectedService)?.name}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="form.submit_button"
                    disabled={submitRequest.isPending}
                    className="w-full bg-primary text-primary-foreground font-black uppercase text-base min-h-[56px] hover:opacity-90 transition-all hover:shadow-glow"
                  >
                    {submitRequest.isPending
                      ? "Submitting..."
                      : "🚨 Submit Request"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Contact Buttons */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground text-center mb-2">
              Need Immediate <span className="text-primary">Help?</span>
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              Contact us directly for the fastest response
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <a
                href={`tel:${PHONE}`}
                data-ocid="contact.call_button"
                className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black uppercase text-base px-6 py-5 rounded-xl hover:opacity-90 transition-all hover:shadow-glow min-h-[56px]"
              >
                <Phone className="h-6 w-6" />
                Call Now
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.whatsapp_button"
                className="flex-1 flex items-center justify-center gap-3 bg-whatsapp text-white font-black uppercase text-base px-6 py-5 rounded-xl hover:opacity-90 transition-opacity min-h-[56px]"
              >
                <MessageCircle className="h-6 w-6" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground text-center mb-8">
              How It <span className="text-primary">Works</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {STEPS.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <div className="text-4xl font-black text-primary/30 mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-black uppercase text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground text-center mb-6">
            Customer <span className="text-primary">Reviews</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.stars }, (_, starIdx) => (
                    <Star
                      key={`star-${review.name}-${starIdx}`}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground text-sm mb-3 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-primary font-bold text-sm">
                  — {review.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="font-black uppercase text-sm text-foreground">
                RS Breakdown Service
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href={`tel:${PHONE}`}
                className="hover:text-primary transition-colors"
              >
                {PHONE}
              </a>
              <a href="/admin" className="hover:text-primary transition-colors">
                Admin
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RS Breakdown Service. Built with ❤️
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
